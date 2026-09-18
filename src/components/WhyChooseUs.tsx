import React, { useState } from 'react';
import { ShieldCheck, Headphones, MapPin, MessageSquare, CheckCircle2, Clock, Truck, Award, ChevronDown, ChevronUp } from 'lucide-react';
import { COMPANY_INFO } from '../data/companyData';

interface WhyChooseUsProps {
  onOpenQuoteModal: () => void;
}

export const WhyChooseUs: React.FC<WhyChooseUsProps> = ({ onOpenQuoteModal }) => {
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
    <section id="principles" className="py-10 sm:py-14 md:py-16 bg-slate-950 text-white relative overflow-hidden border-t border-b border-slate-800">
      {/* Background accents */}
      <div className="absolute inset-0 industrial-grid-dark opacity-15 pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-orange-400 text-xs font-bold uppercase tracking-wider mb-2.5">
            <ShieldCheck className="w-3.5 h-3.5 text-orange-400" />
            <span>Core Standards & Reliability</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
            Why Choose Rajdeep Enterprises
          </h2>
          <div className="w-16 h-1 bg-orange-600 mx-auto mt-3 rounded-full"></div>
          <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed">
            Refinery safety norms, tested quality, personal proprietor accountability, and zero-compromise supply reliability.
          </p>
        </div>

        {/* 4 Cards: 1-col on mobile (< sm), 2-col on tablet (sm), 4-col on desktop (lg) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {points.map((pt) => {
            const IconComp = pt.icon;
            return (
              <div
                key={pt.id}
                className="bg-slate-900/90 rounded-2xl p-4 sm:p-5 border border-slate-800 hover:border-orange-500/50 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 text-orange-400 flex items-center justify-center">
                      <IconComp className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-300 bg-slate-950 px-2 py-0.5 rounded-full border border-slate-800">
                      {pt.badge}
                    </span>
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-white mb-1.5">
                    {pt.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {pt.desc}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>Standard Compliant</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Compact Logistics & Compliance Strip */}
        <div className="mt-4 sm:mt-6 p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-left">
          <div className="flex items-start gap-3">
            <Truck className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-bold text-white block">Prompt Regional Delivery</span>
              <span className="text-slate-400 mt-0.5 block leading-snug">Express dispatch to Mathura, Agra & Western UP</span>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Award className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-bold text-white block">Refinery Grade Compliance</span>
              <span className="text-slate-400 mt-0.5 block leading-snug">Ready for turnarounds & industrial audits</span>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-bold text-white block">Immediate Replacement</span>
              <span className="text-slate-400 mt-0.5 block leading-snug">Rapid turnaround for critical safety gear</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

