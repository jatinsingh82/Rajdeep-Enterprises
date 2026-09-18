import React from 'react';
import { AlertCircle, Phone, Clock, Zap, ShieldCheck } from 'lucide-react';
import { COMPANY_INFO } from '../data/companyData';
import { trackPhoneClick, trackCallbackRequest } from '../utils/analytics';

interface EmergencyHotlineBannerProps {
  onOpenQuoteModal: (productName?: string) => void;
}

export const EmergencyHotlineBanner: React.FC<EmergencyHotlineBannerProps> = ({
  onOpenQuoteModal
}) => {
  return (
    <div className="bg-[#0B1523] border-b border-slate-800/80 text-white py-2 sm:py-2.5 px-3 sm:px-4 relative">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2 text-xs">
        
        {/* Mobile View: Compact professional emergency capability notice */}
        <div className="flex md:hidden items-center justify-between w-full gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0"></span>
            <div className="min-w-0">
              <span className="font-bold text-slate-200 uppercase tracking-wider text-[10px] block leading-tight truncate">
                24/7 Refinery & Plant Emergency
              </span>
              <span className="text-slate-400 text-[11px] block leading-tight truncate">
                30–60 Min Rapid Gate Dispatch
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <a
              id="emergency-mobile-call-btn"
              href={`tel:${COMPANY_INFO.phone}`}
              onClick={() => trackPhoneClick({ phoneNumber: COMPANY_INFO.phone, source: 'emergency_banner_mobile' })}
              className="inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs shadow-sm transition active:scale-95 min-h-[38px] text-center"
              title="Call Emergency Hotline"
              aria-label={`Call emergency hotline ${COMPANY_INFO.phone}`}
            >
              <Phone className="w-3.5 h-3.5 shrink-0" />
              <span>Call Now</span>
            </a>
          </div>
        </div>

        {/* Desktop View: Clean professional industrial capability bar */}
        <div className="hidden md:flex items-center gap-3 text-left">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/30 text-amber-400 shrink-0">
            <Clock className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-extrabold text-amber-300 uppercase tracking-wider text-[11px] bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/40">
                24/7 Site Emergency Supply
              </span>
              <span className="text-slate-300 font-semibold text-xs">
                Refinery Turnarounds & Urgent Safety Replacements
              </span>
            </div>
            <p className="text-slate-400 text-[11px] mt-0.5">
              Facing gate safety inspection shortfall or plant maintenance emergency? <strong className="text-slate-200">30–60 min rapid dispatch</strong> to Mathura Refinery gates and adjacent project sites.
            </p>
          </div>
        </div>

        {/* Desktop Right side: Direct actions */}
        <div className="hidden md:flex items-center gap-2 shrink-0">
          <a
            href={`tel:${COMPANY_INFO.phone}`}
            onClick={() => trackPhoneClick({ phoneNumber: COMPANY_INFO.phone, source: 'emergency_banner_desktop' })}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs transition shadow-sm active:scale-95 min-h-[36px]"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Emergency Call: {COMPANY_INFO.displayPhone}</span>
          </a>

          <button
            type="button"
            onClick={() => {
              trackCallbackRequest({
                source: 'emergency_hotline_banner',
                phoneNumber: COMPANY_INFO.phone,
                urgency: 'urgent_gate_dispatch'
              });
              onOpenQuoteModal("Urgent Emergency Breakdown PPE Supply - Callback Requested");
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-semibold transition active:scale-95 min-h-[36px]"
          >
            <Zap className="w-3.5 h-3.5 text-sky-400" />
            <span>Request Fast Dispatch / Callback</span>
          </button>
        </div>

      </div>
    </div>
  );
};
