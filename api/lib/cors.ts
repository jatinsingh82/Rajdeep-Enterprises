/**
 * Strict Production CORS Configuration
 *
 * Enforces explicit origin validation against genuine production and development domains.
 * Rejects wildcard patterns, arbitrary vercel subdomains, and loose substring matches.
 */

const ALLOWED_ORIGINS: readonly string[] = [
  'https://rajdeep-enterprises.vercel.app',
  'https://rajdeepenterprises.in',
  'https://www.rajdeepenterprises.in',
];

export function getValidatedOrigin(req: any): string | null {
  const incomingOrigin = (req.headers?.origin || req.headers?.Origin || '') as string;

  // Requests without an Origin header (same-origin browser navigation, direct cURL, server-to-server)
  if (!incomingOrigin) {
    return null;
  }

  const trimmedOrigin = incomingOrigin.trim().replace(/\/$/, '');

  // 1. Check strict static allowlist
  if (ALLOWED_ORIGINS.includes(trimmedOrigin)) {
    return trimmedOrigin;
  }

  // 2. Check explicitly configured SITE_URL from environment
  const configuredSiteUrl = process.env.SITE_URL?.trim().replace(/\/$/, '');
  if (configuredSiteUrl && trimmedOrigin === configuredSiteUrl) {
    return trimmedOrigin;
  }

  // 3. Localhost & development origins (strictly non-production)
  if (process.env.NODE_ENV !== 'production') {
    const isLocal =
      trimmedOrigin.startsWith('http://localhost:') ||
      trimmedOrigin.startsWith('http://127.0.0.1:') ||
      trimmedOrigin.startsWith('http://0.0.0.0:');
    if (isLocal) {
      return trimmedOrigin;
    }
  }

  // Origin rejected by strict allowlist
  return null;
}

export function handleCors(req: any, res: any): boolean {
  res.setHeader('X-Content-Type-Options', 'nosniff');

  const incomingOrigin = req.headers?.origin || req.headers?.Origin || '';
  const validatedOrigin = getValidatedOrigin(req);

  if (incomingOrigin) {
    if (validatedOrigin) {
      res.setHeader('Access-Control-Allow-Origin', validatedOrigin);
      res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With');
      res.setHeader('Access-Control-Max-Age', '86400');
      res.setHeader('Vary', 'Origin');
    } else {
      // Origin is explicitly disallowed
      if (req.method === 'OPTIONS') {
        res.status(403).json({ success: false, error: 'Origin not allowed by CORS policy.' });
        return false;
      }
      res.status(403).json({ success: false, error: 'Origin not allowed by CORS policy.' });
      return false;
    }
  }

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return false;
  }

  return true;
}
