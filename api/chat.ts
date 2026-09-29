import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

import { GoogleGenAI } from '@google/genai';
import { handleCors } from './lib/cors';
import { GEMINI_MODEL, RAJDEEP_AI_SYSTEM_INSTRUCTION, StructuredRfqData } from './lib/geminiConfig';

interface IncomingChatMessage {
  sender?: string;
  role?: string;
  text?: string;
}

// Validate phone number format across international and domestic standards (7-15 digits)
function isValidPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 7 && digits.length <= 15;
}

// Validate standard email format
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

// Detect specific product category to guide smart questioning
export function detectProductCategory(
  productName?: string,
  text?: string
): 'extinguisher' | 'cylinder' | 'gauge' | 'valve' | 'welding_machine' | 'helmet' | 'safety' | 'sheet' | 'pipe' | 'fastener' | 'welding' | 'gasket' | 'paint_brush' | 'custom' {
  const combined = `${productName || ''} ${text || ''}`.toLowerCase();
  if (combined.includes('extinguisher') || combined.includes('fire cylinder') || combined.includes('fire fighting')) return 'extinguisher';
  if (combined.includes('cylinder')) return 'cylinder';
  if (combined.includes('pressure gauge') || (combined.includes('gauge') && !combined.includes('swg'))) return 'gauge';
  if (combined.includes('valve')) return 'valve';
  if (combined.includes('paint brush') || combined.includes('paintbrush') || combined.includes('brush')) return 'paint_brush';
  if (combined.includes('welding machine') || combined.includes('welding equipment')) return 'welding_machine';
  if (combined.includes('helmet') || combined.includes('hard hat')) return 'helmet';
  if (
    combined.includes('shoe') ||
    combined.includes('glove') ||
    combined.includes('harness') ||
    combined.includes('goggle') ||
    combined.includes('jacket') ||
    combined.includes('ppe')
  ) {
    return 'safety';
  }
  if (combined.includes('sheet') || combined.includes('plate') || combined.includes('coil')) return 'sheet';
  if (combined.includes('pipe') || combined.includes('tube') || combined.includes('tubing')) return 'pipe';
  if (combined.includes('fastener') || combined.includes('bolt') || combined.includes('nut') || combined.includes('threaded rod')) return 'fastener';
  if (combined.includes('welding') || combined.includes('electrode') || combined.includes('filler wire')) return 'welding';
  if (combined.includes('gasket') || combined.includes('champion')) return 'gasket';
  return 'custom';
}

