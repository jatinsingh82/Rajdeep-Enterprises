/**
 * Centralized Google Analytics 4 (GA4) Tracking Utility
 * 
 * Implements professional, client-side event tracking for key business interactions.
 * 
 * Rules:
 * - Uses existing environment variable VITE_GA_MEASUREMENT_ID.
 * - If no valid GA4 Measurement ID exists, operates safely as a no-op without fake IDs or console errors.
 * - In development mode, logs events to console.debug for verification.
 * - Prevents duplicate initialization and handles React re-renders safely.
 * - Zero exposure of sensitive secrets or server credentials.
 */

import { SITE_CONFIG } from './siteConfig';

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
    __ga4_initialized?: boolean;
  }
}

/**
 * Validates whether a given string is a real GA4 Measurement ID pattern (e.g., G-XXXXXXXXXX)
 * Rejects empty strings, placeholders like 'G-XXXXX', and invalid formats.
 */
function isValidGa4Id(id?: string | null): boolean {
  if (!id || typeof id !== 'string') return false;
  const trimmed = id.trim();
  if (!trimmed || trimmed.startsWith('G-XXXX') || trimmed === 'G-EXAMPLE') {
    return false;
  }
  // GA4 IDs begin with 'G-' followed by alphanumeric characters
  return /^G-[A-Z0-9]+$/i.test(trimmed);
}

/**
 * Initializes Google Analytics 4 script tag dynamically ONLY when a valid
 * VITE_GA_MEASUREMENT_ID is supplied.
 * 
 * Idempotent: Avoids duplicate script injection and setup across React lifecycles.
 */
export function initAnalytics(): void {
  if (typeof window === 'undefined') return;

  // Prevent duplicate initialization
  if (window.__ga4_initialized || document.getElementById('ga4-gtag-script')) {
    return;
  }

  const measurementId = SITE_CONFIG.gaMeasurementId?.trim();

  // If no valid GA4 Measurement ID exists, prepare dataLayer and safe dummy gtag without injecting script
  if (!isValidGa4Id(measurementId)) {
    window.dataLayer = window.dataLayer || [];
    if (typeof window.gtag !== 'function') {
      window.gtag = function () {
        // eslint-disable-next-line prefer-rest-params
        window.dataLayer?.push(arguments);
      };
    }
    if (import.meta.env?.DEV) {
      // eslint-disable-next-line no-console
      console.info('[Analytics] VITE_GA_MEASUREMENT_ID is not configured. GA4 tracking is in audit mode (no network requests).');
    }
    window.__ga4_initialized = true;
    return;
  }

  try {
    // 1. Inject the official Google Analytics gtag.js script
    const script = document.createElement('script');
    script.id = 'ga4-gtag-script';
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
    document.head.appendChild(script);

    // 2. Initialize dataLayer and gtag function
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () {
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer?.push(arguments);
    };

    window.gtag('js', new Date());
    window.gtag('config', measurementId, {
      anonymize_ip: true,
      send_page_view: true,
      cookie_flags: 'SameSite=None;Secure',
    });

    window.__ga4_initialized = true;

    if (import.meta.env?.DEV) {
      // eslint-disable-next-line no-console
      console.info(`[Analytics] Google Analytics 4 initialized successfully with ID: ${measurementId}`);
    }
  } catch (error) {
    // Fail silently in production so customer browsing is never interrupted
    if (import.meta.env?.DEV) {
      // eslint-disable-next-line no-console
      console.warn('[Analytics] Failed to initialize GA4 script:', error);
    }
  }
}

/**
 * Safely dispatches a GA4 event to gtag.
 * Never throws, never delays user actions, and logs to console in development mode.
 */
function sendGA4Event(eventName: string, eventParams: Record<string, any> = {}): void {
  try {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', eventName, eventParams);
    }

    // In development mode, log tracked events for QA auditing
    if (import.meta.env?.DEV) {
      // eslint-disable-next-line no-console
      console.debug(`[GA4 Event] ${eventName}:`, eventParams);
    }
  } catch {
    // Fail silently so customer flow is never blocked
  }
}

