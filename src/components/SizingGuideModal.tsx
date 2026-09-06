import React, { useState } from 'react';
import { X, Ruler, Footprints, Hand, Shield, CheckCircle, HelpCircle } from 'lucide-react';

interface SizingGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenQuoteModal: (productName?: string) => void;
}

type TabType = 'shoes' | 'gloves' | 'harness';

export const SizingGuideModal: React.FC<SizingGuideModalProps> = ({
  isOpen,
  onClose,
  onOpenQuoteModal
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('shoes');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-4 sm:p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400">
              <Ruler className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-orange-600 text-white px-2 py-0.5 rounded">
                  Fitting & Ergonomics
                </span>
                <span className="text-xs text-slate-400">IS:15298 • EN 388 • IS:3521</span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-white mt-0.5">
                Industrial Safety Equipment Sizing & Fitting Guide
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center border-b border-slate-200 bg-slate-50 px-4 sm:px-6 pt-3 gap-2 shrink-0">
          <button
            onClick={() => setActiveTab('shoes')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-bold border-t border-x transition ${
              activeTab === 'shoes'
                ? 'bg-white text-orange-600 border-slate-200 -mb-px'
                : 'text-slate-600 border-transparent hover:text-slate-900'
            }`}
          >
            <Footprints className="w-4 h-4" />
            <span>Safety Footwear (UK / India)</span>
          </button>

          <button
            onClick={() => setActiveTab('gloves')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-bold border-t border-x transition ${
              activeTab === 'gloves'
                ? 'bg-white text-orange-600 border-slate-200 -mb-px'
                : 'text-slate-600 border-transparent hover:text-slate-900'
            }`}
          >
            <Hand className="w-4 h-4" />
            <span>Work Gloves (EN 420)</span>
          </button>

          <button
            onClick={() => setActiveTab('harness')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-bold border-t border-x transition ${
              activeTab === 'harness'
                ? 'bg-white text-orange-600 border-slate-200 -mb-px'
                : 'text-slate-600 border-transparent hover:text-slate-900'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Safety Harnesses (IS:3521)</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* TAB 1: SAFETY SHOES */}
          {activeTab === 'shoes' && (
            <div className="space-y-6">
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-950 flex items-start gap-3">
                <HelpCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <strong className="font-bold text-amber-900">Steel Toe Fitment Rule for Industrial Workers:</strong>
                  <p className="leading-relaxed text-amber-800">
                    Always allow approximately <strong>10–12 mm (0.5 inch)</strong> space between worker toes and the internal steel toe cap to prevent toe pinching during uphill climbs, crouching, or kneeling on concrete/steel mesh floors.
                  </p>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto border border-slate-200 rounded-2xl shadow-xs">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-900 text-white font-black uppercase text-[11px] tracking-wider">
                      <th className="py-3 px-4">UK / India Size</th>
                      <th className="py-3 px-4">Euro (EU) Size</th>
                      <th className="py-3 px-4">US Men Size</th>
                      <th className="py-3 px-4">Foot Length (cm)</th>
                      <th className="py-3 px-4">Foot Length (Inches)</th>
                      <th className="py-3 px-4">Refinery / Site Popularity</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {[
                      { uk: 'UK 5', eu: '39', us: '6', cm: '24.5 cm', inch: '9.65"', status: 'Special Order' },
                      { uk: 'UK 6', eu: '40', us: '7', cm: '25.3 cm', inch: '9.96"', status: 'Common' },
                      { uk: 'UK 7', eu: '41', us: '8', cm: '26.0 cm', inch: '10.24"', status: 'High Demand (30% stock)' },
                      { uk: 'UK 8', eu: '42', us: '9', cm: '26.8 cm', inch: '10.55"', status: 'Highest Demand (35% stock)' },
                      { uk: 'UK 9', eu: '43', us: '10', cm: '27.5 cm', inch: '10.83"', status: 'High Demand (20% stock)' },
                      { uk: 'UK 10', eu: '44', us: '11', cm: '28.3 cm', inch: '11.14"', status: 'Common (10% stock)' },
                      { uk: 'UK 11', eu: '45', us: '12', cm: '29.0 cm', inch: '11.42"', status: 'Available' },
                      { uk: 'UK 12', eu: '46', us: '13', cm: '29.8 cm', inch: '11.73"', status: 'Available on Order' },
                    ].map((row, idx) => (
                      <tr key={idx} className={idx % 2 === 0 ? 'bg-white hover:bg-slate-50' : 'bg-slate-50/60 hover:bg-slate-100'}>
                        <td className="py-2.5 px-4 font-black text-slate-900 text-sm">{row.uk}</td>
                        <td className="py-2.5 px-4 font-medium">{row.eu}</td>
                        <td className="py-2.5 px-4 font-medium">{row.us}</td>
                        <td className="py-2.5 px-4 font-bold text-orange-600">{row.cm}</td>
                        <td className="py-2.5 px-4 font-mono">{row.inch}</td>
                        <td className="py-2.5 px-4">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            row.status.includes('Highest') ? 'bg-orange-100 text-orange-800' :
                            row.status.includes('High') ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: GLOVES */}
          {activeTab === 'gloves' && (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-xs text-blue-950 flex items-start gap-3">
                <Hand className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <strong className="font-bold text-blue-900">How to Measure Hand Size for EN 420 Gloves:</strong>
                  <p className="leading-relaxed text-blue-800">
                    Wrap a soft measuring tape around the widest part of your dominant hand palm (just below knuckles, excluding thumb). Use the resulting measurement in centimeters to choose your exact glove size.
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-2xl shadow-xs">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-900 text-white font-black uppercase text-[11px] tracking-wider">
                      <th className="py-3 px-4">Glove Standard Size</th>
                      <th className="py-3 px-4">EN 420 Number</th>
                      <th className="py-3 px-4">Palm Circumference (cm)</th>
                      <th className="py-3 px-4">Hand Length (Wrist to Middle Finger)</th>
                      <th className="py-3 px-4">Recommended Glove Type</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {[
                      { size: 'Small (S)', num: '7', palm: '17.8 – 19.0 cm', len: '17.1 cm', type: 'PU Coated Precision / Electronics' },
                      { size: 'Medium (M)', num: '8', palm: '19.0 – 20.3 cm', len: '18.2 cm', type: 'HPPE Cut-Resistant / Lathe & Milling' },
                      { size: 'Large (L) - Most Common', num: '9', palm: '20.3 – 22.9 cm', len: '19.2 cm', type: 'Orange Latex Finger Coated / Scaffolding' },
                      { size: 'Extra Large (XL)', num: '10', palm: '22.9 – 25.4 cm', len: '20.4 cm', type: 'Split Leather Welding & 12" Rubber Gloves' },
                      { size: 'Double XL (XXL)', num: '11', palm: '25.4 – 27.9 cm', len: '21.5 cm', type: 'Heavy Winter / Cryogenic / Rig Gloves' }
                    ].map((row, idx) => (
                      <tr key={idx} className={idx % 2 === 0 ? 'bg-white hover:bg-slate-50' : 'bg-slate-50/60 hover:bg-slate-100'}>
                        <td className="py-2.5 px-4 font-black text-slate-900 text-sm">{row.size}</td>
                        <td className="py-2.5 px-4 font-bold text-orange-600">{row.num}</td>
                        <td className="py-2.5 px-4 font-medium">{row.palm}</td>
                        <td className="py-2.5 px-4 font-mono">{row.len}</td>
                        <td className="py-2.5 px-4 font-medium text-slate-800">{row.type}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: HARNESSES */}
          {activeTab === 'harness' && (
            <div className="space-y-6">
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-xs text-emerald-950 flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <strong className="font-bold text-emerald-900">Udyogi / Karam Full Body Harness Fitment:</strong>
                  <p className="leading-relaxed text-emerald-800">
                    All full-body harnesses supplied by Rajdeep Enterprises come with <strong>universal adjustment friction buckles</strong> accommodating workers from 50 kg to 140 kg with height range from 155 cm to 195 cm.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                  <span className="text-[11px] font-black uppercase text-orange-600">Chest Strap</span>
                  <h4 className="font-black text-sm text-slate-900">Mid-Sternum Position</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Must sit flat across mid-chest, approximately 15 cm below collarbone. Keep it snug so the shoulder straps do not slide off shoulders during a fall.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                  <span className="text-[11px] font-black uppercase text-orange-600">Thigh Loops</span>
                  <h4 className="font-black text-sm text-slate-900">Two-Finger Clearance Rule</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Adjust leg straps so a flat hand / two fingers can slip between strap and thigh. Never leave thigh straps loose as it creates severe groin trauma during fall arrest.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                  <span className="text-[11px] font-black uppercase text-orange-600">Dorsal D-Ring</span>
                  <h4 className="font-black text-sm text-slate-900">Between Shoulder Blades</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    The back fall arrest D-Ring must rest exactly between the worker shoulder blades to ensure an upright post-fall suspension position.
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-500">
            Need assorted shoe size distribution (e.g. 50 pairs: 10x UK7, 25x UK8, 15x UK9)?
          </div>

          <button
            onClick={() => {
              onClose();
              onOpenQuoteModal('Assorted Sizes Safety Gear Order (Sizes Breakdown)');
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs transition shadow-md"
          >
            <span>Request Assorted Sizes Quotation</span>
          </button>
        </div>

      </div>
    </div>
  );
};
