import React, { useState } from 'react';
import { Truck, Globe2, PackageCheck, PlusCircle, Phone, MessageCircle, ArrowRight, CheckCircle2, ChevronDown, ChevronUp, Sparkles, MapPin } from 'lucide-react';
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
  const [isOpen, setIsOpen] = useState(false);
  const [customItemText, setCustomItemText] = useState('');
  const [selectedQtyRange, setSelectedQtyRange] = useState('100 - 500 Units');
  const [destinationCity, setDestinationCity] = useState('');

  const regionsCovered = [
    {
      region: "North India",
      states: "UP, Delhi NCR, Haryana, Punjab, Rajasthan, UK, HP, J&K",
      dispatch: "Same/Next-Day Express"
    },
    {
      region: "West India",
      states: "Gujarat, Maharashtra, Goa, MP (Indore, Pithampur)",
      dispatch: "24-48 Hrs Freight"
    },
    {
      region: "East & Central",
      states: "Bihar, Jharkhand, Odisha, West Bengal, CG",
      dispatch: "Direct Road & Rail"
    },
    {
      region: "South India",
      states: "Karnataka, Tamil Nadu, Telangana, AP, Kerala",
      dispatch: "Fast Air & Road Cargo"
    },
    {
      region: "North-East & UTs",
      states: "Assam, Meghalaya, Tripura, & all UTs across India",
      dispatch: "Doorstep Delivery"
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
    <section id="pan-india" className="py-4 sm:py-6 bg-slate-900 text-white relative overflow-hidden border-t border-b border-slate-800">
      {/* Background accents */}
      <div className="absolute inset-0 industrial-grid-dark opacity-15 pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
        
        {/* Collapsible Dropdown Header Trigger */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full text-left p-3 sm:p-4 rounded-xl bg-slate-850 hover:bg-slate-800 border border-slate-700 hover:border-orange-500/70 transition-all flex items-center justify-between gap-2 sm:gap-4 shadow-md group"
          aria-expanded={isOpen}
        >
          <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg bg-orange-500/20 border border-orange-500/40 text-orange-400 flex items-center justify-center shrink-0 group-hover:bg-orange-500 group-hover:text-white transition-colors">
              <Globe2 className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-bold text-orange-400 uppercase tracking-wider bg-orange-950/70 px-2 py-0.5 rounded border border-orange-800/40">
                  🇮🇳 Supply & Sourcing Network
                </span>
                <span className="text-[10px] text-emerald-400 font-mono hidden xs:inline">
                  Any Quantity • All 28 States
                </span>
              </div>
              <h2 className="text-sm sm:text-base md:text-lg font-black text-white tracking-tight truncate mt-0.5">
                All-India Supply Network & Custom Sourcing
              </h2>
              <p className="text-[11px] text-slate-400 truncate hidden sm:block">
                Doorstep dispatch to every pin code across India, no minimum order limit, plus on-demand custom material sourcing.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[10px] sm:text-xs font-bold text-sky-400 bg-sky-950/80 px-2 py-1 rounded-md border border-sky-800/50">
              {isOpen ? 'Close' : 'Drop Down'}
            </span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 group-hover:text-white">
              {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </div>
        </button>

        {/* Collapsible Dropdown Content with Compact Smaller Cards */}
        {isOpen && (
          <div className="mt-3 sm:mt-4 space-y-3 sm:space-y-4 animate-in fade-in duration-200">
            
            {/* 3 Pillars in Compact Mini Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 sm:gap-3">
              
              {/* Pillar 1: Whole India Dispatch */}
              <div className="bg-slate-850 p-3 sm:p-3.5 rounded-xl border border-slate-700/80 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-8 h-8 rounded-lg bg-orange-500/15 border border-orange-500/30 text-orange-400 flex items-center justify-center">
                      <Truck className="w-4 h-4" />
                    </div>
                    <span className="text-[9px] font-bold text-amber-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-700">
                      All 28 States & UTs
                    </span>
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-white mb-1">
                    Supplying in Whole India
                  </h3>
                  <p className="text-[11px] text-slate-300 leading-relaxed mb-2.5">
                    Express road freight, cargo air, and door delivery across industrial corridors, refineries & EPC sites.
                  </p>
                  <div className="space-y-1 text-[10px] text-slate-300 border-t border-slate-700/60 pt-2">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                      <span>Doorstep transport & express couriers</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                      <span>Safe logistics (V-Trans, TCI, SafeExpress)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                      <span>Full GST invoice & E-Way Bill transit</span>
                    </div>
                  </div>
                </div>
                <div className="mt-2.5 pt-2 border-t border-slate-700/50">
                  <a
                    href={`tel:${COMPANY_INFO.phone}`}
                    className="w-full py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-[11px] font-bold flex items-center justify-center gap-1.5 transition"
                  >
                    <Phone className="w-3 h-3 text-orange-400" />
                    <span>Check Delivery to Your Pin Code</span>
                  </a>
                </div>
              </div>

              {/* Pillar 2: Any Quantity */}
              <div className="bg-slate-850 p-3 sm:p-3.5 rounded-xl border border-slate-700/80 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center">
                      <PackageCheck className="w-4 h-4" />
                    </div>
                    <span className="text-[9px] font-bold text-emerald-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-700">
                      No Minimum Limit
                    </span>
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-white mb-1">
                    {t.anyQuantityTitle}
                  </h3>
                  <p className="text-[11px] text-slate-300 leading-relaxed mb-2.5">
                    Order 1 trial unit or 50,000+ units for mega EPC projects and shutdown turnarounds.
                  </p>
                  <div className="space-y-1 text-[10px] text-slate-300 border-t border-slate-700/60 pt-2">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3 h-3 text-amber-400 shrink-0" />
                      <span>Sample trials & replacements welcome</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3 h-3 text-amber-400 shrink-0" />
                      <span>Contractor lot discounts</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3 h-3 text-amber-400 shrink-0" />
                      <span>Full truck load (FTL) bulk capacity</span>
                    </div>
                  </div>
                </div>
                <div className="mt-2.5 pt-2 border-t border-slate-700/50">
                  <button
                    onClick={() => onEnquire("Bulk / Custom Quantity Order")}
                    className="w-full py-1.5 px-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-[11px] font-bold flex items-center justify-center gap-1 transition"
                  >
                    <span>Request Quantity Quote</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Pillar 3: Custom Extra Sourcing */}
              <div className="bg-slate-850 p-3 sm:p-3.5 rounded-xl border border-orange-500/50 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-8 h-8 rounded-lg bg-orange-600/20 border border-orange-500/40 text-orange-300 flex items-center justify-center">
                      <PlusCircle className="w-4 h-4" />
                    </div>
                    <span className="text-[9px] font-bold text-orange-300 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-700">
                      Custom Sourcing
                    </span>
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-white mb-1">
                    {t.extraItemsTitle}
                  </h3>
                  <p className="text-[11px] text-slate-300 leading-relaxed mb-2.5">
                    Require custom gear, brand printing, special gas detectors, or rare gasket materials? We source it.
                  </p>
                  <div className="space-y-1 text-[10px] text-slate-300 border-t border-slate-700/60 pt-2">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3 h-3 text-orange-400 shrink-0" />
                      <span>Company logo printing on helmets/vests</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3 h-3 text-orange-400 shrink-0" />
                      <span>Tripod winches, arc flash, chemical PPE</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3 h-3 text-orange-400 shrink-0" />
                      <span>Direct sourcing by Raj Singh Tarkar</span>
                    </div>
                  </div>
                </div>
                <div className="mt-2.5 pt-2 border-t border-slate-700/50">
                  <a
                    href={`https://wa.me/${COMPANY_INFO.whatsappNumber}?text=${encodeURIComponent('Hello Rajdeep Enterprises, I need custom safety sourcing or extra materials.')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-1.5 px-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold flex items-center justify-center gap-1.5 transition"
                  >
                    <MessageCircle className="w-3 h-3" />
                    <span>WhatsApp Custom Sourcing</span>
                  </a>
                </div>
              </div>

            </div>

            {/* Compact Custom Sourcing Form Strip */}
            <div className="bg-slate-850 p-3 sm:p-4 rounded-xl border border-slate-700/90">
              <div className="flex items-center gap-1 text-orange-400 text-[10px] font-bold uppercase tracking-wider mb-2">
                <Sparkles className="w-3 h-3" />
                <span>On-Demand Custom Item Enquiry Form</span>
              </div>
              
              <form onSubmit={handleCustomItemEnquiry} className="space-y-2">
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                  <div className="sm:col-span-6">
                    <input
                      type="text"
                      required
                      placeholder="What extra items do you need? (e.g. Arc suit, tripod, 30m lifeline...)"
                      value={customItemText}
                      onChange={(e) => setCustomItemText(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:border-orange-500 outline-none"
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <select
                      value={selectedQtyRange}
                      onChange={(e) => setSelectedQtyRange(e.target.value)}
                      className="w-full px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:border-orange-500 outline-none"
                    >
                      <option value="1 - 50 Units">1 - 50 Units</option>
                      <option value="50 - 200 Units">50 - 200 Units</option>
                      <option value="200 - 1,000 Units">200 - 1,000 Units</option>
                      <option value="1,000+ Units">1,000+ Units</option>
                    </select>
                  </div>
                  <div className="sm:col-span-3">
                    <div className="relative">
                      <MapPin className="w-3 h-3 text-orange-400 absolute left-2 top-2" />
                      <input
                        type="text"
                        placeholder="City / State / Pin"
                        value={destinationCity}
                        onChange={(e) => setDestinationCity(e.target.value)}
                        className="w-full pl-6 pr-2 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:border-orange-500 outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                  <span className="text-[10px] text-slate-400">
                    Hotline: <strong className="text-white">{COMPANY_INFO.phone}</strong> • Quick quote via WhatsApp
                  </span>
                  <button
                    type="submit"
                    className="py-1.5 px-3.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-sm"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Send Custom RFQ</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Compact Regional Transit Grid (5 Mini Cards) */}
            <div className="pt-1">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Globe2 className="w-3.5 h-3.5 text-orange-400" />
                <span>Pan-India Regional Transit Times</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                {regionsCovered.map((reg, idx) => (
                  <div key={idx} className="p-2 rounded-lg bg-slate-800/80 border border-slate-700/70">
                    <div className="font-bold text-xs text-orange-300">
                      {reg.region}
                    </div>
                    <div className="text-slate-300 text-[10px] truncate mt-0.5">
                      {reg.states}
                    </div>
                    <div className="text-[9px] font-mono text-emerald-400 font-semibold mt-1 pt-1 border-t border-slate-700/60">
                      {reg.dispatch}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>
    </section>
  );
};
