import React, { useState } from 'react';
import { ShieldCheck, Award, MapPin, CheckCircle, ArrowUpRight, Building2, ChevronDown, ChevronUp, Users, Package, Navigation, Phone, Mail } from 'lucide-react';
import { COMPANY_INFO } from '../data/companyData';

interface AboutSectionProps {
  onOpenVisitingCard: () => void;
  onOpenQuoteModal: () => void;
  storefrontPhotoUrl?: string;
}

export const AboutSection: React.FC<AboutSectionProps> = ({
  onOpenVisitingCard,
  onOpenQuoteModal
}) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <section id="about" className="py-6 sm:py-10 bg-slate-50 relative overflow-hidden border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full text-left p-4 sm:p-5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-400 transition-all flex items-center justify-between gap-3 shadow-xs group"
          aria-expanded={isOpen}
        >
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-slate-100 border border-slate-200 text-slate-800 flex items-center justify-center shrink-0 group-hover:bg-slate-900 group-hover:text-white transition-colors">
              <Building2 className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-extrabold text-slate-700 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                  Business Profile & Operations
                </span>
                <span className="text-[10px] text-slate-500 font-mono hidden xs:inline">
                  Proprietor: {COMPANY_INFO.contactPerson}
                </span>
              </div>
              <h2 className="text-base sm:text-xl font-black text-slate-900 tracking-tight leading-snug break-words mt-0.5">
                About Rajdeep Enterprises
              </h2>
              <p className="text-xs text-slate-500 hidden sm:block mt-0.5">
                All kinds of safety accessories & all types of material suppliers at UP SIDC Complex, Refinery Main Gate, Mathura.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-300 whitespace-nowrap">
              {isOpen ? 'Minimize Overview' : 'Read Business Profile'}
            </span>
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 group-hover:text-slate-900">
              {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </div>
        </button>

        {/* Structured Credibility Content */}
        {isOpen && (
          <div className="mt-4 p-4 sm:p-6 bg-white rounded-2xl border border-slate-200 shadow-xs animate-in fade-in duration-200">
            
            {/* Top Overview & Storefront Snapshot */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start pb-6 border-b border-slate-100">
              <div className="lg:col-span-8 space-y-3">
                <div className="inline-flex items-center gap-2 text-xs font-bold text-slate-800 bg-slate-100 px-3 py-1 rounded-full border border-slate-300">
                  <ShieldCheck className="w-4 h-4 text-orange-600" />
                  <span>Industrial Supply Depot at Mathura Refinery Main Gate</span>
                </div>
                <h3 className="text-lg sm:text-2xl font-black text-slate-900 leading-snug">
                  Industrial Safety & Material Supplier
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Rajdeep Enterprises is an established industrial safety accessories and material supply firm situated at <strong>15/1, U.P. S.I.D.C. Complex, Refinery Main Gate, Mathura</strong>. Directed personally by proprietor <strong>{COMPANY_INFO.contactPerson}</strong>, we provide end-to-end procurement support for refinery contractors, fabrication yards, and industrial projects.
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  <button
                    type="button"
                    id="about-visiting-card-btn"
                    onClick={onOpenVisitingCard}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 transition shadow-2xs min-h-[40px]"
                  >
                    <span>View Official Visiting Card</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    id="about-quote-btn"
                    onClick={onOpenQuoteModal}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 active:bg-orange-800 transition shadow-2xs min-h-[40px]"
                  >
                    <span>Request Quotation</span>
                  </button>
                </div>
              </div>

              {/* Verified Owner Card */}
              <div className="lg:col-span-4 bg-slate-900 rounded-xl p-4 text-white border border-slate-800 flex flex-col justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-800 border border-sky-500/40 flex items-center justify-center text-sky-400 shrink-0">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] text-sky-400 font-bold uppercase tracking-wider block">Proprietor</span>
                    <h4 className="text-sm font-black text-white truncate">{COMPANY_INFO.contactPerson}</h4>
                    <span className="text-xs text-slate-300 font-mono">{COMPANY_INFO.displayPhone}</span>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-800 text-[11px] text-slate-300 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                    <span className="truncate">{COMPANY_INFO.address}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                    <span className="truncate">{COMPANY_INFO.email}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 4 Clear Credibility Answer Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6">
              
              {/* 1. What We Supply */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                <div>
                  <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center mb-2.5">
                    <Package className="w-4 h-4" />
                  </div>
                  <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm">What We Supply</h4>
                  <ul className="mt-2 space-y-1.5 text-xs text-slate-600">
                    <li className="flex items-start gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" />
                      <span>Certified Safety PPE (Helmets, Shoes, Harnesses)</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" />
                      <span>Champion Gaskets & Jointing Sheets</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" />
                      <span>Welding Consumables, Tools & Site Stationery</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* 2. Who We Serve */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                <div>
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mb-2.5">
                    <Users className="w-4 h-4" />
                  </div>
                  <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm">Who We Serve</h4>
                  <ul className="mt-2 space-y-1.5 text-xs text-slate-600">
                    <li className="flex items-start gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                      <span>IOCL Mathura Refinery Contractors</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                      <span>Turnaround, Shutdown & Maintenance Crews</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                      <span>Fabrication Workshops & EPC Project Sites</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* 3. Where We Operate */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                <div>
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center mb-2.5">
                    <Navigation className="w-4 h-4" />
                  </div>
                  <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm">Where We Operate</h4>
                  <ul className="mt-2 space-y-1.5 text-xs text-slate-600">
                    <li className="flex items-start gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>Direct Counter Depot at Refinery Main Gate</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>Doorstep Dispatch across all 28 Indian States</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>Any Quantity: Single items to full truckloads</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* 4. How to Contact */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                <div>
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center mb-2.5">
                    <Phone className="w-4 h-4" />
                  </div>
                  <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm">How to Contact</h4>
                  <ul className="mt-2 space-y-1.5 text-xs text-slate-600">
                    <li className="flex items-start gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                      <span>Call: {COMPANY_INFO.displayPhone}</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                      <span>WhatsApp instant quotation response</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                      <span>Counter visit: UP SIDC Complex, Mathura</span>
                    </li>
                  </ul>
                </div>
              </div>

            </div>

          </div>
        )}

      </div>
    </section>
  );
};
