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

// Helper to sanitize and validate phone numbers
function isValidPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 7 && digits.length <= 15;
}

// Helper to validate email format
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

// Helper to extract entities deterministically from text
function extractEntities(text: string, current: StructuredRfqData): { updated: StructuredRfqData; changedFields: string[] } {
  const updated: StructuredRfqData = { ...current };
  const changedFields: string[] = [];

  // 1. Phone extraction (Indian standard or international 10-12 digits)
  const phoneMatch = text.match(/(?:\+?91[\s-]?)?[6789]\d{9}|\b\d{10,12}\b/);
  if (phoneMatch && !updated.phone) {
    updated.phone = phoneMatch[0].trim();
    changedFields.push('phone');
  }

  // 2. Email extraction
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  if (emailMatch && !updated.email) {
    updated.email = emailMatch[0].trim();
    changedFields.push('email');
  }

  // 3. Quantity extraction (handles "from 100 kg to 250 kg", "change quantity to 250 kg", or standard "500 kg")
  const toQtyMatch = text.match(/(?:to|into|update to|make it)\s+(\d+(?:\.\d+)?)\s*(kg|kgs|pieces|piece|pcs|nos|meters|mtr|tons|ton|bundles|boxes)\b/i);
  const qtyMatch = toQtyMatch || text.match(/(\d+(?:\.\d+)?)\s*(kg|kgs|pieces|piece|pcs|nos|meters|mtr|tons|ton|bundles|boxes)\b/i);
  if (qtyMatch) {
    const newQty = `${qtyMatch[1]} ${qtyMatch[2]}`;
    if (updated.quantity !== newQty) {
      updated.quantity = newQty;
      changedFields.push('quantity');
    }
  }

  // 4. Grade extraction (e.g., "SS 304", "SS 316", "304", "316L", "E6013", "E7018", "MS", "GI")
  const toGradeMatch = text.match(/(?:to|into|grade)\s+(SS\s*304L?|SS\s*316L?|304L?|316L?|E7018|E6013|ER70S-6|MS|GI)\b/i);
  const gradeMatch = toGradeMatch || text.match(/\b(SS\s*304L?|SS\s*316L?|304L?|316L?|E7018|E6013|ER70S-6|MS|GI|Carbon Steel|Alloy Steel)\b/i);
  if (gradeMatch) {
    const newGrade = gradeMatch[1].toUpperCase().trim();
    if (updated.grade !== newGrade) {
      updated.grade = newGrade;
      changedFields.push('grade');
    }
  }

  // 5. Thickness extraction (e.g., "3 mm", "3mm", "5 mm thick", "10 gauge")
  const toThicknessMatch = text.match(/(?:to|into|update to)\s+(\d+(?:\.\d+)?)\s*(mm|inch|"|gauge|swg)\b/i);
  const thicknessMatch = toThicknessMatch || text.match(/(\d+(?:\.\d+)?)\s*(mm|inch|"|gauge|swg)\b/i);
  if (thicknessMatch) {
    const newThickness = `${thicknessMatch[1]} ${thicknessMatch[2]}`;
    if (updated.thickness !== newThickness) {
      updated.thickness = newThickness;
      changedFields.push('thickness');
    }
  }

  // 6. Dimensions extraction (e.g., "4x8 ft", "4x8", "1250x2500 mm", "6 meter")
  const dimMatch = text.match(/(\d+\s*(?:[xX*×]\s*\d+)+(?:\s*(?:ft|feet|meter|m|mm|inch))?)/i);
  if (dimMatch && !updated.dimensions) {
    updated.dimensions = dimMatch[1].trim();
    changedFields.push('dimensions');
  }

  // 7. Product & Material detection
  const lower = text.toLowerCase();
  if (lower.includes('sheet') || lower.includes('plate')) {
    if (!updated.product) {
      updated.product = 'Steel Sheets / Plates';
      changedFields.push('product');
    }
    if (!updated.material) updated.material = updated.grade?.includes('SS') || lower.includes('stainless') ? 'Stainless Steel' : 'Steel';
  } else if (lower.includes('pipe') || lower.includes('tube')) {
    if (!updated.product) {
      updated.product = 'Pipes & Tubes';
      changedFields.push('product');
    }
    if (!updated.material) updated.material = lower.includes('seamless') ? 'Seamless Steel' : 'Stainless / Carbon Steel';
  } else if (lower.includes('helmet') || lower.includes('safety shoe') || lower.includes('glove') || lower.includes('harness') || lower.includes('goggle')) {
    if (!updated.product) {
      if (lower.includes('helmet')) updated.product = 'Industrial Safety Helmets';
      else if (lower.includes('shoe')) updated.product = 'Safety Shoes';
      else if (lower.includes('glove')) updated.product = 'Safety Hand Gloves';
      else if (lower.includes('harness')) updated.product = 'Safety Harness';
      else if (lower.includes('goggle')) updated.product = 'Safety Goggles';
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
  }

  // 8. Name detection (e.g., "my name is Rahul", "I am Rahul Sharma", "name: Rahul")
  const nameMatch = text.match(/(?:my name is|i am|name[:\s]+)\s*([a-zA-Z\s]{2,30})/i);
  if (nameMatch && !updated.customerName) {
    updated.customerName = nameMatch[1].trim();
    changedFields.push('customerName');
  }

  // 9. Delivery location (e.g., "delivery in Mathura", "location Mathura", "deliver to Delhi")
  const locMatch = text.match(/(?:delivery (?:in|to|at)|deliver to|location[:\s]+)\s*([a-zA-Z\s]{2,30})/i);
  if (locMatch && !updated.deliveryLocation) {
    updated.deliveryLocation = locMatch[1].trim();
    changedFields.push('deliveryLocation');
  }

  return { updated, changedFields };
}

// Fallback response generator when Gemini quota or high-demand occurs
function generateDeterministicFallback(
  message: string,
  currentRfq: StructuredRfqData | null,
  action?: string
): { reply: string; intent: string; rfq: StructuredRfqData | null } {
  const text = message.trim();
  const lower = text.toLowerCase();

  // Action handling
  if (action === 'confirm' || lower === 'confirm rfq' || lower === 'confirm quotation') {
    const confirmedRfq: StructuredRfqData = currentRfq
      ? { ...currentRfq, status: 'confirmed' }
      : { status: 'confirmed' };
    return {
      reply: `Thank you! Your quotation enquiry has been verified and prepared for our team. When ready for submission, our sales team will review the specifications and share the official quotation with you.`,
      intent: 'rfq_confirm',
      rfq: confirmedRfq,
    };
  }

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

  if (action === 'edit' || lower === 'edit details') {
    return {
      reply: `What details would you like to update? (For example: quantity, grade, dimensions, delivery location, or contact details)`,
      intent: 'rfq_edit',
      rfq: currentRfq,
    };
  }

  // 1. Price enquiry
  if (lower.includes('price') || lower.includes('cost') || lower.includes('how much')) {
    return {
      reply: `Pricing depends on the material, specification, quantity and current market conditions. I can collect your requirement and prepare it for a quotation request. What specific material and quantity do you need?`,
      intent: 'price_enquiry',
      rfq: currentRfq,
    };
  }

  // 2. Availability enquiry
  if (lower.includes('available') || lower.includes('in stock') || lower.includes('ready stock')) {
    return {
      reply: `I can help collect your requirement, but I don't have live inventory information. Would you like to submit a quotation enquiry?`,
      intent: 'availability_enquiry',
      rfq: currentRfq,
    };
  }

  // 3. Delivery guarantee enquiry
  if (lower.includes('guarantee delivery') || lower.includes('deliver tomorrow') || lower.includes('guarantee')) {
    return {
      reply: `I cannot guarantee delivery timelines as delivery depends on order volume, exact specifications, and logistics. Our dispatch team coordinates timelines once the quotation is finalized.`,
      intent: 'delivery_guarantee',
      rfq: currentRfq,
    };
  }

  // 4. Recommendation question (e.g. chemical plant)
  if (lower.includes('chemical plant') || lower.includes('which material') || lower.includes('recommend')) {
    return {
      reply: `For demanding applications such as chemical plants, material selection depends heavily on specific operating conditions. Could you share the application, chemicals involved, operating temperature, and pressure? Please note that final material selection should always be confirmed by a technical professional or our Rajdeep team.`,
      intent: 'recommendation',
      rfq: currentRfq,
    };
  }

  // 5. General question (e.g. "What is stainless steel?")
  if (lower.startsWith('what is') || lower.startsWith('tell me about')) {
    if (lower.includes('stainless steel')) {
      return {
        reply: `Stainless steel is an iron alloy containing a minimum of 10.5% chromium, which provides excellent resistance to corrosion, rust, and high temperatures. Common industrial grades include SS 304 (standard general-purpose) and SS 316 (marine and chemical grade with molybdenum). Are you looking for stainless steel sheets, pipes, or fasteners for a project?`,
        intent: 'general_question',
        rfq: currentRfq,
      };
    }
    if (lower.includes('champion gasket')) {
      return {
        reply: `Champion gasket sheets are compressed asbestos and non-asbestos fiber jointing sheets manufactured for high-temperature and high-pressure steam, oil, chemical, and gas flange sealing in refineries and industrial plants. We supply all standard styles including Style 20, Style 54 Super, and metallic gaskets. Would you like a quotation for gasket sheets?`,
        intent: 'general_question',
        rfq: currentRfq,
      };
    }
  }

  // 6. Contact / Human agent
  if (lower.includes('human') || lower.includes('person') || lower.includes('contact number') || lower.includes('call you')) {
    return {
      reply: `You can reach our Proprietor & Supply Lead, Raj Singh Tarkar, directly at +91 99979 93895 or +91 89239 93895, or visit our office at 15/1, U.P. S.I.D.C. Complex, Refinery Main Gate, Mathura. Would you like me to note down your requirements so our team can contact you?`,
      intent: 'human_agent',
      rfq: currentRfq,
    };
  }

  // 7. RFQ extraction & Smart Questioning
  const baseRfq: StructuredRfqData = currentRfq ? { ...currentRfq } : { status: 'draft' };
  const { updated, changedFields } = extractEntities(text, baseRfq);

  // Check for direct edit like "change quantity from 100 kg to 250 kg" or "change quantity to 250 kg"
  if (lower.includes('change quantity') || (changedFields.includes('quantity') && baseRfq.quantity)) {
    return {
      reply: `I have updated your quantity to ${updated.quantity}. ${
        updated.status === 'ready_for_review'
          ? 'Here is your updated enquiry. Would you like to confirm it or make any further changes?'
          : 'What thickness or dimensions do you require?'
      }`,
      intent: 'rfq_edit',
      rfq: updated,
    };
  }

  // Check what is missing and ask only 1 or 2 relevant questions
  const hasProduct = Boolean(updated.product || updated.material);
  const hasQuantity = Boolean(updated.quantity);
  const hasThickness = Boolean(updated.thickness);
  const hasDimensions = Boolean(updated.dimensions);
  const hasName = Boolean(updated.customerName);
  const hasContact = Boolean(updated.phone || updated.email);
  const hasLocation = Boolean(updated.deliveryLocation);

  // If we have product, quantity, name, and contact -> Ready for Summary!
  if (hasProduct && hasQuantity && hasName && hasContact) {
    updated.status = 'ready_for_review';
    const summaryText = `Here is your enquiry summary:

Product: ${updated.product || updated.material || 'Material Supply'}
${updated.grade ? `Grade: ${updated.grade}\n` : ''}${updated.thickness ? `Thickness: ${updated.thickness}\n` : ''}${updated.dimensions ? `Dimensions: ${updated.dimensions}\n` : ''}Quantity: ${updated.quantity}
${updated.deliveryLocation ? `Delivery Location: ${updated.deliveryLocation}\n` : ''}Name: ${updated.customerName}
${updated.companyName ? `Company: ${updated.companyName}\n` : ''}Phone: ${updated.phone || updated.email}

Would you like me to prepare this enquiry for submission?`;

    return {
      reply: summaryText,
      intent: 'rfq_request',
      rfq: updated,
    };
  }

  // Stepwise questioning
  if (!hasProduct) {
    return {
      reply: `Sure! I can help with your enquiry. What product or material are you looking for?`,
      intent: 'product_enquiry',
      rfq: updated,
    };
  }

  if (!updated.grade && (updated.product?.includes('Steel') || updated.material?.includes('Steel'))) {
    return {
      reply: `What grade do you need, if known (for example: SS 304, SS 316, or MS)?`,
      intent: 'rfq_collection',
      rfq: updated,
    };
  }

  if (!hasQuantity) {
    return {
      reply: `Got it. What quantity do you need? (For example: 100 kg, 50 pieces)`,
      intent: 'rfq_collection',
      rfq: updated,
    };
  }

  if (!hasThickness && (updated.product?.includes('Sheet') || updated.product?.includes('Plate'))) {
    return {
      reply: `Thanks. What thickness do you require (for example: 2 mm, 3 mm)?`,
      intent: 'rfq_collection',
      rfq: updated,
    };
  }

  if (!hasDimensions && (updated.product?.includes('Sheet') || updated.product?.includes('Plate'))) {
    return {
      reply: `Got it. Do you have any required dimensions, such as 4×8 ft or standard coil?`,
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
      console.warn('[ChatAPI] GEMINI_API_KEY is not configured in the server environment. Running fallback mode.');
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
          temperature: 0.4,
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

        // If product/material, quantity/specifications, name, and contact are present, ensure ready_for_review
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
