import React, { useEffect, useState, useId } from 'react';
import {
  X,
  MessageCircle,
  Phone,
  CheckCircle2,
  Shield,
  ArrowRight,
  Plus,
  Minus,
  Check,
  Building2,
  FileText,
  Truck,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { Product } from '../types';
import { COMPANY_INFO, PRODUCTS } from '../data/companyData';
import { trackProductView, trackRFQStep } from '../utils/analytics';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onEnquire: (productName: string, category?: string, quantity?: string) => void;
  onAddToRfq?: (product: Product, quantity?: number) => void;
  isInRfq?: boolean;
  onSelectProduct?: (product: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onEnquire,
  onAddToRfq,
  isInRfq = false,
  onSelectProduct
}) => {
  const [quantity, setQuantity] = useState<number>(10);
  const [rfqFeedback, setRfqFeedback] = useState<string | null>(null);
  const qtyInputId = useId();

  // Helper to extract brand if available in specifications or badge
  const brandName = (() => {
    if (!product) return null;
    const foundBrand = product.specifications.find((s) => s.toLowerCase().startsWith('brand:'));
    if (foundBrand) {
      return foundBrand.split(':')[1]?.trim() || null;
    }
    return product.badge?.includes('Karam') ? 'Karam' : null;
  })();

  // Track product view and update document title, meta and inject Product JSON-LD schema dynamically
  useEffect(() => {
    if (!product) return;

    // Analytics event
    trackProductView(product.id, product.name, product.category);
    trackRFQStep('product_modal_opened', product.name);

    const originalTitle = document.title;
    const metaDescEl = document.querySelector('meta[name="description"]');
    const originalMetaDesc = metaDescEl?.getAttribute('content') || '';

    document.title = `${product.name} | Industrial Safety Supplies | Rajdeep Enterprises Mathura`;
    if (metaDescEl) {
      metaDescEl.setAttribute(
        'content',
        `${product.name} supplier in Mathura & Pan-India. ${product.shortDescription}. Inquire for genuine B2B pricing, MTC & refinery gate pass compliance.`
      );
    }

    // Inject Product & Breadcrumb JSON-LD
    const scriptId = 'product-jsonld-script';
    let scriptEl = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!scriptEl) {
      scriptEl = document.createElement('script');
      scriptEl.id = scriptId;
      scriptEl.type = 'application/ld+json';
      document.head.appendChild(scriptEl);
    }

    const productSchema = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Product',
          '@id': `https://rajdeep-enterprises.com/#product/${product.id}`,
          name: product.name,
          description: product.fullDescription || product.shortDescription,
          image: typeof product.image === 'string' ? product.image : undefined,
          category: product.category,
          brand: {
            '@type': 'Brand',
            name: brandName || 'Rajdeep Enterprises'
          },
          offers: {
            '@type': 'Offer',
            priceCurrency: 'INR',
            availability: 'https://schema.org/InStock',
            price: '0.00',
            priceValidUntil: '2027-12-31',
            seller: {
              '@type': 'Organization',
              name: 'Rajdeep Enterprises',
              telephone: COMPANY_INFO.phone,
              address: {
                '@type': 'PostalAddress',
                streetAddress: COMPANY_INFO.address,
                addressLocality: 'Mathura',
                addressRegion: 'Uttar Pradesh',
                postalCode: '281005',
                addressCountry: 'IN'
              }
            }
          }
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Home',
              item: 'https://rajdeep-enterprises.com/'
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: 'Products',
              item: 'https://rajdeep-enterprises.com/#products'
            },
            {
              '@type': 'ListItem',
              position: 3,
              name: product.name,
              item: `https://rajdeep-enterprises.com/#product/${product.id}`
            }
          ]
        }
      ]
    };
    scriptEl.textContent = JSON.stringify(productSchema);

    return () => {
      document.title = originalTitle;
      if (metaDescEl && originalMetaDesc) {
        metaDescEl.setAttribute('content', originalMetaDesc);
      }
      const el = document.getElementById(scriptId);
      if (el) {
        el.remove();
      }
    };
  }, [product, brandName]);

  // Lock background scroll when open
  useEffect(() => {
    if (product) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [product]);

  if (!product) return null;

  // Quantity helpers
  const handleDecrement = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const handleIncrement = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleQuickAdd = (amount: number) => {
    setQuantity((prev) => prev + amount);
  };

  const handleQuantityInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (isNaN(val) || val < 1) {
      setQuantity(1);
    } else {
      setQuantity(Math.min(99999, val));
    }
  };

  // WhatsApp with exact product, category, and quantity prefilled
  const handleWhatsApp = () => {
    const text = encodeURIComponent(
      `Hello Rajdeep Enterprises,\n\nI am interested in:\n• Product: *${product.name}*\n• Category: *${product.category}*\n• Desired Quantity: *${quantity} units*\n\nPlease share current stock availability, MTC certification details, and official quotation.`
    );
    window.open(`https://wa.me/${COMPANY_INFO.whatsappNumber}?text=${text}`, '_blank');
  };

  const handleEnquireClick = () => {
    onClose();
    onEnquire(product.name, product.category, `${quantity} units`);
  };

  const handleAddToRfqClick = () => {
    if (onAddToRfq) {
      onAddToRfq(product, quantity);
      setRfqFeedback(`Added ${quantity} units to Bulk RFQ!`);
      setTimeout(() => {
        setRfqFeedback(null);
      }, 2500);
    }
  };

  // Structured specification parser (splits "Label: Value" if present)
  const parsedSpecs = product.specifications.map((spec) => {
    const colonIndex = spec.indexOf(':');
    if (colonIndex > 0) {
      return {
        label: spec.substring(0, colonIndex).trim(),
        value: spec.substring(colonIndex + 1).trim()
      };
    }
    return {
      label: 'Standard',
      value: spec.trim()
    };
  });

  // Extract brand if available in specifications or badge
  const brandSpec = parsedSpecs.find((s) => s.label.toLowerCase() === 'brand');
  const resolvedBrand = brandName || (brandSpec ? brandSpec.value : null);

  // Related products from same category or featured safety
  const relatedProducts = PRODUCTS.filter(
    (p) => p.id !== product.id && (p.category === product.category || p.isFeatured)
  ).slice(0, 3);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-detail-modal-title"
    >
      <div className="relative w-full max-w-3xl bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        
        {/* Top Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-slate-200 bg-slate-50 shrink-0">
          <div className="min-w-0 pr-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] sm:text-[11px] font-extrabold text-orange-600 uppercase tracking-wider block">
                {product.category}
              </span>
              {brandName && (
                <span className="text-[10px] bg-slate-200 text-slate-800 font-bold px-2 py-0.5 rounded">
                  Brand: {brandName}
                </span>
              )}
              {product.isCardPhotoItem && (
                <span className="text-[10px] bg-amber-100 text-amber-900 border border-amber-300 font-bold px-1.5 py-0.5 rounded">
                  Refinery Gate Ready
                </span>
              )}
            </div>
            <h2
              id="product-detail-modal-title"
              className="text-base sm:text-xl font-black text-slate-900 truncate mt-0.5"
            >
              {product.name}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-200 active:bg-slate-300 transition shrink-0"
            aria-label="Close product details modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 sm:space-y-6 text-slate-800 flex-1">
          
          {/* SEO & User-Friendly Product Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="text-xs text-slate-500 flex items-center gap-1.5 flex-wrap">
            <a href="#home" onClick={onClose} className="hover:text-blue-600 transition-colors">Home</a>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <a href="#products" onClick={onClose} className="hover:text-blue-600 transition-colors">Products</a>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <span className="text-slate-600 font-medium">{product.category}</span>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <span className="text-slate-900 font-bold truncate max-w-[200px] sm:max-w-none">{product.name}</span>
          </nav>

          {/* Main 2-Column Product Layout on Desktop */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6 items-start">
            
            {/* Left Column: Product Image Experience (5 cols on md+) */}
            <div className="md:col-span-5 space-y-3">
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 aspect-4/3 sm:aspect-square flex items-center justify-center group shadow-xs">
                <img
                  src={product.image}
                  alt={`${product.name} industrial supply from Rajdeep Enterprises Mathura`}
                  width="600"
                  height="600"
                  className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                
                {product.badge && (
                  <div className="absolute top-2.5 left-2.5">
                    <span className="px-2.5 py-1 rounded-lg text-[11px] font-black uppercase tracking-wider bg-orange-600 text-white shadow-xs">
                      {product.badge}
                    </span>
                  </div>
                )}

                <div className="absolute bottom-2.5 right-2.5 bg-slate-900/85 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded">
                  GST Invoice Included
                </div>
              </div>

              {/* Quick Trust Highlights under Image */}
              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600">
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span className="font-semibold text-slate-800">Pan-India Dispatch</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span className="font-semibold text-slate-800">Mathura Counter Stock</span>
                </div>
              </div>
            </div>

            {/* Right Column: Product Information & Specifications (7 cols on md+) */}
            <div className="md:col-span-7 space-y-4">
              
              {/* Product Short/Full Description */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Product Overview & Industrial Applications
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                  {product.fullDescription || product.shortDescription}
                </p>
              </div>

              {/* Recommended For Application Box */}
              {product.commonUses && (
                <div className="p-3 rounded-xl bg-orange-50 border border-orange-200 text-xs text-orange-950">
                  <div className="font-extrabold flex items-center gap-1.5 text-orange-900 mb-0.5">
                    <Sparkles className="w-3.5 h-3.5 text-orange-600" />
                    <span>Approved & Recommended For:</span>
                  </div>
                  <p className="text-slate-800 leading-normal">
                    {product.commonUses}
                  </p>
                </div>
              )}

              {/* Quantity Selector Section */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor={qtyInputId} className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Select Procurement Quantity:
                  </label>
                  <span className="text-[11px] font-semibold text-emerald-700">
                    Order Any Quantity (No Limit)
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center bg-white border border-slate-300 rounded-xl p-0.5 shadow-2xs">
                    <button
                      type="button"
                      onClick={handleDecrement}
                      aria-label="Decrease quantity by 1"
                      className="w-9 h-9 min-h-[36px] flex items-center justify-center rounded-lg text-slate-700 hover:bg-slate-100 active:bg-slate-200 font-bold transition"
                    >
                      <Minus className="w-4 h-4" />
                    </button>

                    <input
                      id={qtyInputId}
                      type="number"
                      min="1"
                      max="99999"
                      value={quantity}
                      onChange={handleQuantityInputChange}
                      className="w-16 text-center font-extrabold text-sm text-slate-900 border-none outline-none focus:ring-1 focus:ring-orange-500 rounded py-1 bg-transparent"
                    />

                    <button
                      type="button"
                      onClick={handleIncrement}
                      aria-label="Increase quantity by 1"
                      className="w-9 h-9 min-h-[36px] flex items-center justify-center rounded-lg text-slate-700 hover:bg-slate-100 active:bg-slate-200 font-bold transition"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Quantity Presets */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <button
                      type="button"
                      onClick={() => handleQuickAdd(10)}
                      className="min-h-[36px] px-2.5 py-1 rounded-lg text-xs font-bold bg-white hover:bg-slate-200 border border-slate-300 text-slate-700 transition"
                    >
                      +10
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickAdd(50)}
                      className="min-h-[36px] px-2.5 py-1 rounded-lg text-xs font-bold bg-white hover:bg-slate-200 border border-slate-300 text-slate-700 transition"
                    >
                      +50
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickAdd(100)}
                      className="min-h-[36px] px-2.5 py-1 rounded-lg text-xs font-bold bg-orange-100 hover:bg-orange-200 border border-orange-300 text-orange-900 transition"
                    >
                      +100
                    </button>
                  </div>
                </div>
              </div>

              {/* Structured Specifications Table */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900 flex items-center gap-1.5">
                    <Shield className="w-4 h-4 text-orange-600" />
                    <span>Technical Specifications & Compliance</span>
                  </h4>
                  <span className="text-[11px] text-slate-500">MTC Certificate Available</span>
                </div>

                <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-100 border-b border-slate-200 text-slate-700">
                        <th className="py-2 px-3 font-bold w-1/3 border-r border-slate-200">Specification</th>
                        <th className="py-2 px-3 font-bold">Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {parsedSpecs.map((spec, index) => (
                        <tr key={index} className="hover:bg-slate-50 transition-colors">
                          <td className="py-2 px-3 font-semibold text-slate-700 border-r border-slate-200 bg-slate-50/50">
                            {spec.label}
                          </td>
                          <td className="py-2 px-3 text-slate-800 break-words">
                            {spec.value}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          </div>

          {/* Related Products in Same Category */}
          {relatedProducts.length > 0 && (
            <div className="pt-4 border-t border-slate-200 space-y-2.5">
              <div className="flex items-center justify-between">
                <h4 className="text-xs sm:text-sm font-black text-slate-900">
                  Related Materials & Safety Gear in this Category
                </h4>
                <span className="text-[11px] text-slate-500">Click to inspect</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {relatedProducts.map((rel) => (
                  <button
                    key={rel.id}
                    type="button"
                    onClick={() => {
                      if (onSelectProduct) {
                        onSelectProduct(rel);
                      }
                    }}
                    className="flex items-center gap-2.5 p-2 rounded-xl border border-slate-200 hover:border-orange-500 bg-slate-50 hover:bg-white text-left transition group shadow-2xs"
                  >
                    <img
                      src={rel.image}
                      alt={rel.name}
                      className="w-12 h-12 object-cover rounded-lg border border-slate-200 shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-slate-900 group-hover:text-orange-600 truncate">
                        {rel.name}
                      </p>
                      <p className="text-[10px] text-slate-500 truncate">
                        {rel.category}
                      </p>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-orange-600 shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Supply Notice Bar */}
          <div className="p-3.5 rounded-xl bg-slate-900 text-white text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div>
              <span className="font-extrabold text-amber-300">Mathura Refinery Immediate Gate Delivery:</span>
              <span className="text-slate-300 ml-1">Daily counter stock ready for IOCL gate-entry passes and civil fabrication contractors.</span>
            </div>
            <span className="text-[10px] font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700 shrink-0">
              Standard GST Invoicing & Input Credit
            </span>
          </div>

        </div>

        {/* Modal Action Bar with Strict B2B Priority Hierarchy */}
        <div className="p-3 sm:p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 shrink-0">
          
          {/* Direct Calling Hotline Link */}
          <div className="flex items-center justify-between sm:justify-start gap-2 text-xs">
            <a
              href={`tel:${COMPANY_INFO.phone}`}
              className="inline-flex items-center gap-1.5 text-slate-700 hover:text-slate-900 font-bold py-1.5 px-2 rounded-lg hover:bg-slate-200 transition"
              title={`Call ${COMPANY_INFO.contactPerson}`}
            >
              <Phone className="w-3.5 h-3.5 text-amber-600" />
              <span>Call: {COMPANY_INFO.displayPhone}</span>
            </a>

            {rfqFeedback && (
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-lg animate-in fade-in">
                ✓ {rfqFeedback}
              </span>
            )}
          </div>

          {/* Primary Action Buttons (All min 44px touch targets) */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
            
            {/* WhatsApp CTA */}
            <button
              type="button"
              onClick={handleWhatsApp}
              className="flex-1 sm:flex-none min-h-[44px] px-3.5 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 transition flex items-center justify-center gap-1.5 shadow-xs"
              title="Open WhatsApp with product details prefilled"
            >
              <MessageCircle className="w-4 h-4 fill-white/20" />
              <span>WhatsApp ({quantity})</span>
            </button>

            {/* Bulk RFQ Cart CTA */}
            {onAddToRfq && (
              <button
                type="button"
                onClick={handleAddToRfqClick}
                className={`flex-1 sm:flex-none min-h-[44px] px-3.5 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs ${
                  isInRfq
                    ? 'bg-emerald-100 text-emerald-900 border border-emerald-300 hover:bg-emerald-200'
                    : 'bg-slate-900 hover:bg-slate-800 text-white'
                }`}
              >
                {isInRfq ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-700" />
                    <span>In Bulk RFQ (+{quantity})</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 text-orange-400" />
                    <span>Add {quantity} to RFQ</span>
                  </>
                )}
              </button>
            )}

            {/* Primary Action: Enquire Now Button */}
            <button
              type="button"
              onClick={handleEnquireClick}
              className="w-full sm:w-auto min-h-[44px] px-5 py-2.5 rounded-xl text-xs font-black text-white bg-orange-600 hover:bg-orange-500 active:bg-orange-700 transition flex items-center justify-center gap-1.5 shadow-md active:scale-95"
            >
              <span>Enquire for {quantity} Units</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
