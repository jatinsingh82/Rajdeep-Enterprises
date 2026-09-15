import React, { useState } from 'react';
import { X, Shield, FileText, AlertCircle, Phone, Mail, Building2 } from 'lucide-react';
import { COMPANY_INFO } from '../data/companyData';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'privacy' | 'terms' | 'disclaimer';
}

export const LegalModal: React.FC<LegalModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'privacy',
}) => {
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms' | 'disclaimer'>(initialTab);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto">
      <div
        className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8"
        role="dialog"
        aria-modal="true"
        aria-labelledby="legal-modal-title"
      >
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 id="legal-modal-title" className="text-base sm:text-lg font-extrabold text-white">
                Legal & Commercial Disclosures
              </h3>
              <p className="text-xs text-slate-400">
                {COMPANY_INFO.name} — Mathura Refinery Gate, UP
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-3 gap-2 overflow-x-auto text-xs font-bold">
          <button
            onClick={() => setActiveTab('privacy')}
            className={`pb-3 px-3.5 border-b-2 transition whitespace-nowrap ${
              activeTab === 'privacy'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Privacy Policy
          </button>
          <button
            onClick={() => setActiveTab('terms')}
            className={`pb-3 px-3.5 border-b-2 transition whitespace-nowrap ${
              activeTab === 'terms'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Terms of Commercial Supply
          </button>
          <button
            onClick={() => setActiveTab('disclaimer')}
            className={`pb-3 px-3.5 border-b-2 transition whitespace-nowrap ${
              activeTab === 'disclaimer'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Business & Legal Notice
          </button>
        </div>

        {/* Owner Review Warning Banner */}
        <div className="bg-amber-50 border-b border-amber-200/80 px-6 py-2.5 flex items-center gap-2.5 text-xs text-amber-900">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            <strong>Proprietor Review Note:</strong> These policies reflect standard B2B industrial trading terms. Prior to formal publication, content must be audited by proprietor <strong>{COMPANY_INFO.contactPerson}</strong> to ensure compliance with specific accounting and banking contracts.
          </span>
        </div>

        {/* Body Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
          {activeTab === 'privacy' && (
            <div className="space-y-4">
              <div>
                <h4 className="font-extrabold text-slate-900 text-base mb-1">
                  1. Information We Collect
                </h4>
                <p>
                  When you submit an Enquiry or Request for Quotation (RFQ) through our website, we collect only the necessary commercial details required to quote and deliver industrial supplies:
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-slate-600">
                  <li>Your Name and Company / Contractor Name</li>
                  <li>Contact Mobile Number for phone quotation and WhatsApp dispatch updates</li>
                  <li>Delivery Location (Site Name, City, State)</li>
                  <li>Product Requirements, Quantities, and Bill of Quantities (BOQ)</li>
                </ul>
              </div>

              <div>
                <h4 className="font-extrabold text-slate-900 text-base mb-1">
                  2. How We Use Your Data
                </h4>
                <p>
                  All submitted data is utilized strictly for:
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-slate-600">
                  <li>Generating itemized GST price estimates and tax invoices</li>
                  <li>Direct commercial follow-up from proprietor {COMPANY_INFO.contactPerson}</li>
                  <li>Coordinating courier or dedicated vehicle dispatch to your site gate</li>
                </ul>
                <p className="mt-2 text-slate-900 font-semibold">
                  We do not sell, rent, or lease customer contact information to third-party telemarketers or advertisers under any circumstances.
                </p>
              </div>

              <div>
                <h4 className="font-extrabold text-slate-900 text-base mb-1">
                  3. Data Retention & Deletion
                </h4>
                <p>
                  Enquiry logs are retained solely for internal order records and statutory tax audits under Indian GST legislation. If you wish to have your contact number or purchase history removed from our active enquiry logs, contact us at <a href={`mailto:${COMPANY_INFO.email}`} className="text-orange-600 underline font-semibold">{COMPANY_INFO.email}</a>.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'terms' && (
            <div className="space-y-4">
              <div>
                <h4 className="font-extrabold text-slate-900 text-base mb-1">
                  1. Quotation Validity & Pricing
                </h4>
                <p>
                  All written quotations provided via WhatsApp, email, or formal proforma invoice are valid for 7 working days from the date of issue, unless otherwise noted. Metal consumables, welding rods, and gasket materials subject to volatile raw material market pricing may be updated with prior notice.
                </p>
              </div>

              <div>
                <h4 className="font-extrabold text-slate-900 text-base mb-1">
                  2. Taxation & GST Compliance
                </h4>
                <p>
                  All supplies are issued with statutory GST invoices under the jurisdiction of Uttar Pradesh State (State Code 09). Applicable CGST/SGST (intra-state) or IGST (inter-state) will be applied at prevailing rates based on the respective HSN code. E-Way Bills are generated for all consignments exceeding the statutory threshold.
                </p>
              </div>

              <div>
                <h4 className="font-extrabold text-slate-900 text-base mb-1">
                  3. Dispatch, Delivery & Inspection
                </h4>
                <ul className="list-disc pl-5 space-y-1 text-slate-600">
                  <li><strong>Local Refinery & Mathura Sites:</strong> Urgent consignments can be dispatched to the site gate via mini-truck or collected at our UP SIDC depot opposite Refinery Main Gate.</li>
                  <li><strong>Pan-India Shipments:</strong> Dispatched via reliable road transport, express surface courier, or client-nominated logistics carrier.</li>
                  <li><strong>Physical Inspection:</strong> Site safety officers must inspect packaging and quantities upon gate handover. Any transit discrepancies must be recorded on the delivery challan within 48 hours.</li>
                </ul>
              </div>

              <div>
                <h4 className="font-extrabold text-slate-900 text-base mb-1">
                  4. Certifications & Test Reports (MTC)
                </h4>
                <p>
                  Manufacturer Batch Test Certificates (MTC), BIS test licenses, and CE certificates for certified PPE (helmets, harnesses, safety shoes, DPT kits) are supplied along with the consignment upon advance request.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'disclaimer' && (
            <div className="space-y-4">
              <div>
                <h4 className="font-extrabold text-slate-900 text-base mb-1">
                  Business Entity Details
                </h4>
                <p>
                  <strong>Rajdeep Enterprises</strong> operates as a registered commercial proprietorship located at:
                </p>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 my-2 text-xs text-slate-800 space-y-1">
                  <p className="font-bold flex items-center gap-1.5 text-slate-900">
                    <Building2 className="w-3.5 h-3.5 text-orange-600" />
                    {COMPANY_INFO.name}
                  </p>
                  <p>{COMPANY_INFO.address} - 281005</p>
                  <p>Proprietor: {COMPANY_INFO.contactPerson}</p>
                  <p>Primary Contact: {COMPANY_INFO.displayPhone}</p>
                </div>
              </div>

              <div>
                <h4 className="font-extrabold text-slate-900 text-base mb-1">
                  Website Content Disclaimer
                </h4>
                <p>
                  The technical specifications, compliance standards, and product images shown on this catalog are for commercial procurement reference. Brand trademarks (e.g., Karam, Udyogi, 3M, Champion) belong to their respective manufacturers. While we strive to maintain complete accuracy, site managers should confirm exact batch dimensions and suitability before placing large structural orders.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-600">
            <Phone className="w-3.5 h-3.5 text-orange-500" />
            <span>Need clarification? Call {COMPANY_INFO.displayPhone}</span>
          </div>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition"
          >
            Close Disclosures
          </button>
        </div>
      </div>
    </div>
  );
};
