import { ChatMessage } from '../types/chat';
import { COMPANY_INFO, PRODUCTS } from '../data/companyData';

export interface SendMessageOptions {
  message: string;
  history: ChatMessage[];
}

export interface ChatServiceResponse {
  text: string;
  isError?: boolean;
}

/**
 * Intelligent Mock Response Engine for Rajdeep AI
 * 
 * Note: Designed cleanly so in the next step, this service can easily route
 * to a backend AI API (e.g. `/api/chat` with Gemini) without any changes
 * to the chatbot UI components.
 */
export async function sendChatMessage(options: SendMessageOptions): Promise<ChatServiceResponse> {
  const { message } = options;
  const normalized = message.trim().toLowerCase();

  // Simulate network latency (500ms - 800ms) for realistic UX
  await new Promise((resolve) => setTimeout(resolve, 650));

  // 1. Suggested Questions & Core Intent Matching
  if (normalized.includes('what products do you supply') || normalized.includes('products') && normalized.includes('supply')) {
    return {
      text: `We supply a comprehensive range of certified industrial safety PPE and refinery materials, including:

• **Industrial Safety PPE**: Helmets (IS:2925), Karam Safety Shoes (IS:15298), Full Body Harnesses (IS:3521), Cut-Resistant & Rubber Gloves, Safety Goggles & Gum Boots.
• **Gaskets & Jointing**: Genuine Champion Gasket Sheets (Style 54 Super, Style 20, Style 39) & cut gaskets.
• **Welding Consumables**: Mild Steel & Low Hydrogen Welding Rods (E6013, E7018), Cutting Torches & Regulators.
• **NDT Inspection**: DPT Dye Penetrant Testing Kits (Cleaner, Penetrant, Developer).
• **Site Management**: Road safety cones, lane marking tapes, and official site registers & documentation books.

You can browse our full catalog on this website or add items directly to your Bulk RFQ!`,
    };
  }

  if (normalized.includes('need a quotation') || normalized.includes('quotation') || normalized.includes('quote') || normalized.includes('rate') || normalized.includes('price')) {
    return {
      text: `You can get an instant commercial quotation in 3 convenient ways:

1. **Online Bulk RFQ**: Add products from our catalog to the RFQ cart on this page and submit your requirements.
2. **Direct WhatsApp**: Message our sales desk at **+91 ${COMPANY_INFO.phone}** with your Bill of Quantities (BOQ).
3. **Telephone**: Call Raj Singh Tarkar directly at **+91 ${COMPANY_INFO.phone}**.

We offer competitive B2B wholesale rates, full GST tax invoicing (09AAPFR9321B1Z2), and Manufacturer Test Certificates (MTC) for gate clearance.`,
    };
  }

  if (normalized.includes('tell me about your materials') || normalized.includes('materials') || normalized.includes('quality') || normalized.includes('champion') || normalized.includes('gasket')) {
    return {
      text: `All materials supplied by Rajdeep Enterprises comply strictly with BIS and international standards:

• **Champion Gasket Jointing**: High-grade compressed asbestos and non-asbestos sheets engineered for high-pressure steam, hydrocarbons, and aggressive refinery service (up to 550°C).
• **Welding Electrodes**: Low-hydrogen, high-tensile electrodes (AWS E7018 / E6013) with full batch test certificates.
• **Safety Shoes & Boots**: Steel-toe caps tested for 200 Joules impact resistance, oil/acid-resistant dual density PU soles.
• **Fall Protection**: EN 361 / IS:3521 certified full-body harnesses with forged alloy snap hooks.
• **Fasteners**: High-tensile nuts, bolts, and stud bolts conforming to Grade 8.8 and Grade 10.9.

We provide batch test reports and MTCs on demand for plant security inspection.`,
    };
  }

  if (normalized.includes('how can i contact') || normalized.includes('contact') || normalized.includes('phone') || normalized.includes('address') || normalized.includes('location') || normalized.includes('reach')) {
    return {
      text: `You can reach Rajdeep Enterprises directly:

📍 **Depot Address**: ${COMPANY_INFO.address}
📞 **Phone / Support**: +91 ${COMPANY_INFO.phone}
💬 **WhatsApp**: +91 ${COMPANY_INFO.whatsappNumber}
✉️ **Email**: ${COMPANY_INFO.email}
⏰ **Operating Hours**: Monday – Saturday, 09:00 AM – 08:00 PM (IST)

Our location right at the Refinery Main Gate in UP SIDC Complex enables emergency 30–60 minute dispatch during plant turnarounds and shutdowns!`,
    };
  }

  // 2. Specific Product Keyword Matching
  const matchedProduct = PRODUCTS.find((p) =>
    normalized.includes(p.name.toLowerCase()) ||
    normalized.includes(p.category.toLowerCase()) ||
    normalized.includes(p.id.toLowerCase())
  );

  if (matchedProduct) {
    return {
      text: `**${matchedProduct.name}** (${matchedProduct.category})

${matchedProduct.fullDescription}

**Key Specifications:**
${matchedProduct.specifications.slice(0, 3).map((s) => `• ${s}`).join('\n')}

Would you like to request a quotation for this item? You can click the "Request Quote" button in the catalog or share your quantity requirement with me!`,
    };
  }

  if (normalized.includes('shutdown') || normalized.includes('turnaround') || normalized.includes('emergency')) {
    return {
      text: `During Mathura Refinery shutdowns and annual turnarounds, Rajdeep Enterprises provides **emergency 30 to 60 minute dispatch** for essential safety PPE, replacement harnesses, Champion gasket sheets, and welding consumables.

Call our priority hotline at **+91 ${COMPANY_INFO.phone}** for immediate dispatch to Gate 1 or Gate 2.`,
    };
  }

  if (normalized.includes('gst') || normalized.includes('tax') || normalized.includes('billing')) {
    return {
      text: `Yes, all supplies come with 100% compliant GST invoices for input tax credit (ITC).
• **GST Status**: ${COMPANY_INFO.gstStatus}
• **Firm**: ${COMPANY_INFO.name}
• **PAN India Supply**: Intrastate (CGST/SGST) & Interstate (IGST) supported across all states.`,
    };
  }

  // 3. Helpful Default Fallback
  return {
    text: `Thank you for your message! As the Rajdeep Enterprises assistant, I can assist you with:

• Product specifications (safety shoes, harnesses, Champion gaskets, welding electrodes)
• RFQs and pricing quotations
• Refinery shutdown & emergency site requirements
• Contact and location details at UP SIDC Complex, Mathura

You can also connect with our sales team directly at **+91 ${COMPANY_INFO.phone}** or via WhatsApp for immediate support!`,
  };
}
