import React, { useState } from 'react';
import { X, Building2, CheckCircle2, Copy, FileText, Download, Shield, CreditCard, Truck, Phone, Mail, Award, Check } from 'lucide-react';
import { COMPANY_INFO } from '../data/companyData';

interface VendorDossierModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenQuoteModal: (productName?: string) => void;
}

export const VendorDossierModal: React.FC<VendorDossierModalProps> = ({
  isOpen,
  onClose,
  onOpenQuoteModal
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const vendorSummaryText = `
VENDOR EMPANELMENT PROFILE — RAJDEEP ENTERPRISES
------------------------------------------------
Legal Name: ${COMPANY_INFO.name}
Constitution: Sole Proprietorship
Key Person: ${COMPANY_INFO.contactPerson} (${COMPANY_INFO.designation})
Business Category: Industrial Safety Equipment Stockist & Pan-India Safety Supplier
Operating Hub: ${COMPANY_INFO.address}
Phone / WhatsApp: ${COMPANY_INFO.displayPhone} / ${COMPANY_INFO.displaySecondaryPhone}
Email: ${COMPANY_INFO.email}

REGULATORY & TAX CREDENTIALS:
- GST Registration: Regular Taxpayer (Uttar Pradesh - State Code 09)
- PAN: Available on formal purchase order confirmation
- MSME / Udyam: Micro & Small Industrial Enterprise (PPE & Safety Goods)
- Compliance Norms: BIS / IS Certified (IS:2925, IS:15298, IS:3521, IS:9457), CE / EN Approved
- Material Test Certificate (MTC): Provided per manufacturer batch

COMMERCIAL SUPPLY TERMS:
- Supply Scope: Whole India (Single Unit sample to 10,000+ units bulk consignments)
- Billing: Tax Invoice with statutory HSN and E-Way Bill generation
- Logistics: Road Express, Dedicated Mini-Truck for Mathura shutdown sites, Interstate Cargo
- Payment: RTGS / NEFT / P.O. against approved corporate credit
------------------------------------------------
`.trim();

  const handleCopy = () => {
    navigator.clipboard.writeText(vendorSummaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadDossier = () => {
    const element = document.createElement('a');
    const file = new Blob([vendorSummaryText], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `Rajdeep-Enterprises-Vendor-Empanelment-Dossier.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl border border-slate-200 flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-5 sm:p-6 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-orange-600 text-white flex items-center justify-center shadow-lg shadow-orange-950/30">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-black text-white">
                  Corporate Vendor Empanelment Dossier
                </h3>
                <span className="hidden sm:inline-block text-[11px] bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold uppercase">
                  AVL Ready
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Official profile, GST/PAN compliance & banking credentials for ERP vendor master
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

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {/* Quick Actions Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-orange-50/70 border border-orange-200 rounded-xl p-3.5">
            <div className="text-xs text-orange-950 font-medium">
              Adding Rajdeep Enterprises to your ERP / SAP Approved Vendor List?
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-orange-300 text-orange-900 text-xs font-bold hover:bg-orange-100 transition shadow-sm"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied to Clipboard' : 'Copy ERP Profile'}</span>
              </button>
              <button
                onClick={handleDownloadDossier}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-600 text-white text-xs font-bold hover:bg-orange-500 transition shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Dossier</span>
              </button>
            </div>
          </div>

          {/* Core Master Data Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Box 1: Legal Entity */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <Shield className="w-4 h-4 text-orange-600" />
                <span>Enterprise Identity</span>
              </div>
              <div className="text-sm font-bold text-slate-900">
                {COMPANY_INFO.name}
              </div>
              <div className="text-xs text-slate-600 space-y-1">
                <div><span className="font-semibold text-slate-700">Constitution:</span> Sole Proprietorship</div>
                <div><span className="font-semibold text-slate-700">Key Person:</span> {COMPANY_INFO.contactPerson} ({COMPANY_INFO.designation})</div>
                <div><span className="font-semibold text-slate-700">Location:</span> SIDC Mathura, Uttar Pradesh - 281005</div>
                <div><span className="font-semibold text-slate-700">Experience:</span> 15+ Years Industrial Supplying</div>
              </div>
            </div>

            {/* Box 2: Tax & Compliance */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <Award className="w-4 h-4 text-emerald-600" />
                <span>Tax & Compliance Status</span>
              </div>
              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-700">GST Registration:</span>
                  <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">Active (State 09)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-700">PAN Verification:</span>
                  <span className="text-slate-800 font-semibold">Available on P.O.</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-700">MSME / Udyam:</span>
                  <span className="text-slate-800 font-semibold">Micro & Small Enterprise</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-700">E-Way Bill:</span>
                  <span className="text-slate-800 font-semibold">Automated GST System</span>
                </div>
              </div>
            </div>

            {/* Box 3: Logistics & Pan-India Scope */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <Truck className="w-4 h-4 text-blue-600" />
                <span>Supply & Logistics Capabilities</span>
              </div>
              <div className="text-xs text-slate-600 space-y-1">
                <div><span className="font-semibold text-slate-700">Supply Territory:</span> Whole India (All 28 States & 8 UTs)</div>
                <div><span className="font-semibold text-slate-700">Order Volume:</span> Any quantity (1 sample to 10,000+ units)</div>
                <div><span className="font-semibold text-slate-700">Express Mathura Dispatch:</span> 30–60 mins to Refinery Gates</div>
                <div><span className="font-semibold text-slate-700">Test Certificates:</span> Signed MTC & BIS conformity enclosed</div>
              </div>
            </div>

            {/* Box 4: Commercial & Billing Terms */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <CreditCard className="w-4 h-4 text-purple-600" />
                <span>Commercial Terms & Banking</span>
              </div>
              <div className="text-xs text-slate-600 space-y-1">
                <div><span className="font-semibold text-slate-700">Bank Account:</span> Current Account (RTGS / NEFT)</div>
                <div><span className="font-semibold text-slate-700">Invoicing:</span> GST Compliant with HSN & ITC Pass-through</div>
                <div><span className="font-semibold text-slate-700">Payment Terms:</span> Advance / 15-30 Days against approved P.O.</div>
                <div><span className="font-semibold text-slate-700">Delivery Basis:</span> Ex-Warehouse or FOR Project Site</div>
              </div>
            </div>
          </div>

          {/* Required Documents Checklist for Corporate Empanelment */}
          <div className="border border-slate-200 rounded-xl p-4 bg-white">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
              Standard Documents Provided Upon Formal P.O. / Vendor RFQ:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>GST Registration Certificate (Form REG-06)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Proprietor Permanent Account Number (PAN) Card</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Cancelled Cheque for Bank RTGS / NEFT Verification</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Manufacturer BIS Test Certificates & Lab Reports</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>MSME / Udyam Registration Certificate</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Government E-Way Bill Consignment Documentation</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 p-4 sm:p-5 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-500">
            Need customized vendor forms or NDAs signed? Contact Rajdeep Enterprises procurement desk.
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
                onOpenQuoteModal('Formal Corporate Vendor Empanelment Inquiry');
              }}
              className="flex-1 sm:flex-initial px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold rounded-lg transition shadow"
            >
              Initiate Empanelment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
