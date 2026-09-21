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
    <section id="products" className="pt-3 pb-8 sm:py-12 md:py-16 bg-white relative">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-2.5 sm:mb-8">
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-800 text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-1 sm:mb-2.5">
            <ShieldCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-orange-600 shrink-0" />
            <span>{lang === 'en' ? 'Our Products & Industrial Supplies' : 'हमारे उत्पाद एवं औद्योगिक आपूर्ति'}</span>
          </div>
          <h2 className="text-lg sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight">
            {lang === 'en' ? 'Product Specifications & Supply Catalogue' : 'उत्पाद विनिर्देश एवं आपूर्ति कैटलॉग'}
          </h2>
          <div className="w-10 sm:w-16 h-0.5 sm:h-1 bg-orange-600 mx-auto mt-1 sm:mt-3 rounded-full"></div>
          <p className="mt-1 sm:mt-3 text-xs sm:text-sm md:text-base text-slate-600 leading-relaxed px-1 line-clamp-2 sm:line-clamp-none">
            Safety accessories, welding consumables, Champion gaskets, site registers, stationery, power tools, and heavy machinery for refineries and workshops. Order any quantity with pan-India supply.
          </p>
        </div>

        {/* Search, Density Switcher & Category Controls */}
        <div className="mb-2.5 sm:mb-7 space-y-1.5 sm:space-y-4">
          
          {/* Search bar & Action Controls */}
          <div className="flex items-center justify-between gap-2 sm:gap-3">
            <div className="relative flex-1 sm:w-96 sm:flex-initial">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="products-search-input"
                type="text"
                placeholder="Search safety shoes, helmets, gloves, welding..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-9 sm:h-10 pl-9 pr-8 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none bg-slate-50 transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 text-xs font-bold transition"
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Layout Density Selector on desktop & Catalogue Download */}
            <div className="flex items-center gap-2">
              <div className="hidden sm:inline-flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200">
                <button
                  onClick={() => setDensity('compact')}
                  className={`min-h-[34px] sm:min-h-[38px] flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs font-bold transition ${
                    density === 'compact'
                      ? 'bg-orange-600 text-white shadow-xs'
                      : 'text-slate-700 hover:text-slate-900'
                  }`}
                  title="Grid view"
                >
                  <Grid2X2 className="w-3.5 h-3.5" />
                  <span>Grid</span>
                </button>

                <button
                  onClick={() => setDensity('detailed')}
                  className={`min-h-[34px] sm:min-h-[38px] flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs font-bold transition ${
                    density === 'detailed'
                      ? 'bg-orange-600 text-white shadow-xs'
                      : 'text-slate-700 hover:text-slate-900'
                  }`}
                  title="Detailed view"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>Detailed</span>
                </button>

                <button
                  onClick={() => setDensity('mini')}
                  className={`hidden md:flex min-h-[38px] items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
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
                  id="products-download-pdf-btn"
                  onClick={onDownloadPdf}
                  className="h-9 sm:h-10 inline-flex items-center gap-1.5 px-2.5 sm:px-3 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-xs font-bold text-slate-800 shadow-2xs transition shrink-0"
                  title="Download complete printable catalogue"
                >
                  <Download className="w-3.5 h-3.5 text-orange-600" />
                  <span className="hidden sm:inline">{t.downloadCatalogue}</span>
                  <span className="sm:hidden font-extrabold text-[11px]">PDF</span>
                </button>
              )}
            </div>
          </div>

          {/* Category Filter - Clean horizontal scrolling pills with subtle active states */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 pt-0.5 scrollbar-none">
            {PRODUCT_CATEGORIES.map((cat) => (
              <button
                key={cat}
                id={`category-btn-${cat.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                onClick={() => handleCategoryChange(cat)}
                className={`min-h-[34px] sm:min-h-[38px] px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all shrink-0 border ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
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
          <div className="bg-slate-900 text-white rounded-xl sm:rounded-2xl p-3 sm:p-6 border border-slate-800 shadow-md space-y-3 sm:space-y-4 mb-4 sm:mb-8">
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-3 sm:gap-4">
              <div className="space-y-1.5 sm:space-y-2 max-w-3xl">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2 py-0.5 rounded-md text-[10px] sm:text-xs font-black uppercase tracking-wider bg-orange-600 text-white">
                    Category Guide
                  </span>
                  <span className="text-[11px] sm:text-xs text-slate-400 font-mono">
                    {filteredProducts.length} Industrial Items Cataloged & Sourced
                  </span>
                </div>
                <h3 className="text-base sm:text-2xl font-black text-white">
                  {categorySeo.heading}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed line-clamp-2 sm:line-clamp-none">
                  {categorySeo.summary}
                </p>
              </div>

              <div className="flex flex-row lg:flex-col gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => onEnquire(`Category Quotation: ${selectedCategory}`)}
                  className="min-h-[38px] sm:min-h-[44px] px-3 sm:px-4 py-2 rounded-xl text-xs font-bold bg-orange-600 hover:bg-orange-700 text-white transition flex items-center justify-center gap-1.5 shadow-sm flex-1 lg:flex-initial"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span className="whitespace-nowrap">Request RFQ</span>
                </button>
                <a
                  href={`https://wa.me/${COMPANY_INFO.whatsappNumber}?text=${encodeURIComponent(`Hello Rajdeep Enterprises, I need pricing and availability for *${selectedCategory}*. Please share catalogue.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackWhatsAppClick('category_seo_card', selectedCategory)}
                  className="min-h-[38px] sm:min-h-[44px] px-3 sm:px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition flex items-center justify-center gap-1.5 shadow-sm flex-1 lg:flex-initial"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span className="whitespace-nowrap">WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Target Applications and Standards on desktop/tablet */}
            <div className="hidden sm:grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-slate-800 text-xs">
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
                ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3.5'
                : density === 'detailed'
                ? 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-5'
                : 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 md:gap-5'
            }`}
          >
            {filteredProducts.map((product) => {
              const waMessage = encodeURIComponent(
                `Hello Rajdeep Enterprises, I am interested in ${product.name}. Please share the price and availability.`
              );

              return (
                <div
                  key={product.id}
                  className="bg-white rounded-xl sm:rounded-2xl overflow-hidden border border-slate-200 hover:border-orange-500/80 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col group justify-between h-full"
                >
                  {/* Product Image & Badges with consistent aspect ratio */}
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

                    {/* Badges */}
                    {product.badge && density !== 'mini' && (
                      <div className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 z-10 pointer-events-none">
                        <span className="px-1.5 py-0.5 rounded text-[8px] sm:text-[9px] font-bold uppercase tracking-wider bg-orange-600 text-white shadow-xs">
                          {product.badge}
                        </span>
                      </div>
                    )}

                    {/* Cart Quick Toggle on Image */}
                    {onAddToRfq && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddToRfq(product);
                        }}
                        aria-label={rfqProductIds.includes(product.id) ? "In Cart" : "Add to Cart"}
                        title={rfqProductIds.includes(product.id) ? "In Cart" : "Add to Cart"}
                        className={`absolute top-1.5 right-1.5 z-10 p-1 sm:p-1.5 rounded-lg text-xs font-bold transition shadow-xs flex items-center gap-1 ${
                          rfqProductIds.includes(product.id)
                            ? 'bg-emerald-600 text-white'
                            : 'bg-white/90 hover:bg-white text-slate-700 hover:text-slate-950 border border-slate-200 backdrop-blur-xs'
                        }`}
                      >
                        {rfqProductIds.includes(product.id) ? (
                          <Check className="w-3 h-3 text-white shrink-0" />
                        ) : (
                          <Plus className="w-3 h-3 text-slate-700 shrink-0" />
                        )}
                        <span className="text-[9px] font-extrabold pr-0.5 hidden xs:inline">Cart</span>
                      </button>
                    )}

                    {/* Quick Preview Specs Overlay trigger on desktop */}
                    <div className="hidden sm:flex absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity items-center justify-center text-white text-xs font-bold gap-1 backdrop-blur-[1px]">
                      <Info className="w-3.5 h-3.5" />
                      <span>View Specs</span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className={`flex flex-col justify-between flex-1 ${density === 'mini' ? 'p-1.5 sm:p-2' : 'p-2 sm:p-3'}`}>
                    <div>
                      <span className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider text-orange-600 block truncate leading-none mb-1">
                        {product.category}
                      </span>
                      <h3
                        onClick={() => onSelectProduct(product)}
                        className={`font-bold text-slate-900 leading-snug group-hover:text-orange-600 transition-colors cursor-pointer line-clamp-2 min-h-[28px] sm:min-h-[36px] break-words ${
                          density === 'mini'
                            ? 'text-[11px] sm:text-xs'
                            : density === 'compact'
                            ? 'text-xs sm:text-sm'
                            : 'text-xs sm:text-sm md:text-base'
                        }`}
                        title={product.name}
                      >
                        {product.name}
                      </h3>

                      {/* B2B Procurement identifiers where real data exists */}
                      {(product.sku || product.brand || product.unit) && (
                        <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap text-[9px] sm:text-[10px] text-slate-500 mt-0.5 sm:mt-1">
                          {product.sku && (
                            <span className="font-mono bg-slate-100 text-slate-700 px-1 py-0.2 rounded border border-slate-200">
                              {product.sku}
                            </span>
                          )}
                          {product.brand && (
                            <span className="font-bold text-slate-700">
                              {product.brand}
                            </span>
                          )}
                          {product.unit && (
                            <span className="text-slate-500">
                              • {product.unit}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Description / Specifications on larger screens */}
                      {density !== 'mini' && (
                        <p className="mt-1 text-xs text-slate-500 leading-relaxed break-words hidden md:block line-clamp-2">
                          {product.shortDescription}
                        </p>
                      )}

                      {density === 'detailed' && (
                        <div className="mt-2 space-y-1 hidden sm:block">
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
                    <div className={`border-t border-slate-100 flex flex-col gap-1 sm:gap-1.5 ${
                      density === 'mini' ? 'mt-1 pt-1' : 'mt-1.5 pt-1.5 sm:mt-2 sm:pt-1.5'
                    }`}>
                      <div className="grid grid-cols-2 gap-1 sm:gap-1.5">
                        <button
                          id={`product-enquire-btn-${product.id}`}
                          onClick={() => onEnquire(product.name)}
                          className="min-h-[30px] sm:min-h-[38px] rounded-lg font-bold text-white bg-orange-600 hover:bg-orange-700 active:bg-orange-800 transition flex items-center justify-center gap-1 text-[10px] xs:text-[11px] sm:text-xs shadow-2xs active:scale-98 px-1 sm:px-2"
                          title={`Get Price for ${product.name}`}
                          type="button"
                        >
                          <MessageCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                          <span className="truncate">Enquire</span>
                        </button>

                        <a
                          id={`product-whatsapp-btn-${product.id}`}
                          href={`https://wa.me/${COMPANY_INFO.whatsappNumber}?text=${waMessage}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="min-h-[30px] sm:min-h-[38px] rounded-lg font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 transition flex items-center justify-center gap-1 text-[10px] xs:text-[11px] sm:text-xs shadow-2xs active:scale-98 px-1 sm:px-2"
                          title={`WhatsApp Rajdeep Enterprises for ${product.name}`}
                        >
                          <MessageCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                          <span className="truncate">WhatsApp</span>
                        </a>
                      </div>

                      {density === 'detailed' && onAddToRfq && (
                        <button
                          type="button"
                          onClick={() => onAddToRfq(product)}
                          className={`hidden sm:flex w-full min-h-[32px] sm:min-h-[38px] py-1 rounded-lg text-[10px] sm:text-[11px] font-bold transition items-center justify-center gap-1 ${
                            rfqProductIds.includes(product.id)
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                              : 'text-slate-700 hover:bg-slate-100 border border-slate-300'
                          }`}
                        >
                          {rfqProductIds.includes(product.id) ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-600" />
                              <span>Added to Cart</span>
                            </>
                          ) : (
                            <>
                              <Plus className="w-3 h-3 text-slate-500" />
                              <span>+ Add to Cart</span>
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
