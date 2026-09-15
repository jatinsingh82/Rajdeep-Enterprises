import React from 'react';
import { MapPin, Navigation, Phone, ExternalLink, Shield } from 'lucide-react';
import { COMPANY_INFO } from '../data/companyData';
import { Language } from '../types';
import { TRANSLATIONS } from '../data/extraData';

interface MapSectionProps {
  lang: Language;
}

export const MapSection: React.FC<MapSectionProps> = ({ lang }) => {
  const t = TRANSLATIONS[lang];

  return (
    <section id="location" className="py-4 sm:py-6 md:py-8 bg-white relative border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
        
        {/* Compact Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-3 sm:mb-5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-800 text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-1">
            <MapPin className="w-3 h-3 text-orange-600" />
            <span>Refinery Main Gate Depot</span>
          </div>
          <h2 className="text-base sm:text-xl md:text-2xl font-black text-slate-900 tracking-tight">
            {t.mapTitle}
          </h2>
          <p className="text-[11px] sm:text-xs text-slate-600 mt-0.5">
            {t.mapSubtitle}
          </p>
        </div>

        {/* Responsive Grid: Single-Column on Mobile, Side-by-Side on Tablet/Desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-5 items-stretch">
          
          {/* Interactive Map */}
          <div className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-300 shadow-sm flex flex-col justify-between">
            <div className="p-2.5 bg-[#0B192C] text-white flex items-center justify-between border-b border-slate-800 gap-2">
              <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold min-w-0">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 animate-pulse"></span>
                <span className="leading-snug break-words">Mathura Refinery Map Location</span>
              </div>
              <a
                href={COMPANY_INFO.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] sm:text-xs font-bold text-orange-400 hover:underline flex items-center gap-1 shrink-0 ml-1 whitespace-nowrap"
              >
                <span>Google Maps</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Map iframe with responsive height */}
            <div className="relative h-48 sm:h-56 md:h-64 w-full bg-slate-100">
              <iframe
                title="Rajdeep Enterprises Location Map"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                src={`https://www.openstreetmap.org/export/embed.html?bbox=77.6774%2C27.4039%2C77.7174%2C27.4439&layer=mapnik&marker=${COMPANY_INFO.locationCoordinates.lat}%2C${COMPANY_INFO.locationCoordinates.lng}`}
              ></iframe>
            </div>

            {/* Bottom Bar on Map */}
            <div className="p-2 sm:p-2.5 bg-slate-950 text-white flex items-center justify-between gap-2 text-xs">
              <span className="text-slate-400 truncate hidden xs:inline font-mono text-[11px]">27.4239°N, 77.6974°E</span>
              <a
                href={COMPANY_INFO.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full xs:w-auto inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white font-bold text-xs transition text-center min-h-[44px] whitespace-nowrap active:scale-98 shadow-xs"
              >
                <Navigation className="w-3.5 h-3.5 shrink-0" />
                <span>Open in GPS Navigation</span>
              </a>
            </div>
          </div>

          {/* Office & Depot Details */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 text-left flex flex-col justify-between shadow-xs">
            <div>
              <div className="flex items-center gap-2 mb-2 sm:mb-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-slate-900 text-orange-400 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="min-w-0">
                  <h4 className="font-extrabold text-slate-900 text-sm sm:text-base leading-tight">
                    Office & Supply Depot
                  </h4>
                  <p className="text-[10px] sm:text-xs text-slate-600 font-semibold flex items-center gap-1 leading-tight mt-0.5">
                    <Shield className="w-3 h-3 text-orange-600 shrink-0" />
                    <span>Opposite Refinery Main Gate</span>
                  </p>
                </div>
              </div>

              <div className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
                {COMPANY_INFO.address}
              </div>

              <div className="mt-2 sm:mt-3 space-y-1 sm:space-y-1.5 text-xs text-slate-600 border-t border-slate-200 pt-2 sm:pt-2.5">
                <p className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                  <span><strong>2 Min Walk</strong> from Mathura Refinery Gate</span>
                </p>
                <p className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-orange-500 shrink-0"></span>
                  <span><strong>Truck loading bay</strong> for heavy lots & express pickups</span>
                </p>
                <p className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0"></span>
                  <span><strong>18 Min</strong> from Mathura Junction railway station</span>
                </p>
              </div>
            </div>

            <div className="mt-3 pt-2.5 border-t border-slate-200">
              <a
                href={`tel:${COMPANY_INFO.phone}`}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 text-xs sm:text-sm font-bold transition shadow-xs min-h-[44px] active:scale-98"
              >
                <Phone className="w-4 h-4 text-slate-950" />
                <span className="truncate">Call Office: {COMPANY_INFO.displayPhone}</span>
              </a>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
