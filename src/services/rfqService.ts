import { StructuredRfq } from '../types/chat';

export interface SubmitAiRfqParams {
  rfq: StructuredRfq;
  honeypot?: string;
}

export interface SubmitAiRfqResult {
  success: boolean;
  rfqReference?: string;
  message?: string;
  error?: string;
}

/**
 * Submits the confirmed Rajdeep AI RFQ to the backend /api/rfq endpoint.
 * Validates payload, handles timeouts, and reports clean status.
 * Never touches or exposes private SMTP credentials or API keys.
 */
export async function submitAiRfq(params: SubmitAiRfqParams): Promise<SubmitAiRfqResult> {
  const { rfq, honeypot } = params;

  if (!rfq) {
    return {
      success: false,
      error: 'No RFQ requirement data provided.',
    };
  }

  // Basic client pre-check
  const hasProduct = Boolean((rfq.product && rfq.product.trim()) || (rfq.material && rfq.material.trim()));
  if (!hasProduct) {
    return {
      success: false,
      error: 'Please specify the product or material requirement.',
    };
  }

  const cleanName = (rfq.customerName || '').trim();
  if (!cleanName || cleanName.length < 2) {
    return {
      success: false,
      error: 'Please provide a valid contact person or customer name.',
    };
  }

  const cleanPhone = (rfq.phone || '').replace(/\D/g, '');
  const cleanEmail = (rfq.email || '').trim();
  if (cleanPhone.length < 10 && !cleanEmail) {
    return {
      success: false,
      error: 'Please provide a valid 10-digit mobile number or email address.',
    };
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  try {
    const payload = {
      source: 'Rajdeep AI Chatbot',
      contractorName: rfq.customerName,
      customerName: rfq.customerName,
      companyName: rfq.companyName,
      phoneNumber: rfq.phone,
      phone: rfq.phone,
      emailAddress: rfq.email,
      email: rfq.email,
      product: rfq.product,
      material: rfq.material,
      grade: rfq.grade,
      quantity: rfq.quantity,
      unit: rfq.unit,
      thickness: rfq.thickness,
      dimensions: rfq.dimensions,
      specifications: rfq.specifications,
      application: rfq.application,
      siteLocation: rfq.deliveryLocation,
      deliveryLocation: rfq.deliveryLocation,
      requiredBy: rfq.requiredBy,
      notes: rfq.additionalNotes,
      additionalNotes: rfq.additionalNotes,
      website_hp: honeypot || '',
      status: 'confirmed',
    };

    const response = await fetch('/api/rfq', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const data = await response.json().catch(() => ({}));

    if (!response.ok || !data.success) {
      const errorMsg =
        data?.error ||
        "We couldn't submit your enquiry right now. Please try again or contact Rajdeep Enterprises directly.";
      return {
        success: false,
        error: errorMsg,
      };
    }

    return {
      success: true,
      rfqReference: data.rfqReference,
      message: data.message || 'Your enquiry has been submitted successfully.',
    };
  } catch (err: any) {
    clearTimeout(timeoutId);
    return {
      success: false,
      error: "We couldn't submit your enquiry right now. Please try again or contact Rajdeep Enterprises directly.",
    };
  }
}
