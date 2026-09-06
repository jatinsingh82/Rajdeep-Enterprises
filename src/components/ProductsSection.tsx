import React, { useState, useMemo } from 'react';
import { Search, Filter, MessageCircle, Phone, Info, ShieldCheck, Check, Plus, Download, FileText, AlertCircle } from 'lucide-react';
import { PRODUCTS, PRODUCT_CATEGORIES, COMPANY_INFO } from '../data/companyData';
import { Product, Language } from '../types';
import { TRANSLATIONS } from '../data/extraData';

interface ProductsSectionProps {
  onSelectProduct: (product: Product) => void;
  onEnquire: (productName: string) => void;
  onAddToRfq?: (product: Product) => void;
  rfqProductIds?: string[];
  onDownloadPdf?: () => void;
  lang?: Language;
}

export const ProductsSection: React.FC<ProductsSectionProps> = ({
  onSelectProduct,
  onEnquire,
  onAddToRfq,
  rfqProductIds = [],
  onDownloadPdf,
  lang = 'en'
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All Products");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const t = TRANSLATIONS[lang];

  // Filter products based on Category & Search
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      const matchesCategory =
        selectedCategory === "All Products" || product.category === selectedCategory;
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.specifications.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <section id="products" className="py-16 md:py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-bold uppercase tracking-wider mb-3">
            Industrial Catalog
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Our Products
          </h2>
          <div className="w-16 h-1 bg-orange-500 mx-auto mt-4 rounded-full"></div>
          <p className="mt-4 text-base text-slate-600">
            Comprehensive safety accessories, welding consumables, Champion gaskets, site registers, stationery, power tools, and heavy machinery rental tailored for refineries, workshops, and project sites.
          </p>
        </div>

        {/* Search & Category Filter Controls */}
        <div className="mb-10 space-y-4">
          
          {/* Search bar & Quick Counts */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="products-search-input"
                type="text"
                placeholder="Search welding rods, DPT kit, gasket, registers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-xs sm:text-sm rounded-lg border border-slate-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none bg-slate-50 transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-bold"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="text-xs text-slate-500 font-medium">
                Showing <strong className="text-slate-900">{filteredProducts.length}</strong> industrial products
              </div>

              {onDownloadPdf && (
                <button
                  onClick={onDownloadPdf}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-xs font-bold text-slate-800 shadow-2xs transition"
                  title="Download complete printable catalogue"
                >
                  <Download className="w-3.5 h-3.5 text-orange-600" />
                  <span>{t.downloadCatalogue}</span>
                </button>
              )}
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-1 border-b border-slate-100 pb-4">
            {PRODUCT_CATEGORIES.map((cat) => (
              <button
                key={cat}
                id={`category-btn-${cat.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-slate-50 rounded-2xl border border-dashed border-slate-300 p-8">
            <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No products found</h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md mx-auto">
              No product matched "{searchQuery}". Rajdeep Enterprises supplies all types of custom industrial accessories and materials on demand.
            </p>
            <button
              onClick={() => onEnquire(`Custom Requirement: ${searchQuery}`)}
              className="mt-4 px-4 py-2 rounded-md text-xs font-bold bg-orange-600 text-white hover:bg-orange-500"
            >
              Enquire for Custom Material Supply
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl overflow-hidden border border-slate-200 hover:border-orange-500/80 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col group"
              >
                {/* Product Image */}
                <div className="relative h-48 sm:h-52 overflow-hidden bg-slate-100">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />

                  {/* Badges */}
                  <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start">
                    {product.badge && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-orange-600 text-white shadow-xs">
                        {product.badge}
                      </span>
                    )}
                  </div>

                  {product.isCardPhotoItem && (
                    <div className="absolute top-2.5 right-2.5 bg-slate-900/85 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-xs">
                      Reference Photo Item
                    </div>
                  )}

                  {/* Quick Preview Specs Overlay trigger */}
                  <button
                    onClick={() => onSelectProduct(product)}
                    className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1.5 backdrop-blur-[2px]"
                  >
                    <Info className="w-4 h-4" />
                    <span>View Specifications</span>
                  </button>
                </div>

                {/* Body Content */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-orange-600 block mb-1">
                      {product.category}
                    </span>
                    <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-orange-600 transition-colors">
                      {product.name}
                    </h3>
                    <p className="mt-2 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {product.shortDescription}
                    </p>

                    {/* Features sample */}
                    <div className="mt-3 space-y-1">
                      {product.specifications.slice(0, 2).map((spec, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-[11px] text-slate-600">
                          <Check className="w-3 h-3 text-orange-500 shrink-0" />
                          <span className="truncate">{spec}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Bar */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5">
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
                      id={`product-enquire-btn-${product.id}`}
                      onClick={() => onEnquire(product.name)}
                      className="flex-1 py-2 px-2.5 rounded-lg text-xs font-bold text-white bg-orange-600 hover:bg-orange-500 active:scale-95 transition flex items-center justify-center gap-1.5 shadow-2xs"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Enquire</span>
                    </button>

                    <button
                      id={`product-specs-btn-${product.id}`}
                      onClick={() => onSelectProduct(product)}
                      className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition"
                      title="View Full Specifications"
                    >
                      <Info className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add custom product note & easily expandable */}
        <div className="mt-12 p-6 rounded-2xl bg-slate-900 text-white flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h4 className="text-base sm:text-lg font-bold">
              Looking for a specific brand, size, or custom industrial supply?
            </h4>
            <p className="text-xs sm:text-sm text-slate-400">
              We regularly supply specialized safety equipment, refinery-approved materials, and custom consumables upon request.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <a
              id="catalog-call-direct-btn"
              href={`tel:${COMPANY_INFO.phone}`}
              className="px-4 py-2.5 rounded-lg text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 transition flex items-center gap-1.5"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call: {COMPANY_INFO.displayPhone}</span>
            </a>
            <button
              id="catalog-custom-enquiry-btn"
              onClick={() => onEnquire("Custom Material & Safety Requirement")}
              className="px-4 py-2.5 rounded-lg text-xs font-bold text-white bg-orange-600 hover:bg-orange-500 transition"
            >
              Request Custom Quote
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
