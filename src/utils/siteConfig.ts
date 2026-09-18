import { COMPANY_INFO } from '../data/companyData';

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

  // Company core identity sourced directly from companyData (Single Source of Truth)
  get businessName(): string { return COMPANY_INFO.name; },
  get proprietor(): string { return COMPANY_INFO.contactPerson; },
  get phone(): string { return COMPANY_INFO.phone; },
  get secondaryPhone(): string { return COMPANY_INFO.secondaryPhone; },
  get internationalPhone(): string { return `+91${COMPANY_INFO.phone.replace(/^0/, '')}`; },
  get whatsappNumber(): string { return COMPANY_INFO.whatsappNumber; },
  get email(): string { return COMPANY_INFO.email; },
  get address(): string { return COMPANY_INFO.fullAddress; },
  get landmark(): string { return COMPANY_INFO.landmark; },
  get googleMapsUrl(): string { return COMPANY_INFO.googleMapsUrl; },
  get directionsUrl(): string { return COMPANY_INFO.directionsUrl; },
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
