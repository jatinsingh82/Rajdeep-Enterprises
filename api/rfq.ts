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

    const itemsTextSummary = rfqItems
      .map((item: any, idx: number) => {
        const pName = sanitizeText(item.name || 'Industrial Product', 150);
        const pSku = sanitizeText(item.sku || item.id || 'N/A', 80);
        const pQty = sanitizeText(String(item.quantity || 1), 30);
        const pUnit = sanitizeText(item.unit || 'units', 30);
        const pCategory = sanitizeText(item.category || 'Industrial Supplies', 80);
        return `  ${idx + 1}. Product: ${pName}
     • SKU / Product ID: ${pSku}
     • Quantity: ${pQty} ${pUnit}
     • Category: ${pCategory}`;
      })
      .join('\n\n');

    const textContent = `
=====================================================
SUBMISSION TYPE: BULK RFQ — RAJDEEP ENTERPRISES
=====================================================

RFQ Reference:   ${referenceId}
Submission Type: Bulk RFQ
Timestamp (IST): ${timestamp}

CUSTOMER DETAILS:
-----------------------------------------------------
Customer Name:   ${contractorName}
Company:         ${companyName}
Email:           ${emailAddress || 'Not Provided'}
Phone:           ${phoneNumber}
Location:        ${siteLocation}

REQUIREMENTS & SPECIFICATIONS:
-----------------------------------------------------
Requirements:    ${notes}
MTC Certificate: ${requestMtc ? 'YES - Required for site gate entry' : 'Standard GST Supply'}

PRODUCTS IN RFQ (${rfqItems.length} items):
-----------------------------------------------------
${itemsTextSummary || '  (No catalogue items attached; see requirements)'}

=====================================================
Direct Reply:    ${emailAddress ? `Reply to this email to reach ${contractorName} (${emailAddress})` : 'Contact via Phone or WhatsApp'}
Rajdeep Enterprises • Refinery Road, Near Indian Oil Refinery, Mathura, UP - 281005
    `.trim();

    const itemsHtmlRows = rfqItems
      .map((item: any, idx: number) => {
        const pName = sanitizeText(item.name || 'Industrial Product', 150);
        const pSku = sanitizeText(item.sku || item.id || 'N/A', 80);
        const pQty = sanitizeText(String(item.quantity || 1), 30);
        const pUnit = sanitizeText(item.unit || 'units', 30);
        const pCategory = sanitizeText(item.category || 'Industrial Supplies', 80);
        return `
        <tr style="border-bottom:1px solid #e2e8f0;">
          <td style="padding:10px 12px;font-weight:600;color:#0f172a;vertical-align:top;">${idx + 1}. ${pName}</td>
          <td style="padding:10px 12px;color:#475569;font-family:monospace;font-size:12px;vertical-align:top;">${pSku}</td>
          <td style="padding:10px 12px;font-weight:700;color:#f97316;vertical-align:top;">${pQty} ${pUnit}</td>
          <td style="padding:10px 12px;color:#334155;vertical-align:top;">${pCategory}</td>
        </tr>`;
      })
      .join('');

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Bulk RFQ Notification - ${referenceId}</title>
</head>
<body style="margin:0;padding:24px;background-color:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#0f172a;">
  <div style="max-width:680px;margin:0 auto;background:#ffffff;border:1px solid #cbd5e1;border-radius:8px;overflow:hidden;box-shadow:0 4px 6px -1px rgba(0,0,0,0.1);">
    
    <!-- Header Banner -->
    <div style="background-color:#0f172a;padding:24px 28px;border-bottom:4px solid #f97316;">
      <div style="font-size:12px;font-weight:700;letter-spacing:1px;color:#f97316;text-transform:uppercase;margin-bottom:4px;">
        Submission Type: Bulk RFQ
      </div>
      <h1 style="margin:0;font-size:22px;color:#ffffff;font-weight:700;">
        New Bulk RFQ: ${referenceId}
      </h1>
      <p style="margin:6px 0 0;font-size:13px;color:#94a3b8;">
        Submitted on ${timestamp} (IST)
      </p>
    </div>

    <div style="padding:28px;">

      <!-- Customer Details -->
      <h2 style="margin:0 0 14px;font-size:15px;color:#0f172a;text-transform:uppercase;letter-spacing:0.5px;border-bottom:2px solid #e2e8f0;padding-bottom:6px;">
        1. Customer & Contractor Details
      </h2>
      <table style="width:100%;border-collapse:collapse;margin-bottom:24px;font-size:14px;">
        <tr>
          <td style="padding:8px 12px;background:#f8fafc;font-weight:600;width:35%;border:1px solid #e2e8f0;">Customer Name</td>
          <td style="padding:8px 12px;border:1px solid #e2e8f0;font-weight:700;color:#0f172a;">${contractorName}</td>
        </tr>
        <tr>
          <td style="padding:8px 12px;background:#f8fafc;font-weight:600;border:1px solid #e2e8f0;">Company / Firm</td>
          <td style="padding:8px 12px;border:1px solid #e2e8f0;color:#334155;">${companyName}</td>
        </tr>
        <tr>
          <td style="padding:8px 12px;background:#f8fafc;font-weight:600;border:1px solid #e2e8f0;">Phone Number</td>
          <td style="padding:8px 12px;border:1px solid #e2e8f0;">
            <a href="tel:${phoneNumber}" style="color:#2563eb;font-weight:700;text-decoration:none;">${phoneNumber}</a>
          </td>
        </tr>
        <tr>
          <td style="padding:8px 12px;background:#f8fafc;font-weight:600;border:1px solid #e2e8f0;">Email Address</td>
          <td style="padding:8px 12px;border:1px solid #e2e8f0;">
            ${emailAddress ? `<a href="mailto:${emailAddress}" style="color:#2563eb;text-decoration:none;font-weight:600;">${emailAddress}</a>` : '<span style="color:#94a3b8;">Not Provided</span>'}
          </td>
        </tr>
        <tr>
          <td style="padding:8px 12px;background:#f8fafc;font-weight:600;border:1px solid #e2e8f0;">Delivery Location</td>
          <td style="padding:8px 12px;border:1px solid #e2e8f0;color:#334155;">${siteLocation}</td>
        </tr>
        <tr>
          <td style="padding:8px 12px;background:#f8fafc;font-weight:600;border:1px solid #e2e8f0;">MTC Certificate</td>
          <td style="padding:8px 12px;border:1px solid #e2e8f0;color:${requestMtc ? '#059669;font-weight:700;' : '#334155;'}">
            ${requestMtc ? 'YES - Required for site gate entry' : 'Standard GST Supply'}
          </td>
        </tr>
      </table>

      <!-- Products in RFQ -->
      <h2 style="margin:0 0 14px;font-size:15px;color:#0f172a;text-transform:uppercase;letter-spacing:0.5px;border-bottom:2px solid #e2e8f0;padding-bottom:6px;">
        2. Selected RFQ Products (${rfqItems.length} Items)
      </h2>
      <table style="width:100%;border-collapse:collapse;margin-bottom:24px;font-size:13px;border:1px solid #e2e8f0;">
        <thead>
          <tr style="background:#f8fafc;text-align:left;border-bottom:2px solid #cbd5e1;">
            <th style="padding:10px 12px;font-weight:700;color:#334155;">Product Name</th>
            <th style="padding:10px 12px;font-weight:700;color:#334155;">SKU / ID</th>
            <th style="padding:10px 12px;font-weight:700;color:#334155;">Quantity</th>
            <th style="padding:10px 12px;font-weight:700;color:#334155;">Category</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtmlRows || '<tr><td colspan="4" style="padding:12px;text-align:center;color:#64748b;">No catalogue items selected</td></tr>'}
        </tbody>
      </table>

      <!-- Requirements / Specifications -->
      <h2 style="margin:0 0 10px;font-size:15px;color:#0f172a;text-transform:uppercase;letter-spacing:0.5px;border-bottom:2px solid #e2e8f0;padding-bottom:6px;">
        3. Requirements & Notes
      </h2>
      <div style="background:#f8fafc;border:1px solid #cbd5e1;border-radius:6px;padding:14px 16px;margin-bottom:24px;font-size:14px;line-height:1.6;color:#1e293b;white-space:pre-wrap;">${notes}</div>

      <!-- Quick Actions -->
      <div style="background:#fff7ed;border:1px solid #ffedd5;border-radius:6px;padding:16px;text-align:center;">
        <p style="margin:0 0 12px;font-size:13px;color:#9a3412;font-weight:600;">
          Direct action links for this Bulk RFQ:
        </p>
        <a href="tel:${phoneNumber}" style="display:inline-block;background:#0f172a;color:#ffffff;padding:10px 18px;border-radius:6px;text-decoration:none;font-weight:600;font-size:13px;margin:4px;">
          📞 Call Customer (${phoneNumber})
        </a>
        <a href="https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(contractorName)},%20thank%20you%20for%20your%20Bulk%20RFQ%20(${encodeURIComponent(referenceId)})%20with%20Rajdeep%20Enterprises." style="display:inline-block;background:#16a34a;color:#ffffff;padding:10px 18px;border-radius:6px;text-decoration:none;font-weight:600;font-size:13px;margin:4px;">
          💬 WhatsApp Customer
        </a>
        ${emailAddress ? `<a href="mailto:${emailAddress}?subject=Rajdeep%20Enterprises%20-%20Quotation%20for%20RFQ%20${referenceId}&body=Dear%20${encodeURIComponent(contractorName)}," style="display:inline-block;background:#2563eb;color:#ffffff;padding:10px 18px;border-radius:6px;text-decoration:none;font-weight:600;font-size:13px;margin:4px;">✉️ Reply via Email</a>` : ''}
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

    await transporter.sendMail({
      from: `"Rajdeep Enterprises Website" <${smtpUser}>`,
      to: alertEmailTo,
      replyTo: emailAddress ? `"${contractorName}" <${emailAddress}>` : undefined,
      subject: `[Bulk RFQ] ${companyName !== 'Not Specified' ? companyName : contractorName} (${rfqItems.length} Items) - Ref ${referenceId}`,
      text: textContent,
      html: htmlContent,
      headers: {
        'X-Entity-Ref-ID': referenceId,
        'X-Submission-Type': 'Bulk RFQ',
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
