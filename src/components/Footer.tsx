import React from 'react';
import { Shield, Phone, Mail, MapPin, ArrowUp, FileText, CheckCircle } from 'lucide-react';
import { COMPANY_INFO, PRODUCT_CATEGORIES } from '../data/companyData';

interface FooterProps {
  onOpenVisitingCard: () => void;
  onOpenQuoteModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenVisitingCard, onOpenQuoteModal }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800 relative">
      {/* Top Hazard Accent Line */}
      <div className="h-1.5 hazard-stripe-light opacity-80"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-[calc(5.5rem+env(safe-area-inset-bottom,0px))] md:pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-slate-800/80">
          
          {/* Col 1: Business Identity & Description */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-slate-900 flex items-center justify-center text-white border-2 border-sky-500 shadow-sm shrink-0">
                <Shield className="w-6 h-6 text-sky-400 fill-sky-400/20" />
              </div>
              <div>
                <span className="font-extrabold text-xl tracking-tight text-white block">
                  RAJDEEP <span className="text-sky-400">ENTERPRISES</span>
                </span>
                <span className="text-xs text-sky-300 font-semibold tracking-wide">
                  {COMPANY_INFO.tagline}
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Industrial safety accessories, personal protective equipment (PPE), Champion gaskets, stationery, site registers, and industrial material supplier with <strong className="text-slate-200">pan-India supply dispatch everywhere</strong>. Order any quantity required (from single units to bulk project supplies), plus on-demand custom sourcing for any extra specialized items.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-sky-300 bg-slate-900 border border-sky-500/30 px-2.5 py-1 rounded-full">
                🇮🇳 Supplying in Whole India Everywhere
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-slate-900 border border-emerald-500/30 px-2.5 py-1 rounded-full">
                Any Quantity • Extra Items Sourced
              </span>
            </div>

            {/* Quick Contact Action Buttons for Mobile */}
            <div className="grid grid-cols-3 gap-2 pt-2 sm:hidden">
              <a
                href={`tel:${COMPANY_INFO.phone}`}
                className="py-2.5 px-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call</span>
              </a>
              <a
                href={`https://wa.me/${COMPANY_INFO.whatsappNumber}?text=${encodeURIComponent(COMPANY_INFO.whatsappDefaultMessage)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition"
              >
                <span className="text-xs">💬</span>
                <span>WhatsApp</span>
              </a>
              <a
                href={COMPANY_INFO.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-300 font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-700 transition"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Directions</span>
              </a>
            </div>

            <div className="pt-1">
              <button
                onClick={onOpenVisitingCard}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-xs font-bold text-sky-300 border border-slate-700 transition"
              >
                <FileText className="w-3.5 h-3.5 text-sky-400" />
                <span>View Official Visiting Card</span>
              </button>
            </div>
          </div>

          {/* Col 2: Quick Navigation */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#home" className="hover:text-sky-400 transition-colors">Home</a>
              </li>
              <li>
                <a href="#products" className="hover:text-sky-400 transition-colors">Our Products</a>
              </li>
              <li>
                <a href="#pan-india" className="text-sky-300 font-bold hover:text-sky-200 transition-colors">🇮🇳 Whole India Supply</a>
              </li>
              <li>
                <a href="#tools-and-guides" className="hover:text-sky-400 transition-colors">Tools, Compliance & Industrial Guides</a>
              </li>
              <li>
                <a href="#principles" className="hover:text-sky-400 transition-colors">Core Principles</a>
              </li>
              <li>
                <a href="#about" className="hover:text-sky-400 transition-colors">About Us</a>
              </li>
              <li>
                <a href="#location" className="hover:text-sky-400 transition-colors">Where Can You Find Us</a>
              </li>
              <li>
                <a href="#contact" className="hover:text-sky-400 transition-colors">Contact Us</a>
              </li>
            </ul>
          </div>

          {/* Col 3: Key Products */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">
              Core Products
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                <span>Industrial Safety Helmets</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                <span>Karam Industrial Safety Shoes</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                <span>Cut-Resistant & Coated Gloves</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                <span>Udyogi Full Body Safety Harness</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                <span>Traffic Cones & SSWW Road Studs</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                <span>Champion Gaskets & Jointing Sheets</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact Information */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">
              Contact Details
            </h4>
            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <span>{COMPANY_INFO.address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-sky-400 shrink-0" />
                <div className="flex flex-wrap items-center gap-1.5">
                  <a href={`tel:${COMPANY_INFO.phone}`} className="text-sky-300 hover:underline font-bold">
                    {COMPANY_INFO.phone}
                  </a>
                  <span className="text-slate-600">/</span>
                  <a href={`tel:${COMPANY_INFO.secondaryPhone}`} className="text-sky-300 hover:underline font-bold">
                    {COMPANY_INFO.secondaryPhone}
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-sky-400 shrink-0" />
                <a href={`mailto:${COMPANY_INFO.email}`} className="text-slate-300 hover:text-white break-all">
                  {COMPANY_INFO.email}
                </a>
              </div>
              <div className="pt-1 text-[11px] text-slate-400">
                Contact Person: <strong className="text-white">{COMPANY_INFO.contactPerson}</strong>
              </div>
              <div className="text-[11px] text-emerald-400 font-medium">
                GST Invoice & Official Tax Billing: <span className="text-slate-300">{COMPANY_INFO.gstStatus}</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={onOpenQuoteModal}
                className="w-full py-2 px-3 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition"
              >
                Request Fast Quotation
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Back to top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            &copy; 2026 Rajdeep Enterprises. All Rights Reserved.
          </div>
          <div className="flex items-center gap-4">
            <span className="text-slate-400">Mathura, Uttar Pradesh, India</span>
            <button
              onClick={scrollToTop}
              className="p-2 rounded-lg bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 transition"
              title="Back to Top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
