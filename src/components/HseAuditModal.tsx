import React, { useState } from 'react';
import { X, CheckCircle2, AlertTriangle, XCircle, ShieldCheck, Calendar, RefreshCw, ShoppingBag, Phone, ArrowRight, FileCheck2, Info } from 'lucide-react';
import { COMPANY_INFO } from '../data/companyData';
import { Product } from '../types';

interface HseAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenQuoteModal: (productName?: string) => void;
  onAddProductToRfq?: (product: Product, quantity?: number) => void;
}

interface ChecklistItem {
  id: string;
  label: string;
  standard: string;
  critical: boolean;
  requiredProduct: string;
}

const CHECKLIST_PRESETS: Record<string, { title: string; subtitle: string; items: ChecklistItem[] }> = {
  refinery: {
    title: 'Mathura Refinery Gate-Pass & Turnaround Checklist',
    subtitle: 'Mandatory standard compliance required for IOCL, GAIL, and Petrochemical plant entry turnstiles.',
    items: [
      {
        id: 'ref-1',
        label: 'Safety Helmet shell stamped IS:2925 with 3-point chin strap fastened & DOM within 3 years',
        standard: 'IS:2925 / OISD-155',
        critical: true,
        requiredProduct: 'Industrial Safety Helmet IS:2925 with Ratchet'
      },
      {
        id: 'ref-2',
        label: 'Safety Footwear: IS:15298 Part 2 certified with 200J steel toe cap & antistatic hydrocarbon sole',
        standard: 'IS:15298-2 / CE S1P',
        critical: true,
        requiredProduct: 'Karam / Hitman Antistatic Safety Shoes'
      },
      {
        id: 'ref-3',
        label: 'High-Visibility Safety Vest with dual 50mm retro-reflective bands (Class 2)',
        standard: 'EN ISO 20471 Class 2',
        critical: true,
        requiredProduct: 'High-Visibility Reflective Safety Vest'
      },
      {
        id: 'ref-4',
        label: 'Zero-Leak Impact Safety Goggles with indirect ventilation for hydrocarbon vapors',
        standard: 'EN 166 / ANSI Z87.1',
        critical: true,
        requiredProduct: '3M 1621IN Chemical Splash Goggles'
      },
      {
        id: 'ref-5',
        label: 'Corded Earplugs or Ear Defenders for areas exceeding 85 dBA sound pressure',
        standard: 'IS:9167 / EN 352-2',
        critical: false,
        requiredProduct: '3M 1110 Corded Ear Plugs (NRR 29dB)'
      },
      {
        id: 'ref-6',
        label: 'Material Test Certificate (MTC) batch document available for physical inspection',
        standard: 'BIS Batch Clearance',
        critical: true,
        requiredProduct: 'BIS Certified Batch Documentation'
      }
    ]
  },
  height: {
    title: 'Working at Height & Scaffolding Permit (Above 1.8m)',
    subtitle: 'Mandatory fall protection compliance verified by site HSE officers before granting height work permits.',
    items: [
      {
        id: 'hgt-1',
        label: 'Full Body Harness with dorsal D-ring and certified load-bearing webbing intact without fraying',
        standard: 'IS:3521:1999 / EN 361',
        critical: true,
        requiredProduct: 'Udyogi UB 102 Full Body Safety Harness'
      },
      {
        id: 'hgt-2',
        label: 'Dual 2-meter energy absorbing lanyard with forged scaffold hooks (twin SH-60 connectors)',
        standard: 'IS:3521 / EN 355',
        critical: true,
        requiredProduct: 'Twin Lanyard with Energy Absorber & Scaffold Hooks'
      },
      {
        id: 'hgt-3',
        label: 'Safety helmet fitted with elasticated chin strap to prevent displacement during tilt',
        standard: 'IS:2925 (Height Work)',
        critical: true,
        requiredProduct: 'Safety Helmet with Chin Strap'
      },
      {
        id: 'hgt-4',
        label: 'High-traction antislip safety boots with deep cleats for pipe and scaffolding tube grip',
        standard: 'IS:15298 SRC Antislip',
        critical: true,
        requiredProduct: 'High-Grip Construction Safety Shoes'
      },
      {
        id: 'hgt-5',
        label: 'Heavy duty tool tether / lanyard to prevent dropped object hazards to workers below',
        standard: 'DROPS Compliance',
        critical: false,
        requiredProduct: 'Elastic Tool Tether Lanyard'
      }
    ]
  },
  hotwork: {
    title: 'Hot Work, Gas Cutting & Welding Permit',
    subtitle: 'Fire & burn prevention PPE audited before sparking any torch in fabrication yards or refinery units.',
    items: [
      {
        id: 'hot-1',
        label: 'Heavy split cowhide leather welder gauntlets with Kevlar heat-resistant stitching (14 inch)',
        standard: 'IS:6994 / EN 407',
        critical: true,
        requiredProduct: 'Welding Leather Gauntlets 14-inch'
      },
      {
        id: 'hot-2',
        label: 'Split leather chest apron and leg spats protecting against slag droplets & sparks',
        standard: 'IS:6153 Leather Protective',
        critical: true,
        requiredProduct: 'Heavy Leather Welding Apron & Spats'
      },
      {
        id: 'hot-3',
        label: 'Flip-up gas welding / cutting goggles with DIN 5 shade filter lenses',
        standard: 'IS:1179 / EN 175',
        critical: true,
        requiredProduct: 'Flip-Front Welding & Gas Cutting Goggles'
      },
      {
        id: 'hot-4',
        label: 'Heat-resistant vulcanized rubber or leather boots with metal spark-guard tongue',
        standard: 'IS:15298 Heat Resistant',
        critical: true,
        requiredProduct: 'Karam Welder Safety Boots'
      },
      {
        id: 'hot-5',
        label: 'Particulate respirator with activated carbon filter for ozone & metal welding fumes',
        standard: 'IS:9473 / EN 149 FFP2',
        critical: false,
        requiredProduct: '3M Welding Fume Respirator FFP2'
      }
    ]
  }
};

