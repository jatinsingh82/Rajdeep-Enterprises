/**
 * Rate Limiting Service
 *
 * Implements sliding-window rate limiting for public endpoints.
 * Supports Upstash Redis / Vercel KV when configured via environment variables.
 * Falls back to an in-process sliding window when external distributed storage is absent,
 * and sets appropriate audit headers.
 *
 * Required environment variables for distributed production rate-limiting:
 * - UPSTASH_REDIS_REST_URL
 * - UPSTASH_REDIS_REST_TOKEN
 * or
 * - KV_REST_API_URL
 * - KV_REST_API_TOKEN
 */

export interface RateLimitOptions {
  windowMs: number;
  maxRequests: number;
  endpointName: string;
}

interface InMemoryRecord {
  timestamps: number[];
}

const memoryStore = new Map<string, InMemoryRecord>();

// Periodic cleanup of stale memory records every 5 minutes
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000;
let lastCleanup = Date.now();

function cleanupMemoryStore(now: number, maxAgeMs: number) {
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
  lastCleanup = now;
  for (const [key, record] of memoryStore.entries()) {
    record.timestamps = record.timestamps.filter((ts) => now - ts < maxAgeMs);
    if (record.timestamps.length === 0) {
      memoryStore.delete(key);
    }
  }
}

export function getClientIp(req: any): string {
  const forwarded = req.headers?.['x-forwarded-for'];
  if (forwarded) {
    const first = typeof forwarded === 'string' ? forwarded.split(',')[0] : forwarded[0];
    return first.trim();
  }
  const realIp = req.headers?.['x-real-ip'];
  if (typeof realIp === 'string') {
    return realIp.trim();
  }
  return req.socket?.remoteAddress || '127.0.0.1';
}

export async function checkRateLimit(
  req: any,
  res: any,
  options: RateLimitOptions
): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
  const ip = getClientIp(req);
  const now = Date.now();
  const key = `ratelimit:${options.endpointName}:${ip}`;

  cleanupMemoryStore(now, options.windowMs);

  // Check if Upstash Redis / Vercel KV is configured
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

  if (redisUrl && redisToken) {
    try {
      // Execute distributed sliding-window pipeline via Upstash REST API
      const windowStart = now - options.windowMs;
      const pipelineUrl = `${redisUrl}/pipeline`;

      const response = await fetch(pipelineUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${redisToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([
          ['ZREMRANGEBYSCORE', key, 0, windowStart],
          ['ZADD', key, now, `${now}-${Math.random()}`],
          ['ZCARD', key],
          ['EXPIRE', key, Math.ceil(options.windowMs / 1000)],
        ]),
      });

      if (response.ok) {
        const results = await response.json();
        const requestCount = results[2]?.result ?? 1;
        const remaining = Math.max(0, options.maxRequests - requestCount);
        const resetTime = Math.ceil((now + options.windowMs) / 1000);

        res.setHeader('X-RateLimit-Limit', options.maxRequests.toString());
        res.setHeader('X-RateLimit-Remaining', remaining.toString());
        res.setHeader('X-RateLimit-Reset', resetTime.toString());
        res.setHeader('X-RateLimit-Provider', 'distributed-redis');

        return {
          allowed: requestCount <= options.maxRequests,
          remaining,
          resetTime,
        };
      }
    } catch {
      // Fallback to in-memory on transient Redis connectivity failure
    }
  }

  // Fallback: In-memory sliding window
  let record = memoryStore.get(key);
  if (!record) {
    record = { timestamps: [] };
    memoryStore.set(key, record);
  }

  // Remove timestamps outside window
  record.timestamps = record.timestamps.filter((ts) => now - ts < options.windowMs);
  const count = record.timestamps.length;
  const resetTime = Math.ceil((now + options.windowMs) / 1000);

  if (count >= options.maxRequests) {
    res.setHeader('X-RateLimit-Limit', options.maxRequests.toString());
    res.setHeader('X-RateLimit-Remaining', '0');
    res.setHeader('X-RateLimit-Reset', resetTime.toString());
    res.setHeader('X-RateLimit-Provider', 'in-memory-fallback');
    res.setHeader('Retry-After', Math.ceil(options.windowMs / 1000).toString());

    return { allowed: false, remaining: 0, resetTime };
  }

  record.timestamps.push(now);
  const remaining = options.maxRequests - record.timestamps.length;

  res.setHeader('X-RateLimit-Limit', options.maxRequests.toString());
  res.setHeader('X-RateLimit-Remaining', remaining.toString());
  res.setHeader('X-RateLimit-Reset', resetTime.toString());
  res.setHeader('X-RateLimit-Provider', 'in-memory-fallback');

  return { allowed: true, remaining, resetTime };
}
