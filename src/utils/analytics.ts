/**
 * Centralized Analytics & Business Conversion Tracking Utility
 * 
 * Tracks key lead generation and procurement interactions without delaying or blocking
 * user actions. If Google Analytics 4 (VITE_GA_MEASUREMENT_ID) is not configured,
 * events are safely logged to the console in development mode as a no-op, avoiding errors.
 * 
 * Does NOT collect unnecessary personal data or private credentials.
 */

import { SITE_CONFIG } from './siteConfig';

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
  }
}

/**
 * Safely dispatches an event to Google Analytics (gtag) if initialized.
 * Guaranteed never to throw or block execution.
 */
function sendEvent(eventName: string, eventParams: Record<string, any> = {}) {
  try {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', eventName, {
        ...eventParams,
        send_to: SITE_CONFIG.gaMeasurementId || undefined,
      });
    }

    // In development mode, log tracked events for QA auditing
    if (import.meta.env?.DEV) {
      // eslint-disable-next-line no-console
      console.debug(`[Analytics Event] ${eventName}:`, eventParams);
    }
  } catch {
    // Fail silently so customer conversion is never interrupted
  }
}

/**
 * Initializes Google Analytics 4 script tag dynamically ONLY when a valid
 * VITE_GA_MEASUREMENT_ID is supplied.
 */
export function initAnalytics(): void {
  if (typeof window === 'undefined') return;

  const measurementId = SITE_CONFIG.gaMeasurementId;
  if (!measurementId || measurementId.trim() === '' || measurementId.startsWith('G-XXXXX')) {
    // GA4 not yet configured by user; do nothing and keep site clean
    return;
  }

  // Prevent duplicate script injection
  if (document.getElementById('ga-gtag-script')) return;

  try {
    const script = document.createElement('script');
    script.id = 'ga-gtag-script';
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function () {
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer?.push(arguments);
    };

    window.gtag('js', new Date());
    window.gtag('config', measurementId, {
      anonymize_ip: true,
      cookie_flags: 'SameSite=None;Secure',
    });
  } catch {
    // Ignore script loading errors
  }
}

// -------------------------------------------------------------
// Core Business Event Trackers (Primary & Secondary Conversions)
// -------------------------------------------------------------

/**
 * Primary Conversion: Enquiry Submitted via Form or API
 */
export function trackEnquirySubmitted(data: {
  enquiryId?: string;
  productRequirement: string;
  category?: string;
  hasCompany?: boolean;
}): void {
  sendEvent('generate_lead', {
    event_category: 'Procurement',
    event_label: data.productRequirement,
    enquiry_id: data.enquiryId || 'direct',
    requirement_category: data.category || 'General',
    is_corporate_client: Boolean(data.hasCompany),
  });
}

/**
 * Primary Conversion: RFQ Bill of Quantities Submitted
 */
export function trackRfqSubmitted(data: {
  rfqReference?: string;
  itemCount: number;
  hasMtcRequest?: boolean;
}): void {
  sendEvent('rfq_submitted', {
    event_category: 'Procurement',
    event_label: data.rfqReference || 'RFQ',
    item_count: data.itemCount,
    requested_mtc: Boolean(data.hasMtcRequest),
    value: data.itemCount, // numeric indicator for analytics
  });
}

/**
 * Primary Conversion: WhatsApp Contact Clicked
 */
export function trackWhatsAppClick(source: string, context?: string): void {
  sendEvent('contact_whatsapp', {
    event_category: 'Lead Generation',
    event_label: source,
    context: context || 'Direct Chat',
  });
}

/**
 * Primary Conversion: Phone Call Clicked
 */
export function trackCallClick(phoneNumber: string, source: string): void {
  sendEvent('contact_call', {
    event_category: 'Lead Generation',
    event_label: source,
    target_number: phoneNumber,
  });
}

/**
 * Secondary Conversion: GPS Directions / Map Clicked
 */
export function trackDirectionsClick(source: string): void {
  sendEvent('view_location_directions', {
    event_category: 'Engagement',
    event_label: source,
    destination: 'UP SIDC Complex, Refinery Main Gate, Mathura',
  });
}

/**
 * Secondary Conversion: Product Detail Viewed
 */
export function trackProductView(productId: string, productName: string, category: string): void {
  sendEvent('view_item', {
    event_category: 'Catalog',
    item_id: productId,
    item_name: productName,
    item_category: category,
  });
}

/**
 * Secondary Conversion: Search Performed
 */
export function trackSearch(searchQuery: string, resultsCount: number): void {
  if (!searchQuery.trim()) return;
  sendEvent('search', {
    search_term: searchQuery.trim(),
    results_found: resultsCount,
  });
}

/**
 * Secondary Conversion: Category Filter Selected
 */
export function trackCategoryFilter(category: string): void {
  sendEvent('select_content', {
    content_type: 'product_category',
    item_id: category,
  });
}

/**
 * Secondary Conversion: Enquiry Modal Opened
 */
export function trackEnquiryStarted(productOrSource: string): void {
  sendEvent('begin_lead_form', {
    event_category: 'Procurement',
    event_label: productOrSource,
  });
}

/**
 * Secondary Conversion: RFQ Modal / Cart Opened
 */
export function trackRfqStarted(itemCount: number): void {
  sendEvent('view_cart', {
    event_category: 'Procurement',
    cart_item_count: itemCount,
  });
}

/**
 * Secondary Conversion: Custom Quote / Specialized Sourcing Clicked
 */
export function trackCustomQuoteClick(productOrKit: string): void {
  sendEvent('custom_quote_click', {
    event_category: 'Procurement',
    item_name: productOrKit,
  });
}

/**
 * Secondary Conversion: Technical Guide / Standards / Tools Opened
 */
export function trackGuideOpened(guideId: string, guideTitle: string): void {
  sendEvent('view_guide', {
    event_category: 'Technical Resources',
    guide_id: guideId,
    guide_title: guideTitle,
  });
}

/**
 * Funnel Step Tracking (e.g., product modal opened, rfq step, enquiry step)
 */
export function trackRFQStep(stepName: string, detail?: string): void {
  sendEvent('rfq_funnel_step', {
    event_category: 'Procurement Funnel',
    step_name: stepName,
    detail: detail || '',
  });
}

