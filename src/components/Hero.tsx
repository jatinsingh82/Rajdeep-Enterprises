import React from 'react';
import { ArrowRight, Phone, ShieldCheck, MapPin, CheckCircle, Sparkles, Building, HardHat, FileText } from 'lucide-react';
import { COMPANY_INFO } from '../data/companyData';

interface HeroProps {
  onOpenQuoteModal: (productName?: string) => void;
  onOpenVisitingCard: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenQuoteModal, onOpenVisitingCard }) => {
  return (
    <section id="home" className="relative overflow-hidden bg-slate-900 text-white pt-10 pb-16 md:py-20 lg:py-24">
      {/* Background industrial overlay & grid */}
      <div className="absolute inset-0 industrial-grid-dark opacity-30 pointer-events-none"></div>
      
      {/* Subtle safety accent gradient glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-orange-600/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Top safety stripe bar */}
      <div className="absolute top-0 left-0 right-0 h-1.5 hazard-stripe-light opacity-90"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Headings & Action buttons */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Location & Pan-India Trust Pill */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/90 border border-slate-700 text-xs font-semibold text-slate-200 shadow-sm backdrop-blur-sm">
                <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping"></span>
                <MapPin className="w-3.5 h-3.5 text-orange-400" />
                <span className="text-orange-300 font-bold">Mathura, UP</span>
                <span className="text-slate-500">•</span>
                <span className="text-slate-300">Refinery Main Gate Hub</span>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-600/50 text-emerald-300 text-xs font-bold shadow-sm">
                <span>🇮🇳 Supplying Whole India Everywhere</span>
              </div>
            </div>

            {/* Main Heading */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              {COMPANY_INFO.heroHeading}
            </h1>

            {/* Tagline / Subtitle */}
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl font-normal leading-relaxed">
              We supply safety accessories, welding consumables, Champion gaskets, site registers, stationery, tools, and industrial materials across the <strong className="text-white">whole of India everywhere</strong>. Order <strong className="text-amber-300">any quantity you want</strong> — with zero order limits. Need <strong className="text-orange-400">anything extra</strong> not in our catalogue? Contact us directly and we will source it for you immediately.
            </p>

            {/* Key Value Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs sm:text-sm text-slate-200">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span><strong className="text-white">Whole India Delivery:</strong> Dispatched to every state & pin code</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-amber-400 shrink-0" />
                <span><strong className="text-white">Any Quantity Supplied:</strong> Small samples to mega bulk</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-orange-400 shrink-0" />
                <span><strong className="text-white">Custom Extra Items:</strong> Contact us for on-demand sourcing</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-blue-400 shrink-0" />
                <span><strong className="text-white">Refinery Standard:</strong> BIS & EN certified PPE and gear</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-3">
              <a
                id="hero-explore-products-btn"
                href="#products"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 shadow-lg shadow-orange-600/30 transition-all transform active:scale-95"
              >
                <span>Explore Products</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                id="hero-pan-india-btn"
                href="#pan-india"
                className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-bold text-xs sm:text-sm text-amber-300 bg-slate-800 hover:bg-slate-700 border border-amber-500/50 hover:border-amber-400 transition-all active:scale-95"
              >
                <span>🇮🇳 Pan-India Supply & Extra Items</span>
              </a>

              <a
                id="hero-call-now-btn"
                href={`tel:${COMPANY_INFO.phone}`}
                className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-bold text-xs sm:text-sm text-slate-950 bg-amber-400 hover:bg-amber-300 transition-all shadow-md active:scale-95"
              >
                <Phone className="w-4 h-4 text-slate-950" />
                <span>Call {COMPANY_INFO.displayPhone}</span>
              </a>
            </div>

            {/* Quick Visiting Card badge trigger */}
            <div className="pt-2">
              <button
                id="hero-visiting-card-trigger"
                onClick={onOpenVisitingCard}
                className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-amber-400 transition-colors"
              >
                <FileText className="w-4 h-4 text-orange-400" />
                <span className="underline decoration-dotted underline-offset-4">
                  View Reference Visiting Card & Contact Information
                </span>
                <span className="bg-slate-800 text-[10px] px-2 py-0.5 rounded text-slate-300 border border-slate-700">Official</span>
              </button>
            </div>
          </div>

          {/* Right Column: Visual Industrial Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Main Image with border and safety accent */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-slate-700 bg-slate-800 group">
                <img
                  src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1000&q=80"
                  alt="Industrial worker equipped with certified safety helmet and PPE equipment"
                  className="w-full h-80 sm:h-96 object-cover object-center group-hover:scale-105 transition-transform duration-700 brightness-90 contrast-105"
                  loading="eager"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>

                {/* Overlaid Product Badges mimicking the photo's items */}
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-700/80 text-left">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-orange-400 uppercase tracking-wider flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4" />
                      Industrial Grade Certified
                    </span>
                    <span className="text-[11px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">
                      Mathura Hub
                    </span>
                  </div>
                  <h3 className="font-bold text-sm sm:text-base text-white">
                    Safety PPE • Welding & NDT • Gaskets • Tools • Stationery
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Supplying verified PPE, fabrication consumables, and site office materials right at the Refinery Main Gate, Mathura.
                  </p>
                </div>
              </div>

              {/* Floating Floating Stat Box 1 */}
              <div className="absolute -top-4 -left-4 sm:-left-6 bg-slate-800/95 border border-slate-700 p-3.5 rounded-xl shadow-xl flex items-center gap-3 backdrop-blur-sm">
                <div className="w-10 h-10 rounded-lg bg-orange-600/20 text-orange-400 flex items-center justify-center border border-orange-500/30">
                  <HardHat className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Full Safety Gear</div>
                  <div className="text-[11px] text-slate-400">IS & EN Standard Certified</div>
                </div>
              </div>

              {/* Floating Stat Box 2 */}
              <div className="absolute -bottom-4 -right-2 sm:-right-4 bg-slate-800/95 border border-slate-700 p-3.5 rounded-xl shadow-xl flex items-center gap-3 backdrop-blur-sm">
                <div className="w-10 h-10 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
                  <Building className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">UP SIDC Complex</div>
                  <div className="text-[11px] text-slate-400">Refinery Main Gate, Mathura</div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
