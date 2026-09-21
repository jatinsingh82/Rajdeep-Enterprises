import nodemailer from 'nodemailer';

/**
 * Strict Production CORS Configuration
 * Only genuine production domains and local development are permitted.
 */
const ALLOWED_ORIGINS: readonly string[] = [
  'https://rajdeep-enterprises.vercel.app',
  'https://rajdeepenterprises.in',
  'https://www.rajdeepenterprises.in',
];

function handleCors(req: any, res: any): boolean {
  res.setHeader('X-Content-Type-Options', 'nosniff');

  const incomingOrigin = (req.headers?.origin || req.headers?.Origin || '') as string;
  if (!incomingOrigin) {
    // Same-origin or non-browser request
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
  return value
    .replace(/[<>]/g, '')
    .trim()
    .slice(0, maxLength);
}

function validateEmail(email: string): boolean {
  if (!email) return false;
  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
}

function generateReferenceId(isCallback: boolean): string {
  const prefix = isCallback ? 'CBK' : 'ENQ';
  const year = new Date().getFullYear();
  const rand = Math.random().toString(36).substring(2, 10).toUpperCase();
  return `${prefix}-${year}-${rand}`;
}

export default async function handler(req: any, res: any) {
  let currentStage = 'REQUEST_RECEIVED';

  // 1. CORS check
  const corsOk = handleCors(req, res);
  if (!corsOk) {
    return;
  }

  // 2. Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method Not Allowed. Only POST requests are supported.',
    });
  }

  console.info(`[Enquiry] STAGE=REQUEST_RECEIVED method=${req.method}`);

  try {
    // 3. Parse and sanitize payload
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};

    // Anti-spam honeypot
    if (body.website_hp || body.work_phone_hp) {
      return res.status(200).json({
        success: true,
        referenceId: 'ENQ-REC-HONEY',
        enquiryId: 'ENQ-REC-HONEY',
        message: 'Your enquiry has been received.',
      });
    }

    const isCallback = Boolean(body.isCallback);
    const submissionType = isCallback ? 'Callback Request' : 'Quote Enquiry';

    const name = sanitizeText(body.fullName || body.name || '', 100);
    const company = sanitizeText(body.companyName || body.company || '', 120) || 'Not Specified';
    const phone = sanitizeText(body.phoneNumber || body.phone || '', 20).replace(/[^0-9+]/g, '');
    const email = sanitizeText(body.emailAddress || body.email || '', 100);
    const category = sanitizeText(body.category || 'General Industrial Supplies', 100);
    const product = sanitizeText(
      body.productRequirement || body.requirement || body.productName || (isCallback ? 'Immediate Telephonic Callback' : ''),
      250
    );
    const quantity = sanitizeText(body.quantity || '1', 50);
    const deliveryLocation = sanitizeText(
      body.deliveryLocation || body.siteLocation || body.location || '',
      200
    ) || 'Not Specified';
    const notes = sanitizeText(body.notes || body.message || '', 2000) || 'None provided';

    // 4. Validate required fields
    if (!name || name.length < 2) {
      console.warn('[Enquiry] ERROR_STAGE=VALIDATION_FAILED code=INVALID_NAME');
      return res.status(500).json({
        success: false,
        error: 'Please provide a valid full name (at least 2 characters).',
      });
    }

    const digitsOnly = phone.replace(/\D/g, '');
    if (!digitsOnly || digitsOnly.length < 10 || digitsOnly.length > 15) {
      console.warn('[Enquiry] ERROR_STAGE=VALIDATION_FAILED code=INVALID_PHONE');
      return res.status(500).json({
        success: false,
        error: 'Please provide a valid 10-digit mobile number for dispatch & billing.',
      });
    }

    if (!isCallback && (!product || product.length < 2)) {
      console.warn('[Enquiry] ERROR_STAGE=VALIDATION_FAILED code=INVALID_PRODUCT');
      return res.status(500).json({
        success: false,
        error: 'Please specify the industrial product or materials required.',
      });
    }

    if (email && !validateEmail(email)) {
      console.warn('[Enquiry] ERROR_STAGE=VALIDATION_FAILED code=INVALID_EMAIL');
      return res.status(500).json({
        success: false,
        error: 'The provided email address format is invalid.',
      });
    }

    currentStage = 'VALIDATION_PASSED';
    const referenceId = generateReferenceId(isCallback);
    console.info(`[Enquiry] STAGE=VALIDATION_PASSED referenceId=${referenceId} submissionType=${submissionType}`);

    // 5. Environment & Credentials Verification
    currentStage = 'ENV_CHECK_PASSED';
    const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
    const smtpPort = parseInt(process.env.SMTP_PORT || '587', 10);
    const smtpUser = process.env.SMTP_USER || 'rajdeepenterprises0047@gmail.com';
    const smtpPass = process.env.SMTP_PASS;
    const alertEmailTo = process.env.ALERT_EMAIL_TO || 'rajdeepenterprises0047@gmail.com';

    const hasUser = Boolean(smtpUser);
    const hasPass = Boolean(smtpPass);

    if (!hasUser || !hasPass) {
      console.error(
        `[Enquiry] ERROR_STAGE=ENV_CHECK missing credentials (hasUser=${hasUser}, hasPass=${hasPass}, host=${smtpHost}, port=${smtpPort})`
      );
      return res.status(500).json({
        success: false,
        code: 'SMTP_NOT_CONFIGURED',
        error: 'Email service configuration is pending on the server. Please contact Rajdeep Enterprises directly at +91-9997993895 or via WhatsApp.',
      });
    }

    console.info(
      `[Enquiry] STAGE=ENV_CHECK_PASSED (host=${smtpHost}, port=${smtpPort}, hasUser=${hasUser}, hasPass=true, alertTo=${alertEmailTo})`
    );

    // 6. Transporter Initialization
    currentStage = 'TRANSPORTER_CREATED';
    const isSecure = smtpPort === 465;
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: isSecure,
      requireTLS: !isSecure, // Strict STARTTLS for port 587
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 15000,
    });

    console.info(
      `[Enquiry] STAGE=TRANSPORTER_CREATED host=${smtpHost} port=${smtpPort} secure=${isSecure} requireTLS=${!isSecure}`
    );

    // 7. Format Email & Dispatch
    currentStage = 'EMAIL_SEND_STARTED';
    console.info(`[Enquiry] STAGE=EMAIL_SEND_STARTED referenceId=${referenceId} submissionType=${submissionType}`);

    const timestamp = new Date().toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'full',
      timeStyle: 'medium',
    });

    const textContent = `
=====================================================
NEW ${submissionType.toUpperCase()} — RAJDEEP ENTERPRISES
=====================================================

Reference ID:      ${referenceId}
Submission Type:   ${submissionType}
Timestamp (IST):   ${timestamp}

CUSTOMER DETAILS:
-----------------------------------------------------
Customer Name:     ${name}
Company / Firm:    ${company}
Phone Number:      ${phone}
Email Address:     ${email || 'Not Provided'}

REQUIREMENT DETAILS:
-----------------------------------------------------
Category:          ${category}
Product Required:  ${product}
Quantity:          ${quantity}
Delivery Location: ${deliveryLocation}

REQUIREMENT NOTES / MESSAGE:
-----------------------------------------------------
${notes}

=====================================================
Direct Reply:      ${email ? `Reply to this email to reach ${name} (${email})` : 'Contact by phone/WhatsApp'}
Rajdeep Enterprises • Industrial Safety & Petroleum Hardware
    `.trim();

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>New Industrial Enquiry - ${referenceId}</title>
</head>
<body style="margin:0;padding:24px;background-color:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#0f172a;">
  <div style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #cbd5e1;border-radius:8px;overflow:hidden;box-shadow:0 4px 6px -1px rgba(0,0,0,0.1);">
    
    <!-- Header Banner -->
    <div style="background-color:#0f172a;padding:24px 28px;border-bottom:4px solid #f97316;">
      <div style="font-size:12px;font-weight:700;letter-spacing:1px;color:#f97316;text-transform:uppercase;margin-bottom:4px;">
        Official Website Notification
      </div>
      <h1 style="margin:0;font-size:22px;color:#ffffff;font-weight:700;">
        New ${submissionType}: ${referenceId}
      </h1>
      <p style="margin:6px 0 0;font-size:13px;color:#94a3b8;">
        Submitted on ${timestamp} (IST)
      </p>
    </div>

    <div style="padding:28px;">

      <!-- Primary Customer Information -->
      <h2 style="margin:0 0 14px;font-size:15px;color:#0f172a;text-transform:uppercase;letter-spacing:0.5px;border-bottom:2px solid #e2e8f0;padding-bottom:6px;">
        1. Customer Information
      </h2>
      <table style="width:100%;border-collapse:collapse;margin-bottom:24px;font-size:14px;">
        <tr>
          <td style="padding:8px 12px;background:#f8fafc;font-weight:600;width:35%;border:1px solid #e2e8f0;">Customer Name</td>
          <td style="padding:8px 12px;border:1px solid #e2e8f0;font-weight:700;color:#0f172a;">${name}</td>
        </tr>
        <tr>
          <td style="padding:8px 12px;background:#f8fafc;font-weight:600;border:1px solid #e2e8f0;">Company / Firm</td>
          <td style="padding:8px 12px;border:1px solid #e2e8f0;color:#334155;">${company}</td>
        </tr>
        <tr>
          <td style="padding:8px 12px;background:#f8fafc;font-weight:600;border:1px solid #e2e8f0;">Phone Number</td>
          <td style="padding:8px 12px;border:1px solid #e2e8f0;">
            <a href="tel:${phone}" style="color:#2563eb;font-weight:700;text-decoration:none;">${phone}</a>
            <span style="color:#64748b;font-size:12px;margin-left:8px;">(Click to call)</span>
          </td>
        </tr>
        <tr>
          <td style="padding:8px 12px;background:#f8fafc;font-weight:600;border:1px solid #e2e8f0;">Email Address</td>
          <td style="padding:8px 12px;border:1px solid #e2e8f0;">
            ${email ? `<a href="mailto:${email}" style="color:#2563eb;text-decoration:none;font-weight:600;">${email}</a>` : '<span style="color:#94a3b8;">Not provided</span>'}
          </td>
        </tr>
      </table>

      <!-- Requirement Details -->
      <h2 style="margin:0 0 14px;font-size:15px;color:#0f172a;text-transform:uppercase;letter-spacing:0.5px;border-bottom:2px solid #e2e8f0;padding-bottom:6px;">
        2. Material & Supply Details
      </h2>
      <table style="width:100%;border-collapse:collapse;margin-bottom:24px;font-size:14px;">
        <tr>
          <td style="padding:8px 12px;background:#f8fafc;font-weight:600;width:35%;border:1px solid #e2e8f0;">Product Required</td>
          <td style="padding:8px 12px;border:1px solid #e2e8f0;font-weight:700;color:#0f172a;">${product}</td>
        </tr>
        <tr>
          <td style="padding:8px 12px;background:#f8fafc;font-weight:600;border:1px solid #e2e8f0;">Category</td>
          <td style="padding:8px 12px;border:1px solid #e2e8f0;color:#334155;">${category}</td>
        </tr>
        <tr>
          <td style="padding:8px 12px;background:#f8fafc;font-weight:600;border:1px solid #e2e8f0;">Quantity Required</td>
          <td style="padding:8px 12px;border:1px solid #e2e8f0;font-weight:700;color:#f97316;">${quantity}</td>
        </tr>
        <tr>
          <td style="padding:8px 12px;background:#f8fafc;font-weight:600;border:1px solid #e2e8f0;">Delivery Site / Location</td>
          <td style="padding:8px 12px;border:1px solid #e2e8f0;color:#334155;">${deliveryLocation}</td>
        </tr>
      </table>

      <!-- Requirement Notes -->
      <h2 style="margin:0 0 10px;font-size:15px;color:#0f172a;text-transform:uppercase;letter-spacing:0.5px;border-bottom:2px solid #e2e8f0;padding-bottom:6px;">
        3. Requirement Notes / Specifications
      </h2>
      <div style="background:#f8fafc;border:1px solid #cbd5e1;border-radius:6px;padding:14px 16px;margin-bottom:24px;font-size:14px;line-height:1.6;color:#1e293b;white-space:pre-wrap;">${notes}</div>

      <!-- Quick Actions -->
      <div style="background:#fff7ed;border:1px solid #ffedd5;border-radius:6px;padding:16px;text-align:center;">
        <p style="margin:0 0 12px;font-size:13px;color:#9a3412;font-weight:600;">
          Direct customer action links:
        </p>
        <a href="tel:${phone}" style="display:inline-block;background:#0f172a;color:#ffffff;padding:10px 20px;border-radius:6px;text-decoration:none;font-weight:600;font-size:13px;margin:4px;">
          📞 Call Customer (${phone})
        </a>
        <a href="https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(name)},%20thank%20you%20for%20contacting%20Rajdeep%20Enterprises%20regarding%20${encodeURIComponent(product)}." style="display:inline-block;background:#16a34a;color:#ffffff;padding:10px 20px;border-radius:6px;text-decoration:none;font-weight:600;font-size:13px;margin:4px;">
          💬 WhatsApp Customer
        </a>
        ${email ? `<a href="mailto:${email}?subject=Rajdeep%20Enterprises%20-%20Quote%20${referenceId}&body=Dear%20${encodeURIComponent(name)}," style="display:inline-block;background:#2563eb;color:#ffffff;padding:10px 20px;border-radius:6px;text-decoration:none;font-weight:600;font-size:13px;margin:4px;">✉️ Reply via Email</a>` : ''}
      </div>

    </div>

    <!-- Footer -->
    <div style="background:#f8fafc;padding:16px 28px;border-top:1px solid #e2e8f0;font-size:12px;color:#64748b;text-align:center;">
      Rajdeep Enterprises • Refinery Road, Near Indian Oil Refinery, Mathura, UP - 281005<br>
      GSTIN: 09AAPFR9321B1Z2 • Support: +91-9997993895 • rajdeepenterprises0047@gmail.com
    </div>

  </div>