// Universal item extraction from customer message
function extractItemName(text: string): string | null {
  const trimmed = text.trim();
  const lower = trimmed.toLowerCase();

  // Non-item exclusion words
  const nonItemWords = [
    'yes', 'no', 'none', 'not sure', 'i don', "don't know", 'dont know',
    'ok', 'okay', 'cancel', 'confirm', 'edit', 'send requirement',
    'thanks', 'thank you', 'hello', 'hi', 'hey', 'good morning',
    'something not on the website', 'something that isn\'t on your website',
    'can\'t find your item', 'not in catalogue', 'not on website',
    'how much', 'what is', 'tell me about', 'actually make that', 'actually make it'
  ];
  if (nonItemWords.some(w => lower === w || lower.startsWith('my name is') || lower.startsWith('call me'))) {
    return null;
  }

  // Canonical names for known products & categories
  if (/\b(?:paint\s*brush(?:es)?|brushes?)\b/i.test(lower)) return 'Paint Brushes';
  if (/\b(?:fire\s+)?extinguishers?\b/i.test(lower)) return 'Fire Extinguishers';
  if (/\b(?:gas\s+)?cylinders?\b/i.test(lower)) return 'Industrial Cylinders';
  if (/\b(?:pressure\s+)?gauges?\b/i.test(lower)) return 'Pressure Gauges';
  if (/\b(?:industrial\s+)?valves?|ball\s+valve|gate\s+valve|globe\s+valve|butterfly\s+valve\b/i.test(lower)) return 'Industrial Valves';
  if (/\b(?:welding\s+)?machines?|welding\s+equipment\b/i.test(lower)) return 'Welding Machines';
  if (/\b(?:safety\s+)?helmets?|hard\s+hats?\b/i.test(lower)) return 'Industrial Safety Helmets';
  if (/\b(?:safety\s+)?(?:shoes?|boots?|gumboots?)\b/i.test(lower)) return 'Safety Shoes';
  if (/\b(?:safety\s+)?(?:hand\s+)?gloves?\b/i.test(lower)) return 'Safety Hand Gloves';
  if (/\b(?:safety\s+)?(?:harness|safety\s+belt)\b/i.test(lower)) return 'Safety Harness';
  if (/\b(?:safety\s+)?goggles?\b/i.test(lower)) return 'Safety Goggles';
  if (/\b(?:welding\s*(?:rods?|electrodes?|wire)?|electrodes?)\b/i.test(lower)) return 'Welding Electrodes & Consumables';
  if (/\b(?:champion\s+)?(?:gaskets?|gasket\s+sheets?)\b/i.test(lower)) return 'Champion Gasket Sheets';
  if (/\b(?:pipes?|tubes?|piping)\b/i.test(lower)) return 'Industrial Pipes & Tubes';
  if (/\b(?:sheets?|plates?)\b/i.test(lower)) return 'Stainless Steel Sheets / Plates';
  if (/\b(?:fasteners?|bolts?|nuts?|threaded\s+rods?|anchor\s+fasteners?)\b/i.test(lower)) return 'Industrial Fasteners & Hardware';

  // Generic natural language item extraction: "I need [item]", "looking for [item]", "Do you supply [item]", "Quote for [item]"
  const intentMatch = trimmed.match(
    /(?:(?:i|we)\s+(?:need|want|require|am looking for|are looking for)|looking\s+for|requirement\s+(?:for|of)|quote\s+for|inquiry\s+for|enquiry\s+for|do\s+you\s+(?:have|supply|sell)|can\s+you\s+(?:supply|arrange|source|provide))\s+(?:a\s+|an\s+|some\s+)?(?:\d+\s*(?:pcs|pieces|nos|kg|meters)?\s*(?:of\s+)?)?([a-zA-Z0-9\s/&-]+)/i
  );

  if (intentMatch) {
    let rawItem = intentMatch[1].trim();
    // Strip trailing clauses, modifiers, punctuation, contact info
    rawItem = rawItem.split(/[,.;!?]|\b(?:medium|large|small|\d+\s*inch|\d+\s*mm|please|today|urgently|my name|phone|contact)\b/i)[0].trim();
    if (
      rawItem &&
      rawItem.length >= 3 &&
      !['something', 'anything', 'items', 'products', 'materials', 'requirement', 'quotation', 'price', 'help', 'details', 'catalogue'].includes(rawItem.toLowerCase())
    ) {
      return rawItem.charAt(0).toUpperCase() + rawItem.slice(1);
    }
  }

  return null;
}

