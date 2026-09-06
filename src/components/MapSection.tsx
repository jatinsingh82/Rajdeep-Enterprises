import React from 'react';
import { MapPin, Navigation, Phone, ExternalLink, Clock, Truck, Shield } from 'lucide-react';
import { COMPANY_INFO } from '../data/companyData';
import { Language } from '../types';
import { TRANSLATIONS } from '../data/extraData';

interface MapSectionProps {
  lang: Language;
}

export const MapSection: React.FC<MapSectionProps> = ({ lang }) => {
  const t = TRANSLATIONS[lang];

  return (
    <section id="location" className="py-16 md:py-20 bg-white relative border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-bold uppercase tracking-wider mb-3">
            <MapPin className="w-3.5 h-3.5 text-orange-600" />
            <span>Prime Refinery Hub Location</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            {t.mapTitle}
          </h2>
          <div className="w-16 h-1 bg-orange-500 mx-auto mt-4 rounded-full"></div>
          <p className="mt-4 text-sm sm:text-base text-slate-600">
            {t.mapSubtitle}
          </p>
        </div>

        {/* Map & Directions Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Interactive Map View */}
          <div className="lg:col-span-7 bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 shadow-lg flex flex-col">
            <div className="p-3.5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2 text-xs font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Mathura Refinery UP SIDC Complex (Live Map)</span>
              </div>
              <a
                href={COMPANY_INFO.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-bold text-amber-400 hover:underline flex items-center gap-1"
              >
                <span>Full Google Maps</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* OpenStreetMap interactive iframe centered on Mathura Refinery coordinates */}
            <div className="relative h-72 sm:h-96 w-full bg-slate-100">
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
            <div className="p-4 bg-slate-950 text-white flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div>
                <span className="text-slate-400">GPS Coordinates:</span>{' '}
                <strong className="text-amber-400 font-mono">27.4239° N, 77.6974° E</strong>
              </div>
              <a
                href={COMPANY_INFO.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-bold transition"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Start Turn-by-Turn GPS Navigation</span>
              </a>
            </div>
          </div>

          {/* Right: Directions & Transit Details */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Main Address Card */}
            <div className="p-5 rounded-2xl bg-orange-50 border border-orange-200">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 text-base">Office & Supply Depot</h4>
                  <p className="text-xs sm:text-sm text-slate-700 font-medium mt-1 leading-relaxed">
                    15/1, U.P. S.I.D.C. Complex, Refinery Main Gate, Mathura, Uttar Pradesh - 281005, India
                  </p>
                  <p className="text-xs text-orange-800 font-bold mt-2 flex items-center gap-1">
                    <Shield className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                    <span>Opposite Mathura Refinery Main Security Gate</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Directions Reference Guide */}
            <div className="space-y-3">
              <div className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition space-y-1">
                <div className="flex items-center justify-between">
                  <h5 className="font-bold text-xs sm:text-sm text-slate-900 flex items-center gap-2">
                    <Navigation className="w-4 h-4 text-orange-600" />
                    <span>From Mathura Refinery Main Gate</span>
                  </h5>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">2 Min Walk</span>
                </div>
                <p className="text-xs text-slate-600">
                  Walk across directly to the U.P. S.I.D.C. Commercial Complex; shop #15/1 on the ground level.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition space-y-1">
                <div className="flex items-center justify-between">
                  <h5 className="font-bold text-xs sm:text-sm text-slate-900 flex items-center gap-2">
                    <Navigation className="w-4 h-4 text-orange-600" />
                    <span>From Mathura Junction Railway Station</span>
                  </h5>
                  <span className="text-[11px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">~9.5 km (18 min)</span>
                </div>
                <p className="text-xs text-slate-600">
                  Head south on NH-19 (Delhi-Agra highway) towards Refinery bypass circle.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition space-y-1">
                <div className="flex items-center justify-between">
                  <h5 className="font-bold text-xs sm:text-sm text-slate-900 flex items-center gap-2">
                    <Truck className="w-4 h-4 text-orange-600" />
                    <span>Commercial Truck & Tempo Access</span>
                  </h5>
                  <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">Direct Loading Bay</span>
                </div>
                <p className="text-xs text-slate-600">
                  Wide tarmac apron for loading heavy consignments, safety cones, boots, and scaffolding hardware.
                </p>
              </div>
            </div>

            {/* Quick Contact Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row gap-2">
              <a
                href={`tel:${COMPANY_INFO.phone}`}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition"
              >
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <span>Call Primary: {COMPANY_INFO.phone}</span>
              </a>
              <a
                href={`tel:${COMPANY_INFO.secondaryPhone}`}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold transition"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Line 2: {COMPANY_INFO.secondaryPhone}</span>
              </a>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
