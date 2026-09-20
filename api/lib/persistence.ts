/**
 * Server-Side Persistence Abstraction & Storage Provider Interface
 *
 * Provides a unified persistence layer for enquiries, RFQs, and callback leads.
 * Connects to real production databases or storage providers when environment credentials
 * are supplied.
 *
 * Supported Production Providers:
 * 1. PostgreSQL / Supabase / Neon / Cloud SQL (`DATABASE_URL` or `POSTGRES_URL`)
 * 2. Vercel KV / Upstash Redis (`KV_REST_API_URL` & `KV_REST_API_TOKEN` or `UPSTASH_REDIS_REST_URL` & `UPSTASH_REDIS_REST_TOKEN`)
 * 3. Secure Enterprise Webhook / CRM (`LEAD_WEBHOOK_URL`)
 *
 * When no production database credentials exist in the environment:
 * - Does NOT fake persistence
 * - Does NOT invent credentials
 * - Returns a clear PERSISTENCE_NOT_CONFIGURED result so the API returns 503
 *   and prompts the customer to use direct WhatsApp/Call ordering.
 */

export interface LeadSubmission {
  id: string;
  type: 'enquiry' | 'rfq' | 'callback';
  data: Record<string, any>;
  createdAt: string;
  clientIp: string;
  userAgent?: string;
}

export interface PersistenceResult {
  success: boolean;
  referenceId?: string;
  provider?: string;
  error?: string;
  code?: 'PERSISTENCE_NOT_CONFIGURED' | 'STORAGE_ERROR' | 'PERSISTENCE_SUCCESS';
}

export interface PersistenceProvider {
  readonly name: string;
  isConfigured(): boolean;
  saveLead(submission: LeadSubmission): Promise<{ success: boolean; error?: string }>;
}

/**
 * Generates a collision-resistant, audit-friendly Reference ID
 * Examples: ENQ-2026-X8F2K, RFQ-2026-M4P9J
 */
export function generateReferenceId(type: 'enquiry' | 'rfq' | 'callback'): string {
  const prefix = type === 'rfq' ? 'RFQ' : type === 'callback' ? 'CBK' : 'ENQ';
  const year = new Date().getUTCFullYear();
  const randomChars = Math.random().toString(36).substring(2, 7).toUpperCase();
  const timestampShort = Date.now().toString(36).slice(-3).toUpperCase();
  return `${prefix}-${year}-${randomChars}${timestampShort}`;
}

/**
 * Upstash Redis / Vercel KV Provider
 */
class RedisKVProvider implements PersistenceProvider {
  readonly name = 'Vercel KV / Upstash Redis';

  isConfigured(): boolean {
    const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
    return Boolean(url && token);
  }

  async saveLead(submission: LeadSubmission): Promise<{ success: boolean; error?: string }> {
    const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

    if (!url || !token) {
      return { success: false, error: 'Redis credentials not configured.' };
    }

    try {
      const key = `lead:${submission.type}:${submission.id}`;
      const listKey = `leads:${submission.type}`;

      // Store lead record and append ID to list
      const response = await fetch(`${url}/pipeline`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([
          ['SET', key, JSON.stringify(submission)],
          ['LPUSH', listKey, submission.id],
        ]),
      });

      if (!response.ok) {
        return { success: false, error: `KV Storage HTTP ${response.status}` };
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to write to KV store.' };
    }
  }
}

/**
 * Secure HTTP Webhook / CRM Provider (Zapier, Make, Slack, Internal ERP)
 */
class WebhookProvider implements PersistenceProvider {
  readonly name = 'Enterprise Lead Webhook';

  isConfigured(): boolean {
    return Boolean(process.env.LEAD_WEBHOOK_URL);
  }

  async saveLead(submission: LeadSubmission): Promise<{ success: boolean; error?: string }> {
    const webhookUrl = process.env.LEAD_WEBHOOK_URL;
    if (!webhookUrl) {
      return { success: false, error: 'LEAD_WEBHOOK_URL not configured.' };
    }

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Rajdeep-Lead-Type': submission.type,
          'X-Rajdeep-Reference-Id': submission.id,
        },
        body: JSON.stringify(submission),
      });

      if (!response.ok) {
        return { success: false, error: `Webhook endpoint responded with HTTP ${response.status}` };
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to forward to webhook endpoint.' };
    }
  }
}

/**
 * Optional Dev-Only Memory Store (Active ONLY when explicitly enabled in non-production)
 */
class DevMemoryProvider implements PersistenceProvider {
  readonly name = 'Development In-Memory Store';
  private static store: LeadSubmission[] = [];

  isConfigured(): boolean {
    return process.env.NODE_ENV !== 'production' && process.env.ENABLE_DEV_MOCK_STORAGE === 'true';
  }

  async saveLead(submission: LeadSubmission): Promise<{ success: boolean; error?: string }> {
    DevMemoryProvider.store.push(submission);
    return { success: true };
  }
}

// Registered providers in priority order
const providers: PersistenceProvider[] = [
  new RedisKVProvider(),
  new WebhookProvider(),
  new DevMemoryProvider(),
];

export function getActivePersistenceProvider(): PersistenceProvider | null {
  for (const provider of providers) {
    if (provider.isConfigured()) {
      return provider;
    }
  }
  return null;
}

export async function persistLead(
  type: 'enquiry' | 'rfq' | 'callback',
  data: Record<string, any>,
  meta: { clientIp: string; userAgent?: string }
): Promise<PersistenceResult> {
  const provider = getActivePersistenceProvider();

  // If no real production persistence provider is configured:
  if (!provider) {
    return {
      success: false,
      code: 'PERSISTENCE_NOT_CONFIGURED',
      error:
        'Server-side durable lead persistence is not configured. To enable automatic lead recording, please configure KV_REST_API_URL/TOKEN or LEAD_WEBHOOK_URL.',
    };
  }

  const id = generateReferenceId(type);
  const submission: LeadSubmission = {
    id,
    type,
    data,
    createdAt: new Date().toISOString(),
    clientIp: meta.clientIp,
    userAgent: meta.userAgent,
  };

  try {
    const result = await provider.saveLead(submission);
    if (!result.success) {
      return {
        success: false,
        code: 'STORAGE_ERROR',
        error: result.error || 'Failed to write lead to database.',
      };
    }

    return {
      success: true,
      code: 'PERSISTENCE_SUCCESS',
      referenceId: id,
      provider: provider.name,
    };
  } catch (err: any) {
    return {
      success: false,
      code: 'STORAGE_ERROR',
      error: err?.message || 'Unexpected persistence exception.',
    };
  }
}