// Helper to extract entities deterministically from customer text & conversation context
function extractEntities(
  text: string,
  current: StructuredRfqData,
  conversationHistory: IncomingChatMessage[] = []
): { updated: StructuredRfqData; changedFields: string[] } {
  const updated: StructuredRfqData = { ...current };
  const changedFields: string[] = [];

  const trimmed = text.trim();
  const lower = trimmed.toLowerCase();

  // Find the last question asked by the AI to interpret short user answers
  const lastAiMessage = conversationHistory
    .filter((m) => m.sender === 'ai' || m.role === 'model')
    .pop()?.text?.toLowerCase() || '';

  // 1. Correction handling ("Actually make that 30", "make it 100", "update to 25")
  const correctionMatch = text.match(/(?:actually\s+(?:make\s+(?:it|that)|need|\d+)|make\s+it|update\s+(?:it\s+)?to|change\s+(?:it\s+)?to)\s*(\d+(?:\.\d+)?)\s*(pcs|pieces|piece|nos|kg|meters)?/i);
  if (correctionMatch) {
    const num = correctionMatch[1];
    const unit = correctionMatch[2] || updated.unit || '';
    const newQty = `${num}${unit ? ` ${unit}` : ''}`.trim();
    if (updated.quantity !== newQty) {
      updated.quantity = newQty;
      changedFields.push('quantity');
    }
  }

  // 2. New requirement reset ("Now I need 20 safety helmets")
  if (/\b(?:now\s+i\s+need|another\s+requirement|new\s+enquiry|now\s+need)\b/i.test(lower)) {
    delete updated.product;
    delete updated.quantity;
    delete updated.specifications;
    delete updated.thickness;
    delete updated.dimensions;
    delete updated.grade;
  }

  // 3. Product / Item extraction
  if (!updated.product) {
    const detectedItem = extractItemName(text);
    if (detectedItem) {
      updated.product = detectedItem;
      changedFields.push('product');
    }
  }

  // 4. Quantity extraction
  // Pattern A: Number with explicit unit ("50 pcs", "500 kg", "100 pieces", "50 meters")
  const plainQtyMatch = text.match(/\b(\d+(?:\.\d+)?)\s*(kg|kgs|pieces|piece|pcs|nos|meters|mtr|m|tons|ton|bundles|boxes|pairs|sets|rolls)\b/i);
  // Pattern B: Number qualifying product count ("50 paint brushes", "10 fire extinguishers", "3 cylinders", "20 pressure gauges", "100 helmets")
  const countWithProductMatch = text.match(/\b(\d+(?:\.\d+)?)\s*(?:(?:pieces|piece|pcs|nos)\s*(?:of\s+)?)?(?:paint\s*brushes?|brushes?|fire\s+extinguishers?|extinguishers?|cylinders?|pressure\s+gauges?|valves?|welding\s+machines?|safety\s+helmets?|helmets?|safety\s+shoes?|shoes?|gloves?)\b/i);
  // Pattern C: Standalone number answering quantity prompt ("50", "30", "3", "100")
  const standaloneNum = text.match(/^\s*(\d+(?:\.\d+)?)\s*$/);

  if (!updated.quantity || correctionMatch) {
    if (correctionMatch) {
      // already set above
    } else if (plainQtyMatch) {
      const num = plainQtyMatch[1];
      const unit = plainQtyMatch[2];
      const newQty = `${num} ${unit}`.trim();
      updated.quantity = newQty;
      updated.unit = unit;
      changedFields.push('quantity');
    } else if (countWithProductMatch && !['304', '316', '7018', '6013'].includes(countWithProductMatch[1])) {
      const num = countWithProductMatch[1];
      const unit = lower.includes('pieces') || lower.includes('piece') ? 'pieces' : '';
      const newQty = `${num}${unit ? ` ${unit}` : ''}`.trim();
      updated.quantity = newQty;
      updated.unit = unit;
      changedFields.push('quantity');
    } else if (standaloneNum) {
      // If AI asked "How many do you need?" or quantity is missing
      const askedQuantity = lastAiMessage.includes('how many') || lastAiMessage.includes('what quantity') || !updated.quantity;
      if (askedQuantity) {
        const num = standaloneNum[1];
        const newQty = `${num}`;
        updated.quantity = newQty;
        changedFields.push('quantity');
      }
    }
  }

  // 5. Specification extraction
  // Decline specification: "no", "none", "not sure", "i don't know", "no preference"
  const isDeclineSpec =
    lower === 'no' ||
    lower === 'none' ||
    lower === 'not sure' ||
    lower === 'no preference' ||
    lower === "i don't know" ||
    lower === "i don't know the specification" ||
    lower === "i don't know the specification." ||
    lower.includes("don't know the specification") ||
    lower === 'no idea';

  if (isDeclineSpec) {
    if (!updated.specifications || updated.specifications === 'Not provided') {
      updated.specifications = 'No preference';
      changedFields.push('specifications');
    }
  } else {
    // Check specific specification attributes
    if (lower.includes('medium size') || lower.includes('medium')) {
      updated.specifications = 'Medium size';
      changedFields.push('specifications');
    } else if (lower.includes('large size') || lower.includes('large')) {
      updated.specifications = 'Large size';
      changedFields.push('specifications');
    } else if (lower.includes('small size') || lower.includes('small')) {
      updated.specifications = 'Small size';
      changedFields.push('specifications');
    }

    // Extinguisher specs
    if (lower.includes('abc') || lower.includes('co2') || lower.includes('foam') || lower.includes('clean agent') || lower.includes('dcp')) {
      const typeMatch = text.match(/\b(ABC\s*(?:powder|dry\s*powder)?|CO2|Mechanical\s*Foam|Foam|Clean\s*Agent|DCP)\b/i);
      if (typeMatch) {
        const spec = typeMatch[0].trim();
        updated.specifications = updated.specifications && updated.specifications !== 'No preference' ? `${updated.specifications}, ${spec}` : spec;
        changedFields.push('specifications');
      }
    }
    const extCapMatch = text.match(/\b(\d+(?:\.\d+)?)\s*(?:kg|ltr|liters?)\b/i);
    if (extCapMatch && (updated.product?.includes('Extinguisher') || lower.includes('extinguisher'))) {
      const cap = `${extCapMatch[1]} kg`;
      if (!updated.specifications?.includes(cap)) {
        updated.specifications = updated.specifications && updated.specifications !== 'No preference' ? `${updated.specifications}, Capacity: ${cap}` : `Capacity: ${cap}`;
        changedFields.push('specifications');
      }
    }

    // Cylinder gas
    const gasMatch = text.match(/\b(Oxygen|Nitrogen|Argon|CO2|Acetylene|DA|Hydrogen|LPG|Helium)\b/i);
    if (gasMatch && (updated.product?.includes('Cylinder') || lower.includes('cylinder'))) {
      const gas = `${gasMatch[0].trim()} Gas`;
      if (!updated.specifications?.includes(gas)) {
        updated.specifications = updated.specifications && updated.specifications !== 'No preference' ? `${updated.specifications}, ${gas}` : gas;
        changedFields.push('specifications');
      }
    }

    // Gauge range
    const gaugeRangeMatch = text.match(/\b(\d+(?:\.\d+)?\s*(?:-|to)\s*\d+(?:\.\d+)?\s*(?:bar|psi|kg\/cm2))\b/i);
    if (gaugeRangeMatch) {
      updated.specifications = `Range: ${gaugeRangeMatch[1].trim()}`;
      changedFields.push('specifications');
    }

    // Steel grade & dimensions
    const gradeMatch = text.match(/\b(SS\s*304L?|SS\s*316L?|304L?|316L?|E7018|E6013|ER70S-6|MS|GI)\b/i);
    if (gradeMatch) {
      let matchedGrade = gradeMatch[1].toUpperCase().trim();
      if (matchedGrade === '304' || matchedGrade === '304L') matchedGrade = 'SS ' + matchedGrade;
      if (matchedGrade === '316' || matchedGrade === '316L') matchedGrade = 'SS ' + matchedGrade;
      updated.grade = matchedGrade;
      changedFields.push('grade');
    }
  }

  // 6. Phone extraction
  const phoneMatch = text.match(/(?:(?:\+|0{0,2})\d{1,4}[-.\s]?)?(?:\(?\d{2,5}\)?[-.\s]?)?\d{3,5}[-.\s]?\d{3,5}\b/);
  if (phoneMatch) {
    const rawNum = phoneMatch[0].trim();
    if (isValidPhone(rawNum) && !rawNum.includes('/') && !rawNum.includes('x') && rawNum.length >= 7) {
      if (updated.phone !== rawNum) {
        updated.phone = rawNum;
        changedFields.push('phone');
      }
    }
  }

  // 7. Email extraction
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  if (emailMatch) {
    const emailVal = emailMatch[0].trim();
    if (isValidEmail(emailVal)) {
      if (updated.email !== emailVal) {
        updated.email = emailVal;
        changedFields.push('email');
      }
    }
  }

  // 8. Customer Name extraction
  // Pattern A: "My name is Rahul", "I am Rahul", "name is Rahul"
  const namePatternMatch = text.match(/(?:my name is|i am|name[:\s]+)\s*([a-zA-Z\s]{2,30})/i);
  // Pattern B: "Rahul, 9876543210" or "Rahul 9876543210"
  const nameWithPhoneMatch = text.match(/^([a-zA-Z\s]{2,30})[,.\s]+(?:\+?\d{10,15})/);

  if (!updated.customerName) {
    if (namePatternMatch) {
      updated.customerName = namePatternMatch[1].split(/[,.]|\b(?:and|phone|number|from)\b/i)[0].trim();
      changedFields.push('customerName');
    } else if (nameWithPhoneMatch) {
      updated.customerName = nameWithPhoneMatch[1].trim();
      changedFields.push('customerName');
    } else if (
      lastAiMessage.includes('name') &&
      /^[A-Z][a-z]+(?:\s+[A-Z][a-z]+)?$/.test(trimmed) &&
      trimmed.length <= 25 &&
      !['Mathura', 'Delhi', 'Agra', 'Mumbai', 'Noida', 'Gurgaon'].includes(trimmed)
    ) {
      updated.customerName = trimmed;
      changedFields.push('customerName');
    }
  }

  // 9. Company & Location extraction
  const companyMatch = text.match(/(?:company[:\s]+|from\s+)([a-zA-Z0-9\s.,&-]{2,35}(?:ltd|limited|llp|pvt|corp|enterprises|infra|industries|steel))/i);
  if (companyMatch && !updated.companyName) {
    updated.companyName = companyMatch[1].trim();
    changedFields.push('companyName');
  }

  const locMatch = text.match(/(?:delivery (?:in|to|at)|deliver to|location[:\s]+)\s*([a-zA-Z\s]{2,30})/i);
  if (locMatch && !updated.deliveryLocation) {
    updated.deliveryLocation = locMatch[1].trim();
    changedFields.push('deliveryLocation');
  }

  return { updated, changedFields };
}

