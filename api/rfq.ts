import dotenv from 'dotenv';
import path from 'path';
import nodemailer from 'nodemailer';

// Ensure environment variables are loaded in local development / serverless runtimes
dotenv.config();
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

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
    (process.env.VITE_SITE_URL && trimmedOrigin === process.env.VITE_SITE_URL.trim().replace(/\/$/, '')) ||
    trimmedOrigin.startsWith('http://localhost:') ||
    trimmedOrigin.startsWith('http://127.0.0.1:') ||
    trimmedOrigin.startsWith('http://0.0.0.0:') ||
    trimmedOrigin.endsWith('.run.app') ||
    trimmedOrigin.endsWith('.vercel.app') ||
    trimmedOrigin.endsWith('.googleusercontent.com');

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

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

// In-memory sliding window cache for duplicate submission prevention (e.g. rapid double clicks)
interface RecentSubmission {
  timestamp: number;
  referenceId: string;
}
const recentSubmissions = new Map<string, RecentSubmission>();

function cleanExpiredSubmissions(): void {
  const cutoff = Date.now() - 90 * 1000; // 90 seconds
  for (const [key, record] of recentSubmissions.entries()) {
    if (record.timestamp < cutoff) {
      recentSubmissions.delete(key);
    }
  }
}

function isCatalogueOrStandardItem(name: string): boolean {
  if (!name) return false;
  const lower = name.toLowerCase().trim();
  const knownKeywords = [
    'helmet', 'hard hat', 'shoe', 'boot', 'gumboot', 'footwear',
    'glove', 'hand glove', 'harness', 'safety belt', 'lanyard', 'fall arrester', 'lifeline',
    'goggle', 'spectacle', 'face shield', 'ear muff', 'ear plug', 'jacket', 'reflective', 'boiler suit', 'coverall',
    'tape', 'lane marking', 'floor marking', 'barricade', 'caution tape', 'duct tape', 'adhesive tape',
    'cone', 'road stud', 'speed breaker', 'safety sign', 'signage',
    'welding', 'electrode', 'welding rod', 'welding machine', 'cutter', 'torch', 'dpt', 'ndt',
    'gasket', 'jointing sheet', 'champion', 'rubber sheet',
    'fastener', 'nut', 'bolt', 'washer', 'stud', 'screw', 'threaded rod', 'anchor',
    'grinder', 'drill', 'cut off', 'blade', 'wheel', 'wrench', 'spanner', 'plier', 'hammer', 'silicon gun',
    'register', 'permit', 'stationery', 'copy', 'copies', 'pen', 'pens', 'envelope', 'paper', 'printout', 'photocopy',
    'crane', 'hydra', 'farana', 'rental',
    'brush', 'paint brush', 'paint', 'roller',
    'gauge', 'pressure gauge', 'vacuum gauge',
    'valve', 'ball valve', 'gate valve', 'globe valve', 'butterfly valve', 'check valve',
    'pipe', 'tube', 'fitting', 'flange', 'elbow', 'tee',
    'cylinder', 'extinguisher', 'fire fighting', 'fire hose', 'fire blanket',
    'tarpaulin', 'shade net', 'scaffolding'
  ];
  return knownKeywords.some((kw) => lower.includes(kw));
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

    // 1. Anti-spam Honeypot Check
    if (rawBody.website_hp || rawBody.work_phone_hp) {
      return res.status(200).json({
        success: true,
        rfqReference: 'RE-RFQ-HONEY',
        message: 'Your enquiry has been received.',
      });
    }

    const source = sanitizeText(rawBody.source || '', 50);
    const isAiChatbot =
      source === 'Rajdeep AI Chatbot' ||
      source === 'rajdeep-ai-chat' ||
      source === 'Website AI Chatbot' ||
      Boolean(rawBody.isAiChatbot || rawBody.product || rawBody.material);

    // 2. Extract common and AI-specific fields
    const contractorName = sanitizeText(
      rawBody.customerName || rawBody.contractorName || rawBody.name || rawBody.customer?.name || '',
      100
    );
    const companyName = sanitizeText(
      rawBody.companyName || rawBody.company || rawBody.customer?.company || '',
      120
    );
    const phoneNumber = sanitizeText(
      rawBody.phoneNumber || rawBody.phone || rawBody.customer?.phone || '',
      30
    );
    const emailAddress = sanitizeText(
      rawBody.emailAddress || rawBody.email || rawBody.customer?.email || '',
      100
    );
    const siteLocation = sanitizeText(
      rawBody.deliveryLocation || rawBody.siteLocation || rawBody.location || '',
      200
    );
    const notes = sanitizeText(
      rawBody.additionalNotes || rawBody.notes || rawBody.message || '',
      2000
    );
    const requestMtc = Boolean(rawBody.requestMtc);
    const rfqItems = Array.isArray(rawBody.rfqItems)
      ? rawBody.rfqItems
      : Array.isArray(rawBody.requirements)
      ? rawBody.requirements
      : Array.isArray(rawBody.items)
      ? rawBody.items
      : [];

    // AI RFQ specific attributes
    const product = sanitizeText(
      rawBody.product ||
      (rfqItems.length > 0 ? rfqItems.map((it: any) => `${it.item || it.product || ''} (Qty: ${it.quantity || ''})`).join(', ') : ''),
      250
    );
    const material = sanitizeText(rawBody.material || '', 100);
    const grade = sanitizeText(rawBody.grade || '', 50);
    const quantity = sanitizeText(rawBody.quantity || '', 50);
    const unit = sanitizeText(rawBody.unit || '', 30);
    const thickness = sanitizeText(rawBody.thickness || '', 50);
    const dimensions = sanitizeText(rawBody.dimensions || '', 80);
    const specifications = sanitizeText(rawBody.specifications || '', 250);
    const brand = sanitizeText(rawBody.brand || '', 100);
    const size = sanitizeText(rawBody.size || rawBody.model || '', 100);
    const application = sanitizeText(rawBody.application || '', 200);
    const requiredBy = sanitizeText(rawBody.requiredBy || '', 80);
    const conversationSummary = sanitizeText(
      rawBody.conversationSummary || rawBody.conversation || '',
      4000
    );

    // 3. Server-side Validation
    if (!contractorName || contractorName.length < 2) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid contact person name (min 2 characters).',
      });
    }

    const digitsOnly = phoneNumber.replace(/\D/g, '');
    const hasValidPhone = digitsOnly.length >= 10;
    const hasValidEmail = emailAddress ? isValidEmail(emailAddress) : false;

    if (emailAddress && !hasValidEmail) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid email address.',
      });
    }

    if (!hasValidPhone && !hasValidEmail) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid 10-digit mobile number or email address.',
      });
    }

    // Ensure requirement is not empty
    const hasRequirement = isAiChatbot
      ? Boolean(product || material || notes || rfqItems.length > 0)
      : rfqItems.length > 0 || Boolean(notes);

    if (!hasRequirement) {
      return res.status(400).json({
        success: false,
        error: 'Please specify the product or material requirement.',
      });
    }

    // 4. Collision-Resistant Reference ID Generation (Section 10)
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
    const randDigits = Math.floor(100000 + Math.random() * 900000);
    const referenceId = `RE-RFQ-${dateStr}-${randDigits}`;

    // 5. Deduplication check
    cleanExpiredSubmissions();
    const dedupeKey = `${contractorName}:${digitsOnly}:${product}:${material}:${quantity}:${notes}`.toLowerCase();
    const existing = recentSubmissions.get(dedupeKey);
    if (existing && Date.now() - existing.timestamp < 60 * 1000) {
      return res.status(200).json({
        success: true,
        rfqReference: existing.referenceId,
        message: 'Your enquiry has been submitted successfully.',
        isDuplicate: true,
      });
    }

    // 6. SMTP Configuration (Server-Side Only)
    const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
    const smtpPort = Number(process.env.SMTP_PORT || 587);
    const smtpUser = process.env.SMTP_USER || 'rajdeepenterprises0047@gmail.com';
    const smtpPass = process.env.SMTP_PASS;
    const alertEmailTo = process.env.ALERT_EMAIL_TO || 'rajdeepenterprises0047@gmail.com';

    // Diagnostic logging requested in Part 11
    console.log('[CHATBOT RFQ] submission received');
    console.log(`[CHATBOT RFQ] SMTP_HOST configured: ${Boolean(smtpHost)}`);
    console.log(`[CHATBOT RFQ] SMTP_PORT configured: ${Boolean(smtpPort)}`);
    console.log(`[CHATBOT RFQ] SMTP_USER configured: ${Boolean(smtpUser)}`);
    console.log(`[CHATBOT RFQ] SMTP_PASS configured: ${Boolean(smtpPass)}`);
    console.log(`[CHATBOT RFQ] ALERT_EMAIL_TO configured: ${Boolean(alertEmailTo)}`);

    // Verify SMTP credentials - never return fake success if email cannot be sent (Part 6 & 12)
    if (!smtpHost || !smtpPort || !smtpUser || !smtpPass) {
      console.warn('[CHATBOT RFQ] SMTP credentials not configured on server (SMTP_PASS missing)');
      return res.status(500).json({
        success: false,
        error: 'Email service is not configured on the server.',
      });
    }

    if (!alertEmailTo) {
      console.warn('[CHATBOT RFQ] ALERT_EMAIL_TO recipient is missing');
      return res.status(500).json({
        success: false,
        error: 'Email recipient is not configured.',
      });
    }

    const timestamp = new Date().toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'full',
      timeStyle: 'medium',
    });

    let subject = '';
    let textContent = '';
    let htmlContent = '';

    const displayProduct =
      product ||
      material ||
      (rfqItems.length > 0
        ? rfqItems.map((it: any) => it.item || it.product).join(', ')
        : 'Industrial Requirement');
    const isStandardCatalogueItem = isCatalogueOrStandardItem(displayProduct);
    const catalogueStatus = isStandardCatalogueItem ? 'Catalogue' : 'Non-Catalogue';
    const sizeModel = size || thickness || dimensions || '';

    if (isAiChatbot) {
      // ----------------------------------------------------
      // PART 8 COMPLIANT FORMAT: RAJDEEP AI CHATBOT
      // ----------------------------------------------------
      subject = `New Rajdeep Enterprises Chatbot Requirement - ${displayProduct}`;

      textContent = [
        'RAJDEEP ENTERPRISES',
        'CHATBOT REQUIREMENT',
        '',
        'Reference Number:',
        referenceId,
        '',
        'Customer Name:',
        contractorName,
        '',
        'Phone:',
        phoneNumber,
        '',
        'Email:',
        emailAddress || 'Not Provided',
        '',
        'Requested Item:',
        displayProduct,
        '',
        'Quantity:',
        quantity ? `${quantity}${unit ? ` ${unit}` : ''}` : 'Not Specified',
        '',
        'Unit:',
        unit || 'Not Specified',
        '',
        'Type/Grade:',
        grade || 'Not Specified',
        '',
        'Thickness:',
        thickness || 'Not Specified',
        '',
        'Dimensions:',
        dimensions || 'Not Specified',
        '',
        'Specification:',
        specifications || sizeModel || (brand ? `Brand: ${brand}` : 'None'),
        '',
        'Delivery Location:',
        siteLocation || 'Not Provided',
        '',
        'Catalogue Status:',
        catalogueStatus,
        '',
        'Additional Customer Message:',
        notes || conversationSummary || 'None',
        '',
        'Submitted:',
        timestamp,
      ].join('\n');

      // Helper function for HTML table rows
      const htmlRow = (label: string, val: string | undefined) => {
        if (!val || !val.trim()) return '';
        return `<tr><td style="padding:7px 12px;background:#f8fafc;font-weight:600;width:35%;border:1px solid #e2e8f0;color:#475569;">${label}</td><td style="padding:7px 12px;border:1px solid #e2e8f0;font-weight:600;color:#0f172a;">${val}</td></tr>`;
      };

      htmlContent = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>${subject}</title></head>
<body style="margin:0;padding:24px;background-color:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#0f172a;">
  <div style="max-width:680px;margin:0 auto;background:#ffffff;border:1px solid #cbd5e1;border-radius:10px;overflow:hidden;box-shadow:0 4px 6px -1px rgba(0,0,0,0.1);">
    
    <div style="background-color:#0f172a;padding:22px 28px;border-bottom:4px solid #ea580c;">
      <div style="font-size:11px;font-weight:700;letter-spacing:1px;color:#f97316;text-transform:uppercase;margin-bottom:4px;">
        NEW REQUIREMENT FROM RAJDEEP AI CHATBOT
      </div>
      <h1 style="margin:0;font-size:20px;color:#ffffff;font-weight:700;">
        ${subject}
      </h1>
      <p style="margin:6px 0 0;font-size:12px;color:#94a3b8;">
        Reference: <strong style="color:#ffffff;">${referenceId}</strong> &bull; ${timestamp}
      </p>
    </div>

    <div style="padding:28px;">

      <!-- Product Status Banner -->
      <div style="background:${isStandardCatalogueItem ? '#f0fdf4' : '#fff7ed'};border:1px solid ${isStandardCatalogueItem ? '#bbf7d0' : '#fed7aa'};border-radius:6px;padding:10px 14px;color:${isStandardCatalogueItem ? '#15803d' : '#c2410c'};font-weight:600;font-size:13px;margin-bottom:20px;">
        ${isStandardCatalogueItem ? '✓ Product Status: Standard Catalogue Product' : '⚠️ Product Status: Non-catalogue / Special sourcing requirement'}
      </div>

      <h2 style="margin:0 0 12px;font-size:14px;color:#0f172a;text-transform:uppercase;letter-spacing:0.5px;border-bottom:2px solid #e2e8f0;padding-bottom:6px;">
        Customer Information
      </h2>
      <table style="width:100%;border-collapse:collapse;margin-bottom:20px;font-size:13px;">
        ${htmlRow('Customer Name', contractorName)}
        ${htmlRow('Company', companyName)}
        ${htmlRow('Phone', phoneNumber)}
        ${htmlRow('Email', emailAddress)}
      </table>

      <h2 style="margin:0 0 12px;font-size:14px;color:#0f172a;text-transform:uppercase;letter-spacing:0.5px;border-bottom:2px solid #e2e8f0;padding-bottom:6px;">
        Requirement Details
      </h2>
      <table style="width:100%;border-collapse:collapse;margin-bottom:20px;font-size:13px;">
        ${htmlRow('Requested Item', product || material)}
        ${htmlRow('Quantity', quantity ? `${quantity}${unit ? ` ${unit}` : ''}` : undefined)}
        ${htmlRow('Unit', unit)}
        ${htmlRow('Grade / Type', grade)}
        ${htmlRow('Thickness', thickness)}
        ${htmlRow('Dimensions', dimensions)}
        ${htmlRow('Specification', specifications)}
        ${htmlRow('Brand', brand)}
        ${htmlRow('Size / Model', sizeModel)}
        ${htmlRow('Delivery Location', siteLocation)}
        ${htmlRow('Additional Notes', notes)}
      </table>

      <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:6px;padding:10px 14px;margin-bottom:20px;font-size:12px;color:#475569;">
        <div><strong>Source:</strong> Website AI Chatbot</div>
        <div style="margin-top:4px;"><strong>Reference:</strong> ${referenceId}</div>
      </div>

      ${conversationSummary ? `
      <h2 style="margin:0 0 10px;font-size:14px;color:#0f172a;text-transform:uppercase;letter-spacing:0.5px;border-bottom:2px solid #e2e8f0;padding-bottom:6px;">
        Conversation Summary
      </h2>
      <div style="background:#f8fafc;border:1px solid #cbd5e1;border-radius:6px;padding:12px 16px;margin-bottom:20px;font-size:12px;line-height:1.6;color:#334155;white-space:pre-wrap;font-family:monospace;">${conversationSummary}</div>` : ''}

      <!-- Quick Actions -->
      <div style="background:#fff7ed;border:1px solid #ffedd5;border-radius:8px;padding:16px;text-align:center;">
        <p style="margin:0 0 12px;font-size:13px;color:#9a3412;font-weight:600;">
          Direct action links for this requirement:
        </p>
        ${phoneNumber ? `
        <a href="tel:${phoneNumber}" style="display:inline-block;background:#0f172a;color:#ffffff;padding:10px 18px;border-radius:6px;text-decoration:none;font-weight:600;font-size:13px;margin:4px;">
          📞 Call Customer (${phoneNumber})
        </a>
        <a href="https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(contractorName)},%20thank%20you%20for%20your%20requirement%20(${encodeURIComponent(referenceId)})%20with%20Rajdeep%20Enterprises." style="display:inline-block;background:#16a34a;color:#ffffff;padding:10px 18px;border-radius:6px;text-decoration:none;font-weight:600;font-size:13px;margin:4px;">
          💬 WhatsApp Customer
        </a>` : ''}
        ${emailAddress ? `<a href="mailto:${emailAddress}?subject=Rajdeep%20Enterprises%20-%20Quotation%20for%20Requirement%20${referenceId}&body=Dear%20${encodeURIComponent(contractorName)}," style="display:inline-block;background:#2563eb;color:#ffffff;padding:10px 18px;border-radius:6px;text-decoration:none;font-weight:600;font-size:13px;margin:4px;">✉️ Reply via Email</a>` : ''}
      </div>

    </div>

    <div style="background:#f8fafc;padding:16px 28px;border-top:1px solid #e2e8f0;font-size:11px;color:#64748b;text-align:center;">
      Rajdeep Enterprises • Refinery Road, Near Indian Oil Refinery, Mathura, UP - 281005<br>
      GSTIN: 09AAPFR9321B1Z2 • Support: +91-9997993895 • rajdeepenterprises0047@gmail.com
    </div>

  </div>
</body>
</html>`.trim();
    } else {
      // ----------------------------------------------------
      // PRESERVED EXISTING FORMAT: WEBSITE CART / BULK RFQ
      // ----------------------------------------------------
      subject = `[Bulk RFQ] ${companyName || contractorName} (${rfqItems.length} Items) - Ref ${referenceId}`;

      const itemsTextSummary = rfqItems
        .map((item: any, idx: number) => {
          const pName = sanitizeText(item.name || 'Industrial Product', 150);
          const pSku = sanitizeText(item.sku || item.id || 'N/A', 80);
          const pQty = sanitizeText(String(item.quantity || 1), 30);
          const pUnit = sanitizeText(item.unit || 'units', 30);
          const pCategory = sanitizeText(item.category || 'Industrial Supplies', 80);
          return `  ${idx + 1}. Product: ${pName}\n     • SKU / ID: ${pSku}\n     • Quantity: ${pQty} ${pUnit}\n     • Category: ${pCategory}`;
        })
        .join('\n\n');

      textContent = `
=====================================================
SUBMISSION TYPE: BULK RFQ — RAJDEEP ENTERPRISES
=====================================================

RFQ Reference:   ${referenceId}
Submission Type: Bulk RFQ
Timestamp (IST): ${timestamp}

CUSTOMER DETAILS:
-----------------------------------------------------
Customer Name:   ${contractorName}
Company:         ${companyName || 'Not Specified'}
Email:           ${emailAddress || 'Not Provided'}
Phone:           ${phoneNumber}
Location:        ${siteLocation || 'Not Specified'}

REQUIREMENTS & SPECIFICATIONS:
-----------------------------------------------------
Requirements:    ${notes || 'None'}
MTC Certificate: ${requestMtc ? 'YES - Required for site gate entry' : 'Standard GST Supply'}

PRODUCTS IN RFQ (${rfqItems.length} items):
-----------------------------------------------------
${itemsTextSummary || '  (No catalogue items attached; see requirements)'}

=====================================================
Rajdeep Enterprises • Refinery Road, Near Indian Oil Refinery, Mathura, UP - 281005
      `.trim();

      const itemsHtmlRows = rfqItems
        .map((item: any, idx: number) => {
          const pName = sanitizeText(item.name || 'Industrial Product', 150);
          const pSku = sanitizeText(item.sku || item.id || 'N/A', 80);
          const pQty = sanitizeText(String(item.quantity || 1), 30);
          const pUnit = sanitizeText(item.unit || 'units', 30);
          const pCategory = sanitizeText(item.category || 'Industrial Supplies', 80);
          return `<tr style="border-bottom:1px solid #e2e8f0;"><td style="padding:10px 12px;font-weight:600;color:#0f172a;vertical-align:top;">${idx + 1}. ${pName}</td><td style="padding:10px 12px;color:#475569;font-family:monospace;font-size:12px;vertical-align:top;">${pSku}</td><td style="padding:10px 12px;font-weight:700;color:#ea580c;vertical-align:top;">${pQty} ${pUnit}</td><td style="padding:10px 12px;color:#334155;vertical-align:top;">${pCategory}</td></tr>`;
        })
        .join('');

      htmlContent = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>${subject}</title></head>
<body style="margin:0;padding:24px;background-color:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#0f172a;">
  <div style="max-width:680px;margin:0 auto;background:#ffffff;border:1px solid #cbd5e1;border-radius:8px;overflow:hidden;box-shadow:0 4px 6px -1px rgba(0,0,0,0.1);">
    <div style="background-color:#0f172a;padding:24px 28px;border-bottom:4px solid #ea580c;">
      <div style="font-size:12px;font-weight:700;letter-spacing:1px;color:#f97316;text-transform:uppercase;margin-bottom:4px;">Submission Type: Bulk RFQ</div>
      <h1 style="margin:0;font-size:22px;color:#ffffff;font-weight:700;">New Bulk RFQ: ${referenceId}</h1>
      <p style="margin:6px 0 0;font-size:13px;color:#94a3b8;">Submitted on ${timestamp} (IST)</p>
    </div>
    <div style="padding:28px;">
      <h2 style="margin:0 0 14px;font-size:15px;color:#0f172a;text-transform:uppercase;border-bottom:2px solid #e2e8f0;padding-bottom:6px;">1. Customer & Contractor Details</h2>
      <table style="width:100%;border-collapse:collapse;margin-bottom:24px;font-size:14px;">
        <tr><td style="padding:8px 12px;background:#f8fafc;font-weight:600;width:35%;border:1px solid #e2e8f0;">Customer Name</td><td style="padding:8px 12px;border:1px solid #e2e8f0;font-weight:700;color:#0f172a;">${contractorName}</td></tr>
        <tr><td style="padding:8px 12px;background:#f8fafc;font-weight:600;border:1px solid #e2e8f0;">Company / Firm</td><td style="padding:8px 12px;border:1px solid #e2e8f0;color:#334155;">${companyName || 'Not Specified'}</td></tr>
        <tr><td style="padding:8px 12px;background:#f8fafc;font-weight:600;border:1px solid #e2e8f0;">Phone Number</td><td style="padding:8px 12px;border:1px solid #e2e8f0;"><a href="tel:${phoneNumber}" style="color:#2563eb;font-weight:700;text-decoration:none;">${phoneNumber}</a></td></tr>
        <tr><td style="padding:8px 12px;background:#f8fafc;font-weight:600;border:1px solid #e2e8f0;">Email Address</td><td style="padding:8px 12px;border:1px solid #e2e8f0;">${emailAddress ? `<a href="mailto:${emailAddress}" style="color:#2563eb;text-decoration:none;font-weight:600;">${emailAddress}</a>` : '<span style="color:#94a3b8;">Not Provided</span>'}</td></tr>
        <tr><td style="padding:8px 12px;background:#f8fafc;font-weight:600;border:1px solid #e2e8f0;">Delivery Location</td><td style="padding:8px 12px;border:1px solid #e2e8f0;color:#334155;">${siteLocation || 'Not Specified'}</td></tr>
        <tr><td style="padding:8px 12px;background:#f8fafc;font-weight:600;border:1px solid #e2e8f0;">MTC Certificate</td><td style="padding:8px 12px;border:1px solid #e2e8f0;color:${requestMtc ? '#059669;font-weight:700;' : '#334155;'}">${requestMtc ? 'YES - Required for site gate entry' : 'Standard GST Supply'}</td></tr>
      </table>
      <h2 style="margin:0 0 14px;font-size:15px;color:#0f172a;text-transform:uppercase;border-bottom:2px solid #e2e8f0;padding-bottom:6px;">2. Selected RFQ Products (${rfqItems.length} Items)</h2>
      <table style="width:100%;border-collapse:collapse;margin-bottom:24px;font-size:13px;border:1px solid #e2e8f0;">
        <thead><tr style="background:#f8fafc;text-align:left;border-bottom:2px solid #cbd5e1;"><th style="padding:10px 12px;">Product</th><th style="padding:10px 12px;">SKU</th><th style="padding:10px 12px;">Qty</th><th style="padding:10px 12px;">Category</th></tr></thead>
        <tbody>${itemsHtmlRows || '<tr><td colspan="4" style="padding:12px;text-align:center;color:#64748b;">No catalogue items selected</td></tr>'}</tbody>
      </table>
      <h2 style="margin:0 0 10px;font-size:15px;color:#0f172a;text-transform:uppercase;border-bottom:2px solid #e2e8f0;padding-bottom:6px;">3. Requirements & Notes</h2>
      <div style="background:#f8fafc;border:1px solid #cbd5e1;border-radius:6px;padding:14px 16px;margin-bottom:24px;font-size:14px;line-height:1.6;color:#1e293b;white-space:pre-wrap;">${notes || 'None'}</div>
    </div>
    <div style="background:#f8fafc;padding:16px 28px;border-top:1px solid #e2e8f0;font-size:12px;color:#64748b;text-align:center;">
      Rajdeep Enterprises • Refinery Road, Near Indian Oil Refinery, Mathura, UP - 281005<br>
      GSTIN: 09AAPFR9321B1Z2 • Support: +91-9997993895 • rajdeepenterprises0047@gmail.com
    </div>
  </div>
</body>
</html>`.trim();
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || smtpHost,
      port: Number(process.env.SMTP_PORT || smtpPort),
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.SMTP_USER || smtpUser,
        pass: process.env.SMTP_PASS || smtpPass,
      },
      connectionTimeout: 15000,
      greetingTimeout: 15000,
      socketTimeout: 20000,
    });

    console.log('[CHATBOT RFQ] attempting email send');
    try {
      const info = await transporter.sendMail({
        from: `"Rajdeep Enterprises Website" <${process.env.SMTP_USER || smtpUser}>`,
        to: process.env.ALERT_EMAIL_TO || alertEmailTo,
        replyTo: emailAddress ? `"${contractorName}" <${emailAddress}>` : undefined,
        subject,
        text: textContent,
        html: htmlContent,
        headers: {
          'X-Entity-Ref-ID': referenceId,
          'X-Submission-Type': isAiChatbot ? 'Rajdeep AI RFQ' : 'Bulk RFQ',
        },
      });
      console.log(`[CHATBOT RFQ] email send successful (messageId: ${info?.messageId || 'sent'})`);
    } catch (sendError: any) {
      console.warn('[CHATBOT RFQ] email delivery failed');
      console.warn(`[CHATBOT RFQ] error code: ${sendError?.code || 'UNKNOWN'}`);
      console.warn(`[CHATBOT RFQ] error message: ${sendError?.message || sendError}`);

      let clientErrorMessage = "I couldn't send your requirement right now. Please try again or contact Rajdeep Enterprises directly at +91 99979 93895.";
      if (
        sendError?.code === 'EAUTH' ||
        sendError?.responseCode === 535 ||
        (sendError?.message && sendError.message.includes('Invalid login'))
      ) {
        clientErrorMessage = 'Email authentication failed. Please check the Gmail App Password.';
      } else if (
        sendError?.code === 'ESOCKET' ||
        sendError?.code === 'ETIMEDOUT' ||
        sendError?.code === 'ECONNREFUSED'
      ) {
        clientErrorMessage = 'Could not connect to the email service.';
      }

      return res.status(500).json({
        success: false,
        error: clientErrorMessage,
      });
    }

    // Register fingerprint only after email delivery succeeds
    recentSubmissions.set(dedupeKey, {
      timestamp: Date.now(),
      referenceId,
    });

    console.info(`[RFQ] Email delivered successfully to ${alertEmailTo} with ref ${referenceId}`);

    return res.status(200).json({
      success: true,
      rfqReference: referenceId,
      message: 'Your requirement has been successfully sent to the Rajdeep Enterprises team.',
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error('[RFQ] ERROR_STAGE=REQUEST_PROCESSING_FAILED', err?.message || err);
    return res.status(500).json({
      success: false,
      error: "I couldn't send your requirement right now. Please try again or contact Rajdeep Enterprises directly at +91 99979 93895.",
    });
  }
}
