import React, { useState, useEffect } from 'react';
import { X, MessageCircle, Phone, Send, CheckCircle2, AlertCircle, Building2, Package, Check, ArrowRight } from 'lucide-react';
import { COMPANY_INFO } from '../data/companyData';

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName?: string;
  category?: string;
  initialQuantity?: string;
}

export const EnquiryModal: React.FC<EnquiryModalProps> = ({
  isOpen,
  onClose,
  productName = '',
  category = '',
  initialQuantity = ''
}) => {
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [requirement, setRequirement] = useState(productName || 'Industrial Safety Accessories');
  const [productCategory, setProductCategory] = useState(category || '');
  const [quantity, setQuantity] = useState(initialQuantity || '50 units');
  const [deliveryLocation, setDeliveryLocation] = useState('Mathura Refinery / Site Delivery');
  const [extraItems, setExtraItems] = useState('');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (productName) {
      setRequirement(productName);
    }
    if (category) {
      setProductCategory(category);
    }
    if (initialQuantity) {
      setQuantity(initialQuantity);
    }
  }, [productName, category, initialQuantity]);

  // Lock background scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setSubmitted(false);
      setErrors({});
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Validation function with clear human-readable messages
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!requirement.trim()) {
      newErrors.requirement = 'Please specify the product or requirement you need.';
    }

    if (!name.trim()) {
      newErrors.name = 'Please provide your full name or site contact name.';
    }

    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (!cleanPhone) {
      newErrors.phone = 'Mobile or WhatsApp number is required for dispatching quotes.';
    } else if (cleanPhone.length < 10) {
      newErrors.phone = 'Please enter a valid 10-digit mobile number (e.g. 9997993895).';
    }

    if (email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        newErrors.email = 'Please enter a valid email address or leave it blank.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleWhatsAppInstant = () => {
    const text = encodeURIComponent(
      `*Product Enquiry - Rajdeep Enterprises*\n` +
      `*Supplying in Whole India Everywhere | Any Quantity*\n\n` +
      `• *Requirement:* ${requirement}\n` +
      (productCategory ? `• *Category:* ${productCategory}\n` : '') +
      `• *Quantity Desired:* ${quantity || 'Any Quantity'}\n` +
      `• *Delivery Destination:* ${deliveryLocation || 'Whole India Supply'}\n` +
      (extraItems ? `• *Extra Items / Custom Sourcing:* ${extraItems}\n` : '') +
      `• *Contractor / Client:* ${name || 'Industrial Buyer'}\n` +
      (company ? `• *Company / Firm:* ${company}\n` : '') +
      `• *Phone:* ${phone || 'Please reply here'}\n` +
      (email ? `• *Email:* ${email}\n` : '') +
      (notes ? `• *Notes:* ${notes}\n` : '') +
      `\nPlease share best competitive quotation with GST invoice terms.`
    );
    window.open(`https://wa.me/${COMPANY_INFO.whatsappNumber}?text=${text}`, '_blank');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const stored = JSON.parse(localStorage.getItem('rajdeep_enquiries') || '[]');
      stored.push({
        fullName: name,
        companyName: company,
        phoneNumber: phone,
        emailAddress: email,
        productRequirement: requirement,
        category: productCategory,
        quantity,
        deliveryLocation,
        extraItems,
        message: notes,
        submittedAt: new Date().toISOString()
      });
      localStorage.setItem('rajdeep_enquiries', JSON.stringify(stored));
    } catch (err) {
      console.error('Error saving enquiry to local storage', err);
    }

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 400);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="enquiry-modal-heading"
    >
      <div className="relative w-full max-w-lg max-h-[92vh] flex flex-col bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 bg-slate-900 text-white shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold text-orange-400 uppercase tracking-wider block">
                Official Supplier Quotation
              </span>
              <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                100% Verified GST Invoice
              </span>
            </div>
            <h2 id="enquiry-modal-heading" className="text-base sm:text-lg font-black text-white mt-0.5">
              Request Quotation — Rajdeep Enterprises
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            aria-label="Close enquiry modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          {submitted ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg sm:text-xl font-black text-slate-900">
                Quotation Request Received!
              </h3>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 max-w-sm mx-auto text-left space-y-1.5">
                <p>
                  <strong>Client:</strong> {name} {company && `(${company})`}
                </p>
                <p>
                  <strong>Product:</strong> {requirement}
                </p>
                <p>
                  <strong>Quantity:</strong> {quantity}
                </p>
                <p>
                  <strong>Destination:</strong> {deliveryLocation}
                </p>
              </div>
              <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                Thank you. Your requirement has been logged. <strong className="text-slate-900">{COMPANY_INFO.contactPerson}</strong> will review your request and connect with you on <strong className="text-slate-900">{phone}</strong>.
              </p>
              
              <div className="pt-2 flex flex-col gap-2 max-w-sm mx-auto">
                <button
                  type="button"
                  onClick={handleWhatsAppInstant}
                  className="w-full min-h-[44px] py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 transition flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <MessageCircle className="w-4 h-4 fill-white/20" />
                  <span>Send Immediate Copy on WhatsApp</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full min-h-[40px] py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition"
                >
                  Continue Browsing Catalogue
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3.5 text-left text-xs" noValidate>
              
              {/* Product Info Card (carried automatically from product discovery) */}
              <div className="p-3 rounded-xl bg-orange-50/80 border border-orange-200">
                <label className="block font-bold text-orange-950 uppercase tracking-wider text-[11px] mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Package className="w-3.5 h-3.5 text-orange-600" />
                    <span>Product / Material Requirement <span className="text-red-500">*</span></span>
                  </span>
                  {productCategory && (
                    <span className="text-[10px] text-orange-800 font-semibold bg-orange-200/80 px-2 py-0.5 rounded">
                      {productCategory}
                    </span>
                  )}
                </label>
                <input
                  type="text"
                  value={requirement}
                  onChange={(e) => {
                    setRequirement(e.target.value);
                    if (errors.requirement) setErrors({ ...errors, requirement: '' });
                  }}
                  placeholder="e.g. Karam Safety Shoes, Safety Helmets, Champion Gaskets"
                  className={`w-full min-h-[42px] px-3.5 py-2 text-base sm:text-xs rounded-xl border ${
                    errors.requirement ? 'border-red-500 bg-red-50/50' : 'border-orange-300 bg-white'
                  } focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none text-slate-900 font-semibold`}
                  required
                />
                {errors.requirement && (
                  <p className="text-red-600 text-[11px] mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{errors.requirement}</span>
                  </p>
                )}
              </div>

              {/* Name & Phone (Required) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Your Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    autoComplete="name"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (errors.name) setErrors({ ...errors, name: '' });
                    }}
                    placeholder="e.g. Ramesh Kumar"
                    className={`w-full min-h-[44px] px-3.5 py-2.5 text-base sm:text-xs rounded-xl border ${
                      errors.name ? 'border-red-500 bg-red-50/50' : 'border-slate-300 bg-white'
                    } focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none text-slate-900`}
                    required
                  />
                  {errors.name && (
                    <p className="text-red-600 text-[11px] mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{errors.name}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Mobile / WhatsApp No. <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    autoComplete="tel"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (errors.phone) setErrors({ ...errors, phone: '' });
                    }}
                    placeholder="e.g. 9997993895"
                    className={`w-full min-h-[44px] px-3.5 py-2.5 text-base sm:text-xs rounded-xl border ${
                      errors.phone ? 'border-red-500 bg-red-50/50' : 'border-slate-300 bg-white'
                    } focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none text-slate-900`}
                    required
                  />
                  {errors.phone && (
                    <p className="text-red-600 text-[11px] mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{errors.phone}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Company & Email (Optional) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center justify-between">
                    <span>Company / Contractor Firm</span>
                    <span className="text-[10px] text-slate-400 font-normal lowercase">(optional)</span>
                  </label>
                  <input
                    type="text"
                    autoComplete="organization"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g. Larsen & Toubro, Reliance Site"
                    className="w-full min-h-[44px] px-3.5 py-2.5 text-base sm:text-xs rounded-xl border border-slate-300 bg-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center justify-between">
                    <span>Email Address</span>
                    <span className="text-[10px] text-slate-400 font-normal lowercase">(optional for PDF quote)</span>
                  </label>
                  <input
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors({ ...errors, email: '' });
                    }}
                    placeholder="contractor@domain.com"
                    className={`w-full min-h-[44px] px-3.5 py-2.5 text-base sm:text-xs rounded-xl border ${
                      errors.email ? 'border-red-500 bg-red-50/50' : 'border-slate-300 bg-white'
                    } focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none text-slate-900`}
                  />
                  {errors.email && (
                    <p className="text-red-600 text-[11px] mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{errors.email}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Quantity & Pan-India Destination */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center justify-between">
                    <span>Procurement Quantity</span>
                    <span className="text-[10px] text-emerald-600 font-bold lowercase">order any quantity</span>
                  </label>
                  <input
                    type="text"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="e.g. 50 pairs, 200 pcs, 5 boxes"
                    className="w-full min-h-[44px] px-3.5 py-2.5 text-base sm:text-xs rounded-xl border border-slate-300 bg-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center justify-between">
                    <span>Delivery Location</span>
                    <span className="text-[10px] text-blue-600 font-bold lowercase">whole india</span>
                  </label>
                  <input
                    type="text"
                    value={deliveryLocation}
                    onChange={(e) => setDeliveryLocation(e.target.value)}
                    placeholder="e.g. Mathura Refinery, Surat, Jamnagar, Delhi"
                    className="w-full min-h-[44px] px-3.5 py-2.5 text-base sm:text-xs rounded-xl border border-slate-300 bg-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none text-slate-900"
                  />
                </div>
              </div>

              {/* Custom Extra Items On Demand */}
              <div className="bg-amber-50/70 p-3 rounded-xl border border-amber-200 space-y-1">
                <label className="block font-bold text-amber-950 uppercase tracking-wider text-[11px] flex items-center justify-between">
                  <span>Custom / Extra Items Sourcing On Demand</span>
                  <span className="text-[10px] bg-amber-200 text-amber-900 px-1.5 py-0.2 rounded font-bold">
                    Whole Supply
                  </span>
                </label>
                <p className="text-[11px] text-amber-900">
                  Tell us what else you need (non-standard sizes, custom logo printing, specialized tools):
                </p>
                <input
                  type="text"
                  value={extraItems}
                  onChange={(e) => setExtraItems(e.target.value)}
                  placeholder="e.g. Company logo printed on helmets, size 11 boots, DPT spray..."
                  className="w-full min-h-[40px] px-3 py-2 text-base sm:text-xs rounded-xl border border-amber-300 bg-white focus:border-orange-500 outline-none text-slate-900"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center justify-between">
                  <span>Additional Specifications / Delivery Urgency</span>
                  <span className="text-[10px] text-slate-400 font-normal lowercase">(optional)</span>
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Mention target date, batch test report (MTC) needs, or specific sizes..."
                  className="w-full px-3.5 py-2 text-base sm:text-xs rounded-xl border border-slate-300 bg-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none text-slate-900"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col gap-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full min-h-[46px] py-2.5 rounded-xl font-black text-xs sm:text-sm text-white bg-orange-600 hover:bg-orange-500 active:bg-orange-700 transition flex items-center justify-center gap-1.5 shadow-md active:scale-95 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Submitting Quotation...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Official Quotation Request</span>
                    </>
                  )}
                </button>

                <div className="relative flex py-1 items-center">
                  <div className="flex-grow border-t border-slate-200"></div>
                  <span className="flex-shrink mx-2 text-[10px] text-slate-400 font-semibold uppercase">
                    Or Direct Contact with Proprietor
                  </span>
                  <div className="flex-grow border-t border-slate-200"></div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={handleWhatsAppInstant}
                    className="min-h-[44px] py-2 px-3 rounded-xl font-bold text-xs text-white bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 transition flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <MessageCircle className="w-3.5 h-3.5 fill-white/20" />
                    <span>WhatsApp RFQ</span>
                  </button>

                  <a
                    href={`tel:${COMPANY_INFO.phone}`}
                    className="min-h-[44px] py-2 px-3 rounded-xl font-bold text-xs text-slate-900 bg-amber-400 hover:bg-amber-300 active:bg-amber-500 transition flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Direct</span>
                  </a>
                </div>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
