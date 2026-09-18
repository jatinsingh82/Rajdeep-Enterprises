import React from 'react';
import { ArrowRight, Phone, ShieldCheck, MapPin, CheckCircle, Building, FileText, UserCheck, Store, Truck, MessageSquare, Eye } from 'lucide-react';
import { COMPANY_INFO } from '../data/companyData';
import { trackCallClick, trackWhatsAppClick, trackCustomQuoteClick } from '../utils/analytics';

interface HeroProps {
  onOpenQuoteModal: (productName?: string) => void;
  onOpenVisitingCard: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenQuoteModal, onOpenVisitingCard }) => {
  return (
    <section id="home" className="relative overflow-hidden bg-[#071324] text-white pt-5 sm:pt-8 pb-8 sm:pb-12 md:py-14 lg:py-16">
      {/* Background industrial overlay & grid */}
      <div className="absolute inset-0 industrial-grid-dark opacity-15 pointer-events-none"></div>

      {/* Top safety stripe bar */}
      <div className="absolute top-0 left-0 right-0 h-1 hazard-stripe-light opacity-90"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile View: Specifically structured for mobile phones (lg:hidden) */}
        <div className="lg:hidden space-y-4 text-left">
          
          {/* 1. Small Badge / Tag */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-700/80 text-sky-300 text-xs font-bold shadow-2xs">
            <ShieldCheck className="w-3.5 h-3.5 text-orange-500 shrink-0" />
            <span>Industrial Safety & Material Supplier • Mathura</span>
          </div>

          {/* 2. Responsive Heading with clamp() */}
          <h1 className="text-[clamp(1.5rem,5.8vw,2.15rem)] font-black text-white tracking-tight leading-[1.22]">
            Industrial Safety PPE, Site Stationery & Material Supplies
          </h1>

          {/* 3. Short Description (16px body, 1.5+ line-height) */}
          <p className="text-base text-slate-300 leading-relaxed font-normal">
            Rajdeep Enterprises supplies certified safety PPE, welding consumables, Champion gaskets, hardware, and site materials. Direct counter pickup at Mathura Refinery Gate with reliable dispatch across all 28 states of India.
          </p>

          {/* 4. Primary & Secondary CTA Buttons (Clear hierarchy, comfortable 44px+ touch targets) */}
          <div className="flex flex-col gap-2.5 pt-1">
            {/* Primary CTA: Explore Catalogue */}
            <a
              id="mobile-hero-view-products-btn"
              href="#products"
              className="min-h-[46px] w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm text-white bg-orange-600 hover:bg-orange-700 active:bg-orange-800 shadow-md transition text-center"
            >
              <span>Explore Products Catalogue</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            {/* Secondary CTA: Request RFQ Quote */}
            <button
              type="button"
              id="mobile-hero-quote-btn"
              onClick={() => {
                trackCustomQuoteClick('Hero Mobile CTA');
                onOpenQuoteModal();
              }}
              className="min-h-[46px] w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm text-slate-200 bg-slate-900/90 hover:bg-slate-800 border border-slate-700 active:scale-98 transition text-center"
            >
              <FileText className="w-4 h-4 text-orange-400" />
              <span>Request Fast Quotation (RFQ)</span>
            </button>

            {/* Quick Visiting Card & Counter Status */}
            <div className="flex items-center justify-between pt-1 px-1 text-xs text-slate-400">
              <button
                type="button"
                onClick={onOpenVisitingCard}
                className="inline-flex items-center gap-1.5 text-sky-400 hover:text-sky-300 font-semibold py-1 active:scale-95 transition"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View Visiting Card</span>
              </button>
              <span className="text-[11px] text-emerald-400 font-mono flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                Counter: 8 AM–8 PM
              </span>
            </div>
          </div>

          {/* Clean Trust Strip on Mobile */}
          <div className="grid grid-cols-2 gap-2 pt-1 text-xs text-slate-300">
            <div className="flex items-center gap-2 px-2.5 py-2 rounded-lg bg-slate-900/60 border border-slate-800/80">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="font-medium text-[11px]">Gate Pass Ready</span>
            </div>
            <div className="flex items-center gap-2 px-2.5 py-2 rounded-lg bg-slate-900/60 border border-slate-800/80">
              <CheckCircle className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              <span className="font-medium text-[11px]">100% GST Invoiced</span>
            </div>
          </div>
        </div>

        {/* Desktop View: Full 2-column layout (hidden on mobile, shown on lg+) */}
        <div className="hidden lg:grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Headings & Action buttons */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Location & Pan-India Trust Pill */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-700 text-xs font-semibold text-slate-200 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-sky-400"></span>
                <MapPin className="w-3.5 h-3.5 text-sky-400" />
                <span className="text-sky-300 font-bold">Mathura, UP</span>
                <span className="text-slate-500">•</span>
                <span className="text-slate-300">Refinery Main Gate Hub</span>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-700 text-sky-300 text-xs font-bold shadow-xs">
                <UserCheck className="w-3.5 h-3.5 text-sky-400" />
                <span>Proprietor: {COMPANY_INFO.contactPerson}</span>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-950/90 border border-emerald-700/60 text-emerald-300 text-xs font-bold shadow-xs">
                <Truck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Supplying Pan-India Everywhere</span>
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

            {/* Action Buttons with clear, disciplined CTA hierarchy */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              {/* Primary CTA */}
              <a
                id="hero-explore-products-btn"
                href="#products"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white bg-orange-600 hover:bg-orange-700 active:bg-orange-800 shadow-sm transition-all transform active:scale-98 min-h-[44px]"
              >
                <span>View Products Catalogue</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              {/* Secondary CTA: RFQ */}
              <button
                type="button"
                id="hero-quote-modal-btn"
                onClick={() => {
                  trackCustomQuoteClick('Hero Desktop CTA');
                  onOpenQuoteModal();
                }}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-sm text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-slate-500 transition-all active:scale-98 min-h-[44px]"
              >
                <FileText className="w-4 h-4 text-orange-400" />
                <span>Request Quotation (RFQ)</span>
              </button>
            </div>

            {/* Quick Contact & Visiting Card Reference */}
            <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-slate-400">
              <a
                href={`tel:${COMPANY_INFO.phone}`}
                onClick={() => trackCallClick(COMPANY_INFO.phone, 'hero_text_link')}
                className="inline-flex items-center gap-1.5 text-amber-400 hover:text-amber-300 font-semibold transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call: {COMPANY_INFO.displayPhone}</span>
              </a>

              <span className="text-slate-600">•</span>

              <a
                href={`https://wa.me/${COMPANY_INFO.whatsappNumber}?text=Hello%20Rajdeep%20Enterprises,%20I%20need%20a%20quotation%20for%20safety%20materials`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackWhatsAppClick('hero_text_link', 'General Inquiry')}
                className="inline-flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-semibold transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp Available</span>
              </a>

              <span className="text-slate-600">•</span>

              <button
                id="hero-visiting-card-trigger"
                onClick={onOpenVisitingCard}
                className="inline-flex items-center gap-1.5 text-sky-400 hover:text-sky-300 font-medium transition-colors"
              >
                <FileText className="w-3.5 h-3.5" />
                <span className="underline decoration-dotted underline-offset-4">
                  Visiting Card
                </span>
              </button>
            </div>
          </div>

          {/* Right Column: Industrial Supply & Depot Desk (No Photo) */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="rounded-2xl overflow-hidden shadow-xl border border-slate-700/80 bg-slate-900/90 backdrop-blur-sm p-6 text-left space-y-5">
                
                {/* Header with Depot Badge */}
                <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-4">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-sky-950 border border-sky-700/50 text-[11px] font-bold text-sky-400">
                      <Store className="w-3.5 h-3.5" />
                      <span>Industrial Supply Depot</span>
                    </div>
                    <h3 className="text-xl font-black text-white mt-2">
                      Rajdeep Enterprises
                    </h3>
                    <p className="text-xs text-slate-300 mt-0.5">
                      15/1, U.P. S.I.D.C. Complex, Refinery Main Gate, Mathura
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 shrink-0">
                    <Building className="w-5 h-5" />
                  </div>
                </div>

                {/* Key Operational Highlights */}
                <div className="space-y-3 text-xs text-slate-300">
                  <div className="flex items-start gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-white block">Immediate Gate Entry Compliance</span>
                      <span className="text-slate-400 text-[11px]">BIS & EN certified footwear, helmets, safety goggles & harnesses ready for plant passes.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <Truck className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-white block">Pan-India Dispatch & No Minimum Limits</span>
                      <span className="text-slate-400 text-[11px]">Supply available in any quantity needed—from 1 replacement item to bulk industrial consignments.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <CheckCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-white block">Standard GST Invoicing with ITC</span>
                      <span className="text-slate-400 text-[11px]">Proper tax invoices (18% / 12%) for contractor input credit and audit compliance.</span>
                    </div>
                  </div>
                </div>

                {/* Proprietor & Direct Contact Bar */}
                <div className="pt-4 border-t border-slate-800 bg-slate-950/60 -mx-6 -mb-6 p-5 rounded-b-2xl flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Proprietor / Contact</span>
                      <span className="text-sm font-black text-white">{COMPANY_INFO.contactPerson}</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-sky-300 bg-slate-900 px-2.5 py-1 rounded border border-slate-800">
                      {COMPANY_INFO.displayPhone}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <a
                      href={`tel:${COMPANY_INFO.phone}`}
                      onClick={() => trackCallClick(COMPANY_INFO.phone, 'hero_depot_card')}
                      className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold shadow-sm transition active:scale-95 text-center"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Direct Call</span>
                    </a>
                    <a
                      href={`https://wa.me/${COMPANY_INFO.whatsappNumber}?text=Hello%20Rajdeep%20Enterprises,%20I%20need%20a%20quotation`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => trackWhatsAppClick('hero_depot_card', 'Quick Inquiry')}
                      className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-sm transition active:scale-95 text-center"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
