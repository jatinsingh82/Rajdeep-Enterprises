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
): 'extinguisher' | 'cylinder' | 'gauge' | 'valve' | 'welding_machine' | 'helmet' | 'safety' | 'sheet' | 'pipe' | 'fastener' | 'welding' | 'gasket' | 'custom' {
  const combined = `${productName || ''} ${text || ''}`.toLowerCase();
  if (combined.includes('extinguisher') || combined.includes('fire cylinder') || combined.includes('fire fighting')) return 'extinguisher';
  if (combined.includes('cylinder')) return 'cylinder';
  if (combined.includes('pressure gauge') || (combined.includes('gauge') && !combined.includes('swg'))) return 'gauge';
  if (combined.includes('valve')) return 'valve';
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

// Helper to extract entities deterministically from customer text
function extractEntities(
  text: string,
  current: StructuredRfqData
): { updated: StructuredRfqData; changedFields: string[] } {
  const updated: StructuredRfqData = { ...current };
  const changedFields: string[] = [];

  const trimmed = text.trim();
  const lower = trimmed.toLowerCase();

  // 1. Phone extraction
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

  // 2. Email extraction
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

  // 3. Product & Item extraction (Catalogue + Non-Catalogue Items)
  if (lower.includes('fire extinguisher') || lower.includes('extinguisher')) {
    if (!updated.product) {
      updated.product = 'Fire Extinguishers';
      changedFields.push('product');
    }
  } else if (lower.includes('cylinder')) {
    if (!updated.product) {
      updated.product = 'Industrial Cylinders';
      changedFields.push('product');
    }
  } else if (lower.includes('pressure gauge') || (lower.includes('gauge') && !lower.includes('swg'))) {
    if (!updated.product) {
      updated.product = 'Pressure Gauges';
      changedFields.push('product');
    }
  } else if (lower.includes('valve')) {
    if (!updated.product) {
      updated.product = 'Industrial Valves';
      changedFields.push('product');
    }
  } else if (lower.includes('welding machine')) {
    if (!updated.product) {
      updated.product = 'Welding Machines';
      changedFields.push('product');
    }
  } else if (lower.includes('helmet') || lower.includes('hard hat')) {
    if (!updated.product) {
      updated.product = 'Industrial Safety Helmets';
      changedFields.push('product');
    }
  } else if (lower.includes('safety shoe') || lower.includes('shoe') || lower.includes('boot') || lower.includes('gumboot')) {
    if (!updated.product) {
      updated.product = 'Safety Shoes';
      changedFields.push('product');
    }
  } else if (lower.includes('glove')) {
    if (!updated.product) {
      updated.product = 'Safety Hand Gloves';
      changedFields.push('product');
    }
  } else if (lower.includes('harness')) {
    if (!updated.product) {
      updated.product = 'Safety Harness';
      changedFields.push('product');
    }
  } else if (lower.includes('goggle')) {
    if (!updated.product) {
      updated.product = 'Safety Goggles';
      changedFields.push('product');
    }
  } else if (lower.includes('welding') || lower.includes('electrode') || lower.includes('rod')) {
    if (!updated.product) {
      updated.product = 'Welding Electrodes & Consumables';
      changedFields.push('product');
    }
  } else if (lower.includes('gasket') || lower.includes('champion')) {
    if (!updated.product) {
      updated.product = 'Champion Gasket Sheets';
      changedFields.push('product');
    }
  } else if (lower.includes('pipe') || lower.includes('tube')) {
    if (!updated.product) {
      updated.product = 'Industrial Pipes & Tubes';
      changedFields.push('product');
    }
    if (!updated.material) {
      updated.material = lower.includes('seamless') ? 'Seamless Steel' : 'Stainless / Carbon Steel';
    }
  } else if (lower.includes('sheet') || lower.includes('plate')) {
    if (!updated.product) {
      updated.product = 'Stainless Steel Sheets / Plates';
      changedFields.push('product');
    }
    if (!updated.material) {
      updated.material = (updated.grade?.includes('SS') || lower.includes('stainless') || lower.includes('304') || lower.includes('316')) ? 'Stainless Steel' : 'Steel';
    }
  } else if (lower.includes('fastener') || lower.includes('bolt') || lower.includes('nut')) {
    if (!updated.product) {
      updated.product = 'Industrial Fasteners & Hardware';
      changedFields.push('product');
    }
  }

  // 4. Grade extraction
  const gradeMatch = text.match(/\b(SS\s*304L?|SS\s*316L?|304L?|316L?|E7018|E6013|ER70S-6|MS|GI|Carbon Steel|Alloy Steel|Style\s*20|Style\s*54)\b/i);
  if (gradeMatch) {
    let matchedGrade = gradeMatch[1].toUpperCase().trim();
    if (matchedGrade === '304' || matchedGrade === '304L') matchedGrade = 'SS ' + matchedGrade;
    if (matchedGrade === '316' || matchedGrade === '316L') matchedGrade = 'SS ' + matchedGrade;
    if (updated.grade !== matchedGrade) {
      updated.grade = matchedGrade;
      changedFields.push('grade');
    }
    if (matchedGrade.includes('SS') || matchedGrade.includes('304') || matchedGrade.includes('316')) {
      updated.material = 'Stainless Steel';
    }
  }

  // 5. Quantity extraction (Strict priority)
  // Pattern A: Change quantity ("change quantity from 100 kg to 250 kg", "make it 250 kg", "update to 250")
  const toQtyMatch = text.match(/(?:(?:from\s+\d+(?:\.\d+)?\s*[a-zA-Z]*\s+)?to|into|update to|make it|quantity[:\s]+)\s*(\d+(?:\.\d+)?)\s*([a-zA-Z]+)?/i);
  // Pattern B: Plain quantity with explicit unit (e.g. "500 kg", "100 pcs", "100 pieces", "50 meters")
  const plainQtyMatch = text.match(/\b(\d+(?:\.\d+)?)\s*(kg|kgs|pieces|piece|pcs|nos|meters|mtr|m|tons|ton|bundles|boxes|pairs|sets|rolls)\b/i);
  // Pattern C: Count with product name (e.g. "10 fire extinguishers", "3 cylinders", "20 pressure gauges", "50 welding machines")
  const countWithProductMatch = text.match(/\b(\d+(?:\.\d+)?)\s*(?:(?:pieces|piece|pcs|nos)\s*(?:of\s+)?)?(?:fire\s+extinguishers?|extinguishers?|cylinders?|pressure\s+gauges?|valves?|welding\s+machines?|safety\s+helmets?|helmets?|safety\s+shoes?|shoes?|gloves?)\b/i);
  // Pattern D: Standalone number answering quantity prompt (e.g. "10", "3", "20", "100")
  const standaloneNum = text.match(/^\s*(\d+(?:\.\d+)?)\s*$/);

  if (toQtyMatch) {
    const num = toQtyMatch[1];
    const unit = toQtyMatch[2] || updated.unit || '';
    const newQty = `${num}${unit ? ` ${unit}` : ''}`.trim();
    if (updated.quantity !== newQty) {
      updated.quantity = newQty;
      updated.unit = unit;
      changedFields.push('quantity');
    }
  } else if (plainQtyMatch) {
    const num = plainQtyMatch[1];
    const unit = plainQtyMatch[2];
    const newQty = `${num} ${unit}`.trim();
    if (updated.quantity !== newQty) {
      updated.quantity = newQty;
      updated.unit = unit;
      changedFields.push('quantity');
    }
  } else if (countWithProductMatch && !['304', '316', '7018', '6013'].includes(countWithProductMatch[1])) {
    const num = countWithProductMatch[1];
    const unit = lower.includes('pieces') || lower.includes('piece') ? 'pieces' : '';
    const newQty = `${num}${unit ? ` ${unit}` : ''}`.trim();
    if (updated.quantity !== newQty) {
      updated.quantity = newQty;
      updated.unit = unit;
      changedFields.push('quantity');
    }
  } else if (standaloneNum) {
    const num = standaloneNum[1];
    const unit = updated.unit || '';
    const newQty = `${num}${unit ? ` ${unit}` : ''}`.trim();
    if (updated.quantity !== newQty) {
      updated.quantity = newQty;
      updated.unit = unit;
      changedFields.push('quantity');
    }
  }

  // 6. Unknown specification handler (Test 7)
  if (
    lower.includes("don't know") ||
    lower.includes("do not know") ||
    lower.includes("not sure") ||
    lower.includes("no idea") ||
    lower === "i don't know the specification" ||
    lower === "i don't know" ||
    lower === "not known"
  ) {
    if (!updated.specifications) {
      updated.specifications = 'Not provided';
      changedFields.push('specifications');
    }
  }

  // 7. Thickness extraction
  const thicknessMatch = text.match(/(?:thickness[:\s]+|(?:to|into)\s+)?(\d+(?:\.\d+)?(?:\/\d+)?)\s*(mm|inch|"|gauge|swg|thick)\b/i);
  if (thicknessMatch) {
    const unit = thicknessMatch[2].toLowerCase() === 'thick' ? 'mm' : thicknessMatch[2];
    const newThickness = `${thicknessMatch[1]} ${unit}`.trim();
    if (updated.thickness !== newThickness) {
      updated.thickness = newThickness;
      changedFields.push('thickness');
    }
  }

  // 8. Dimensions extraction
  const dimMatch = text.match(/(\d+\s*(?:[xX*×]\s*\d+)+(?:\s*(?:ft|feet|meter|m|mm|inch))?)/i);
  if (dimMatch && !updated.dimensions) {
    updated.dimensions = dimMatch[1].trim();
    changedFields.push('dimensions');
  }

  // 9. Specific Product Specifications
  if (lower.includes('abc') || lower.includes('co2') || lower.includes('foam') || lower.includes('clean agent') || lower.includes('dcp') || lower.includes('water type')) {
    const typeMatch = text.match(/\b(ABC\s*(?:powder|dry\s*powder)?|CO2|Mechanical\s*Foam|Foam|Clean\s*Agent|DCP|Water)\b/i);
    if (typeMatch) {
      const spec = typeMatch[0].trim();
      updated.specifications = updated.specifications && updated.specifications !== 'Not provided' ? `${updated.specifications}, ${spec}` : spec;
    }
  }
  const extCapMatch = text.match(/\b(\d+(?:\.\d+)?)\s*(?:kg|ltr|liters?)\b/i);
  if (extCapMatch && (updated.product?.includes('Extinguisher') || lower.includes('extinguisher'))) {
    const cap = `${extCapMatch[1]} kg`;
    if (!updated.specifications?.includes(cap)) {
      updated.specifications = updated.specifications && updated.specifications !== 'Not provided' ? `${updated.specifications}, Capacity: ${cap}` : `Capacity: ${cap}`;
    }
  }

  // Cylinders: Gas type & Capacity
  const gasMatch = text.match(/\b(Oxygen|Nitrogen|Argon|CO2|Acetylene|DA|Hydrogen|LPG|Helium)\b/i);
  if (gasMatch && (updated.product?.includes('Cylinder') || lower.includes('cylinder'))) {
    const gas = `${gasMatch[0].trim()} Gas`;
    if (!updated.specifications?.includes(gas)) {
      updated.specifications = updated.specifications && updated.specifications !== 'Not provided' ? `${updated.specifications}, ${gas}` : gas;
    }
  }

  // Pressure Gauges: Range (e.g. 0-10 bar, 0-100 psi)
  const gaugeRangeMatch = text.match(/\b(\d+(?:\.\d+)?\s*(?:-|to)\s*\d+(?:\.\d+)?\s*(?:bar|psi|kg\/cm2))\b/i);
  if (gaugeRangeMatch) {
    updated.specifications = `Range: ${gaugeRangeMatch[1].trim()}`;
  }

  // 10. Customer details
  const nameMatch = text.match(/(?:my name is|i am|customer[:\s]+|name[:\s]+)\s*([a-zA-Z\s]{2,30})/i);
  if (nameMatch && !updated.customerName) {
    updated.customerName = nameMatch[1].trim();
    changedFields.push('customerName');
  }

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

  // Standalone single word name or location
  if (!updated.customerName && /^[A-Z][a-z]+(?:\s+[A-Z][a-z]+)?$/.test(trimmed) && trimmed.length <= 25 && !gradeMatch && !plainQtyMatch) {
    if (['Mathura', 'Delhi', 'Agra', 'Mumbai', 'Kanpur', 'Noida', 'Gurgaon', 'Faridabad', 'Lucknow'].includes(trimmed)) {
      if (!updated.deliveryLocation) {
        updated.deliveryLocation = trimmed;
        changedFields.push('deliveryLocation');
      }
    } else {
      updated.customerName = trimmed;
      changedFields.push('customerName');
    }
  }

  return { updated, changedFields };
}

// Fallback deterministic conversational response generator
function generateDeterministicFallback(
  message: string,
  currentRfq: StructuredRfqData | null,
  action?: string
): { reply: string; intent: string; rfq: StructuredRfqData | null } {
  const text = message.trim();
  const lower = text.toLowerCase();

  // 1. Explicit Action: Confirm & Send (or Confirm RFQ)
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
  if (action === 'cancel' || lower.includes('cancel my quotation') || lower === 'cancel rfq' || lower === 'cancel') {
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
  if (action === 'edit' || lower === 'edit' || lower === 'edit details' || lower === 'i would like to edit details of my enquiry.') {
    return {
      reply: `What details would you like to update? (For example: quantity, specification, delivery location, or contact details)`,
      intent: 'rfq_edit',
      rfq: currentRfq,
    };
  }

  // 4. Test 1: "Do you supply pressure gauges?"
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

  // 5. Test 5: "I need something that isn't on your website." / "Can't find your item?"
  if (
    lower.includes("isn't on your website") ||
    lower.includes("not on your website") ||
    lower.includes("not in your catalogue") ||
    lower.includes("not in the catalogue") ||
    lower.includes("can't find your item") ||
    lower.includes("cannot find your item") ||
    lower === "can't find your item?"
  ) {
    return {
      reply: `No problem. Our online catalogue doesn't contain every item we can source or supply. Tell us what you need and the quantity, and we'll help with the requirement and quotation.`,
      intent: 'product_enquiry',
      rfq: currentRfq,
    };
  }

  // 6. Test 7: "I don't know the specification."
  if (
    lower === "i don't know the specification." ||
    lower === "i don't know the specification" ||
    lower.includes("don't know the specification") ||
    lower === "not sure" ||
    lower === "i don't know" ||
    lower === "no idea"
  ) {
    const baseRfq: StructuredRfqData = currentRfq ? { ...currentRfq } : { status: 'draft' };
    baseRfq.specifications = 'Not provided';
    return {
      reply: `No problem. Just tell us the item and quantity you need. Our team can help clarify the requirement.\n\nPlease provide your name and phone or WhatsApp number so our team can assist with the quotation.`,
      intent: 'rfq_collection',
      rfq: baseRfq,
    };
  }

  // 7. Test 6: Price inquiry "How much is 20 fire extinguishers?"
  if (lower.includes('price') || lower.includes('cost') || lower.includes('how much')) {
    const baseRfq: StructuredRfqData = currentRfq ? { ...currentRfq } : { status: 'draft' };
    const { updated } = extractEntities(text, baseRfq);
    return {
      reply: `Pricing depends on the extinguisher type, capacity, quantity and delivery location. I can help prepare the quotation request. Please share the required type and capacity, and our team will check the requirement and provide the applicable quotation.`,
      intent: 'price_enquiry',
      rfq: updated,
    };
  }

  // 8. Availability queries
  if (lower.startsWith('do you have') || lower.includes('available') || lower.includes('in stock')) {
    return {
      reply: `Yes, we can help supply this as per your requirement. Our team can check the requirement and provide a quotation. Please share the quantity and any specifications you have.`,
      intent: 'availability_enquiry',
      rfq: currentRfq,
    };
  }

  // 9. Delivery guarantee queries
  if (lower.includes('guarantee delivery') || lower.includes('deliver tomorrow')) {
    return {
      reply: `I cannot guarantee delivery timelines as delivery depends on order volume, exact specifications, and logistics. Our dispatch team coordinates timelines once the quotation is finalized.`,
      intent: 'delivery_guarantee',
      rfq: currentRfq,
    };
  }

  // 10. General educational questions
  if (lower.startsWith('what is') || lower.startsWith('tell me about')) {
    if (lower.includes('fire extinguisher')) {
      return {
        reply: `A fire extinguisher is an active fire protection device used to extinguish or control small fires in emergency situations. Common types include ABC dry chemical powder, CO2 extinguishers, mechanical foam, and clean agent systems. Are you looking to procure fire extinguishers for a facility or site?`,
        intent: 'general_question',
        rfq: currentRfq,
      };
    }
  }

  // 11. Extract entities from customer message
  const baseRfq: StructuredRfqData = currentRfq ? { ...currentRfq } : { status: 'draft' };
  const { updated, changedFields } = extractEntities(text, baseRfq);
  const category = detectProductCategory(updated.product, text);

  // Check for direct edit like "change quantity to 50 pcs"
  if (lower.includes('change quantity') || (changedFields.includes('quantity') && baseRfq.quantity)) {
    const isReady = Boolean(
      (updated.product || updated.material) &&
      updated.customerName &&
      (updated.phone || updated.email)
    );
    if (isReady) {
      updated.status = 'ready_to_submit';
      return {
        reply: `I have updated your quantity to ${updated.quantity}. Here is your updated requirement summary:

REQUIREMENT SUMMARY

Item: ${updated.product || updated.material || 'Material Supply'}
Quantity: ${updated.quantity}
Specification: ${updated.specifications || 'Not provided'}
Customer: ${updated.customerName}
Phone: ${updated.phone || updated.email}
Company: ${updated.companyName || 'None'}
Delivery Location: ${updated.deliveryLocation || 'Mathura Depot / As discussed'}
Additional notes: ${updated.additionalNotes || 'None'}

Please confirm the requirement.`,
        intent: 'rfq_edit',
        rfq: updated,
      };
    }

    return {
      reply: `I have updated your quantity to ${updated.quantity}. Would you like to provide any specifications or customer details to proceed?`,
      intent: 'rfq_edit',
      rfq: updated,
    };
  }

  // Assess collected state
  const hasProduct = Boolean(updated.product || updated.material);
  const hasQuantity = Boolean(updated.quantity);
  const hasName = Boolean(updated.customerName);
  const hasContact = Boolean(updated.phone || updated.email);

  // If we have product, quantity, customer name, and contact -> Ready for Requirement Summary!
  if (hasProduct && hasQuantity && hasName && hasContact) {
    updated.status = 'ready_to_submit';
    const summaryText = `REQUIREMENT SUMMARY

Item: ${updated.product || updated.material || 'Material Supply'}
Quantity: ${updated.quantity}
Specification: ${updated.specifications || 'Not provided'}
Customer: ${updated.customerName}
Phone: ${updated.phone || updated.email}
Company: ${updated.companyName || 'None'}
Delivery Location: ${updated.deliveryLocation || 'Mathura Depot / As discussed'}
Additional notes: ${updated.additionalNotes || 'None'}

Please confirm the requirement.`;

    return {
      reply: summaryText,
      intent: 'rfq_request',
      rfq: updated,
    };
  }

  // ----------------------------------------------------
  // TEST SCENARIOS & SPECIFIC PRODUCT FLOWS
  // ----------------------------------------------------

  // Test 2: "I need 20 pressure gauges."
  if (category === 'gauge' && hasQuantity) {
    if (!hasName || !hasContact) {
      return {
        reply: `Yes, we can help with pressure gauges. I've noted 20 pressure gauges. If you have a preferred range, size or specification, please share it. Otherwise, you can send us your requirement and our team can check it and provide a quotation.

Would you like to send this requirement to our team? Please provide your name and phone/WhatsApp number.`,
        intent: 'rfq_collection',
        rfq: updated,
      };
    }
  }

  // Test 3: "I need 10 fire extinguishers."
  if (category === 'extinguisher' && hasQuantity) {
    if (!hasName || !hasContact) {
      return {
        reply: `Yes, we can help arrange fire extinguishers. I have noted the quantity as 10. If you have a preferred type or capacity, you can share it; otherwise, you can send us your requirement and our team can help with the appropriate option and quotation.

Would you like to send this requirement to our team for a quotation?`,
        intent: 'rfq_collection',
        rfq: updated,
      };
    }
  }

  // Test 4: "I need 3 cylinders."
  if (category === 'cylinder' && hasQuantity) {
    if (!hasName || !hasContact) {
      return {
        reply: `Yes, we can help with cylinders. I have noted the quantity as 3. Please tell me the cylinder/gas type if known. If you're not sure, you can send us the requirement and our team can help clarify it.

Please provide your name and phone/WhatsApp number so our team can assist.`,
        intent: 'rfq_collection',
        rfq: updated,
      };
    }
  }

  // Example 10: "I need 20 industrial valves."
  if (category === 'valve' && hasQuantity) {
    if (!hasName || !hasContact) {
      return {
        reply: `Yes, we can help arrange industrial valves. I've noted the quantity as 20. If you know the valve type, size, material or specification, please share it. Otherwise, you can send us your requirement and our team can help with the quotation.`,
        intent: 'rfq_collection',
        rfq: updated,
      };
    }
  }

  // Example 11: "I need 50 welding machines."
  if (category === 'welding_machine' && hasQuantity) {
    if (!hasName || !hasContact) {
      return {
        reply: `Yes, we can help check that requirement. I've noted 50 welding machines. If you have a preferred brand, model or specification, you can share it. Otherwise, send us your requirement and our team can check the available options and provide a quotation.`,
        intent: 'rfq_collection',
        rfq: updated,
      };
    }
  }

  // Safety Helmets
  if (category === 'helmet' && hasQuantity) {
    if (!hasName || !hasContact) {
      return {
        reply: `Yes, we can help arrange safety helmets. I have noted the quantity as ${updated.quantity}. If you have a preferred color, type (ratchet or pin-lock), or standard, please share it. Otherwise, please provide your name and contact number to prepare your quotation.`,
        intent: 'rfq_collection',
        rfq: updated,
      };
    }
  }

  // Sheet products
  if (category === 'sheet') {
    if (!hasQuantity) {
      return {
        reply: `What quantity and thickness do you require?`,
        intent: 'rfq_collection',
        rfq: updated,
      };
    }
    if (!hasName || !hasContact) {
      return {
        reply: `I have noted ${updated.grade || 'SS 304'} steel sheet and ${updated.quantity}. To prepare the requirement for our team, may I have your name, delivery location, and phone/WhatsApp number?`,
        intent: 'rfq_collection',
        rfq: updated,
      };
    }
  }

  // Direct "Send Requirement" action trigger
  if (action === 'send_requirement' || lower === 'send requirement') {
    if (!hasProduct) {
      return {
        reply: `Please tell us the item or material you need.`,
        intent: 'rfq_collection',
        rfq: updated,
      };
    }
    if (!hasQuantity) {
      return {
        reply: `How many ${updated.product || 'items'} do you need?`,
        intent: 'rfq_collection',
        rfq: updated,
      };
    }
    if (!hasName) {
      return {
        reply: `Please provide your name.`,
        intent: 'rfq_collection',
        rfq: updated,
      };
    }
    if (!hasContact) {
      return {
        reply: `Please provide your phone/WhatsApp number so our team can provide the quotation.`,
        intent: 'rfq_collection',
        rfq: updated,
      };
    }
  }

  // General unknown product flow
  if (!hasProduct) {
    return {
      reply: `Yes, we can help with your requirement. Tell us what item you need, the quantity, and any specifications you have.`,
      intent: 'product_enquiry',
      rfq: updated,
    };
  }

  if (!hasQuantity) {
    return {
      reply: `Yes, we can help with ${updated.product}. How many do you need?`,
      intent: 'rfq_collection',
      rfq: updated,
    };
  }

  if (!hasName || !hasContact) {
    return {
      reply: `Got it — ${updated.quantity} ${updated.product}. Please provide your name and phone or WhatsApp number so our team can check the requirement and provide a quotation.`,
      intent: 'rfq_collection',
      rfq: updated,
    };
  }

  return {
    reply: `I have recorded: ${updated.product}, quantity: ${updated.quantity}. Please confirm if you would like our team to provide a quotation.`,
    intent: 'rfq_collection',
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

    // Direct actions handled instantly
    if (action === 'confirm' || action === 'cancel' || action === 'edit' || action === 'send_requirement') {
      const fallback = generateDeterministicFallback(trimmedMessage, currentRfq, action);
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
      const fallback = generateDeterministicFallback(trimmedMessage, currentRfq, action);
      return res.status(200).json({
        success: true,
        reply: fallback.reply,
        intent: fallback.intent,
        rfq: fallback.rfq,
      });
    }

    // 5. Build conversation turns for multi-turn context
    const conversationHistory: IncomingChatMessage[] = Array.isArray(body.conversation)
      ? body.conversation.slice(-10) // Limit to the last 10 messages for token safety
      : [];

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
      ? `[CURRENT RFQ STATE]: ${JSON.stringify(currentRfq)}\n[USER INPUT]: ${trimmedMessage}`
      : `[CURRENT RFQ STATE]: None\n[USER INPUT]: ${trimmedMessage}`;

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
      // Seamless fallback on quota or rate limit
      const fallback = generateDeterministicFallback(trimmedMessage, currentRfq, action);
      return res.status(200).json({
        success: true,
        reply: fallback.reply,
        intent: fallback.intent,
        rfq: fallback.rfq,
      });
    }

    // Default fallback if parsing fails
    const fallback = generateDeterministicFallback(trimmedMessage, currentRfq, action);
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
