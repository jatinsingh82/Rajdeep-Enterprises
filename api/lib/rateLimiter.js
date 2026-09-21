const memoryStore = /* @__PURE__ */ new Map();
const CLEANUP_INTERVAL_MS = 5 * 60 * 1e3;
let lastCleanup = Date.now();
function cleanupMemoryStore(now, maxAgeMs) {
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
  lastCleanup = now;
  for (const [key, record] of memoryStore.entries()) {
    record.timestamps = record.timestamps.filter((ts) => now - ts < maxAgeMs);
    if (record.timestamps.length === 0) {
      memoryStore.delete(key);
    }
  }
}
function getClientIp(req) {
  const forwarded = req.headers?.["x-forwarded-for"];
  if (forwarded) {
    const first = typeof forwarded === "string" ? forwarded.split(",")[0] : forwarded[0];
    return first.trim();
  }
  const realIp = req.headers?.["x-real-ip"];
  if (typeof realIp === "string") {
    return realIp.trim();
  }
  return req.socket?.remoteAddress || "127.0.0.1";
}
async function checkRateLimit(req, res, options) {
  const ip = getClientIp(req);
  const now = Date.now();
  const key = `ratelimit:${options.endpointName}:${ip}`;
  cleanupMemoryStore(now, options.windowMs);
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  if (redisUrl && redisToken) {
    try {
      const windowStart = now - options.windowMs;
      const pipelineUrl = `${redisUrl}/pipeline`;
      const response = await fetch(pipelineUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${redisToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify([
          ["ZREMRANGEBYSCORE", key, 0, windowStart],
          ["ZADD", key, now, `${now}-${Math.random()}`],
          ["ZCARD", key],
          ["EXPIRE", key, Math.ceil(options.windowMs / 1e3)]
        ])
      });
      if (response.ok) {
        const results = await response.json();
        const requestCount = results[2]?.result ?? 1;
        const remaining2 = Math.max(0, options.maxRequests - requestCount);
        const resetTime2 = Math.ceil((now + options.windowMs) / 1e3);
        res.setHeader("X-RateLimit-Limit", options.maxRequests.toString());
        res.setHeader("X-RateLimit-Remaining", remaining2.toString());
        res.setHeader("X-RateLimit-Reset", resetTime2.toString());
        res.setHeader("X-RateLimit-Provider", "distributed-redis");
        return {
          allowed: requestCount <= options.maxRequests,
          remaining: remaining2,
          resetTime: resetTime2
        };
      }
    } catch {
    }
  }
  let record = memoryStore.get(key);
  if (!record) {
    record = { timestamps: [] };
    memoryStore.set(key, record);
  }
  record.timestamps = record.timestamps.filter((ts) => now - ts < options.windowMs);
  const count = record.timestamps.length;
  const resetTime = Math.ceil((now + options.windowMs) / 1e3);
  if (count >= options.maxRequests) {
    res.setHeader("X-RateLimit-Limit", options.maxRequests.toString());
    res.setHeader("X-RateLimit-Remaining", "0");
    res.setHeader("X-RateLimit-Reset", resetTime.toString());
    res.setHeader("X-RateLimit-Provider", "in-memory-fallback");
    res.setHeader("Retry-After", Math.ceil(options.windowMs / 1e3).toString());
    return { allowed: false, remaining: 0, resetTime };
  }
  record.timestamps.push(now);
  const remaining = options.maxRequests - record.timestamps.length;
  res.setHeader("X-RateLimit-Limit", options.maxRequests.toString());
  res.setHeader("X-RateLimit-Remaining", remaining.toString());
  res.setHeader("X-RateLimit-Reset", resetTime.toString());
  res.setHeader("X-RateLimit-Provider", "in-memory-fallback");
  return { allowed: true, remaining, resetTime };
}
export {
  checkRateLimit,
  getClientIp
};
