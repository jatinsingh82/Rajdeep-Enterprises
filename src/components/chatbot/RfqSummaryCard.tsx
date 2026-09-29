import React from 'react';
import { StructuredRfq } from '../../types/chat';
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
  Send,
  Loader2,
  MessageCircle,
  PhoneCall,
  AlertTriangle,
  Tag,
} from 'lucide-react';

interface RfqSummaryCardProps {
  rfq: StructuredRfq;
  onConfirm?: () => void;
  onEdit?: () => void;
  onCancel?: () => void;
  disabled?: boolean;
}

export const RfqSummaryCard: React.FC<RfqSummaryCardProps> = ({
  rfq,
  onConfirm,
  onEdit,
  onCancel,
  disabled = false,
}) => {
  const isSubmitted = rfq.status === 'submitted' || rfq.status === 'confirmed';
  const isCancelled = rfq.status === 'cancelled';
  const isFailed = rfq.status === 'failed';
  const isActionable = !isSubmitted && !isCancelled;

  // Single or primary item display values
  const itemValue = rfq.product || rfq.material || 'Industrial Requirement';
  const quantityValue = rfq.quantity ? `${rfq.quantity}${rfq.unit && !rfq.quantity.includes(rfq.unit) ? ` ${rfq.unit}` : ''}` : 'As required';
  const specValue = rfq.size || rfq.specifications || (rfq.grade ? `Grade: ${rfq.grade}` : 'Not provided');

  const fields = [
    ...(rfq.items && rfq.items.length > 0
      ? []
      : [
          { label: 'Item', value: itemValue, icon: Package },
          { label: 'Quantity', value: quantityValue, icon: Package },
          { label: 'Specification', value: specValue, icon: FileText },
          ...(rfq.brand ? [{ label: 'Brand', value: rfq.brand, icon: Tag }] : []),
        ]),
    ...(rfq.deliveryLocation ? [{ label: 'Delivery Location', value: rfq.deliveryLocation, icon: MapPin }] : []),
    { label: 'Customer', value: rfq.customerName || 'Pending', icon: User },
    ...(rfq.companyName ? [{ label: 'Company', value: rfq.companyName, icon: Building2 }] : []),
    { label: 'Phone', value: rfq.phone || 'Pending', icon: Phone },
    ...(rfq.additionalNotes && rfq.additionalNotes !== 'None' ? [{ label: 'Additional Notes', value: rfq.additionalNotes, icon: FileText }] : []),
  ].filter((item) => Boolean(item.value && item.value.trim()));

  const whatsappMessage = encodeURIComponent(
    `Hello Rajdeep Enterprises, I submitted a requirement for ${itemValue} (Qty: ${quantityValue})${
      rfq.rfqReference ? ` with Reference: ${rfq.rfqReference}` : ''
    }. Please provide a quotation.`
  );

  return (
    <div className="mt-3 w-full bg-slate-900 border border-slate-700/80 rounded-xl overflow-hidden shadow-lg select-text text-left">
      {/* Card Header */}
      <div className="bg-slate-950 px-3.5 py-2.5 border-b border-slate-800 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-orange-400 shrink-0" />
          <span className="text-xs font-bold text-white tracking-wide uppercase">
            Requirement Summary
          </span>
        </div>
        <div>
          {isSubmitted ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
              <CheckCircle2 className="w-3 h-3" />
              Sent to Team
            </span>
          ) : isCancelled ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-700/50 text-slate-400 border border-slate-600">
              <XCircle className="w-3 h-3" />
              Cancelled
            </span>
          ) : isFailed ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/40">
              <AlertTriangle className="w-3 h-3" />
              Submission Error
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40">
              Ready to Send
            </span>
          )}
        </div>
      </div>

      {/* Multi-item List if provided */}
      {rfq.items && rfq.items.length > 0 && (
        <div className="p-3 bg-slate-950/70 border-b border-slate-800 space-y-2">
          <div className="text-[11px] font-bold text-orange-400 uppercase tracking-wide">
            Requirement Items ({rfq.items.length}):
          </div>
          <div className="space-y-1.5">
            {rfq.items.map((it, idx) => (
              <div
                key={idx}
                className="bg-slate-900/90 p-2 rounded-lg border border-slate-800 flex justify-between items-start gap-2 text-xs"
              >
                <div>
                  <span className="font-semibold text-white">
                    ITEM {idx + 1}: {it.item}
                  </span>
                  {it.specification && (
                    <span className="block text-[11px] text-slate-400">
                      Spec: {it.specification}
                    </span>
                  )}
                  {it.brand && (
                    <span className="block text-[11px] text-slate-400">
                      Brand: {it.brand}
                    </span>
                  )}
                </div>
                <span className="font-bold text-orange-400 shrink-0">
                  Qty: {it.quantity}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Fields List */}
      <div className="p-3 space-y-1.5 text-xs bg-slate-900/90 divide-y divide-slate-800/60">
        {fields.map((f, i) => (
          <div key={i} className="flex justify-between items-start gap-2 pt-1.5 first:pt-0">
            <span className="text-slate-400 shrink-0 flex items-center gap-1 font-medium">
              {f.label}:
            </span>
            <span className="text-slate-100 font-medium text-right break-words max-w-[65%]">
              {f.value}
            </span>
          </div>
        ))}
      </div>

      {/* Action Buttons for Draft / Review Mode */}
      {isActionable && (
        <div className="bg-slate-950/80 p-2.5 border-t border-slate-800 flex flex-wrap items-center gap-1.5">
          {onConfirm && (
            <button
              type="button"
              disabled={disabled || rfq.status === 'submitted'}
              onClick={onConfirm}
              className="flex-1 min-w-[130px] inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-orange-600 hover:bg-orange-500 active:bg-orange-700 text-white rounded-lg text-xs font-semibold shadow-sm transition disabled:opacity-50 cursor-pointer"
            >
              {disabled ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Sending...</span>
                </>
              ) : rfq.status === 'submitted' ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Sent successfully</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Requirement</span>
                </>
              )}
            </button>
          )}

          {onEdit && (
            <button
              type="button"
              disabled={disabled}
              onClick={onEdit}
              className="inline-flex items-center justify-center gap-1 px-3 py-2 bg-slate-800 hover:bg-slate-700 active:bg-slate-800 text-slate-200 rounded-lg text-xs font-medium border border-slate-700 transition disabled:opacity-50 cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5 text-orange-400" />
              <span>Edit</span>
            </button>
          )}

          {onCancel && (
            <button
              type="button"
              disabled={disabled}
              onClick={onCancel}
              className="inline-flex items-center justify-center gap-1 px-2.5 py-2 hover:bg-rose-950/40 text-slate-400 hover:text-rose-300 rounded-lg text-xs transition disabled:opacity-50 cursor-pointer"
              title="Cancel requirement"
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>Cancel</span>
            </button>
          )}
        </div>
      )}

      {/* Confirmed / Submitted State Container */}
      {isSubmitted && (
        <div className="bg-emerald-950/40 p-3 border-t border-emerald-800/40 space-y-2">
          <div className="flex items-start gap-2 text-emerald-200 text-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-emerald-300">
                Your requirement has been successfully sent to the Rajdeep Enterprises team.
              </p>
              {rfq.rfqReference && (
                <p className="text-[11px] font-mono text-emerald-300/90 mt-0.5">
                  Reference: <span className="font-bold underline">{rfq.rfqReference}</span>
                </p>
              )}
              <p className="text-[11px] text-emerald-400/90 leading-tight mt-1">
                Our team will review the details and get back to you regarding the quotation.
              </p>
            </div>
          </div>

          {/* Direct contact action links */}
          <div className="flex items-center gap-2 pt-1 border-t border-emerald-900/50">
            <a
              href={`https://wa.me/919997993895?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-1 px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[11px] font-semibold transition"
            >
              <MessageCircle className="w-3 h-3" />
              <span>WhatsApp Rajdeep</span>
            </a>
            <a
              href="tel:+919997993895"
              className="flex-1 inline-flex items-center justify-center gap-1 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[11px] font-medium border border-slate-700 transition"
            >
              <PhoneCall className="w-3 h-3 text-orange-400" />
              <span>Call +91 99979 93895</span>
            </a>
          </div>
        </div>
      )}

      {/* Failed State Container */}
      {isFailed && (
        <div className="bg-rose-950/50 p-3 border-t border-rose-800/40 space-y-2">
          <div className="flex items-start gap-2 text-rose-200 text-xs">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-rose-300">
                I couldn't send the requirement right now.
              </p>
              <p className="text-[11px] text-rose-300/80 leading-tight mt-0.5">
                {rfq.submissionError || 'Please try again or contact Rajdeep Enterprises directly using the WhatsApp or Call option.'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {onConfirm && (
              <button
                type="button"
                onClick={onConfirm}
                className="flex-1 py-1 px-2.5 bg-rose-700 hover:bg-rose-600 text-white rounded text-[11px] font-semibold transition cursor-pointer"
              >
                Retry Send
              </button>
            )}
            <a
              href="https://wa.me/919997993895"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center py-1 px-2.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded text-[11px] font-medium transition"
            >
              WhatsApp
            </a>
            <a
              href="tel:+919997993895"
              className="flex-1 text-center py-1 px-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[11px] font-medium transition"
            >
              Call
            </a>
          </div>
        </div>
      )}

      {/* Cancelled State Container */}
      {isCancelled && (
        <div className="bg-slate-950/60 p-2.5 border-t border-slate-800 text-center">
          <p className="text-[11px] text-slate-400">
            Okay, I haven't sent the requirement.
          </p>
        </div>
      )}
    </div>
  );
};
