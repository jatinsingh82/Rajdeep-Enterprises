import { handleCors } from './lib/cors.js';
import { checkRateLimit, getClientIp } from './lib/rateLimiter.js';
import { validateRfqInput } from './lib/validation.js';
import { persistLead, generateReferenceId, getActivePersistenceProvider } from './lib/persistence.js';
import { sendNotificationEmail } from './lib/emailService.js';

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

    // 6. Generate Unique Collision-Resistant Reference ID
    const referenceId = generateReferenceId('rfq');

    // 7. Optional Database Persistence (if configured)
    const activeDb = getActivePersistenceProvider();
    if (activeDb) {
      try {
        await persistLead('rfq', validation.data, { clientIp, userAgent });
      } catch (err: any) {
        console.warn('[Persistence] Background RFQ DB persist error:', err?.message);
      }
    }

    // 8. Server-Side Gmail SMTP Email Notification to rajdeepenterprises0047@gmail.com
    const emailResult = await sendNotificationEmail({
      submissionType: 'RFQ',
      customerName: validation.data.name,
      companyName: validation.data.companyName,
      customerEmail: validation.data.email,
      customerPhone: validation.data.phone,
      productName: `${validation.data.items.length} Products in Bill of Quantities`,
      deliveryLocation: validation.data.deliverySite,
      message: validation.data.notes,
      submissionReference: referenceId,
      submittedAt: new Date().toISOString(),
      items: validation.data.items,
      requestMtc: validation.data.requestMtc,
      source: validation.data.source,
    });

    // 9. Fail-Closed Error Handling: Never show fake success if email delivery fails
    if (!emailResult.success) {
      const isConfigError = emailResult.code === 'SMTP_NOT_CONFIGURED';
      const statusCode = isConfigError ? 503 : 500;
      return res.status(statusCode).json({
        success: false,
        code: emailResult.code || 'EMAIL_DELIVERY_FAILED',
        error: isConfigError
          ? 'The notification service is currently undergoing configuration on the server. Your RFQ could not be emailed. Please send your Bill of Quantities directly to Rajdeep Enterprises on WhatsApp (+91 99979 93895) or Call.'
          : 'Unable to deliver your RFQ notification via email at this moment. Please forward your list directly to Rajdeep Enterprises via WhatsApp (+91 99979 93895) or Call.',
        whatsappDirect: `https://wa.me/919997993895?text=${encodeURIComponent(
          `*Direct RFQ (${validation.data.items.length} items)*\nContractor: ${validation.data.name}\nPhone: ${validation.data.phone}`
        )}`,
      });
    }

    // 10. Successful Confirmed Delivery
    return res.status(200).json({
      success: true,
      code: 'SUBMISSION_SUCCESS',
      rfqReference: referenceId,
      message:
        'Your Request for Quotation (RFQ) notification has been delivered directly to Rajdeep Enterprises (rajdeepenterprises0047@gmail.com). Our commercial desk will review your items and send a competitive GST estimate.',
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
