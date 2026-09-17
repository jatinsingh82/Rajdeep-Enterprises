import React from 'react';
import { Shield, Phone, Mail, MapPin, ArrowUp, FileText, CheckCircle, Truck, MessageSquare } from 'lucide-react';
import { COMPANY_INFO, PRODUCT_CATEGORIES } from '../data/companyData';

interface FooterProps {
  onOpenVisitingCard: () => void;
  onOpenQuoteModal: () => void;
  onOpenLegalModal: (tab?: 'privacy' | 'terms' | 'disclaimer') => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenVisitingCard, onOpenQuoteModal, onOpenLegalModal }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800 relative">
      {/* Top Hazard Accent Line */}
      <div className="h-1 hazard-stripe-light opacity-80"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-[calc(5.5rem+env(safe-area-inset-bottom,0px))] md:pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-slate-800/80">
          
          {/* Col 1: Business Identity & Description */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-600 flex items-center justify-center text-white font-black text-sm tracking-wider shadow-sm shrink-0 border border-orange-500/40">
                RE
              </div>
              <div>
                <span className="font-extrabold text-xl tracking-tight text-white block">
                  RAJDEEP <span className="text-orange-500">ENTERPRISES</span>
                </span>
                <span className="text-xs text-slate-400 font-semibold tracking-wide">
                  {COMPANY_INFO.tagline}
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Industrial safety accessories, personal protective equipment (PPE), Champion gaskets, stationery, site registers, and industrial material supplier with <strong className="text-slate-200">pan-India supply dispatch everywhere</strong>. Order any quantity required (from single units to bulk project supplies), plus on-demand custom sourcing for any extra specialized items.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-200 bg-slate-900 border border-slate-700 px-2.5 py-1 rounded-full">
                <Truck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Pan-India Supply Everywhere</span>
              </span>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-400 bg-slate-900 border border-slate-700 px-2.5 py-1 rounded-full">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Zero Order Minimums</span>
              </span>
            </div>

            {/* Quick Contact Action Buttons for Mobile */}
            <div className="grid grid-cols-3 gap-2 pt-2 sm:hidden">
              <a
                href={`tel:${COMPANY_INFO.phone}`}
                className="py-2.5 px-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call</span>
              </a>
              <a
                href={`https://wa.me/${COMPANY_INFO.whatsappNumber}?text=${encodeURIComponent(COMPANY_INFO.whatsappDefaultMessage)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>
              <a
                href={COMPANY_INFO.directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-700 transition"
              >
                <MapPin className="w-3.5 h-3.5 text-orange-400" />
                <span>Directions</span>
              </a>
            </div>

            <div className="pt-1">
              <button
                onClick={onOpenVisitingCard}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-bold text-slate-200 border border-slate-700 transition"
              >
                <FileText className="w-3.5 h-3.5 text-orange-400" />
                <span>View Official Visiting Card</span>
              </button>
            </div>
          </div>

          {/* Col 2: Quick Navigation & Categories */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">
              Primary Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#home" className="hover:text-orange-400 transition-colors">Home Depot Overview</a>
              </li>
              <li>
                <a href="#products" className="hover:text-orange-400 transition-colors">All Products Catalogue</a>
              </li>
              <li>
                <a href="#pan-india" className="text-sky-300 font-bold hover:text-sky-200 transition-colors">Pan-India Wholesale Supply</a>
              </li>
              <li>
                <a href="#trade-kits" className="hover:text-orange-400 transition-colors">Pre-Configured Trade Safety Kits</a>
              </li>
              <li>
                <a href="#standards" className="hover:text-orange-400 transition-colors">BIS & EN Safety Standards Guide</a>
              </li>
              <li>
                <a href="#gst-compliance" className="hover:text-orange-400 transition-colors">GST & HSN Rate Reference</a>
              </li>
              <li>
                <a href="#industries" className="hover:text-orange-400 transition-colors">Industries & Gate Clearances</a>
              </li>
              <li>
                <a href="#location" className="hover:text-orange-400 transition-colors">Mathura Refinery Depot Location</a>
              </li>
            </ul>
          </div>

          {/* Col 3: Key Products & Deep Links */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">
              Core Products
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                <a href="#product/safety-helmets" className="hover:text-orange-400 transition-colors">
                  Industrial Safety Helmets (IS:2925)
                </a>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                <a href="#product/safety-shoes" className="hover:text-orange-400 transition-colors">
                  Karam Industrial Safety Shoes (IS:15298)
                </a>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                <a href="#product/belt-harness" className="hover:text-orange-400 transition-colors">
                  Full Body Safety Harness (IS:3521)
                </a>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                <a href="#product/champion-gasket-sheet" className="hover:text-orange-400 transition-colors">
                  Champion Gaskets & Jointing Sheets
                </a>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                <a href="#product/welding-rods-electrodes" className="hover:text-orange-400 transition-colors">
                  Welding Rods & Electrodes (E6013 / E7018)
                </a>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                <a href="#product/dpt-kit-ndt-crack" className="hover:text-orange-400 transition-colors">
                  DPT Testing Kit (NDT Inspection)
                </a>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                <a href="#product/road-cones" className="hover:text-orange-400 transition-colors">
                  Traffic Cones & Reflective Road Studs
                </a>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                <a href="#product/site-registers-documentation" className="hover:text-orange-400 transition-colors">
                  Site Registers & Safety Compliance Books
                </a>
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
                <MapPin className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                <span>{COMPANY_INFO.address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-orange-400 shrink-0" />
                <div className="flex flex-wrap items-center gap-1.5">
                  <a href={`tel:${COMPANY_INFO.phone}`} className="text-slate-200 hover:text-orange-400 hover:underline font-bold">
                    {COMPANY_INFO.phone}
                  </a>
                  <span className="text-slate-600">/</span>
                  <a href={`tel:${COMPANY_INFO.secondaryPhone}`} className="text-slate-200 hover:text-orange-400 hover:underline font-bold">
                    {COMPANY_INFO.secondaryPhone}
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-orange-400 shrink-0" />
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
                className="w-full py-2.5 px-3 text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 active:bg-orange-800 rounded-xl transition shadow-sm"
              >
                Request Fast Quotation
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright, Legal Links & Back to top */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span>&copy; 2026 Rajdeep Enterprises. All Rights Reserved.</span>
            <span className="hidden sm:inline text-slate-700">|</span>
            <button
              onClick={() => onOpenLegalModal('privacy')}
              className="text-slate-400 hover:text-orange-400 underline decoration-slate-700 transition"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => onOpenLegalModal('terms')}
              className="text-slate-400 hover:text-orange-400 underline decoration-slate-700 transition"
            >
              Terms of Supply
            </button>
            <button
              onClick={() => onOpenLegalModal('disclaimer')}
              className="text-slate-400 hover:text-orange-400 underline decoration-slate-700 transition"
            >
              Commercial Disclosures
            </button>
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
