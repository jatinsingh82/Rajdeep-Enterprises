import React, { useState, useEffect, useRef } from 'react';
import { Phone, Mail, MapPin, Menu, X, Shield, ArrowRight, FileText, CheckCircle2, ShoppingBag, Download, Languages, Printer, Ruler, ShieldCheck, Building2, ChevronDown, Wrench, Truck, MessageSquare } from 'lucide-react';
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

  // Lock background scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

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
      {/* Top Bar - Responsive layout: Sleek 1-line on mobile, full detail on desktop */}
      <div className="bg-[#0B192C] text-slate-200 text-xs py-1 sm:py-1.5 md:py-2 px-2 sm:px-4 border-b border-[#1E3E62] overflow-x-hidden">
        <div className="max-w-7xl mx-auto flex justify-between items-center gap-1 sm:gap-2">
          
          {/* Mobile Top View (< md): Compact location */}
          <div className="flex md:hidden items-center gap-1 min-w-0">
            <div className="flex items-center gap-1 text-[10px] font-bold text-sky-300 truncate">
              <MapPin className="w-2.5 h-2.5 text-sky-400 shrink-0" />
              <span className="truncate">Refinery Gate, Mathura</span>
            </div>
          </div>

          {/* Desktop Top View (>= md): Full rich details */}
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              <span className="font-medium">Refinery Main Gate, UP SIDC Complex, Mathura</span>
            </div>
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-sky-300 bg-[#1E3E62]/60 px-2.5 py-0.5 rounded-full border border-sky-500/30">
              <Truck className="w-3 h-3 text-sky-400 shrink-0" />
              <span>Pan-India Supply & Sourcing</span>
            </div>
            <div className="hidden lg:flex items-center gap-1.5 text-slate-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span>Proprietor: <strong className="text-white font-semibold">{COMPANY_INFO.contactPerson}</strong></span>
            </div>
          </div>

          {/* Right Action Controls: Language, Phone, Visiting Card, and Tools & Guides */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* Language Switcher */}
            <button
              onClick={onToggleLang}
              className="flex items-center gap-1 px-2 py-1 rounded-md bg-[#1E3E62]/80 hover:bg-[#1E3E62] text-sky-300 font-bold border border-sky-500/30 transition text-[11px] min-h-[30px]"
              title="Switch Language / भाषा बदलें"
            >
              <Languages className="w-3 h-3 text-sky-400" />
              <span>{lang === 'en' ? 'हिन्दी' : 'EN'}</span>
            </button>

            {/* Direct Phone Call */}
            <a
              id="topbar-phone-link"
              href={`tel:${COMPANY_INFO.phone}`}
              className="flex items-center gap-1 text-sky-300 hover:text-white font-semibold transition-colors px-2 py-1 rounded-md hover:bg-[#1E3E62] text-[11px] sm:text-xs min-h-[30px]"
              title="Call Proprietor Directly"
            >
              <Phone className="w-3 h-3 text-sky-400" />
              <span className="hidden sm:inline font-mono">{COMPANY_INFO.displayPhone}</span>
              <span className="sm:hidden text-[11px] font-bold">Call</span>
            </a>

            {/* Visiting Card modal button - cleanly visible on tablet/desktop */}
            <button
              id="topbar-visiting-card-btn"
              onClick={onOpenVisitingCard}
              className="hidden xs:flex items-center gap-1 bg-[#1E3E62] hover:bg-sky-700 text-white px-2 py-1 rounded-md text-[11px] sm:text-xs font-semibold border border-sky-400/40 shadow-2xs transition min-h-[30px]"
              title="View Business Visiting Card"
            >
              <FileText className="w-3 h-3 text-sky-300" />
              <span>Card</span>
            </button>

            {/* Tools & Guides Dropdown - Kept accessible on sm+ screens */}
            <div className="relative hidden sm:block" ref={toolsMenuRef}>
              <button
                id="topbar-tools-guides-btn"
                onClick={() => setToolsDropdownOpen(!toolsDropdownOpen)}
                className="flex items-center gap-1 text-xs text-white bg-blue-600 hover:bg-blue-500 px-2.5 py-1 rounded-md font-semibold border border-sky-400/50 shadow-2xs transition min-h-[30px]"
                title="Procurement Tools, Technical Guides & Compliance"
              >
                <Wrench className="w-3 h-3 text-sky-200" />
                <span>Guides</span>
                <ChevronDown className={`w-3 h-3 text-sky-200 transition-transform ${toolsDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {toolsDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150 max-h-[85vh] overflow-y-auto">
                  
                  {/* Category 1: Collapsible Guides */}
                  <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-sky-400 border-b border-slate-800 flex items-center justify-between">
                    <span>Interactive Guides & Tools</span>
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
        className={`w-full bg-white transition-shadow duration-300 overflow-x-hidden ${
          isScrolled ? 'shadow-md py-2 sm:py-2.5' : 'shadow-xs py-2.5 sm:py-3.5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 flex items-center justify-between gap-2 sm:gap-4">
          {/* Brand Logo */}
          <a id="brand-logo-link" href="#home" className="flex items-center gap-2 sm:gap-3 group min-w-0 shrink">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white border-2 border-orange-500 shadow-xs shrink-0 group-hover:border-orange-400 transition-colors">
              <div className="flex flex-col items-center justify-center">
                <span className="font-black text-[11px] sm:text-xs tracking-tight text-white leading-none">RE</span>
                <span className="text-[7px] font-mono font-bold text-orange-400 leading-none mt-0.5">B2B</span>
              </div>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1 leading-tight">
                <span className="font-extrabold text-sm sm:text-base lg:text-lg tracking-tight text-slate-900 whitespace-nowrap">
                  RAJDEEP
                </span>
                <span className="font-bold text-sm sm:text-base lg:text-lg tracking-tight text-orange-600 whitespace-nowrap">
                  ENTERPRISES
                </span>
              </div>
              <p className="text-[9px] sm:text-[10px] text-slate-500 font-medium tracking-wide uppercase hidden md:block">
                Industrial & Safety Supplies • Mathura Refinery Gate
              </p>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <div className="hidden xl:flex items-center gap-4 2xl:gap-5">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-[13px] font-bold text-slate-700 hover:text-orange-600 transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-orange-600 hover:after:w-full after:transition-all"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Desktop CTAs & RFQ Cart */}
          <div className="hidden sm:flex items-center gap-2.5 shrink-0">
            {/* RFQ Cart Floating Badge Button */}
            <button
              id="header-rfq-cart-btn"
              onClick={onOpenRfqModal}
              className="relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition"
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
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition"
            >
              <Phone className="w-3.5 h-3.5 text-orange-600" />
              <span>{COMPANY_INFO.phone}</span>
            </a>

            <button
              id="header-quote-btn"
              onClick={() => onOpenQuoteModal()}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 active:bg-orange-800 shadow-sm transition active:scale-98"
            >
              <span>{t.requestQuote}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile Actions Button */}
          <div className="flex items-center gap-1.5 xl:hidden shrink-0">
            {/* Mobile RFQ Cart Button */}
            {rfqCount > 0 && (
              <button
                id="mobile-rfq-cart-btn"
                onClick={onOpenRfqModal}
                className="relative p-2 rounded-lg text-slate-700 hover:bg-slate-100 border border-slate-200"
                title="RFQ Cart"
                aria-label="View RFQ Cart"
              >
                <ShoppingBag className="w-5 h-5 text-orange-600" />
                <span className="absolute -top-1 -right-1 px-1.5 py-0.2 rounded-full bg-orange-600 text-white text-[10px] font-mono font-bold">
                  {rfqCount}
                </span>
              </button>
            )}

            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-11 h-11 min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-800 hover:text-orange-600 rounded-xl hover:bg-slate-100 focus:outline-none transition-colors"
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Clean Mobile Drawer Navigation Menu */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 xl:hidden">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
              onClick={() => setMobileMenuOpen(false)}
              aria-hidden="true"
            />

            {/* Slide-out Drawer Panel */}
            <div
              className="fixed inset-y-0 right-0 w-full max-w-xs sm:max-w-sm bg-white shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200 z-10"
              role="dialog"
              aria-modal="true"
              aria-label="Mobile Navigation Menu"
            >
              {/* Drawer Header */}
              <div className="p-4 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white border border-orange-500">
                    <Shield className="w-4 h-4 text-orange-500 fill-orange-500/20" />
                  </div>
                  <div>
                    <span className="font-black text-xs text-slate-900">RAJDEEP ENTERPRISES</span>
                    <span className="block text-[10px] text-slate-500">Mathura Refinery Main Gate</span>
                  </div>
                </div>

                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-10 h-10 flex items-center justify-center text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Links with min 44px touch targets */}
              <div className="p-4 space-y-1 flex-1">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-2">
                  Navigation
                </div>

                {[
                  { name: lang === 'en' ? 'Home' : 'मुख्य पृष्ठ', href: '#home' },
                  { name: lang === 'en' ? 'Products' : 'हमारे उत्पाद', href: '#products' },
                  { name: lang === 'en' ? 'Services / Supply' : 'सप्लाई व कस्टम सोर्सिंग', href: '#pan-india' },
                  { name: lang === 'en' ? 'About Us' : 'हमारे बारे में', href: '#about' },
                  { name: lang === 'en' ? 'Tools & Guides' : 'टूल्स एवं गाइड्स', href: '#tools-and-guides' },
                  { name: lang === 'en' ? 'Contact' : 'संपर्क करें', href: '#contact' },
                ].map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={() => {
                      setMobileMenuOpen(false);
                      const el = document.getElementById(link.href.replace('#', ''));
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="w-full text-left min-h-[44px] px-3.5 py-2.5 rounded-xl text-sm font-bold text-slate-800 hover:bg-orange-50 hover:text-orange-600 active:bg-orange-100 transition flex items-center justify-between"
                  >
                    <span>{link.name}</span>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </a>
                ))}

                {/* Important Actions Inside Mobile Menu as explicitly requested in Section 3 */}
                <div className="pt-4 mt-2 border-t border-slate-200 space-y-2">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-1">
                    Direct Actions
                  </div>

                  {/* Call Now Button */}
                  <a
                    id="mobile-drawer-call-btn"
                    href={`tel:${COMPANY_INFO.phone}`}
                    className="min-h-[44px] w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm text-slate-950 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 shadow-sm transition text-center"
                  >
                    <Phone className="w-4 h-4 text-slate-950" />
                    <span>Call Now ({COMPANY_INFO.phone})</span>
                  </a>

                  {/* WhatsApp Button */}
                  <a
                    id="mobile-drawer-whatsapp-btn"
                    href={`https://wa.me/${COMPANY_INFO.whatsappNumber}?text=Hello%20Rajdeep%20Enterprises,%20I%20need%20a%20quotation%20for%20safety%20materials`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-[44px] w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 shadow-sm transition text-center"
                  >
                    <MessageSquare className="w-4 h-4 text-white" />
                    <span>WhatsApp Us</span>
                  </a>

                  {/* Request Quote Button */}
                  <button
                    id="mobile-drawer-quote-btn"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenQuoteModal();
                    }}
                    className="min-h-[44px] w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm text-white bg-orange-600 hover:bg-orange-700 active:bg-orange-800 shadow-sm transition"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Request Official Quotation</span>
                  </button>
                </div>

                {/* Quick Secondary Utilities */}
                <div className="pt-4 border-t border-slate-200 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenVisitingCard();
                    }}
                    className="min-h-[40px] flex items-center justify-center gap-1.5 p-2 rounded-lg text-xs font-bold bg-slate-100 text-slate-800 border border-slate-200 active:bg-slate-200"
                  >
                    <FileText className="w-3.5 h-3.5 text-blue-600" />
                    <span>Visiting Card</span>
                  </button>

                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onDownloadPdf();
                    }}
                    className="min-h-[40px] flex items-center justify-center gap-1.5 p-2 rounded-lg text-xs font-bold bg-slate-100 text-slate-800 border border-slate-200 active:bg-slate-200"
                  >
                    <Download className="w-3.5 h-3.5 text-orange-600" />
                    <span>PDF Catalog</span>
                  </button>
                </div>
              </div>

              {/* Drawer Footer */}
              <div className="p-4 bg-slate-50 border-t border-slate-200 text-center text-xs text-slate-500">
                <div className="font-semibold text-slate-700">Proprietor: {COMPANY_INFO.contactPerson}</div>
                <div>15/1, U.P. S.I.D.C. Complex, Refinery Main Gate, Mathura</div>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

