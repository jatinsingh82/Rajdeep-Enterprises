const MAX_PAYLOAD_SIZE = 64 * 1024;
function sanitizeText(input, maxLength = 1e3) {
  if (typeof input !== "string") {
    if (typeof input === "number" || typeof input === "boolean") {
      return String(input).slice(0, maxLength);
    }
    return "";
  }
  return input.replace(/<[^>]*>/g, "").replace(/[\u0000-\u0008\u000B-\u000C\u000E-\u001F]/g, "").trim().slice(0, maxLength);
}
function validatePhone(phone) {
  if (typeof phone !== "string" && typeof phone !== "number") {
    return { valid: false, sanitized: "", error: "Phone number is required." };
  }
  const digitsOnly = String(phone).replace(/\D/g, "");
  if (digitsOnly.length < 10 || digitsOnly.length > 15) {
    return {
      valid: false,
      sanitized: digitsOnly,
      error: "Please enter a valid 10-digit mobile or phone number."
    };
  }
  return { valid: true, sanitized: digitsOnly };
}
function validateEmail(email) {
  if (!email || typeof email === "string" && email.trim() === "") {
    return { valid: true, sanitized: "" };
  }
  if (typeof email !== "string") {
    return { valid: false, sanitized: "", error: "Email must be a valid text string." };
  }
  const trimmed = email.trim().toLowerCase();
  if (trimmed.length > 100) {
    return { valid: false, sanitized: "", error: "Email address exceeds maximum length of 100 characters." };
  }
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  if (!emailRegex.test(trimmed)) {
    return { valid: false, sanitized: "", error: "Please enter a valid email address (e.g. name@company.com)." };
  }
  return { valid: true, sanitized: trimmed };
}
function validateEnquiryInput(body) {
  const errors = [];
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return { valid: false, errors: ["Invalid request payload. Expected a JSON object."] };
  }
  const payloadSize = JSON.stringify(body).length;
  if (payloadSize > MAX_PAYLOAD_SIZE) {
    return { valid: false, errors: ["Request payload exceeds maximum allowed size (64 KB)."] };
  }
  const isCallback = Boolean(body.isCallback);
  const name = sanitizeText(body.name || body.fullName || body.contactPerson, 100);
  if (!isCallback && (!name || name.length < 2)) {
    errors.push("Full Name must be at least 2 characters.");
  }
  const phoneValidation = validatePhone(body.phone || body.phoneNumber || body.mobile);
  if (!phoneValidation.valid) {
    errors.push(phoneValidation.error || "Invalid phone number.");
  }
  const emailValidation = validateEmail(body.email || body.emailAddress);
  if (!emailValidation.valid) {
    errors.push(emailValidation.error || "Invalid email address.");
  }
  const productName = sanitizeText(body.productName || body.productRequirement || body.requirement || body.product || "", 200);
  if (!isCallback && !productName) {
    errors.push("Please specify the required product or material category.");
  }
  const companyName = sanitizeText(body.companyName || body.company || "", 120);
  const category = sanitizeText(body.category || "General Industrial Supplies", 100);
  const quantity = sanitizeText(body.quantity || "1", 50);
  const siteLocation = sanitizeText(body.deliveryLocation || body.siteLocation || body.location || "", 200);
  const notes = sanitizeText(body.notes || body.message || "", 2e3);
  const urgency = sanitizeText(body.urgency || "standard", 30);
  const source = sanitizeText(body.source || "website_enquiry_form", 50);
  if (errors.length > 0) {
    return { valid: false, errors };
  }
  return {
    valid: true,
    errors: [],
    data: {
      name,
      phone: phoneValidation.sanitized,
      email: emailValidation.sanitized,
      companyName,
      productName,
      category,
      quantity,
      siteLocation,
      notes,
      urgency,
      source,
      isCallback
    }
  };
}
function validateRfqInput(body) {
  const errors = [];
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return { valid: false, errors: ["Invalid request payload. Expected a JSON object."] };
  }
  const payloadSize = JSON.stringify(body).length;
  if (payloadSize > MAX_PAYLOAD_SIZE) {
    return { valid: false, errors: ["Request payload exceeds maximum allowed size (64 KB)."] };
  }
  const name = sanitizeText(body.name || body.contractorName || body.fullName || body.contactPerson, 100);
  if (!name || name.length < 2) {
    errors.push("Contact Person name must be at least 2 characters.");
  }
  const phoneValidation = validatePhone(body.phone || body.phoneNumber || body.mobile);
  if (!phoneValidation.valid) {
    errors.push(phoneValidation.error || "Invalid phone number.");
  }
  const emailValidation = validateEmail(body.email || body.emailAddress);
  if (!emailValidation.valid) {
    errors.push(emailValidation.error || "Invalid email address.");
  }
  const companyName = sanitizeText(body.companyName || body.company, 120);
  const gstNumber = sanitizeText(body.gstNumber, 20);
  const deliverySite = sanitizeText(body.deliverySite || body.siteLocation, 200);
  const targetTimeline = sanitizeText(body.targetTimeline || body.timeline, 50);
  const notes = sanitizeText(body.notes || body.projectNotes, 2e3);
  const requestMtc = Boolean(body.requestMtc || body.needMtc);
  const source = sanitizeText(body.source || "website_rfq_builder", 50);
  const rawItems = body.items || body.rfqItems;
  if (!Array.isArray(rawItems) || rawItems.length === 0) {
    errors.push("At least one product item is required in the RFQ bill of quantities.");
  } else if (rawItems.length > 100) {
    errors.push("RFQ cannot exceed 100 line items.");
  }
  const sanitizedItems = [];
  if (Array.isArray(rawItems)) {
    for (let i = 0; i < Math.min(rawItems.length, 100); i++) {
      const item = rawItems[i];
      if (!item || typeof item !== "object") continue;
      const itemName = sanitizeText(item.name || item.productName, 150);
      if (!itemName) {
        errors.push(`Item #${i + 1} has an invalid or empty name.`);
        continue;
      }
      const qtyNum = Number(item.quantity);
      const safeQty = Number.isFinite(qtyNum) && qtyNum > 0 ? Math.min(Math.floor(qtyNum), 1e6) : 1;
      sanitizedItems.push({
        id: sanitizeText(item.id || `item-${i + 1}`, 50),
        name: itemName,
        category: sanitizeText(item.category || "Industrial Supplies", 100),
        quantity: safeQty,
        unit: sanitizeText(item.unit || "pcs", 20)
      });
    }
  }
  if (sanitizedItems.length === 0 && errors.length === 0) {
    errors.push("No valid items found in the RFQ submission.");
  }
  if (errors.length > 0) {
    return { valid: false, errors };
  }
  return {
    valid: true,
    errors: [],
    data: {
      name,
      phone: phoneValidation.sanitized,
      email: emailValidation.sanitized,
      companyName,
      gstNumber,
      deliverySite,
      targetTimeline,
      notes,
      requestMtc,
      items: sanitizedItems,
      source
    }
  };
}
export {
  sanitizeText,
  validateEmail,
  validateEnquiryInput,
  validatePhone,
  validateRfqInput
};