// ============================================================================
// 11 Core Customer Interaction Events
// ============================================================================

/**
 * 1. WhatsApp click
 * event name: whatsapp_click
 */
export function trackWhatsAppClick(
  sourceOrParams: string | { source: string; context?: string; productName?: string },
  context?: string
): void {
  if (typeof sourceOrParams === 'object') {
    sendGA4Event('whatsapp_click', {
      source: sourceOrParams.source,
      context: sourceOrParams.context || 'direct_chat',
      product_name: sourceOrParams.productName || undefined,
    });
  } else {
    sendGA4Event('whatsapp_click', {
      source: sourceOrParams,
      context: context || 'direct_chat',
    });
  }
}

/**
 * 2. Call click
 * event name: phone_click
 */
export function trackPhoneClick(
  phoneOrParams: string | { phoneNumber: string; source: string },
  source?: string
): void {
  if (typeof phoneOrParams === 'object') {
    sendGA4Event('phone_click', {
      phone_number: phoneOrParams.phoneNumber,
      source: phoneOrParams.source,
    });
  } else {
    sendGA4Event('phone_click', {
      phone_number: phoneOrParams,
      source: source || 'direct_link',
    });
  }
}

// Alias for backwards-compatibility
export const trackCallClick = trackPhoneClick;

/**
 * 3. Directions / location click
 * event name: directions_click
 */
export function trackDirectionsClick(
  sourceOrParams: string | { source: string; destination?: string } = 'map_link'
): void {
  if (typeof sourceOrParams === 'object') {
    sendGA4Event('directions_click', {
      source: sourceOrParams.source,
      destination: sourceOrParams.destination || 'UP SIDC Complex, Refinery Main Gate, Mathura',
    });
  } else {
    sendGA4Event('directions_click', {
      source: sourceOrParams,
      destination: 'UP SIDC Complex, Refinery Main Gate, Mathura',
    });
  }
}

/**
 * 4. Product view
 * event name: view_product
 * Parameters: product_name, product_id, category
 */
export function trackProductView(
  productOrId: string | { productId: string; productName: string; category: string },
  productName?: string,
  category?: string
): void {
  if (typeof productOrId === 'object') {
    sendGA4Event('view_product', {
      product_id: productOrId.productId,
      product_name: productOrId.productName,
      category: productOrId.category,
      // Also send standard item format for enhanced e-commerce
      items: [
        {
          item_id: productOrId.productId,
          item_name: productOrId.productName,
          item_category: productOrId.category,
        }
      ]
    });
  } else {
    sendGA4Event('view_product', {
      product_id: productOrId,
      product_name: productName || '',
      category: category || 'General',
      items: [
        {
          item_id: productOrId,
          item_name: productName || '',
          item_category: category || 'General',
        }
      ]
    });
  }
}

/**
 * 5. Quote request started
 * event name: quote_start
 */
export function trackQuoteStart(params: {
  productName?: string;
  category?: string;
  source: string;
}): void {
  sendGA4Event('quote_start', {
    product_name: params.productName || 'General Requirement',
    category: params.category || 'General',
    source: params.source,
  });
}

// Alias for backwards-compatibility
export function trackEnquiryStarted(productOrSource: string): void {
  trackQuoteStart({
    productName: productOrSource,
    source: 'modal_open',
  });
}

/**
 * 6. Quote request submitted
 * event name: quote_submit
 */
export function trackQuoteSubmit(params: {
  productName: string;
  category?: string;
  quantity?: string;
  enquiryId?: string;
  hasCompany?: boolean;
}): void {
  sendGA4Event('quote_submit', {
    product_name: params.productName,
    category: params.category || 'General',
    quantity: params.quantity || 'Not specified',
    enquiry_id: params.enquiryId || 'direct',
    has_company: Boolean(params.hasCompany),
  });
}

