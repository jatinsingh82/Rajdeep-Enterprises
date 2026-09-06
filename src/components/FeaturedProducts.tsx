import React from 'react';
import { ArrowRight, ShieldCheck, MessageCircle, Phone, Sparkles, Plus, Check } from 'lucide-react';
import { PRODUCTS, COMPANY_INFO } from '../data/companyData';
import { Product } from '../types';

interface FeaturedProductsProps {
  onSelectProduct: (product: Product) => void;
  onEnquire: (productName: string) => void;
  onAddToRfq?: (product: Product) => void;
  rfqProductIds?: string[];
}

export const FeaturedProducts: React.FC<FeaturedProductsProps> = ({
  onSelectProduct,
  onEnquire,
  onAddToRfq,
  rfqProductIds = []
}) => {
  // Grab top featured products (6 items from the reference photo)
  const featured = PRODUCTS.filter((p) => p.isFeatured).slice(0, 6);

  return (
    <section id="featured" className="py-16 bg-slate-50 relative border-t border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              High-Demand Industrial Safety
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Featured Safety Products
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-2xl">
              Essential protective equipment and workplace accessories frequently supplied to Mathura Refinery contractors, fabrication yards, and construction sites.
            </p>
          </div>

          <a
            id="featured-view-all-link"
            href="#products"
            className="inline-flex items-center gap-2 text-sm font-bold text-orange-600 hover:text-orange-700 transition"
          >
            <span>View Complete Catalogue</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        {/* Product Grid: 3-4 on desktop, 2 on tablet, 1 on mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {featured.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-orange-400 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
            >
              {/* Image Container with Zoom effect */}
              <div className="relative h-56 sm:h-60 overflow-hidden bg-slate-100">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                
                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
                  {product.badge && (
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-extrabold uppercase tracking-wide bg-orange-600 text-white shadow-sm">
                      {product.badge}
                    </span>
                  )}
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-semibold bg-slate-900/80 text-white backdrop-blur-sm">
                    {product.category.split(' ')[0]}
                  </span>
                </div>

                {/* Card photo badge indicator */}
                {product.isCardPhotoItem && (
                  <div className="absolute bottom-2 right-2 bg-slate-900/90 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded border border-amber-400/40">
                    Official Catalog Item
                  </div>
                )}
              </div>

              {/* Content Box */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
                    {product.name}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
                    {product.shortDescription}
                  </p>

                  {/* Highlights pills */}
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {product.specifications.slice(0, 2).map((spec, i) => (
                      <span
                        key={i}
                        className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium truncate max-w-full"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    id={`featured-details-btn-${product.id}`}
                    onClick={() => onSelectProduct(product)}
                    className="text-xs font-semibold text-slate-700 hover:text-slate-900 py-1.5 px-2.5 rounded hover:bg-slate-100 transition"
                  >
                    Specs
                  </button>

                  <div className="flex items-center gap-1.5">
                    {onAddToRfq && (
                      <button
                        onClick={() => onAddToRfq(product)}
                        title="Add to Bulk RFQ List"
                        className={`p-2 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                          rfqProductIds.includes(product.id)
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200'
                        }`}
                      >
                        {rfqProductIds.includes(product.id) ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Plus className="w-3.5 h-3.5 text-slate-700" />
                        )}
                        <span className="text-[11px] hidden sm:inline">RFQ</span>
                      </button>
                    )}

                    <button
                      id={`featured-enquire-btn-${product.id}`}
                      onClick={() => onEnquire(product.name)}
                      className="px-3.5 py-2 rounded-lg text-xs font-bold text-white bg-orange-600 hover:bg-orange-500 shadow-sm transition active:scale-95 flex items-center gap-1.5"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Enquire</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom prompt */}
        <div className="mt-12 text-center">
          <div className="inline-flex flex-wrap items-center justify-center gap-3 p-4 rounded-xl bg-white border border-slate-200 shadow-sm text-xs sm:text-sm text-slate-700">
            <span className="font-semibold text-slate-900">Need specific sizes, bulk bulk quantity or custom material supplies?</span>
            <button
              onClick={() => onEnquire('General Safety / Material Bulk Enquiry')}
              className="text-orange-600 hover:text-orange-700 font-bold underline decoration-orange-300 underline-offset-4"
            >
              Ask for Custom Quote &rarr;
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