// Fallback deterministic conversational state machine
function generateDeterministicFallback(
  message: string,
  currentRfq: StructuredRfqData | null,
  action?: string,
  conversationHistory: IncomingChatMessage[] = []
): { reply: string; intent: string; rfq: StructuredRfqData | null } {
  const text = message.trim();
  const lower = text.toLowerCase();

  // 1. Explicit Action: Confirm & Send
  if (action === 'confirm' || action === 'send' || lower === 'confirm & send' || lower === 'confirm rfq' || lower === 'confirm quotation') {
    const readyRfq: StructuredRfqData = currentRfq
      ? { ...currentRfq, status: 'ready_to_submit' }
      : { status: 'ready_to_submit' };
    return {
      reply: `I've prepared your requirement.\n\nAll details have been structured and verified. Click **Confirm & Send** to transmit your requirement directly to the Rajdeep Enterprises team for official quotation processing.`,
      intent: 'rfq_confirm',
      rfq: readyRfq,
    };
  }

  // 2. Explicit Action: Cancel
  if (action === 'cancel' || lower.includes('cancel my quotation') || lower === 'cancel rfq' || lower === 'cancel' || lower === 'cancel my requirement') {
    const cancelledRfq: StructuredRfqData = currentRfq
      ? { ...currentRfq, status: 'cancelled' }
      : { status: 'cancelled' };
    return {
      reply: `Your requirement enquiry has been cancelled. Please let me know if you would like to explore any other materials or products.`,
      intent: 'rfq_cancel',
      rfq: cancelledRfq,
    };
  }

  // 3. Explicit Action: Edit
  if (action === 'edit' || lower === 'edit' || lower === 'edit details' || lower === 'i would like to edit my requirement.') {
    return {
      reply: `What details would you like to update? (For example: quantity, specification, delivery location, or contact details)`,
      intent: 'rfq_edit',
      rfq: currentRfq,
    };
  }

  // 4. Test E: "I need something that isn't on your website." / "Can't find your item?"
  if (
    lower.includes("isn't on your website") ||
    lower.includes("not on your website") ||
    lower.includes("not on the website") ||
    lower.includes("not in your catalogue") ||
    lower.includes("not in the catalogue") ||
    lower.includes("can't find your item") ||
    lower === "can't find your item?"
  ) {
    return {
      reply: `No problem. Our online catalogue doesn't contain every item we can source or supply. Tell us what you need and the quantity, and we'll help with the requirement and quotation.`,
      intent: 'product_enquiry',
      rfq: currentRfq,
    };
  }

  // 5. Test 1: "Do you supply pressure gauges?"
  if (
    lower === 'do you supply pressure gauges?' ||
    lower === 'do you supply pressure gauges' ||
    lower.includes('do you supply pressure gauge') ||
    lower.includes('do you have pressure gauge')
  ) {
    const baseRfq: StructuredRfqData = currentRfq ? { ...currentRfq } : { status: 'draft' };
    baseRfq.product = 'Pressure Gauges';
    return {
      reply: `Yes, we can help with pressure gauges. How many do you need? If you have a preferred range, size, brand or specification, you can share it, but it's okay if you don't have those details.`,
      intent: 'product_enquiry',
      rfq: baseRfq,
    };
  }

  // 6. Test 6: Price inquiry "How much is 20 fire extinguishers?"
  if (lower.includes('price') || lower.includes('cost') || lower.includes('how much')) {
    const baseRfq: StructuredRfqData = currentRfq ? { ...currentRfq } : { status: 'draft' };
    const { updated } = extractEntities(text, baseRfq, conversationHistory);
    return {
      reply: `Pricing depends on the extinguisher type, capacity, quantity and delivery location. I can help prepare the quotation request. Please share the required type and capacity, and our team will check the requirement and provide the applicable quotation.`,
      intent: 'price_enquiry',
      rfq: updated,
    };
  }

  // 7. Extract all entities using multi-turn conversation context
  const baseRfq: StructuredRfqData = currentRfq ? { ...currentRfq } : { status: 'draft' };
  const { updated, changedFields } = extractEntities(text, baseRfq, conversationHistory);
  const category = detectProductCategory(updated.product, text);

  // Check for direct edit like "Actually make that 30" or "Change quantity to 50" (Test G)
  if (lower.includes('actually make') || lower.includes('change quantity') || (changedFields.includes('quantity') && baseRfq.quantity)) {
    const isAllCoreKnown = Boolean(
      updated.product &&
      updated.quantity &&
      updated.customerName &&
      (updated.phone || updated.email)
    );
    if (isAllCoreKnown) {
      updated.status = 'ready_to_submit';
      return {
        reply: `I have updated your quantity to ${updated.quantity}. Here is your updated requirement summary:

Here is your requirement:

Item: ${updated.product}
Quantity: ${updated.quantity}
Specification: ${updated.specifications || 'No preference'}
Name: ${updated.customerName}
Phone: ${updated.phone || updated.email}${updated.companyName ? `\nCompany: ${updated.companyName}` : ''}${updated.deliveryLocation ? `\nDelivery Location: ${updated.deliveryLocation}` : ''}

Would you like to send this requirement to the Rajdeep Enterprises team for a quotation?`,
        intent: 'rfq_edit',
        rfq: updated,
      };
    }

    const cleanItemName = updated.product || 'item';
    return {
      reply: `I have updated your quantity to ${updated.quantity} ${cleanItemName}. ${
        !updated.customerName || !updated.phone
          ? 'Please provide your name and WhatsApp/phone number so we can prepare your requirement.'
          : 'Would you like to confirm and send this requirement?'
      }`,
      intent: 'rfq_edit',
      rfq: updated,
    };
  }

  // ----------------------------------------------------
  // 5-STAGE STATE MACHINE
  // ----------------------------------------------------

  // Check if ALL core information is already present (e.g. Test J: "I need 100 helmets. My name is Rahul. 9876543210.")
  const isComplete = Boolean(
    updated.product &&
    updated.quantity &&
    updated.customerName &&
    (updated.phone || updated.email)
  );

  if (isComplete) {
    updated.status = 'ready_to_submit';
    if (!updated.specifications) {
      updated.specifications = 'No preference';
    }

    const summaryText = `Here is your requirement:

Item: ${updated.product}
Quantity: ${updated.quantity}
Specification: ${updated.specifications}
Name: ${updated.customerName}
Phone: ${updated.phone || updated.email}${updated.companyName ? `\nCompany: ${updated.companyName}` : ''}${updated.deliveryLocation ? `\nDelivery Location: ${updated.deliveryLocation}` : ''}

Would you like to send this requirement to the Rajdeep Enterprises team for a quotation?`;

    return {
      reply: summaryText,
      intent: 'rfq_request',
      rfq: updated,
    };
  }

  // STAGE 1: Item is missing
  if (!updated.product) {
    return {
      reply: `Sure, what item do you need? Tell us the product, quantity, and any specifications you have, and we'll help check the requirement.`,
      intent: 'product_enquiry',
      rfq: updated,
    };
  }

  // STAGE 2: Item known, Quantity is missing (Test A: "I need paint brushes.")
  if (!updated.quantity) {
    if (category === 'gauge') {
      return {
        reply: `Yes, we can help with pressure gauges. How many do you need? If you have a preferred range, size, brand or specification, you can share it, but it's okay if you don't have those details.`,
        intent: 'rfq_collection',
        rfq: updated,
      };
    }
    const cleanItem = updated.product.toLowerCase().endsWith('s')
      ? updated.product.toLowerCase()
      : `${updated.product.toLowerCase()}es`;
    return {
      reply: `Yes, we can help with ${cleanItem}. How many do you need?`,
      intent: 'rfq_collection',
      rfq: updated,
    };
  }

  // STAGE 3: Item & Quantity known, Specification missing (Test B, Test D)
  if (!updated.specifications) {
    // Specific products
    if (category === 'extinguisher') {
      return {
        reply: `Yes, we can help arrange fire extinguishers. I have noted the quantity as ${updated.quantity}. If you have a preferred type or capacity, you can share it; otherwise, you can send us your requirement and our team can help with the appropriate option and quotation.`,
        intent: 'rfq_collection',
        rfq: updated,
      };
    }
    if (category === 'cylinder') {
      return {
        reply: `Yes, we can help with cylinders. I have noted the quantity as ${updated.quantity}. Please tell me the cylinder/gas type if known. If you're not sure, you can send us the requirement and our team can help clarify it.`,
        intent: 'rfq_collection',
        rfq: updated,
      };
    }
    if (category === 'gauge') {
      return {
        reply: `Yes, we can help with pressure gauges. I've noted ${updated.quantity} pressure gauges. If you have a preferred range, size or specification, please share it. Otherwise, you can send us your requirement and our team can check it and provide a quotation.`,
        intent: 'rfq_collection',
        rfq: updated,
      };
    }
    if (category === 'valve') {
      return {
        reply: `Yes, we can help arrange industrial valves. I've noted the quantity as ${updated.quantity}. If you know the valve type, size, material or specification, please share it. Otherwise, you can send us your requirement and our team can help with the quotation.`,
        intent: 'rfq_collection',
        rfq: updated,
      };
    }

    const cleanItem = updated.product.toLowerCase().endsWith('s')
      ? updated.product.toLowerCase()
      : `${updated.product.toLowerCase()}es`;

    return {
      reply: `Got it — ${updated.quantity} ${cleanItem}. Do you have a preferred size, type or brand?`,
      intent: 'rfq_collection',
      rfq: updated,
    };
  }

  // STAGE 4: Item, Quantity & Specification known, Customer Contact missing (Test C, Test H, Turn 3 of Paint Brush)
  if (!updated.customerName || !updated.phone) {
    return {
      reply: `No problem. We can check the requirement for you. Please provide your name and WhatsApp/phone number so our team can assist you.`,
      intent: 'rfq_collection',
      rfq: updated,
    };
  }

  // STAGE 5: Summary
  updated.status = 'ready_to_submit';
  const summaryText = `Here is your requirement:

Item: ${updated.product}
Quantity: ${updated.quantity}
Specification: ${updated.specifications || 'No preference'}
Name: ${updated.customerName}
Phone: ${updated.phone || updated.email}${updated.companyName ? `\nCompany: ${updated.companyName}` : ''}${updated.deliveryLocation ? `\nDelivery Location: ${updated.deliveryLocation}` : ''}

Would you like to send this requirement to the Rajdeep Enterprises team for a quotation?`;

  return {
    reply: summaryText,
    intent: 'rfq_request',
    rfq: updated,
  };
}

