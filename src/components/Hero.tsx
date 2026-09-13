import React, { useRef, useState } from 'react';
import { ArrowRight, Phone, ShieldCheck, MapPin, CheckCircle, Building, HardHat, FileText, UserCheck, Store, Camera, Upload, RefreshCw, Check } from 'lucide-react';
import { COMPANY_INFO } from '../data/companyData';
import { useOwnerPhoto } from '../hooks/useOwnerPhoto';

interface HeroProps {
  onOpenQuoteModal: (productName?: string) => void;
  onOpenVisitingCard: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenQuoteModal, onOpenVisitingCard }) => {
  const { photoUrl, photoFileName, isCustomRealPhoto, uploadPhoto, resetToDefault } = useOwnerPhoto();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadFeedback, setUploadFeedback] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = async (file: File) => {
    setIsUploading(true);
    try {
      await uploadPhoto(file);
      setUploadFeedback('Real photo loaded successfully with 100% original quality!');
      setTimeout(() => setUploadFeedback(null), 4000);
    } catch {
      setUploadFeedback('Could not load file. Please select a valid image.');
      setTimeout(() => setUploadFeedback(null), 4000);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <section id="home" className="relative overflow-hidden bg-[#071324] text-white pt-2 sm:pt-4 pb-6 sm:pb-8 md:py-14 lg:py-16">
      {/* Hidden File Input for Real Photo Upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
        id="owner-photo-file-input"
      />

      {/* Background industrial overlay & grid */}
      <div className="absolute inset-0 industrial-grid-dark opacity-25 pointer-events-none"></div>
      
      {/* Subtle safety accent gradient glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Top safety stripe bar */}
      <div className="absolute top-0 left-0 right-0 h-1 hazard-stripe-light opacity-90"></div>

      <div className="relative max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
        {/* Mobile View: Authentic, untouched photo & storefront card (lg:hidden) */}
        <div className="lg:hidden space-y-2 mb-2">
          {/* Storefront & Proprietor Card */}
          <div className="rounded-xl overflow-hidden bg-slate-900/95 border border-sky-500/40 shadow-lg backdrop-blur-sm">
            {/* Real Shop Photo - Exact uploaded photo with zero modifications or overlays */}
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`w-full bg-slate-950 flex flex-col items-center justify-center overflow-hidden transition-all ${
                isDragging ? 'ring-4 ring-emerald-400 bg-slate-900' : ''
              }`}
            >
              <img
                src={photoUrl}
                alt="Shop owner Raj Singh Tarkar at Rajdeep Enterprises store"
                className="w-full h-auto max-h-[220px] sm:max-h-[300px] object-contain block"
                loading="eager"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Photo Banner / Upload Indicator for Mobile */}
            {!isCustomRealPhoto ? (
              <div className="p-2 bg-amber-500/15 border-t border-amber-500/30 flex items-center justify-between gap-2">
                <div className="text-left text-[11px] text-amber-200 truncate">
                  <span className="font-bold text-amber-300">Original Photo (0% AI)</span>
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="py-1 px-2.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] sm:text-xs flex items-center gap-1 shrink-0"
                >
                  <Camera className="w-3 h-3" />
                  <span>Choose File</span>
                </button>
              </div>
            ) : (
              <div className="px-2.5 py-1.5 bg-emerald-950/80 border-t border-emerald-500/40 flex items-center justify-between gap-2 text-[11px]">
                <div className="flex items-center gap-1 text-emerald-300 font-bold truncate">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="truncate">100% Real Photo Active</span>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-sky-300 text-[10px] font-bold border border-slate-700"
                  >
                    Change
                  </button>
                  <button
                    type="button"
                    onClick={resetToDefault}
                    className="p-1 rounded text-slate-400 hover:text-red-400"
                    title="Reset to default"
                  >
                    <RefreshCw className="w-2.5 h-2.5" />
                  </button>
                </div>
              </div>
            )}

            {uploadFeedback && (
              <div className="p-1.5 bg-emerald-600 text-white text-[10px] font-bold text-center animate-in fade-in">
                {uploadFeedback}
              </div>
            )}

            {/* Shop Details & Direct Actions - Positioned cleanly beneath the photo */}
            <div className="p-2.5 sm:p-3.5 space-y-2 bg-slate-900 border-t border-slate-800">
              <div className="flex items-start justify-between gap-1.5">
                <div>
                  <div className="flex items-center gap-1 text-[10px] font-bold text-sky-400 uppercase tracking-wide">
                    <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span>Proprietor & Store</span>
                  </div>
                  <h1 className="text-base sm:text-lg font-black text-white tracking-tight leading-tight mt-0.5">
                    RAJDEEP ENTERPRISES
                  </h1>
                  <p className="text-[11px] text-slate-200 font-semibold mt-0.5 flex items-center gap-1">
                    <UserCheck className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span>{COMPANY_INFO.contactPerson} (Proprietor)</span>
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5 flex items-start gap-1">
                    <MapPin className="w-2.5 h-2.5 text-sky-400 shrink-0 mt-0.5" />
                    <span className="truncate">15/1, U.P. S.I.D.C. Complex, Refinery Main Gate, Mathura</span>
                  </p>
                </div>
              </div>

              {/* 3 Direct Mobile Contact Buttons */}
              <div className="grid grid-cols-3 gap-1.5 pt-1 border-t border-slate-800/80">
                <a
                  href={`tel:${COMPANY_INFO.phone}`}
                  className="flex flex-col items-center justify-center py-1.5 px-1 rounded-lg bg-emerald-600 active:bg-emerald-700 text-white font-bold text-[10px] shadow transition text-center"
                >
                  <Phone className="w-3 h-3 mb-0.5" />
                  <span>Call Owner</span>
                </a>

                <a
                  href={`https://wa.me/91${COMPANY_INFO.phone}?text=Hello%20Rajdeep%20Enterprises,%20I%20need%20a%20quotation%20for%20safety%20materials`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center py-1.5 px-1 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-emerald-100 font-bold text-[10px] border border-emerald-600/50 shadow transition text-center"
                >
                  <span className="text-xs leading-none mb-0.5">💬</span>
                  <span>WhatsApp</span>
                </a>

                <button
                  onClick={onOpenVisitingCard}
                  className="flex flex-col items-center justify-center py-1.5 px-1 rounded-lg bg-slate-800 active:bg-slate-700 text-sky-300 font-bold text-[10px] border border-sky-500/40 shadow transition text-center"
                >
                  <FileText className="w-3 h-3 mb-0.5 text-sky-400" />
                  <span>Visiting Card</span>
                </button>
              </div>

              {/* Mobile Quick Value Line */}
              <div className="text-[10px] text-slate-300 flex items-center justify-between gap-1 font-medium bg-slate-950/60 py-1 px-2 rounded-md">
                <span className="flex items-center gap-0.5 text-emerald-400 font-bold">
                  <CheckCircle className="w-2.5 h-2.5" /> Any Quantity
                </span>
                <span>•</span>
                <span className="flex items-center gap-0.5 text-sky-400 font-bold">
                  <CheckCircle className="w-2.5 h-2.5" /> Zero Limit
                </span>
                <span>•</span>
                <span className="text-slate-200">Refinery Grade</span>
              </div>

              {/* Mobile CTA to Jump to Products Grid */}
              <div className="pt-0.5 flex gap-1.5">
                <a
                  href="#products"
                  className="flex-1 py-1.5 px-2 rounded-lg font-bold text-[11px] text-white bg-blue-600 active:bg-blue-700 text-center flex items-center justify-center gap-1 shadow"
                >
                  <span>Explore Products</span>
                  <ArrowRight className="w-3 h-3" />
                </a>
                <button
                  onClick={() => onOpenQuoteModal()}
                  className="py-1.5 px-2.5 rounded-lg font-bold text-[11px] text-slate-950 bg-sky-400 active:bg-sky-300 shadow text-center"
                >
                  Quick Quote
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop View: Full 2-column layout (hidden on mobile, shown on lg+) */}
        <div className="hidden lg:grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Headings & Action buttons */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Location & Pan-India Trust Pill */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-700 text-xs font-semibold text-slate-200 shadow-sm backdrop-blur-sm">
                <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping"></span>
                <MapPin className="w-3.5 h-3.5 text-sky-400" />
                <span className="text-sky-300 font-bold">Mathura, UP</span>
                <span className="text-slate-500">•</span>
                <span className="text-slate-300">Refinery Main Gate Hub</span>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-950/80 border border-sky-500/50 text-sky-300 text-xs font-bold shadow-sm">
                <UserCheck className="w-3.5 h-3.5 text-sky-400" />
                <span>Proprietor: {COMPANY_INFO.contactPerson}</span>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-600/50 text-emerald-300 text-xs font-bold shadow-sm">
                <span>🇮🇳 Supplying Whole India Everywhere</span>
              </div>
            </div>

            {/* Main Heading */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              {COMPANY_INFO.heroHeading}
            </h1>

            {/* Tagline / Subtitle */}
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl font-normal leading-relaxed">
              We supply safety accessories, welding consumables, Champion gaskets, site registers, stationery, tools, and industrial materials across the <strong className="text-white">whole of India everywhere</strong>. Order <strong className="text-sky-300">any quantity you want</strong> — with zero order limits. Need <strong className="text-orange-400">anything extra</strong> not in our catalogue? Contact proprietor <strong className="text-sky-300">{COMPANY_INFO.contactPerson}</strong> directly and we will source it for you immediately.
            </p>

            {/* Key Value Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs sm:text-sm text-slate-200">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span><strong className="text-white">Whole India Delivery:</strong> Dispatched to every state & pin code</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-sky-400 shrink-0" />
                <span><strong className="text-white">Any Quantity Supplied:</strong> Small samples to mega bulk</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-orange-400 shrink-0" />
                <span><strong className="text-white">Custom Extra Items:</strong> Contact us for on-demand sourcing</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-blue-400 shrink-0" />
                <span><strong className="text-white">Refinery Standard:</strong> BIS & EN certified PPE and gear</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-3">
              <a
                id="hero-explore-products-btn"
                href="#products"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg font-bold text-xs sm:text-sm text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/30 transition-all transform active:scale-95"
              >
                <span>Explore Products</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                id="hero-pan-india-btn"
                href="#pan-india"
                className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-bold text-xs sm:text-sm text-sky-300 bg-slate-900 hover:bg-slate-800 border border-sky-500/50 hover:border-sky-400 transition-all active:scale-95"
              >
                <span>🇮🇳 Pan-India Supply & Extra Items</span>
              </a>

              <a
                id="hero-call-now-btn"
                href={`tel:${COMPANY_INFO.phone}`}
                className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-bold text-xs sm:text-sm text-slate-950 bg-sky-400 hover:bg-sky-300 transition-all shadow-md active:scale-95"
              >
                <Phone className="w-4 h-4 text-slate-950" />
                <span>Call {COMPANY_INFO.displayPhone}</span>
              </a>
            </div>

            {/* Quick Visiting Card badge trigger */}
            <div className="pt-2">
              <button
                id="hero-visiting-card-trigger"
                onClick={onOpenVisitingCard}
                className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-sky-300 transition-colors"
              >
                <FileText className="w-4 h-4 text-sky-400" />
                <span className="underline decoration-dotted underline-offset-4">
                  View Reference Visiting Card & Contact Information
                </span>
                <span className="bg-slate-800 text-[10px] px-2 py-0.5 rounded text-slate-300 border border-slate-700">Official</span>
              </button>
            </div>
          </div>

          {/* Right Column: Verified Shop & Owner Front Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Main Storefront & Owner Image Card - Untouched real photo */}
              <div className="rounded-2xl overflow-hidden shadow-2xl border-2 border-sky-500/40 bg-slate-950 flex flex-col">
                {/* 100% Original Photo with No Overlays, Filters or Crops */}
                <div
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  className={`w-full flex flex-col items-center justify-center bg-slate-950 overflow-hidden cursor-pointer transition-all ${
                    isDragging ? 'ring-4 ring-emerald-400 bg-slate-900' : ''
                  }`}
                  title="Click or drop your real WhatsApp photo here"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <img
                    src={photoUrl}
                    alt="Shop owner Raj Singh Tarkar standing outside Rajdeep Enterprises store at UP SIDC Complex Refinery Main Gate Mathura"
                    className="w-full h-auto max-h-[520px] object-contain block"
                    loading="eager"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Photo Action Bar / Upload Status */}
                {!isCustomRealPhoto ? (
                  <div className="p-3 bg-amber-500/15 border-t border-amber-500/30 flex items-center justify-between gap-3 text-xs">
                    <div className="text-left text-amber-200">
                      <span className="font-bold text-amber-300 block">Use Your Real Photo (0% AI):</span>
                      <span>Select <strong className="text-white">WhatsApp Image 2026-09-12 at 17.50.45.jpeg</strong> to load your 100% original photo</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                      className="shrink-0 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center gap-2 shadow-lg transition"
                    >
                      <Camera className="w-4 h-4" />
                      <span>Choose Real Photo File</span>
                    </button>
                  </div>
                ) : (
                  <div className="px-4 py-2.5 bg-emerald-950/80 border-t border-emerald-500/40 flex items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-1.5 text-emerald-300 font-bold text-xs truncate">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className="truncate">100% Real Original Photo Active {photoFileName ? `(${photoFileName})` : ''}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-sky-300 text-xs font-bold border border-slate-700"
                      >
                        Change
                      </button>
                      <button
                        type="button"
                        onClick={resetToDefault}
                        className="px-2 py-1 rounded text-slate-400 hover:text-red-400 text-xs transition"
                        title="Reset to default"
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                )}

                {uploadFeedback && (
                  <div className="p-2 bg-emerald-600 text-white text-xs font-bold text-center animate-in fade-in">
                    {uploadFeedback}
                  </div>
                )}

                {/* Information Card - Cleanly beneath the photo */}
                <div className="p-4 bg-slate-900 border-t border-slate-800 text-left">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div>
                      <div className="text-[10px] font-bold text-sky-400 uppercase tracking-widest flex items-center gap-1">
                        <Store className="w-3.5 h-3.5 text-sky-400" />
                        <span>Shop Owner & Proprietor</span>
                      </div>
                      <div className="text-lg font-black text-white leading-tight mt-0.5">
                        {COMPANY_INFO.contactPerson}
                      </div>
                    </div>
                    <a
                      href={`tel:${COMPANY_INFO.phone}`}
                      className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold shadow-md transition transform active:scale-95"
                      title="Call Owner Directly"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call Direct</span>
                    </a>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-slate-300 font-medium">
                    <span className="text-sky-300 font-bold">Rajdeep Enterprises Store</span>
                    <span className="text-slate-500">•</span>
                    <span className="text-slate-300 truncate">15/1, U.P.S.I.D.C. Complex</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                    Refinery Main Gate, Mathura • Safety Accessories, Welding Gear, Champion Gaskets, Tools & Site Stationery
                  </p>
                </div>
              </div>

              {/* Floating Stat Box 1 - Top Left */}
              <div className="absolute -top-3 -left-3 sm:-left-5 bg-slate-900/95 border border-slate-700/90 p-3 rounded-xl shadow-xl flex items-center gap-2.5 backdrop-blur-md hidden sm:flex z-10">
                <div className="w-9 h-9 rounded-lg bg-blue-600/20 text-sky-400 flex items-center justify-center border border-blue-500/30">
                  <HardHat className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Genuine Physical Store</div>
                  <div className="text-[10px] text-slate-400">100% In-Stock Goods</div>
                </div>
              </div>

              {/* Floating Stat Box 2 - Bottom Right */}
              <div className="absolute -bottom-3 -right-2 sm:-right-4 bg-slate-900/95 border border-slate-700/90 p-3 rounded-xl shadow-xl flex items-center gap-2.5 backdrop-blur-md hidden sm:flex z-10">
                <div className="w-9 h-9 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center border border-sky-500/30">
                  <Building className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Direct Counter Supply</div>
                  <div className="text-[10px] text-slate-400">Refinery Main Gate, Mathura</div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
