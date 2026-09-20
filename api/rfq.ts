import { handleCors } from './lib/cors';
import { checkRateLimit, getClientIp } from './lib/rateLimiter';
import { validateRfqInput } from './lib/validation';
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
    // 2. Sliding Window Rate Limiting
    const rateLimit = await checkRateLimit(req, res, {
      windowMs: 10 * 60 * 1000,
      maxRequests: 6,
      endpointName: 'rfq',
    });

    if (!rateLimit.allowed) {
      return res.status(429).json({
        success: false,
        error:
          'Too many RFQ requests submitted from this connection. Please wait a moment or send your Bill of Quantities directly to Rajdeep Enterprises on WhatsApp (+91-9997993895).',
      });
    }

    // 3. Payload Parsing
    const rawBody = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};

    // 4. Honeypot check
    if (rawBody.website_hp || rawBody.work_phone_hp) {
      return res.status(200).json({
        success: true,
        rfqReference: 'RFQ-REC-HONEY',
        message: 'Your RFQ has been received.',
      });
    }

    // 5. Server-Side Input Validation & Sanitization
    const validation = validateRfqInput(rawBody);
    if (!validation.valid || !validation.data) {
      return res.status(400).json({
        success: false,
        error: validation.errors[0] || 'Invalid RFQ parameters provided.',
        details: validation.errors,
      });
    }

    const clientIp = getClientIp(req);
    const userAgent = (req.headers?.['user-agent'] || '').slice(0, 200);

    // 6. Real Server-Side Persistence
    const persistenceResult = await persistLead('rfq', validation.data, {
      clientIp,
      userAgent,
    });

    if (!persistenceResult.success) {
      const httpStatus = persistenceResult.code === 'PERSISTENCE_NOT_CONFIGURED' ? 503 : 500;
      return res.status(httpStatus).json({
        success: false,
        code: persistenceResult.code || 'STORAGE_ERROR',
        error:
          persistenceResult.code === 'PERSISTENCE_NOT_CONFIGURED'
            ? 'Server lead persistence is currently not configured. Your RFQ was not saved. Please send your Bill of Quantities directly to Rajdeep Enterprises on WhatsApp (+91 99979 93895) or Call.'
            : 'Unable to save your RFQ to the database at this moment. Please forward your list directly to Rajdeep Enterprises via WhatsApp or Call.',
      });
    }

    // 7. Confirmed Persistence Response
    return res.status(200).json({
      success: true,
      code: 'PERSISTENCE_SUCCESS',
      rfqReference: persistenceResult.referenceId,
      message:
        'Your Request for Quotation (RFQ) has been securely logged on our server. Our commercial desk will review your items and send a competitive GST estimate.',
      itemCount: validation.data.items.length,
      timestamp: new Date().toISOString(),
    });
  } catch {
    return res.status(500).json({
      success: false,
      error:
        'A server error occurred while processing your RFQ. Please connect with Rajdeep Enterprises directly on WhatsApp (+91-9997993895) or Call.',
    });
  }
}
