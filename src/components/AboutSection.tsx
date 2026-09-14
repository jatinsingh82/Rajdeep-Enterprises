import React, { useState } from 'react';
import { ShieldCheck, Award, MapPin, CheckCircle, ArrowUpRight, Building2, ChevronDown, ChevronUp } from 'lucide-react';
import { COMPANY_INFO } from '../data/companyData';

interface AboutSectionProps {
  onOpenVisitingCard: () => void;
  onOpenQuoteModal: () => void;
  storefrontPhotoUrl?: string;
}

export const AboutSection: React.FC<AboutSectionProps> = ({
  onOpenVisitingCard,
  onOpenQuoteModal,
  storefrontPhotoUrl
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const photoUrl = storefrontPhotoUrl || '/attached_assets/WhatsApp_Image_2026-09-12_at_17.24.08.jpeg';

  return (
    <section id="about" className="py-4 sm:py-6 bg-slate-50 relative overflow-hidden border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
        
        {/* Collapsible Dropdown Header Trigger */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full text-left p-3 sm:p-4 rounded-xl bg-white hover:bg-slate-100/80 border border-slate-200 hover:border-blue-400 transition-all flex items-center justify-between gap-2 sm:gap-4 shadow-sm group"
          aria-expanded={isOpen}
        >
          <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Building2 className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider bg-blue-100 px-2 py-0.5 rounded">
                  Company Overview
                </span>
                <span className="text-[10px] text-slate-500 font-mono hidden xs:inline">
                  Proprietor: {COMPANY_INFO.contactPerson}
                </span>
              </div>
              <h2 className="text-sm sm:text-base md:text-lg font-black text-slate-900 tracking-tight leading-snug break-words mt-0.5">
                About Rajdeep Enterprises
              </h2>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                All kinds of safety accessories & all types of material suppliers at UP SIDC Complex, Refinery Main Gate, Mathura.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[10px] sm:text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md border border-blue-200 whitespace-nowrap">
              {isOpen ? 'Close Section' : 'Explore Details'}
            </span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 group-hover:text-slate-900">
              {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </div>
        </button>

        {/* Collapsible Dropdown Content */}
        {isOpen && (
          <div className="mt-3 sm:mt-4 p-3 sm:p-5 bg-white rounded-xl border border-slate-200 shadow-sm animate-in fade-in duration-200">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
              
              {/* Left Column: Business Story */}
              <div className="lg:col-span-7 space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-bold text-blue-700">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Serving Indian Oil Refinery Contractors & Industrial Corridors</span>
                </div>
                
                <h3 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
                  Trusted Safety & Industrial Material Partner
                </h3>
                
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Rajdeep Enterprises is a recognized supplier based at <strong>15/1, U.P. S.I.D.C. Complex, Refinery Main Gate, Mathura</strong>. Managed directly by proprietor <strong>{COMPANY_INFO.contactPerson}</strong>, we ensure genuine quality, verified IS standards, prompt local dispatch, and reliable pan-India logistics.
                </p>

                <div className="grid grid-cols-2 gap-2 pt-1 text-[11px] text-slate-700">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Immediate gate pickup & emergency dispatch</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Complete safety PPE conforming to BIS norms</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Stationery, files & registers for site office</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Custom safety sourcing across all 28 states</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  <button
                    id="about-visiting-card-btn"
                    onClick={onOpenVisitingCard}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-900 bg-amber-400 hover:bg-amber-300 transition shadow-xs"
                  >
                    <span>View Official Visiting Card</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    id="about-quote-btn"
                    onClick={onOpenQuoteModal}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition shadow-xs"
                  >
                    <span>Request Quotation</span>
                  </button>
                </div>
              </div>

              {/* Right Column: Mini Visiting Card Snapshot */}
              <div className="lg:col-span-5">
                <div className="p-3 sm:p-4 rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 text-white border border-slate-700">
                  <div className="flex items-center gap-2.5 pb-2.5 border-b border-slate-700">
                    <img
                      src={photoUrl}
                      alt={COMPANY_INFO.contactPerson}
                      className="w-10 h-10 rounded-lg object-cover object-top border border-sky-400 shadow-sm shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="min-w-0">
                      <div className="text-[10px] text-sky-400 font-bold uppercase tracking-wider">
                        Proprietor & Store Owner
                      </div>
                      <div className="text-sm font-black text-white truncate">
                        {COMPANY_INFO.contactPerson}
                      </div>
                      <div className="text-[11px] text-slate-300 font-mono">
                        {COMPANY_INFO.phone}
                      </div>
                    </div>
                  </div>

                  <div className="mt-2 text-center py-1 bg-slate-800/80 rounded border border-slate-700">
                    <span className="text-xs font-extrabold text-orange-400">RAJDEEP ENTERPRISES</span>
                    <p className="text-[10px] text-slate-300">All Kinds of Safety Accessories & Material Suppliers</p>
                  </div>

                  <div className="mt-2 text-[10px] text-slate-300 space-y-0.5">
                    <p><strong className="text-slate-400">Email:</strong> {COMPANY_INFO.email}</p>
                    <p><strong className="text-slate-400">Address:</strong> {COMPANY_INFO.address}</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </section>
  );
};
