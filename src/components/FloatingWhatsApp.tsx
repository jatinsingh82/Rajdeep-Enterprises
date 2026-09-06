import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { COMPANY_INFO } from '../data/companyData';

export const FloatingWhatsApp: React.FC = () => {
  const [showTooltip, setShowTooltip] = useState(true);

  const handleClick = () => {
    const message = encodeURIComponent(COMPANY_INFO.whatsappDefaultMessage);
    const url = `https://wa.me/${COMPANY_INFO.whatsappNumber}?text=${message}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end">
      {/* Speech bubble tooltip */}
      {showTooltip && (
        <div className="mb-2 relative bg-white text-slate-800 text-xs py-2 px-3.5 rounded-xl shadow-xl border border-slate-200 flex items-center gap-2 max-w-xs animate-bounce">
          <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></div>
          <span className="font-medium text-[11px] leading-tight">
            Need fast quotes for safety gear? Chat on WhatsApp!
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowTooltip(false);
            }}
            className="text-slate-400 hover:text-slate-600 p-0.5"
            aria-label="Close tooltip"
          >
            <X className="w-3.5 h-3.5" />
          </button>
          {/* Caret pointing to button */}
          <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-white border-b border-r border-slate-200 rotate-45"></div>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        id="floating-whatsapp-btn"
        onClick={handleClick}
        className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-110 active:scale-95 focus:outline-none"
        aria-label="Chat on WhatsApp with Rajdeep Enterprises"
        title="Chat on WhatsApp with Rajdeep Enterprises"
      >
        {/* Pulsing ring */}
        <span className="absolute inset-0 rounded-full bg-emerald-400 opacity-40 animate-ping pointer-events-none"></span>

        {/* WhatsApp Icon */}
        <MessageCircle className="w-7 h-7 fill-white/20 relative z-10" />

        {/* Online Indicator Badge */}
        <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-emerald-300 border-2 border-white rounded-full"></span>
      </button>
    </div>
  );
};
