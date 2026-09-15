export default function handler(req: any, res: any) {
  // Production CORS & Security Headers
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

