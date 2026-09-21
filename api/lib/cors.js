const ALLOWED_ORIGINS = [
  "https://rajdeep-enterprises.vercel.app",
  "https://rajdeepenterprises.in",
  "https://www.rajdeepenterprises.in"
];
function getValidatedOrigin(req) {
  const incomingOrigin = req.headers?.origin || req.headers?.Origin || "";
  if (!incomingOrigin) {
    return null;
  }
  const trimmedOrigin = incomingOrigin.trim().replace(/\/$/, "");
  if (ALLOWED_ORIGINS.includes(trimmedOrigin)) {
    return trimmedOrigin;
  }
  const configuredSiteUrl = process.env.SITE_URL?.trim().replace(/\/$/, "");
  if (configuredSiteUrl && trimmedOrigin === configuredSiteUrl) {
    return trimmedOrigin;
  }
  if (process.env.NODE_ENV !== "production") {
    const isLocal = trimmedOrigin.startsWith("http://localhost:") || trimmedOrigin.startsWith("http://127.0.0.1:") || trimmedOrigin.startsWith("http://0.0.0.0:");
    if (isLocal) {
      return trimmedOrigin;
    }
  }
  return null;
}
function handleCors(req, res) {
  res.setHeader("X-Content-Type-Options", "nosniff");
  const incomingOrigin = req.headers?.origin || req.headers?.Origin || "";
  const validatedOrigin = getValidatedOrigin(req);
  if (incomingOrigin) {
    if (validatedOrigin) {
      res.setHeader("Access-Control-Allow-Origin", validatedOrigin);
      res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
      res.setHeader("Access-Control-Allow-Headers", "Content-Type, X-Requested-With");
      res.setHeader("Access-Control-Max-Age", "86400");
      res.setHeader("Vary", "Origin");
    } else {
      if (req.method === "OPTIONS") {
        res.status(403).json({ success: false, error: "Origin not allowed by CORS policy." });
        return false;
      }
      res.status(403).json({ success: false, error: "Origin not allowed by CORS policy." });
      return false;
    }
  }
  if (req.method === "OPTIONS") {
    res.status(204).end();
    return false;
  }
  return true;
}
export {
  getValidatedOrigin,
  handleCors
};
