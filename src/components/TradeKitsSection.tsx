import React, { useState } from 'react';
import { 
  Briefcase, 
  Flame, 
  ShieldAlert, 
  Factory, 
  Truck, 
  Zap, 
  UserCheck, 
  CheckCircle2, 
  Plus, 
  ArrowRight, 
  ShoppingCart, 
  MessageCircle, 
  FileText,
  Sparkles
} from 'lucide-react';
import { TRADE_KITS } from '../data/tradeKitsData';
import { TradeKit, Product, Language } from '../types';
import { COMPANY_INFO, PRODUCTS } from '../data/companyData';

interface TradeKitsSectionProps {
  onAddProductToRfq: (product: Product, quantity?: number) => void;
  onOpenQuoteModal: (productName?: string) => void;
  lang: Language;
}

export const TradeKitsSection: React.FC<TradeKitsSectionProps> = ({
  onAddProductToRfq,
  onOpenQuoteModal,
  lang
}) => {
  const [activeKitId, setActiveKitId] = useState<string>(TRADE_KITS[0].id);
  const [kitQuantityMultiplier, setKitQuantityMultiplier] = useState<number>(10);
  const [addedSuccessId, setAddedSuccessId] = useState<string | null>(null);

  const activeKit = TRADE_KITS.find((k) => k.id === activeKitId) || TRADE_KITS[0];

  const getKitIcon = (iconName: string) => {
    switch (iconName) {
      case 'Flame': return <Flame className="w-5 h-5 text-orange-500" />;
      case 'ShieldAlert': return <ShieldAlert className="w-5 h-5 text-amber-500" />;
      case 'Factory': return <Factory className="w-5 h-5 text-blue-500" />;
      case 'Truck': return <Truck className="w-5 h-5 text-emerald-500" />;
      case 'Zap': return <Zap className="w-5 h-5 text-yellow-400" />;
      case 'UserCheck': return <UserCheck className="w-5 h-5 text-indigo-400" />;
      default: return <Briefcase className="w-5 h-5 text-orange-500" />;
    }
  };

  const handleAddWholeKitToRfq = (kit: TradeKit) => {
    kit.items.forEach((item) => {
      let matchedProduct = PRODUCTS.find((p) => p.id === item.productId);
      if (!matchedProduct) {
        // Create custom product object for items not directly matching IDs
        matchedProduct = {
          id: `custom-kit-${item.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
          name: item.name,
          category: kit.trade,
          shortDescription: item.spec,
          fullDescription: `${item.name} configured for ${kit.title}.`,
          image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80",
          specifications: [item.spec],
          commonUses: kit.suitableFor
        };
      }
      onAddProductToRfq(matchedProduct, item.qty * kitQuantityMultiplier);
    });

    setAddedSuccessId(kit.id);
    setTimeout(() => {
      setAddedSuccessId(null);
    }, 3000);
  };

  const handleWhatsAppKitEnquiry = (kit: TradeKit) => {
    let msg = `*TRADE PPE KIT ENQUIRY - RAJDEEP ENTERPRISES*\n`;
    msg += `*Kit Selected:* ${kit.title} (${kit.trade})\n`;
    msg += `*Quantity Required:* ${kitQuantityMultiplier} Complete Workforce Sets\n`;
    msg += `*Site / Work Location:* Mathura / Whole India Delivery\n`;
    msg += `\n*Kit Components Bundled:*\n`;
    kit.items.forEach((item, idx) => {
      msg += `${idx + 1}. ${item.name} - ${item.qty * kitQuantityMultiplier} units (${item.spec})\n`;
    });
    msg += `\nPlease provide your best trade package quotation and delivery schedule.`;

    window.open(`https://wa.me/${COMPANY_INFO.whatsappNumber}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <section id="trade-kits" className="py-16 md:py-20 bg-slate-100 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100 border border-orange-200 text-orange-800 text-xs font-bold uppercase tracking-wider mb-3">
            <Briefcase className="w-3.5 h-3.5 text-orange-600" />
            <span>Turnkey Workforce PPE Packages</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
            Trade-Specific PPE Kits Configurator
          </h2>
          <div className="w-20 h-1 bg-orange-500 mx-auto mt-4 rounded-full"></div>
          <p className="mt-4 text-sm sm:text-base text-slate-600 leading-relaxed">
            Eliminate individual item guesswork. Equip your workforce with pre-approved industrial safety kits tailored to specific trade roles, certified to pass refinery & EPC safety inspector gate checks.
          </p>
        </div>

        {/* Trade Selection Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {TRADE_KITS.map((kit) => {
            const isSelected = kit.id === activeKitId;
            return (
              <button
                key={kit.id}
                onClick={() => setActiveKitId(kit.id)}
                className={`flex items-center gap-2.5 px-4 py-3 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all shrink-0 border ${
                  isSelected 
                    ? 'bg-slate-900 text-white border-slate-900 shadow-lg scale-102' 
                    : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-slate-800' : 'bg-slate-100'}`}>
                  {getKitIcon(kit.iconName)}
                </div>
                <span>{kit.trade}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${isSelected ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
                  {kit.items.length} items
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Kit Showcase Detail Card */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden">
          
          {/* Card Top Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 text-white p-6 sm:p-8">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              
              <div className="space-y-2">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="px-2.5 py-1 rounded bg-orange-600 text-white text-[11px] font-black uppercase tracking-wider">
                    {activeKit.trade}
                  </span>
                  <span className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-amber-300 text-[11px] font-bold">
                    {activeKit.badge}
                  </span>
                  <span className="text-slate-400 text-xs hidden sm:inline">
                    Whole India Dispatch Available
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white">
                  {activeKit.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
                  {activeKit.description}
                </p>
                <div className="text-xs text-slate-400 pt-1">
                  <strong className="text-slate-200">Recommended For:</strong> {activeKit.suitableFor}
                </div>
              </div>

              {/* Multiplier & Fast Actions */}
              <div className="bg-slate-800/90 p-4 rounded-2xl border border-slate-700 shrink-0 space-y-3 lg:w-72">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Select Workforce Size:
                  </label>
                  <div className="grid grid-cols-4 gap-1.5 text-xs font-bold">
                    {[1, 10, 50, 100].map((count) => (
                      <button
                        key={count}
                        onClick={() => setKitQuantityMultiplier(count)}
                        className={`py-1.5 rounded text-center transition ${
                          kitQuantityMultiplier === count
                            ? 'bg-orange-500 text-white shadow-sm'
                            : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                        }`}
                      >
                        {count} {count === 1 ? 'Kit' : 'Kits'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-1">
                  <button
                    onClick={() => handleAddWholeKitToRfq(activeKit)}
                    className={`w-full py-2.5 px-3 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition shadow-md active:scale-95 ${
                      addedSuccessId === activeKit.id
                        ? 'bg-emerald-600 text-white'
                        : 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white'
                    }`}
                  >
                    {addedSuccessId === activeKit.id ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-white" />
                        <span>Added {kitQuantityMultiplier} Kits to Cart!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4" />
                        <span>Add {kitQuantityMultiplier} Full Kits to RFQ Cart</span>
                      </>
                    )}
                  </button>
                </div>

                <button
                  onClick={() => handleWhatsAppKitEnquiry(activeKit)}
                  className="w-full py-2 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-2 transition"
                >
                  <MessageCircle className="w-3.5 h-3.5 fill-white/20" />
                  <span>Get Kit Quote on WhatsApp</span>
                </button>
              </div>

            </div>
          </div>

          {/* Kit Items Breakdown Table / Grid */}
          <div className="p-6 sm:p-8">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-orange-500" />
                <span>Components Included in Each 1 Kit ({activeKit.items.length} Essential Items)</span>
              </h4>
              <span className="text-xs text-slate-500 font-mono">
                Total for {kitQuantityMultiplier} workers: {activeKit.items.reduce((acc, i) => acc + (i.qty * kitQuantityMultiplier), 0)} items
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {activeKit.items.map((item, idx) => {
                const totalUnits = item.qty * kitQuantityMultiplier;
                return (
                  <div 
                    key={idx}
                    className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-orange-300 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <span className="w-5 h-5 rounded-full bg-orange-100 text-orange-800 text-[11px] font-bold flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <span className="text-[11px] font-black text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200 shadow-2xs">
                          {item.qty} per kit ({totalUnits} total)
                        </span>
                      </div>
                      <h5 className="font-bold text-xs sm:text-sm text-slate-900 leading-snug">
                        {item.name}
                      </h5>
                      <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                        {item.spec}
                      </p>
                    </div>

                    <div className="pt-2 mt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-emerald-700 font-semibold">
                      <span>Refinery / Site Spec</span>
                      <span className="text-slate-400">IS/EN standard</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Standards Bar & Custom Modifying Note */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-bold text-slate-700">Standards Verified:</span>
                {activeKit.standards.map((std, i) => (
                  <span key={i} className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 font-mono text-[10px] text-slate-800 font-bold">
                    {std}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-slate-500">Need to modify or add extra items to this kit?</span>
                <button
                  onClick={() => onOpenQuoteModal(`Custom Modified ${activeKit.title}`)}
                  className="font-bold text-orange-600 hover:text-orange-700 underline"
                >
                  Request Customized Kit
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
