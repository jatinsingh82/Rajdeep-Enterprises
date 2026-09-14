import React, { useState, useEffect } from 'react';
import { HelpCircle, ChevronDown, CheckCircle2, Shield, Phone, MessageSquare } from 'lucide-react';
import { COMPANY_INFO } from '../data/companyData';

interface FaqSectionProps {
  onOpenQuoteModal: (productName?: string) => void;
  lang?: 'en' | 'hi';
}

interface FaqItem {
  id: string;
  category: 'gate' | 'logistics' | 'compliance' | 'branding';
  questionEn: string;
  questionHi: string;
  answerEn: string;
  answerHi: string;
}

const FAQ_DATA: FaqItem[] = [
  {
    id: 'faq-1',
    category: 'gate',
    questionEn: 'What specific safety shoe standards are mandatory to clear Mathura Refinery gate audits?',
    questionHi: 'मथुरा रिफाइनरी गेट ऑडिट पास करने के लिए कौन से सुरक्षा जूते अनिवार्य हैं?',
    answerEn: 'Refinery security turnstiles strictly require IS:15298 Part 2 certified footwear equipped with a 200-Joule impact-resistant steel toe cap, penetration-resistant steel midplate, and an antistatic, hydrocarbon/oil-resistant sole (S1P rating). Non-certified boots or worn footwear with tread depth under 2mm are immediately rejected.',
    answerHi: 'रिफाइनरी सुरक्षा गेट पर 200 जूल इम्पैक्ट-प्रतिरोधी स्टील टो कैप, स्टील मिडप्लेट और एंटीस्टैटिक हाइड्रोकार्बन/तेल प्रतिरोधी सोल (IS:15298 भाग 2) वाले प्रमाणित जूते अनिवार्य हैं। गैर-प्रमाणित या घिसे हुए जूते तुरंत निरस्त कर दिए जाते हैं।'
  },
  {
    id: 'faq-2',
    category: 'logistics',
    questionEn: 'How fast can emergency replacement gear reach Mathura Refinery Gate 1 or Gate 2 during a shutdown?',
    questionHi: 'शटडाउन के दौरान इमरजेंसी सेफ्टी गियर मथुरा रिफाइनरी गेट 1 या 2 पर कितनी जल्दी पहुंच सकता है?',
    answerEn: 'Because our primary logistics warehouse is located directly inside SIDC Mathura adjacent to the refinery complex and NH-19 corridor, emergency replacement PPE (helmets, harnesses, boots, gauntlets) can be dispatched to the plant gates within 30 to 60 minutes via our dedicated local delivery vehicles.',
    answerHi: 'हमारा मुख्य वेयरहाउस एसआईडीसी मथुरा में रिफाइनरी परिसर और एनएच-19 के ठीक पास स्थित है। किसी भी आपात स्थिति या रात की शिफ्ट में 30 से 60 मिनट के भीतर रिफाइनरी गेट पर सीधे डिलीवरी उपलब्ध कराई जाती है।'
  },
  {
    id: 'faq-3',
    category: 'logistics',
    questionEn: 'Do you supply Pan-India across all states, and what is your minimum order quantity (MOQ)?',
    questionHi: 'क्या आप पूरे भारत में सप्लाई करते हैं, और न्यूनतम ऑर्डर मात्रा (MOQ) क्या है?',
    answerEn: 'Yes, we supply project sites across all 28 states and 8 union territories of India through national surface transport and express cargo. We have NO rigid minimum quantity—we fulfill urgent single-unit replacement pieces just as reliably as multi-thousand unit container loads with valid GST E-Way Bills.',
    answerHi: 'हाँ, हम भारत के सभी 28 राज्यों और केंद्र शासित प्रदेशों में एक्सप्रेस कार्गो और ट्रांसपोर्ट से सप्लाई करते हैं। हमारे पास कोई न्यूनतम मात्रा (MOQ) की बाध्यता नहीं है—हम 1 पीस सैंपल से लेकर 10,000+ पीस तक पूरी जीएसटी ई-वे बिल के साथ आपूर्ति करते हैं।'
  },
  {
    id: 'faq-4',
    category: 'branding',
    questionEn: 'Can you print our corporate logo, safety slogans, and worker blood group on helmets and safety vests?',
    questionHi: 'क्या आप हेलमेट और सेफ्टी जैकेट पर हमारी कंपनी का लोगो और सेफ्टी स्लोगन प्रिंट कर सकते हैं?',
    answerEn: 'Yes! We run an in-house custom branding studio offering high-durability UV screen printing, pad printing, and retro-reflective heat transfer vinyl. We print corporate logos, worker blood group badges, contractor names, and bilingual safety slogans ("SAFETY FIRST / सुरक्षा सर्वोपरि") with quick dispatch.',
    answerHi: 'हाँ! हमारे पास कस्टम ब्रांडिंग की सुविधा है जिसमें टिकाऊ यूवी स्क्रीन प्रिंटिंग और रेट्रो-रिफ्लेक्टिव हीट ट्रांसफर से हेलमेट और जैकेट पर आपकी कंपनी का लोगो, सेफ्टी स्लोगन और ब्लड ग्रुप प्रिंट किया जाता है।'
  },
  {
    id: 'faq-5',
    category: 'compliance',
    questionEn: 'Do you enclose signed Manufacturer Material Test Certificates (MTC) and BIS test reports with orders?',
    questionHi: 'क्या आप प्रत्येक खेप के साथ निर्माता का टेस्ट सर्टिफिकेट (MTC) और बीआईएस रिपोर्ट प्रदान करते हैं?',
    answerEn: 'Yes. Every batch of industrial safety helmets (IS:2925), safety footwear (IS:15298), full-body harnesses (IS:3521), and eye protection is accompanied by signed Manufacturer Test Certificates (MTC) verifying lot test compliance for seamless plant HSE audit inspections.',
    answerHi: 'हाँ। प्रत्येक बैच (हेलमेट, हार्नेस, जूते और चश्मे) के साथ अधिकृत निर्माता का मैटेरियल टेस्ट सर्टिफिकेट (MTC) और बीआईएस बैच रिपोर्ट साथ भेजी जाती है ताकि प्लांट एचएसई ऑडिट में कोई रुकावट न आए।'
  },
  {
    id: 'faq-6',
    category: 'compliance',
    questionEn: 'Can registered EPC contractors and infrastructure companies obtain 30-day corporate credit terms?',
    questionHi: 'क्या बड़े ईपीसी ठेकेदारों को 30 दिन की क्रेडिट सुविधा मिल सकती है?',
    answerEn: 'Yes, we work with leading EPC infrastructure firms, turnaround contractors, and manufacturing plants. Following standard vendor empanelment and purchase order (P.O.) verification, we offer 15 to 30-day corporate payment credit terms.',
    answerHi: 'हाँ, हम प्रमुख ईपीसी इंफ्रास्ट्रक्चर कंपनियों और टर्नअराउंड ठेकेदारों के साथ काम करते हैं। औपचारिक वेंडर पंजीकरण और पीओ सत्यापन के बाद हम 15 से 30 दिनों की कॉर्पोरेट क्रेडिट सुविधा प्रदान करते हैं।'
  }
];

