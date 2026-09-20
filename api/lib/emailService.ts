import nodemailer from 'nodemailer';
import type { SendMailOptions } from 'nodemailer';

/**
 * Server-Side Production Email Notification Service for Rajdeep Enterprises
 *
 * Dispatches notification emails via Gmail SMTP to:
 * rajdeepenterprises0047@gmail.com
 *
 * Security & Reliability Guarantees:
 * - Server-side only (never exposes SMTP credentials to client/browser)
 * - Anti-Header-Injection sanitization on all header fields
 * - Strict HTML entity escaping for user-submitted content
 * - Reply-To points to customer email when provided (without forging SMTP sender)
 * - Safe error reporting without leaking passwords, paths, or tokens
 */

export interface NotificationEmailPayload {
  submissionType: 'Enquiry' | 'Quote' | 'RFQ' | 'Callback' | 'Contact';
  customerName: string;
  companyName?: string;
  customerEmail?: string;
  customerPhone: string;
  productName?: string;
  productCode?: string;
  category?: string;
  quantity?: string | number;
  deliveryLocation?: string;
  message?: string;
  submissionReference: string;
  submittedAt?: string;
  // RFQ Bill of Quantities
  items?: Array<{
    name: string;
    quantity?: string | number;
    category?: string;
    id?: string;
    unit?: string;
  }>;
  requestMtc?: boolean;
  isUrgentCallback?: boolean;
  source?: string;
}

export interface EmailSendResult {
  success: boolean;
  messageId?: string;
  code?: 'EMAIL_SENT' | 'SMTP_NOT_CONFIGURED' | 'EMAIL_DELIVERY_FAILED' | 'INVALID_PAYLOAD';
  error?: string;
  isDuplicate?: boolean;
}

interface RecentSubmissionRecord {
  timestamp: number;
  messageId: string;
  reference: string;
}

// In-memory sliding window cache to prevent duplicate email dispatches (e.g. rapid double clicks)
const recentSubmissions = new Map<string, RecentSubmissionRecord>();

function cleanExpiredSubmissions(): void {
  const cutoff = Date.now() - 2 * 60 * 1000; // 2 minute window
  for (const [key, record] of recentSubmissions.entries()) {
    if (record.timestamp < cutoff) {
      recentSubmissions.delete(key);
    }
  }
}

function buildSubmissionFingerprint(payload: NotificationEmailPayload): string {
  const itemsStr = (payload.items || [])
    .map((item) => `${item.name}:${item.quantity || 1}`)
    .sort()
    .join('|');

  return [
    payload.submissionType,
    (payload.customerPhone || '').replace(/\D/g, ''),
    (payload.customerEmail || '').toLowerCase().trim(),
    (payload.productName || '').trim().toLowerCase(),
    (payload.message || '').trim().toLowerCase(),
    itemsStr,
  ].join(':::');
}

/**
 * Strip newline characters (\r, \n) from header values to prevent Email Header Injection (CWE-93)
 */
function sanitizeHeader(value: string | undefined): string {
  if (!value) return '';
  return value.replace(/[\r\n]/g, ' ').trim();
}

/**
 * Escape HTML special characters to prevent stored/reflected XSS in HTML email clients
 */
