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
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-900 text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-1">
            <MapPin className="w-3 h-3 text-blue-600" />
            <span>Refinery Main Gate Hub</span>
          </div>
          <h2 className="text-base sm:text-xl md:text-2xl font-black text-slate-900 tracking-tight">
            {t.mapTitle}
          </h2>
          <p className="text-[11px] sm:text-xs text-slate-600 mt-0.5">
            {t.mapSubtitle}
          </p>
        </div>

        {/* Side-by-Side Container on both Mobile & Desktop */}
        <div className="grid grid-cols-2 gap-2 sm:gap-4 items-stretch">
          
          {/* Left Column: Interactive Map */}
          <div className="bg-slate-900 rounded-xl overflow-hidden border border-slate-300 shadow-sm flex flex-col justify-between">
            <div className="p-1.5 sm:p-2.5 bg-[#0B192C] text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-bold truncate">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 animate-pulse"></span>
                <span className="truncate">Mathura Refinery Map</span>
              </div>
              <a
                href={COMPANY_INFO.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[9px] sm:text-[11px] font-bold text-sky-400 hover:underline flex items-center gap-0.5 shrink-0 ml-1"
              >
                <span>Google Maps</span>
                <ExternalLink className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
              </a>
            </div>

            {/* Map iframe */}
            <div className="relative h-28 sm:h-40 md:h-52 w-full bg-slate-100">
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
            <div className="p-1.5 sm:p-2 bg-slate-950 text-white flex items-center justify-between gap-1 text-[9px] sm:text-[11px]">
              <span className="text-slate-400 truncate hidden xs:inline">27.4239°N, 77.6974°E</span>
              <a
                href={COMPANY_INFO.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full xs:w-auto inline-flex items-center justify-center gap-1 px-2 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white font-bold text-[9px] sm:text-xs transition text-center"
              >
                <Navigation className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                <span>GPS Navigation</span>
              </a>
            </div>
          </div>

          {/* Right Column: Office & Depot Details */}
          <div className="p-2 sm:p-3.5 rounded-xl bg-blue-50/90 border border-blue-200 text-left flex flex-col justify-between shadow-sm">
            <div>
              <div className="flex items-center gap-1.5 mb-1 sm:mb-2">
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
                  <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
                <div className="min-w-0">
                  <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm truncate">
                    Office & Supply Depot
                  </h4>
                  <p className="text-[9px] sm:text-[10px] text-blue-950 font-semibold flex items-center gap-0.5 truncate">
                    <Shield className="w-2.5 h-2.5 text-blue-600 shrink-0" />
                    <span>Opposite Refinery Main Gate</span>
                  </p>
                </div>
              </div>

              <div className="text-[10px] sm:text-xs text-slate-800 font-medium leading-tight">
                {COMPANY_INFO.address}
              </div>

              <div className="mt-1.5 sm:mt-2 space-y-0.5 sm:space-y-1 text-[9px] sm:text-[11px] text-slate-600 border-t border-blue-200/80 pt-1 sm:pt-1.5">
                <p className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                  <span><strong>2 Min Walk</strong> from Refinery Gate</span>
                </p>
                <p className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></span>
                  <span><strong>Truck loading bay</strong> for heavy lots</span>
                </p>
                <p className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span>
                  <span><strong>18 Min</strong> from Mathura Junction</span>
                </p>
              </div>
            </div>

            <div className="mt-2 pt-1.5 border-t border-blue-200/80">
              <a
                href={`tel:${COMPANY_INFO.phone}`}
                className="w-full inline-flex items-center justify-center gap-1 py-1 sm:py-1.5 px-2 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] sm:text-xs font-bold transition shadow-xs"
              >
                <Phone className="w-3 h-3 text-white" />
                <span className="truncate">Call: {COMPANY_INFO.displayPhone}</span>
              </a>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
