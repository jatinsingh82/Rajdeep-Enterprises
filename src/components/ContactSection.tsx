import React, { useState } from 'react';
import { Phone, Mail, MapPin, Send, CheckCircle2, Clock, MessageSquare, AlertCircle, ExternalLink, User, Building } from 'lucide-react';
import { COMPANY_INFO, PRODUCTS } from '../data/companyData';
import { EnquiryFormData } from '../types';

interface ContactSectionProps {
  initialRequirement?: string;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ initialRequirement = '' }) => {
  const [formData, setFormData] = useState<EnquiryFormData>({
    fullName: '',
    companyName: '',
    phoneNumber: '',
    emailAddress: '',
    productRequirement: initialRequirement || 'Safety Shoes / Helmets',
    quantity: 'Bulk Industrial Supply',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errorMessage) setErrorMessage('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!formData.phoneNumber.trim() || formData.phoneNumber.length < 10) {
      setErrorMessage('Please provide a valid 10-digit phone number so we can respond.');
      return;
    }
    if (!formData.emailAddress.trim() || !formData.emailAddress.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (!formData.productRequirement.trim()) {
      setErrorMessage('Please specify your product requirement.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    // Simulate reliable dispatch & store inquiry locally
    setTimeout(() => {
      try {
        const stored = JSON.parse(localStorage.getItem('rajdeep_enquiries') || '[]');
        stored.push({
          ...formData,
          submittedAt: new Date().toISOString()
        });
        localStorage.setItem('rajdeep_enquiries', JSON.stringify(stored));
      } catch (e) {
        console.error(e);
      }

      setIsSubmitting(false);
      setSubmitSuccess(true);
    }, 800);
  };

  const sendDirectWhatsApp = () => {
    const text = encodeURIComponent(
      `*New Product Enquiry - Rajdeep Enterprises*\n\n` +
      `*Name:* ${formData.fullName || 'Client'}\n` +
      `*Company:* ${formData.companyName || 'Not specified'}\n` +
      `*Phone:* ${formData.phoneNumber}\n` +
      `*Email:* ${formData.emailAddress}\n` +
      `*Requirement:* ${formData.productRequirement}\n` +
      `*Quantity:* ${formData.quantity}\n` +
      `*Message:* ${formData.message || 'Please provide quotation and catalog.'}`
    );
    window.open(`https://wa.me/${COMPANY_INFO.whatsappNumber}?text=${text}`, '_blank');
  };

  return (
    <section id="contact" className="py-16 md:py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-900 text-xs font-bold uppercase tracking-wider mb-3">
            Get In Touch
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Contact Rajdeep Enterprises
          </h2>
          <div className="w-16 h-1 bg-blue-600 mx-auto mt-4 rounded-full"></div>
          <p className="mt-4 text-base text-slate-600">
            Reach out to us for immediate quotations, product samples, custom material requests, or industrial supply inquiries in Mathura and surrounding industrial belts.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Direct Business Contact Info & Map */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 sm:p-8 rounded-2xl bg-[#0B192C] text-white shadow-xl border border-slate-800 space-y-6">
              <div>
                <span className="text-xs font-bold text-sky-400 uppercase tracking-widest block mb-1">
                  Proprietor & Supply Lead
                </span>
                <h3 className="text-2xl font-black text-white">
                  {COMPANY_INFO.contactPerson}
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  Rajdeep Enterprises • Safety & Material Supplies
                </p>
              </div>

              <div className="space-y-4 pt-2">
                {/* Phone Numbers */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-sky-400 flex items-center justify-center shrink-0 border border-blue-500/30">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 font-medium">Direct Phone & WhatsApp</div>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3">
                      <a
                        id="contact-phone-link-1"
                        href={`tel:${COMPANY_INFO.phone}`}
                        className="text-base sm:text-lg font-bold text-sky-300 hover:text-sky-200 transition"
                      >
                        {COMPANY_INFO.phone}
                      </a>
                      <span className="hidden sm:inline text-slate-600">/</span>
                      <a
                        id="contact-phone-link-2"
                        href={`tel:${COMPANY_INFO.secondaryPhone}`}
                        className="text-base sm:text-lg font-bold text-sky-300 hover:text-sky-200 transition"
                      >
                        {COMPANY_INFO.secondaryPhone}
                      </a>
                    </div>
                    <span className="text-[11px] text-slate-400 block mt-0.5">(Available for urgent & emergency industrial supplies)</span>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/30">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 font-medium">Official Email Address</div>
                    <a
                      id="contact-email-link"
                      href={`mailto:${COMPANY_INFO.email}`}
                      className="text-sm sm:text-base font-semibold text-white hover:text-sky-300 transition break-all block"
                    >
                      {COMPANY_INFO.email}
                    </a>
                    <span className="text-[11px] text-slate-400">Send RFQs, Purchase Orders & Specs</span>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 font-medium">Physical Location & Depot</div>
                    <p className="text-sm font-semibold text-slate-200 leading-snug">
                      {COMPANY_INFO.address}
                    </p>
                    <span className="text-[11px] text-sky-400 font-medium mt-1 block">
                      Landmark: Refinery Main Gate (Mathura)
                    </span>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0 border border-purple-500/30">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 font-medium">Working Hours</div>
                    <p className="text-xs text-slate-200">
                      {COMPANY_INFO.operatingHours}
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick WhatsApp Action button */}
              <div className="pt-4 border-t border-slate-800">
                <a
                  id="contact-chat-whatsapp-btn"
                  href={`https://wa.me/${COMPANY_INFO.whatsappNumber}?text=${encodeURIComponent(COMPANY_INFO.whatsappDefaultMessage)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition flex items-center justify-center gap-2 shadow-md"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Start Direct WhatsApp Conversation</span>
                </a>
              </div>
            </div>

            {/* Google Maps Location Card */}
            <div className="p-6 rounded-2xl bg-blue-50/50 border border-blue-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <span>Location Map • Mathura Refinery Gate</span>
                </div>
                <span className="text-[11px] bg-white border border-blue-200 text-blue-900 px-2 py-0.5 rounded font-mono font-bold">
                  UP SIDC
                </span>
              </div>

              <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-200 aspect-video flex items-center justify-center group">
                {/* Styled static map preview representing Mathura Refinery Gate */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-[#0B192C] to-slate-950 flex flex-col items-center justify-center p-4 text-center text-white">
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center mb-2 shadow-lg animate-bounce">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-xs font-bold text-white">
                    15/1, U.P. S.I.D.C. Complex
                  </div>
                  <div className="text-[11px] text-sky-300">
                    Refinery Main Gate, Mathura, UP
                  </div>
                  <div className="text-[10px] text-slate-400 mt-2">
                    Opposite Mathura Refinery Entrance
                  </div>
                </div>

                <a
                  id="contact-open-google-maps-btn"
                  href={COMPANY_INFO.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute bottom-3 right-3 bg-white/95 text-slate-900 hover:bg-white text-xs font-bold px-3 py-1.5 rounded-lg shadow flex items-center gap-1.5 transition"
                >
                  <span>Open in Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
                </a>
              </div>
            </div>

          </div>

          {/* Right Column: Contact & Quotation Form */}
          <div className="lg:col-span-7">
            <div className="bg-slate-50 rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm">
              <div className="mb-6">
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                  Send Product Enquiry & Quotation Request
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  Fill out the details below. Proprietor Raj Singh Tarkar will review your specifications and reply promptly.
                </p>
              </div>

              {submitSuccess ? (
                <div className="p-6 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-4">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-lg font-bold text-emerald-900">
                    Enquiry Submitted Successfully!
                  </h4>
                  <p className="text-xs sm:text-sm text-emerald-800 max-w-md mx-auto">
                    Thank you, <strong className="font-semibold">{formData.fullName}</strong>. We have received your requirement for <strong className="font-semibold">{formData.productRequirement}</strong>. We will get in touch with you shortly at <strong className="font-semibold">{formData.phoneNumber}</strong>.
                  </p>
                  <div className="pt-2 flex flex-wrap justify-center gap-3">
                    <button
                      onClick={sendDirectWhatsApp}
                      className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 flex items-center gap-1.5"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Also Send Via WhatsApp</span>
                    </button>
                    <button
                      onClick={() => {
                        setSubmitSuccess(false);
                        setFormData({
                          fullName: '',
                          companyName: '',
                          phoneNumber: '',
                          emailAddress: '',
                          productRequirement: 'Safety Shoes / Helmets',
                          quantity: 'Bulk Supply',
                          message: ''
                        });
                      }}
                      className="px-4 py-2 rounded-lg text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100"
                    >
                      Submit Another Enquiry
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-left">
                  {errorMessage && (
                    <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  {/* Name & Company */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="contact-form-fullname"
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="e.g. Ramesh Kumar"
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-lg border border-slate-300 bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Company Name / Contractor
                      </label>
                      <input
                        id="contact-form-company"
                        type="text"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleChange}
                        placeholder="e.g. Mathura Construction / Refinery Works"
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-lg border border-slate-300 bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition"
                      />
                    </div>
                  </div>

                  {/* Phone & Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="contact-form-phone"
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        placeholder="e.g. 09997993895"
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-lg border border-slate-300 bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="contact-form-email"
                        type="email"
                        name="emailAddress"
                        value={formData.emailAddress}
                        onChange={handleChange}
                        placeholder="e.g. contact@yourfirm.com"
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-lg border border-slate-300 bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition"
                        required
                      />
                    </div>
                  </div>

                  {/* Product Requirement & Approximate Quantity */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Product Requirement <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="contact-form-requirement"
                        name="productRequirement"
                        value={formData.productRequirement}
                        onChange={handleChange}
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-lg border border-slate-300 bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition"
                      >
                        <option value="Safety Helmets">Industrial Safety Helmets</option>
                        <option value="Safety Shoes">Industrial Safety Shoes</option>
                        <option value="Reflective Safety Jackets">Reflective Safety Jackets</option>
                        <option value="Industrial Safety Gloves">Hand Gloves (Nitrile / Leather / Cut)</option>
                        <option value="Full Body Safety Harness">Full Body Safety Belt & Harness</option>
                        <option value="Safety Goggles">Protective Safety Goggles / Eyewear</option>
                        <option value="Safety Gumboots">Industrial Safety Gumboots</option>
                        <option value="Road Cones">Traffic & Road Safety Cones</option>
                        <option value="Road Studs">Solar & Reflective Road Studs</option>
                        <option value="Protective Masks">Protective Masks & Respirators</option>
                        <option value="Workplace Safety Equipment">Workplace Safety & Barrier Tapes</option>
                        <option value="Industrial Material Supplies">General Material Supplies & Consumables</option>
                        <option value="Comprehensive Safety Package">Complete PPE Plant Package</option>
                        <option value="Other Custom Requirement">Other Custom Requirement</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Estimated Quantity
                      </label>
                      <input
                        id="contact-form-quantity"
                        type="text"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                        placeholder="e.g. 50 pairs, 100 pcs, Ongoing monthly"
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-lg border border-slate-300 bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition"
                      />
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Message / Specific Details
                    </label>
                    <textarea
                      id="contact-form-message"
                      rows={4}
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Please specify any specific certifications, required delivery timeline, brand preference, or sizes..."
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-lg border border-slate-300 bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition"
                    ></textarea>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                    <button
                      id="contact-form-submit-btn"
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:flex-1 py-3 px-6 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-500 shadow-md hover:shadow transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-70"
                    >
                      {isSubmitting ? (
                        <span>Submitting Enquiry...</span>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Send Enquiry</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={sendDirectWhatsApp}
                      className="w-full sm:w-auto py-3 px-4 rounded-xl font-bold text-xs text-slate-800 bg-slate-200 hover:bg-slate-300 transition flex items-center justify-center gap-1.5"
                    >
                      <MessageSquare className="w-4 h-4 text-emerald-600" />
                      <span>Send to WhatsApp</span>
                    </button>
                  </div>

                  <p className="text-[11px] text-slate-400 text-center sm:text-left pt-1">
                    Your contact information is strictly used for official quotation and dispatch queries.
                  </p>
                </form>
              )}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
