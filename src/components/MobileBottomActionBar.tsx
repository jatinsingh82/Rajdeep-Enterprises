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
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-slate-950/95 backdrop-blur-md border-t border-slate-800 shadow-[0_-4px_16px_rgba(0,0,0,0.35)] px-3 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]"
    >
      <div className="max-w-md mx-auto grid grid-cols-3 gap-2">
        {/* Call Button */}
        <a
          id="mobile-bottom-call-btn"
          href={`tel:${COMPANY_INFO.phone}`}
          className="flex items-center justify-center gap-1.5 h-11 px-2 rounded-xl bg-amber-500 active:bg-amber-600 text-slate-950 font-bold text-xs shadow transition-transform active:scale-95 text-center truncate"
        >
          <Phone className="w-4 h-4 shrink-0 text-slate-950" />
          <span className="truncate">Call</span>
        </a>

        {/* WhatsApp Button */}
        <a
          id="mobile-bottom-whatsapp-btn"
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 h-11 px-2 rounded-xl bg-emerald-600 active:bg-emerald-700 text-white font-bold text-xs shadow transition-transform active:scale-95 text-center truncate"
        >
          <MessageCircle className="w-4 h-4 shrink-0 fill-white/20" />
          <span className="truncate">WhatsApp</span>
        </a>

        {/* Directions Button */}
        <a
          id="mobile-bottom-directions-btn"
          href={COMPANY_INFO.googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 h-11 px-2 rounded-xl bg-sky-600 active:bg-sky-700 text-white font-bold text-xs shadow transition-transform active:scale-95 text-center truncate"
        >
          <Navigation className="w-4 h-4 shrink-0" />
          <span className="truncate">Directions</span>
        </a>
      </div>
    </aside>
  );
};
