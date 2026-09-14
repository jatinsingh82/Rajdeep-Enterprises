import React from 'react';
import { Phone, Mail, FileText, ArrowRight, ShieldCheck } from 'lucide-react';
import { COMPANY_INFO } from '../data/companyData';

interface CtaBannerProps {
  onOpenQuoteModal: () => void;
}

export const CtaBanner: React.FC<CtaBannerProps> = ({ onOpenQuoteModal }) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-[#071324] via-[#0B192C] to-[#1E3E62] text-white py-14 sm:py-16 border-t border-sky-500/20">
      {/* Decorative subtle texture */}
      <div className="absolute inset-0 industrial-grid-dark opacity-20 pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/20 border border-sky-400/40 text-sky-300 text-xs font-bold backdrop-blur-xs">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>🇮🇳 Supplying in Whole India Everywhere • Any Quantity Required</span>
        </div>

        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight max-w-3xl mx-auto leading-tight text-white">
          Supplying Everywhere Across India — Any Quantity & Custom Extra Items
        </h2>

        <p className="text-slate-200 text-sm sm:text-base md:text-lg max-w-2xl mx-auto font-medium">
          Whether you need 5 items or 50,000 items, we dispatch to any state and project site in India. <span className="underline decoration-sky-400 font-bold text-sky-300">Want anything extra or specialized not listed in our catalogue?</span> Contact Rajdeep Enterprises directly and we will source it for you immediately!
        </p>

        {/* 3 Prominent Action Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 pt-2 max-w-md sm:max-w-none mx-auto">
          <a
            id="cta-call-now-btn"
            href={`tel:${COMPANY_INFO.phone}`}
            className="min-h-[44px] inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-black text-sm text-slate-950 bg-sky-400 hover:bg-sky-300 shadow-lg hover:shadow-xl transition-all transform active:scale-95"
          >
            <Phone className="w-4 h-4 text-slate-950" />
            <span>Call Now ({COMPANY_INFO.displayPhone})</span>
          </a>

          <a
            id="cta-send-email-btn"
            href={`mailto:${COMPANY_INFO.email}?subject=Industrial%20Safety%20Enquiry%20-%20Rajdeep%20Enterprises`}
            className="min-h-[44px] inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm text-white bg-slate-900 hover:bg-slate-800 border border-slate-700 shadow-lg transition-all active:scale-95"
          >
            <Mail className="w-4 h-4 text-sky-400" />
            <span>Send Email</span>
          </a>

          <button
            id="cta-get-quote-btn"
            onClick={onOpenQuoteModal}
            className="min-h-[44px] inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-black text-sm text-white bg-blue-600 hover:bg-blue-500 border border-blue-400/50 shadow-lg transition-all active:scale-95"
          >
            <FileText className="w-4 h-4" />
            <span>Get a Quote</span>
          </button>
        </div>

        <div className="pt-2 text-xs text-slate-300 font-medium">
          Direct Point of Contact: <strong className="text-white">{COMPANY_INFO.contactPerson}</strong> • UP SIDC Complex, Refinery Main Gate, Mathura
        </div>
      </div>
    </section>
  );
};
