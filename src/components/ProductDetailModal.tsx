import React, { useEffect } from 'react';
import { X, MessageCircle, Phone, CheckCircle2, Shield, ArrowRight } from 'lucide-react';
import { Product } from '../types';
import { COMPANY_INFO } from '../data/companyData';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onEnquire: (productName: string) => void;
  onAddToRfq?: (product: Product) => void;
  isInRfq?: boolean;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onEnquire,
  onAddToRfq,
  isInRfq = false,
}) => {
  // Prevent background scrolling when open on mobile
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

  const handleWhatsApp = () => {
    const text = encodeURIComponent(
      `Hello Rajdeep Enterprises, I am interested in *${product.name}* (${product.category}). Could you please share quotation, bulk availability, and specifications?`
    );
    window.open(`https://wa.me/${COMPANY_INFO.whatsappNumber}?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-slate-100 bg-slate-50">
          <div className="min-w-0 pr-2">
            <span className="text-[10px] sm:text-[11px] font-bold text-orange-600 uppercase tracking-wider block truncate">
              {product.category}
            </span>
            <h3 className="text-base sm:text-xl font-black text-slate-900 truncate">
              {product.name}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-200 active:bg-slate-300 transition shrink-0"
            aria-label="Close details"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 sm:space-y-6 text-slate-800">
          
          {/* Image & Quick Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 items-center">
            <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-100 h-48 sm:h-64">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="space-y-2.5 sm:space-y-3">
              {product.badge && (
                <span className="inline-block px-2.5 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider bg-orange-600 text-white">
                  {product.badge}
                </span>
              )}
              <h4 className="font-bold text-sm sm:text-base text-slate-900">
                Industrial Application & Overview
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {product.fullDescription}
              </p>
              <div className="p-2.5 sm:p-3 rounded-lg bg-orange-50 border border-orange-200 text-xs text-orange-950">
                <strong>Recommended For:</strong> {product.commonUses}
              </div>
            </div>
          </div>

          {/* Specifications Checklist */}
          <div>
            <h4 className="font-bold text-xs sm:text-base text-slate-900 mb-2 sm:mb-3 flex items-center gap-2">
              <Shield className="w-4 h-4 text-orange-600" />
              <span>Technical Specifications & Standards</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {product.specifications.map((spec, idx) => (
                <div key={idx} className="flex items-start gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{spec}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Supply Note */}
          <div className="p-3 rounded-xl bg-slate-900 text-white text-xs flex items-center justify-between flex-wrap gap-2">
            <div>
              <span className="font-bold text-amber-300">Fast Local Mathura Dispatch:</span>
              <span className="text-slate-300 ml-1">Available for immediate delivery to refinery sites and contractors.</span>
            </div>
            <span className="text-[10px] text-slate-400">GST Invoice Available</span>
          </div>

        </div>

        {/* Footer Actions with touch-friendly min 44px buttons */}
        <div className="p-3 sm:p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2 shrink-0">
          <div className="grid grid-cols-2 sm:flex sm:items-center gap-2">
            <button
              onClick={handleWhatsApp}
              className="min-h-[44px] px-3 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 active:bg-emerald-700 transition flex items-center justify-center gap-1.5 shadow-xs"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onEnquire(product.name);
              }}
              className="min-h-[44px] px-3 py-2.5 rounded-xl text-xs font-bold text-white bg-orange-600 active:bg-orange-700 transition flex items-center justify-center gap-1.5 shadow-xs"
            >
              <span>Get Quotation</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {onAddToRfq && (
            <button
              onClick={() => onAddToRfq(product)}
              className={`min-h-[44px] px-3 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs ${
                isInRfq
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-slate-900 hover:bg-slate-800 text-white'
              }`}
            >
              <span>{isInRfq ? '✓ In RFQ Cart' : '+ Add to RFQ Cart'}</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
