import React, { useState, useMemo, useEffect } from 'react';
import { Search, Filter, MessageCircle, Phone, Info, ShieldCheck, Check, Plus, Download, FileText, AlertCircle, Grid3X3, Grid2X2, LayoutGrid, Sparkles } from 'lucide-react';
import { PRODUCTS, PRODUCT_CATEGORIES, COMPANY_INFO } from '../data/companyData';
import { Product, Language } from '../types';
import { TRANSLATIONS } from '../data/extraData';
import { CATEGORY_SEO_DATA, getCategorySeo } from '../data/categorySeoData';
import { trackCategoryFilter, trackSearch, trackWhatsAppClick } from '../utils/analytics';

interface ProductsSectionProps {
  onSelectProduct: (product: Product) => void;
  onEnquire: (productName: string) => void;
  onAddToRfq?: (product: Product) => void;
  rfqProductIds?: string[];
  onDownloadPdf?: () => void;
  lang?: Language;
  selectedCategory?: string;
  onSelectCategory?: (cat: string) => void;
}

const SEARCH_SYNONYMS: Record<string, string[]> = {
  boot: ['shoe', 'footwear', 'gumboot'],
  boots: ['shoe', 'footwear', 'gumboots', 'shoes'],
  vest: ['jacket', 'reflective', 'hi-vis'],
  vests: ['jackets', 'reflective', 'hi-vis'],
  glasses: ['goggles', 'spectacles', 'eye'],
  hat: ['helmet', 'head'],
  hardhat: ['helmet', 'safety helmet'],
  belt: ['harness', 'fall protection', 'lanyard'],
  packing: ['gasket', 'sealant', 'jointing'],
  seal: ['gasket', 'jointing', 'silicone'],
  registers: ['stationery', 'register', 'copies', 'notebook'],
  electrodes: ['welding rods', 'welding', 'arc'],
  crack: ['dpt', 'dye penetrant', 'testing', 'ndt']
};