export const FaqSection: React.FC<FaqSectionProps> = ({
  onOpenQuoteModal,
  lang = 'en'
}) => {
  const [openFaqId, setOpenFaqId] = useState<string>('faq-1');
  const [activeTab, setActiveTab] = useState<string>('all');

  const categories = [
    { id: 'all', label: lang === 'en' ? 'All Questions' : 'सभी प्रश्न' },
    { id: 'gate', label: lang === 'en' ? 'Gate Pass & Audits' : 'गेट पास और ऑडिट' },
    { id: 'logistics', label: lang === 'en' ? 'Pan-India Logistics' : 'सप्लाई और डिलीवरी' },
    { id: 'compliance', label: lang === 'en' ? 'MTC & Standards' : 'टेस्ट सर्टिफिकेट और मानक' },
    { id: 'branding', label: lang === 'en' ? 'Custom Logo Printing' : 'कस्टम लोगो प्रिंटिंग' },
  ];

  const filteredFaqs = activeTab === 'all'
    ? FAQ_DATA
    : FAQ_DATA.filter(f => f.category === activeTab);

  const toggleFaq = (id: string) => {
    setOpenFaqId(prev => (prev === id ? '' : id));
  };

  // Inject valid FAQPage Schema.org structured data
  useEffect(() => {
    const scriptId = 'faq-jsonld-script';
    let scriptEl = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!scriptEl) {
      scriptEl = document.createElement('script');
      scriptEl.id = scriptId;
      scriptEl.type = 'application/ld+json';
      document.head.appendChild(scriptEl);
    }

    const faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: FAQ_DATA.map(faq => ({
        '@type': 'Question',
        name: lang === 'en' ? faq.questionEn : faq.questionHi,
        acceptedAnswer: {
          '@type': 'Answer',
          text: lang === 'en' ? faq.answerEn : faq.answerHi
        }
      }))
    };
    scriptEl.textContent = JSON.stringify(faqSchema);

    return () => {
      const el = document.getElementById(scriptId);
      if (el) el.remove();
    };
  }, [lang]);

  return (
    <div id="faqs" className="py-4 sm:py-6 px-1 sm:px-4 w-full bg-slate-50 relative overflow-x-hidden">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-800 border border-orange-200 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
            <HelpCircle className="w-3.5 h-3.5 text-orange-600" />
            <span>{lang === 'en' ? 'Contractor Knowledgebase' : 'ठेकेदारों के लिए मार्गदर्शिका'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            {lang === 'en' ? 'Frequently Asked Questions' : 'अक्सर पूछे जाने वाले सवाल'}
          </h2>
          <p className="mt-3 text-slate-600 text-sm sm:text-base max-w-2xl mx-auto">
            {lang === 'en'
              ? 'Clear answers regarding refinery gate pass compliance, express 30-minute shutdown dispatch, pan-India transport, and corporate credit terms.'
              : 'मथुरा रिफाइनरी गेट पास, 30-मिनट शटडाउन सप्लाई, टेस्ट सर्टिफिकेट और पूरे भारत में डिलीवरी के बारे में जरूरी जानकारी।'}
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === cat.id
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3">
          {filteredFaqs.map((faq) => {
            const isOpen = openFaqId === faq.id;
            return (
              <div
                key={faq.id}
                className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden transition-all"
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
                >
                  <span className="text-sm sm:text-base font-bold text-slate-900">
                    {lang === 'en' ? faq.questionEn : faq.questionHi}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 flex-shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 bg-orange-100 text-orange-700' : ''
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                    <p>{lang === 'en' ? faq.answerEn : faq.answerHi}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Help Desk Card */}
        <div className="mt-10 bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-orange-600 flex items-center justify-center flex-shrink-0 shadow-md">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="font-bold text-base text-white">
                {lang === 'en' ? 'Have a Specific Project Tender or Gate Inquiry?' : 'क्या आपकी कोई विशिष्ट निविदा या गेट संबंधी पूछताछ है?'}
              </div>
              <div className="text-xs text-slate-300 mt-0.5">
                {lang === 'en'
                  ? 'Speak directly with Raj Singh Tarkar for immediate clearance advice.'
                  : 'तुरंत परामर्श और सहायता के लिए राज सिंह तारकर से सीधे संपर्क करें।'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <a
              href={`tel:${COMPANY_INFO.phone}`}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold transition"
            >
              <Phone className="w-3.5 h-3.5 text-orange-400" />
              <span>{COMPANY_INFO.displayPhone}</span>
            </a>
            <button
              onClick={() => onOpenQuoteModal('General Contractor Technical Inquiry')}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold transition shadow-lg shadow-orange-900/30"
            >
              <span>{lang === 'en' ? 'Ask Technical Question' : 'सवाल पूछें'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
