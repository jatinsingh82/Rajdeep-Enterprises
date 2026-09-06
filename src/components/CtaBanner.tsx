import React from 'react';
import { Phone, Mail, FileText, ArrowRight, ShieldCheck } from 'lucide-react';
import { COMPANY_INFO } from '../data/companyData';

interface CtaBannerProps {
  onOpenQuoteModal: () => void;
}

export const CtaBanner: React.FC<CtaBannerProps> = ({ onOpenQuoteModal }) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-orange-600 via-orange-500 to-red-600 text-white py-14 sm:py-16">
      {/* Decorative safety texture */}
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="absolute top-0 left-0 right-0 h-1.5 hazard-stripe-yellow opacity-40"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/20 text-white text-xs font-bold backdrop-blur-xs">
          <ShieldCheck className="w-4 h-4" />
          <span>🇮🇳 Supplying in Whole India Everywhere • Any Quantity Required</span>
        </div>

        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight max-w-3xl mx-auto leading-tight">
          Supplying Everywhere Across India — Any Quantity & Custom Extra Items
        </h2>

        <p className="text-white/95 text-sm sm:text-base md:text-lg max-w-2xl mx-auto font-medium">
          Whether you need 5 items or 50,000 items, we dispatch to any state and project site in India. <span className="underline decoration-amber-300 font-bold">Want anything extra or specialized not listed in our catalogue?</span> Contact Rajdeep Enterprises directly and we will source it for you immediately!
        </p>

        {/* 3 Prominent Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <a
            id="cta-call-now-btn"
            href={`tel:${COMPANY_INFO.phone}`}
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-black text-sm text-slate-900 bg-white hover:bg-slate-100 shadow-lg hover:shadow-xl transition-all transform active:scale-95"
          >
            <Phone className="w-4 h-4 text-orange-600" />
            <span>Call Now ({COMPANY_INFO.displayPhone})</span>
          </a>

          <a
            id="cta-send-email-btn"
            href={`mailto:${COMPANY_INFO.email}?subject=Industrial%20Safety%20Enquiry%20-%20Rajdeep%20Enterprises`}
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm text-white bg-slate-900 hover:bg-slate-800 shadow-lg transition-all active:scale-95"
          >
            <Mail className="w-4 h-4 text-amber-400" />
            <span>Send Email</span>
          </a>

          <button
            id="cta-get-quote-btn"
            onClick={onOpenQuoteModal}
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-black text-sm text-white bg-red-800/80 hover:bg-red-800 border-2 border-white/40 shadow-lg transition-all active:scale-95"
          >
            <FileText className="w-4 h-4" />
            <span>Get a Quote</span>
          </button>
        </div>

        <div className="pt-2 text-xs text-white/80 font-medium">
          Direct Point of Contact: <strong className="text-white">{COMPANY_INFO.contactPerson}</strong> • UP SIDC Complex, Refinery Main Gate, Mathura
        </div>
      </div>
    </section>
  );
};
