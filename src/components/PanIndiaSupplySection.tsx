import React, { useState } from 'react';
import { Truck, Globe2, PackageCheck, PlusCircle, Phone, MessageCircle, ArrowRight, CheckCircle2, Search, Sparkles, MapPin, Layers } from 'lucide-react';
import { COMPANY_INFO } from '../data/companyData';
import { Language } from '../types';
import { TRANSLATIONS } from '../data/extraData';

interface PanIndiaSupplySectionProps {
  lang: Language;
  onEnquire: (productName: string) => void;
}

export const PanIndiaSupplySection: React.FC<PanIndiaSupplySectionProps> = ({
  lang,
  onEnquire
}) => {
  const t = TRANSLATIONS[lang];
  const [customItemText, setCustomItemText] = useState('');
  const [selectedQtyRange, setSelectedQtyRange] = useState('100 - 500 Units');
  const [destinationCity, setDestinationCity] = useState('');

  const regionsCovered = [
    {
      region: "North India",
      states: "Uttar Pradesh, Delhi NCR, Haryana, Punjab, Rajasthan, Uttarakhand, Himachal Pradesh, J&K",
      dispatch: "Same-Day / Next-Day Express Dispatch"
    },
    {
      region: "West India",
      states: "Gujarat, Maharashtra, Goa, Madhya Pradesh (Indore, Pithampur, Bhopal)",
      dispatch: "24 - 48 Hours Freight Transit"
    },
    {
      region: "East & Central India",
      states: "Bihar, Jharkhand, Odisha, West Bengal, Chhattisgarh",
      dispatch: "Direct Transport & Cargo Rail Transit"
    },
    {
      region: "South India",
      states: "Karnataka, Tamil Nadu, Telangana, Andhra Pradesh, Kerala",
      dispatch: "Fast Road Freight & Cargo Air Express"
    },
    {
      region: "North-East & UTs",
      states: "Assam, Meghalaya, Tripura, and all Union Territories across India",
      dispatch: "Secure Doorstep Logistics Dispatch"
    }
  ];

  const quantityTiers = [
    {
      range: "1 - 50 Units",
      label: "Sample & Emergency Batches",
      desc: "Instant dispatch for immediate maintenance, trials, or site replacements.",
      highlight: "No minimum limit"
    },
    {
      range: "50 - 500 Units",
      label: "Contractor Project Batches",
      desc: "Full PPE kits for contractor labor teams, mechanical crews & welders.",
      highlight: "Bulk contractor discount"
    },
    {
      range: "500 - 5,000 Units",
      label: "Plant Turnarounds & Shutdowns",
      desc: "Refinery shutdown turnarounds, high-visibility road cones & safety gear.",
      highlight: "Batch test certificates"
    },
    {
      range: "5,000 - 50,000+ Units",
      label: "Mega EPC & Enterprise Supply",
      desc: "Full container & truck-load (FTL) delivery across industrial corridors.",
      highlight: "Scheduled milestone supply"
    }
  ];

  const handleCustomItemEnquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customItemText.trim()) {
      onEnquire("Custom Extra Sourcing Request");
      return;
    }

    const message = encodeURIComponent(
      `*CUSTOM EXTRA ITEM ENQUIRY - RAJDEEP ENTERPRISES*\n` +
      `*Extra Items Needed:* ${customItemText}\n` +
      `*Estimated Quantity:* ${selectedQtyRange}\n` +
      `*Delivery Location in India:* ${destinationCity || 'Whole India Supply'}\n\n` +
      `Please confirm availability, custom sourcing lead time, and best quotation.`
    );
    window.open(`https://wa.me/${COMPANY_INFO.whatsappNumber}?text=${message}`, '_blank');
  };

  return (
    <section id="pan-india" className="py-16 md:py-20 bg-slate-900 text-white relative overflow-hidden">
      {/* Subtle industrial grid and lighting effect */}
      <div className="absolute inset-0 industrial-grid-dark opacity-20 pointer-events-none"></div>
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-600/20 border border-orange-500/40 text-orange-400 text-xs font-bold uppercase tracking-wider mb-3">
            <Globe2 className="w-3.5 h-3.5 text-orange-400" />
            <span>{t.panIndiaBadge}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight leading-tight">
            {t.panIndiaHeading}
          </h2>
          <div className="w-20 h-1 bg-orange-500 mx-auto mt-4 rounded-full"></div>
          <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed">
            {t.panIndiaSub}
          </p>
        </div>

        {/* 3 Pillars Grid: Whole India + Any Quantity + Custom Extra Items */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          
          {/* Pillar 1: Whole India Supply Everywhere */}
          <div className="bg-slate-800/90 rounded-2xl p-6 border border-slate-700 hover:border-orange-500/80 transition-all flex flex-col justify-between shadow-xl group">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-orange-500/20 border border-orange-500/30 text-orange-400 flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white transition-colors">
                  <Truck className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold text-amber-400 bg-slate-900 px-2.5 py-1 rounded border border-slate-700">
                  All 28 States & UTs
                </span>
              </div>

              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-orange-400 transition-colors">
                Supplying in Whole India Everywhere
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                From our Mathura hub, we dispatch verified safety equipment to any industrial site, refinery, highway project, manufacturing corridor, or SEZ across India.
              </p>

              <div className="space-y-2 text-xs text-slate-300 border-t border-slate-700/80 pt-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Doorstep transport & express courier delivery</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Safe logistics partnerships (V-Trans, TCI, SafeExpress)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>GST invoice with E-Way Bill for inter-state transit</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-slate-700/60">
              <span className="text-[11px] text-slate-400 block mb-2 font-mono">
                Prompt Logistics from Mathura Hub to All Indian Locations
              </span>
              <a
                href={`tel:${COMPANY_INFO.phone}`}
                className="w-full py-2 px-3 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold flex items-center justify-center gap-2 transition"
              >
                <Phone className="w-3.5 h-3.5 text-orange-400" />
                <span>Check Delivery to Your Pin Code</span>
              </a>
            </div>
          </div>

          {/* Pillar 2: How Many Items They Want (Any Quantity) */}
          <div className="bg-slate-800/90 rounded-2xl p-6 border border-slate-700 hover:border-amber-500/80 transition-all flex flex-col justify-between shadow-xl group">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
                  <PackageCheck className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold text-emerald-400 bg-slate-900 px-2.5 py-1 rounded border border-slate-700">
                  Zero Quantity Cap
                </span>
              </div>

              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-amber-400 transition-colors">
                {t.anyQuantityTitle}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                {t.anyQuantityDesc}
              </p>

              <div className="space-y-2 text-xs text-slate-300 border-t border-slate-700/80 pt-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Single carton sample trials welcome</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Staggered monthly schedule contracts</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Bulk container & full-truck-load (FTL) capacity</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-slate-700/60">
              <span className="text-[11px] text-slate-400 block mb-2 font-mono">
                Order exactly how many you need — 10 to 50,000+
              </span>
              <button
                onClick={() => onEnquire("Bulk / Custom Quantity Order")}
                className="w-full py-2 px-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center justify-center gap-2 transition shadow-sm"
              >
                <span>Request Custom Quantity Quote</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Pillar 3: Add On Anything Extra (Contact Us) */}
          <div className="bg-slate-800/90 rounded-2xl p-6 border border-orange-500/60 hover:border-orange-400 transition-all flex flex-col justify-between shadow-xl group relative">
            <div className="absolute top-3 right-3">
              <span className="flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-orange-500"></span>
              </span>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-orange-600/30 border border-orange-500/50 text-orange-300 flex items-center justify-center group-hover:bg-orange-600 group-hover:text-white transition-colors">
                  <PlusCircle className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold text-orange-300 bg-slate-900 px-2.5 py-1 rounded border border-slate-700">
                  Custom Sourcing
                </span>
              </div>

              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-orange-400 transition-colors">
                {t.extraItemsTitle}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                {t.extraItemsDesc}
              </p>

              <div className="space-y-2 text-xs text-slate-300 border-t border-slate-700/80 pt-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                  <span>Company logo printing on helmets & jackets</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                  <span>Specialized breathing apparatus & gas detectors</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                  <span>Tripod winches, arc flash suits & chemical PPE</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-slate-700/60">
              <span className="text-[11px] text-slate-400 block mb-2 font-mono">
                Proprietor Raj Singh Tarkar sources any extra gear
              </span>
              <a
                href={`https://wa.me/${COMPANY_INFO.whatsappNumber}?text=${encodeURIComponent('Hello Rajdeep Enterprises, I need an extra safety item or custom material not listed on your website. Please assist me.')}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-2 transition shadow-sm"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-white/20" />
                <span>Contact for Extra Items (WhatsApp)</span>
              </a>
            </div>
          </div>

        </div>

        {/* Interactive "Need Extra Items or Custom Sourcing?" Form Strip */}
        <div className="bg-gradient-to-r from-slate-800 via-slate-800 to-slate-850 p-6 sm:p-8 rounded-2xl border border-slate-700/90 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            <div className="lg:col-span-5 space-y-2 text-left">
              <div className="inline-flex items-center gap-1.5 text-orange-400 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>On-Demand Custom Sourcing & Fast Quotation</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                Want to Add Any Extra Items or Specific Quantities?
              </h3>
              <p className="text-xs sm:text-sm text-slate-300">
                Tell us what extra items you need and your destination in India. Raj Singh Tarkar will provide you with verified pricing and doorstep dispatch schedule.
              </p>
            </div>

            <form onSubmit={handleCustomItemEnquiry} className="lg:col-span-7 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {/* Extra Item Input */}
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                    What Extra Items Do You Need? *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Arc flash suit, 30m lifeline, tripod winch, custom helmets..."
                    value={customItemText}
                    onChange={(e) => setCustomItemText(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
                  />
                </div>

                {/* Quantity Range */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Quantity Needed
                  </label>
                  <select
                    value={selectedQtyRange}
                    onChange={(e) => setSelectedQtyRange(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:border-orange-500 outline-none"
                  >
                    <option value="1 - 50 Units">1 - 50 Units (Sample/Trial)</option>
                    <option value="50 - 200 Units">50 - 200 Units (Project Batch)</option>
                    <option value="200 - 1,000 Units">200 - 1,000 Units (Contractor Lot)</option>
                    <option value="1,000 - 10,000+ Units">1,000 - 10,000+ Units (Mega Order)</option>
                    <option value="Custom Quantity">Custom Quantity (Specify)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 items-center">
                {/* Delivery Location anywhere in India */}
                <div className="sm:col-span-2">
                  <div className="relative">
                    <MapPin className="w-3.5 h-3.5 text-orange-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="Delivery City / State / Pin Code in India (e.g. Surat, Jamnagar, Delhi NCR, Paradeep...)"
                      value={destinationCity}
                      onChange={(e) => setDestinationCity(e.target.value)}
                      className="w-full pl-8 pr-3 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:border-orange-500 outline-none"
                    />
                  </div>
                </div>

                {/* Submit button */}
                <div>
                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-lg active:scale-95"
                  >
                    <MessageCircle className="w-4 h-4 fill-white/20" />
                    <span>Send Extra Item RFQ</span>
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 pt-1">
                <span>Direct Hotline: <strong className="text-white">{COMPANY_INFO.phone}</strong> / <strong className="text-white">{COMPANY_INFO.secondaryPhone}</strong></span>
                <span className="text-orange-400 font-medium">Prompt Response via WhatsApp or Call</span>
              </div>
            </form>

          </div>
        </div>

        {/* Regional Coverage Grid */}
        <div className="mt-12">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Globe2 className="w-4 h-4 text-orange-400" />
            <span>Pan-India Logistics Dispatch Network (Supplying Everywhere in India)</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
            {regionsCovered.map((reg, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/80">
                <div className="font-bold text-white text-sm mb-1 text-orange-300">
                  {reg.region}
                </div>
                <div className="text-slate-300 text-[11px] leading-relaxed mb-2">
                  {reg.states}
                </div>
                <div className="text-[10px] font-mono text-emerald-400 font-semibold border-t border-slate-700 pt-1.5">
                  {reg.dispatch}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
