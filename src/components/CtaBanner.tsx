import React from 'react';
import { Phone, Mail, FileText, ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import { COMPANY_INFO } from '../data/companyData';

interface CtaBannerProps {
  onOpenQuoteModal: () => void;
}

export const CtaBanner: React.FC<CtaBannerProps> = ({ onOpenQuoteModal }) => {
  return (
    <section className="relative overflow-hidden bg-[#0B192C] text-white py-12 sm:py-16 border-t border-slate-800">
      {/* Decorative subtle texture */}
      <div className="absolute inset-0 industrial-grid-dark opacity-15 pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-900 border border-slate-700 text-sky-300 text-xs font-bold">
          <Truck className="w-4 h-4 text-emerald-400" />
          <span>Supplying Pan-India Everywhere • Any Order Quantity</span>
        </div>

        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight max-w-3xl mx-auto leading-tight text-white">
          Supplying Everywhere Across India — Any Quantity & Custom Extra Items
        </h2>

        <p className="text-slate-300 text-sm sm:text-base md:text-lg max-w-2xl mx-auto font-medium">
          Whether you need 5 items or 50,000 items, we dispatch to any state and project site in India. <span className="font-bold text-sky-300">Want anything extra or specialized not listed in our catalogue?</span> Contact Rajdeep Enterprises directly and we will source it for you immediately!
        </p>

        {/* 3 Prominent Action Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 pt-2 max-w-md sm:max-w-none mx-auto">
          <a
            id="cta-call-now-btn"
            href={`tel:${COMPANY_INFO.phone}`}
            className="min-h-[44px] inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm text-slate-950 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 shadow-sm transition-all active:scale-98"
          >
            <Phone className="w-4 h-4 text-slate-950" />
            <span>Call Now ({COMPANY_INFO.displayPhone})</span>
          </a>

          <button
            id="cta-get-quote-btn"
            onClick={onOpenQuoteModal}
            className="min-h-[44px] inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm text-white bg-orange-600 hover:bg-orange-700 active:bg-orange-800 shadow-sm transition-all active:scale-98"
          >
            <FileText className="w-4 h-4" />
            <span>Request Quotation</span>
          </button>

          <a
            id="cta-send-email-btn"
            href={`mailto:${COMPANY_INFO.email}?subject=Industrial%20Safety%20Enquiry%20-%20Rajdeep%20Enterprises`}
            className="min-h-[44px] inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-700 shadow-sm transition-all active:scale-98"
          >
            <Mail className="w-4 h-4 text-orange-400" />
            <span>Send Email</span>
          </a>
        </div>

        <div className="pt-2 text-xs text-slate-300 font-medium">
          Direct Point of Contact: <strong className="text-white">{COMPANY_INFO.contactPerson}</strong> • UP SIDC Complex, Refinery Main Gate, Mathura
        </div>
      </div>
    </section>
  );
};
