import React, { useState, useMemo } from 'react';
import { Search, Filter, MessageCircle, Phone, Info, ShieldCheck, Check, Plus, Download, FileText, AlertCircle, Grid3X3, Grid2X2, LayoutGrid } from 'lucide-react';
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
  // Density switcher: 'mini' (3-4 in a row on mobile), 'compact' (2 in a row), or 'detailed'
  const [density, setDensity] = useState<'mini' | 'compact' | 'detailed'>('mini');
  const t = TRANSLATIONS[lang];

  // Filter products based on Category & Search
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      const matchesCategory =
        selectedCategory === "All Products" ||
        (selectedCategory === "Featured Safety" ? product.isFeatured : product.category === selectedCategory);
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.specifications.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <section id="products" className="py-12 md:py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-2 sm:mb-3">
            Industrial Catalog
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Our Products
          </h2>
          <div className="w-16 h-1 bg-orange-500 mx-auto mt-3 rounded-full"></div>
          <p className="mt-3 text-xs sm:text-base text-slate-600 leading-relaxed px-2">
            Safety accessories, welding consumables, Champion gaskets, site registers, stationery, power tools, and heavy machinery for refineries and workshops. Order any quantity with pan-India supply.
          </p>
        </div>

        {/* Search, Density Switcher & Category Controls */}
        <div className="mb-6 sm:mb-10 space-y-3 sm:space-y-4">
          
          {/* Search bar & Mobile Density Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="products-search-input"
                type="text"
                placeholder="Search welding rods, DPT kit, gasket..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none bg-slate-50 transition"
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

            {/* Density Selector & Catalogue Download */}
            <div className="flex items-center justify-between w-full sm:w-auto gap-2">
              {/* Density Toggle Pills */}
              <div className="inline-flex items-center p-0.5 rounded-lg bg-slate-100 border border-slate-200">
                <button
                  onClick={() => setDensity('mini')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold transition ${
                    density === 'mini'
                      ? 'bg-orange-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="3-4 in a row (Compact Mini - shows 3-4 rows on screen)"
                >
                  <Grid3X3 className="w-3.5 h-3.5" />
                  <span>3 in Row (Mini)</span>
                </button>
                <button
                  onClick={() => setDensity('compact')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold transition ${
                    density === 'compact'
                      ? 'bg-orange-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="2 in a row (Compact grid)"
                >
                  <Grid2X2 className="w-3.5 h-3.5" />
                  <span>2 in Row</span>
                </button>
                <button
                  onClick={() => setDensity('detailed')}
                  className={`hidden sm:flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-bold transition ${
                    density === 'detailed'
                      ? 'bg-orange-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Full details view"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>Detailed</span>
                </button>
              </div>

              {onDownloadPdf && (
                <button
                  onClick={onDownloadPdf}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-[11px] font-bold text-slate-800 shadow-2xs transition"
                  title="Download complete printable catalogue"
                >
                  <Download className="w-3.5 h-3.5 text-orange-600" />
                  <span className="hidden sm:inline">{t.downloadCatalogue}</span>
                  <span className="sm:hidden">PDF</span>
                </button>
              )}
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none pt-1">
            {PRODUCT_CATEGORIES.map((cat) => (
              <button
                key={cat}
                id={`category-btn-${cat.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-[11px] sm:text-xs font-bold whitespace-nowrap transition-all shrink-0 ${
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
          <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-300 p-6">
            <AlertCircle className="w-10 h-10 text-slate-400 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-800">No products found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              No product matched "{searchQuery}". Rajdeep Enterprises supplies any custom industrial material on demand.
            </p>
            <button
              onClick={() => onEnquire(`Custom Requirement: ${searchQuery}`)}
              className="mt-3 px-3.5 py-2 rounded-md text-xs font-bold bg-orange-600 text-white hover:bg-orange-500"
            >
              Enquire for Custom Material Supply
            </button>
          </div>
        ) : (
          <div
            className={`grid transition-all duration-200 ${
              density === 'mini'
                ? 'grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3.5'
                : density === 'compact'
                ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 sm:gap-4'
                : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6'
            }`}
          >
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl overflow-hidden border border-slate-200 hover:border-orange-500/80 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col group justify-between"
              >
                {/* Product Image & Badges */}
                <div
                  onClick={() => onSelectProduct(product)}
                  className={`relative overflow-hidden bg-slate-100 cursor-pointer ${
                    density === 'mini'
                      ? 'h-24 sm:h-32'
                      : density === 'compact'
                      ? 'h-32 sm:h-44'
                      : 'h-48 sm:h-52'
                  }`}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />

                  {/* Badges */}
                  {product.badge && density !== 'mini' && (
                    <div className="absolute top-1.5 left-1.5">
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-orange-600 text-white shadow-xs">
                        {product.badge}
                      </span>
                    </div>
                  )}

                  {product.isCardPhotoItem && (
                    <div className="absolute top-1.5 right-1.5 bg-slate-900/85 text-amber-300 text-[9px] font-bold px-1.5 py-0.5 rounded backdrop-blur-xs">
                      Photo Ref
                    </div>
                  )}

                  {/* Quick Preview Specs Overlay trigger on desktop */}
                  <div className="hidden sm:flex absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity items-center justify-center text-white text-xs font-bold gap-1 backdrop-blur-[1px]">
                    <Info className="w-3.5 h-3.5" />
                    <span>View Specs</span>
                  </div>
                </div>

                {/* Card Content */}
                <div className={`flex flex-col justify-between flex-1 ${density === 'mini' ? 'p-2' : 'p-3 sm:p-4'}`}>
                  <div>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-orange-600 block truncate">
                      {product.category}
                    </span>
                    <h3
                      onClick={() => onSelectProduct(product)}
                      className={`font-bold text-slate-900 leading-tight group-hover:text-orange-600 transition-colors cursor-pointer mt-0.5 ${
                        density === 'mini'
                          ? 'text-[11px] sm:text-xs line-clamp-2 h-7 sm:h-8'
                          : 'text-xs sm:text-sm line-clamp-2'
                      }`}
                      title={product.name}
                    >
                      {product.name}
                    </h3>

                    {density === 'detailed' && (
                      <>
                        <p className="mt-1.5 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                          {product.shortDescription}
                        </p>
                        <div className="mt-2 space-y-1">
                          {product.specifications.slice(0, 2).map((spec, i) => (
                            <div key={i} className="flex items-center gap-1 text-[11px] text-slate-600 truncate">
                              <Check className="w-3 h-3 text-orange-500 shrink-0" />
                              <span className="truncate">{spec}</span>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Action Bar */}
                  <div className={`border-t border-slate-100 flex items-center gap-1 ${
                    density === 'mini' ? 'mt-2 pt-1.5' : 'mt-3 pt-2.5'
                  }`}>
                    {onAddToRfq && (
                      <button
                        onClick={() => onAddToRfq(product)}
                        title="Add to Bulk RFQ List"
                        className={`p-1.5 rounded text-xs font-bold transition flex items-center justify-center shrink-0 ${
                          rfqProductIds.includes(product.id)
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200'
                        }`}
                      >
                        {rfqProductIds.includes(product.id) ? (
                          <Check className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <Plus className="w-3 h-3 text-slate-700" />
                        )}
                        <span className="text-[10px] hidden sm:inline ml-0.5">RFQ</span>
                      </button>
                    )}

                    <button
                      id={`product-enquire-btn-${product.id}`}
                      onClick={() => onEnquire(product.name)}
                      className={`flex-1 rounded font-bold text-white bg-orange-600 hover:bg-orange-500 active:scale-95 transition flex items-center justify-center gap-1 shadow-2xs ${
                        density === 'mini'
                          ? 'py-1 px-1.5 text-[10px]'
                          : 'py-1.5 px-2 text-xs'
                      }`}
                    >
                      <MessageCircle className="w-3 h-3 shrink-0" />
                      <span>Enquire</span>
                    </button>

                    {density !== 'mini' && (
                      <button
                        id={`product-specs-btn-${product.id}`}
                        onClick={() => onSelectProduct(product)}
                        className="p-1.5 rounded text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition"
                        title="View Full Specifications"
                      >
                        <Info className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Custom product note */}
        <div className="mt-8 sm:mt-12 p-4 sm:p-6 rounded-xl bg-slate-900 text-white flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center md:text-left">
            <h4 className="text-sm sm:text-base font-bold">
              Looking for a specific brand, size, or custom industrial supply?
            </h4>
            <p className="text-xs text-slate-400">
              We supply specialized safety equipment, refinery-approved materials, and custom consumables upon request.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2.5 shrink-0">
            <a
              id="catalog-call-direct-btn"
              href={`tel:${COMPANY_INFO.phone}`}
              className="px-3.5 py-2 rounded-lg text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 transition flex items-center gap-1.5"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call: {COMPANY_INFO.displayPhone}</span>
            </a>
            <button
              id="catalog-custom-enquiry-btn"
              onClick={() => onEnquire("Custom Material & Safety Requirement")}
              className="px-3.5 py-2 rounded-lg text-xs font-bold text-white bg-orange-600 hover:bg-orange-500 transition"
            >
              Request Custom Quote
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
