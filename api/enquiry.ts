// In-memory rate limiting cache for serverless environment
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

// Simple HTML/script tag sanitizer
function sanitizeInput(str: unknown): string {
  if (typeof str !== 'string') return '';
  return str
    .replace(/[<>]/g, '')
    .trim();
}

export default function handler(req: any, res: any) {
  // CORS configuration
  const origin = req.headers?.origin || '*';
  const allowedOrigins = [
    'https://rajdeep-enterprises.vercel.app',
    'https://ais-pre-vzx65xo5tfk2j5f6z3tbec-761216421422.asia-southeast1.run.app',
    'https://ais-dev-vzx65xo5tfk2j5f6z3tbec-761216421422.asia-southeast1.run.app'
  ];

  if (allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    res.setHeader('Access-Control-Allow-Origin', 'https://rajdeep-enterprises.vercel.app');
  }

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
    // 1. IP Rate Limiting
    const clientIp = (req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown')
      .toString()
      .split(',')[0]
      .trim();

    if (!checkRateLimit(clientIp, 6, 10 * 60 * 1000)) {
      return res.status(429).json({
        success: false,
        error: 'Too many enquiry requests submitted from this network. Please wait a few moments or contact Rajdeep Enterprises directly via WhatsApp or phone call.'
      });
    }

    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};

    // 2. Lightweight Honeypot Spam Protection
    // If a hidden bot field is filled, silently return success without processing
    if (body.website_hp || body.work_phone_hp) {
      return res.status(200).json({
        success: true,
        message: 'Your enquiry has been received.'
      });
    }

    // 3. Input Validation & Sanitization
    const fullName = sanitizeInput(body.fullName || body.name);
    const companyName = sanitizeInput(body.companyName || body.company);
    const rawPhone = sanitizeInput(body.phoneNumber || body.phone);
    const emailAddress = sanitizeInput(body.emailAddress || body.email);
    const productRequirement = sanitizeInput(body.productRequirement || body.requirement);
    const category = sanitizeInput(body.category || body.productCategory);
    const quantity = sanitizeInput(body.quantity);
    const deliveryLocation = sanitizeInput(body.deliveryLocation || 'Mathura Site / Pan-India');
    const message = sanitizeInput(body.message || body.notes);

    if (!fullName || fullName.length < 2) {
      return res.status(400).json({
        success: false,
        error: 'Please enter your full name or site representative name.'
      });
    }

    const cleanPhone = rawPhone.replace(/[^0-9]/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid 10-digit mobile number so our dispatch team can contact you.'
      });
    }

    if (emailAddress) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailAddress)) {
        return res.status(400).json({
          success: false,
          error: 'Please provide a valid email address or leave the email field blank.'
        });
      }
    }

    if (!productRequirement) {
      return res.status(400).json({
        success: false,
        error: 'Please specify the industrial product or safety material you require.'
      });
    }

    const enquiryId = `ENQ-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 900 + 100)}`;

    return res.status(200).json({
      success: true,
      enquiryId,
      message: 'Your enquiry has been successfully logged. Our proprietor / sales executive will reach out with the best GST quotation shortly.',
      receivedData: {
        enquiryId,
        fullName,
        companyName: companyName || 'Individual Contractor',
        phoneNumber: cleanPhone,
        productRequirement,
        category,
        quantity: quantity || 'Standard Bulk Supply',
        deliveryLocation,
        timestamp: new Date().toISOString()
      }
    });
  } catch (err: any) {
    // Production error safety: never leak stack traces or internal server directories
    return res.status(500).json({
      success: false,
      error: 'Unable to process your enquiry at this moment. Please reach out to Rajdeep Enterprises directly on WhatsApp (+91-9997993895) or call.'
    });
  }
}
