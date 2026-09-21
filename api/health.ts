const ALLOWED_ORIGINS: readonly string[] = [
  'https://rajdeep-enterprises.vercel.app',
  'https://rajdeepenterprises.in',
  'https://www.rajdeepenterprises.in',
];

export default function handler(req: any, res: any) {
  res.setHeader('X-Content-Type-Options', 'nosniff');

  const incomingOrigin = (req.headers?.origin || req.headers?.Origin || '') as string;
  if (incomingOrigin) {
    const trimmed = incomingOrigin.trim().replace(/\/$/, '');
    const isAllowed =
      ALLOWED_ORIGINS.includes(trimmed) ||
      (process.env.SITE_URL && trimmed === process.env.SITE_URL.trim().replace(/\/$/, '')) ||
      (process.env.NODE_ENV !== 'production' &&
        (trimmed.startsWith('http://localhost:') ||
          trimmed.startsWith('http://127.0.0.1:') ||
          trimmed.startsWith('http://0.0.0.0:')));

    if (isAllowed) {
      res.setHeader('Access-Control-Allow-Origin', trimmed);
      res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    }
  }

  if (req.method === 'OPTIONS') {
    if (typeof res.status(204).end === 'function') {
      res.status(204).end();
    }
    return;
  }

  return res.status(200).json({
    status: 'healthy',
    service: 'rajdeep-enterprises-api',
    smtpConfigured: Boolean(process.env.SMTP_USER && process.env.SMTP_PASS),
    timestamp: new Date().toISOString(),
  });
}
