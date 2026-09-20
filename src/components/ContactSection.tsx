import React, { useState, useRef } from 'react';
import { Phone, Mail, MapPin, Send, CheckCircle2, Clock, MessageSquare, AlertCircle, ExternalLink, User, Building } from 'lucide-react';
import { COMPANY_INFO, PRODUCTS } from '../data/companyData';
import { EnquiryFormData } from '../types';
import {
  trackPhoneClick,
  trackWhatsAppClick,
  trackDirectionsClick,
  trackQuoteStart,
  trackQuoteSubmit,
  trackCallbackRequest,
} from '../utils/analytics';

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
  const [requestCallback, setRequestCallback] = useState(false);
  const [honeypot, setHoneypot] = useState('');
  const [enquiryReference, setEnquiryReference] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const hasStartedQuoteRef = useRef(false);

  const handleFormInteraction = () => {
    if (!hasStartedQuoteRef.current) {
      hasStartedQuoteRef.current = true;
      trackQuoteStart({
        productName: formData.productRequirement,
        category: 'Contact Form',
        source: 'contact_section_form',
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    handleFormInteraction();
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errorMessage) setErrorMessage('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side Validation
    if (!formData.fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    const cleanPhone = formData.phoneNumber.replace(/[^0-9]/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      setErrorMessage('Please provide a valid 10-digit mobile number so our team can respond.');
      return;
    }
    if (formData.emailAddress.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.emailAddress.trim())) {
        setErrorMessage('Please enter a valid email address or leave it blank.');
        return;
      }
    }
    if (!formData.productRequirement.trim()) {
      setErrorMessage('Please specify your product requirement.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    // Call server API with timeout controller (8s)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    let generatedEnquiryId = '';

    try {
      const res = await fetch('/api/enquiry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          companyName: formData.companyName,
          phoneNumber: formData.phoneNumber,
          emailAddress: formData.emailAddress,
          productRequirement: formData.productRequirement,
          quantity: formData.quantity,
          message: formData.message + (requestCallback ? ' [URGENT CALLBACK REQUESTED]' : ''),
          website_hp: honeypot // Anti-spam honeypot
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      const data = await res.json();

      if (res.ok && data.success) {
        generatedEnquiryId = data.enquiryId || '';
        setEnquiryReference(generatedEnquiryId);
        setSubmitSuccess(true);
        setErrorMessage('');

        // Track quote submission event (anonymous)
        trackQuoteSubmit({
          productName: formData.productRequirement,
          category: 'Contact Form',
          quantity: formData.quantity,
          enquiryId: generatedEnquiryId || undefined,
          hasCompany: Boolean(formData.companyName.trim()),
        });

        // If user requested callback, track callback_request (strictly anonymous)
        if (requestCallback) {
          trackCallbackRequest({
            source: 'contact_form_callback_checkbox',
            urgency: 'high',
          });
        }
      } else {
        setSubmitSuccess(false);
        setErrorMessage(
          data.error ||
          'Server lead storage is unconfigured or unavailable. Your enquiry could not be saved. Please connect directly via WhatsApp or Call.'
        );
      }
    } catch (err: any) {
      clearTimeout(timeoutId);
      setSubmitSuccess(false);
      if (err?.name === 'AbortError') {
        setErrorMessage('Network connection timed out. Please contact Rajdeep Enterprises directly on WhatsApp (+91-9997993895) or Call.');
      } else {
        setErrorMessage('Unable to reach server. Please connect directly with our sales desk on WhatsApp or Call.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const sendDirectWhatsApp = () => {
    trackWhatsAppClick({
      source: 'contact_section_form',
      context: 'direct_enquiry',
      productName: formData.productRequirement,
    });
    const text = encodeURIComponent(
      `*New Product Enquiry - Rajdeep Enterprises*\n\n` +
      `*Name:* ${formData.fullName || 'Client'}\n` +
      `*Company:* ${formData.companyName || 'Not specified'}\n` +
      `*Phone:* ${formData.phoneNumber}\n` +
      `*Email:* ${formData.emailAddress}\n` +
      `*Requirement:* ${formData.productRequirement}\n` +
      `*Quantity:* ${formData.quantity}\n` +
      (requestCallback ? `*Urgent Callback:* Requested\n` : '') +
      `*Message:* ${formData.message || 'Please provide quotation and catalog.'}`
    );
    window.open(`https://wa.me/${COMPANY_INFO.whatsappNumber}?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="contact" className="py-12 sm:py-16 md:py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold uppercase tracking-wider mb-3">
            <span>Direct Commercial Enquiries</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Contact Rajdeep Enterprises
          </h2>
          <div className="w-16 h-1 bg-orange-600 mx-auto mt-3 sm:mt-4 rounded-full"></div>
          <p className="mt-3 sm:mt-4 text-sm sm:text-base text-slate-600">
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
                {/* Phone Numbers with One-Tap Call */}
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-sky-400 flex items-center justify-center shrink-0 border border-blue-500/30">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-slate-400 font-medium">Direct Phone & WhatsApp</div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3 mt-1">
                      <a
                        id="contact-phone-link-1"
                        href={`tel:${COMPANY_INFO.phone}`}
                        onClick={() => trackPhoneClick({ phoneNumber: COMPANY_INFO.phone, source: 'contact_section_phone_1' })}
                        className="inline-flex items-center gap-1.5 text-base sm:text-lg font-bold text-amber-400 hover:text-amber-300 transition py-1"
                      >
                        <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>{COMPANY_INFO.phone}</span>
                      </a>
                      <span className="hidden sm:inline text-slate-600">/</span>
                      <a
                        id="contact-phone-link-2"
                        href={`tel:${COMPANY_INFO.secondaryPhone}`}
                        onClick={() => trackPhoneClick({ phoneNumber: COMPANY_INFO.secondaryPhone, source: 'contact_section_phone_2' })}
                        className="inline-flex items-center gap-1.5 text-base sm:text-lg font-bold text-slate-200 hover:text-white transition py-1"
                      >
                        <span>{COMPANY_INFO.secondaryPhone}</span>
                      </a>
                    </div>
                    <span className="text-[11px] text-slate-400 block mt-0.5">One-tap calling available for immediate plant supplies</span>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 text-orange-400 flex items-center justify-center shrink-0 border border-slate-700">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-slate-400 font-medium">Official Email Address</div>
                    <a
                      id="contact-email-link"
                      href={`mailto:${COMPANY_INFO.email}`}
                      className="text-sm sm:text-base font-semibold text-white hover:text-orange-400 transition break-all block mt-0.5"
                    >
                      {COMPANY_INFO.email}
                    </a>
                    <span className="text-[11px] text-slate-400">Send RFQs, Purchase Orders & Specs</span>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 text-emerald-400 flex items-center justify-center shrink-0 border border-slate-700">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-slate-400 font-medium">Physical Location & Depot</div>
                    <p className="text-sm font-semibold text-slate-200 leading-snug mt-0.5">
                      {COMPANY_INFO.address}
                    </p>
                    <span className="text-[11px] text-orange-400 font-medium mt-1 block">
                      Landmark: Refinery Main Gate (Mathura)
                    </span>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 text-amber-400 flex items-center justify-center shrink-0 border border-slate-700">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-slate-400 font-medium">Business Hours</div>
                    <p className="text-xs text-slate-200 mt-0.5">
                      Mon - Sat: 9:00 AM - 8:00 PM
                    </p>
                    <p className="text-[11px] text-emerald-400 font-semibold mt-0.5">
                      Sunday: Emergency Supply Available
                    </p>
                  </div>
                </div>
              </div>

              {/* Direct Actions (WhatsApp & Directions) */}
              <div className="pt-4 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <a
                  id="contact-chat-whatsapp-btn"
                  href={`https://wa.me/${COMPANY_INFO.whatsappNumber}?text=${encodeURIComponent(COMPANY_INFO.whatsappDefaultMessage)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackWhatsAppClick({ source: 'contact_section_card', context: 'direct_chat' })}
                  className="min-h-[44px] py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 transition flex items-center justify-center gap-2 shadow-xs active:scale-98"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Chat on WhatsApp</span>
                </a>

                <a
                  id="contact-directions-btn"
                  href={COMPANY_INFO.directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackDirectionsClick({ source: 'contact_section_directions' })}
                  className="min-h-[44px] py-2.5 px-4 rounded-xl text-xs font-bold text-slate-200 bg-slate-800 hover:bg-slate-700 active:bg-slate-900 border border-slate-700 transition flex items-center justify-center gap-2 shadow-xs active:scale-98"
                >
                  <MapPin className="w-4 h-4 text-orange-400" />
                  <span>Get Directions</span>
                </a>
              </div>
            </div>

            {/* Google Maps Location Card */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                  <MapPin className="w-4 h-4 text-orange-600" />
                  <span>Shop Location • Rajdeep Enterprises</span>
                </div>
                <span className="text-[11px] bg-white border border-slate-300 text-slate-800 px-2 py-0.5 rounded font-mono font-bold">
                  UP SIDC
                </span>
              </div>

              <div className="relative rounded-xl overflow-hidden border border-slate-300 bg-slate-200 aspect-video flex items-center justify-center group">
                {/* Styled static map preview representing Rajdeep Enterprises shop */}
                <div className="absolute inset-0 bg-[#0B192C] flex flex-col items-center justify-center p-4 text-center text-white">
                  <div className="w-10 h-10 rounded-xl bg-orange-600 flex items-center justify-center mb-2 shadow-sm">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-xs font-bold text-white">
                    Rajdeep Enterprises • 15/1, U.P. S.I.D.C. Complex
                  </div>
                  <div className="text-[11px] text-amber-300">
                    Opposite Refinery Main Gate, Mathura, UP - 281005
                  </div>
                  <div className="text-[10px] text-slate-400 mt-2">
                    Direct counter pickup & warehouse supply depot
                  </div>
                </div>

                <a
                  id="contact-open-google-maps-btn"
                  href={COMPANY_INFO.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackDirectionsClick({ source: 'contact_section_google_maps_card' })}
                  className="absolute bottom-3 right-3 bg-white text-slate-900 hover:bg-slate-100 text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm flex items-center gap-1.5 transition border border-slate-200"
                >
                  <span>Open in Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5 text-orange-600" />
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
                  {enquiryReference && (
                    <div className="inline-block px-3 py-1 bg-emerald-100 text-emerald-900 rounded-lg text-xs font-mono font-bold">
                      Ref ID: {enquiryReference}
                    </div>
                  )}
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
                  {/* Anti-spam honeypot input (invisible to real users) */}
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

                  {errorMessage && (
                    <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs space-y-2">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <span className="font-medium leading-relaxed">{errorMessage}</span>
                      </div>
                      <div className="pt-1 flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={sendDirectWhatsApp}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs inline-flex items-center gap-1.5"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Send Requirement via WhatsApp</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Form fields: single column stacked layout on mobile for effortless typing */}
                  <div className="space-y-4">
                    {/* Full Name */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="contact-form-fullname"
                        type="text"
                        name="fullName"
                        autoComplete="name"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="e.g. Ramesh Kumar"
                        className="w-full min-h-[46px] px-3.5 py-2.5 text-base sm:text-sm rounded-xl border border-slate-300 bg-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition"
                        required
                      />
                    </div>

                    {/* Company Name */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Company Name / Contractor
                      </label>
                      <input
                        id="contact-form-company"
                        type="text"
                        name="companyName"
                        autoComplete="organization"
                        value={formData.companyName}
                        onChange={handleChange}
                        placeholder="e.g. Mathura Construction / Refinery Works"
                        className="w-full min-h-[46px] px-3.5 py-2.5 text-base sm:text-sm rounded-xl border border-slate-300 bg-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition"
                      />
                    </div>

                    {/* Phone Number */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="contact-form-phone"
                        type="tel"
                        name="phoneNumber"
                        autoComplete="tel"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        placeholder="e.g. 09997993895"
                        className="w-full min-h-[46px] px-3.5 py-2.5 text-base sm:text-sm rounded-xl border border-slate-300 bg-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition"
                        required
                      />
                    </div>

                    {/* Email Address */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="contact-form-email"
                        type="email"
                        name="emailAddress"
                        autoComplete="email"
                        value={formData.emailAddress}
                        onChange={handleChange}
                        placeholder="e.g. contact@yourfirm.com"
                        className="w-full min-h-[46px] px-3.5 py-2.5 text-base sm:text-sm rounded-xl border border-slate-300 bg-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition"
                        required
                      />
                    </div>

                    {/* Product Requirement */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Product Requirement <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="contact-form-requirement"
                        name="productRequirement"
                        value={formData.productRequirement}
                        onChange={handleChange}
                        className="w-full min-h-[46px] px-3.5 py-2.5 text-base sm:text-sm rounded-xl border border-slate-300 bg-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition"
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

                    {/* Quantity */}
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
                        className="w-full min-h-[46px] px-3.5 py-2.5 text-base sm:text-sm rounded-xl border border-slate-300 bg-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition"
                      />
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Message / Specific Details
                      </label>
                      <textarea
                        id="contact-form-message"
                        rows={3}
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Please specify any certifications, brand preference, required delivery timeline, or sizes..."
                        className="w-full px-3.5 py-2.5 text-base sm:text-sm rounded-xl border border-slate-300 bg-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition"
                      ></textarea>
                    </div>
                    {/* Urgent Callback Request Option */}
                    <label className="flex items-center gap-2.5 p-3 rounded-xl bg-amber-50/80 border border-amber-200 cursor-pointer hover:bg-amber-100/70 transition">
                      <input
                        type="checkbox"
                        checked={requestCallback}
                        onChange={(e) => {
                          handleFormInteraction();
                          setRequestCallback(e.target.checked);
                        }}
                        className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500 border-slate-300 shrink-0"
                      />
                      <div className="text-xs">
                        <span className="font-bold text-slate-900 block">Urgent: Request immediate phone callback</span>
                        <span className="text-slate-500 text-[11px] block">Proprietor will call directly for gate emergency or quick sizing</span>
                      </div>
                    </label>

                  </div>

                  {/* Submit Action Buttons */}
                  <div className="pt-2 flex flex-col gap-2.5">
                    <button
                      id="contact-form-submit-btn"
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full min-h-[48px] py-3.5 px-6 rounded-xl font-bold text-sm text-white bg-orange-600 hover:bg-orange-700 active:bg-orange-800 shadow-sm transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-70"
                    >
                      {isSubmitting ? (
                        <span>Submitting Quotation Request...</span>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Submit Quotation Request</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={sendDirectWhatsApp}
                      className="w-full min-h-[46px] py-3 px-4 rounded-xl font-bold text-xs text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 transition flex items-center justify-center gap-2 shadow-xs active:scale-98"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Send Enquiry on WhatsApp</span>
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
