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
): 'extinguisher' | 'cylinder' | 'gauge' | 'valve' | 'helmet' | 'safety' | 'sheet' | 'pipe' | 'fastener' | 'welding' | 'gasket' | 'custom' {
  const combined = `${productName || ''} ${text || ''}`.toLowerCase();
  if (combined.includes('extinguisher') || combined.includes('fire cylinder') || combined.includes('fire fighting')) return 'extinguisher';
  if (combined.includes('cylinder')) return 'cylinder';
  if (combined.includes('pressure gauge') || (combined.includes('gauge') && !combined.includes('swg'))) return 'gauge';
  if (combined.includes('valve')) return 'valve';
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

  // 4. Grade extraction (for sheets, plates, pipes, welding)
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

  // 5. Quantity extraction (Strict priority to avoid grade collisions like "SS 304 sheet")
  // Pattern A: Change quantity ("change quantity from 100 kg to 250 kg", "make it 250 kg", "update to 250")
  const toQtyMatch = text.match(/(?:(?:from\s+\d+(?:\.\d+)?\s*[a-zA-Z]*\s+)?to|into|update to|make it|quantity[:\s]+)\s*(\d+(?:\.\d+)?)\s*([a-zA-Z]+)?/i);
  // Pattern B: Plain quantity with explicit unit (e.g. "500 kg", "100 pcs", "100 pieces", "50 meters")
  const plainQtyMatch = text.match(/\b(\d+(?:\.\d+)?)\s*(kg|kgs|pieces|piece|pcs|nos|meters|mtr|m|tons|ton|bundles|boxes|pairs|sets|rolls)\b/i);
  // Pattern C: Count with product name (e.g. "10 fire extinguishers", "10 cylinders", "20 pressure gauges")
  const countWithProductMatch = text.match(/\b(\d+(?:\.\d+)?)\s*(?:(?:pieces|piece|pcs|nos)\s*(?:of\s+)?)?(?:fire\s+extinguishers?|extinguishers?|cylinders?|pressure\s+gauges?|valves?|safety\s+helmets?|helmets?|safety\s+shoes?|shoes?|gloves?)\b/i);
  // Pattern D: Standalone number answering quantity prompt (e.g. "10", "20", "100")
  const standaloneNum = text.match(/^\s*(\d+(?:\.\d+)?)\s*$/);

  if (toQtyMatch) {
    const num = toQtyMatch[1];
    const unit = toQtyMatch[2] || updated.unit || 'pcs';
    const newQty = `${num} ${unit}`.trim();
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
    const unit = lower.includes('pieces') || lower.includes('piece') ? 'pieces' : 'pcs';
    const newQty = `${num} ${unit}`.trim();
    if (updated.quantity !== newQty) {
      updated.quantity = newQty;
      updated.unit = unit;
      changedFields.push('quantity');
    }
  } else if (standaloneNum) {
    const num = standaloneNum[1];
    const unit = updated.unit || 'pcs';
    const newQty = `${num} ${unit}`.trim();
    if (updated.quantity !== newQty) {
      updated.quantity = newQty;
      updated.unit = unit;
      changedFields.push('quantity');
    }
  }

  // 6. Thickness extraction (for sheets, plates, gaskets)
  const thicknessMatch = text.match(/(?:thickness[:\s]+|(?:to|into)\s+)?(\d+(?:\.\d+)?(?:\/\d+)?)\s*(mm|inch|"|gauge|swg|thick)\b/i);
  if (thicknessMatch) {
    const unit = thicknessMatch[2].toLowerCase() === 'thick' ? 'mm' : thicknessMatch[2];
    const newThickness = `${thicknessMatch[1]} ${unit}`.trim();
    if (updated.thickness !== newThickness) {
      updated.thickness = newThickness;
      changedFields.push('thickness');
    }
  }

  // 7. Dimensions extraction (for sheets, plates, gaskets)
  const dimMatch = text.match(/(\d+\s*(?:[xX*×]\s*\d+)+(?:\s*(?:ft|feet|meter|m|mm|inch))?)/i);
  if (dimMatch && !updated.dimensions) {
    updated.dimensions = dimMatch[1].trim();
    changedFields.push('dimensions');
  }

  // 8. Specific Product Specifications
  // Fire Extinguishers: Type (ABC, CO2, Foam, Water, Clean Agent) & Capacity (2kg, 4kg, 6kg, 9kg)
  if (lower.includes('abc') || lower.includes('co2') || lower.includes('foam') || lower.includes('clean agent') || lower.includes('dcp') || lower.includes('water type')) {
    const typeMatch = text.match(/\b(ABC\s*(?:powder|dry\s*powder)?|CO2|Mechanical\s*Foam|Foam|Clean\s*Agent|DCP|Water)\b/i);
    if (typeMatch) {
      const spec = typeMatch[0].trim();
      updated.specifications = updated.specifications ? `${updated.specifications}, ${spec}` : spec;
    }
  }
  const extCapMatch = text.match(/\b(\d+(?:\.\d+)?)\s*(?:kg|ltr|liters?)\b/i);
  if (extCapMatch && (updated.product?.includes('Extinguisher') || lower.includes('extinguisher'))) {
    const cap = `${extCapMatch[1]} kg`;
    if (!updated.specifications?.includes(cap)) {
      updated.specifications = updated.specifications ? `${updated.specifications}, Capacity: ${cap}` : `Capacity: ${cap}`;
    }
  }

  // Cylinders: Gas type & Capacity
  const gasMatch = text.match(/\b(Oxygen|Nitrogen|Argon|CO2|Acetylene|DA|Hydrogen|LPG|Helium)\b/i);
  if (gasMatch && (updated.product?.includes('Cylinder') || lower.includes('cylinder'))) {
    const gas = `${gasMatch[0].trim()} Gas`;
    if (!updated.specifications?.includes(gas)) {
      updated.specifications = updated.specifications ? `${updated.specifications}, ${gas}` : gas;
    }
  }

  // Pressure Gauges: Range (e.g., 0-10 bar, 0-100 psi)
  const gaugeRangeMatch = text.match(/\b(\d+(?:\.\d+)?\s*(?:-|to)\s*\d+(?:\.\d+)?\s*(?:bar|psi|kg\/cm2))\b/i);
  if (gaugeRangeMatch) {
    updated.specifications = `Range: ${gaugeRangeMatch[1].trim()}`;
  }

  // Helmets: Type / Color / Standard (ratchet, pin-lock, IS:2925, yellow, white, blue)
  if (lower.includes('ratchet') || lower.includes('pin lock') || lower.includes('pin-lock') || lower.includes('is:2925') || lower.includes('is 2925')) {
    const helmetSpec = lower.includes('ratchet') ? 'Ratchet adjustment' : lower.includes('is') ? 'IS:2925 certified' : 'Pin-lock';
    updated.specifications = helmetSpec;
  }

  // Application extraction
  const appMatch = text.match(/(?:for|in|application[:\s]+)\s*([a-zA-Z\s]{3,30}(?:warehouse|office|factory|plant|electrical|site|workshop|refinery|hospital|building))/i);
  if (appMatch && !updated.application) {
    updated.application = appMatch[1].trim();
    changedFields.push('application');
  }

  // 9. Name detection
  const nameMatch = text.match(/(?:my name is|i am|name[:\s]+)\s*([a-zA-Z\s]{2,30})/i);
  if (nameMatch && !updated.customerName) {
    updated.customerName = nameMatch[1].trim();
    changedFields.push('customerName');
  }

  // 10. Delivery location detection
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

  // 1. Explicit Action: Confirm RFQ
  if (action === 'confirm' || lower === 'confirm rfq' || lower === 'confirm quotation') {
    const confirmedRfq: StructuredRfqData = currentRfq
      ? { ...currentRfq, status: 'confirmed' }
      : { status: 'confirmed' };
    return {
      reply: `I've prepared your enquiry.\n\nAll specifications and contact details have been recorded and structured for quotation processing. When you're ready, our sales team will review the details and provide an official quotation.`,
      intent: 'rfq_confirm',
      rfq: confirmedRfq,
    };
  }

  // 2. Explicit Action: Cancel RFQ
  if (action === 'cancel' || lower.includes('cancel my quotation') || lower === 'cancel rfq' || lower === 'cancel') {
    const cancelledRfq: StructuredRfqData = currentRfq
      ? { ...currentRfq, status: 'cancelled' }
      : { status: 'cancelled' };
    return {
      reply: `Your draft quotation enquiry has been cancelled. Please let me know if you would like to explore any other materials or products.`,
      intent: 'rfq_cancel',
      rfq: cancelledRfq,
    };
  }

  // 3. Explicit Action: Edit RFQ
  if (action === 'edit' || lower === 'edit details' || lower === 'i would like to edit details of my enquiry.') {
    return {
      reply: `What details would you like to update? (For example: quantity, specifications, dimensions, delivery location, or contact details)`,
      intent: 'rfq_edit',
      rfq: currentRfq,
    };
  }

  // 4. Non-Catalogue / Sourcing Question (TEST 3, Suggested Question "Can't find your item?")
  if (
    lower.includes("not in your catalogue") ||
    lower.includes("not in the catalogue") ||
    lower.includes("can't find your item") ||
    lower.includes("cannot find your item") ||
    lower.includes("item not shown") ||
    lower === "can't find your item?" ||
    lower === "can't find your item"
  ) {
    return {
      reply: `Sure, tell us what you need. Share the item name, required quantity and any available specifications, and we'll check the requirement and help with a quotation.`,
      intent: 'product_enquiry',
      rfq: currentRfq,
    };
  }

  // 5. Price Enquiry (TEST 6)
  if (lower.includes('price') || lower.includes('cost') || lower.includes('how much')) {
    // If the enquiry mentions fire extinguishers
    if (lower.includes('extinguisher')) {
      const baseRfq: StructuredRfqData = currentRfq ? { ...currentRfq } : { status: 'draft' };
      const { updated } = extractEntities(text, baseRfq);
      return {
        reply: `Pricing depends on the extinguisher type (ABC, CO2, Foam), capacity/size (e.g., 4 kg, 6 kg), quantity, and delivery location. I can help prepare the quotation request. Please share the required type and capacity, and our team will check the requirement and provide the applicable quotation.`,
        intent: 'price_enquiry',
        rfq: updated,
      };
    }

    return {
      reply: `Pricing depends on the material, specification, quantity and current market conditions. I can collect your requirement and prepare it for a quotation request. What specific material and quantity do you need?`,
      intent: 'price_enquiry',
      rfq: currentRfq,
    };
  }

  // 6. Availability Enquiry (TEST 7 & General Availability)
  if (
    lower.startsWith('do you have') ||
    lower.includes('available') ||
    lower.includes('in stock') ||
    lower.includes('ready stock')
  ) {
    // If checking for pressure gauges specifically (TEST 7)
    if (lower.includes('pressure gauge') || lower.includes('gauge')) {
      const baseRfq: StructuredRfqData = currentRfq ? { ...currentRfq } : { status: 'draft' };
      baseRfq.product = 'Pressure Gauges';
      return {
        reply: `We can check that requirement for you. Please tell me the quantity and required range/specification if known.`,
        intent: 'availability_enquiry',
        rfq: baseRfq,
      };
    }

    return {
      reply: `We can check the requirement for you. Please share the quantity and specification, and we'll help you with the quotation.`,
      intent: 'availability_enquiry',
      rfq: currentRfq,
    };
  }

  // 7. Delivery Guarantee Enquiry
  if (lower.includes('guarantee delivery') || lower.includes('deliver tomorrow') || lower.includes('guarantee')) {
    return {
      reply: `I cannot guarantee delivery timelines as delivery depends on order volume, exact specifications, and logistics. Our dispatch team coordinates timelines once the quotation is finalized.`,
      intent: 'delivery_guarantee',
      rfq: currentRfq,
    };
  }

  // 8. Product Recommendation / Technical Question
  if (lower.includes('which fire extinguisher') || lower.includes('what fire extinguisher')) {
    return {
      reply: `Choosing the right fire extinguisher depends on the hazard environment:
• General Offices & Warehouses: ABC dry chemical powder (versatile for solids, liquids, and electrical fires).
• Electrical Control Rooms & Panels: CO2 or Clean Agent extinguishers to avoid residue damage to sensitive equipment.
• Flammable Liquid Storage: Mechanical Foam or ABC Powder.

Where will the extinguishers be installed, and what is the facility or area risk?`,
      intent: 'recommendation',
      rfq: currentRfq,
    };
  }

  if (lower.includes('chemical plant') || lower.includes('which material') || lower.includes('recommend')) {
    return {
      reply: `For demanding applications such as chemical plants, material selection depends heavily on specific operating conditions. Could you share what chemicals are involved, operating temperature, and pressure? Please note that final material selection should always be confirmed by a technical professional or our Rajdeep team.`,
      intent: 'recommendation',
      rfq: currentRfq,
    };
  }

  // 9. General Educational Questions (Answer normally without forcing RFQ)
  if (lower.startsWith('what is') || lower.startsWith('tell me about')) {
    if (lower.includes('fire extinguisher')) {
      return {
        reply: `A fire extinguisher is an active fire protection device used to extinguish or control small fires in emergency situations. Common industrial types include ABC dry powder (for general industrial and electrical fires), CO2 extinguishers (for electrical panels and machinery), mechanical foam, and clean agent systems. Are you looking to procure fire extinguishers for a facility or site?`,
        intent: 'general_question',
        rfq: currentRfq,
      };
    }
    if (lower.includes('stainless steel')) {
      return {
        reply: `Stainless steel is an iron alloy containing a minimum of 10.5% chromium, which provides excellent resistance to corrosion, rust, and high temperatures. Common industrial grades include SS 304 (standard general-purpose) and SS 316 (marine and chemical grade with molybdenum). Are you looking for stainless steel sheets, pipes, or fasteners for a project?`,
        intent: 'general_question',
        rfq: currentRfq,
      };
    }
    if (lower.includes('champion gasket')) {
      return {
        reply: `Champion gasket sheets are compressed asbestos and non-asbestos fiber jointing sheets manufactured for high-temperature and high-pressure steam, oil, chemical, and gas flange sealing in refineries and industrial plants. We supply standard styles including Style 20, Style 54 Super, and metallic gaskets. Would you like a quotation for gasket sheets?`,
        intent: 'general_question',
        rfq: currentRfq,
      };
    }
  }

  // 10. Contact / Human Agent
  if (lower.includes('human') || lower.includes('person') || lower.includes('contact number') || lower.includes('call you')) {
    return {
      reply: `You can reach our Proprietor & Supply Lead, Raj Singh Tarkar, directly at +91 99979 93895 or +91 89239 93895, or visit our office at 15/1, U.P. S.I.D.C. Complex, Refinery Main Gate, Mathura. Would you like me to note down your requirements so our team can contact you?`,
      intent: 'human_agent',
      rfq: currentRfq,
    };
  }

  // 11. RFQ Entity Extraction & Smart Product-Specific Questioning
  const baseRfq: StructuredRfqData = currentRfq ? { ...currentRfq } : { status: 'draft' };
  const { updated, changedFields } = extractEntities(text, baseRfq);
  const category = detectProductCategory(updated.product, text);

  // Check for direct edit like "change quantity from 100 kg to 250 kg" or "change quantity to 250 kg"
  if (lower.includes('change quantity') || (changedFields.includes('quantity') && baseRfq.quantity)) {
    const isReady = Boolean(
      (updated.product || updated.material) &&
      updated.customerName &&
      (updated.phone || updated.email)
    );
    if (isReady) {
      updated.status = 'ready_for_review';
      return {
        reply: `I have updated your quantity to ${updated.quantity}. Here is your updated enquiry summary:

Item: ${updated.product || updated.material || 'Material Supply'}
${updated.grade ? `Grade: ${updated.grade}\n` : ''}${updated.specifications ? `Specification: ${updated.specifications}\n` : ''}${updated.thickness ? `Thickness: ${updated.thickness}\n` : ''}${updated.dimensions ? `Dimensions: ${updated.dimensions}\n` : ''}Quantity: ${updated.quantity}
${updated.deliveryLocation ? `Delivery Location: ${updated.deliveryLocation}\n` : ''}Name: ${updated.customerName}
${updated.companyName ? `Company: ${updated.companyName}\n` : ''}Phone: ${updated.phone || updated.email}

Would you like me to prepare this enquiry for submission?`,
        intent: 'rfq_edit',
        rfq: updated,
      };
    }

    return {
      reply: `I have updated your quantity to ${updated.quantity}. ${
        category === 'sheet'
          ? 'What thickness or dimensions do you require?'
          : category === 'extinguisher'
          ? 'What type or capacity do you require?'
          : 'Do you have any required specifications or standards?'
      }`,
      intent: 'rfq_edit',
      rfq: updated,
    };
  }

  // Assess collected state
  const hasProduct = Boolean(updated.product || updated.material);
  const hasQuantity = Boolean(updated.quantity);
  const hasName = Boolean(updated.customerName);
  const hasContact = Boolean(updated.phone || updated.email);

  // If we have product, quantity, customer name, and contact -> Ready for Summary!
  if (hasProduct && hasQuantity && hasName && hasContact) {
    updated.status = 'ready_for_review';
    const summaryText = `Here is your enquiry summary:

Item: ${updated.product || updated.material || 'Material Supply'}
${updated.grade ? `Grade: ${updated.grade}\n` : ''}${updated.specifications ? `Specification: ${updated.specifications}\n` : ''}${updated.thickness ? `Thickness: ${updated.thickness}\n` : ''}${updated.dimensions ? `Dimensions: ${updated.dimensions}\n` : ''}Quantity: ${updated.quantity}
${updated.application ? `Application: ${updated.application}\n` : ''}${updated.deliveryLocation ? `Delivery Location: ${updated.deliveryLocation}\n` : ''}Name: ${updated.customerName}
${updated.companyName ? `Company: ${updated.companyName}\n` : ''}Phone: ${updated.phone || updated.email}

Would you like me to prepare this enquiry for submission?`;

    return {
      reply: summaryText,
      intent: 'rfq_request',
      rfq: updated,
    };
  }

  // ----------------------------------------------------
  // PRODUCT-SPECIFIC SMART QUESTIONING FLOWS
  // ----------------------------------------------------

  // Flow A: FIRE EXTINGUISHERS (TEST 1)
  if (category === 'extinguisher') {
    if (!hasQuantity) {
      return {
        reply: `Sure. How many fire extinguishers do you need?`,
        intent: 'rfq_collection',
        rfq: updated,
      };
    }
    const cleanQty = updated.quantity ? updated.quantity.replace(/\s*(?:pcs|pieces|nos)\b/i, '').trim() : '10';
    if (!updated.specifications && !updated.application) {
      return {
        reply: `Got it — ${cleanQty} fire extinguishers. What type (such as ABC powder, CO2, foam, or clean agent) and capacity (e.g., 2 kg, 4 kg, 6 kg, 9 kg) do you require? If you're not sure, tell me where they will be used (office, warehouse, factory, electrical area), and our team can help identify the requirement.`,
        intent: 'rfq_collection',
        rfq: updated,
      };
    }
    if (!hasName || !hasContact) {
      return {
        reply: `To prepare the enquiry for the Rajdeep Enterprises team, may I have your name, delivery location, and a phone or WhatsApp number?`,
        intent: 'rfq_collection',
        rfq: updated,
      };
    }
  }

  // Flow B: CYLINDERS (TEST 2)
  if (category === 'cylinder') {
    if (!hasQuantity) {
      return {
        reply: `Sure. How many cylinders do you need?`,
        intent: 'rfq_collection',
        rfq: updated,
      };
    }
    const cleanQty = updated.quantity ? updated.quantity.replace(/\s*(?:pcs|pieces|nos)\b/i, '').trim() : '10';
    if (!updated.specifications) {
      return {
        reply: `Got it — ${cleanQty} cylinders. What type of cylinder or gas do you require (for example: Oxygen, Nitrogen, Argon, CO2, or Acetylene) and what capacity or pressure specification do you need?`,
        intent: 'rfq_collection',
        rfq: updated,
      };
    }
    if (!hasName || !hasContact) {
      return {
        reply: `To prepare the enquiry for the Rajdeep Enterprises team, may I have your name, delivery location, and a phone or WhatsApp number?`,
        intent: 'rfq_collection',
        rfq: updated,
      };
    }
  }

  // Flow C: SAFETY HELMETS (TEST 4)
  if (category === 'helmet') {
    if (!hasQuantity) {
      return {
        reply: `Sure. How many safety helmets do you need?`,
        intent: 'rfq_collection',
        rfq: updated,
      };
    }
    const qtyText = updated.quantity?.includes('piece') ? `${updated.quantity} of` : updated.quantity;
    if (!updated.specifications) {
      return {
        reply: `Got it — ${qtyText} safety helmets. Do you have any preferred type (ratchet or pin-lock), color (white, yellow, blue, etc.), or certification standard (such as IS:2925)?`,
        intent: 'rfq_collection',
        rfq: updated,
      };
    }
    if (!hasName || !hasContact) {
      return {
        reply: `To prepare the enquiry for the Rajdeep Enterprises team, may I have your name, delivery location, and a phone or WhatsApp number?`,
        intent: 'rfq_collection',
        rfq: updated,
      };
    }
  }

  // Flow D: PRESSURE GAUGES (TEST 7 & Non-catalogue flow)
  if (category === 'gauge') {
    if (!hasQuantity) {
      return {
        reply: `Sure, we can check that requirement for you. How many pressure gauges do you need?`,
        intent: 'rfq_collection',
        rfq: updated,
      };
    }
    const cleanQty = updated.quantity ? updated.quantity.replace(/\s*(?:pcs|pieces|nos)\b/i, '').trim() : '20';
    if (!updated.specifications) {
      return {
        reply: `Got it — ${cleanQty} pressure gauges. Do you know the required pressure range, connection size or any preferred specification? If you're not sure, tell me where they will be used and our team can check the requirement.`,
        intent: 'rfq_collection',
        rfq: updated,
      };
    }
    if (!hasName || !hasContact) {
      return {
        reply: `To prepare the enquiry for the Rajdeep Enterprises team, may I have your name, delivery location, and a phone or WhatsApp number?`,
        intent: 'rfq_collection',
        rfq: updated,
      };
    }
  }

  // Flow E: INDUSTRIAL VALVES
  if (category === 'valve') {
    if (!hasQuantity) {
      return {
        reply: `Sure. Please share the valve type, size, material/specification if known, quantity and delivery location. We'll check the requirement and help with the quotation.`,
        intent: 'rfq_collection',
        rfq: updated,
      };
    }
    if (!hasName || !hasContact) {
      return {
        reply: `To prepare the enquiry for the Rajdeep Enterprises team, may I have your name, delivery location, and a phone or WhatsApp number?`,
        intent: 'rfq_collection',
        rfq: updated,
      };
    }
  }

  // Flow F: SHEETS / PLATES (TEST 5)
  if (category === 'sheet') {
    if (!updated.grade) {
      return {
        reply: `What grade do you need, if known (for example: SS 304, SS 316, or MS)?`,
        intent: 'material_enquiry',
        rfq: updated,
      };
    }
    if (!hasQuantity) {
      return {
        reply: `What quantity and thickness do you require?`,
        intent: 'rfq_collection',
        rfq: updated,
      };
    }
    if (!updated.thickness && !updated.dimensions) {
      return {
        reply: `I have noted ${updated.grade} ${updated.material || 'stainless steel'} sheet and ${updated.quantity}. What thickness (for example: 2 mm, 3 mm) and dimensions (such as 4×8 ft) do you require?`,
        intent: 'rfq_collection',
        rfq: updated,
      };
    }
    if (!updated.thickness) {
      return {
        reply: `Thanks. What thickness do you require (for example: 2 mm, 3 mm)?`,
        intent: 'rfq_collection',
        rfq: updated,
      };
    }
    if (!updated.dimensions) {
      return {
        reply: `Got it. Do you have any required dimensions, such as 4×8 ft?`,
        intent: 'rfq_collection',
        rfq: updated,
      };
    }
    if (!hasName || !hasContact) {
      return {
        reply: `To prepare the enquiry for the Rajdeep Enterprises team, may I have your name, delivery location, and a phone or WhatsApp number?`,
        intent: 'rfq_collection',
        rfq: updated,
      };
    }
  }

  // Flow G: PIPES / TUBES
  if (category === 'pipe') {
    if (!hasQuantity) {
      return {
        reply: `What size/diameter (NB/OD), wall thickness/schedule, and quantity do you need?`,
        intent: 'rfq_collection',
        rfq: updated,
      };
    }
    if (!hasName || !hasContact) {
      return {
        reply: `To prepare the enquiry for the Rajdeep Enterprises team, may I have your name, delivery location, and a phone or WhatsApp number?`,
        intent: 'rfq_collection',
        rfq: updated,
      };
    }
  }

  // Flow H: GENERAL PRODUCT ENQUIRY
  if (!hasProduct) {
    return {
      reply: `Sure. What product or material are you looking for?`,
      intent: 'product_enquiry',
      rfq: updated,
    };
  }

  if (!hasQuantity) {
    return {
      reply: `Got it. What quantity do you need?`,
      intent: 'rfq_collection',
      rfq: updated,
    };
  }

  if (!hasName || !hasContact) {
    return {
      reply: `To prepare the enquiry for the Rajdeep Enterprises team, may I have your name, delivery location, and a phone or WhatsApp number?`,
      intent: 'rfq_collection',
      rfq: updated,
    };
  }

  return {
    reply: `I have noted: ${updated.product || updated.material} ${updated.grade || ''}, ${updated.quantity || ''}. May I have your name and contact number to prepare your quotation enquiry?`,
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
    if (action === 'confirm' || action === 'cancel' || action === 'edit') {
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
        // Strip markdown code fences if Gemini added ```json ... ```
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          try {
            parsedData = JSON.parse(jsonMatch[0]);
          } catch {}
        }
      }

      if (parsedData && typeof parsedData.reply === 'string') {
        // Validate contact fields if provided
        const extractedRfq: StructuredRfqData = parsedData.rfq || currentRfq || { status: 'draft' };

        if (extractedRfq.email && !isValidEmail(extractedRfq.email)) {
          delete extractedRfq.email;
        }
        if (extractedRfq.phone && !isValidPhone(extractedRfq.phone)) {
          delete extractedRfq.phone;
        }

        // Merge with existing fields so information is never lost
        const mergedRfq: StructuredRfqData = {
          ...(currentRfq || {}),
          ...extractedRfq,
          status: extractedRfq.status || currentRfq?.status || 'draft',
        };

        // If product/material, quantity, customerName, and contact are present, set ready_for_review
        const hasCoreRequirements = Boolean(
          (mergedRfq.product || mergedRfq.material) &&
          (mergedRfq.quantity || mergedRfq.specifications) &&
          mergedRfq.customerName &&
          (mergedRfq.phone || mergedRfq.email)
        );

        if (hasCoreRequirements && mergedRfq.status === 'draft') {
          mergedRfq.status = 'ready_for_review';
        }

        return res.status(200).json({
          success: true,
          reply: parsedData.reply,
          intent: parsedData.intent || 'product_enquiry',
          rfq: mergedRfq,
        });
      }
    } catch (geminiError: any) {
      console.warn('[ChatAPI] Gemini API call returned error or rate limit, switching to fallback:', geminiError?.message || geminiError);
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
