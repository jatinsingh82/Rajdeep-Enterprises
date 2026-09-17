/**
 * Site Configuration & Production URL Management
 * 
 * Centralizes the production domain, canonical URLs, and metadata links.
 * Works seamlessly with custom domains (e.g. https://rajdeepenterprises.in),
 * Vercel preview environments, or local development without hardcoding.
 */

// Production custom domain or Vercel preview domain configured via environment variables
export const SITE_CONFIG = {
  // If VITE_SITE_URL is set (e.g. https://rajdeepenterprises.in), use it.
  // Otherwise in the browser, safely fall back to window.location.origin.
  // In server or build-time context where window is undefined, fall back to empty string.
  get siteUrl(): string {
    if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SITE_URL) {
      return (import.meta.env.VITE_SITE_URL as string).replace(/\/$/, '');
    }
    if (typeof window !== 'undefined' && window.location?.origin) {
      return window.location.origin.replace(/\/$/, '');
    }
    return '';
  },

  // Fallback production origin used for generating static sitemaps & SEO schemas
  defaultProductionDomain: 'https://rajdeep-enterprises.vercel.app',

  // Google Analytics 4 Measurement ID (e.g., 'G-XXXXXXXXXX')
  get gaMeasurementId(): string {
    return (import.meta.env?.VITE_GA_MEASUREMENT_ID as string) || '';
  },

  // Google Search Console Site Verification Token
  get googleSiteVerification(): string {
    return (import.meta.env?.VITE_GOOGLE_SITE_VERIFICATION as string) || '';
  },

  // Company core identity
  businessName: 'Rajdeep Enterprises',
  proprietor: 'Raj Singh Tarkar',
  phone: '09997993895',
  secondaryPhone: '08923993895',
  internationalPhone: '+919997993895',
  whatsappNumber: '919997993895',
  email: 'rjsinghtarkar@gmail.com',
  address: '15/1, U.P. S.I.D.C. Complex, Refinery Main Gate, Mathura, Uttar Pradesh - 281005',
  landmark: 'Opposite Refinery Main Gate',
  googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Rajdeep+Enterprises,+15/1,+U.P.+S.I.D.C.+Complex,+Refinery+Main+Gate,+Mathura,+Uttar+Pradesh+-+281005',
  directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=Rajdeep+Enterprises,+15/1,+U.P.+S.I.D.C.+Complex,+Refinery+Main+Gate,+Mathura,+Uttar+Pradesh+-+281005',
};

/**
 * Returns a fully-qualified absolute URL for any asset or route.
 */
export function getAbsoluteUrl(path = '/'): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const base = SITE_CONFIG.siteUrl;
  if (!base) {
    return cleanPath;
  }
  return `${base}${cleanPath}`;
}