// Alias for backwards-compatibility
export function trackEnquirySubmitted(data: {
  enquiryId?: string;
  productRequirement: string;
  category?: string;
  hasCompany?: boolean;
}): void {
  trackQuoteSubmit({
    productName: data.productRequirement,
    category: data.category,
    enquiryId: data.enquiryId,
    hasCompany: data.hasCompany,
  });
}

/**
 * 7. RFQ item added
 * event name: rfq_add_item
 */
export function trackRfqAddItem(params: {
  productId: string;
  productName: string;
  category: string;
  quantity?: number;
}): void {
  sendGA4Event('rfq_add_item', {
    product_id: params.productId,
    product_name: params.productName,
    category: params.category,
    quantity: params.quantity || 1,
  });
}

/**
 * 8. RFQ submitted
 * event name: rfq_submit
 */
export function trackRfqSubmit(params: {
  rfqReference?: string;
  itemCount: number;
  totalQuantity?: number;
  hasCompany?: boolean;
  hasMtcRequest?: boolean;
  requiresMtc?: boolean;
}): void {
  sendGA4Event('rfq_submit', {
    rfq_reference: params.rfqReference || 'RFQ-DIRECT',
    item_count: params.itemCount,
    total_quantity: params.totalQuantity,
    has_company: Boolean(params.hasCompany),
    has_mtc_request: Boolean(params.hasMtcRequest ?? params.requiresMtc),
  });
}

// Alias for backwards-compatibility
export function trackRfqSubmitted(data: {
  rfqReference?: string;
  itemCount: number;
  totalQuantity?: number;
  hasCompany?: boolean;
  hasMtcRequest?: boolean;
  requiresMtc?: boolean;
}): void {
  trackRfqSubmit(data);
}

/**
 * 9. Catalogue download
 * event name: catalogue_download
 */
export function trackCatalogueDownload(params?: {
  source?: string;
  format?: string;
}): void {
  sendGA4Event('catalogue_download', {
    source: params?.source || 'website_button',
    format: params?.format || 'pdf',
  });
}

/**
 * 10. Datasheet download
 * event name: datasheet_download
 * Parameters: product_name, product_id, category
 */
export function trackDatasheetDownload(params: {
  productId: string;
  productName: string;
  category: string;
}): void {
  sendGA4Event('datasheet_download', {
    product_id: params.productId,
    product_name: params.productName,
    category: params.category,
  });
}

/**
 * 11. Callback request
 * event name: callback_request
 */
export function trackCallbackRequest(params: {
  source: string;
  phoneNumber?: string;
  urgency?: string;
  notes?: string;
}): void {
  sendGA4Event('callback_request', {
    source: params.source,
    phone_number: params.phoneNumber || undefined,
    urgency: params.urgency || 'standard',
    notes: params.notes || undefined,
  });
}

// ============================================================================
// Additional Helpful Engagement Helpers (Preserved & Typed)
// ============================================================================

export function trackSearch(searchQuery: string, resultsCount: number): void {
  if (!searchQuery.trim()) return;
  sendGA4Event('search', {
    search_term: searchQuery.trim(),
    results_found: resultsCount,
  });
}

export function trackCategoryFilter(category: string): void {
  sendGA4Event('select_content', {
    content_type: 'product_category',
    item_id: category,
  });
}

export function trackRfqStarted(itemCount: number): void {
  sendGA4Event('view_cart', {
    cart_item_count: itemCount,
  });
}

export function trackCustomQuoteClick(productOrKit: string): void {
  sendGA4Event('custom_quote_click', {
    item_name: productOrKit,
  });
}

export function trackGuideOpened(guideId: string, guideTitle: string): void {
  sendGA4Event('view_guide', {
    guide_id: guideId,
    guide_title: guideTitle,
  });
}

export function trackRFQStep(stepName: string, detail?: string): void {
  sendGA4Event('rfq_funnel_step', {
    step_name: stepName,
    detail: detail || '',
  });
}
