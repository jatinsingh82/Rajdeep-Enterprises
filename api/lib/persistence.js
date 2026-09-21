function generateReferenceId(type) {
  const prefix = type === "rfq" ? "RFQ" : type === "callback" ? "CBK" : "ENQ";
  const year = (/* @__PURE__ */ new Date()).getUTCFullYear();
  const randomChars = Math.random().toString(36).substring(2, 7).toUpperCase();
  const timestampShort = Date.now().toString(36).slice(-3).toUpperCase();
  return `${prefix}-${year}-${randomChars}${timestampShort}`;
}
class RedisKVProvider {
  constructor() {
    this.name = "Vercel KV / Upstash Redis";
  }
  isConfigured() {
    const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
    return Boolean(url && token);
  }
  async saveLead(submission) {
    const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
    if (!url || !token) {
      return { success: false, error: "Redis credentials not configured." };
    }
    try {
      const key = `lead:${submission.type}:${submission.id}`;
      const listKey = `leads:${submission.type}`;
      const response = await fetch(`${url}/pipeline`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify([
          ["SET", key, JSON.stringify(submission)],
          ["LPUSH", listKey, submission.id]
        ])
      });
      if (!response.ok) {
        return { success: false, error: `KV Storage HTTP ${response.status}` };
      }
      return { success: true };
    } catch (err) {
      return { success: false, error: err?.message || "Failed to write to KV store." };
    }
  }
}
class WebhookProvider {
  constructor() {
    this.name = "Enterprise Lead Webhook";
  }
  isConfigured() {
    return Boolean(process.env.LEAD_WEBHOOK_URL);
  }
  async saveLead(submission) {
    const webhookUrl = process.env.LEAD_WEBHOOK_URL;
    if (!webhookUrl) {
      return { success: false, error: "LEAD_WEBHOOK_URL not configured." };
    }
    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Rajdeep-Lead-Type": submission.type,
          "X-Rajdeep-Reference-Id": submission.id
        },
        body: JSON.stringify(submission)
      });
      if (!response.ok) {
        return { success: false, error: `Webhook endpoint responded with HTTP ${response.status}` };
      }
      return { success: true };
    } catch (err) {
      return { success: false, error: err?.message || "Failed to forward to webhook endpoint." };
    }
  }
}
class DevMemoryProvider {
  constructor() {
    this.name = "Development In-Memory Store";
  }
  static {
    this.store = [];
  }
  isConfigured() {
    return process.env.NODE_ENV !== "production" && process.env.ENABLE_DEV_MOCK_STORAGE === "true";
  }
  async saveLead(submission) {
    DevMemoryProvider.store.push(submission);
    return { success: true };
  }
}
const providers = [
  new RedisKVProvider(),
  new WebhookProvider(),
  new DevMemoryProvider()
];
function getActivePersistenceProvider() {
  for (const provider of providers) {
    if (provider.isConfigured()) {
      return provider;
    }
  }
  return null;
}
async function persistLead(type, data, meta) {
  const provider = getActivePersistenceProvider();
  if (!provider) {
    return {
      success: false,
      code: "PERSISTENCE_NOT_CONFIGURED",
      error: "Server-side durable lead persistence is not configured. To enable automatic lead recording, please configure KV_REST_API_URL/TOKEN or LEAD_WEBHOOK_URL."
    };
  }
  const id = generateReferenceId(type);
  const submission = {
    id,
    type,
    data,
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    clientIp: meta.clientIp,
    userAgent: meta.userAgent
  };
  try {
    const result = await provider.saveLead(submission);
    if (!result.success) {
      return {
        success: false,
        code: "STORAGE_ERROR",
        error: result.error || "Failed to write lead to database."
      };
    }
    return {
      success: true,
      code: "PERSISTENCE_SUCCESS",
      referenceId: id,
      provider: provider.name
    };
  } catch (err) {
    return {
      success: false,
      code: "STORAGE_ERROR",
      error: err?.message || "Unexpected persistence exception."
    };
  }
}
export {
  generateReferenceId,
  getActivePersistenceProvider,
  persistLead
};
