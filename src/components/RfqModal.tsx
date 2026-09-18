import React, { useState, useEffect } from 'react';
import {
  X,
  Trash2,
  Plus,
  Minus,
  Send,
  MessageCircle,
  FileText,
  Check,
  AlertCircle,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Phone
} from 'lucide-react';
import { RfqItem, Language } from '../types';
import { COMPANY_INFO } from '../data/companyData';
import { TRANSLATIONS } from '../data/extraData';
import { trackRfqSubmit, trackWhatsAppClick } from '../utils/analytics';

interface RfqModalProps {
  isOpen: boolean;
  onClose: () => void;
  rfqItems: RfqItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onSetExactQuantity?: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  lang: Language;
}

export const RfqModal: React.FC<RfqModalProps> = ({
  isOpen,
  onClose,
  rfqItems,
  onUpdateQuantity,
  onSetExactQuantity,
  onRemoveItem,
  onClearCart,
  lang
}) => {
  const [contractorName, setContractorName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [siteLocation, setSiteLocation] = useState('Mathura Refinery / Local Site');
  const [notes, setNotes] = useState('');
  const [extraItems, setExtraItems] = useState('');
  const [requestMtc, setRequestMtc] = useState(true);
  const [copied, setCopied] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [honeypot, setHoneypot] = useState('');
  const [rfqReference, setRfqReference] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setSubmitted(false);
      setErrors({});
      setRfqReference('');
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const t = TRANSLATIONS[lang];
  const totalQuantity = rfqItems.reduce((acc, item) => acc + item.quantity, 0);

  const validateRfq = () => {
    const errs: { [key: string]: string } = {};

    if (!contractorName.trim()) {
      errs.name = 'Please provide contact person or contractor name.';
    }

    const cleanPhone = phoneNumber.replace(/[^0-9]/g, '');
    if (!cleanPhone) {
      errs.phone = 'Mobile or WhatsApp number is required to send the quotation.';
    } else if (cleanPhone.length < 10) {
      errs.phone = 'Please enter a valid 10-digit mobile number.';
    }

    if (emailAddress.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailAddress.trim())) {
        errs.email = 'Please enter a valid email address.';
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const generateBoqText = () => {
    let text = `*REQUEST FOR QUOTATION (RFQ) - RAJDEEP ENTERPRISES*\n`;
    text += `*Supplying in Whole India Everywhere | Any Quantity*\n`;
    text += `*Proprietor:* ${COMPANY_INFO.contactPerson} (${COMPANY_INFO.phone} / ${COMPANY_INFO.secondaryPhone})\n`;
    text += `*Central Hub:* ${COMPANY_INFO.address}\n\n`;
    text += `*Buyer / Contractor Details:*\n`;
    text += `• Name: ${contractorName || 'Industrial Buyer'}\n`;
    if (companyName) text += `• Firm/Company: ${companyName}\n`;
    if (phoneNumber) text += `• Contact: ${phoneNumber}\n`;
    if (emailAddress) text += `• Email: ${emailAddress}\n`;
    text += `• Pan-India Delivery Destination: ${siteLocation}\n`;
    if (notes) text += `• Specific Sizes/Notes: ${notes}\n`;
    text += `• Batch MTC & Test Certificates: ${requestMtc ? 'YES - REQUIRED FOR GATE CLEARANCE' : 'Standard Invoice'}\n`;

    text += `\n*Bill of Quantities (Selected Catalogue Items):*\n`;
    rfqItems.forEach((item, idx) => {
      text += `${idx + 1}. *${item.product.name}*\n`;
      text += `   - Quantity: *${item.quantity}* units\n`;
      if (item.product.badge) text += `   - Type/Pack: ${item.product.badge}\n`;
    });

    if (extraItems.trim()) {
      text += `\n*Extra / Custom Items Requested (On-Demand Sourcing):*\n`;
      text += `• ${extraItems.trim()}\n`;
    }

    text += `\n*Total Items:* ${rfqItems.length} products (${totalQuantity} units total)\n`;
    text += `Please share your best quotation, GST invoice terms, and doorstep transit schedule anywhere in India.`;
    return text;
  };

  const handleSendWhatsApp = async () => {
    if (!validateRfq()) {
      return;
    }

    setIsSubmitting(true);

    // Persist RFQ submission in localStorage for audit
    try {
      const stored = JSON.parse(localStorage.getItem('rajdeep_rfqs') || '[]');
      stored.push({
        contractorName,
        companyName,
        phoneNumber,
        emailAddress,
        siteLocation,
        notes,
        extraItems,
        requestMtc,
        items: rfqItems.map((i) => ({
          productId: i.product.id,
          name: i.product.name,
          quantity: i.quantity
        })),
        submittedAt: new Date().toISOString()
      });
      localStorage.setItem('rajdeep_rfqs', JSON.stringify(stored));
    } catch {
      // ignore
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);
    let generatedRef = '';

    try {
      const res = await fetch('/api/rfq', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contractorName,
          companyName,
          phoneNumber,
          emailAddress,
          siteLocation,
          notes,
          requestMtc,
          rfqItems: rfqItems.map((i) => ({
            name: i.product.name,
            quantity: i.quantity
          })),
          website_hp: honeypot
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      const data = await res.json();
      if (res.ok && data.success) {
        generatedRef = data.rfqReference || '';
        setRfqReference(generatedRef);
      }
    } catch {
      clearTimeout(timeoutId);
      // Fail gracefully: user can dispatch to WhatsApp without interruption
    } finally {
      setIsSubmitting(false);

      // Track rfq_submit in GA4
      trackRfqSubmit({
        itemCount: rfqItems.length,
        totalQuantity,
        hasCompany: Boolean(companyName.trim()),
        requiresMtc: requestMtc,
        rfqReference: generatedRef || rfqReference || undefined,
      });

      // Track WhatsApp dispatch
      trackWhatsAppClick({
        source: 'rfq_modal_submit',
        context: 'bulk_rfq_dispatch',
      });

      const message = generateBoqText();
      const encoded = encodeURIComponent(message);
      const url = `https://wa.me/${COMPANY_INFO.whatsappNumber}?text=${encoded}`;
      window.open(url, '_blank');
      setSubmitted(true);
    }
  };

  const handleCopyBoq = () => {
    const text = generateBoqText();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="rfq-modal-title"
    >
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-600/30 border border-orange-500/40 text-orange-400 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 id="rfq-modal-title" className="font-extrabold text-base sm:text-xl text-white tracking-tight flex items-center gap-2">
                <span>{t.rfqTitle}</span>
                <span className="text-xs bg-orange-600 text-white font-mono px-2 py-0.5 rounded-full">
                  {rfqItems.length} products ({totalQuantity} units)
                </span>
              </h2>
              <p className="text-[11px] sm:text-xs text-amber-300 font-medium mt-0.5">
                🇮🇳 Supplying in Whole India Everywhere • Any Quantity Supplied • Custom Extra Items On Demand
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            aria-label="Close RFQ Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          
          {submitted ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg sm:text-xl font-black text-slate-900">
                Bulk RFQ Submitted Successfully!
              </h3>
              {rfqReference && (
                <div className="inline-block px-3.5 py-1 bg-emerald-100 text-emerald-900 rounded-lg text-xs font-mono font-bold">
                  RFQ Tracking ID: {rfqReference}
                </div>
              )}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 max-w-md mx-auto text-left space-y-2">
                <p>
                  <strong>Contact Person:</strong> {contractorName} {companyName && `(${companyName})`}
                </p>
                <p>
                  <strong>Destination:</strong> {siteLocation}
                </p>
                <p>
                  <strong>Total Procurement:</strong> {rfqItems.length} products / {totalQuantity} units
                </p>
                <p>
                  <strong>MTC Certificate:</strong> {requestMtc ? 'Requested' : 'Standard'}
                </p>
              </div>
              <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                Your Bill of Quantities has been submitted to <strong className="text-slate-900">{COMPANY_INFO.contactPerson}</strong>. Our dispatch desk is calculating the most competitive bulk GST pricing for you.
              </p>
              <div className="flex flex-col sm:flex-row gap-2.5 justify-center pt-3 max-w-md mx-auto">
                <button
                  type="button"
                  onClick={handleSendWhatsApp}
                  className="w-full sm:w-auto min-h-[44px] px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <MessageCircle className="w-4 h-4 fill-white/20" />
                  <span>Re-send on WhatsApp</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto min-h-[44px] px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition"
                >
                  Close & Continue Browsing
                </button>
              </div>
            </div>
          ) : rfqItems.length === 0 ? (
            <div className="py-12 text-center text-slate-500 space-y-3">
              <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="font-bold text-slate-800 text-base">{t.rfqEmpty}</h3>
              <p className="text-xs max-w-sm mx-auto text-slate-500">
                Click "+ Add to Bulk RFQ" on any product in the catalogue or product detail page to request consolidated pricing.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold transition shadow-xs"
              >
                <span>Browse Products Catalogue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <>
              {/* Selected Products Procurement Cart Table */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider pb-1 border-b border-slate-100">
                  <span>Selected Products ({rfqItems.length})</span>
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-emerald-600 normal-case font-semibold hidden sm:inline">
                      Order Any Quantity (No Minimums)
                    </span>
                    <button
                      type="button"
                      onClick={onClearCart}
                      className="text-red-500 hover:text-red-700 flex items-center gap-1 normal-case font-medium text-xs transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Clear All</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                  {rfqItems.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white transition shadow-2xs"
                    >
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-12 h-12 object-cover rounded-lg shrink-0 border border-slate-200"
                        referrerPolicy="no-referrer"
                      />

                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                          {item.product.name}
                        </h4>
                        <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                          <span className="text-orange-600 font-semibold truncate">
                            {item.product.badge || item.product.category}
                          </span>
                        </div>
                      </div>

                      {/* Quantity Controls: Decrement, Input, Increment & Presets */}
                      <div className="flex items-center gap-2 shrink-0">
                        <div className="flex items-center bg-white border border-slate-300 rounded-xl p-0.5 shadow-2xs">
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.product.id, -1)}
                            className="w-7 h-7 min-h-[28px] flex items-center justify-center rounded text-slate-600 hover:bg-slate-100 font-bold transition"
                            aria-label={`Decrease quantity of ${item.product.name}`}
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          
                          <input
                            type="number"
                            min="1"
                            max="99999"
                            value={item.quantity}
                            onChange={(e) => {
                              const val = parseInt(e.target.value, 10);
                              const targetVal = isNaN(val) || val < 1 ? 1 : val;
                              if (onSetExactQuantity) {
                                onSetExactQuantity(item.product.id, targetVal);
                              } else {
                                onUpdateQuantity(item.product.id, targetVal - item.quantity);
                              }
                            }}
                            className="w-14 text-center font-bold text-xs text-slate-900 border-none outline-none focus:ring-1 focus:ring-orange-500 rounded py-0.5 bg-slate-50"
                            aria-label={`Quantity for ${item.product.name}`}
                          />

                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.product.id, 1)}
                            className="w-7 h-7 min-h-[28px] flex items-center justify-center rounded text-slate-600 hover:bg-slate-100 font-bold transition"
                            aria-label={`Increase quantity of ${item.product.name}`}
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Quick Presets (+10, +50, +100) */}
                        <div className="hidden sm:flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.product.id, 10)}
                            className="px-1.5 py-1 rounded text-[10px] font-bold bg-slate-200 hover:bg-slate-300 text-slate-700 transition"
                            title="Add 10 more"
                          >
                            +10
                          </button>
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.product.id, 50)}
                            className="px-1.5 py-1 rounded text-[10px] font-bold bg-slate-200 hover:bg-slate-300 text-slate-700 transition"
                            title="Add 50 more"
                          >
                            +50
                          </button>
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.product.id, 100)}
                            className="px-1.5 py-1 rounded text-[10px] font-bold bg-orange-100 hover:bg-orange-200 text-orange-800 transition"
                            title="Add 100 more"
                          >
                            +100
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => onRemoveItem(item.product.id)}
                          className="p-1.5 text-slate-400 hover:text-red-500 transition ml-1"
                          aria-label={`Remove ${item.product.name} from RFQ`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Extra Items Sourcing Box */}
              <div className="p-3.5 rounded-xl bg-orange-50/90 border border-orange-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-orange-950 uppercase tracking-wider flex items-center gap-1.5">
                    <span>Need Extra Items Not in the Catalogue? (On-Demand Sourcing)</span>
                  </h4>
                  <span className="text-[10px] font-bold text-orange-800 bg-orange-200 px-2 py-0.5 rounded">
                    Contractor Sourcing
                  </span>
                </div>
                <p className="text-[11px] text-orange-900 leading-relaxed">
                  We supply all industrial accessories and materials across India. Describe any non-standard sizes, custom logo printing, or specialized tools below:
                </p>
                <textarea
                  rows={2}
                  placeholder="e.g. 50 nos. chemical suits, 10 nos. tripod winch, custom contractor logo printed on safety helmets, 200m lifeline..."
                  value={extraItems}
                  onChange={(e) => setExtraItems(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-orange-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none bg-white text-base sm:text-xs text-slate-900 placeholder:text-slate-400"
                />
              </div>

              {/* Contractor Information Form */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Contractor / Buyer Details for Invoicing & Dispatch
                </h4>

                {/* Anti-spam honeypot input */}
                <input
                  type="text"
                  name="website_hp"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  style={{ position: 'absolute', opacity: 0, zIndex: -1, pointerEvents: 'none', height: 0, width: 0 }}
                />
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">
                      Your Name / Site Contact <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Ramesh Sharma"
                      value={contractorName}
                      onChange={(e) => {
                        setContractorName(e.target.value);
                        if (errors.name) setErrors({ ...errors, name: '' });
                      }}
                      className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border ${
                        errors.name ? 'border-red-500 bg-red-50/50' : 'border-slate-300 bg-white'
                      } focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none text-base sm:text-xs text-slate-900`}
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
                    <label className="block text-slate-700 font-bold mb-1">
                      Company / Contractor Firm
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Sharma Mechanical Works"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none text-base sm:text-xs text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">
                      Mobile / WhatsApp No. <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      placeholder="e.g. 9997993895"
                      value={phoneNumber}
                      onChange={(e) => {
                        setPhoneNumber(e.target.value);
                        if (errors.phone) setErrors({ ...errors, phone: '' });
                      }}
                      className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border ${
                        errors.phone ? 'border-red-500 bg-red-50/50' : 'border-slate-300 bg-white'
                      } focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none text-base sm:text-xs text-slate-900`}
                      required
                    />
                    {errors.phone && (
                      <p className="text-red-600 text-[11px] mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>{errors.phone}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">
                      Delivery Destination (Pan-India)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Surat, Mathura Refinery, Jamnagar, Delhi NCR"
                      value={siteLocation}
                      onChange={(e) => setSiteLocation(e.target.value)}
                      className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none text-base sm:text-xs text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1 text-xs">
                    Special Sizes or Additional Delivery Instructions
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Shoe sizes: UK 7 (20 prs), UK 8 (30 prs) / Urgent dispatch by Friday"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none text-base sm:text-xs text-slate-900"
                  />
                </div>

                {/* Material Test Certificate (MTC) Toggle */}
                <label className="flex items-start gap-2.5 p-3 rounded-xl bg-emerald-50/80 border border-emerald-200/90 cursor-pointer hover:bg-emerald-50 transition">
                  <input
                    type="checkbox"
                    checked={requestMtc}
                    onChange={(e) => setRequestMtc(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded mt-0.5 accent-emerald-600 cursor-pointer shrink-0"
                  />
                  <div className="text-xs">
                    <span className="font-black text-emerald-950 block">
                      Enclose Signed Material Test Certificate (MTC) & BIS Batch Conformity
                    </span>
                    <span className="text-[11px] text-emerald-800 leading-relaxed block mt-0.5">
                      Required for refinery entry gate permits (IOCL, GAIL, HPCL, L&T sites). We attach physical test reports with stamped invoice.
                    </span>
                  </div>
                </label>
              </div>
            </>
          )}
        </div>

        {/* Footer Actions */}
        {!submitted && rfqItems.length > 0 && (
          <div className="p-3.5 sm:p-4 bg-slate-100 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
            <div className="text-xs text-slate-600 text-center sm:text-left">
              Direct Quotation dispatched to <strong className="text-slate-900">{COMPANY_INFO.contactPerson}</strong>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleCopyBoq}
                className="w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 transition"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <FileText className="w-3.5 h-3.5 text-slate-500" />}
                <span>{copied ? 'Copied BOQ' : 'Copy BOQ'}</span>
              </button>

              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleSendWhatsApp}
                className="w-full sm:w-auto min-h-[46px] inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 disabled:opacity-75 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-bold shadow-sm transition"
              >
                <MessageCircle className="w-4 h-4 fill-white/20" />
                <span>{isSubmitting ? 'Logging RFQ...' : 'Send Bulk RFQ on WhatsApp'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
