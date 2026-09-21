import nodemailer from 'nodemailer';

const ALLOWED_ORIGINS: readonly string[] = [
  'https://rajdeep-enterprises.vercel.app',
  'https://rajdeepenterprises.in',
  'https://www.rajdeepenterprises.in',
];

function handleCors(req: any, res: any): boolean {
  res.setHeader('X-Content-Type-Options', 'nosniff');

  const incomingOrigin = (req.headers?.origin || req.headers?.Origin || '') as string;
  if (!incomingOrigin) {
    return true;
  }

  const trimmedOrigin = incomingOrigin.trim().replace(/\/$/, '');
  const isAllowed =
    ALLOWED_ORIGINS.includes(trimmedOrigin) ||
    (process.env.SITE_URL && trimmedOrigin === process.env.SITE_URL.trim().replace(/\/$/, '')) ||
    (process.env.NODE_ENV !== 'production' &&
      (trimmedOrigin.startsWith('http://localhost:') ||
        trimmedOrigin.startsWith('http://127.0.0.1:') ||
        trimmedOrigin.startsWith('http://0.0.0.0:')));

  if (isAllowed) {
    res.setHeader('Access-Control-Allow-Origin', trimmedOrigin);
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With');
    res.setHeader('Access-Control-Max-Age', '86400');
    res.setHeader('Vary', 'Origin');
  } else {
    res.status(403).json({ success: false, error: 'Origin not allowed by CORS policy.' });
    return false;
  }

  if (req.method === 'OPTIONS') {
    if (typeof res.status(204).end === 'function') {
      res.status(204).end();
    }
    return false;
  }

  return true;
}

function sanitizeText(value: any, maxLength = 200): string {
  if (typeof value !== 'string') return '';
  return value.replace(/[<>]/g, '').trim().slice(0, maxLength);
}

export default async function handler(req: any, res: any) {
  const corsOk = handleCors(req, res);
  if (!corsOk) {
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method Not Allowed. Only POST requests are supported.',
    });
  }

  try {
    const rawBody = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};

    if (rawBody.website_hp || rawBody.work_phone_hp) {
      return res.status(200).json({
        success: true,
        rfqReference: 'RFQ-REC-HONEY',
        message: 'Your RFQ has been received.',
      });
    }

    const contractorName = sanitizeText(rawBody.contractorName || rawBody.name || '', 100);
    const companyName = sanitizeText(rawBody.companyName || rawBody.company || '', 120) || 'Not Specified';
    const phoneNumber = sanitizeText(rawBody.phoneNumber || rawBody.phone || '', 20).replace(/[^0-9+]/g, '');
    const emailAddress = sanitizeText(rawBody.emailAddress || rawBody.email || '', 100);
    const siteLocation = sanitizeText(rawBody.siteLocation || rawBody.location || '', 200) || 'Not Specified';
    const notes = sanitizeText(rawBody.notes || rawBody.message || '', 2000) || 'None';
    const requestMtc = Boolean(rawBody.requestMtc);
    const rfqItems = Array.isArray(rawBody.rfqItems) ? rawBody.rfqItems : [];

    if (!contractorName || contractorName.length < 2) {
      return res.status(500).json({
        success: false,
        error: 'Please provide a valid contractor/contact name (min 2 characters).',
      });
    }

    const digitsOnly = phoneNumber.replace(/\D/g, '');
    if (!digitsOnly || digitsOnly.length < 10) {
      return res.status(500).json({
        success: false,
        error: 'Please provide a valid 10-digit contact mobile number.',
      });
    }

    const year = new Date().getFullYear();
    const rand = Math.random().toString(36).substring(2, 10).toUpperCase();
    const referenceId = `RFQ-${year}-${rand}`;

    const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
    const smtpPort = parseInt(process.env.SMTP_PORT || '587', 10);
    const smtpUser = process.env.SMTP_USER || 'rajdeepenterprises0047@gmail.com';
    const smtpPass = process.env.SMTP_PASS;
    const alertEmailTo = process.env.ALERT_EMAIL_TO || 'rajdeepenterprises0047@gmail.com';

    if (!smtpUser || !smtpPass) {
      console.error('[RFQ] ERROR_STAGE=ENV_CHECK missing credentials');
      return res.status(500).json({
        success: false,
        code: 'SMTP_NOT_CONFIGURED',
        error:
          'Email service is not configured on the server. Please forward your RFQ directly via WhatsApp (+91-9997993895).',
      });
    }

    const isSecure = smtpPort === 465;
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: isSecure,
      requireTLS: !isSecure,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 15000,
    });

    const timestamp = new Date().toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'full',
      timeStyle: 'medium',
    });

    const itemsSummary = rfqItems
      .map((item: any, idx: number) => `  ${idx + 1}. ${item.name || 'Item'} (Qty: ${item.quantity || 1})`)
      .join('\n');

    const textContent = `
=====================================================
NEW RFQ / BILL OF QUANTITIES — RAJDEEP ENTERPRISES
=====================================================

Reference:       ${referenceId}
Timestamp (IST): ${timestamp}

CONTRACTOR / COMPANY DETAILS:
Name:            ${contractorName}
Company:         ${companyName}
Phone:           ${phoneNumber}
Email:           ${emailAddress || 'Not Provided'}
Delivery Site:   ${siteLocation}
MTC Required:    ${requestMtc ? 'YES (Mill Test Certificate Required)' : 'Standard Supply'}

ITEMS IN RFQ (${rfqItems.length}):
${itemsSummary || '  (Custom item requirement detailed in notes)'}

NOTES / SPECIFICATIONS:
${notes}
    `.trim();

    await transporter.sendMail({
      from: `"Rajdeep Enterprises Website" <${smtpUser}>`,
      to: alertEmailTo,
      replyTo: emailAddress ? `"${contractorName}" <${emailAddress}>` : undefined,
      subject: `[RFQ] ${companyName} (${rfqItems.length} Items) - Ref ${referenceId}`,
      text: textContent,
      headers: {
        'X-Entity-Ref-ID': referenceId,
        'X-Submission-Type': 'RFQ',
      },
    });

    return res.status(200).json({
      success: true,
      rfqReference: referenceId,
      message: 'Your Request for Quotation (RFQ) has been delivered successfully.',
      itemCount: rfqItems.length,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error('[RFQ] ERROR_STAGE=EMAIL_DELIVERY_FAILED', err?.message);
    return res.status(500).json({
      success: false,
      error: 'Unable to deliver your RFQ email at this time. Please connect directly via WhatsApp (+91-9997993895).',
    });
  }
}
