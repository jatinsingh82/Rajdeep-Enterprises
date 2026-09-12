import React from 'react';
import { AlertCircle, Phone, Clock, Zap, ShieldCheck } from 'lucide-react';
import { COMPANY_INFO } from '../data/companyData';

interface EmergencyHotlineBannerProps {
  onOpenQuoteModal: (productName?: string) => void;
}

export const EmergencyHotlineBanner: React.FC<EmergencyHotlineBannerProps> = ({
  onOpenQuoteModal
}) => {
  return (
    <div className="bg-gradient-to-r from-red-950 via-slate-900 to-blue-950 border-y border-red-800/40 text-white py-3 px-4 shadow-inner relative overflow-hidden">
      {/* Visual pulse indicator */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs sm:text-sm">
        
        {/* Left side: Alert indicator and headline */}
        <div className="flex items-center gap-3 text-left">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-600/30 border border-red-500/60 text-red-400 shrink-0">
            <Zap className="w-4 h-4 fill-red-400 text-red-400 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-black text-red-400 uppercase tracking-wider text-[11px] bg-red-950/80 px-2 py-0.5 rounded border border-red-700/50">
                24/7 Site Emergency Hotline
              </span>
              <span className="text-slate-300 font-semibold text-xs">
                Turnaround & Emergency Shutdown Supplies
              </span>
            </div>
            <p className="text-slate-300 text-xs mt-0.5">
              Facing immediate gate safety inspection shortfall or plant breakdown? <strong className="text-sky-300">30–60 Min Rapid Dispatch</strong> to Mathura Refinery gates & adjacent industrial yards.
            </p>
          </div>
        </div>

        {/* Right side: Direct actions */}
        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <a
            href={`tel:${COMPANY_INFO.phone}`}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-black text-xs transition shadow-md active:scale-95"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Emergency Call: {COMPANY_INFO.phone}</span>
          </a>

          <button
            onClick={() => onOpenQuoteModal("Urgent Emergency Breakdown PPE Supply")}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 text-xs font-bold transition active:scale-95"
          >
            <Clock className="w-3.5 h-3.5 text-sky-400" />
            <span>Request Immediate Dispatch</span>
          </button>
        </div>

      </div>
    </div>
  );
};
