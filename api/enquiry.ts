import { handleCors } from './lib/cors';
import { checkRateLimit, getClientIp } from './lib/rateLimiter';
import { validateEnquiryInput } from './lib/validation';
import { persistLead, generateReferenceId, getActivePersistenceProvider } from './lib/persistence';
import { sendNotificationEmail, NotificationEmailPayload } from './lib/emailService';

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

    // 6. Generate Unique Collision-Resistant Reference ID
    const refType = validation.data.isCallback ? 'callback' : 'enquiry';
    const referenceId = generateReferenceId(refType);

    // Determine Submission Type
    let submissionType: NotificationEmailPayload['submissionType'] = 'Enquiry';
    if (validation.data.isCallback) {
      submissionType = 'Callback';
    } else if (rawBody.source === 'contact_form' || validation.data.category === 'Contact Form') {
      submissionType = 'Contact';
    } else if (validation.data.productName && !validation.data.productName.toLowerCase().includes('general')) {
      submissionType = 'Quote';
    }

    // 7. Optional Database Persistence (if configured)
    const activeDb = getActivePersistenceProvider();
    if (activeDb) {
      try {
        await persistLead('enquiry', validation.data, { clientIp, userAgent });
      } catch (err: any) {
        console.warn('[Persistence] Background DB persist error:', err?.message);
      }
    }

    // 8. Server-Side Gmail SMTP Email Notification to rajdeepenterprises0047@gmail.com
    const emailResult = await sendNotificationEmail({
      submissionType,
      customerName: validation.data.name,
      companyName: validation.data.companyName,
      customerEmail: validation.data.email,
      customerPhone: validation.data.phone,
      productName: validation.data.productName,
      productCode: rawBody.productCode || rawBody.sku || 'N/A',
      category: validation.data.category,
      quantity: validation.data.quantity,
      deliveryLocation: validation.data.siteLocation,
      message: validation.data.notes,
      submissionReference: referenceId,
      submittedAt: new Date().toISOString(),
      isUrgentCallback: validation.data.isCallback,
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
          ? 'The notification service is currently undergoing configuration on the server. Your enquiry could not be emailed. Please contact Rajdeep Enterprises directly via WhatsApp (+91 99979 93895) or Call.'
          : 'Unable to deliver your enquiry notification via email at this moment. Please reach out to Rajdeep Enterprises directly via WhatsApp (+91 99979 93895) or Call.',
        whatsappDirect: `https://wa.me/919997993895?text=${encodeURIComponent(
          `*Direct Enquiry: ${validation.data.productName}*\nCustomer: ${validation.data.name}\nPhone: ${validation.data.phone}`
        )}`,
      });
    }

    // 10. Successful Confirmed Delivery
    return res.status(200).json({
      success: true,
      code: 'SUBMISSION_SUCCESS',
      enquiryId: referenceId,
      message:
        'Your enquiry notification has been delivered directly to Rajdeep Enterprises (rajdeepenterprises0047@gmail.com). Our team will review your requirement and reach out shortly.',
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
