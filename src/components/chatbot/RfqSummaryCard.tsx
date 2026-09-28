import React from 'react';
import { StructuredRfq } from '../../types/chat';
import { COMPANY_INFO } from '../../data/companyData';
import {
  CheckCircle2,
  Edit3,
  XCircle,
  FileText,
  Building2,
  User,
  Phone,
  MapPin,
  Package,
  MessageCircle,
  PhoneCall,
  RotateCw,
  Loader2,
  AlertTriangle
} from 'lucide-react';

interface RfqSummaryCardProps {
  rfq: StructuredRfq;
  onConfirm?: () => void;
  onEdit?: () => void;
  onCancel?: () => void;
  onRetry?: () => void;
  isSubmitting?: boolean;
  disabled?: boolean;
}

export const RfqSummaryCard: React.FC<RfqSummaryCardProps> = ({
  rfq,
  onConfirm,
  onEdit,
  onCancel,
  onRetry,
  isSubmitting = false,
  disabled = false,
}) => {
  const isConfirmed = rfq.status === 'confirmed';
  const isCancelled = rfq.status === 'cancelled';
  const hasError = Boolean(rfq.submissionError);
  const isActionable = !isConfirmed && !isCancelled;

  // Prepare display items that have non-empty values
  const fields = [
    { label: 'Product', value: rfq.product, icon: Package },
    { label: 'Material', value: rfq.material, icon: FileText },
    { label: 'Grade', value: rfq.grade, icon: FileText },
    { label: 'Quantity', value: rfq.quantity ? `${rfq.quantity}${rfq.unit ? ` ${rfq.unit}` : ''}` : undefined, icon: Package },
    { label: 'Thickness', value: rfq.thickness, icon: FileText },
    { label: 'Dimensions', value: rfq.dimensions, icon: FileText },
    { label: 'Specifications', value: rfq.specifications, icon: FileText },
    { label: 'Application', value: rfq.application, icon: FileText },
    { label: 'Delivery Location', value: rfq.deliveryLocation, icon: MapPin },
    { label: 'Contact Person', value: rfq.customerName, icon: User },
    { label: 'Company', value: rfq.companyName, icon: Building2 },
    { label: 'Phone / WhatsApp', value: rfq.phone, icon: Phone },
    { label: 'Email', value: rfq.email, icon: FileText },
    { label: 'Required By', value: rfq.requiredBy, icon: FileText },
    { label: 'Notes', value: rfq.additionalNotes, icon: FileText },
  ].filter((item) => Boolean(item.value && item.value.trim()));

  // Pre-filled WhatsApp message strictly following Section 11 specifications
  const buildWhatsAppUrl = () => {
    const lines = [
      'Hello Rajdeep Enterprises, I have submitted an RFQ through the website.',
      '',
      'Requirement:',
      rfq.product || rfq.material || 'Industrial Supplies',
      'Quantity:',
      rfq.quantity || 'As specified in requirement',
    ];

    if (rfq.rfqReference) {
      lines.push('', 'RFQ Reference:', rfq.rfqReference);
    }

    lines.push('', 'Please assist with my enquiry.');

    const encoded = encodeURIComponent(lines.join('\n'));
    return `https://wa.me/${COMPANY_INFO.whatsappNumber}?text=${encoded}`;
  };

  const callTelUrl = `tel:+919997993895`;

  return (
    <div className="mt-3 w-full bg-slate-900 border border-slate-700/80 rounded-xl overflow-hidden shadow-lg select-text text-left">
      {/* Card Header */}
      <div className="bg-slate-950 px-3.5 py-2.5 border-b border-slate-800 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-orange-400 shrink-0" />
          <span className="text-xs font-bold text-white tracking-wide">
            Quotation Enquiry Details
          </span>
        </div>
        <div>
          {isConfirmed ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
              <CheckCircle2 className="w-3 h-3" />
              Submitted
            </span>
          ) : isCancelled ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-700/50 text-slate-400 border border-slate-600">
              <XCircle className="w-3 h-3" />
              Cancelled
            </span>
          ) : hasError ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/40">
              <AlertTriangle className="w-3 h-3" />
              Submission Failed
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40">
              Ready for Review
            </span>
          )}
        </div>
      </div>

      {/* Fields List */}
      <div className="p-3 space-y-1.5 text-xs bg-slate-900/90 divide-y divide-slate-800/60">
        {fields.length > 0 ? (
          fields.map((f, i) => (
            <div key={i} className="flex justify-between items-start gap-2 pt-1.5 first:pt-0">
              <span className="text-slate-400 shrink-0 flex items-center gap-1">
                {f.label}:
              </span>
              <span className="text-slate-100 font-medium text-right break-words max-w-[65%]">
                {f.value}
              </span>
            </div>
          ))
        ) : (
          <p className="text-slate-400 italic text-[11px]">No specific details recorded yet.</p>
        )}
      </div>

      {/* Action Buttons for Draft / Review Mode */}
      {isActionable && !hasError && (
        <div className="bg-slate-950/80 p-2.5 border-t border-slate-800 flex flex-wrap items-center gap-1.5">
          {onConfirm && (
            <button
              type="button"
              disabled={disabled || isSubmitting}
              onClick={onConfirm}
              className="flex-1 min-w-[130px] inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-orange-600 hover:bg-orange-500 active:bg-orange-700 text-white rounded-lg text-xs font-semibold shadow-sm transition disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Confirm RFQ</span>
                </>
              )}
            </button>
          )}

          {onEdit && (
            <button
              type="button"
              disabled={disabled || isSubmitting}
              onClick={onEdit}
              className="inline-flex items-center justify-center gap-1 px-3 py-2 bg-slate-800 hover:bg-slate-700 active:bg-slate-800 text-slate-200 rounded-lg text-xs font-medium border border-slate-700 transition disabled:opacity-50 cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5 text-orange-400" />
              <span>Edit Details</span>
            </button>
          )}

          {onCancel && (
            <button
              type="button"
              disabled={disabled || isSubmitting}
              onClick={onCancel}
              className="inline-flex items-center justify-center gap-1 px-2.5 py-2 hover:bg-rose-950/40 text-slate-400 hover:text-rose-300 rounded-lg text-xs transition disabled:opacity-50 cursor-pointer"
              title="Cancel quotation enquiry"
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>Cancel</span>
            </button>
          )}
        </div>
      )}

      {/* Failure State Container (Section 8) */}
      {hasError && (
        <div className="bg-rose-950/40 p-3 border-t border-rose-800/40 space-y-2.5">
          <div className="flex items-start gap-2 text-rose-200 text-xs">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <p className="leading-snug">
              We couldn't submit your enquiry right now. Please try again or contact Rajdeep Enterprises directly.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={onRetry || onConfirm}
              className="flex-1 min-w-[100px] inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg text-xs font-semibold shadow-sm transition disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Retrying...</span>
                </>
              ) : (
                <>
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>Try Again</span>
                </>
              )}
            </button>

            <a
              href={buildWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow-sm transition cursor-pointer"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>

            <a
              href={callTelUrl}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-100 rounded-lg text-xs font-semibold border border-slate-700 transition cursor-pointer"
            >
              <PhoneCall className="w-3.5 h-3.5 text-orange-400" />
              <span>Call</span>
            </a>
          </div>
        </div>
      )}

      {/* Confirmed / Submitted State Container (Section 7, 10, 11, 12) */}
      {isConfirmed && (
        <div className="bg-emerald-950/40 p-3.5 border-t border-emerald-800/40 space-y-2.5">
          <div className="flex items-start gap-2 text-emerald-200 text-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold text-emerald-300">
                Your enquiry has been submitted successfully.
              </p>
              {rfq.rfqReference && (
                <p className="text-[11px] text-emerald-200">
                  Reference:{' '}
                  <span className="font-mono font-bold text-white bg-emerald-900/60 px-1.5 py-0.5 rounded border border-emerald-700/50">
                    {rfq.rfqReference}
                  </span>
                </p>
              )}
              <p className="text-[11px] text-emerald-400/90 leading-tight">
                The Rajdeep Enterprises team will review your requirement and contact you using the details provided.
              </p>
            </div>
          </div>

          {/* WhatsApp & Call Direct Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
            <a
              href={buildWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2.5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-md transition cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Rajdeep Enterprises</span>
            </a>

            <a
              href={callTelUrl}
              className="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 bg-slate-950 hover:bg-slate-800 active:bg-slate-900 text-slate-100 rounded-lg text-xs font-semibold border border-slate-700 shadow-sm transition cursor-pointer"
            >
              <PhoneCall className="w-4 h-4 text-orange-400" />
              <span>Call Rajdeep Enterprises</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
