import React from 'react';
import { Star, Quote, CheckCircle2, Building, MapPin, Calendar } from 'lucide-react';
import { TESTIMONIALS_DATA } from '../data/tradeKitsData';

interface TestimonialsSectionProps {
  onOpenQuoteModal: (productName?: string) => void;
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({
  onOpenQuoteModal
}) => {
  return (
    <section id="testimonials" className="py-16 md:py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100 border border-orange-200 text-orange-800 text-xs font-bold uppercase tracking-wider mb-3">
            <Quote className="w-3.5 h-3.5 text-orange-600" />
            <span>Proven Industrial Track Record</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
            Verified Contractor & Project Client Feedback
          </h2>
          <div className="w-20 h-1 bg-orange-500 mx-auto mt-4 rounded-full"></div>
          <p className="mt-4 text-sm sm:text-base text-slate-600 leading-relaxed">
            Read firsthand testimonials from plant managers, turnaround contractors, and infrastructure safety officers who rely on Rajdeep Enterprises for zero-compromise safety supplies.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {TESTIMONIALS_DATA.map((t) => (
            <div
              key={t.id}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden"
            >
              <div className="absolute top-6 right-6 text-slate-100 -z-0">
                <Quote className="w-16 h-16 opacity-30 text-slate-400" />
              </div>

              <div className="relative z-10 space-y-4">
                {/* Rating & Verified Tag */}
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-1">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>

                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{t.verifiedBadge}</span>
                  </span>
                </div>

                {/* Project Context Badge */}
                <div className="inline-block bg-slate-100 text-slate-800 text-xs font-bold px-3 py-1 rounded-lg border border-slate-200">
                  {t.projectContext}
                </div>

                {/* Quote Body */}
                <p className="text-slate-700 text-xs sm:text-sm leading-relaxed italic">
                  "{t.quote}"
                </p>
              </div>

              {/* Author & Company Meta */}
              <div className="relative z-10 pt-4 mt-6 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <h4 className="font-black text-slate-900 text-sm">
                    {t.clientName}
                  </h4>
                  <p className="text-xs text-orange-600 font-semibold">
                    {t.designation}
                  </p>
                  <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                    <Building className="w-3 h-3 text-slate-400" />
                    <span>{t.company}</span>
                  </p>
                </div>

                <div className="text-right text-[11px] text-slate-400">
                  <span className="flex items-center gap-1 justify-end font-medium text-slate-500">
                    <MapPin className="w-3 h-3 text-orange-400" />
                    <span>{t.location}</span>
                  </span>
                  <span className="flex items-center gap-1 justify-end mt-0.5 font-mono text-[10px]">
                    <Calendar className="w-3 h-3 text-slate-300" />
                    <span>{t.date}</span>
                  </span>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* Bottom CTA for new contractors */}
        <div className="mt-10 p-6 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="font-black text-base text-white">
              Are you bidding on or managing a project site?
            </h4>
            <p className="text-xs text-slate-300 mt-0.5">
              Get corporate credit terms, sample test pieces, and guaranteed gate clearance compliance.
            </p>
          </div>

          <button
            onClick={() => onOpenQuoteModal('Contractor Supply Registration / RFQ')}
            className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-black text-xs uppercase tracking-wider transition shadow-md whitespace-nowrap"
          >
            Register as Contractor Buyer
          </button>
        </div>

      </div>
    </section>
  );
};