const PPE_SHELF_LIFE_RULES = [
  {
    type: 'Industrial Safety Helmet (HDPE)',
    standard: 'IS:2925 / EN 397',
    maxYears: 3,
    notes: 'Sunlight UV radiation embrittles polymers. DGFASLI guidelines mandate retirement after 3 years from DOM or immediately after any hard blow.',
    replacementProduct: 'Industrial Safety Helmet IS:2925'
  },
  {
    type: 'Full Body Safety Harness (Webbing)',
    standard: 'IS:3521 / EN 361',
    maxYears: 5,
    notes: 'Polyester/polyamide webbing degrades with UV and atmospheric acids. Retire after 5 years or immediately following a single fall arrest.',
    replacementProduct: 'Udyogi Full Body Harness'
  },
  {
    type: 'Industrial Safety Footwear (PU Sole)',
    standard: 'IS:15298-2',
    maxYears: 2,
    notes: 'Polyurethane (PU) soles undergo hydrolysis breakdown over time. Retire when tread depth is below 2mm or steel toe becomes visible.',
    replacementProduct: 'Karam / Hitman Safety Shoes'
  },
  {
    type: 'Fall Protection Lanyard & Absorber',
    standard: 'IS:3521 / EN 355',
    maxYears: 5,
    notes: 'Retire if tear webbing indicates stitch elongation or if shock absorber pack has deployed.',
    replacementProduct: 'Shock Absorbing Twin Lanyard'
  },
  {
    type: 'Chemical Splash Goggles (Polycarbonate)',
    standard: 'EN 166',
    maxYears: 3,
    notes: 'Replace if lenses are scratched, pitted by chemical droplets, or if elastic headband loses tension.',
    replacementProduct: '3M 1621IN Splash Goggles'
  }
];

