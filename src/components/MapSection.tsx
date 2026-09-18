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
    <section id="location" className="py-10 sm:py-14 md:py-16 bg-white relative border-t border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold uppercase tracking-wider mb-2.5">
            <MapPin className="w-3.5 h-3.5 text-orange-600" />
            <span>Rajdeep Enterprises Physical Depot</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
            {t.mapTitle}
          </h2>
          <div className="w-16 h-1 bg-orange-600 mx-auto mt-3 rounded-full"></div>
          <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
            {t.mapSubtitle}
          </p>
        </div>

        {/* Responsive Grid: Single-Column on Mobile, Side-by-Side on Tablet/Desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 items-stretch">
          
          {/* Interactive Map */}
          <div className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-300 shadow-sm flex flex-col justify-between">
            <div className="p-2.5 bg-[#0B192C] text-white flex items-center justify-between border-b border-slate-800 gap-2">
              <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold min-w-0">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                <span className="leading-snug break-words">Rajdeep Enterprises Shop Pin</span>
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
            <div className="relative h-40 sm:h-52 md:h-60 w-full bg-slate-100">
              <iframe
                title="Rajdeep Enterprises Shop Location Map"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                src={`https://www.openstreetmap.org/export/embed.html?bbox=77.6774%2C27.4039%2C77.7174%2C27.4439&layer=mapnik&marker=${COMPANY_INFO.locationCoordinates.lat}%2C${COMPANY_INFO.locationCoordinates.lng}`}
              ></iframe>
            </div>

            {/* Bottom Bar on Map */}
            <div className="p-2 sm:p-2.5 bg-slate-950 text-white flex flex-col xs:flex-row items-stretch xs:items-center justify-between gap-2 text-xs">
              <span className="text-slate-300 truncate font-mono text-[11px] text-center xs:text-left">15/1, U.P. S.I.D.C. Complex, Mathura</span>
              <a
                id="map-directions-btn"
                href={COMPANY_INFO.directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full xs:w-auto inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white font-bold text-xs transition text-center min-h-[44px] whitespace-nowrap active:scale-98 shadow-xs"
              >
                <Navigation className="w-3.5 h-3.5 shrink-0" />
                <span>Get Directions to Shop</span>
              </a>
            </div>
          </div>

          {/* Office & Depot Details */}
          <div className="p-3.5 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 text-left flex flex-col justify-between shadow-xs">
            <div>
              <div className="flex items-center gap-2 mb-2 sm:mb-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-slate-900 text-orange-400 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="min-w-0">
                  <h4 className="font-extrabold text-slate-900 text-sm sm:text-base leading-tight truncate">
                    Rajdeep Enterprises Shop
                  </h4>
                  <p className="text-[10px] sm:text-xs text-slate-600 font-semibold flex items-center gap-1 leading-tight mt-0.5">
                    <Shield className="w-3 h-3 text-orange-600 shrink-0" />
                    <span className="truncate">Opposite Refinery Main Gate</span>
                  </p>
                </div>
              </div>

              <div className="text-xs sm:text-sm text-slate-900 font-semibold leading-relaxed break-words bg-white p-2.5 rounded-xl border border-slate-200">
                {COMPANY_INFO.fullAddress}
              </div>

              <div className="mt-2.5 sm:mt-3 space-y-1.5 text-xs text-slate-600 border-t border-slate-200 pt-2 sm:pt-2.5">
                <p className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                  <span><strong>Direct counter pickup</strong> at 15/1 UP SIDC Complex</span>
                </p>
                <p className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-orange-500 shrink-0"></span>
                  <span><strong>Opposite</strong> Mathura Refinery Main Gate</span>
                </p>
                <p className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0"></span>
                  <span><strong>Truck loading bay</strong> for heavy lots & express pickups</span>
                </p>
              </div>
            </div>

            {/* Non-overlapping, easy-to-tap touch buttons */}
            <div className="mt-3 pt-3 border-t border-slate-200 grid grid-cols-1 xs:grid-cols-2 gap-2">
              <a
                id="location-card-directions-btn"
                href={COMPANY_INFO.directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white text-xs sm:text-sm font-bold transition shadow-xs min-h-[44px] active:scale-98 text-center"
              >
                <Navigation className="w-4 h-4 shrink-0" />
                <span className="truncate">Get Directions</span>
              </a>

              <a
                id="location-card-call-btn"
                href={`tel:${COMPANY_INFO.phone}`}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 text-xs sm:text-sm font-bold transition shadow-xs min-h-[44px] active:scale-98 text-center"
              >
                <Phone className="w-4 h-4 text-slate-950 shrink-0" />
                <span className="truncate">Call: {COMPANY_INFO.displayPhone}</span>
              </a>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
