import React, { useState } from 'react';
import { ShieldCheck, Headphones, MapPin, MessageSquare, CheckCircle2, Clock, Truck, Award, ChevronDown, ChevronUp } from 'lucide-react';
import { COMPANY_INFO } from '../data/companyData';

interface WhyChooseUsProps {
  onOpenQuoteModal: () => void;
}

export const WhyChooseUs: React.FC<WhyChooseUsProps> = ({ onOpenQuoteModal }) => {
  const [isOpen, setIsOpen] = useState(true);

  const points = [
    {
      id: "quality",
      title: "Gate Pass Ready PPE",
      desc: "Conforming to strict BIS, IS & EN safety norms for hassle-free IOCL refinery gate passes.",
      icon: ShieldCheck,
      badge: "Tested Standards"
    },
    {
      id: "service",
      title: "Direct Owner Accountability",
      desc: "Direct guidance with proprietor Raj Singh Tarkar ensures exact specifications and sizing.",
      icon: Headphones,
      badge: "Direct Support"
    },
    {
      id: "local",
      title: "Refinery Main Gate Depot",
      desc: "Located at UP SIDC Complex opposite Mathura Refinery Main Gate for 30–60 min rapid pickup.",
      icon: MapPin,
      badge: "Refinery Hub"
    },
    {
      id: "enquiries",
      title: "100% GST & Pan-India Supply",
      desc: "Genuine tax invoices for full ITC credit. Zero order minimums across all 28 states of India.",
      icon: Truck,
      badge: "GST Invoiced"
    }
  ];

  return (
    <section id="principles" className="py-4 sm:py-6 bg-slate-950 text-white relative overflow-hidden border-t border-b border-slate-800">
      {/* Background accents */}
      <div className="absolute inset-0 industrial-grid-dark opacity-15 pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
        
        {/* Collapsible Dropdown Header Trigger */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full text-left p-3 sm:p-4 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-orange-500/50 transition-all flex items-center justify-between gap-2 sm:gap-4 shadow-md group"
          aria-expanded={isOpen}
        >
          <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg bg-orange-500/15 border border-orange-500/30 text-orange-400 flex items-center justify-center shrink-0 group-hover:bg-orange-500 group-hover:text-slate-950 transition-colors">
              <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-bold text-orange-400 uppercase tracking-wider bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                  Industrial Reliability
                </span>
                <span className="text-[10px] text-slate-400 font-mono hidden xs:inline">
                  Tested Safety Standards
                </span>
              </div>
              <h2 className="text-sm sm:text-base md:text-lg font-black text-white tracking-tight leading-snug break-words mt-0.5">
                Core Supply & Quality Standards
              </h2>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Refinery safety norms, tested quality, personal accountability, and zero-compromise safety standards.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[10px] sm:text-xs font-bold text-slate-200 bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700 whitespace-nowrap">
              {isOpen ? 'Collapse Section' : 'View Standards'}
            </span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 group-hover:text-white">
              {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </div>
        </button>

        {/* Collapsible Content with Compact Smaller Cards */}
        {isOpen && (
          <div className="mt-3 sm:mt-4 space-y-3 animate-in fade-in duration-200">
            
            {/* 4 Compact Mini Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
              {points.map((pt) => {
                const IconComp = pt.icon;
                return (
                  <div
                    key={pt.id}
                    className="bg-slate-900 rounded-xl p-2.5 sm:p-3.5 border border-slate-800 hover:border-orange-500/50 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-slate-800 border border-slate-700 text-orange-400 flex items-center justify-center">
                          <IconComp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </div>
                        <span className="text-[9px] font-bold text-slate-300 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                          {pt.badge}
                        </span>
                      </div>

                      <h3 className="text-xs sm:text-sm font-bold text-white mb-1">
                        {pt.title}
                      </h3>
                      <p className="text-[10px] sm:text-[11px] text-slate-300 leading-relaxed">
                        {pt.desc}
                      </p>
                    </div>

                    <div className="mt-2 pt-1.5 border-t border-slate-800 flex items-center gap-1 text-[9px] sm:text-[10px] text-emerald-400">
                      <CheckCircle2 className="w-3 h-3 shrink-0" />
                      <span>Standard Compliant</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Compact Logistics & Compliance Strip */}
            <div className="p-2.5 sm:p-3 rounded-xl bg-slate-900 border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-2 text-left">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-orange-400 shrink-0" />
                <div className="text-[11px]">
                  <span className="font-bold text-white block">Prompt Regional Delivery</span>
                  <span className="text-[10px] text-slate-400">Express dispatch to Mathura, Agra & Western UP</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-orange-400 shrink-0" />
                <div className="text-[11px]">
                  <span className="font-bold text-white block">Refinery Grade Compliance</span>
                  <span className="text-[10px] text-slate-400">Ready for turnarounds & industrial audits</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-emerald-400 shrink-0" />
                <div className="text-[11px]">
                  <span className="font-bold text-white block">Immediate Replacement</span>
                  <span className="text-[10px] text-slate-400">Rapid turnaround for critical safety gear</span>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>
    </section>
  );
};
