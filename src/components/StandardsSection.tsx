import React, { useState } from 'react';
import { ShieldCheck, Award, FileCheck, CheckCircle2, Search, ExternalLink } from 'lucide-react';
import { COMPLIANCE_STANDARDS } from '../data/extraData';
import { Language } from '../types';
import { TRANSLATIONS } from '../data/extraData';

interface StandardsSectionProps {
  lang: Language;
  onEnquire: (query: string) => void;
}

export const StandardsSection: React.FC<StandardsSectionProps> = ({ lang, onEnquire }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const t = TRANSLATIONS[lang];

  const categories = ['All', 'Head Protection', 'Foot Protection', 'Fall Protection', 'Eye & Face Protection', 'Hand Protection', 'Road & Traffic Safety'];

  const filtered = selectedCategory === 'All'
    ? COMPLIANCE_STANDARDS
    : COMPLIANCE_STANDARDS.filter((s) => s.category === selectedCategory);

  return (
    <section id="standards" className="py-16 md:py-20 bg-slate-900 text-white relative border-t border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3 border border-emerald-500/30">
            <Award className="w-3.5 h-3.5" />
            <span>Industrial Compliance & Approvals</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            {t.standardsTitle}
          </h2>
          <div className="w-16 h-1 bg-orange-500 mx-auto mt-4 rounded-full"></div>
          <p className="mt-4 text-sm sm:text-base text-slate-400">
            {t.standardsSubtitle}
          </p>
        </div>

        {/* Category Selector Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedCategory === cat
                  ? 'bg-orange-600 text-white shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Standards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((std, idx) => (
            <div
              key={idx}
              className="bg-slate-800/90 rounded-2xl p-6 border border-slate-700/80 hover:border-orange-500/80 transition-all duration-300 flex flex-col justify-between group shadow-lg"
            >
              <div>
                {/* Standard Code & Body */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <span className="px-2.5 py-1 rounded-md text-xs font-black bg-orange-500/20 text-orange-400 border border-orange-500/30 font-mono">
                    {std.code}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-400 bg-slate-900 px-2 py-0.5 rounded">
                    {std.category}
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-white mb-1 group-hover:text-amber-400 transition-colors">
                  {std.name}
                </h3>
                <div className="text-xs text-slate-400 font-medium mb-3">
                  Issuing Authority: <strong className="text-slate-300">{std.issuingBody}</strong>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  {std.description}
                </p>

                {/* Applicable Products */}
                <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 mb-4 space-y-1.5">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Supplied Products Complying:
                  </div>
                  {std.applicableProducts.map((p, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-emerald-300 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{p}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Significance footer */}
              <div className="pt-3 border-t border-slate-700/60 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 italic">
                  {std.significance}
                </span>
                <button
                  onClick={() => onEnquire(`Compliance Enquiry: ${std.code} - ${std.name}`)}
                  className="text-xs text-orange-400 hover:text-orange-300 font-bold shrink-0 ml-2"
                >
                  Verify
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Banner */}
        <div className="mt-12 bg-slate-950 p-6 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-600/20 text-orange-400 flex items-center justify-center shrink-0 border border-orange-500/30">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Need Batch Test Certificates for Plant Gate Pass?</h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Rajdeep Enterprises provides manufacturer batch test reports & compliance documents on quotation / order.
              </p>
            </div>
          </div>
          <button
            onClick={() => onEnquire('Requesting Batch Test Certificates and Compliance Documents')}
            className="px-4 py-2 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold shrink-0 transition"
          >
            Request Documentation
          </button>
        </div>

      </div>
    </section>
  );
};
