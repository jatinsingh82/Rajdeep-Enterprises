import React, { useState, useEffect } from 'react';
import { X, MessageCircle, Phone, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { COMPANY_INFO, PRODUCTS } from '../data/companyData';

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName?: string;
}

export const EnquiryModal: React.FC<EnquiryModalProps> = ({ isOpen, onClose, productName = '' }) => {
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [requirement, setRequirement] = useState(productName || 'Industrial Safety Accessories');
  const [quantity, setQuantity] = useState('50 units');
  const [deliveryLocation, setDeliveryLocation] = useState('Whole India / Mathura Site');
  const [extraItems, setExtraItems] = useState('');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (productName) {
      setRequirement(productName);
    }
  }, [productName]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleWhatsAppInstant = () => {
    const text = encodeURIComponent(
      `*Product Enquiry - Rajdeep Enterprises*\n` +
      `*Supplying in Whole India Everywhere | Any Quantity*\n` +
      `*Requirement:* ${requirement}\n` +
      `*Quantity Desired:* ${quantity || 'Any Quantity'}\n` +
      `*Delivery Location:* ${deliveryLocation || 'Whole India Supply'}\n` +
      (extraItems ? `*Extra Items / Custom Sourcing:* ${extraItems}\n` : '') +
      `*Client:* ${name || 'Prospective Buyer'}\n` +
      `*Company:* ${company || 'Industrial Buyer'}\n` +
      `*Phone:* ${phone || 'Please reply on WhatsApp'}\n` +
      `*Notes:* ${notes || 'Kindly share quotation and lead time.'}`
    );
    window.open(`https://wa.me/${COMPANY_INFO.whatsappNumber}?text=${text}`, '_blank');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please provide your name.');
      return;
    }
    if (!phone.trim() || phone.length < 10) {
      setError('Please enter a valid 10-digit contact number.');
      return;
    }

    try {
      const stored = JSON.parse(localStorage.getItem('rajdeep_enquiries') || '[]');
      stored.push({
        fullName: name,
        companyName: company,
        phoneNumber: phone,
        emailAddress: email,
        productRequirement: requirement,
        quantity,
        message: notes,
        submittedAt: new Date().toISOString()
      });
      localStorage.setItem('rajdeep_enquiries', JSON.stringify(stored));
    } catch (err) {
      console.error(err);
    }

    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
          <div>
            <span className="text-[10px] font-bold text-orange-400 uppercase tracking-wider block">
              Quick Quotation Request
            </span>
            <h3 className="text-lg font-black text-white">
              Enquire with Rajdeep Enterprises
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {submitted ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900">
                Quotation Request Received!
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 max-w-xs mx-auto">
                Thank you, <strong className="text-slate-900">{name}</strong>. Raj Singh Tarkar will review your requirement for <strong className="text-slate-900">{requirement}</strong> and respond at <strong className="text-slate-900">{phone}</strong>.
              </p>
              <div className="pt-2 flex flex-col gap-2">
                <button
                  onClick={handleWhatsAppInstant}
                  className="w-full py-2.5 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Send Fast Copy to WhatsApp</span>
                </button>
                <button
                  onClick={onClose}
                  className="w-full py-2 rounded-lg text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200"
                >
                  Close Window
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3.5 text-left text-xs">
              {error && (
                <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Requirement pre-filled */}
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Product / Service Needed
                </label>
                <input
                  type="text"
                  value={requirement}
                  onChange={(e) => setRequirement(e.target.value)}
                  placeholder="e.g. Safety Shoes, Road Cones, Belt Harness"
                  className="w-full min-h-[44px] px-3.5 py-2.5 text-base sm:text-xs rounded-xl border border-slate-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
                  required
                />
              </div>

              {/* Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Your Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full name"
                    className="w-full min-h-[44px] px-3.5 py-2.5 text-base sm:text-xs rounded-xl border border-slate-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    autoComplete="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="09997993895"
                    className="w-full min-h-[44px] px-3.5 py-2.5 text-base sm:text-xs rounded-xl border border-slate-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
                    required
                  />
                </div>
              </div>

              {/* Company & Quantity */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Company / Firm
                  </label>
                  <input
                    type="text"
                    autoComplete="organization"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Company name"
                    className="w-full min-h-[44px] px-3.5 py-2.5 text-base sm:text-xs rounded-xl border border-slate-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Quantity Desired (Any Quantity)
                  </label>
                  <input
                    type="text"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="e.g. 5 pcs, 50 pairs, 1,000 units"
                    className="w-full min-h-[44px] px-3.5 py-2.5 text-base sm:text-xs rounded-xl border border-slate-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
                  />
                </div>
              </div>

              {/* Pan-India Delivery Destination */}
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center justify-between">
                  <span>Delivery Location Anywhere in India *</span>
                  <span className="text-[10px] text-emerald-600 font-bold lowercase">🇮🇳 pan-india dispatch</span>
                </label>
                <input
                  type="text"
                  value={deliveryLocation}
                  onChange={(e) => setDeliveryLocation(e.target.value)}
                  placeholder="e.g. Surat, Mathura Refinery, Jamnagar, Paradip, Delhi NCR (Any City/Pin Code)"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
                />
              </div>

              {/* Extra Items / Custom Sourcing */}
              <div className="bg-amber-50/80 p-3 rounded-lg border border-amber-200">
                <label className="block font-bold text-amber-950 uppercase tracking-wider text-[11px] mb-1 flex items-center justify-between">
                  <span>Need Anything Extra or Not Listed?</span>
                  <span className="text-[10px] bg-amber-200 text-amber-900 px-1.5 py-0.2 rounded font-bold">Custom Sourcing</span>
                </label>
                <p className="text-[11px] text-amber-800 mb-1.5">
                  Want anything extra added to this supply? Mention it here and we will supply it on demand:
                </p>
                <input
                  type="text"
                  value={extraItems}
                  onChange={(e) => setExtraItems(e.target.value)}
                  placeholder="e.g. Custom logo printing, specialized chemical boots, emergency shower, tripod..."
                  className="w-full px-3 py-1.5 text-xs rounded border border-amber-300 bg-white focus:border-orange-500 outline-none"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Additional Specifications / Notes
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Mention delivery urgency, certification needs, or sizes..."
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
                ></textarea>
              </div>

              {/* Buttons */}
              <div className="pt-2 flex flex-col gap-2">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-lg font-bold text-xs text-white bg-orange-600 hover:bg-orange-500 transition flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Quotation Request</span>
                </button>

                <div className="relative flex py-1 items-center">
                  <div className="flex-grow border-t border-slate-200"></div>
                  <span className="flex-shrink mx-2 text-[10px] text-slate-400 font-semibold uppercase">Or Direct Contact</span>
                  <div className="flex-grow border-t border-slate-200"></div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={handleWhatsAppInstant}
                    className="py-2 px-3 rounded-lg font-bold text-xs text-white bg-emerald-600 hover:bg-emerald-500 transition flex items-center justify-center gap-1.5"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </button>

                  <a
                    href={`tel:${COMPANY_INFO.phone}`}
                    className="py-2 px-3 rounded-lg font-bold text-xs text-slate-900 bg-amber-400 hover:bg-amber-300 transition flex items-center justify-center gap-1.5"
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