function escapeHtml(value: string | undefined | null): string {
  if (value === undefined || value === null) return '';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Build the standardized email subject line based on submission type
 */
function getEmailSubject(type: NotificationEmailPayload['submissionType']): string {
  switch (type) {
    case 'Enquiry':
      return '[Website Enquiry] Rajdeep Enterprises - New Enquiry';
    case 'Quote':
      return '[Website Quote] Rajdeep Enterprises - New Quote Request';
    case 'RFQ':
      return '[Website RFQ] Rajdeep Enterprises - New RFQ';
    case 'Callback':
      return '[Website Callback] Rajdeep Enterprises - New Callback Request';
    case 'Contact':
      return '[Website Contact] Rajdeep Enterprises - New Contact Form Submission';
    default:
      return '[Website Lead] Rajdeep Enterprises - New Customer Submission';
  }
}

/**
 * Check if server-side SMTP is properly configured
 */
export function isSmtpConfigured(): boolean {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const user = process.env.SMTP_USER || 'rajdeepenterprises0047@gmail.com';
  const pass = process.env.SMTP_PASS;
  return Boolean(host && user && pass && pass.trim().length > 0);
}

/**
 * Send an email notification to rajdeepenterprises0047@gmail.com
 */
export async function sendNotificationEmail(payload: NotificationEmailPayload): Promise<EmailSendResult> {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const user = process.env.SMTP_USER || 'rajdeepenterprises0047@gmail.com';
  const pass = process.env.SMTP_PASS;
  const to = process.env.ALERT_EMAIL_TO || 'rajdeepenterprises0047@gmail.com';

  if (!pass || pass.trim() === '') {
    console.warn('[EmailService] SMTP_PASS is not configured in server environment variables.');
    return {
      success: false,
      code: 'SMTP_NOT_CONFIGURED',
      error: 'SMTP notification service is not configured on the server. Please set SMTP_PASS in server environment.',
    };
  }

  // Deduplication check: Prevent duplicate email dispatches for identical submissions within 90 seconds
  cleanExpiredSubmissions();
  const fingerprint = buildSubmissionFingerprint(payload);
  const existingSubmission = recentSubmissions.get(fingerprint);
  if (existingSubmission && (Date.now() - existingSubmission.timestamp) < 90 * 1000) {
    console.info(
      `[EmailService] Duplicate submission detected for reference ${payload.submissionReference} (matching prior ${existingSubmission.reference}). Suppressing duplicate email dispatch.`
    );
    return {
      success: true,
      messageId: existingSubmission.messageId,
      code: 'EMAIL_SENT',
      isDuplicate: true,
    };
  }

  const submittedAt = payload.submittedAt || new Date().toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    dateStyle: 'medium',
    timeStyle: 'medium',
  });

  const subject = getEmailSubject(payload.submissionType);
  const customerEmail = payload.customerEmail ? sanitizeHeader(payload.customerEmail) : '';
  const customerName = sanitizeHeader(payload.customerName);
  const companyName = sanitizeHeader(payload.companyName || 'Not Provided');
  const customerPhone = sanitizeHeader(payload.customerPhone);
  const location = sanitizeHeader(payload.deliveryLocation || 'Not Provided');
  const productName = sanitizeHeader(payload.productName || 'N/A');
  const productCode = sanitizeHeader(payload.productCode || 'N/A');
  const quantity = payload.quantity ? String(payload.quantity) : 'N/A';
  const rawMessage = payload.message || 'No additional requirement message provided.';
  const reference = sanitizeHeader(payload.submissionReference);

  // Build Plain Text Content
  let textBody = `==================================================\n`;
  textBody += `RAJDEEP ENTERPRISES - NEW WEBSITE SUBMISSION\n`;
  textBody += `==================================================\n\n`;
  textBody += `Business: Rajdeep Enterprises\n`;
  textBody += `Submission Type: ${payload.submissionType}\n`;
  textBody += `Submission Reference: ${reference}\n`;
  textBody += `Submitted At: ${submittedAt}\n\n`;
  textBody += `--------------------------------------------------\n`;
  textBody += `CUSTOMER DETAILS\n`;
  textBody += `--------------------------------------------------\n`;
  textBody += `Customer Name: ${customerName}\n`;
  textBody += `Company: ${companyName}\n`;
  textBody += `Customer Phone: ${customerPhone}\n`;
  textBody += `Customer Email: ${customerEmail || 'Not Provided'}\n`;
  textBody += `Location: ${location}\n\n`;
  textBody += `--------------------------------------------------\n`;
  textBody += `REQUIREMENT / PRODUCT SPECIFICATIONS\n`;
  textBody += `--------------------------------------------------\n`;
  textBody += `Product: ${productName}\n`;
  textBody += `SKU/Product Code: ${productCode}\n`;
  textBody += `Quantity: ${quantity}\n`;
  if (payload.category) {
    textBody += `Category: ${payload.category}\n`;
  }
  if (payload.requestMtc !== undefined) {
    textBody += `Manufacturer Test Certificate (MTC) Requested: ${payload.requestMtc ? 'YES' : 'NO'}\n`;
  }
  if (payload.isUrgentCallback) {
    textBody += `URGENT CALLBACK REQUESTED: YES\n`;
  }
  textBody += `\nRequirement / Message:\n${rawMessage}\n\n`;

  // Include line items if RFQ Bill of Quantities
  if (Array.isArray(payload.items) && payload.items.length > 0) {
    textBody += `--------------------------------------------------\n`;
    textBody += `RFQ BILL OF QUANTITIES (${payload.items.length} Items)\n`;
    textBody += `--------------------------------------------------\n`;
    payload.items.forEach((item, idx) => {
      const itemCode = item.id ? ` [Code: ${item.id}]` : '';
      textBody += `${idx + 1}. ${item.name}${itemCode} — Qty: ${item.quantity || 1} ${item.unit || 'Units'}\n`;
    });
    textBody += `\n`;
  }

  textBody += `==================================================\n`;
  textBody += `Reply-To is configured directly to customer's email (${customerEmail || 'N/A'}).\n`;
  textBody += `Rajdeep Enterprises | 15/1, U.P. S.I.D.C. Complex, Refinery Main Gate, Mathura\n`;
  textBody += `Phone: +91 99979 93895 | Email: rajdeepenterprises0047@gmail.com\n`;

  // Build Safe HTML Content
  let itemsHtml = '';
  if (Array.isArray(payload.items) && payload.items.length > 0) {
    itemsHtml = `
      <div style="margin-top: 20px;">
        <h3 style="margin: 0 0 10px 0; font-size: 14px; font-weight: bold; color: #0f172a; text-transform: uppercase; letter-spacing: 0.5px;">
          RFQ Bill of Quantities (${payload.items.length} Items)
        </h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 13px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px;">
          <thead>
            <tr style="background-color: #0f172a; color: #ffffff;">
              <th style="padding: 8px 12px; text-align: left; width: 40px;">#</th>
              <th style="padding: 8px 12px; text-align: left;">Item Description</th>
              <th style="padding: 8px 12px; text-align: right; width: 120px;">Quantity</th>
            </tr>
          </thead>
          <tbody>
            ${payload.items
              .map(
                (item, idx) => `
              <tr style="border-bottom: 1px solid #e2e8f0;">
                <td style="padding: 8px 12px; color: #64748b;">${idx + 1}</td>
                <td style="padding: 8px 12px; font-weight: 600; color: #1e293b;">
                  ${escapeHtml(item.name)}
                  ${item.id ? `<span style="display: block; font-size: 11px; color: #64748b; font-weight: normal;">Code: ${escapeHtml(item.id)}</span>` : ''}
                </td>
                <td style="padding: 8px 12px; text-align: right; font-weight: bold; color: #ea580c;">
                  ${escapeHtml(String(item.quantity || 1))} ${escapeHtml(item.unit || 'Units')}
                </td>
              </tr>`
              )
              .join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  const htmlBody = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>${escapeHtml(subject)}</title>
</head>
<body style="margin: 0; padding: 24px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f1f5f9; color: #1e293b;">
  <div style="max-width: 640px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #cbd5e1; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
    
    <!-- Header Banner -->
    <div style="background-color: #0f172a; padding: 20px 24px; color: #ffffff; border-bottom: 4px solid #ea580c;">
      <div style="font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; color: #f97316; margin-bottom: 4px;">
        Rajdeep Enterprises • Website Notification
      </div>
      <h1 style="margin: 0; font-size: 20px; font-weight: 800; color: #ffffff;">
        New ${escapeHtml(payload.submissionType)} Received
      </h1>
      <div style="margin-top: 8px; font-size: 12px; color: #94a3b8;">
        Ref: <strong style="color: #ffffff;">${escapeHtml(reference)}</strong> &bull; ${escapeHtml(submittedAt)}
      </div>
    </div>

    <!-- Main Content -->
    <div style="padding: 24px;">
      
      <!-- Customer Information Card -->
      <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
        <h2 style="margin: 0 0 12px 0; font-size: 13px; font-weight: bold; color: #0f172a; text-transform: uppercase; letter-spacing: 0.5px;">
          Customer Contact Details
        </h2>
        <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
          <tr>
            <td style="padding: 4px 0; color: #64748b; width: 140px;">Customer Name:</td>
            <td style="padding: 4px 0; font-weight: bold; color: #0f172a;">${escapeHtml(customerName)}</td>
          </tr>
          <tr>
            <td style="padding: 4px 0; color: #64748b;">Company / Firm:</td>
            <td style="padding: 4px 0; color: #1e293b;">${escapeHtml(companyName)}</td>
          </tr>
          <tr>
            <td style="padding: 4px 0; color: #64748b;">Phone / WhatsApp:</td>
            <td style="padding: 4px 0; font-weight: bold; color: #0f172a;">
              <a href="tel:${escapeHtml(customerPhone)}" style="color: #ea580c; text-decoration: none;">${escapeHtml(customerPhone)}</a>
            </td>
          </tr>
          <tr>
            <td style="padding: 4px 0; color: #64748b;">Customer Email:</td>
            <td style="padding: 4px 0; color: #1e293b;">
              ${customerEmail ? `<a href="mailto:${escapeHtml(customerEmail)}" style="color: #2563eb; text-decoration: none;">${escapeHtml(customerEmail)}</a>` : '<em style="color: #94a3b8;">Not Provided</em>'}
            </td>
          </tr>
          <tr>
            <td style="padding: 4px 0; color: #64748b;">Delivery Site:</td>
            <td style="padding: 4px 0; color: #1e293b;">${escapeHtml(location)}</td>
          </tr>
        </table>
      </div>

      <!-- Requirement Details -->
      <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
        <h2 style="margin: 0 0 12px 0; font-size: 13px; font-weight: bold; color: #0f172a; text-transform: uppercase; letter-spacing: 0.5px;">
          Requirement &amp; Procurement Details
        </h2>
        <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
          <tr>
            <td style="padding: 4px 0; color: #64748b; width: 140px;">Product:</td>
            <td style="padding: 4px 0; font-weight: bold; color: #0f172a;">${escapeHtml(productName)}</td>
          </tr>
          <tr>
            <td style="padding: 4px 0; color: #64748b;">SKU / Code:</td>
            <td style="padding: 4px 0; color: #1e293b;">${escapeHtml(productCode)}</td>
          </tr>
          <tr>
            <td style="padding: 4px 0; color: #64748b;">Quantity:</td>
            <td style="padding: 4px 0; font-weight: bold; color: #ea580c;">${escapeHtml(quantity)}</td>
          </tr>
          ${payload.category ? `
          <tr>
            <td style="padding: 4px 0; color: #64748b;">Category:</td>
            <td style="padding: 4px 0; color: #1e293b;">${escapeHtml(payload.category)}</td>
          </tr>` : ''}
          ${payload.requestMtc !== undefined ? `
          <tr>
            <td style="padding: 4px 0; color: #64748b;">MTC Certificate:</td>
            <td style="padding: 4px 0; font-weight: bold; color: ${payload.requestMtc ? '#16a34a' : '#64748b'};">
              ${payload.requestMtc ? 'YES (Required for Gate Entry)' : 'Not requested'}
            </td>
          </tr>` : ''}
          ${payload.isUrgentCallback ? `
          <tr>
            <td style="padding: 4px 0; color: #dc2626; font-weight: bold;">Priority:</td>
            <td style="padding: 4px 0; font-weight: bold; color: #dc2626;">URGENT CALLBACK REQUESTED</td>
          </tr>` : ''}
        </table>

        <div style="margin-top: 14px; padding-top: 12px; border-top: 1px dashed #cbd5e1;">
          <div style="font-size: 12px; font-weight: bold; color: #64748b; margin-bottom: 6px;">
            Customer Note / Message:
          </div>
          <div style="font-size: 13px; color: #1e293b; line-height: 1.5; white-space: pre-wrap; background: #ffffff; padding: 10px; border-radius: 6px; border: 1px solid #e2e8f0;">${escapeHtml(rawMessage)}</div>
        </div>
      </div>

      ${itemsHtml}

      <!-- Quick Action Buttons -->
      <div style="margin-top: 24px; text-align: center;">
        ${customerEmail ? `
        <a href="mailto:${escapeHtml(customerEmail)}?subject=Re:%20${encodeURIComponent(subject)}%20[${encodeURIComponent(reference)}]"
           style="display: inline-block; background-color: #0f172a; color: #ffffff; padding: 10px 20px; font-size: 13px; font-weight: bold; text-decoration: none; border-radius: 8px; margin-right: 8px;">
          Reply to Customer (${escapeHtml(customerEmail)})
        </a>
        ` : ''}
        <a href="https://wa.me/${escapeHtml(customerPhone.replace(/\\D/g, ''))}"
           style="display: inline-block; background-color: #16a34a; color: #ffffff; padding: 10px 20px; font-size: 13px; font-weight: bold; text-decoration: none; border-radius: 8px;">
          WhatsApp Customer (${escapeHtml(customerPhone)})
        </a>
      </div>

    </div>

    <!-- Footer -->
    <div style="background-color: #f8fafc; padding: 16px 24px; font-size: 11px; color: #64748b; border-top: 1px solid #e2e8f0; text-align: center;">
      <div><strong>Rajdeep Enterprises</strong> &bull; Industrial Safety PPE &amp; Material Supplies</div>
      <div style="margin-top: 4px;">15/1, U.P. S.I.D.C. Complex, Refinery Main Gate, Mathura, UP - 281005</div>
      <div style="margin-top: 4px;">Official Business Email: <a href="mailto:rajdeepenterprises0047@gmail.com" style="color: #64748b;">rajdeepenterprises0047@gmail.com</a> | Phone: +91 99979 93895</div>
    </div>

  </div>
</body>
</html>
  `;

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465, // true for 465, false for other ports like 587
      auth: {
        user,
        pass,
      },
      tls: {
        rejectUnauthorized: true,
        minVersion: 'TLSv1.2',
      },
    });

    const mailOptions: SendMailOptions = {
      from: `"Rajdeep Enterprises Website" <${user}>`,
      to,
      subject,
      text: textBody,
      html: htmlBody,
    };

    // Set Reply-To to customer's email if validly provided
    if (customerEmail && customerEmail.includes('@')) {
      mailOptions.replyTo = customerName ? `"${customerName}" <${customerEmail}>` : customerEmail;
    }

    const info = await transporter.sendMail(mailOptions);
    console.info(`[EmailService] Notification successfully sent for ${reference}. MessageId: ${info.messageId}`);

    // Register fingerprint in deduplication cache
    recentSubmissions.set(fingerprint, {
      timestamp: Date.now(),
      messageId: info.messageId,
      reference,
    });

    return {
      success: true,
      messageId: info.messageId,
      code: 'EMAIL_SENT',
    };
  } catch (err: any) {
    // Crucial security requirement: Never leak credentials or internal details
    const sanitizedErrorMsg = err?.message ? String(err.message).replace(pass, '***') : 'Unknown SMTP error';
    console.error(`[EmailService] SMTP delivery failure for ${reference}:`, sanitizedErrorMsg);

    return {
      success: false,
      code: 'EMAIL_DELIVERY_FAILED',
      error: 'Failed to deliver notification email through SMTP server.',
    };
  }
}
