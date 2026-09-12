import React, { useRef, useState } from 'react';
import { ArrowRight, Phone, ShieldCheck, MapPin, CheckCircle, Building, HardHat, FileText, UserCheck, Store, Upload, Camera, RefreshCw } from 'lucide-react';
import { COMPANY_INFO } from '../data/companyData';
import { useOwnerPhoto } from '../hooks/useOwnerPhoto';

interface HeroProps {
  onOpenQuoteModal: (productName?: string) => void;
  onOpenVisitingCard: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenQuoteModal, onOpenVisitingCard }) => {
  const { photoUrl, isCustomRealPhoto, uploadPhoto, resetToDefault } = useOwnerPhoto();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processFile(file);
  };

  const processFile = async (file: File) => {
    setIsUploading(true);
    setUploadMsg(null);
    try {
      await uploadPhoto(file);
      setUploadMsg('Original real photo loaded successfully!');
      setTimeout(() => setUploadMsg(null), 4000);
    } catch {
      setUploadMsg('Could not load photo. Please try an image file.');
      setTimeout(() => setUploadMsg(null), 4000);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  return (
    <section id="home" className="relative overflow-hidden bg-[#071324] text-white pt-10 pb-16 md:py-20 lg:py-24">
      {/* Background industrial overlay & grid */}
      <div className="absolute inset-0 industrial-grid-dark opacity-30 pointer-events-none"></div>
      
      {/* Subtle safety accent gradient glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Top safety stripe bar */}
      <div className="absolute top-0 left-0 right-0 h-1.5 hazard-stripe-light opacity-90"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile Quick Owner Banner - shown right at top of hero on mobile */}
        <div className="lg:hidden flex items-center gap-3 p-3.5 rounded-xl bg-slate-900/95 border border-sky-500/40 mb-6 shadow-lg backdrop-blur-sm">
          <img
            src={photoUrl}
            alt="Shop owner Raj Singh Tarkar"
            className="w-14 h-14 rounded-lg object-cover object-top border-2 border-sky-400 shrink-0"
            referrerPolicy="no-referrer"
          />
          <div className="min-w-0 flex-1">
            <div className="text-[10px] uppercase font-extrabold text-sky-400 tracking-wider flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>Shop Owner & Proprietor</span>
            </div>
            <div className="text-base font-black text-white truncate">
              {COMPANY_INFO.contactPerson}
            </div>
            <div className="text-xs text-slate-300 truncate">
              Rajdeep Enterprises • Refinery Main Gate, Mathura
            </div>
          </div>
          <a
            href={`tel:${COMPANY_INFO.phone}`}
            className="shrink-0 p-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white shadow transition"
            aria-label="Call Shop Owner Directly"
            title="Call Shop Owner Directly"
          >
            <Phone className="w-4 h-4" />
          </a>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
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
              
              {/* Hidden Real Photo File Input */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
                id="owner-photo-upload-input"
              />

              {/* Main Storefront & Owner Image Card */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`relative rounded-2xl overflow-hidden shadow-2xl border-2 transition-all duration-300 bg-slate-800 group ${
                  isDragging
                    ? 'border-emerald-400 ring-4 ring-emerald-400/30 scale-[1.02]'
                    : 'border-sky-500/50 hover:border-sky-400'
                }`}
              >
                <img
                  src={photoUrl}
                  alt="Shop owner Raj Singh Tarkar standing outside Rajdeep Enterprises store at UP SIDC Complex Refinery Main Gate Mathura"
                  className="w-full h-96 sm:h-[430px] lg:h-[470px] object-cover object-top group-hover:scale-102 transition-transform duration-500"
                  loading="eager"
                  referrerPolicy="no-referrer"
                />
                {/* Gradient vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent pointer-events-none"></div>

                {/* Top Badges */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-10">
                  <span className="px-3 py-1.5 rounded-lg bg-slate-950/90 backdrop-blur-md border border-sky-400/60 text-xs font-extrabold text-sky-300 shadow-lg flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    Verified Store & Proprietor
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-blue-600 text-[11px] font-black text-white uppercase tracking-wider shadow">
                    Mathura Hub
                  </span>
                </div>

                {/* Upload Notification Message */}
                {uploadMsg && (
                  <div className="absolute top-14 left-3 right-3 p-2 rounded-lg bg-emerald-600 text-white text-xs font-bold text-center shadow-xl z-20 animate-in fade-in">
                    {uploadMsg}
                  </div>
                )}

                {/* Quick Real Photo Action Bar (Always Available on Card) */}
                <div className="absolute top-14 right-3 z-10 flex flex-col gap-1.5 items-end">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950/85 hover:bg-slate-900 text-white border border-sky-400/70 hover:border-sky-400 text-xs font-bold shadow-lg backdrop-blur-md transition transform active:scale-95"
                    title="Upload original real camera photo (WhatsApp image) with 0% changes"
                  >
                    <Camera className="w-3.5 h-3.5 text-sky-400" />
                    <span>{isCustomRealPhoto ? 'Change Original Photo' : 'Upload Real Photo'}</span>
                  </button>

                  {isCustomRealPhoto && (
                    <button
                      onClick={resetToDefault}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded bg-slate-900/80 hover:bg-slate-900 text-slate-300 hover:text-red-400 text-[10px] font-medium border border-slate-700 shadow backdrop-blur-sm transition"
                      title="Reset to default photo"
                    >
                      <RefreshCw className="w-2.5 h-2.5" />
                      <span>Reset</span>
                    </button>
                  )}
                </div>

                {/* Bottom Information Card */}
                <div className="absolute bottom-3 left-3 right-3 p-3.5 sm:p-4 rounded-xl bg-slate-950/95 backdrop-blur-md border border-slate-700/80 text-left shadow-2xl z-10">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div>
                      <div className="text-[10px] font-bold text-sky-400 uppercase tracking-widest flex items-center gap-1">
                        <Store className="w-3 h-3 text-sky-400" />
                        <span>Shop Owner & Proprietor</span>
                        {isCustomRealPhoto && (
                          <span className="ml-1 text-emerald-400 font-bold text-[9px] bg-emerald-950/80 px-1.5 py-0.2 rounded border border-emerald-500/40">
                            100% Real Photo Active
                          </span>
                        )}
                      </div>
                      <div className="text-base sm:text-lg font-black text-white leading-tight">
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
                    <span className="text-sky-300 font-bold">Rajdeep Enterprises Storefront</span>
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
