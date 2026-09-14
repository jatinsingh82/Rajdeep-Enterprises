import React from 'react';
import { ArrowRight, Phone, ShieldCheck, MapPin, CheckCircle, Building, HardHat, FileText, UserCheck, Store } from 'lucide-react';
import { COMPANY_INFO } from '../data/companyData';
import { useOwnerPhoto } from '../hooks/useOwnerPhoto';

interface HeroProps {
  onOpenQuoteModal: (productName?: string) => void;
  onOpenVisitingCard: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenQuoteModal, onOpenVisitingCard }) => {
  const { photoUrl } = useOwnerPhoto();

  return (
    <section id="home" className="relative overflow-hidden bg-[#071324] text-white pt-3 sm:pt-6 pb-6 sm:pb-10 md:py-14 lg:py-16">
      {/* Background industrial overlay & grid */}
      <div className="absolute inset-0 industrial-grid-dark opacity-25 pointer-events-none"></div>
      
      {/* Subtle safety accent gradient glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Top safety stripe bar */}
      <div className="absolute top-0 left-0 right-0 h-1 hazard-stripe-light opacity-90"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile View: Specifically structured for mobile phones (lg:hidden) */}
        <div className="lg:hidden space-y-4 mb-2 text-left">
          
          {/* 1. Small Badge / Tag */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 border border-sky-400/40 text-sky-300 text-xs font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Industrial Safety & Material Supplier • Mathura</span>
          </div>

          {/* 2. Responsive Heading with clamp() */}
          <h1 className="text-[clamp(1.65rem,6.5vw,2.25rem)] font-black text-white tracking-tight leading-[1.2]">
            Industrial Safety & Material Supplies in Mathura
          </h1>

          {/* 3. Short Description (16px body) */}
          <p className="text-base text-slate-300 leading-relaxed">
            Rajdeep Enterprises supplies certified safety PPE, welding consumables, Champion gaskets, hardware, and site materials. Direct counter pickup at Mathura Refinery Gate with reliable dispatch across all 28 states of India.
          </p>

          {/* 4. Primary CTA Buttons (Consistent min-h-[44px] touch targets & border radius) */}
          <div className="flex flex-col gap-2.5 pt-1">
            {/* View Products Button - Full Width */}
            <a
              id="mobile-hero-view-products-btn"
              href="#products"
              className="min-h-[44px] w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-500 active:bg-blue-700 shadow-md transition text-center"
            >
              <span>View Products Catalogue</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            {/* Secondary High-Intent CTAs: 2-Column Grid */}
            <div className="grid grid-cols-2 gap-2">
              {/* WhatsApp Us Button */}
              <a
                id="mobile-hero-whatsapp-btn"
                href={`https://wa.me/${COMPANY_INFO.whatsappNumber}?text=Hello%20Rajdeep%20Enterprises,%20I%20need%20a%20quotation%20for%20safety%20materials`}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[44px] flex items-center justify-center gap-1.5 py-3 px-2 rounded-xl font-extrabold text-xs sm:text-sm text-white bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 shadow transition text-center"
              >
                <span className="text-sm">💬</span>
                <span className="whitespace-nowrap">WhatsApp Us</span>
              </a>

              {/* Call Now Button */}
              <a
                id="mobile-hero-call-btn"
                href={`tel:${COMPANY_INFO.phone}`}
                className="min-h-[44px] flex items-center justify-center gap-1.5 py-3 px-2 rounded-xl font-extrabold text-xs sm:text-sm text-slate-950 bg-amber-400 hover:bg-amber-500 active:bg-amber-600 shadow transition text-center"
              >
                <Phone className="w-3.5 h-3.5 text-slate-950 shrink-0" />
                <span className="whitespace-nowrap">Call Now</span>
              </a>
            </div>

            {/* Request Quote Button */}
            <button
              type="button"
              id="mobile-hero-quote-btn"
              onClick={() => onOpenQuoteModal()}
              className="min-h-[44px] w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-bold text-xs text-slate-200 bg-slate-900/90 hover:bg-slate-800 border border-slate-700 transition text-center"
            >
              <FileText className="w-3.5 h-3.5 text-sky-400" />
              <span>Request Custom Quotation</span>
            </button>
          </div>

          {/* Quick Trust Badges on Mobile */}
          <div className="grid grid-cols-2 gap-2 pt-1 text-[11px] text-slate-300">
            <div className="flex items-center gap-1.5 p-2 rounded-lg bg-slate-900/70 border border-slate-800">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="font-semibold">Gate Pass Ready</span>
            </div>
            <div className="flex items-center gap-1.5 p-2 rounded-lg bg-slate-900/70 border border-slate-800">
              <CheckCircle className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              <span className="font-semibold">100% GST Invoiced</span>
            </div>
            <div className="flex items-center gap-1.5 p-2 rounded-lg bg-slate-900/70 border border-slate-800">
              <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="font-semibold">Mathura Gate Depot</span>
            </div>
            <div className="flex items-center gap-1.5 p-2 rounded-lg bg-slate-900/70 border border-slate-800">
              <Building className="w-3.5 h-3.5 text-orange-400 shrink-0" />
              <span className="font-semibold">Pan-India Dispatch</span>
            </div>
          </div>

          {/* 5. Authentic business/shop image - clean display with no upload/change option */}
          <div className="rounded-xl overflow-hidden bg-slate-900 border border-slate-800 shadow-lg mt-3">
            <div className="w-full bg-slate-950 flex flex-col items-center justify-center overflow-hidden">
              <img
                src={photoUrl}
                alt="Rajdeep Enterprises Storefront and Proprietor at Mathura Refinery Main Gate"
                className="w-full h-auto max-h-[240px] sm:max-h-[280px] object-contain block mx-auto"
                loading="eager"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Clean Caption below photo */}
            <div className="p-2.5 bg-slate-900/95 border-t border-slate-800 flex items-center justify-between text-xs gap-2">
              <div className="flex items-center gap-1.5 text-slate-300 font-medium min-w-0">
                <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <span className="leading-snug break-words">Rajdeep Enterprises • Mathura Refinery Gate</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-700/50 shrink-0">
                Verified Store
              </span>
            </div>
          </div>

        </div>

        {/* Desktop View: Full 2-column layout (hidden on mobile, shown on lg+) */}
        <div className="hidden lg:grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Headings & Action buttons */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Location & Pan-India Trust Pill */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-700 text-xs font-semibold text-slate-200 shadow-sm backdrop-blur-sm">
                <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping"></span>
                <MapPin className="w-3.5 h-3.5 text-sky-400" />
                <span className="text-sky-300 font-bold">Mathura, UP</span>
                <span className="text-slate-500">•</span>
                <span className="text-slate-300">Refinery Main Gate Hub</span>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-950/80 border border-sky-500/50 text-sky-300 text-xs font-bold shadow-sm">
                <UserCheck className="w-3.5 h-3.5 text-sky-400" />
                <span>Proprietor: {COMPANY_INFO.contactPerson}</span>
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
              We supply safety accessories, welding consumables, Champion gaskets, site registers, stationery, tools, and industrial materials across the <strong className="text-white">whole of India everywhere</strong>. Order <strong className="text-sky-300">any quantity you want</strong> — with zero order limits. Need <strong className="text-orange-400">anything extra</strong> not in our catalogue? Contact proprietor <strong className="text-sky-300">{COMPANY_INFO.contactPerson}</strong> directly and we will source it for you immediately.
            </p>

            {/* Key Value Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs sm:text-sm text-slate-200">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span><strong className="text-white">Whole India Delivery:</strong> Dispatched to every state & pin code</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-sky-400 shrink-0" />
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

            {/* Action Buttons with clear CTA hierarchy */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              {/* Primary CTA */}
              <a
                id="hero-explore-products-btn"
                href="#products"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/30 transition-all transform active:scale-95 min-h-[44px]"
              >
                <span>View Products Catalogue</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              {/* High Intent WhatsApp CTA */}
              <a
                id="hero-whatsapp-btn"
                href={`https://wa.me/${COMPANY_INFO.whatsappNumber}?text=Hello%20Rajdeep%20Enterprises,%20I%20need%20a%20quotation%20for%20safety%20materials`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-extrabold text-sm text-white bg-emerald-600 hover:bg-emerald-500 shadow-md transition-all active:scale-95 min-h-[44px]"
              >
                <span className="text-base">💬</span>
                <span>WhatsApp Us</span>
              </a>

              {/* High Intent Call CTA */}
              <a
                id="hero-call-now-btn"
                href={`tel:${COMPANY_INFO.phone}`}
                className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-extrabold text-sm text-slate-950 bg-amber-400 hover:bg-amber-300 transition-all shadow-md active:scale-95 min-h-[44px]"
              >
                <Phone className="w-4 h-4 text-slate-950" />
                <span>Call {COMPANY_INFO.displayPhone}</span>
              </a>

              {/* Request Custom Quote CTA */}
              <button
                type="button"
                id="hero-quote-modal-btn"
                onClick={() => onOpenQuoteModal()}
                className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-sm text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-slate-500 transition-all active:scale-95 min-h-[44px]"
              >
                <FileText className="w-4 h-4 text-sky-400" />
                <span>Request Custom Quote</span>
              </button>
            </div>

            {/* Quick Visiting Card badge trigger */}
            <div className="pt-2">
              <button
                id="hero-visiting-card-trigger"
                onClick={onOpenVisitingCard}
                className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-sky-300 transition-colors"
              >
                <FileText className="w-4 h-4 text-sky-400" />
                <span className="underline decoration-dotted underline-offset-4">
                  View Reference Visiting Card & Contact Information
                </span>
                <span className="bg-slate-800 text-[10px] px-2 py-0.5 rounded text-slate-300 border border-slate-700">Official</span>
              </button>
            </div>
          </div>

          {/* Right Column: Verified Shop & Owner Front Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Main Storefront & Owner Image Card - Clean display without change/upload UI */}
              <div className="rounded-2xl overflow-hidden shadow-2xl border-2 border-sky-500/40 bg-slate-950 flex flex-col">
                <div className="w-full flex flex-col items-center justify-center bg-slate-950 overflow-hidden">
                  <img
                    src={photoUrl}
                    alt="Shop owner Raj Singh Tarkar standing outside Rajdeep Enterprises store at UP SIDC Complex Refinery Main Gate Mathura"
                    className="w-full h-auto max-h-[520px] object-contain block"
                    loading="eager"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Information Card - Cleanly beneath the photo */}
                <div className="p-4 bg-slate-900 border-t border-slate-800 text-left">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div>
                      <div className="text-[10px] font-bold text-sky-400 uppercase tracking-widest flex items-center gap-1">
                        <Store className="w-3.5 h-3.5 text-sky-400" />
                        <span>Shop Owner & Proprietor</span>
                      </div>
                      <div className="text-lg font-black text-white leading-tight mt-0.5">
                        {COMPANY_INFO.contactPerson}
                      </div>
                    </div>
                    <a
                      href={`tel:${COMPANY_INFO.phone}`}
                      className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold shadow-md transition transform active:scale-95"
                      title="Call Owner Directly"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call Direct</span>
                    </a>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-slate-300 font-medium">
                    <span className="text-sky-300 font-bold">Rajdeep Enterprises Store</span>
                    <span className="text-slate-500">•</span>
                    <span className="text-slate-300 truncate">15/1, U.P.S.I.D.C. Complex</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                    Refinery Main Gate, Mathura • Safety Accessories, Welding Gear, Champion Gaskets, Tools & Site Stationery
                  </p>
                </div>
              </div>

              {/* Floating Stat Box 1 - Top Left */}
              <div className="absolute -top-3 -left-3 sm:-left-5 bg-slate-900/95 border border-slate-700/90 p-3 rounded-xl shadow-xl flex items-center gap-2.5 backdrop-blur-md hidden sm:flex z-10">
                <div className="w-9 h-9 rounded-lg bg-blue-600/20 text-sky-400 flex items-center justify-center border border-blue-500/30">
                  <HardHat className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Genuine Physical Store</div>
                  <div className="text-[10px] text-slate-400">100% In-Stock Goods</div>
                </div>
              </div>

              {/* Floating Stat Box 2 - Bottom Right */}
              <div className="absolute -bottom-3 -right-2 sm:-right-4 bg-slate-900/95 border border-slate-700/90 p-3 rounded-xl shadow-xl flex items-center gap-2.5 backdrop-blur-md hidden sm:flex z-10">
                <div className="w-9 h-9 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center border border-sky-500/30">
                  <Building className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Direct Counter Supply</div>
                  <div className="text-[10px] text-slate-400">Refinery Main Gate, Mathura</div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