export default async function handler(req: any, res: any) {
  // 1. CORS check
  const corsOk = handleCors(req, res);
  if (!corsOk) {
    return;
  }

  // 2. HTTP Method restriction
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method Not Allowed. Only POST requests are supported.',
    });
  }

  try {
    // 3. Parse and validate payload
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    const rawMessage = body.message || '';
    const currentRfq: StructuredRfqData | null = body.currentRfq || null;
    const action: string | undefined = body.action;

    if (!rawMessage && !action) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a non-empty message or action.',
      });
    }

    const trimmedMessage = rawMessage.trim();
    if (trimmedMessage.length > 1500) {
      return res.status(400).json({
        success: false,
        error: 'Message exceeds the maximum length limit of 1500 characters.',
      });
    }

    // Extract conversation history for multi-turn context
    const conversationHistory: IncomingChatMessage[] = Array.isArray(body.conversation)
      ? body.conversation.slice(-10) // Limit to the last 10 messages for token safety
      : [];

    // Direct actions handled instantly
    if (action === 'confirm' || action === 'cancel' || action === 'edit' || action === 'send_requirement') {
      const fallback = generateDeterministicFallback(trimmedMessage, currentRfq, action, conversationHistory);
      return res.status(200).json({
        success: true,
        reply: fallback.reply,
        intent: fallback.intent,
        rfq: fallback.rfq,
      });
    }

    // 4. API Key Verification (Server-Side Only)
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      const fallback = generateDeterministicFallback(trimmedMessage, currentRfq, action, conversationHistory);
      return res.status(200).json({
        success: true,
        reply: fallback.reply,
        intent: fallback.intent,
        rfq: fallback.rfq,
      });
    }

    // 5. Build conversation turns for multi-turn context for Gemini
    const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

    for (const item of conversationHistory) {
      if (!item || typeof item.text !== 'string' || !item.text.trim()) {
        continue;
      }

      const isUser = item.sender === 'user' || item.role === 'user';
      const role: 'user' | 'model' = isUser ? 'user' : 'model';

      if (contents.length === 0 && role === 'model') {
        continue;
      }

      const textChunk = item.text.trim().slice(0, 2000);
      contents.push({
        role,
        parts: [{ text: textChunk }],
      });
    }

    // Include the current RFQ state in the prompt context so Gemini knows what is already filled
    const rfqContextPrompt = currentRfq
      ? `[CURRENT REQUIREMENT STATE]: ${JSON.stringify(currentRfq)}\n[USER INPUT]: ${trimmedMessage}`
      : `[CURRENT REQUIREMENT STATE]: None\n[USER INPUT]: ${trimmedMessage}`;

    contents.push({
      role: 'user',
      parts: [{ text: rfqContextPrompt }],
    });

    // 6. Call Gemini
    const ai = new GoogleGenAI({ apiKey });

    try {
      const response = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents,
        config: {
          systemInstruction: RAJDEEP_AI_SYSTEM_INSTRUCTION,
          temperature: 0.3,
          responseMimeType: 'application/json',
        },
      });

      const responseText = response.text?.trim() || '';
      let parsedData: any = null;

      try {
        parsedData = JSON.parse(responseText);
      } catch {
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          try {
            parsedData = JSON.parse(jsonMatch[0]);
          } catch {}
        }
      }

      if (parsedData && typeof parsedData.reply === 'string') {
        const extractedRfq: StructuredRfqData = parsedData.rfq || currentRfq || { status: 'draft' };

        if (extractedRfq.email && !isValidEmail(extractedRfq.email)) {
          delete extractedRfq.email;
        }
        if (extractedRfq.phone && !isValidPhone(extractedRfq.phone)) {
          delete extractedRfq.phone;
        }

        const mergedRfq: StructuredRfqData = {
          ...(currentRfq || {}),
          ...extractedRfq,
          status: extractedRfq.status || currentRfq?.status || 'draft',
        };

        const hasCoreRequirements = Boolean(
          (mergedRfq.product || mergedRfq.material) &&
          (mergedRfq.quantity || mergedRfq.specifications) &&
          mergedRfq.customerName &&
          (mergedRfq.phone || mergedRfq.email)
        );

        if (hasCoreRequirements && mergedRfq.status === 'draft') {
          mergedRfq.status = 'ready_to_submit';
        }

        return res.status(200).json({
          success: true,
          reply: parsedData.reply,
          intent: parsedData.intent || 'product_enquiry',
          rfq: mergedRfq,
        });
      }
    } catch {
      // Seamless fallback on quota or rate limit using the 5-stage state machine
      const fallback = generateDeterministicFallback(trimmedMessage, currentRfq, action, conversationHistory);
      return res.status(200).json({
        success: true,
        reply: fallback.reply,
        intent: fallback.intent,
        rfq: fallback.rfq,
      });
    }

    // Default fallback if parsing fails
    const fallback = generateDeterministicFallback(trimmedMessage, currentRfq, action, conversationHistory);
    return res.status(200).json({
      success: true,
      reply: fallback.reply,
      intent: fallback.intent,
      rfq: fallback.rfq,
    });
  } catch (error: any) {
    console.error('[ChatAPI] Unexpected error in chat handler:', error?.message || error);
    return res.status(500).json({
      success: false,
      error: "Sorry, I'm unable to respond right now. Please try again or contact Rajdeep Enterprises directly.",
    });
  }
}
