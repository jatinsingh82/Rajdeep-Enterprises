import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { COMPANY_INFO } from '../data/companyData';
import { trackWhatsAppClick } from '../utils/analytics';

export const FloatingWhatsApp: React.FC = () => {
  const [showTooltip, setShowTooltip] = useState(true);

  const handleClick = () => {
    trackWhatsAppClick({ source: 'floating_whatsapp_button', context: 'general_inquiry' });
    const message = encodeURIComponent(COMPANY_INFO.whatsappDefaultMessage);
    const url = `https://wa.me/${COMPANY_INFO.whatsappNumber}?text=${message}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="hidden md:flex fixed bottom-5 right-5 z-40 flex-col items-end">
      {/* Speech bubble tooltip - shown on sm+ screens */}
      {showTooltip && (
        <div className="hidden sm:flex mb-2 relative bg-white text-slate-800 text-xs py-2 px-3.5 rounded-xl shadow-xl border border-slate-200 items-center gap-2 max-w-xs">
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
        className="group relative flex items-center justify-center w-13 h-13 rounded-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white shadow-lg transition-all duration-200 transform hover:scale-105 active:scale-95 focus:outline-none"
        aria-label="Chat on WhatsApp with Rajdeep Enterprises"
        title="Chat on WhatsApp with Rajdeep Enterprises"
      >
        {/* WhatsApp Icon */}
        <MessageCircle className="w-6 h-6 relative z-10" />

        {/* Online Indicator Badge */}
        <span className="absolute top-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-white rounded-full"></span>
      </button>
    </div>
  );
};
