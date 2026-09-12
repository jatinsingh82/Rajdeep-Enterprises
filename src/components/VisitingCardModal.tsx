import React, { useState } from 'react';
import { X, Phone, Mail, MapPin, Copy, Check, Share2, Download, Shield } from 'lucide-react';
import { COMPANY_INFO } from '../data/companyData';
import { useOwnerPhoto } from '../hooks/useOwnerPhoto';

interface VisitingCardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VisitingCardModal: React.FC<VisitingCardModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const { photoUrl } = useOwnerPhoto();

  if (!isOpen) return null;

  const handleCopyDetails = () => {
    const cardText = 
      `Rajdeep Enterprises\n` +
      `Proprietor: ${COMPANY_INFO.contactPerson}\n` +
      `Phone: ${COMPANY_INFO.phone}, ${COMPANY_INFO.secondaryPhone}\n` +
      `Email: ${COMPANY_INFO.email}\n` +
      `Business: All Kinds of Safety Accessories & All Types of Material Suppliers\n` +
      `Address: ${COMPANY_INFO.address}`;
    navigator.clipboard.writeText(cardText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadVCard = () => {
    const vCardData = 
`BEGIN:VCARD
VERSION:3.0
FN:Raj Singh Tarkar - Rajdeep Enterprises
ORG:Rajdeep Enterprises
TITLE:Proprietor - Industrial Safety Supplies
TEL;TYPE=CELL:${COMPANY_INFO.phone}
TEL;TYPE=CELL:${COMPANY_INFO.secondaryPhone}
EMAIL;TYPE=WORK:${COMPANY_INFO.email}
ADR;TYPE=WORK:;;15/1, U.P. S.I.D.C. Complex, Refinery Main Gate;Mathura;Uttar Pradesh;281005;India
NOTE:All Kinds of Safety Accessories & All Types of Material Suppliers
END:VCARD`;

    const blob = new Blob([vCardData], { type: 'text/vcard;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Rajdeep_Enterprises_Contact.vcf');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-950 rounded-2xl border border-slate-700 shadow-2xl overflow-hidden">
        
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-slate-900 border-b border-slate-800">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
            <Shield className="w-4 h-4 text-orange-500" />
            <span>Official Business Visiting Card</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Card Canvas - Recreated faithfully from the user's photo */}
        <div className="p-6">
          <div className="relative rounded-xl bg-gradient-to-br from-[#fefce8] via-[#fef08a] to-[#fde047] p-6 sm:p-8 text-slate-900 shadow-lg border-2 border-amber-300 overflow-hidden font-sans">
            
            {/* Top row: Contact Person & Phone */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/20 pb-3 mb-4">
              <div className="flex items-center gap-3">
                <img
                  src={photoUrl}
                  alt={COMPANY_INFO.contactPerson}
                  className="w-12 h-12 rounded-full object-cover object-top border-2 border-amber-600 shadow shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h3 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 leading-tight">
                    {COMPANY_INFO.contactPerson}
                  </h3>
                  <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                    Proprietor • Rajdeep Enterprises
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 font-mono text-sm sm:text-base font-black text-emerald-800">
                <a
                  href={`tel:${COMPANY_INFO.phone}`}
                  className="hover:text-emerald-950"
                >
                  {COMPANY_INFO.phone}
                </a>
                <span className="text-slate-600">/</span>
                <a
                  href={`tel:${COMPANY_INFO.secondaryPhone}`}
                  className="hover:text-emerald-950"
                >
                  {COMPANY_INFO.secondaryPhone}
                </a>
              </div>
            </div>

            {/* Enterprise Name in bold red/dark outline style as per card */}
            <div className="text-center py-2">
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-red-600 drop-shadow-[0_1px_1px_rgba(0,0,0,0.4)]">
                Rajdeep Enterprises
              </h2>
            </div>

            {/* Email pill */}
            <div className="text-center my-3">
              <span className="inline-block bg-slate-900 text-white text-xs sm:text-sm font-semibold px-4 py-1 rounded-md shadow-sm">
                Email : <a href={`mailto:${COMPANY_INFO.email}`} className="text-amber-300 hover:underline">{COMPANY_INFO.email}</a>
              </span>
            </div>

            {/* Core tagline from card */}
            <div className="text-center my-3 font-extrabold text-slate-900 text-sm sm:text-base tracking-tight">
              {COMPANY_INFO.tagline}
            </div>

            <div className="w-full h-0.5 bg-blue-900/40 my-3"></div>

            {/* Address bar in vibrant magenta/red banner style like photo */}
            <div className="text-center text-xs sm:text-sm font-black text-pink-700 sm:text-red-700 leading-snug">
              Add.:- {COMPANY_INFO.address}
            </div>

          </div>

          {/* Action Row */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
            <a
              href={`tel:${COMPANY_INFO.phone}`}
              className="py-2.5 px-3 rounded-lg font-bold text-center bg-orange-600 hover:bg-orange-500 text-white flex items-center justify-center gap-1.5 transition"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call Direct</span>
            </a>

            <button
              onClick={handleDownloadVCard}
              className="py-2.5 px-3 rounded-lg font-bold text-center bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center justify-center gap-1.5 transition"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span>Save Contact</span>
            </button>

            <button
              onClick={handleCopyDetails}
              className="py-2.5 px-3 rounded-lg font-bold text-center bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center justify-center gap-1.5 transition"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  <span>Copy Details</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