</body>
</html>
    `.trim();

    const mailOptions = {
      from: `"Rajdeep Enterprises Website" <${smtpUser}>`,
      to: alertEmailTo,
      replyTo: email ? `"${name}" <${email}>` : undefined,
      subject: `[${submissionType}] ${product} - ${company} (${referenceId})`,
      text: textContent,
      html: htmlContent,
      headers: {
        'X-Entity-Ref-ID': referenceId,
        'X-Submission-Type': submissionType,
      },
    };

    const sendResult = await transporter.sendMail(mailOptions);

    currentStage = 'EMAIL_SEND_SUCCEEDED';
    console.info(
      `[Enquiry] STAGE=EMAIL_SEND_SUCCEEDED referenceId=${referenceId} messageId=${sendResult?.messageId || 'ok'}`
    );

    // 8. Return HTTP 200 ONLY after email dispatch succeeds
    return res.status(200).json({
      success: true,
      enquiryId: referenceId,
      referenceId,
      message: 'Your industrial enquiry has been submitted successfully. Our team will review your requirement and reach out shortly.',
    });
  } catch (err: any) {
    console.error(
      `[Enquiry] ERROR_STAGE=${currentStage} errorName=${err?.name || 'Error'} errorCode=${err?.code || 'UNKNOWN'} message=${
        err?.message ? err.message.replace(/[\w.-]+@[\w.-]+\.\w+/g, '[EMAIL]').slice(0, 300) : 'Unknown error'
      }`
    );

    return res.status(500).json({
      success: false,
      code: 'EMAIL_DELIVERY_FAILED',
      error:
        'Unable to deliver your enquiry notification via email. Please contact Rajdeep Enterprises directly at +91-9997993895 or via WhatsApp for immediate assistance.',
    });
  }
}
