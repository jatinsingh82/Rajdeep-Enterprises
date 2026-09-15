// In-memory rate limiting cache for RFQ endpoint
interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitRecord>();

function checkRateLimit(ip: string, limit = 5, windowMs = 10 * 60 * 1000): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (record.count >= limit) {
    return false;
  }

  record.count += 1;
  return true;
}

function sanitizeInput(str: unknown): string {
  if (typeof str !== 'string') return '';
  return str
    .replace(/[<>]/g, '')
    .trim();
}

export default function handler(req: any, res: any) {
  const origin = req.headers?.origin || '';
  const configuredSiteUrl = process.env.SITE_URL?.replace(/\/$/, '');
  const vercelUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '';

  const isAllowed =
    !origin ||
    process.env.NODE_ENV !== 'production' ||
    origin === configuredSiteUrl ||
    origin === vercelUrl ||
    origin.endsWith('.vercel.app') ||
    origin.includes('rajdeep') ||
    origin.includes('run.app');

  res.setHeader('Access-Control-Allow-Origin', isAllowed ? (origin || '*') : (configuredSiteUrl || '*'));
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('X-Content-Type-Options', 'nosniff');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method Not Allowed. Only POST requests are supported.'
    });
  }

  try {
    const clientIp = (req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown')
      .toString()
      .split(',')[0]
      .trim();

    if (!checkRateLimit(clientIp, 6, 10 * 60 * 1000)) {
      return res.status(429).json({
        success: false,
        error: 'Too many RFQ requests submitted from this connection. Please wait a moment or send your Bill of Quantities directly to Rajdeep Enterprises on WhatsApp (+91-9997993895).'
      });
    }

    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};

    // Spam honeypot trap
    if (body.website_hp || body.work_phone_hp) {
      return res.status(200).json({
        success: true,
        message: 'Your RFQ has been received.'
      });
    }

    const contractorName = sanitizeInput(body.contractorName || body.name);
    const companyName = sanitizeInput(body.companyName || body.company);
    const rawPhone = sanitizeInput(body.phoneNumber || body.phone);
    const emailAddress = sanitizeInput(body.emailAddress || body.email);
    const siteLocation = sanitizeInput(body.siteLocation || 'Mathura Refinery / Pan-India');
    const notes = sanitizeInput(body.notes);
    const requestMtc = Boolean(body.requestMtc);
    const rfqItems = Array.isArray(body.rfqItems) ? body.rfqItems : [];

    if (!contractorName || contractorName.length < 2) {
      return res.status(400).json({
        success: false,
        error: 'Please specify the contractor name or company purchase executive.'
      });
    }

    const cleanPhone = rawPhone.replace(/[^0-9]/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid 10-digit phone number for RFQ follow-up.'
      });
    }

    if (emailAddress) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailAddress)) {
        return res.status(400).json({
          success: false,
          error: 'Please enter a valid email address.'
        });
      }
    }

    if (rfqItems.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Your RFQ list is empty. Please select at least one product before submitting.'
      });
    }

    // Validate and sanitize items
    const sanitizedItems = rfqItems.map((item: any) => ({
      productName: sanitizeInput(item.product?.name || item.name || 'Industrial Material'),
      quantity: Math.max(1, parseInt(item.quantity, 10) || 1)
    }));

    const rfqReference = `RFQ-RD-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 899 + 100)}`;

    return res.status(200).json({
      success: true,
      rfqReference,
      message: 'Your Request for Quotation (RFQ) has been logged. Our commercial desk will review your items and send a competitive GST estimate.',
      details: {
        rfqReference,
        contractorName,
        companyName: companyName || 'Industrial Client',
        phoneNumber: cleanPhone,
        siteLocation,
        itemCount: sanitizedItems.length,
        items: sanitizedItems,
        requestMtc,
        submittedAt: new Date().toISOString()
      }
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: 'Unable to process your RFQ at this moment. Please connect with Rajdeep Enterprises directly on WhatsApp (+91-9997993895) or call.'
    });
  }
}
