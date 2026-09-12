import React, { useState, useEffect, useRef } from 'react';
import { Phone, Mail, MapPin, Menu, X, Shield, ArrowRight, FileText, CheckCircle2, ShoppingBag, Download, Languages, Printer, Ruler, ShieldCheck, Building2, ChevronDown, Wrench } from 'lucide-react';
import { COMPANY_INFO } from '../data/companyData';
import { Language } from '../types';
import { TRANSLATIONS } from '../data/extraData';

interface HeaderProps {
  onOpenQuoteModal: (productName?: string) => void;
  onOpenVisitingCard: () => void;
  lang: Language;
  onToggleLang: () => void;
  rfqCount: number;
  onOpenRfqModal: () => void;
  onDownloadPdf: () => void;
  onOpenBrandingModal: () => void;
  onOpenSizingModal: () => void;
  onOpenHseAuditModal: () => void;
  onOpenVendorDossierModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenQuoteModal,
  onOpenVisitingCard,
  lang,
  onToggleLang,
  rfqCount,
  onOpenRfqModal,
  onDownloadPdf,
  onOpenBrandingModal,
  onOpenSizingModal,
  onOpenHseAuditModal,
  onOpenVendorDossierModal
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false);
  const toolsMenuRef = useRef<HTMLDivElement>(null);
  const t = TRANSLATIONS[lang];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (toolsMenuRef.current && !toolsMenuRef.current.contains(event.target as Node)) {
        setToolsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Strictly sequential top-to-bottom scroll order matching page layout
  const navLinks = [
    { name: lang === 'en' ? 'Our Products' : 'हमारे उत्पाद', href: '#products' },
    { name: lang === 'en' ? 'Whole India' : 'पूरे भारत में', href: '#pan-india' },
    { name: lang === 'en' ? 'Tools & Guides' : 'टूल्स एवं गाइड्स', href: '#tools-and-guides' },
    { name: lang === 'en' ? 'Core Principles' : 'मूल सिद्धांत', href: '#principles' },
    { name: lang === 'en' ? 'About Us' : 'हमारे बारे में', href: '#about' },
    { name: lang === 'en' ? 'Where To Find & Contact' : 'स्थान व संपर्क', href: '#location' },
  ];

  const handleOpenGuideDropdown = (anchorId: string) => {
    setToolsDropdownOpen(false);
    window.location.hash = '#' + anchorId;
    const el = document.getElementById(anchorId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-200">
      {/* Top Bar for B2B Direct Contact in Deep Dark Blue */}
      <div className="bg-[#0B192C] text-slate-200 text-xs py-2 px-4 border-b border-[#1E3E62]">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-3">
          {/* Left: Location & Pan-India info */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              <span className="font-medium">Refinery Main Gate, UP SIDC Complex, Mathura</span>
            </div>
            <div className="inline-flex items-center gap-1 text-[11px] font-bold text-sky-300 bg-[#1E3E62]/60 px-2.5 py-0.5 rounded-full border border-sky-500/30">
              <span>🇮🇳 Whole India Supply & Sourcing</span>
            </div>
            <div className="hidden lg:flex items-center gap-1.5 text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Proprietor: <strong className="text-white font-semibold">{COMPANY_INFO.contactPerson}</strong></span>
            </div>
          </div>

          {/* Right: Language, Phone, Visiting Card, and Tools & Guides (after Visiting Card) */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Switcher */}
            <button
              onClick={onToggleLang}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#1E3E62]/80 hover:bg-[#1E3E62] text-sky-300 font-bold border border-sky-500/30 transition shadow-xs"
              title="Switch Language / भाषा बदलें"
            >
              <Languages className="w-3.5 h-3.5 text-sky-400" />
              <span className="text-[11px]">{lang === 'en' ? 'हिन्दी' : 'English'}</span>
            </button>

            {/* Direct Phone Call */}
            <a
              id="topbar-phone-link"
              href={`tel:${COMPANY_INFO.phone}`}
              className="flex items-center gap-1 text-sky-300 hover:text-white font-semibold transition-colors px-1"
            >
              <Phone className="w-3 h-3 text-sky-400" />
              <span className="hidden sm:inline">{COMPANY_INFO.displayPhone}</span>
            </a>

            {/* Visiting Card modal button */}
            <button
              id="topbar-visiting-card-btn"
              onClick={onOpenVisitingCard}
              className="flex items-center gap-1.5 bg-[#1E3E62] hover:bg-sky-700 text-white px-2.5 py-1 rounded-md text-xs font-semibold border border-sky-400/40 shadow-xs transition"
              title="View Business Visiting Card"
            >
              <FileText className="w-3 h-3 text-sky-300" />
              <span className="font-medium">Visiting Card</span>
            </button>

            {/* Tools & Guides Dropdown - Kept AFTER Visiting Card in the top */}
            <div className="relative" ref={toolsMenuRef}>
              <button
                id="topbar-tools-guides-btn"
                onClick={() => setToolsDropdownOpen(!toolsDropdownOpen)}
                className="flex items-center gap-1 text-xs text-white bg-blue-600 hover:bg-blue-500 px-2.5 py-1 rounded-md font-semibold border border-sky-400/50 shadow-xs transition"
                title="Procurement Tools, Technical Guides & Compliance"
              >
                <Wrench className="w-3 h-3 text-sky-200" />
                <span className="font-medium">Tools & Guides</span>
                <ChevronDown className={`w-3 h-3 text-sky-200 transition-transform ${toolsDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {toolsDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150 max-h-[85vh] overflow-y-auto">
                  
                  {/* Category 1: Collapsible Dropdown Guides */}
                  <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-sky-400 border-b border-slate-800 flex items-center justify-between">
                    <span>Interactive Guides (Drop Down)</span>
                    <span className="text-slate-500 font-normal">On-Page</span>
                  </div>

                  <button
                    onClick={() => handleOpenGuideDropdown('trade-kits')}
                    className="w-full text-left px-3 py-2 text-xs text-slate-200 hover:bg-slate-800 flex items-center gap-2.5 transition group"
                  >
                    <div className="w-2 h-2 rounded-full bg-orange-500 group-hover:scale-125 transition-transform shrink-0"></div>
                    <div>
                      <div className="font-semibold text-white group-hover:text-sky-300">Trade-Specific PPE Kits</div>
                      <div className="text-[10px] text-slate-400">Refinery & contractor turnkeys</div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleOpenGuideDropdown('gst-compliance')}
                    className="w-full text-left px-3 py-2 text-xs text-slate-200 hover:bg-slate-800 flex items-center gap-2.5 transition group"
                  >
                    <div className="w-2 h-2 rounded-full bg-blue-500 group-hover:scale-125 transition-transform shrink-0"></div>
                    <div>
                      <div className="font-semibold text-white group-hover:text-sky-300">GST Rates & HSN Tax Calculator</div>
                      <div className="text-[10px] text-slate-400">12 HSN categories (max ₹10 Lakhs)</div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleOpenGuideDropdown('standards')}
                    className="w-full text-left px-3 py-2 text-xs text-slate-200 hover:bg-slate-800 flex items-center gap-2.5 transition group"
                  >
                    <div className="w-2 h-2 rounded-full bg-emerald-500 group-hover:scale-125 transition-transform shrink-0"></div>
                    <div>
                      <div className="font-semibold text-white group-hover:text-sky-300">Industrial Standards & Safety Certifications</div>
                      <div className="text-[10px] text-slate-400">BIS, IS:2925, IS:15298 & CE passes</div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleOpenGuideDropdown('industries')}
                    className="w-full text-left px-3 py-2 text-xs text-slate-200 hover:bg-slate-800 flex items-center gap-2.5 transition group"
                  >
                    <div className="w-2 h-2 rounded-full bg-indigo-500 group-hover:scale-125 transition-transform shrink-0"></div>
                    <div>
                      <div className="font-semibold text-white group-hover:text-sky-300">Industries We Serve</div>
                      <div className="text-[10px] text-slate-400">Refinery, civil, pipeline & workshops</div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleOpenGuideDropdown('faqs')}
                    className="w-full text-left px-3 py-2 text-xs text-slate-200 hover:bg-slate-800 flex items-center gap-2.5 transition group"
                  >
                    <div className="w-2 h-2 rounded-full bg-purple-500 group-hover:scale-125 transition-transform shrink-0"></div>
                    <div>
                      <div className="font-semibold text-white group-hover:text-sky-300">Frequently Asked Questions</div>
                      <div className="text-[10px] text-slate-400">Gate passes, delivery, payment terms</div>
                    </div>
                  </button>

                  {/* Category 2: Procurement Utility Modals */}
                  <div className="mt-2 pt-2 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-t border-slate-800">
                    Procurement Tools & Dossiers
                  </div>

                  <button
                    onClick={() => { onOpenBrandingModal(); setToolsDropdownOpen(false); }}
                    className="w-full text-left px-3 py-2 text-xs text-slate-200 hover:bg-slate-800 flex items-center gap-2.5 transition"
                  >
                    <Printer className="w-4 h-4 text-sky-400 shrink-0" />
                    <div>
                      <div className="font-semibold text-white">Logo Printing Studio</div>
                      <div className="text-[10px] text-slate-400">Custom branded helmets & vests</div>
                    </div>
                  </button>

                  <button
                    onClick={() => { onOpenSizingModal(); setToolsDropdownOpen(false); }}
                    className="w-full text-left px-3 py-2 text-xs text-slate-200 hover:bg-slate-800 flex items-center gap-2.5 transition"
                  >
                    <Ruler className="w-4 h-4 text-sky-400 shrink-0" />
                    <div>
                      <div className="font-semibold text-white">Size Guide</div>
                      <div className="text-[10px] text-slate-400">Shoe & glove sizing chart</div>
                    </div>
                  </button>

                  <button
                    onClick={() => { onOpenHseAuditModal(); setToolsDropdownOpen(false); }}
                    className="w-full text-left px-3 py-2 text-xs text-slate-200 hover:bg-slate-800 flex items-center gap-2.5 transition"
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div>
                      <div className="font-semibold text-emerald-300">HSE Gate Audit</div>
                      <div className="text-[10px] text-slate-400">Site entry pass inspection</div>
                    </div>
                  </button>

                  <button
                    onClick={() => { onOpenVendorDossierModal(); setToolsDropdownOpen(false); }}
                    className="w-full text-left px-3 py-2 text-xs text-slate-200 hover:bg-slate-800 flex items-center gap-2.5 transition"
                  >
                    <Building2 className="w-4 h-4 text-sky-400 shrink-0" />
                    <div>
                      <div className="font-semibold text-white">Vendor Dossier</div>
                      <div className="text-[10px] text-slate-400">B2B vendor empanelment profile</div>
                    </div>
                  </button>

                  <div className="my-1 border-t border-slate-800"></div>

                  <button
                    onClick={() => { onDownloadPdf(); setToolsDropdownOpen(false); }}
                    className="w-full text-left px-3 py-2 text-xs text-sky-300 hover:bg-slate-800 flex items-center gap-2.5 transition"
                  >
                    <Download className="w-4 h-4 text-sky-400 shrink-0" />
                    <span className="font-semibold">Download PDF Catalogue</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav
        className={`w-full bg-white transition-shadow duration-300 ${
          isScrolled ? 'shadow-md py-2.5' : 'shadow-sm py-3'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo */}
          <a id="brand-logo-link" href="#home" className="flex items-center gap-3 group">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-slate-900 flex items-center justify-center text-white border-2 border-orange-500 shadow-sm shrink-0 group-hover:scale-105 transition-transform">
              <Shield className="w-5 h-5 text-orange-500 fill-orange-500/20" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900">
                  RAJDEEP
                </span>
                <span className="font-bold text-base sm:text-lg tracking-tight text-orange-600">
                  ENTERPRISES
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium tracking-wide uppercase hidden sm:block">
                Safety Accessories & Material Supplies • Mathura
              </p>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <div className="hidden xl:flex items-center gap-4 2xl:gap-5">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-[13px] font-bold text-slate-700 hover:text-blue-700 transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-blue-600 hover:after:w-full after:transition-all"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Desktop CTAs & RFQ Cart */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* RFQ Cart Floating Badge Button */}
            <button
              id="header-rfq-cart-btn"
              onClick={onOpenRfqModal}
              className="relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition"
              title="View Bulk Quotation Cart"
            >
              <ShoppingBag className="w-4 h-4 text-orange-600" />
              <span>{t.rfqCart}</span>
              {rfqCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-orange-600 text-white text-[10px] font-mono font-bold">
                  {rfqCount}
                </span>
              )}
            </button>

            <a
              id="header-call-btn"
              href={`tel:${COMPANY_INFO.phone}`}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition"
            >
              <Phone className="w-3.5 h-3.5 text-orange-600" />
              <span>{COMPANY_INFO.phone}</span>
            </a>

            <button
              id="header-quote-btn"
              onClick={() => onOpenQuoteModal()}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 shadow-sm hover:shadow transition active:scale-95"
            >
              <span>{t.requestQuote}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile Actions Button */}
          <div className="flex items-center gap-2 xl:hidden">
            {/* Mobile RFQ Cart Button */}
            <button
              id="mobile-rfq-cart-btn"
              onClick={onOpenRfqModal}
              className="relative p-2 rounded-lg text-slate-700 hover:bg-slate-100 border border-slate-200"
              title="RFQ Cart"
            >
              <ShoppingBag className="w-5 h-5 text-orange-600" />
              {rfqCount > 0 && (
                <span className="absolute -top-1 -right-1 px-1.5 py-0.2 rounded-full bg-orange-600 text-white text-[10px] font-mono font-bold">
                  {rfqCount}
                </span>
              )}
            </button>

            <button
              id="mobile-quote-header-btn"
              onClick={() => onOpenQuoteModal()}
              className="sm:hidden px-2.5 py-1.5 text-xs font-bold text-white bg-orange-600 rounded-md"
            >
              Quote
            </button>
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:text-slate-900 rounded-lg hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="xl:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 shadow-xl animate-in slide-in-from-top-2">
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-xs font-bold text-slate-700 hover:bg-orange-50 hover:text-orange-600 rounded-md transition"
                >
                  {link.name}
                </a>
              ))}
              
              <div className="pt-3 border-t border-slate-200 flex flex-col gap-2">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenHseAuditModal();
                    }}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-900 border border-emerald-300"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>HSE Gate Audit</span>
                  </button>

                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenVendorDossierModal();
                    }}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-bold bg-amber-50 text-amber-900 border border-amber-300"
                  >
                    <Building2 className="w-3.5 h-3.5 text-amber-600" />
                    <span>Vendor Dossier</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenBrandingModal();
                    }}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-bold bg-slate-100 text-slate-800 border border-slate-300"
                  >
                    <Printer className="w-3.5 h-3.5 text-orange-600" />
                    <span>Logo Branding</span>
                  </button>

                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenSizingModal();
                    }}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-bold bg-slate-100 text-slate-800 border border-slate-300"
                  >
                    <Ruler className="w-3.5 h-3.5 text-orange-600" />
                    <span>Size Guide</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      onToggleLang();
                    }}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-bold bg-slate-100 text-slate-800 border border-slate-300"
                  >
                    <Languages className="w-3.5 h-3.5 text-orange-600" />
                    <span>{lang === 'en' ? 'हिन्दी में देखें' : 'View in English'}</span>
                  </button>

                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onDownloadPdf();
                    }}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-bold bg-slate-100 text-slate-800 border border-slate-300"
                  >
                    <Download className="w-3.5 h-3.5 text-orange-600" />
                    <span>Download PDF</span>
                  </button>
                </div>

                <button
                  id="mobile-rfq-cart-full-btn"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenRfqModal();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-md text-xs font-bold text-slate-800 bg-orange-50 border border-orange-200"
                >
                  <ShoppingBag className="w-4 h-4 text-orange-600" />
                  <span>Open Bulk Quotation Cart ({rfqCount} items)</span>
                </button>

                <button
                  id="mobile-visiting-card-btn"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenVisitingCard();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-md text-xs font-bold text-slate-800 bg-slate-100 border border-slate-300"
                >
                  <FileText className="w-4 h-4 text-orange-600" />
                  <span>View Official Business Card</span>
                </button>

                <a
                  id="mobile-call-btn"
                  href={`tel:${COMPANY_INFO.phone}`}
                  className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-md text-xs font-bold text-slate-900 bg-amber-400 hover:bg-amber-300"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call {COMPANY_INFO.phone}</span>
                </a>

                <button
                  id="mobile-quote-full-btn"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenQuoteModal();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-md text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 shadow"
                >
                  <span>{t.requestQuote}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

