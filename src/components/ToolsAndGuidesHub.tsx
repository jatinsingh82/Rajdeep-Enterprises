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
  ArrowRight
} from 'lucide-react';
import { Product, Language } from '../types';
import { TradeKitsSection } from './TradeKitsSection';
import { GstGuideSection } from './GstGuideSection';
import { StandardsSection } from './StandardsSection';
import { IndustriesSection } from './IndustriesSection';
import { FaqSection } from './FaqSection';

interface ToolsAndGuidesHubProps {
  onAddProductToRfq: (product: Product, quantity?: number) => void;
  onOpenQuoteModal: (productName?: string) => void;
  lang: Language;
}

type GuideSectionId = 'trade-kits' | 'gst-compliance' | 'standards' | 'industries' | 'faqs';

export const ToolsAndGuidesHub: React.FC<ToolsAndGuidesHubProps> = ({
  onAddProductToRfq,
  onOpenQuoteModal,
  lang
}) => {
  // Store open/closed state for each of the 5 dropdown tools
  // By default, only the first one (or none) is open so the page stays very compact!
  const [openSections, setOpenSections] = useState<Record<GuideSectionId, boolean>>({
    'trade-kits': false,
    'gst-compliance': false,
    'standards': false,
    'industries': false,
    'faqs': false
  });

  // Listen for hash changes or custom events from topbar links
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (['trade-kits', 'gst-compliance', 'standards', 'industries', 'faqs'].includes(hash)) {
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
      id: 'industries',
      anchorId: 'industries',
      titleEn: 'Industries We Serve',
      titleHi: 'जिन उद्योगों को हम सेवाएं प्रदान करते हैं',
      subtitleEn: 'Targeted safety accessories and industrial material solutions for petrochemical, civil, pipeline, and manufacturing sectors.',
      subtitleHi: 'पेट्रोकेमिकल रिफाइनरी, निर्माण, सिविल प्रोजेक्ट्स और फैब्रिकेशन वर्कशॉप के लिए लक्षित समाधान।',
      badgeEn: 'Sector Directory',
      badgeHi: 'औद्योगिक क्षेत्र',
      icon: Building2,
      accentColor: 'text-indigo-600',
      bgAccent: 'bg-indigo-50',
      borderAccent: 'border-indigo-200',
      summaryTagsEn: ['Refineries & Petrochemicals', 'Civil & Erection', 'Pipeline & Mechanical'],
      summaryTagsHi: ['रिफाइनरी व पेट्रोकेमिकल्स', 'सिविल प्रोजेक्ट्स', 'पाइपलाइन वर्क']
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
      className="py-14 md:py-20 bg-slate-100/90 relative border-t border-b border-slate-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hub Header with Summary & Compact Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-slate-300 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1E3E62]/10 border border-[#1E3E62]/20 text-[#0B192C] text-xs font-bold uppercase tracking-wider mb-3">
              <Layers className="w-3.5 h-3.5 text-blue-600" />
              <span>Compact Interactive Dropdown Hub</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              {lang === 'en' ? 'Tools, Compliance & Industrial Guides' : 'टूल्स, कंप्लायंस एवं तकनीकी गाइड्स'}
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-2xl">
              {lang === 'en' 
                ? 'To keep the page lightweight and easy to navigate, all trade kit calculators, tax tables, safety standards, and FAQs are grouped into expandable dropdown panels below. Drop down only what you need.' 
                : 'साइट को सरल और व्यवस्थित रखने के लिए, सभी ट्रेड किट, टैक्स कैलकुलेटर, सुरक्षा मानक और अक्सर पूछे जाने वाले सवाल नीचे ड्रॉप-डाउन में संकलित हैं। जो आवश्यकता हो उसे खोलें।'}
            </p>
          </div>

          {/* Quick Toggle Controls */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="text-xs font-semibold text-slate-500 hidden sm:block">
              {totalOpen} of 5 Open
            </div>
            <button
              onClick={expandAll}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 shadow-xs transition active:scale-95"
              title="Open all 5 dropdown guides"
            >
              <Eye className="w-3.5 h-3.5 text-blue-600" />
              <span>Expand All</span>
            </button>
            <button
              onClick={collapseAll}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 shadow-xs transition active:scale-95"
              title="Close all dropdown guides to minimize page height"
            >
              <EyeOff className="w-3.5 h-3.5 text-slate-500" />
              <span>Collapse All</span>
            </button>
          </div>
        </div>

        {/* 5 Collapsible Accordion Dropdown Cards */}
        <div className="space-y-4">
          {sectionsConfig.map((sec, idx) => {
            const isOpen = openSections[sec.id];
            const Icon = sec.icon;

            return (
              <div 
                key={sec.id}
                id={sec.anchorId}
                className={`rounded-2xl transition-all duration-300 overflow-hidden border shadow-sm ${
                  isOpen 
                    ? 'bg-white border-blue-500/50 ring-2 ring-blue-500/10 shadow-md' 
                    : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Dropdown Header Trigger Banner */}
                <div 
                  onClick={() => toggleSection(sec.id)}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer select-none transition-colors"
                  role="button"
                  aria-expanded={isOpen}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      toggleSection(sec.id);
                    }
                  }}
                >
                  {/* Left: Icon, Number & Title */}
                  <div className="flex items-start gap-3.5">
                    <div className={`p-2.5 rounded-xl ${sec.bgAccent} ${sec.accentColor} border ${sec.borderAccent} shrink-0 mt-0.5 sm:mt-0 shadow-xs`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                          Part {idx + 1}
                        </span>
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${sec.bgAccent} ${sec.accentColor}`}>
                          {lang === 'en' ? sec.badgeEn : sec.badgeHi}
                        </span>
                      </div>
                      <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                        {lang === 'en' ? sec.titleEn : sec.titleHi}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-1 max-w-2xl">
                        {lang === 'en' ? sec.subtitleEn : sec.subtitleHi}
                      </p>

                      {/* Summary Tags (visible when collapsed) */}
                      {!isOpen && (
                        <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
                          {(lang === 'en' ? sec.summaryTagsEn : sec.summaryTagsHi).map((tag, tIdx) => (
                            <span 
                              key={tIdx} 
                              className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200/80"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: Dropdown Action Button */}
                  <div className="flex items-center gap-3 shrink-0 self-end sm:self-center pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 w-full sm:w-auto justify-between sm:justify-end">
                    <span className="text-xs font-bold text-slate-500 sm:hidden">
                      {isOpen ? 'Currently Open' : 'Tap to expand'}
                    </span>
                    <button
                      type="button"
                      className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs ${
                        isOpen 
                          ? 'bg-blue-600 text-white hover:bg-blue-700' 
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300'
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSection(sec.id);
                      }}
                    >
                      <span>{isOpen ? 'Collapse Section' : 'Drop Down & Open'}</span>
                      <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180 text-white' : 'text-slate-600'}`} />
                    </button>
                  </div>
                </div>

                {/* Expanded Component Body */}
                {isOpen && (
                  <div className="border-t border-slate-200 bg-slate-50/50 animate-in fade-in duration-200">
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

                      {sec.id === 'industries' && (
                        <IndustriesSection
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

                    {/* Bottom Collapse Bar inside open panel for quick close */}
                    <div className="px-6 py-3 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-medium">
                        Finished reviewing this guide?
                      </span>
                      <button
                        onClick={() => toggleSection(sec.id)}
                        className="inline-flex items-center gap-1.5 text-blue-700 hover:text-blue-900 font-bold px-3 py-1 rounded bg-white border border-slate-300 hover:border-slate-400 transition"
                      >
                        <ChevronUp className="w-3.5 h-3.5" />
                        <span>Collapse {lang === 'en' ? sec.titleEn : sec.titleHi}</span>
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
