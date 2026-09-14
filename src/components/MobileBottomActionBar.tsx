import React from 'react';
import { Phone, MessageCircle, Navigation } from 'lucide-react';
import { COMPANY_INFO } from '../data/companyData';

export const MobileBottomActionBar: React.FC = () => {
  const whatsappUrl = `https://wa.me/${COMPANY_INFO.whatsappNumber}?text=${encodeURIComponent(
    'Hello Rajdeep Enterprises, I need quotation and information for industrial safety materials.'
  )}`;

  return (
    <aside
      aria-label="Quick Contact Actions"
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-slate-950/95 backdrop-blur-md border-t border-slate-800 shadow-[0_-4px_20px_rgba(0,0,0,0.45)] px-3 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))] box-border"
    >
      <div className="max-w-md mx-auto grid grid-cols-3 gap-2 items-center">
        {/* Call Button */}
        <a
          id="mobile-bottom-call-btn"
          href={`tel:${COMPANY_INFO.phone}`}
          className="flex items-center justify-center gap-1.5 h-11 px-1 rounded-xl bg-amber-400 hover:bg-amber-500 active:bg-amber-600 text-slate-950 font-extrabold text-xs shadow-xs transition active:scale-95 text-center min-w-0"
          aria-label={`Call Rajdeep Enterprises at ${COMPANY_INFO.phone}`}
        >
          <Phone className="w-4 h-4 shrink-0 text-slate-950" />
          <span className="font-extrabold whitespace-nowrap">Call</span>
        </a>

        {/* WhatsApp Button */}
        <a
          id="mobile-bottom-whatsapp-btn"
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 h-11 px-1 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-extrabold text-xs shadow-xs transition active:scale-95 text-center min-w-0"
          aria-label="Chat with Rajdeep Enterprises on WhatsApp"
        >
          <MessageCircle className="w-4 h-4 shrink-0 fill-white/20" />
          <span className="font-extrabold whitespace-nowrap">WhatsApp</span>
        </a>

        {/* Directions Button */}
        <a
          id="mobile-bottom-directions-btn"
          href={COMPANY_INFO.googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 h-11 px-1 rounded-xl bg-sky-600 hover:bg-sky-500 active:bg-sky-700 text-white font-extrabold text-xs shadow-xs transition active:scale-95 text-center min-w-0"
          aria-label="Get GPS Directions to Mathura Refinery Gate Office"
        >
          <Navigation className="w-4 h-4 shrink-0" />
          <span className="font-extrabold whitespace-nowrap">Directions</span>
        </a>
      </div>
    </aside>
  );
};
