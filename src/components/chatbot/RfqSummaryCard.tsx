import React from 'react';
import { StructuredRfq } from '../../types/chat';
import { CheckCircle2, Edit3, XCircle, FileText, Building2, User, Phone, MapPin, Package } from 'lucide-react';

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
  const isConfirmed = rfq.status === 'confirmed';
  const isCancelled = rfq.status === 'cancelled';
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
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
              <CheckCircle2 className="w-3 h-3" />
              Prepared
            </span>
          ) : isCancelled ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-700/50 text-slate-400 border border-slate-600">
              <XCircle className="w-3 h-3" />
              Cancelled
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

      {/* Action Buttons */}
      {isActionable && (
        <div className="bg-slate-950/80 p-2.5 border-t border-slate-800 flex flex-wrap items-center gap-1.5">
          {onConfirm && (
            <button
              type="button"
              disabled={disabled}
              onClick={onConfirm}
              className="flex-1 min-w-[120px] inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-orange-600 hover:bg-orange-500 active:bg-orange-700 text-white rounded-lg text-xs font-semibold shadow-sm transition disabled:opacity-50 cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Confirm RFQ
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
              Edit Details
            </button>
          )}

          {onCancel && (
            <button
              type="button"
              disabled={disabled}
              onClick={onCancel}
              className="inline-flex items-center justify-center gap-1 px-2.5 py-2 hover:bg-rose-950/40 text-slate-400 hover:text-rose-300 rounded-lg text-xs transition disabled:opacity-50 cursor-pointer"
              title="Cancel quotation enquiry"
            >
              <XCircle className="w-3.5 h-3.5" />
              Cancel
            </button>
          )}
        </div>
      )}

      {isConfirmed && (
        <div className="bg-emerald-950/30 px-3 py-2 border-t border-emerald-800/40 text-[11px] text-emerald-300 flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>Requirement prepared. The Rajdeep team can review this enquiry.</span>
        </div>
      )}
    </div>
  );
};