export const ProductsSection: React.FC<ProductsSectionProps> = ({
  onSelectProduct,
  onEnquire,
  onAddToRfq,
  rfqProductIds = [],
  onDownloadPdf,
  lang = 'en',
  selectedCategory: controlledCategory,
  onSelectCategory
}) => {
  const [internalCategory, setInternalCategory] = useState<string>("All Products");
  const selectedCategory = controlledCategory !== undefined ? controlledCategory : internalCategory;

  const handleCategoryChange = (cat: string) => {
    trackCategoryFilter(cat);
    if (onSelectCategory) {
      onSelectCategory(cat);
    } else {
      setInternalCategory(cat);
    }
  };

  const [searchQuery, setSearchQuery] = useState<string>("");
  // Density switcher: 'compact' (optimized responsive grid), 'detailed' (1-col mobile), or 'mini' (ultra-dense)
  const [density, setDensity] = useState<'mini' | 'compact' | 'detailed'>('compact');
  const t = TRANSLATIONS[lang];

  // Retrieve rich SEO metadata if a valid category is selected
  const categorySeo = useMemo(() => {
    return getCategorySeo(selectedCategory);
  }, [selectedCategory]);

  // Track search query with debounce
  useEffect(() => {
    if (!searchQuery.trim()) return;
    const timer = setTimeout(() => {
      trackSearch(searchQuery.trim(), filteredProducts.length);
    }, 600);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Enhanced Filter with multi-token matching and synonyms
  const filteredProducts = useMemo(() => {
    const rawTokens = searchQuery.toLowerCase().trim().split(/\s+/).filter(Boolean);

    // Expand search tokens with known industrial synonyms
    const expandedTokens = rawTokens.map(token => {
      const syns = SEARCH_SYNONYMS[token] || [];
      return [token, ...syns];
    });

    return PRODUCTS.filter((product) => {
      const matchesCategory =
        selectedCategory === "All Products" ||
        (selectedCategory === "Featured Safety" ? product.isFeatured : product.category === selectedCategory);

      if (!matchesCategory) return false;
      if (expandedTokens.length === 0) return true;

      const searchableText = [
        product.name,
        product.category,
        product.shortDescription,
        product.fullDescription,
        product.badge || '',
        product.commonUses,
        ...product.specifications
      ].join(' ').toLowerCase();

      // Every word group must have at least one synonym present
      return expandedTokens.every(tokenGroup => 
        tokenGroup.some(token => searchableText.includes(token))
      );
    });
  }, [selectedCategory, searchQuery]);

  return (
    <section id="products" className="py-10 sm:py-14 md:py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold uppercase tracking-wider mb-2 sm:mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-orange-600 shrink-0" />
            <span>Certified Industrial Supplies & PPE</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
            Product Specifications & Supply Catalogue
          </h2>
          <div className="w-12 sm:w-16 h-1 bg-orange-600 mx-auto mt-2.5 sm:mt-3 rounded-full"></div>
          <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed px-1">
            Safety accessories, welding consumables, Champion gaskets, site registers, stationery, power tools, and heavy machinery for refineries and workshops. Order any quantity with pan-India supply.
          </p>
        </div>

        {/* Search, Density Switcher & Category Controls */}
        <div className="mb-6 sm:mb-8 space-y-3 sm:space-y-4">
          
          {/* Search bar & Mobile View Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative w-full sm:w-96">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="products-search-input"
                type="text"
                placeholder="Search safety shoes, helmets, gloves, welding..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full min-h-[44px] pl-10 pr-10 py-2.5 text-sm rounded-xl border border-slate-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none bg-slate-50 transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 text-xs font-bold transition"
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Layout Density Selector & Catalogue Download */}
            <div className="flex items-center justify-between gap-2">
              <div className="inline-flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200">
                <button
                  onClick={() => setDensity('compact')}
                  className={`min-h-[38px] flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    density === 'compact'
                      ? 'bg-orange-600 text-white shadow-xs'
                      : 'text-slate-700 hover:text-slate-900'
                  }`}
                  title="Grid view (2 items per row)"
                >
                  <Grid2X2 className="w-3.5 h-3.5" />
                  <span>Grid</span>
                </button>

                <button
                  onClick={() => setDensity('detailed')}
                  className={`min-h-[38px] flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    density === 'detailed'
                      ? 'bg-orange-600 text-white shadow-xs'
                      : 'text-slate-700 hover:text-slate-900'
                  }`}
                  title="1 Column (Large detailed view)"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>1 in Row</span>
                </button>

                <button
                  onClick={() => setDensity('mini')}
                  className={`hidden sm:flex min-h-[38px] items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    density === 'mini'
                      ? 'bg-orange-600 text-white shadow-xs'
                      : 'text-slate-700 hover:text-slate-900'
                  }`}
                  title="Dense mini grid"
                >
                  <Grid3X3 className="w-3.5 h-3.5" />
                  <span>Dense</span>
                </button>
              </div>

              {onDownloadPdf && (
                <button
                  onClick={onDownloadPdf}
                  className="min-h-[38px] inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-xs font-bold text-slate-800 shadow-2xs transition"
                  title="Download complete printable catalogue"
                >
                  <Download className="w-3.5 h-3.5 text-orange-600" />
                  <span className="hidden sm:inline">{t.downloadCatalogue}</span>
                  <span className="sm:hidden">PDF</span>
                </button>
              )}
            </div>
          </div>

          {/* Category Filter - Clean horizontal scrolling pills with subtle active states */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 scrollbar-none">
            {PRODUCT_CATEGORIES.map((cat) => (
              <button
                key={cat}
                id={`category-btn-${cat.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                onClick={() => handleCategoryChange(cat)}
                className={`min-h-[40px] px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all shrink-0 border ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                    : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Category SEO Overview Card */}
        {categorySeo && selectedCategory !== "All Products" && selectedCategory !== "Featured Safety" && (
          <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-6 border border-slate-800 shadow-md space-y-4 mb-8">
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
              <div className="space-y-2 max-w-3xl">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] sm:text-xs font-black uppercase tracking-wider bg-orange-600 text-white">
                    Category Guide
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    {filteredProducts.length} Industrial Items Cataloged & Sourced
                  </span>
                </div>
                <h3 className="text-lg sm:text-2xl font-black text-white">
                  {categorySeo.heading}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {categorySeo.summary}
                </p>
              </div>

              <div className="flex flex-row lg:flex-col gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => onEnquire(`Category Quotation: ${selectedCategory}`)}
                  className="min-h-[44px] px-4 py-2 rounded-xl text-xs font-bold bg-orange-600 hover:bg-orange-700 text-white transition flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Request Category RFQ</span>
                </button>
                <a
                  href={`https://wa.me/${COMPANY_INFO.whatsappNumber}?text=${encodeURIComponent(`Hello Rajdeep Enterprises, I need pricing and availability for *${selectedCategory}*. Please share catalogue.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackWhatsAppClick('category_seo_card', selectedCategory)}
                  className="min-h-[44px] px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp Enquiry</span>
                </a>
              </div>
            </div>

            {/* Target Applications and Standards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-slate-800 text-xs">
              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block mb-1">
                  Primary Field Users & Work Environments:
                </span>
                <p className="text-slate-300 text-xs leading-relaxed">
                  {categorySeo.audience}
                </p>
              </div>
              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                  Applicable Indian & International Standards:
                </span>
                <p className="text-slate-300 text-xs font-mono leading-relaxed">
                  {categorySeo.standards}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-10 sm:py-14 bg-slate-50 rounded-2xl border border-dashed border-slate-300 p-6 space-y-4 max-w-2xl mx-auto">
            <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">
                No products found matching "{searchQuery}"
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-md mx-auto">
                We supply safety gear, welding, gaskets, tools, and industrial materials across all 28 states. We can source custom specifications on-demand.
              </p>
            </div>

            {/* Popular Suggested Categories */}
            <div className="pt-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                Browse Popular Categories:
              </span>
              <div className="flex flex-wrap items-center justify-center gap-2">
                {["Personal Protective Equipment (PPE)", "Welding & NDT Testing", "Hardware, Gaskets & Sealants", "Industrial Safety & Fall Protection"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setSearchQuery("");
                      handleCategoryChange(cat);
                    }}
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:border-orange-500 hover:text-orange-600 transition"
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Direct Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  handleCategoryChange("All Products");
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-200 hover:bg-slate-300 text-slate-800 transition min-h-[44px]"
              >
                Clear Search & Show All Products
              </button>
              <button
                type="button"
                onClick={() => onEnquire(`Custom Material Sourcing: ${searchQuery}`)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-orange-600 hover:bg-orange-700 text-white transition min-h-[44px]"
              >
                Request Custom Sourcing
              </button>
            </div>
          </div>
        ) : (
          <div
            className={`grid transition-all duration-200 ${
              density === 'mini'
                ? 'grid-cols-2 xs:grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3.5'
                : density === 'compact'
                ? 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-5'
                : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6'
            }`}
          >
            {filteredProducts.map((product) => {
              const waMessage = encodeURIComponent(
                `Hello Rajdeep Enterprises, I am interested in ${product.name}. Please share the price and availability.`
              );

              return (
                <div
                  key={product.id}
                  className="bg-white rounded-xl sm:rounded-2xl overflow-hidden border border-slate-200 hover:border-orange-500/80 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col group justify-between"
                >
                  {/* Product Image & Badges */}
                  <div
                    onClick={() => onSelectProduct(product)}
                    className={`relative overflow-hidden bg-slate-100 cursor-pointer ${
                      density === 'mini'
                        ? 'h-20 sm:h-32'
                        : density === 'compact'
                        ? 'h-24 xs:h-28 sm:h-48'
                        : 'h-40 sm:h-56'
                    }`}
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

                    {/* Badges */}
                    {product.badge && density !== 'mini' && (
                      <div className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2">
                        <span className="px-1.5 py-0.5 sm:px-2 rounded text-[9px] sm:text-[10px] font-bold uppercase tracking-wider bg-orange-600 text-white shadow-xs">
                          {product.badge}
                        </span>
                      </div>
                    )}

                    {product.isCardPhotoItem && (
                      <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 bg-slate-900/85 text-amber-300 text-[8px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded backdrop-blur-xs">
                        Refinery Grade
                      </div>
                    )}

                    {/* Quick Preview Specs Overlay trigger on desktop */}
                    <div className="hidden sm:flex absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity items-center justify-center text-white text-xs font-bold gap-1 backdrop-blur-[1px]">
                      <Info className="w-3.5 h-3.5" />
                      <span>View Specs</span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className={`flex flex-col justify-between flex-1 ${density === 'mini' ? 'p-2' : 'p-2.5 sm:p-4'}`}>
                    <div>
                      <span className="text-[10px] sm:text-[10px] font-extrabold uppercase tracking-wider text-orange-600 block line-clamp-1">
                        {product.category}
                      </span>
                      <h3
                        onClick={() => onSelectProduct(product)}
                        className={`font-bold text-slate-900 leading-snug group-hover:text-orange-600 transition-colors cursor-pointer mt-1 break-words ${
                          density === 'mini'
                            ? 'text-[11px] sm:text-xs min-h-[28px] line-clamp-2'
                            : density === 'compact'
                            ? 'text-xs sm:text-sm min-h-[32px] sm:min-h-[36px] line-clamp-2'
                            : 'text-sm sm:text-base'
                        }`}
                        title={product.name}
                      >
                        {product.name}
                      </h3>

                      {/* Description / Specifications */}
                      {density !== 'mini' && (
                        <p className="mt-1 text-xs text-slate-500 leading-relaxed break-words hidden sm:block">
                          {product.shortDescription}
                        </p>
                      )}

                      {density === 'detailed' && (
                        <div className="mt-2.5 space-y-1">
                          {product.specifications.slice(0, 2).map((spec, i) => (
                            <div key={i} className="flex items-center gap-1.5 text-xs text-slate-600">
                              <Check className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                              <span className="break-words">{spec}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Action Bar: Two clear buttons [ Enquire ] & [ WhatsApp ] */}
                    <div className={`border-t border-slate-100 flex flex-col gap-1.5 ${
                      density === 'mini' ? 'mt-1.5 pt-1.5' : 'mt-2 sm:mt-3 pt-2 sm:pt-2.5'
                    }`}>
                      <div className="grid grid-cols-2 gap-1.5">
                        <button
                          id={`product-enquire-btn-${product.id}`}
                          onClick={() => onEnquire(product.name)}
                          className="min-h-[38px] sm:min-h-[44px] rounded-lg sm:rounded-xl font-bold text-white bg-orange-600 hover:bg-orange-700 active:bg-orange-800 transition flex items-center justify-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs shadow-2xs"
                          title={`Get Price for ${product.name}`}
                          type="button"
                        >
                          <MessageCircle className="w-3.5 h-3.5 shrink-0" />
                          <span className="whitespace-nowrap">Enquire</span>
                        </button>

                        <a
                          id={`product-whatsapp-btn-${product.id}`}
                          href={`https://wa.me/${COMPANY_INFO.whatsappNumber}?text=${waMessage}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="min-h-[38px] sm:min-h-[44px] rounded-lg sm:rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 transition flex items-center justify-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs shadow-2xs"
                          title={`WhatsApp Rajdeep Enterprises for ${product.name}`}
                        >
                          <MessageCircle className="w-3.5 h-3.5 shrink-0" />
                          <span className="whitespace-nowrap">WhatsApp</span>
                        </a>
                      </div>

                      {density !== 'mini' && onAddToRfq && (
                        <button
                          type="button"
                          onClick={() => onAddToRfq(product)}
                          className={`w-full min-h-[34px] sm:min-h-[40px] py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[10px] sm:text-[11px] font-bold transition flex items-center justify-center gap-1 sm:gap-1.5 ${
                            rfqProductIds.includes(product.id)
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                              : 'text-slate-700 hover:bg-slate-100 border border-slate-300'
                          }`}
                        >
                          {rfqProductIds.includes(product.id) ? (
                            <>
                              <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-600" />
                              <span>Added to RFQ</span>
                            </>
                          ) : (
                            <>
                              <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-500" />
                              <span>+ Add to RFQ</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Custom product note */}
        <div className="mt-8 sm:mt-12 p-4 sm:p-6 rounded-2xl bg-slate-900 text-white flex flex-col md:flex-row items-center justify-between gap-4 border border-slate-800 shadow-sm">
          <div className="space-y-1 text-center md:text-left">
            <h4 className="text-sm sm:text-base font-bold">
              Looking for a specific brand, size, or custom industrial supply?
            </h4>
            <p className="text-xs text-slate-400">
              We supply specialized safety equipment, refinery-approved materials, and custom consumables upon request.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2.5 shrink-0 w-full sm:w-auto">
            <a
              id="catalog-call-direct-btn"
              href={`tel:${COMPANY_INFO.phone}`}
              className="min-h-[44px] px-4 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 transition flex items-center justify-center gap-1.5 text-center"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call: {COMPANY_INFO.displayPhone}</span>
            </a>
            <button
              id="catalog-custom-enquiry-btn"
              onClick={() => onEnquire("Custom Material & Safety Requirement")}
              className="min-h-[44px] px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 active:bg-orange-800 transition text-center"
            >
              Request Custom Quote
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
