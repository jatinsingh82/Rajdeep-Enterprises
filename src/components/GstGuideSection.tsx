import React, { useState } from 'react';
import { 
  ReceiptText, 
  Calculator, 
  CheckCircle, 
  FileCheck2, 
  Truck, 
  Building2, 
  ShieldCheck, 
  ArrowRight,
  HelpCircle
} from 'lucide-react';
import { HSN_TAX_RATES } from '../data/tradeKitsData';
import { COMPANY_INFO } from '../data/companyData';

interface GstGuideSectionProps {
  onOpenQuoteModal: (productName?: string) => void;
}

export const GstGuideSection: React.FC<GstGuideSectionProps> = ({
  onOpenQuoteModal
}) => {
  const [estimatedValue, setEstimatedValue] = useState<number>(75000);
  const [taxType, setTaxType] = useState<'intra' | 'inter'>('inter');
  const [selectedHsn, setSelectedHsn] = useState<string>(HSN_TAX_RATES[0].hsnCode);

  const activeRateObj = HSN_TAX_RATES.find(h => h.hsnCode === selectedHsn) || HSN_TAX_RATES[0];
  
  // Rate calculation (standard 18% or 12% based on HSN)
  const effectiveGstPercent = selectedHsn.includes('6307') ? 12 : 18;
  const isEwayBillRequired = estimatedValue >= 50000;

  const taxAmount = (estimatedValue * effectiveGstPercent) / 100;
  const totalAmount = estimatedValue + taxAmount;
  const cgstAmount = taxAmount / 2;
  const sgstAmount = taxAmount / 2;

  return (
    <section id="gst-compliance" className="py-16 md:py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-3">
            <ReceiptText className="w-3.5 h-3.5 text-emerald-600" />
            <span>100% Tax Compliant B2B Billing</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
            GST Rates, HSN Codes & B2B Tax Calculator
          </h2>
          <div className="w-20 h-1 bg-emerald-500 mx-auto mt-4 rounded-full"></div>
          <p className="mt-4 text-sm sm:text-base text-slate-600 leading-relaxed">
            All consignments dispatched by Rajdeep Enterprises come with valid GST Tax Invoices and E-Way bills for 100% Input Tax Credit (ITC) claiming by corporate buyers, refineries, and contractors.
          </p>
        </div>

        {/* Dual Layout: Interactive Calculator (Left) & HSN Directory (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Interactive Tax Calculator (5 Cols) */}
          <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-slate-850 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-emerald-400" />
                <h3 className="font-black text-base sm:text-lg text-white">B2B Invoice & Tax Estimator</h3>
              </div>
              <span className="text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-800/60 px-2 py-0.5 rounded">
                ITC Eligible
              </span>
            </div>

            {/* Input Controls */}
            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold uppercase tracking-wider mb-1.5">
                  1. Order Taxable Material Value (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">₹</span>
                  <input
                    type="number"
                    min="1000"
                    step="5000"
                    value={estimatedValue}
                    onChange={(e) => setEstimatedValue(Math.max(0, Number(e.target.value)))}
                    className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono font-bold text-base focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
                  />
                </div>
                <div className="flex gap-2 mt-2">
                  {[25000, 50000, 100000, 250000].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setEstimatedValue(preset)}
                      className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[10px] font-mono text-slate-300 transition"
                    >
                      ₹{(preset / 1000)}k
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold uppercase tracking-wider mb-1.5">
                  2. Select Item Category / HSN Code
                </label>
                <select
                  value={selectedHsn}
                  onChange={(e) => setSelectedHsn(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-semibold focus:border-emerald-500 outline-none"
                >
                  {HSN_TAX_RATES.map((h) => (
                    <option key={h.hsnCode} value={h.hsnCode}>
                      HSN {h.hsnCode} - {h.category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold uppercase tracking-wider mb-1.5">
                  3. Delivery Destination (Supply Jurisdiction)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setTaxType('intra')}
                    className={`py-2 px-3 rounded-xl border font-bold text-xs transition text-left ${
                      taxType === 'intra'
                        ? 'bg-emerald-900/60 border-emerald-500 text-white ring-1 ring-emerald-500'
                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-750'
                    }`}
                  >
                    <p>Within Uttar Pradesh</p>
                    <span className="text-[10px] font-normal text-slate-400">CGST (9%) + SGST (9%)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTaxType('inter')}
                    className={`py-2 px-3 rounded-xl border font-bold text-xs transition text-left ${
                      taxType === 'inter'
                        ? 'bg-emerald-900/60 border-emerald-500 text-white ring-1 ring-emerald-500'
                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-750'
                    }`}
                  >
                    <p>🇮🇳 Rest of India</p>
                    <span className="text-[10px] font-normal text-slate-400">Integrated GST (18% IGST)</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Calculated Breakdown Box */}
            <div className="bg-slate-950/90 rounded-2xl p-4 border border-slate-800 space-y-2.5 text-xs font-mono">
              <div className="flex items-center justify-between text-slate-400">
                <span>Taxable Material Subtotal:</span>
                <span className="text-white font-bold">₹{estimatedValue.toLocaleString('en-IN')}</span>
              </div>

              {taxType === 'intra' ? (
                <>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>CGST ({effectiveGstPercent / 2}%):</span>
                    <span className="text-emerald-400">₹{cgstAmount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>SGST ({effectiveGstPercent / 2}%):</span>
                    <span className="text-emerald-400">₹{sgstAmount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-between text-slate-400">
                  <span>IGST ({effectiveGstPercent}%):</span>
                  <span className="text-emerald-400">₹{taxAmount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                </div>
              )}

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-sm sm:text-base font-black text-white">
                <span className="font-sans">Total B2B Invoice Value:</span>
                <span className="text-amber-400">₹{totalAmount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
              </div>
            </div>

            {/* E-Way Bill Status */}
            <div className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 ${
              isEwayBillRequired 
                ? 'bg-emerald-950/80 border-emerald-600/50 text-emerald-200' 
                : 'bg-slate-800/80 border-slate-700 text-slate-300'
            }`}>
              <Truck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold">
                  {isEwayBillRequired ? '✓ Government E-Way Bill Applicable (>= ₹50,000)' : 'Standard Local Delivery Invoice (< ₹50,000)'}
                </strong>
                <p className="text-[11px] text-slate-300 mt-0.5">
                  {isEwayBillRequired 
                    ? 'Generated directly on the GST portal before vehicle departure with part-B transporter vehicle tracking for hassle-free interstate toll checkpost passage.'
                    : 'Dispatched with full tax invoice and delivery challan copy.'}
                </p>
              </div>
            </div>

            <button
              onClick={() => onOpenQuoteModal(`Official GST Quotation (Estimate: ₹${estimatedValue.toLocaleString('en-IN')})`)}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider transition shadow-md active:scale-95 flex items-center justify-center gap-2"
            >
              <span>Request Proforma Invoice with GSTIN</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* HSN Directory & Tax Details (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-slate-900">Official HSN & GST Tariff Directory</h3>
              <span className="text-xs text-slate-500 font-mono">Ministry of Finance / CBIC Rates</span>
            </div>

            <div className="space-y-3">
              {HSN_TAX_RATES.map((rate) => (
                <div 
                  key={rate.hsnCode}
                  className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-emerald-300 transition-all shadow-2xs"
                >
                  <div className="flex items-start justify-between gap-3 mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-xs bg-slate-900 text-white px-2 py-0.5 rounded">
                        HSN {rate.hsnCode}
                      </span>
                      <h4 className="font-bold text-slate-900 text-xs sm:text-sm">
                        {rate.category}
                      </h4>
                    </div>
                    <span className="font-black text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full shrink-0">
                      GST: {rate.gstRate}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 mt-1">
                    <strong className="text-slate-800">Covers:</strong> {rate.appliesTo}
                  </p>

                  <div className="mt-2 pt-2 border-t border-slate-200/60 text-[11px] text-slate-500 flex items-center justify-between">
                    <span>{rate.complianceNotes}</span>
                    <span className="font-mono text-[10px] text-slate-400">ITC Claimable</span>
                  </div>
                </div>
              ))}
            </div>

            {/* B2B Assurance Points */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 rounded-xl border border-slate-200 bg-white flex items-start gap-2.5">
                <FileCheck2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-bold text-xs text-slate-900">Valid GST Invoicing</h5>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Original buyer copy, duplicate for transporter, and triplicate for accounts provided with each consignment.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 bg-white flex items-start gap-2.5">
                <Building2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-bold text-xs text-slate-900">Seamless GSTR-2B ITC Match</h5>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Filed monthly within due dates so your company claims 100% input tax credit without dispute.
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
