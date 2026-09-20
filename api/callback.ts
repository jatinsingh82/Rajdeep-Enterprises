import { handleCors } from './lib/cors.ts';
import { checkRateLimit, getClientIp } from './lib/rateLimiter.ts';
import { validateEnquiryInput } from './lib/validation.ts';
import { persistLead, generateReferenceId, getActivePersistenceProvider } from './lib/persistence.ts';
import { sendNotificationEmail } from './lib/emailService.ts';

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
      endpointName: 'callback',
    });

    if (!rateLimit.allowed) {
      return res.status(429).json({
        success: false,
        error: 'Too many callback requests from this network. Please wait a few minutes or call us directly.',
      });
    }

    // 3. Ensure isCallback is true
    const rawBody = { ...(req.body || {}), isCallback: true };

    // 4. Anti-spam honeypot check
    if (rawBody.website_hp || rawBody.work_phone_hp) {
      return res.status(200).json({
        success: true,
        referenceId: 'CBK-REC-HONEY',
        message: 'Your callback request has been received.',
      });
    }

    // 5. Input Validation
    const validation = validateEnquiryInput(rawBody);
    if (!validation.valid || !validation.data) {
      return res.status(400).json({
        success: false,
        error: validation.errors[0] || 'Invalid input provided.',
        details: validation.errors,
      });
    }

    const leadData = validation.data;
    const clientIp = getClientIp(req);
    const userAgent = (req.headers?.['user-agent'] || '').slice(0, 200);
    const referenceId = generateReferenceId('callback');

    // 6. Optional Database Persistence
    const activeDb = getActivePersistenceProvider();
    if (activeDb) {
      try {
        await persistLead('callback', leadData, { clientIp, userAgent });
      } catch (err: any) {
        console.warn('[Persistence] Background DB persist error:', err?.message);
      }
    }

    // 7. Send Server-Side Email Notification
    const emailResult = await sendNotificationEmail({
      submissionType: 'Callback',
      customerName: leadData.name,
      companyName: leadData.companyName,
      customerPhone: leadData.phone,
      customerEmail: leadData.email,
      deliveryLocation: leadData.siteLocation,
      message: leadData.notes || 'Urgent phone callback requested.',
      submissionReference: referenceId,
      submittedAt: new Date().toISOString(),
      isUrgentCallback: true,
      source: leadData.source || 'callback_api',
    });

    if (!emailResult.success) {
      const isConfigError = emailResult.code === 'SMTP_NOT_CONFIGURED';
      const statusCode = isConfigError ? 503 : 500;
      return res.status(statusCode).json({
        success: false,
        code: emailResult.code || 'EMAIL_DELIVERY_FAILED',
        error:
          'Our email dispatch gateway is momentarily unavailable. Your callback request was not finalized via email. Please connect with our team directly via WhatsApp or Phone.',
        referenceId,
        whatsappDirect: `https://wa.me/919997993895?text=${encodeURIComponent(
          `Hello Rajdeep Enterprises, I requested an urgent callback on your website. Ref: ${referenceId}, Name: ${leadData.name}, Phone: ${leadData.phone}`
        )}`,
        directPhone: '+919997993895',
      });
    }

    return res.status(200).json({
      success: true,
      referenceId,
      callbackId: referenceId,
      message: 'Urgent callback request confirmed. Our procurement specialist will reach out shortly.',
      emailNotified: true,
    });
  } catch (error: any) {
    console.error('[Callback API] Unexpected server error:', error);
    return res.status(500).json({
      success: false,
      error: 'An unexpected internal server error occurred while processing your request.',
    });
  }
}
