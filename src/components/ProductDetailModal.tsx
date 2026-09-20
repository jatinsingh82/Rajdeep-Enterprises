import React, { useEffect, useState, useId, useRef } from 'react';
import {
  X,
  MessageCircle,
  Phone,
  Shield,
  FileText,
  Plus,
  Minus,
  Check,
  Building2,
  Truck,
  Sparkles,
  Download,
  Package,
  Tag,
  Clock,
  Layers,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { Product } from '../types';
import { COMPANY_INFO, PRODUCTS } from '../data/companyData';
import {
  trackProductView,
  trackDatasheetDownload,
  trackWhatsAppClick,
  trackPhoneClick,
  trackRfqAddItem,
  trackRFQStep
} from '../utils/analytics';

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
  const lastTrackedProductIdRef = useRef<string | null>(null);

  // Extract brand if available in product object, specifications, or badge
  const resolvedBrand = (() => {
    if (!product) return null;
    if (product.brand) return product.brand;
    const foundBrand = product.specifications.find((s) => s.toLowerCase().startsWith('brand:'));
    if (foundBrand) {
      return foundBrand.split(':')[1]?.trim() || null;
    }
    return product.badge?.includes('Karam') ? 'Karam' : null;
  })();

  // Track product view and update document title, meta and inject Product JSON-LD schema dynamically
  useEffect(() => {
    if (!product) return;

    if (lastTrackedProductIdRef.current !== product.id) {
      lastTrackedProductIdRef.current = product.id;
      trackProductView({
        productId: product.id,
        productName: product.name,
        category: product.category,
      });
      trackRFQStep('product_modal_opened', product.name);
    }

    const originalTitle = document.title;
    const metaDescEl = document.querySelector('meta[name="description"]');
    const originalMetaDesc = metaDescEl?.getAttribute('content') || '';

    document.title = `${product.name} | B2B Procurement | Rajdeep Enterprises Mathura`;
    if (metaDescEl) {
      metaDescEl.setAttribute(
        'content',
        `${product.name} (${product.category}) supplier in Mathura Refinery & Pan-India. ${product.shortDescription}. Inquire for genuine B2B pricing, MTC & refinery gate pass compliance.`
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
          '@id': `https://rajdeep-enterprises.vercel.app/#product/${product.id}`,
          name: product.name,
          sku: product.sku || product.id,
          description: product.fullDescription || product.shortDescription,
          image: typeof product.image === 'string' ? product.image : undefined,
          category: product.category,
          brand: {
            '@type': 'Brand',
            name: resolvedBrand || 'Rajdeep Enterprises'
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
              item: 'https://rajdeep-enterprises.vercel.app/'
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: 'Products',
              item: 'https://rajdeep-enterprises.vercel.app/#products'
            },
            {
              '@type': 'ListItem',
              position: 3,
              name: product.name,
              item: `https://rajdeep-enterprises.vercel.app/#product/${product.id}`
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
  }, [product, resolvedBrand]);

  // Lock background scroll & handle Escape key
  useEffect(() => {
    if (product) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [product, onClose]);

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
      label: 'Specification',
      value: spec.trim()
    };
  });

  // Download Product Technical Datasheet & track GA4 event
  const handleDownloadDatasheet = () => {
    if (!product) return;
    trackDatasheetDownload({
      productId: product.id,
      productName: product.name,
      category: product.category,
    });

    const content = [
      `=============================================================`,
      `RAJDEEP ENTERPRISES - B2B PRODUCT SPECIFICATION DATASHEET`,
      `=============================================================`,
      `Refinery & Industrial Area Supply Depot, Mathura (U.P.)`,
      `Phone: ${COMPANY_INFO.phone} / ${COMPANY_INFO.secondaryPhone}`,
      `Email: ${COMPANY_INFO.email} | GST Registered Supplier`,
      `Depot Address: ${COMPANY_INFO.address}`,
      `=============================================================`,
      ``,
      `PRODUCT IDENTIFICATION:`,
      `• Product Name: ${product.name}`,
      `• Product Code / SKU: ${product.sku || 'Available on request'}`,
      `• Category: ${product.category}`,
      `• Brand / Make: ${resolvedBrand || 'Available on request'}`,
      `• Unit of Measurement: ${product.unit || 'Available on request'}`,
      `• Stock Availability: ${product.availability || 'Ready Stock'}`,
      `• Minimum Order Quantity (MOQ): ${product.moq || 'Available on request'}`,
      product.badge ? `• Compliance / Batch Grade: ${product.badge}` : '',
      ``,
      `SHORT FACTUAL DESCRIPTION:`,
      product.shortDescription,
      product.fullDescription && product.fullDescription !== product.shortDescription
        ? `\nDETAILED DESCRIPTION:\n${product.fullDescription}`
        : '',
      ``,
      `KEY TECHNICAL SPECIFICATIONS:`,
      ...product.specifications.map((spec) => `• ${spec}`),
      ``,
      product.commonUses ? `RECOMMENDED INDUSTRIAL APPLICATIONS:\n${product.commonUses}\n` : '',
      `SAFETY & COMPLIANCE VERIFICATION:`,
      `• Standard: ISI / BIS / EN / AWS / ASTM Compliant (as applicable to product class)`,
      `• Manufacturer Test Certificate (MTC): Available on batch procurement`,
      `• Refinery Gate Entry Pass: Immediate dispatch ready for IOCL & industrial sites`,
      `• GST Tax Invoice with Input Tax Credit (ITC) eligibility provided`,
      ``,
      `COMMERCIAL & PROCUREMENT ASSISTANCE:`,
      `For contractor bulk rates, tender supply, and expedited plant delivery:`,
      `Contact Lead: ${COMPANY_INFO.contactPerson} (Proprietor)`,
      `Phone: ${COMPANY_INFO.phone}`,
      `WhatsApp: ${COMPANY_INFO.phone}`,
      `Depot Location: 15/1, U.P. S.I.D.C. Complex, Refinery Main Gate, Mathura`,
      `=============================================================`,
      `Generated on: ${new Date().toLocaleDateString('en-IN')}`,
      `Official Website: https://rajdeep-enterprises.vercel.app/`
    ].filter(Boolean).join('\n');

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Rajdeep-Datasheet-${product.id}-${product.name.replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // 1. Request Quote Handler
  const handleRequestQuote = () => {
    onClose();
    const unitLabel = product.unit ? product.unit : 'units';
    onEnquire(product.name, product.category, `${quantity} ${unitLabel}`);
  };

  // 2. Add to RFQ Handler
  const handleAddToRfq = () => {
    if (onAddToRfq) {
      onAddToRfq(product, quantity);
      trackRfqAddItem({
        productId: product.id,
        productName: product.name,
        category: product.category,
        quantity,
      });
      const unitLabel = product.unit ? product.unit : 'units';
      setRfqFeedback(`Added ${quantity} ${unitLabel} to RFQ`);
      setTimeout(() => {
        setRfqFeedback(null);
      }, 2500);
    }
  };

  // 3. WhatsApp Handler
  const handleWhatsApp = () => {
    trackWhatsAppClick({
      source: 'product_detail_modal',
      context: 'product_inquiry',
      productName: product.name,
    });
    const unitLabel = product.unit ? product.unit : 'units';
    const messageLines = [
      `Hello Rajdeep Enterprises,`,
      ``,
      `I would like to request an official quotation for:`,
      `• *Product Name:* ${product.name}`,
      product.sku ? `• *Product Code / SKU:* ${product.sku}` : null,
      resolvedBrand ? `• *Brand:* ${resolvedBrand}` : null,
      `• *Category:* ${product.category}`,
      `• *Quantity Required:* ${quantity} ${unitLabel}`,
      product.availability ? `• *Availability:* ${product.availability}` : null,
      ``,
      `Please share best B2B price, MTC availability, and delivery timeline to our site.`
    ].filter(Boolean).join('\n');

    const text = encodeURIComponent(messageLines);
    window.open(`https://wa.me/${COMPANY_INFO.whatsappNumber}?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  // 4. Call Handler
  const handleCall = () => {
    trackPhoneClick({
      phoneNumber: COMPANY_INFO.phone,
      source: 'product_detail_modal'
    });
    window.location.href = `tel:${COMPANY_INFO.phone}`;
  };

  // Related products from same category or featured safety
  const relatedProducts = PRODUCTS.filter(
    (p) => p.id !== product.id && (p.category === product.category || p.isFeatured)
  ).slice(0, 3);

  return (
    <div
      id="product-detail-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-detail-name"
    >
      <div className="relative w-full max-w-3xl bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden max-h-[94vh] flex flex-col">
        
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-slate-200 bg-slate-50 shrink-0">
          <div className="min-w-0 pr-3 flex items-center gap-2">
            <span className="text-[11px] font-extrabold text-orange-600 uppercase tracking-wider block truncate">
              {product.category}
            </span>
            {product.sku && (
              <span className="text-[10px] bg-slate-200 text-slate-800 font-bold px-2 py-0.5 rounded shrink-0">
                SKU: {product.sku}
              </span>
            )}
            {product.availability && (
              <span className="hidden xs:inline-flex items-center gap-1 text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded border border-emerald-200 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>{product.availability}</span>
              </span>
            )}
          </div>

          <button
            id="product-detail-close-btn"
            type="button"
            onClick={onClose}
            className="w-10 h-10 min-h-[40px] flex items-center justify-center rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-200 active:bg-slate-300 transition shrink-0"
            aria-label="Close product details modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Container Following Strict Requested Hierarchy */}
        <div className="p-4 sm:p-6 md:p-8 overflow-y-auto space-y-6 text-slate-800 flex-1">

          {/* 1. PRODUCT IMAGE */}
          <div id="product-detail-image-section" className="space-y-2">
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 aspect-16/10 sm:aspect-2/1 flex items-center justify-center group shadow-xs">
              <img
                id="product-detail-image"
                src={product.image}
                alt={`${product.name} - industrial supply from Rajdeep Enterprises Mathura`}
                width="800"
                height="500"
                className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-102"
                referrerPolicy="no-referrer"
              />
              
              {product.badge && (
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-lg text-[11px] font-black uppercase tracking-wider bg-orange-600 text-white shadow-xs">
                    {product.badge}
                  </span>
                </div>
              )}

              <div className="absolute bottom-3 right-3 bg-slate-900/85 backdrop-blur-xs text-white text-[10px] sm:text-[11px] font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-xs">
                <Building2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Mathura Refinery Gate Stock</span>
              </div>
            </div>

            {/* Factual dispatch & verification badges */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] text-slate-600">
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span className="font-semibold text-slate-800">Pan-India Freight Dispatch</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="font-semibold text-slate-800">GST Invoice with ITC</span>
              </div>
              <div className="hidden sm:flex p-2 rounded-xl bg-slate-50 border border-slate-200 items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span className="font-semibold text-slate-800">MTC on Procurement</span>
              </div>
            </div>
          </div>

          {/* 2. PRODUCT NAME */}
          <div id="product-detail-name-section" className="space-y-1">
            <h1
              id="product-detail-name"
              className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-snug"
            >
              {product.name}
            </h1>
            <div className="flex items-center gap-2 flex-wrap text-xs text-slate-500">
              <span className="font-medium text-orange-600">{product.category}</span>
              {resolvedBrand && (
                <>
                  <span>•</span>
                  <span className="font-bold text-slate-700">Brand: {resolvedBrand}</span>
                </>
              )}
              {product.sku && (
                <>
                  <span>•</span>
                  <span className="font-mono text-slate-600">Code: {product.sku}</span>
                </>
              )}
            </div>
          </div>

          {/* 3. SHORT FACTUAL DESCRIPTION */}
          <div id="product-detail-description-section" className="space-y-2">
            <p
              id="product-detail-short-description"
              className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal bg-slate-50/80 p-3.5 rounded-xl border border-slate-200/80"
            >
              {product.shortDescription}
            </p>
            {product.fullDescription && product.fullDescription !== product.shortDescription && (
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {product.fullDescription}
              </p>
            )}
          </div>

          {/* 4. KEY INFORMATION */}
          <div id="product-detail-key-info-section" className="space-y-4 pt-1">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h2 className="text-xs sm:text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-orange-600" />
                <span>Key Information for B2B Procurement</span>
              </h2>
              <span className="text-[11px] font-semibold text-slate-500 hidden sm:inline">
                Verified Industrial Supply Data
              </span>
            </div>

            {/* B2B Procurement Attribute Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              
              {/* Product Code / SKU */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-0.5 flex items-center gap-1">
                  <Tag className="w-3 h-3 text-slate-400" />
                  <span>Product Code / SKU</span>
                </span>
                <span className="text-xs sm:text-sm font-bold text-slate-900 break-words">
                  {product.sku ? product.sku : <span className="text-slate-500 font-normal">Available on request</span>}
                </span>
              </div>

              {/* Category */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-0.5 flex items-center gap-1">
                  <Layers className="w-3 h-3 text-slate-400" />
                  <span>Category</span>
                </span>
                <span className="text-xs sm:text-sm font-bold text-slate-900 truncate block">
                  {product.category}
                </span>
              </div>

              {/* Brand */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-0.5 flex items-center gap-1">
                  <Building2 className="w-3 h-3 text-slate-400" />
                  <span>Brand</span>
                </span>
                <span className="text-xs sm:text-sm font-bold text-slate-900 truncate block">
                  {resolvedBrand ? resolvedBrand : <span className="text-slate-500 font-normal">Available on request</span>}
                </span>
              </div>

              {/* Unit */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-0.5 flex items-center gap-1">
                  <Package className="w-3 h-3 text-slate-400" />
                  <span>Unit</span>
                </span>
                <span className="text-xs sm:text-sm font-bold text-slate-900 truncate block">
                  {product.unit ? product.unit : <span className="text-slate-500 font-normal">Available on request</span>}
                </span>
              </div>

              {/* Availability */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-0.5 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span>Availability</span>
                </span>
                <span className="text-xs sm:text-sm font-bold text-emerald-800 break-words block">
                  {product.availability ? product.availability : <span className="text-slate-500 font-normal">Available on request</span>}
                </span>
              </div>

              {/* MOQ */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-0.5 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-slate-400" />
                  <span>MOQ</span>
                </span>
                <span className="text-xs sm:text-sm font-bold text-slate-900 break-words block">
                  {product.moq ? product.moq : <span className="text-slate-500 font-normal">Available on request</span>}
                </span>
              </div>

            </div>

            {/* Datasheet Download Row */}
            <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-amber-700 shrink-0" />
                  <span className="text-xs sm:text-sm font-bold text-slate-900">
                    Product Technical Datasheet
                  </span>
                  <span className="text-[10px] bg-amber-200 text-amber-900 font-bold px-1.5 py-0.2 rounded">
                    TXT / Spec Sheet
                  </span>
                </div>
                <p className="text-xs text-slate-600">
                  {product.datasheetAvailable !== false
                    ? 'Includes exact specifications, industrial standards, MTC guidelines & compliance details.'
                    : 'Detailed engineering submittal available on request.'}
                </p>
              </div>

              <button
                id="product-download-datasheet-btn"
                type="button"
                onClick={handleDownloadDatasheet}
                className="w-full sm:w-auto min-h-[40px] px-4 py-2 rounded-xl bg-white hover:bg-slate-50 border border-amber-300 text-slate-900 text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-2xs shrink-0 cursor-pointer active:scale-98"
                title={`Download ${product.name} Technical Datasheet`}
              >
                <Download className="w-4 h-4 text-orange-600 shrink-0" />
                <span>Download Datasheet</span>
              </button>
            </div>

            {/* Key Specifications Table */}
            {product.specifications && product.specifications.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-orange-600" />
                  <span>Key Specifications</span>
                </h3>

                <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-100 border-b border-slate-200 text-slate-700">
                        <th className="py-2 px-3 font-bold w-1/3 sm:w-2/5 border-r border-slate-200">
                          Specification
                        </th>
                        <th className="py-2 px-3 font-bold">
                          Details
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {parsedSpecs.map((spec, index) => (
                        <tr key={index} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-2 px-3 font-semibold text-slate-700 border-r border-slate-200 bg-slate-50/40 align-top">
                            {spec.label}
                          </td>
                          <td className="py-2 px-3 text-slate-800 break-words align-top">
                            {spec.value}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Industrial Applications (if available) */}
            {product.commonUses && (
              <div className="p-3 rounded-xl bg-orange-50/80 border border-orange-200 text-xs text-orange-950 space-y-1">
                <div className="font-extrabold flex items-center gap-1.5 text-orange-900">
                  <Sparkles className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                  <span>Recommended Industrial Applications:</span>
                </div>
                <p className="text-slate-800 leading-relaxed">
                  {product.commonUses}
                </p>
              </div>
            )}
          </div>

          {/* 5. QUANTITY */}
          <div id="product-detail-quantity-section" className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-1">
              <label htmlFor={qtyInputId} className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wider">
                Quantity {product.unit ? `(${product.unit})` : ''}:
              </label>
              <span className="text-xs font-semibold text-emerald-700">
                {product.moq ? `MOQ: ${product.moq}` : 'Flexible Quantity Support'}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {/* Stepper with accessible 44px min touch targets */}
              <div className="flex items-center bg-white border border-slate-300 rounded-xl p-1 shadow-2xs">
                <button
                  id="product-qty-decrement-btn"
                  type="button"
                  onClick={handleDecrement}
                  aria-label="Decrease quantity by 1"
                  className="w-10 h-10 min-h-[40px] flex items-center justify-center rounded-lg text-slate-700 hover:bg-slate-100 active:bg-slate-200 font-bold transition"
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
                  className="w-16 sm:w-20 text-center font-black text-base text-slate-900 border-none outline-none focus:ring-1 focus:ring-orange-500 rounded py-1 bg-transparent"
                  aria-label="Procurement Quantity"
                />

                <button
                  id="product-qty-increment-btn"
                  type="button"
                  onClick={handleIncrement}
                  aria-label="Increase quantity by 1"
                  className="w-10 h-10 min-h-[40px] flex items-center justify-center rounded-lg text-slate-700 hover:bg-slate-100 active:bg-slate-200 font-bold transition"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  type="button"
                  onClick={() => handleQuickAdd(10)}
                  className="min-h-[42px] px-3 py-1.5 rounded-xl text-xs font-bold bg-white hover:bg-slate-200 border border-slate-300 text-slate-700 transition"
                  title="Add 10 units"
                >
                  +10
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickAdd(50)}
                  className="min-h-[42px] px-3 py-1.5 rounded-xl text-xs font-bold bg-white hover:bg-slate-200 border border-slate-300 text-slate-700 transition"
                  title="Add 50 units"
                >
                  +50
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickAdd(100)}
                  className="min-h-[42px] px-3 py-1.5 rounded-xl text-xs font-bold bg-orange-100 hover:bg-orange-200 border border-orange-300 text-orange-900 transition"
                  title="Add 100 units"
                >
                  +100
                </button>
              </div>

              {rfqFeedback && (
                <div className="w-full text-xs font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-3 py-1.5 rounded-lg flex items-center gap-1.5 animate-in fade-in">
                  <Check className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>{rfqFeedback}</span>
                </div>
              )}
            </div>
          </div>

          {/* CTAs IN STRICT HIERARCHICAL ORDER:
              6. Request Quote
              ↓
              7. Add to RFQ
              ↓
              8. WhatsApp
              ↓
              9. Call
          */}
          <div id="product-detail-actions-section" className="space-y-3 pt-2">
            <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block">
              Procurement Actions:
            </span>

            <div className="flex flex-col gap-2.5">
              
              {/* 6. REQUEST QUOTE (Primary CTA) */}
              <button
                id="product-request-quote-btn"
                type="button"
                onClick={handleRequestQuote}
                className="w-full min-h-[48px] px-6 py-3 rounded-xl text-sm sm:text-base font-black text-white bg-orange-600 hover:bg-orange-500 active:bg-orange-700 transition flex items-center justify-center gap-2 shadow-md active:scale-99 cursor-pointer"
              >
                <FileText className="w-5 h-5 shrink-0" />
                <span>Request Quote ({quantity} {product.unit ? product.unit : 'Units'})</span>
              </button>

              {/* 7. ADD TO RFQ (Secondary CTA) */}
              {onAddToRfq && (
                <button
                  id="product-add-to-rfq-btn"
                  type="button"
                  onClick={handleAddToRfq}
                  className={`w-full min-h-[48px] px-6 py-3 rounded-xl text-sm sm:text-base font-bold transition flex items-center justify-center gap-2 shadow-xs cursor-pointer active:scale-99 ${
                    isInRfq
                      ? 'bg-emerald-100 text-emerald-950 border-2 border-emerald-400 hover:bg-emerald-200'
                      : 'bg-slate-900 hover:bg-slate-800 text-white'
                  }`}
                >
                  {isInRfq ? (
                    <>
                      <Check className="w-5 h-5 text-emerald-700 shrink-0" />
                      <span>In RFQ Cart (Add +{quantity} more)</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5 text-orange-400 shrink-0" />
                      <span>Add to RFQ ({quantity} {product.unit ? product.unit : 'Units'})</span>
                    </>
                  )}
                </button>
              )}

              {/* 8. WHATSAPP */}
              <button
                id="product-whatsapp-btn"
                type="button"
                onClick={handleWhatsApp}
                className="w-full min-h-[48px] px-6 py-3 rounded-xl text-sm sm:text-base font-bold text-white bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 transition flex items-center justify-center gap-2 shadow-xs cursor-pointer active:scale-99"
                title="Send instant WhatsApp enquiry"
              >
                <MessageCircle className="w-5 h-5 fill-white/20 shrink-0" />
                <span>WhatsApp ({quantity} {product.unit ? product.unit : 'Units'})</span>
              </button>

              {/* 9. CALL */}
              <a
                id="product-call-btn"
                href={`tel:${COMPANY_INFO.phone}`}
                onClick={handleCall}
                className="w-full min-h-[48px] px-6 py-3 rounded-xl text-sm sm:text-base font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 active:bg-amber-500 transition flex items-center justify-center gap-2 shadow-xs cursor-pointer active:scale-99"
                title={`Call ${COMPANY_INFO.contactPerson} at ${COMPANY_INFO.displayPhone}`}
              >
                <Phone className="w-5 h-5 text-slate-950 shrink-0" />
                <span>Call: {COMPANY_INFO.displayPhone}</span>
              </a>

            </div>
          </div>

          {/* Related Materials / Products Section */}
          {relatedProducts.length > 0 && (
            <div className="pt-4 border-t border-slate-200 space-y-2.5">
              <div className="flex items-center justify-between">
                <h4 className="text-xs sm:text-sm font-extrabold text-slate-900">
                  Related Materials in {product.category}
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
                    className="flex items-center gap-2.5 p-2 rounded-xl border border-slate-200 hover:border-orange-500 bg-slate-50 hover:bg-white text-left transition group shadow-2xs cursor-pointer"
                  >
                    <img
                      src={rel.image}
                      alt={rel.name}
                      width="48"
                      height="48"
                      className="w-12 h-12 object-cover rounded-lg border border-slate-200 shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-slate-900 group-hover:text-orange-600 truncate">
                        {rel.name}
                      </p>
                      <p className="text-[10px] text-slate-500 truncate">
                        {rel.unit ? `Unit: ${rel.unit}` : rel.category}
                      </p>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-orange-600 shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Refinery Gate Pass & Fast Supply Note */}
          <div className="p-3.5 rounded-xl bg-slate-900 text-white text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div>
              <span className="font-extrabold text-amber-300">Mathura Refinery Immediate Gate Delivery:</span>
              <span className="text-slate-300 ml-1">
                Depot located at 15/1, UP SIDC Complex, Refinery Main Gate. Instant dispatch for IOCL gate entries & contractor turnaround works.
              </span>
            </div>
            <span className="text-[10px] font-bold text-slate-400 bg-slate-800 px-2.5 py-1 rounded border border-slate-700 shrink-0 whitespace-nowrap">
              GST Invoicing & Input Credit
            </span>
          </div>

        </div>

      </div>
    </div>
  );
};
