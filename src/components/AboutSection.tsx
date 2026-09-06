import React from 'react';
import { ShieldCheck, Truck, ThumbsUp, Flame, MapPin, User, Check, Phone, ArrowUpRight } from 'lucide-react';
import { COMPANY_INFO } from '../data/companyData';

interface AboutSectionProps {
  onOpenVisitingCard: () => void;
  onOpenQuoteModal: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onOpenVisitingCard, onOpenQuoteModal }) => {
  const pillars = [
    {
      title: "Quality Products",
      desc: "All safety equipment and personal protective gear are thoroughly checked for industrial durability and standard compliance (ISI/EN).",
      icon: ShieldCheck,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
      borderColor: "border-orange-200"
    },
    {
      title: "Reliable Service",
      desc: "Prompt order processing, transparent dispatch schedules, and dependable supply continuity for routine orders or urgent shutdowns.",
      icon: Truck,
      color: "text-blue-600",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-200"
    },
    {
      title: "Customer Satisfaction",
      desc: "Direct communication with proprietor Raj Singh Tarkar ensures tailored recommendations and personalized support for every client.",
      icon: ThumbsUp,
      color: "text-emerald-600",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-200"
    },
    {
      title: "Industrial Safety Focus",
      desc: "Specialized knowledge in workplace hazards, height safety, personal PPE, and industrial material supply for refinery and engineering works.",
      icon: Flame,
      color: "text-red-600",
      bgColor: "bg-red-500/10",
      borderColor: "border-red-200"
    }
  ];

  return (
    <section id="about" className="py-16 md:py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold uppercase tracking-wider mb-3">
            Company Overview
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            About Rajdeep Enterprises
          </h2>
          <div className="w-16 h-1 bg-orange-500 mx-auto mt-4 rounded-full"></div>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Rajdeep Enterprises is a trusted supplier of safety accessories and industrial materials based in Mathura. 
            We are committed to providing quality products that help businesses create safer and more efficient working environments. 
            Our focus is on reliable products, professional service, and customer satisfaction.
          </p>
        </div>

        {/* 2-Column Story & Location Advantage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center mb-16">
          
          {/* Left: Detailed text & Highlights */}
          <div className="lg:col-span-7 space-y-6">
            <h3 className="text-2xl font-bold text-slate-900">
              Serving Mathura's Industrial Core with Unmatched Reliability
            </h3>
            <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
              Strategically situated at <strong className="text-slate-900">15/1, U.P. S.I.D.C. Complex, directly opposite the Refinery Main Gate in Mathura</strong>, 
              Rajdeep Enterprises was established to fulfill the urgent and critical safety accessory requirements of factories, 
              refinery contractors, civil projects, and mechanical workshops.
            </p>
            <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
              Whether you require a single pair of heavy-duty safety shoes, emergency full-body fall harnesses for turnaround shutdowns, 
              traffic cones for site cordoning, or bulk industrial material supplies, we provide prompt sourcing and fair commercial terms.
            </p>

            <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-orange-500 text-white shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">Prime Industrial Location</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    UP SIDC Complex, Refinery Main Gate, Mathura (UP)
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-slate-900 text-white shrink-0">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">Direct Contact Person</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {COMPANY_INFO.contactPerson} • {COMPANY_INFO.displayPhone}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                id="about-visiting-card-btn"
                onClick={onOpenVisitingCard}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold text-slate-900 bg-amber-400 hover:bg-amber-300 transition shadow-sm"
              >
                <span>View Official Visiting Card</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
              <button
                id="about-quote-btn"
                onClick={onOpenQuoteModal}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 transition"
              >
                <span>Request Company Quotation</span>
              </button>
            </div>
          </div>

          {/* Right: Authentic Visiting Card Showcase Card */}
          <div className="lg:col-span-5">
            <div className="relative p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white shadow-xl border-2 border-slate-700">
              
              {/* Card Header */}
              <div className="flex justify-between items-start border-b border-slate-700/80 pb-4 mb-5">
                <div>
                  <div className="text-xs text-orange-400 font-bold uppercase tracking-widest">
                    Proprietor
                  </div>
                  <div className="text-xl font-black text-white tracking-tight">
                    {COMPANY_INFO.contactPerson}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-400 font-mono">Contact Number</div>
                  <a
                    href={`tel:${COMPANY_INFO.phone}`}
                    className="text-base font-black text-amber-400 hover:text-amber-300 transition"
                  >
                    {COMPANY_INFO.phone}
                  </a>
                </div>
              </div>

              {/* Main Brand Title on Card */}
              <div className="my-4 text-center py-2 bg-slate-800/60 rounded-xl border border-slate-700">
                <div className="text-2xl sm:text-3xl font-black tracking-tight text-white drop-shadow">
                  <span className="text-orange-500">Rajdeep</span> Enterprises
                </div>
                <div className="text-xs sm:text-sm font-medium text-amber-300 mt-1">
                  All Kinds of Safety Accessories & All Types of Material Suppliers
                </div>
              </div>

              {/* Email & Address Details matching the photo */}
              <div className="space-y-2 text-xs sm:text-sm text-slate-300 pt-2">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 font-semibold">Email:</span>
                  <a href={`mailto:${COMPANY_INFO.email}`} className="text-orange-400 hover:underline">
                    {COMPANY_INFO.email}
                  </a>
                </div>
                <div className="flex items-start gap-2 pt-1">
                  <span className="text-slate-400 font-semibold shrink-0">Add.:-</span>
                  <span className="text-slate-200">
                    {COMPANY_INFO.address}
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-700/80 flex items-center justify-between text-xs">
                <span className="text-slate-400">Authentic Business Record</span>
                <button
                  onClick={onOpenVisitingCard}
                  className="text-orange-400 hover:text-orange-300 font-semibold flex items-center gap-1"
                >
                  Inspect Full Card &rarr;
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* 4 Pillars Section */}
        <div className="pt-4">
          <div className="text-center mb-8">
            <h3 className="text-xl font-extrabold text-slate-900 uppercase tracking-wider">
              Core Principles Guiding Our Supply
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {pillars.map((pillar) => {
              const IconComp = pillar.icon;
              return (
                <div
                  key={pillar.title}
                  className={`p-6 rounded-xl bg-slate-50/80 border ${pillar.borderColor} hover:shadow-md transition-all group`}
                >
                  <div className={`w-12 h-12 rounded-xl ${pillar.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <IconComp className={`w-6 h-6 ${pillar.color}`} />
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 mb-2">
                    {pillar.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