export const HseAuditModal: React.FC<HseAuditModalProps> = ({
  isOpen,
  onClose,
  onOpenQuoteModal
}) => {
  const [activeTab, setActiveTab] = useState<'checklist' | 'shelflife'>('checklist');
  const [selectedPresetKey, setSelectedPresetKey] = useState<string>('refinery');
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  // Shelf-life calculator inputs
  const [selectedPpeTypeIndex, setSelectedPpeTypeIndex] = useState<number>(0);
  const [manufactureYear, setManufactureYear] = useState<number>(2023);
  const [manufactureMonth, setManufactureMonth] = useState<number>(1);

  if (!isOpen) return null;

  const currentPreset = CHECKLIST_PRESETS[selectedPresetKey];
  const totalItems = currentPreset.items.length;
  const passedItemsCount = currentPreset.items.filter(item => checkedItems[item.id]).length;
  const compliancePercentage = Math.round((passedItemsCount / totalItems) * 100);

  const missingItems = currentPreset.items.filter(item => !checkedItems[item.id]);

  const toggleCheck = (itemId: string) => {
    setCheckedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const handleSelectAll = () => {
    const next: Record<string, boolean> = {};
    currentPreset.items.forEach(i => {
      next[i.id] = true;
    });
    setCheckedItems(next);
  };

  const handleResetChecklist = () => {
    setCheckedItems({});
  };

  // Shelf-life calculation
  const currentPpeRule = PPE_SHELF_LIFE_RULES[selectedPpeTypeIndex];
  const currentDate = new Date();
  const mfgDate = new Date(manufactureYear, manufactureMonth - 1, 1);
  const expiryDate = new Date(manufactureYear + currentPpeRule.maxYears, manufactureMonth - 1, 1);
  const isExpired = currentDate > expiryDate;
  const diffTime = expiryDate.getTime() - currentDate.getTime();
  const diffMonths = Math.round(diffTime / (1000 * 60 * 60 * 24 * 30.4375));

  // WhatsApp order for missing checklist items
  const handleOrderMissingViaWhatsapp = () => {
    const missingListText = missingItems.map(i => `• ${i.requiredProduct} (${i.standard})`).join('\n');
    const msg = `*URGENT GATE-PASS REPLACEMENT DISPATCH REQUEST*\n\n` +
      `Hello Rajdeep Enterprises,\nOur site team requires urgent replacement safety gear to clear gate pass audit:\n\n` +
      `*Audit Category:* ${currentPreset.title}\n` +
      `*Current Compliance:* ${compliancePercentage}%\n\n` +
      `*Urgent Items Needed:*\n${missingListText}\n\n` +
      `Please provide immediate dispatch to Mathura site with BIS/MTC certificates.`;
    
    window.open(`https://wa.me/${COMPANY_INFO.whatsappNumber}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl border border-slate-200 flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-5 sm:p-6 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-orange-600 text-white flex items-center justify-center shadow-lg shadow-orange-950/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-black text-white">
                  HSE Site Gate Audit & Shelf-Life Center
                </h3>
                <span className="hidden sm:inline-block text-[11px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold uppercase">
                  DGFASLI & BIS Norms
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Refinery turnaround gate pass verification & equipment retirement calculator
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-slate-200 bg-slate-100 px-4 sm:px-6 pt-3 gap-2">
          <button
            onClick={() => setActiveTab('checklist')}
            className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'checklist'
                ? 'border-orange-600 text-orange-600 bg-white rounded-t-lg shadow-sm'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileCheck2 className="w-4 h-4" />
            <span>Site Gate-Pass Checklist</span>
          </button>
          <button
            onClick={() => setActiveTab('shelflife')}
            className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'shelflife'
                ? 'border-orange-600 text-orange-600 bg-white rounded-t-lg shadow-sm'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>PPE Expiry & Shelf-Life Tool</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {activeTab === 'checklist' ? (
            <div className="space-y-6">
              {/* Preset Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Select Inspection Permit Type:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {Object.entries(CHECKLIST_PRESETS).map(([key, preset]) => (
                    <button
                      key={key}
                      onClick={() => {
                        setSelectedPresetKey(key);
                        setCheckedItems({});
                      }}
                      className={`text-left p-3 rounded-xl border text-xs font-semibold transition-all ${
                        selectedPresetKey === key
                          ? 'border-orange-500 bg-orange-50/70 text-orange-950 ring-2 ring-orange-500/20'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                      }`}
                    >
                      <div className="font-bold">{preset.title.split('&')[0]}</div>
                      <div className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                        {preset.subtitle}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Progress & Compliance Bar */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-700">
                      Audit Clearance Score:
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded font-black ${
                        compliancePercentage === 100
                          ? 'bg-emerald-100 text-emerald-800'
                          : compliancePercentage >= 70
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {compliancePercentage}%
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <button
                      onClick={handleSelectAll}
                      className="text-orange-600 hover:underline font-medium"
                    >
                      Check All
                    </button>
                    <span className="text-slate-300">|</span>
                    <button
                      onClick={handleResetChecklist}
                      className="text-slate-500 hover:underline font-medium"
                    >
                      Reset
                    </button>
                  </div>
                </div>

                {/* Progress track */}
                <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      compliancePercentage === 100
                        ? 'bg-emerald-500'
                        : compliancePercentage >= 70
                        ? 'bg-amber-500'
                        : 'bg-red-500'
                    }`}
                    style={{ width: `${compliancePercentage}%` }}
                  ></div>
                </div>

                <div className="text-[11px] text-slate-500 mt-2 flex items-center justify-between">
                  <span>{passedItemsCount} of {totalItems} checkpoint standards verified</span>
                  {compliancePercentage === 100 ? (
                    <span className="text-emerald-600 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Site Gate Clearance Guaranteed
                    </span>
                  ) : (
                    <span className="text-red-600 font-semibold flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" /> Risk of Gate Audit Rejection
                    </span>
                  )}
                </div>
              </div>

              {/* Checklist Items */}
              <div className="space-y-2.5">
                {currentPreset.items.map((item) => {
                  const isChecked = !!checkedItems[item.id];
                  return (
                    <div
                      key={item.id}
                      onClick={() => toggleCheck(item.id)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                        isChecked
                          ? 'bg-emerald-50/50 border-emerald-300 text-slate-900'
                          : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <div className="pt-0.5 flex-shrink-0">
                        <div
                          className={`w-5 h-5 rounded flex items-center justify-center border transition-all ${
                            isChecked
                              ? 'bg-emerald-600 border-emerald-600 text-white'
                              : 'bg-white border-slate-300'
                          }`}
                        >
                          {isChecked && <CheckCircle2 className="w-3.5 h-3.5" />}
                        </div>
                      </div>

                      <div className="flex-1">
                        <div className="text-xs sm:text-sm font-semibold leading-snug">
                          {item.label}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="inline-block text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                            {item.standard}
                          </span>
                          {item.critical && (
                            <span className="text-[10px] font-semibold text-red-600">
                              *Critical Mandate
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Action for Missing Items */}
              {missingItems.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      <span>{missingItems.length} required safety items missing for gate pass</span>
                    </div>
                    <div className="text-[11px] text-amber-700 mt-0.5">
                      Get immediate 30-minute roadside dispatch to Mathura Refinery gates with valid test certificates.
                    </div>
                  </div>

                  <button
                    onClick={handleOrderMissingViaWhatsapp}
                    className="w-full sm:w-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow-sm flex items-center justify-center gap-1.5 transition active:scale-95 whitespace-nowrap"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Order Replacements via WhatsApp</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Tab 2: Shelf-Life Calculator */
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-blue-900 leading-relaxed">
                  <strong>Why Shelf-Life Matters:</strong> Major oil refiners (IOCL, HPCL, BPCL, Reliance) and EPC clients conduct physical date-of-manufacture (DOM) audits at turnstiles. PPE exceeding the manufacturer retirement lifespan is confiscated at the gate, halting work permits.
                </div>
              </div>

              {/* Selector Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-3">
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Select Equipment Category:
                  </label>
                  <select
                    value={selectedPpeTypeIndex}
                    onChange={(e) => setSelectedPpeTypeIndex(Number(e.target.value))}
                    className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-800 font-semibold focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                  >
                    {PPE_SHELF_LIFE_RULES.map((rule, idx) => (
                      <option key={rule.type} value={idx}>
                        {rule.type} — [{rule.standard}]
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Mfg Month (Stamped on Shell):
                  </label>
                  <select
                    value={manufactureMonth}
                    onChange={(e) => setManufactureMonth(Number(e.target.value))}
                    className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-800 focus:outline-none focus:border-orange-500"
                  >
                    {[
                      'January (01)', 'February (02)', 'March (03)', 'April (04)',
                      'May (05)', 'June (06)', 'July (07)', 'August (08)',
                      'September (09)', 'October (10)', 'November (11)', 'December (12)'
                    ].map((month, idx) => (
                      <option key={month} value={idx + 1}>
                        {month}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Mfg Year (DOM Dial):
                  </label>
                  <select
                    value={manufactureYear}
                    onChange={(e) => setManufactureYear(Number(e.target.value))}
                    className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-800 focus:outline-none focus:border-orange-500"
                  >
                    {[2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026].map((yr) => (
                      <option key={yr} value={yr}>
                        {yr}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Standard Max Lifespan:
                  </label>
                  <div className="bg-slate-100 border border-slate-200 rounded-xl p-2.5 text-xs sm:text-sm font-bold text-slate-700 flex items-center justify-between">
                    <span>{currentPpeRule.maxYears} Years Max</span>
                    <span className="text-[10px] text-slate-500">DGFASLI Norm</span>
                  </div>
                </div>
              </div>

              {/* Calculation Result Card */}
              <div
                className={`p-5 rounded-2xl border ${
                  isExpired
                    ? 'bg-red-50 border-red-300 text-red-950'
                    : 'bg-emerald-50 border-emerald-300 text-emerald-950'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      {isExpired ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600 text-white text-xs font-black uppercase tracking-wider">
                          <XCircle className="w-4 h-4" /> RETIRED / EXPIRED — AUDIT FAILURE
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-black uppercase tracking-wider">
                          <CheckCircle2 className="w-4 h-4" /> COMPLIANT & APPROVED FOR USE
                        </span>
                      )}
                    </div>

                    <div className="mt-3 text-sm leading-relaxed">
                      {isExpired ? (
                        <>
                          This gear expired on <strong>{expiryDate.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</strong>. Safety officers at refinery gates will confiscate this equipment.
                        </>
                      ) : (
                        <>
                          Valid until <strong>{expiryDate.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</strong> (Approximately <strong>{diffMonths} months</strong> of safe field life remaining).
                        </>
                      )}
                    </div>

                    <div className="mt-2 text-xs opacity-80">
                      <strong>Audit Rule:</strong> {currentPpeRule.notes}
                    </div>
                  </div>
                </div>

                {isExpired && (
                  <div className="mt-4 pt-4 border-t border-red-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <span className="text-xs font-semibold text-red-900">
                      Replace with freshly manufactured, BIS stamped stock:
                    </span>
                    <button
                      onClick={() => onOpenQuoteModal(`Fresh Batch Replacement: ${currentPpeRule.replacementProduct}`)}
                      className="w-full sm:w-auto px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold rounded-lg shadow-sm transition"
                    >
                      Order Fresh Batch
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 p-4 sm:p-5 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-500">
            For on-site safety audits or bulk gate-pass packages, contact Raj Singh Tarkar directly.
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-initial px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-lg transition"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onOpenQuoteModal('Immediate Site Gate-Pass Equipment Order');
              }}
              className="flex-1 sm:flex-initial px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold rounded-lg transition shadow"
            >
              Request Quote
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
