import React, { useState } from 'react';
import { Shield, AlertTriangle, Ban, AlertCircle, ShoppingBag, Send, CheckCircle2, Eye, Compass } from 'lucide-react';
import { SAFETY_SIGNS_DATA, SafetySignItem } from '../data/safetySignsData';
import { Product } from '../types';

interface SafetySignsSectionProps {
  onAddProductToRfq: (product: Product, quantity?: number) => void;
  onOpenQuoteModal: (productName?: string) => void;
  rfqProductIds: string[];
}

export const SafetySignsSection: React.FC<SafetySignsSectionProps> = ({
  onAddProductToRfq,
  onOpenQuoteModal,
  rfqProductIds
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedSubstrates, setSelectedSubstrates] = useState<Record<string, string>>({});
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const categories = [
    { id: 'all', label: 'All Site Signages' },
    { id: 'mandatory', label: 'Mandatory PPE (Blue)' },
    { id: 'warning', label: 'Hazard & Caution (Yellow)' },
    { id: 'prohibition', label: 'Prohibition & Fire (Red)' },
    { id: 'emergency', label: 'Emergency & Assembly (Green)' }
  ];

  const filteredSigns = activeCategory === 'all'
    ? SAFETY_SIGNS_DATA
    : SAFETY_SIGNS_DATA.filter(sign => sign.category === activeCategory);

  const handleSubstrateChange = (signId: string, substrate: string) => {
    setSelectedSubstrates(prev => ({ ...prev, [signId]: substrate }));
  };

  const handleQtyChange = (signId: string, delta: number) => {
    setQuantities(prev => {
      const current = prev[signId] || 5;
      const next = Math.max(1, current + delta);
      return { ...prev, [signId]: next };
    });
  };

  const handleAddSignToCart = (sign: SafetySignItem) => {
    const qty = quantities[sign.id] || 5;
    const substrate = selectedSubstrates[sign.id] || sign.materials[0];
    const customProduct: Product = {
      ...sign.productRef,
      shortDescription: `${sign.productRef.shortDescription} [Substrate: ${substrate}]`
    };
    onAddProductToRfq(customProduct, qty);
  };

  return (
    <section id="safety-signages" className="py-20 bg-slate-900 text-white relative overflow-hidden">
      {/* Subtle Background Elements */}
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#f97316_1px,transparent_1px)] [background-size:24px_24px]"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-2 bg-orange-500/20 text-orange-400 border border-orange-500/30 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
              <Compass className="w-3.5 h-3.5" />
              <span>IS:9457 & ISO 7010 Industrial Signages</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Site Safety Signs & Barricade Boards
            </h2>
            <p className="mt-3 text-slate-400 max-w-2xl text-sm sm:text-base">
              Compliant high-visibility safety signboards, photoluminescent exit boards, and IRC-approved highway caution signs for refinery turnarounds, construction yards, and manufacturing plants.
            </p>
          </div>

          <div className="mt-6 md:mt-0 flex items-center gap-3">
            <button
              onClick={() => onOpenQuoteModal('Custom Industrial Safety Signage Requirement')}
              className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white px-5 py-2.5 rounded-lg text-sm font-bold shadow-lg shadow-orange-900/30 transition-all active:scale-95"
            >
              <Send className="w-4 h-4" />
              <span>Custom Signage RFQ</span>
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 mb-8 pb-2 border-b border-slate-800">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                activeCategory === cat.id
                  ? 'bg-orange-600 text-white shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Signboards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSigns.map((sign) => {
            const currentSubstrate = selectedSubstrates[sign.id] || sign.materials[0];
            const currentQty = quantities[sign.id] || 5;
            const isInCart = rfqProductIds.includes(sign.productRef.id);

            // Category color accents
            const getBadgeColor = (cat: string) => {
              switch (cat) {
                case 'mandatory':
                  return 'bg-blue-600 text-white';
                case 'warning':
                  return 'bg-amber-500 text-slate-950 font-bold';
                case 'prohibition':
                  return 'bg-red-600 text-white';
                case 'emergency':
                  return 'bg-emerald-600 text-white';
                default:
                  return 'bg-orange-600 text-white';
              }
            };

            return (
              <div
                key={sign.id}
                className="bg-slate-800/90 rounded-xl border border-slate-700 overflow-hidden flex flex-col hover:border-slate-600 transition-all group"
              >
                {/* Header with Visual representation */}
                <div className="p-5 border-b border-slate-700/80 bg-slate-800/50 flex items-start justify-between gap-3">
                  <div>
                    <span className={`inline-block text-[11px] px-2.5 py-0.5 rounded-full font-bold uppercase mb-2 ${getBadgeColor(sign.category)}`}>
                      {sign.standard}
                    </span>
                    <h3 className="text-base font-bold text-white group-hover:text-orange-400 transition-colors">
                      {sign.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                      {sign.description}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center flex-shrink-0 text-orange-400">
                    {sign.category === 'mandatory' && <Shield className="w-5 h-5 text-blue-400" />}
                    {sign.category === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-400" />}
                    {sign.category === 'prohibition' && <Ban className="w-5 h-5 text-red-400" />}
                    {sign.category === 'emergency' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                  </div>
                </div>

                {/* Body Specs */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="text-xs text-slate-400">
                      <span className="font-semibold text-slate-300">Standard Dimension:</span> {sign.defaultSize}
                    </div>

                    {/* Substrate Selector */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Select Substrate / Material:
                      </label>
                      <select
                        value={currentSubstrate}
                        onChange={(e) => handleSubstrateChange(sign.id, e.target.value)}
                        className="w-full text-xs bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-2 text-slate-200 focus:outline-none focus:border-orange-500"
                      >
                        {sign.materials.map((mat) => (
                          <option key={mat} value={mat}>
                            {mat}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="bg-slate-900/60 rounded-lg p-3 border border-slate-700/50">
                      <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                        Installation Deployment:
                      </div>
                      <div className="text-xs text-slate-300">
                        {sign.productRef.commonUses}
                      </div>
                    </div>
                  </div>

                  {/* Quantity & Cart Action */}
                  <div className="pt-3 border-t border-slate-700/80 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700 rounded-lg p-1">
                      <button
                        onClick={() => handleQtyChange(sign.id, -1)}
                        className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold flex items-center justify-center text-xs"
                        title="Decrease"
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-xs font-bold text-white">
                        {currentQty}
                      </span>
                      <button
                        onClick={() => handleQtyChange(sign.id, 1)}
                        className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold flex items-center justify-center text-xs"
                        title="Increase"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => handleAddSignToCart(sign)}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                        isInCart
                          ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                          : 'bg-orange-600 hover:bg-orange-500 text-white shadow-md'
                      }`}
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>{isInCart ? 'Added (+Qty)' : `Add ${currentQty} to RFQ`}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Banner for Custom Dimensions */}
        <div className="mt-12 bg-slate-800/60 border border-slate-700 rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">
                Need Custom Sizes, Bilingual Text (Hindi/English) or Company Logo on Signboards?
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                We manufacture bespoke industrial signages with your plant site map, specific emergency contact numbers, and contractor branding.
              </div>
            </div>
          </div>
          <button
            onClick={() => onOpenQuoteModal('Custom Bilingual Industrial Signage Board Order')}
            className="whitespace-nowrap px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold rounded-lg transition"
          >
            Request Custom Layout
          </button>
        </div>
      </div>
    </section>
  );
};
