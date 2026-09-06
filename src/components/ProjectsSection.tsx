import React from 'react';
import { Briefcase, Building2, MapPin, CheckCircle2, ArrowRight, Shield } from 'lucide-react';
import { PROJECT_EXPERIENCES, TRANSLATIONS } from '../data/extraData';
import { Language } from '../types';

interface ProjectsSectionProps {
  lang: Language;
  onEnquire: (query: string) => void;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ lang, onEnquire }) => {
  const t = TRANSLATIONS[lang];

  return (
    <section id="projects" className="py-16 md:py-20 bg-slate-50 relative border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-bold uppercase tracking-wider mb-3">
            <Briefcase className="w-3.5 h-3.5 text-orange-600" />
            <span>Industrial Track Record</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            {t.projectsTitle}
          </h2>
          <div className="w-16 h-1 bg-orange-500 mx-auto mt-4 rounded-full"></div>
          <p className="mt-4 text-sm sm:text-base text-slate-600">
            {t.projectsSubtitle}
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {PROJECT_EXPERIENCES.map((proj) => (
            <div
              key={proj.id}
              className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 hover:border-orange-400 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-slate-100 text-slate-700">
                    {proj.clientType}
                  </span>
                  <span className="text-[11px] font-semibold text-orange-600">
                    {proj.timeline}
                  </span>
                </div>

                <h3 className="text-lg sm:text-xl font-black text-slate-900 leading-snug mb-2">
                  {proj.projectTitle}
                </h3>

                <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-4">
                  <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                  <span>{proj.location}</span>
                </div>

                {/* Supplies Provided */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 mb-4 space-y-2">
                  <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-700">
                    Key Materials & Safety Gear Supplied:
                  </div>
                  <ul className="space-y-1.5">
                    {proj.suppliesProvided.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Delivery Highlights & CTA */}
              <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="text-xs text-slate-600 italic">
                  <strong>Key Advantage:</strong> {proj.highlights}
                </div>
                <button
                  onClick={() => onEnquire(`Supply Enquiry for Project Type: ${proj.projectTitle}`)}
                  className="inline-flex items-center gap-1 text-xs font-bold text-orange-600 hover:text-orange-700 transition shrink-0"
                >
                  <span>Similar Supply</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
