import { handleCors } from './lib/cors';
import { checkRateLimit, getClientIp } from './lib/rateLimiter';
import { validateEnquiryInput } from './lib/validation';
import { persistLead } from './lib/persistence';

export default async function handler(req: any, res: any) {
  // 1. Strict CORS & Preflight validation
  const corsProceed = handleCors(req, res);
  if (!corsProceed) {
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method Not Allowed. Only POST requests are supported.',
    });
  }

  try {
    // 2. Sliding Window Rate Limiting (Durable Redis or in-process fallback)
    const rateLimit = await checkRateLimit(req, res, {
      windowMs: 10 * 60 * 1000,
      maxRequests: 6,
      endpointName: 'enquiry',
    });

    if (!rateLimit.allowed) {
      return res.status(429).json({
        success: false,
        error:
          'Too many enquiry requests submitted from this connection. Please wait a few moments or contact Rajdeep Enterprises directly via WhatsApp (+91-9997993895) or Phone.',
      });
    }

    // 3. Payload Parsing
    const rawBody = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};

    // 4. Honeypot spam trap
    if (rawBody.website_hp || rawBody.work_phone_hp) {
      return res.status(200).json({
        success: true,
        enquiryId: 'ENQ-REC-HONEY',
        message: 'Your enquiry has been received.',
      });
    }

    // 5. Server-Side Input Validation & Sanitization
    const validation = validateEnquiryInput(rawBody);
    if (!validation.valid || !validation.data) {
      return res.status(400).json({
        success: false,
        error: validation.errors[0] || 'Invalid input provided.',
        details: validation.errors,
      });
    }

    const clientIp = getClientIp(req);
    const userAgent = (req.headers?.['user-agent'] || '').slice(0, 200);

    // 6. Real Server-Side Persistence
    const persistenceResult = await persistLead('enquiry', validation.data, {
      clientIp,
      userAgent,
    });

    if (!persistenceResult.success) {
      // If server-side storage is not configured or failed, do NOT fake success
      const httpStatus = persistenceResult.code === 'PERSISTENCE_NOT_CONFIGURED' ? 503 : 500;
      return res.status(httpStatus).json({
        success: false,
        code: persistenceResult.code || 'STORAGE_ERROR',
        error:
          persistenceResult.code === 'PERSISTENCE_NOT_CONFIGURED'
            ? 'Server lead persistence is currently not configured. Your enquiry was not saved. Please contact Rajdeep Enterprises directly via WhatsApp (+91 99979 93895) or Call.'
            : 'Unable to save your enquiry to the database at this moment. Please contact Rajdeep Enterprises directly via WhatsApp or Call.',
      });
    }

    // 7. Confirmed Persistence Response
    return res.status(200).json({
      success: true,
      code: 'PERSISTENCE_SUCCESS',
      enquiryId: persistenceResult.referenceId,
      message:
        'Your enquiry has been securely logged on our server. Our proprietor / sales executive will reach out with the best GST quotation shortly.',
      timestamp: new Date().toISOString(),
    });
  } catch {
    // Production safety: Never leak stack traces, internal paths, or environment variables
    return res.status(500).json({
      success: false,
      error:
        'A server error occurred while processing your enquiry. Please reach out to Rajdeep Enterprises directly on WhatsApp (+91-9997993895) or Call.',
    });
  }
}
