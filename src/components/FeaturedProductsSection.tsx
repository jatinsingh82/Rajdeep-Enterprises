import React from 'react';
import { 
  Sparkles, 
  ArrowDown, 
  Plus, 
  Check, 
  FileText, 
  MessageCircle, 
  Info, 
  ShieldCheck, 
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { PRODUCTS, COMPANY_INFO } from '../data/companyData';
import { Product, Language } from '../types';
import { trackWhatsAppClick } from '../utils/analytics';

interface FeaturedProductsSectionProps {
  onSelectProduct: (product: Product) => void;
  onEnquire: (productName: string) => void;
  onAddToRfq?: (product: Product) => void;
  rfqProductIds?: string[];
  onViewAllProducts?: () => void;
  lang?: Language;
}

// Curated selection of 8 high-priority products for desktop,
// with the top 4 prioritized for mobile viewing.
const FEATURED_PRODUCT_IDS = [
  'safety-shoes',              // Karam Industrial Safety Shoes (IS:15298)
  'safety-helmets',            // Industrial Safety Helmets (IS:2925)
  'safety-jackets',            // Reflective Safety Jackets (High-Vis)
  'champion-gasket-sheet',     // Genuine Champion Gasket Sheet (Style 20 / 54)
  'generic-cut-resistant-gloves', // Cut Resistant Gloves (Pack of 12)
  'welding-rods-electrodes',   // Low-Hydrogen E7018 & Stainless Steel Welding Rods
  'dpt-kit-ndt-crack',         // DPT Kit for Weld Crack Detection
  'inverter-welding-machine',  // Heavy-Duty Inverter ARC Welding Machine
];

export const FeaturedProductsSection: React.FC<FeaturedProductsSectionProps> = ({
  onSelectProduct,
  onEnquire,
  onAddToRfq,
  rfqProductIds = [],
  onViewAllProducts,
  lang = 'en'
}) => {
  // Map IDs to actual product objects from PRODUCTS
  const curatedProducts = FEATURED_PRODUCT_IDS
    .map(id => PRODUCTS.find(p => p.id === id))
    .filter((p): p is Product => Boolean(p));

  const handleScrollToProducts = () => {
    if (onViewAllProducts) {
      onViewAllProducts();
    } else {
      const el = document.getElementById('products');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section 
      id="featured-products" 
      className="py-10 sm:py-14 md:py-16 bg-slate-50/80 border-t border-b border-slate-200 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 border border-orange-200 text-orange-900 text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-2.5">
            <Sparkles className="w-3.5 h-3.5 text-orange-600 shrink-0" />
            <span>{lang === 'en' ? 'Curated Site Essentials' : 'विशेष चयनित उत्पाद'}</span>
          </div>
          
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
            {lang === 'en' ? 'Featured Industrial Products' : 'विशेष औद्योगिक उत्पाद'}
          </h2>
          
          <div className="w-16 h-1 bg-orange-600 mx-auto mt-2.5 sm:mt-3 rounded-full"></div>
          
          <p className="mt-2.5 sm:mt-3 text-xs sm:text-sm md:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
            {lang === 'en' 
              ? 'Our most frequently requested BIS-certified safety equipment, genuine Champion gasket sheets, and welding supplies stocked in bulk for immediate dispatch.'
              : 'हमारे सबसे लोकप्रिय BIS-प्रमाणित सुरक्षा उपकरण, ओरिजिनल चैंपियन गास्केट शीट्स और तुरंत डिस्पैच के लिए उपलब्ध आवश्यक सामग्री।'}
          </p>
        </div>

        {/* Featured Products Grid:
            - Mobile: Exactly 4 products in a balanced 2x2 grid with comfortable padding
            - Desktop: 8 products in a 3-4 column grid
        */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 md:gap-5">
          {curatedProducts.map((product, index) => {
            const isAddedToRfq = rfqProductIds.includes(product.id);
            const waMessage = encodeURIComponent(
              `Hello Rajdeep Enterprises, I am interested in your featured product: ${product.name}. Please share price & availability.`
            );

            // Hide products beyond the first 4 on mobile devices (below md breakpoint)
            const isDesktopOnly = index >= 4;

            return (
              <div
                key={product.id}
                className={`bg-white rounded-xl sm:rounded-2xl overflow-hidden border border-slate-200/90 hover:border-orange-500 shadow-2xs hover:shadow-md transition-all duration-200 flex-col justify-between group h-full ${
                  isDesktopOnly ? 'hidden md:flex' : 'flex'
                }`}
              >
                {/* Product Image Container */}
                <div 
                  onClick={() => onSelectProduct(product)}
                  className="relative overflow-hidden bg-slate-100 cursor-pointer aspect-[4/3] w-full"
                >
                  <img
                    src={product.image}
                    alt={`${product.name} - Rajdeep Enterprises Mathura`}
                    width="400"
                    height="300"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />

                  {/* Badge */}
                  {product.badge && (
                    <div className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 z-10 pointer-events-none">
                      <span className="px-1.5 py-0.5 rounded text-[8px] sm:text-[9px] font-extrabold uppercase tracking-wider bg-orange-600 text-white shadow-xs">
                        {product.badge}
                      </span>
                    </div>
                  )}

                  {/* RFQ Quick Toggle on Image */}
                  {onAddToRfq && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddToRfq(product);
                      }}
                      aria-label={isAddedToRfq ? "In RFQ Cart" : "Add to RFQ Cart"}
                      title={isAddedToRfq ? "In RFQ Cart" : "Add to RFQ Cart"}
                      className={`absolute top-1.5 right-1.5 z-10 p-1 sm:p-1.5 rounded-lg text-xs font-bold transition shadow-xs flex items-center gap-1 ${
                        isAddedToRfq
                          ? 'bg-emerald-600 text-white'
                          : 'bg-white/95 hover:bg-white text-slate-700 hover:text-slate-950 border border-slate-200 backdrop-blur-xs'
                      }`}
                    >
                      {isAddedToRfq ? (
                        <Check className="w-3 h-3 text-white shrink-0" />
                      ) : (
                        <Plus className="w-3 h-3 text-slate-700 shrink-0" />
                      )}
                      <span className="text-[9px] font-extrabold pr-0.5 hidden xs:inline">RFQ</span>
                    </button>
                  )}

                  {/* Quick Preview Specs Overlay trigger on desktop */}
                  <div className="hidden sm:flex absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity items-center justify-center text-white text-xs font-bold gap-1 backdrop-blur-[1px]">
                    <Info className="w-3.5 h-3.5" />
                    <span>{lang === 'en' ? 'View Specifications' : 'विवरण देखें'}</span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-2.5 sm:p-3.5 flex flex-col justify-between flex-1">
                  <div>
                    <span className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider text-orange-600 block truncate leading-none mb-1">
                      {product.category}
                    </span>
                    
                    <h3
                      onClick={() => onSelectProduct(product)}
                      className="font-bold text-slate-900 text-xs sm:text-sm leading-snug group-hover:text-orange-600 transition-colors cursor-pointer line-clamp-2 min-h-[32px] sm:min-h-[38px] break-words"
                      title={product.name}
                    >
                      {product.name}
                    </h3>

                    {/* Key Spec Snippet on Desktop */}
                    {product.specifications && product.specifications.length > 0 && (
                      <p className="hidden sm:block text-[11px] text-slate-500 mt-1 line-clamp-1">
                        {product.specifications[0]}
                      </p>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center gap-1 sm:gap-1.5">
                    {/* View Details Button */}
                    <button
                      type="button"
                      onClick={() => onSelectProduct(product)}
                      className="flex-1 py-1.5 px-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] sm:text-xs font-bold transition flex items-center justify-center gap-1 min-h-[34px]"
                    >
                      <Info className="w-3 h-3 text-slate-500 shrink-0" />
                      <span>{lang === 'en' ? 'Specs' : 'विवरण'}</span>
                    </button>

                    {/* Request Quote Button */}
                    <button
                      type="button"
                      onClick={() => onEnquire(product.name)}
                      className="flex-1 py-1.5 px-2 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-[11px] sm:text-xs font-bold transition flex items-center justify-center gap-1 min-h-[34px]"
                      title="Request Quotation"
                    >
                      <FileText className="w-3 h-3 shrink-0" />
                      <span>{lang === 'en' ? 'Quote' : 'कोटेशन'}</span>
                    </button>

                    {/* WhatsApp Quick Chat */}
                    <a
                      href={`https://wa.me/${COMPANY_INFO.whatsappNumber}?text=${waMessage}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => trackWhatsAppClick('featured_product_card', product.name)}
                      className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition flex items-center justify-center min-h-[34px] min-w-[34px]"
                      aria-label={`Chat on WhatsApp about ${product.name}`}
                      title="Enquire on WhatsApp"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Clear CTA to View All Products */}
        <div className="mt-8 sm:mt-12 text-center">
          <div className="inline-flex flex-col items-center gap-2 max-w-xl mx-auto w-full">
            <button
              id="featured-view-all-products-btn"
              type="button"
              onClick={handleScrollToProducts}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 sm:px-8 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white font-bold text-sm sm:text-base shadow-sm hover:shadow-md transition-all group min-h-[44px]"
            >
              <span>{lang === 'en' ? 'View All Products' : 'सभी उत्पाद देखें'}</span>
              <span className="text-xs bg-slate-800 px-2 py-0.5 rounded-full text-orange-400 font-mono">
                30+ Items
              </span>
              <ArrowDown className="w-4 h-4 text-orange-400 group-hover:translate-y-0.5 transition-transform" />
            </button>
            
            <p className="text-xs text-slate-500 mt-1">
              {lang === 'en'
                ? 'Explore our complete catalogue with search, HSN filters, and category specifications.'
                : 'सर्च, HSN कोड फिल्टर और श्रेणी विनिर्देशों के साथ हमारा संपूर्ण कैटलॉग देखें।'}
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};
