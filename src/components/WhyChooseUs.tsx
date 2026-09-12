import React from 'react';
import { ShieldCheck, Headphones, MapPin, MessageSquare, CheckCircle2, Clock, Truck, Award } from 'lucide-react';
import { COMPANY_INFO } from '../data/companyData';

interface WhyChooseUsProps {
  onOpenQuoteModal: () => void;
}

export const WhyChooseUs: React.FC<WhyChooseUsProps> = ({ onOpenQuoteModal }) => {
  const points = [
    {
      id: "quality",
      title: "Quality Products",
      desc: "Reliable safety accessories and materials for industrial requirements. We source tested products meeting stringent workplace safety standards.",
      icon: ShieldCheck,
      badge: "Certified Standards"
    },
    {
      id: "service",
      title: "Customer-Focused Service",
      desc: "Professional assistance to help customers find suitable products. Direct consultation with Raj Singh Tarkar ensures accurate sizing and specs.",
      icon: Headphones,
      badge: "Direct Support"
    },
    {
      id: "local",
      title: "Trusted Local Supplier",
      desc: "Serving customers from Mathura and surrounding industrial areas. Located at UP SIDC Complex, Refinery Main Gate for rapid local dispatch.",
      icon: MapPin,
      badge: "Refinery Hub"
    },
    {
      id: "enquiries",
      title: "Easy Enquiries",
      desc: "Quick and convenient communication through phone, email, WhatsApp, and contact forms. No lengthy procurement bottlenecks.",
      icon: MessageSquare,
      badge: "Instant Response"
    }
  ];

  return (
    <section id="principles" className="py-16 md:py-24 bg-slate-950 text-white relative overflow-hidden border-t border-slate-800">
      {/* Background accents */}
      <div className="absolute inset-0 industrial-grid-dark opacity-20 pointer-events-none"></div>
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/80 border border-blue-800 text-sky-400 text-xs font-bold uppercase tracking-wider mb-3">
            Foundational Reliability
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Core Principles Guiding Our Supply
          </h2>
          <div className="w-16 h-1 bg-sky-500 mx-auto mt-4 rounded-full"></div>
          <p className="mt-4 text-base text-slate-300">
            Backed by deep technical knowledge of refinery safety norms and located right at Mathura Refinery Main Gate, we uphold strict standards of product integrity, personal accountability, and zero-compromise safety.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {points.map((pt, idx) => {
            const IconComp = pt.icon;
            return (
              <div
                key={pt.id}
                className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800 hover:border-sky-500 transition-all duration-300 hover:-translate-y-1 shadow-lg flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-sky-500/15 border border-sky-500/30 text-sky-400 flex items-center justify-center group-hover:bg-sky-500 group-hover:text-slate-950 transition-colors">
                      <IconComp className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold text-sky-300 bg-slate-950 px-2 py-0.5 rounded border border-sky-800/60">
                      {pt.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-sky-300 transition-colors">
                    {pt.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {pt.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center gap-1.5 text-xs text-slate-400">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Guaranteed Commitment</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Local Logistics & Compliance Strip */}
        <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
          <div className="flex items-center gap-3">
            <Truck className="w-8 h-8 text-sky-400 shrink-0 mx-auto md:mx-0" />
            <div>
              <div className="text-sm font-bold text-white">Prompt Regional Delivery</div>
              <div className="text-xs text-slate-400">Express dispatch to Mathura, Agra & Western UP</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Award className="w-8 h-8 text-sky-400 shrink-0 mx-auto md:mx-0" />
            <div>
              <div className="text-sm font-bold text-white">Refinery Grade Compliance</div>
              <div className="text-xs text-slate-400">Products ready for turnaround and industrial tenders</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="w-8 h-8 text-emerald-400 shrink-0 mx-auto md:mx-0" />
            <div>
              <div className="text-sm font-bold text-white">Immediate Supply Availability</div>
              <div className="text-xs text-slate-400">Quick turnaround for critical replacement gear</div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
