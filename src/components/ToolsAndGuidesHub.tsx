import React, { useState, useEffect } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  Wrench, 
  Calculator, 
  ShieldCheck, 
  Building2, 
  HelpCircle, 
  Layers, 
  Eye, 
  EyeOff, 
  Sparkles,
  ArrowRight,
  CheckCircle2,
  FileCheck,
  Send
} from 'lucide-react';
import { Product, Language } from '../types';
import { COMPANY_INFO } from '../data/companyData';
import { TradeKitsSection } from './TradeKitsSection';
import { GstGuideSection } from './GstGuideSection';
import { StandardsSection } from './StandardsSection';
import { FaqSection } from './FaqSection';
import industrialSafetyVisual from '../assets/images/industrial_safety_ppe_1789311870723.jpg';

interface ToolsAndGuidesHubProps {
  onAddProductToRfq: (product: Product, quantity?: number) => void;
  onOpenQuoteModal: (productName?: string) => void;
  lang: Language;
}

type GuideSectionId = 'trade-kits' | 'gst-compliance' | 'standards' | 'faqs';

export const ToolsAndGuidesHub: React.FC<ToolsAndGuidesHubProps> = ({
  onAddProductToRfq,
  onOpenQuoteModal,
  lang
}) => {
  // Store open/closed state for each of the 4 dropdown tools
  const [openSections, setOpenSections] = useState<Record<GuideSectionId, boolean>>({
    'trade-kits': false,
    'gst-compliance': false,
    'standards': false,
    'faqs': false
  });

  // Listen for hash changes or custom events from topbar links
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (['trade-kits', 'gst-compliance', 'standards', 'faqs'].includes(hash)) {
        setOpenSections(prev => ({
          ...prev,
          [hash as GuideSectionId]: true
        }));
        const el = document.getElementById(hash);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };

    window.addEventListener('hashchange', handleHash);
    // Check initial hash
    if (window.location.hash) {
      handleHash();
    }
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const toggleSection = (id: GuideSectionId) => {
    setOpenSections(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const expandAll = () => {
    setOpenSections({
      'trade-kits': true,
      'gst-compliance': true,
      'standards': true,
      'industries': true,
      'faqs': true
    });
  };

  const collapseAll = () => {
    setOpenSections({
      'trade-kits': false,
      'gst-compliance': false,
      'standards': false,
      'industries': false,
      'faqs': false
    });
  };

  const totalOpen = Object.values(openSections).filter(Boolean).length;

  const sectionsConfig: Array<{
    id: GuideSectionId;
    anchorId: string;
    titleEn: string;
    titleHi: string;
    subtitleEn: string;
    subtitleHi: string;
    badgeEn: string;
    badgeHi: string;
    icon: React.ComponentType<{ className?: string }>;
    accentColor: string;
    bgAccent: string;
    borderAccent: string;
    summaryTagsEn: string[];
    summaryTagsHi: string[];
  }> = [
    {
      id: 'trade-kits',
      anchorId: 'trade-kits',
      titleEn: 'Trade-Specific PPE Kits Configurator',
      titleHi: 'ट्रेड-विशिष्ट पीपीई किट्स कॉन्फिगरेटर',
      subtitleEn: 'Turnkey pre-configured safety gear, welding consumables, and mechanical maintenance kits for contractor crews.',
      subtitleHi: 'ठेकेदारों और मैकेनिकल टीमों के लिए रेडी-टू-डिस्पैच सुरक्षा किट और वेल्डिंग उपकरण।',
      badgeEn: 'Contractor Bundles',
      badgeHi: 'ठेकेदार बंडल',
      icon: Wrench,
      accentColor: 'text-orange-600',
      bgAccent: 'bg-orange-50',
      borderAccent: 'border-orange-200',
      summaryTagsEn: ['6 Refinery & Site Kits', 'Batch Bulk RFQ', 'Zero Margin Error'],
      summaryTagsHi: ['6 रिफाइनरी किट', 'बल्क कोटेशन', 'तुरंत डिस्पैच']
    },
    {
      id: 'gst-compliance',
      anchorId: 'gst-compliance',
      titleEn: 'GST Rates, HSN Codes & B2B Tax Calculator',
      titleHi: 'जीएसटी दरें, HSN कोड्स और B2B टैक्स कैलकुलेटर',
      subtitleEn: 'Comprehensive HSN code tax classification table and instant order value calculator (up to ₹10 Lakhs).',
      subtitleHi: 'सभी सुरक्षा उत्पादों के लिए आधिकारिक HSN कोड और 10 लाख तक का त्वरित टैक्स कैलकुलेटर।',
      badgeEn: 'Tax & Compliance',
      badgeHi: 'टैक्स एवं कंप्लायंस',
      icon: Calculator,
      accentColor: 'text-blue-600',
      bgAccent: 'bg-blue-50',
      borderAccent: 'border-blue-200',
      summaryTagsEn: ['12 HSN Code Entries', 'CGST / SGST / IGST Splits', 'Max ₹10L Limit'],
      summaryTagsHi: ['12 HSN वर्गीकरण', 'टैक्स ब्रेकअप', 'अधिकतम ₹10 लाख']
    },
    {
      id: 'standards',
      anchorId: 'standards',
      titleEn: 'Industrial Standards & Safety Certifications',
      titleHi: 'औद्योगिक मानक एवं सुरक्षा प्रमाणन गाइड',
      subtitleEn: 'BIS, IS:2925, IS:15298, EN, CE, and OSHA regulatory standards required to clear refinery gate passes.',
      subtitleHi: 'मथुरा रिफाइनरी गेट पास और औद्योगिक ऑडिट के लिए मान्य BIS/IS/CE प्रमाणन गाइड।',
      badgeEn: 'Audit Standards',
      badgeHi: 'ऑडिट मानक',
      icon: ShieldCheck,
      accentColor: 'text-emerald-600',
      bgAccent: 'bg-emerald-50',
      borderAccent: 'border-emerald-200',
      summaryTagsEn: ['IS:2925 Helmets', 'IS:15298 Shoes', 'IS:3521 Harnesses', 'Gate Pass Clearance'],
      summaryTagsHi: ['IS:2925 हेलमेट', 'IS:15298 जूते', 'गेट पास ऑडिट पास']
    },
    {
      id: 'faqs',
      anchorId: 'faqs',
      titleEn: 'Frequently Asked Questions',
      titleHi: 'अक्सर पूछे जाने वाले सवाल (FAQs)',
      subtitleEn: 'Clear answers regarding gate pass inspections, whole India logistics, test certificates, and bulk payment terms.',
      subtitleHi: 'रिफाइनरी गेट ऑडिट, अखिल भारतीय डिलीवरी, टेस्ट सर्टिफिकेट और भुगतान शर्तों से जुड़े सवाल।',
      badgeEn: 'Help & Knowledge',
      badgeHi: 'सहायता व जानकारी',
      icon: HelpCircle,
      accentColor: 'text-purple-600',
      bgAccent: 'bg-purple-50',
      borderAccent: 'border-purple-200',
      summaryTagsEn: ['Refinery Pass Rules', 'Delivery Timelines', 'Billing & GST Invoicing'],
      summaryTagsHi: ['गेट पास नियम', 'डिलीवरी समय', 'जीएसटी बिलिंग']
    }
  ];

  return (
    <section 
      id="tools-and-guides" 
      className="py-12 sm:py-16 md:py-20 bg-slate-100/95 relative border-t border-b border-slate-200 overflow-x-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* HERO / SECTION VISUAL: Two-Column on Desktop, Stacked & Contained on Mobile */}
        <div className="bg-slate-900 text-white rounded-2xl sm:rounded-3xl border border-slate-800 shadow-xl overflow-hidden mb-8 sm:mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center p-5 sm:p-7 lg:p-9">
            
            {/* Left Column: Heading, Subtitle, Highlights & Quick Controls (lg:col-span-7) */}
            <div className="lg:col-span-7 space-y-4 sm:space-y-5">
              
              {/* Category Eyebrow Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-sky-300 text-xs font-bold uppercase tracking-wider">
                <Layers className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <span>Industrial Compliance & Technical Hub</span>
              </div>

              {/* Main Responsive Heading with clamp() */}
              <h2 
                className="font-black text-white tracking-tight leading-tight"
                style={{ fontSize: 'clamp(1.5rem, 2.5vw + 0.6rem, 2.4rem)' }}
              >
                {lang === 'en' 
                  ? 'Tools, Compliance & Industrial Guides' 
                  : 'टूल्स, कंप्लायंस एवं तकनीकी गाइड्स'}
              </h2>

              {/* Description */}
              <p className="text-xs sm:text-sm md:text-base text-slate-300 leading-relaxed max-w-2xl">
                {lang === 'en' 
                  ? 'Engineered for plant HSE safety officers, EPC project engineers, and maintenance contractors. Access turnkey trade PPE bundles, CBIC-approved GST & HSN calculators, and BIS gate-clearance compliance specifications to ensure zero inspection holdups across refinery complexes and project sites.' 
                  : 'प्लांट सेफ्टी इंजीनियरों, ईपीसी खरीद प्रमुखों और मेंटेनेंस ठेकेदारों के लिए विशेष रूप से डिज़ाइन किया गया। ट्रेड पीपीई किट्स, आधिकारिक जीएसटी व एचएसएन कैलकुलेटर और बीआईएस रिफाइनरी गेट-पास मानकों को सीधे नीचे देखें।'}
              </p>

              {/* 3 Value Highlight Micro-Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-2.5 pt-1 text-xs">
                <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700/80 text-slate-200">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="font-semibold">Refinery Gate Pass Ready</span>
                </div>
                <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700/80 text-slate-200">
                  <Calculator className="w-4 h-4 text-sky-400 shrink-0" />
                  <span className="font-semibold">18% & 12% GST ITC Invoiced</span>
                </div>
                <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700/80 text-slate-200">
                  <Wrench className="w-4 h-4 text-orange-400 shrink-0" />
                  <span className="font-semibold">Pre-Configured Turnkey Kits</span>
                </div>
              </div>

              {/* Expand / Collapse Controls Strip */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800">
                <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span>{totalOpen} of 5 Guides Currently Expanded</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={expandAll}
                    className="min-h-[40px] inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 border border-blue-500 shadow-sm transition active:scale-95"
                    title="Expand all 5 technical guides"
                  >
                    <Eye className="w-3.5 h-3.5 text-sky-200 shrink-0" />
                    <span>Expand All</span>
                  </button>
                  <button
                    onClick={collapseAll}
                    className="min-h-[40px] inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition active:scale-95"
                    title="Collapse all guides into compact overview"
                  >
                    <EyeOff className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Collapse All</span>
                  </button>
                </div>
              </div>

            </div>

            {/* Right Column: Realistic Industrial Visual Area (lg:col-span-5) */}
            <div className="lg:col-span-5 w-full">
              <div className="relative rounded-2xl overflow-hidden border border-slate-700/90 shadow-2xl bg-slate-950 group">
                
                {/* Responsive Image Frame: 16:10 on mobile, 4:3 on desktop */}
                <div className="relative w-full aspect-[16/10] sm:aspect-[4/3] overflow-hidden bg-slate-900">
                  <img
                    src={industrialSafetyVisual}
                    alt="Rajdeep Enterprises industrial safety PPE, IS-certified helmets, welding gear, and workplace compliance inspection equipment"
                    className="w-full max-w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    width={800}
                    height={600}
                  />
                  {/* Subtle vignette/contrast overlay for text legibility */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent pointer-events-none"></div>

                  {/* Floating Verification Badge */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900/90 backdrop-blur-sm border border-slate-700 text-amber-300 text-[11px] font-bold shadow-md">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>BIS & OSHA Compliance Certified</span>
                  </div>

                  {/* Mathura Refinery Depot Badge */}
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-orange-600/90 text-white text-[10px] font-bold uppercase tracking-wider shadow-sm">
                    Mathura Depot Stock
                  </div>

                  {/* Bottom Overlay Details */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] text-slate-300">
                    <span className="font-semibold text-white leading-tight">Refinery & Site Safety Standards</span>
                    <span className="text-sky-300 font-mono shrink-0 ml-2">Mathura IOCL Gate</span>
                  </div>
                </div>

                {/* Caption / Consultation Strip below image */}
                <div className="p-3 bg-slate-900/95 border-t border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-slate-300 min-w-0">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 shrink-0"></div>
                    <span className="text-[11px] text-slate-300 leading-tight">Inspection-Passed PPE & Consumables</span>
                  </div>
                  <button
                    onClick={() => onOpenQuoteModal('Industrial Safety Compliance Consultation')}
                    className="text-[11px] text-sky-400 hover:text-sky-300 font-bold transition flex items-center gap-1 shrink-0 ml-2"
                  >
                    <span className="whitespace-nowrap">Consult Specs</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

              </div>
            </div>

          </div>
        </div>

        {/* 5 Collapsible Accordion Guide Cards */}
        <div className="space-y-4">
          {sectionsConfig.map((sec, idx) => {
            const isOpen = openSections[sec.id];
            const Icon = sec.icon;

            return (
              <div 
                key={sec.id}
                id={sec.anchorId}
                className={`w-full max-w-full rounded-2xl transition-all duration-300 overflow-hidden border shadow-xs ${
                  isOpen 
                    ? 'bg-white border-blue-500/60 ring-2 ring-blue-500/10 shadow-md' 
                    : 'bg-white hover:bg-slate-50/80 border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Accordion Header Trigger Banner */}
                <div 
                  onClick={() => toggleSection(sec.id)}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer select-none transition-colors"
                  role="button"
                  aria-expanded={isOpen}
                  aria-controls={`guide-panel-${sec.id}`}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      toggleSection(sec.id);
                    }
                  }}
                >
                  {/* Left: Icon, Badge, Title, Subtitle, & Tag Chips */}
                  <div className="flex items-start gap-3.5 min-w-0 flex-1">
                    <div className={`p-2.5 rounded-xl ${sec.bgAccent} ${sec.accentColor} border ${sec.borderAccent} shrink-0 mt-0.5 sm:mt-0 shadow-xs`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      
                      {/* Top Category & Part Badges */}
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                          Guide {idx + 1}
                        </span>
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md ${sec.bgAccent} ${sec.accentColor}`}>
                          {lang === 'en' ? sec.badgeEn : sec.badgeHi}
                        </span>
                      </div>

                      {/* Clear Responsive Title - Natural Wrapping */}
                      <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-snug break-words">
                        {lang === 'en' ? sec.titleEn : sec.titleHi}
                      </h3>

                      {/* Short Description */}
                      <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed max-w-3xl">
                        {lang === 'en' ? sec.subtitleEn : sec.subtitleHi}
                      </p>

                      {/* Summary Tags (Always visible for quick scanning) */}
                      <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
                        {(lang === 'en' ? sec.summaryTagsEn : sec.summaryTagsHi).map((tag, tIdx) => (
                          <span 
                            key={tIdx} 
                            className="text-[11px] font-semibold text-slate-700 bg-slate-100/90 px-2.5 py-0.5 rounded-md border border-slate-200/80"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                    </div>
                  </div>

                  {/* Right / Mobile Action Button */}
                  <div className="flex items-center gap-3 shrink-0 self-stretch sm:self-center pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 w-full sm:w-auto justify-end">
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={`guide-panel-${sec.id}`}
                      className={`w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-xs active:scale-98 ${
                        isOpen 
                          ? 'bg-blue-600 text-white hover:bg-blue-700' 
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300'
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSection(sec.id);
                      }}
                    >
                      <span className="whitespace-nowrap">{isOpen ? 'Close Guide' : 'Open Guide'}</span>
                      <ChevronDown className={`w-4 h-4 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180 text-white' : 'text-slate-600'}`} />
                    </button>
                  </div>
                </div>

                {/* Expanded Component Body */}
                {isOpen && (
                  <div id={`guide-panel-${sec.id}`} className="border-t border-slate-200 bg-slate-50/50 animate-in fade-in duration-200 overflow-x-hidden">
                    <div className="py-2">
                      {sec.id === 'trade-kits' && (
                        <TradeKitsSection
                          onAddProductToRfq={onAddProductToRfq}
                          onOpenQuoteModal={onOpenQuoteModal}
                          lang={lang}
                        />
                      )}

                      {sec.id === 'gst-compliance' && (
                        <GstGuideSection
                          onOpenQuoteModal={onOpenQuoteModal}
                        />
                      )}

                      {sec.id === 'standards' && (
                        <StandardsSection
                          lang={lang}
                          onEnquire={(req) => onOpenQuoteModal(req)}
                        />
                      )}

                      {sec.id === 'faqs' && (
                        <FaqSection
                          onOpenQuoteModal={onOpenQuoteModal}
                          lang={lang}
                        />
                      )}
                    </div>

                    {/* Bottom Action & Business Conversion Bar inside open panel */}
                    <div className="px-4 sm:px-6 py-3.5 bg-slate-100 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                      <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                        <button
                          type="button"
                          onClick={() => onOpenQuoteModal(`Inquiry from Guide: ${sec.titleEn}`)}
                          className="min-h-[40px] w-full sm:w-auto inline-flex items-center justify-center gap-1.5 text-white bg-blue-600 hover:bg-blue-500 font-bold px-4 py-2 rounded-xl shadow-xs transition active:scale-95"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>
                            {sec.id === 'trade-kits' && 'Request Quote for Recommended Kit'}
                            {sec.id === 'gst-compliance' && 'Request Official GST Quotation'}
                            {sec.id === 'standards' && 'Enquire for IOCL Gate Clearance Materials'}
                            {sec.id === 'faqs' && 'Request Custom Quote'}
                          </span>
                        </button>

                        <a
                          href={`https://wa.me/${COMPANY_INFO.whatsappNumber}?text=${encodeURIComponent(`Hello Rajdeep Enterprises, I was reviewing your ${sec.titleEn} guide and would like to consult specs.`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="min-h-[40px] w-full sm:w-auto inline-flex items-center justify-center gap-1.5 text-white bg-emerald-600 hover:bg-emerald-500 font-bold px-3.5 py-2 rounded-xl shadow-xs transition active:scale-95"
                        >
                          <span className="text-sm">💬</span>
                          <span>Consult Specs on WhatsApp</span>
                        </a>
                      </div>

                      <button
                        type="button"
                        onClick={() => toggleSection(sec.id)}
                        className="w-full sm:w-auto min-h-[40px] inline-flex items-center justify-center gap-1.5 text-slate-700 hover:text-slate-900 font-bold px-3.5 py-2 rounded-xl bg-white border border-slate-300 hover:border-slate-400 transition shadow-2xs"
                      >
                        <ChevronUp className="w-3.5 h-3.5 text-slate-500" />
                        <span>Collapse Guide</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Informational reassurance banner */}
        <div className="mt-8 p-4 rounded-xl bg-white border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600 shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-md bg-blue-100 text-blue-800 shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-slate-900">Need direct customized guidance?</span>
              <span className="ml-1 text-slate-500">Contact Raj Singh Tarkar directly at Refinery Main Gate for instant support.</span>
            </div>
          </div>
          <button
            onClick={() => onOpenQuoteModal('Direct Consultation on Guides & Supplies')}
            className="shrink-0 px-3.5 py-1.5 rounded-lg bg-[#0B192C] hover:bg-slate-800 text-white font-bold transition flex items-center gap-1.5"
          >
            <span>Ask A Question</span>
            <ArrowRight className="w-3 h-3 text-sky-400" />
          </button>
        </div>

      </div>
    </section>
  );
};
