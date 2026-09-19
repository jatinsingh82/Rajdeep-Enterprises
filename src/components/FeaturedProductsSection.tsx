import React from 'react';
import { Star, ArrowRight, ShieldCheck, Check, Plus, Info, FileText } from 'lucide-react';
import { PRODUCTS } from '../data/companyData';
import { Product, Language } from '../types';

interface FeaturedProductsSectionProps {
  onSelectProduct: (product: Product) => void;
  onEnquire: (productName: string) => void;
  onAddToRfq?: (product: Product) => void;
  rfqProductIds?: string[];
  lang?: Language;
}

export const FeaturedProductsSection: React.FC<FeaturedProductsSectionProps> = ({
  onSelectProduct,
  onEnquire,
  onAddToRfq,
  rfqProductIds = [],
  lang = 'en'
}) => {
  // Select top real featured products from existing company catalogue
  const featuredProducts = PRODUCTS.filter((p) => p.isFeatured).slice(0, 8);

  const handleScrollToCatalogue = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const el = document.getElementById('products');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      try {
        window.history.pushState(null, '', '#products');
      } catch {
        window.location.hash = 'products';
      }
    }
  };

  return (
    <section
      id="featured"
      className="pt-6 pb-8 sm:py-10 md:py-14 bg-slate-50/80 border-b border-slate-200/80 relative"
      aria-labelledby="featured-products-heading"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-4 sm:mb-7">
          <div className="text-left">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-orange-100 border border-orange-200 text-orange-900 text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-1.5">
              <Star className="w-3 h-3 text-orange-600 fill-orange-500 shrink-0" />
              <span>{lang === 'en' ? 'Refinery Approved & High Demand' : 'रिफाइनरी स्वीकृत एवं मुख्य उत्पाद'}</span>
            </div>
            <h2
              id="featured-products-heading"
              className="text-lg sm:text-2xl md:text-3xl font-black text-slate-900 tracking-tight"
            >
              {lang === 'en' ? 'Featured Industrial Products' : 'विशेष औद्योगिक उत्पाद'}
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
              Essential safety gear, certified PPE, and refinery-ready consumables available for immediate dispatch at Mathura Refinery Gate.
            </p>
          </div>

          {/* Desktop View All CTA */}
          <div className="hidden sm:block shrink-0">
            <a
              id="featured-view-all-desktop-btn"
              href="#products"
              onClick={handleScrollToCatalogue}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-800 bg-white hover:bg-slate-100 border border-slate-300 shadow-2xs hover:border-orange-500 hover:text-orange-600 transition"
            >
              <span>{lang === 'en' ? 'View All Products' : 'सभी उत्पाद देखें'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Featured Products Grid
            - Mobile (320px–430px): Shows ONLY top 4 products in a concise 2x2 grid (items index >= 4 are hidden on mobile)
            - Tablet/Desktop (>= 640px): Shows full 8 featured products (2 cols on sm, 3 on md, 4 on lg/xl)
            - No horizontal scrolling
        */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 md:gap-5">
          {featuredProducts.map((product, idx) => {
            const isAddedToRfq = rfqProductIds.includes(product.id);
            // Hide items beyond 4 on mobile (< sm) to keep mobile homepage concise and avoid unnecessary length
            const isHiddenOnMobile = idx >= 4;

            return (
              <div
                key={product.id}
                id={`featured-card-${product.id}`}
                className={`${
                  isHiddenOnMobile ? 'hidden sm:flex' : 'flex'
                } flex-col justify-between bg-white rounded-xl sm:rounded-2xl border border-slate-200 hover:border-orange-500/80 shadow-2xs hover:shadow-md transition-all duration-200 overflow-hidden group h-full`}
              >
                {/* Product Image & Badges */}
                <div
                  onClick={() => onSelectProduct(product)}
                  className="relative overflow-hidden bg-slate-100 cursor-pointer aspect-[4/3] w-full"
                >
                  <img
                    src={product.image}
                    alt={`${product.name} - ${product.category} supplied by Rajdeep Enterprises Mathura`}
                    width="400"
                    height="300"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />

                  {/* Badge */}
                  {product.badge && (
                    <div className="absolute top-1.5 left-1.5 z-10 pointer-events-none">
                      <span className="px-1.5 py-0.5 rounded text-[8px] sm:text-[9px] font-bold uppercase tracking-wider bg-orange-600 text-white shadow-xs">
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
                      className={`absolute top-1.5 right-1.5 z-10 p-1 sm:p-1.5 rounded-lg text-xs font-bold transition shadow-xs flex items-center gap-0.5 ${
                        isAddedToRfq
                          ? 'bg-emerald-600 text-white'
                          : 'bg-white/95 hover:bg-white text-slate-700 hover:text-slate-950 border border-slate-200'
                      }`}
                    >
                      {isAddedToRfq ? (
                        <Check className="w-3 h-3 text-white shrink-0" />
                      ) : (
                        <Plus className="w-3 h-3 text-slate-700 shrink-0" />
                      )}
                      <span className="text-[9px] font-extrabold pr-0.5 hidden min-[380px]:inline">RFQ</span>
                    </button>
                  )}

                  {/* Desktop Hover View Specs */}
                  <div className="hidden sm:flex absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity items-center justify-center text-white text-xs font-bold gap-1 backdrop-blur-[1px]">
                    <Info className="w-3.5 h-3.5" />
                    <span>View Specs</span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-2 sm:p-3 flex flex-col justify-between flex-1">
                  <div>
                    <span className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider text-orange-600 block truncate leading-none mb-1">
                      {product.category}
                    </span>
                    <h3
                      onClick={() => onSelectProduct(product)}
                      className="font-bold text-slate-900 leading-snug group-hover:text-orange-600 transition-colors cursor-pointer text-xs sm:text-sm line-clamp-2 min-h-[30px] sm:min-h-[36px] break-words"
                      title={product.name}
                    >
                      {product.name}
                    </h3>
                  </div>

                  {/* Action Controls: Compact & Touch-friendly */}
                  <div className="pt-2 sm:pt-2.5 mt-auto flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => onSelectProduct(product)}
                      className="flex-1 min-h-[34px] sm:min-h-[36px] px-2 py-1 rounded-lg text-[11px] sm:text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition text-center"
                    >
                      Details
                    </button>
                    <button
                      type="button"
                      onClick={() => onEnquire(product.name)}
                      className="flex-1 min-h-[34px] sm:min-h-[36px] px-2 py-1 rounded-lg text-[11px] sm:text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 active:bg-orange-800 shadow-2xs transition text-center"
                    >
                      Quote
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Clear "View All Products" CTA (prominent on mobile to direct users to the full catalogue) */}
        <div className="mt-4 sm:mt-8 pt-3 sm:pt-0 text-center">
          <a
            id="featured-view-all-mobile-cta"
            href="#products"
            onClick={handleScrollToCatalogue}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 min-h-[44px] px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-slate-900 bg-white hover:bg-slate-100 active:bg-slate-200 border border-slate-300 shadow-xs hover:border-orange-500 hover:text-orange-600 transition group"
          >
            <span>{lang === 'en' ? 'View All Products & Full Catalogue' : 'सभी उत्पाद व संपूर्ण कैटलॉग देखें'}</span>
            <ArrowRight className="w-4 h-4 text-orange-600 group-hover:translate-x-0.5 transition-transform" />
          </a>
        </div>
      </div>
    </section>
  );
};
