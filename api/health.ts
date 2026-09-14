export default function handler(req: any, res: any) {
  // Production CORS & Security Headers
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

  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('X-Content-Type-Options', 'nosniff');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  return res.status(200).json({
    status: 'healthy',
    service: 'rajdeep-enterprises-api',
    hub: 'Mathura Refinery Gate, UP',
    timestamp: new Date().toISOString()
  });
}
