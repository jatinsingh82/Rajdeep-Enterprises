import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Printer, 
  Upload, 
  Send, 
  Check, 
  MessageCircle, 
  Layers, 
  Eye,
  Info
} from 'lucide-react';
import { COMPANY_INFO } from '../data/companyData';

interface BrandingPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenQuoteModal: (productName?: string) => void;
}

type GearType = 'helmet' | 'vest';

interface ColorOption {
  id: string;
  name: string;
  hex: string;
  textCol: string;
  meaning: string;
}

const HELMET_COLORS: ColorOption[] = [
  { id: 'white', name: 'White', hex: '#f8fafc', textCol: '#0f172a', meaning: 'Engineers, Managers, Supervisors & VIP Visitors' },
  { id: 'yellow', name: 'Yellow', hex: '#eab308', textCol: '#0f172a', meaning: 'General Site Labor, Earthmoving, Civil Workers' },
  { id: 'blue', name: 'Blue', hex: '#2563eb', textCol: '#ffffff', meaning: 'Electricians, Instrument Technicians & Mechanics' },
  { id: 'red', name: 'Red', hex: '#dc2626', textCol: '#ffffff', meaning: 'Safety Officers, Fire Marshals & Emergency Response' },
  { id: 'green', name: 'Green', hex: '#16a34a', textCol: '#ffffff', meaning: 'Environmental Officers, First Aiders & New Trainees' }
];

const VEST_COLORS: ColorOption[] = [
  { id: 'neon-green', name: 'Fluorescent Neon Lime', hex: '#84cc16', textCol: '#0f172a', meaning: 'High-Vis Class 2 Daytime & Night Work' },
  { id: 'neon-orange', name: 'Fluorescent Safety Orange', hex: '#f97316', textCol: '#0f172a', meaning: 'Traffic Delineation & Highway Construction' }
];

export const BrandingPreviewModal: React.FC<BrandingPreviewModalProps> = ({
  isOpen,
  onClose,
  onOpenQuoteModal
}) => {
  const [gearType, setGearType] = useState<GearType>('helmet');
  const [selectedColor, setSelectedColor] = useState<ColorOption>(HELMET_COLORS[0]);
  const [companyName, setCompanyName] = useState('L&T / IOCL CONTRACTOR');
  const [tagline, setTagline] = useState('SAFETY FIRST • ZERO HARM');
  const [quantity, setQuantity] = useState('100');
  const [logoPlacement, setLogoPlacement] = useState<'front' | 'side' | 'back'>('front');
  const [uploadedLogo, setUploadedLogo] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentColors = gearType === 'helmet' ? HELMET_COLORS : VEST_COLORS;

  const handleGearChange = (type: GearType) => {
    setGearType(type);
    if (type === 'helmet') {
      setSelectedColor(HELMET_COLORS[0]);
    } else {
      setSelectedColor(VEST_COLORS[0]);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setUploadedLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSendWhatsAppCustomQuote = () => {
    let msg = `*CUSTOM BRANDED PPE ENQUIRY - RAJDEEP ENTERPRISES*\n`;
    msg += `*Gear:* ${gearType === 'helmet' ? 'Industrial Safety Helmet (IS:2925)' : 'Reflective High-Vis Safety Vest'}\n`;
    msg += `*Color:* ${selectedColor.name} (${selectedColor.hex})\n`;
    msg += `*Quantity:* ${quantity} Units\n`;
    msg += `*Company Branding Name:* ${companyName}\n`;
    if (tagline) msg += `*Slogan / Text:* ${tagline}\n`;
    msg += `*Logo Position:* ${logoPlacement.toUpperCase()}\n`;
    msg += `\nPlease provide your best quotation with screen printing / reflective branding charges and dispatch timeline anywhere in India.`;

    window.open(`https://wa.me/${COMPANY_INFO.whatsappNumber}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-4 sm:p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-orange-600 text-white px-2 py-0.5 rounded">
                  Personalized Gear
                </span>
                <span className="text-xs text-slate-400">High-Precision Screen & Heat Printing</span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-white mt-0.5">
                Custom Logo Printing & PPE Branding Studio
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

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Interactive Visual Preview (5 cols) */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center bg-gradient-to-b from-slate-100 to-slate-200 p-6 rounded-2xl border border-slate-300 relative min-h-[320px]">
            <div className="absolute top-3 left-3 text-[11px] font-bold text-slate-500 flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              <span>Live Visual Mockup</span>
            </div>

            <div className="absolute top-3 right-3 text-[10px] font-mono bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-600">
              Color: {selectedColor.name}
            </div>

            {/* SVG Interactive Render */}
            <div className="w-full max-w-xs flex flex-col items-center justify-center py-4">
              {gearType === 'helmet' ? (
                /* Industrial Helmet SVG Mockup */
                <div className="relative w-64 h-56 flex items-center justify-center">
                  <svg viewBox="0 0 200 160" className="w-full h-full drop-shadow-xl">
                    {/* Helmet Shell Crown */}
                    <path
                      d="M 25 105 C 20 40, 180 40, 175 105 C 185 108, 188 116, 170 118 C 145 120, 55 120, 30 118 C 12 116, 15 108, 25 105 Z"
                      fill={selectedColor.hex}
                      stroke="#475569"
                      strokeWidth="3"
                    />
                    {/* Ridge lines */}
                    <path
                      d="M 65 50 C 95 35, 105 35, 135 50"
                      fill="none"
                      stroke="rgba(0,0,0,0.15)"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                    <path
                      d="M 100 35 L 100 100"
                      fill="none"
                      stroke="rgba(0,0,0,0.12)"
                      strokeWidth="3"
                    />
                    {/* Helmet Brim */}
                    <path
                      d="M 20 115 C 60 125, 140 125, 180 115 C 190 120, 175 130, 100 130 C 25 130, 10 120, 20 115 Z"
                      fill={selectedColor.hex}
                      stroke="#334155"
                      strokeWidth="2.5"
                    />
                    {/* Chin strap mounts */}
                    <circle cx="45" cy="115" r="4" fill="#1e293b" />
                    <circle cx="155" cy="115" r="4" fill="#1e293b" />
                  </svg>

                  {/* Printed Logo / Text Overlay */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pt-8 pointer-events-none text-center px-6">
                    {uploadedLogo ? (
                      <img src={uploadedLogo} alt="Logo" className="max-h-10 max-w-20 object-contain mb-1 drop-shadow" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-slate-900/10 border border-slate-900/30 flex items-center justify-center mb-1">
                        <span className="text-[10px] font-black text-slate-900">LOGO</span>
                      </div>
                    )}
                    <span 
                      className="font-black text-xs tracking-tight uppercase leading-tight drop-shadow-xs max-w-[140px] truncate"
                      style={{ color: selectedColor.id === 'white' || selectedColor.id === 'yellow' ? '#0f172a' : '#ffffff' }}
                    >
                      {companyName || 'YOUR COMPANY'}
                    </span>
                    {tagline && (
                      <span 
                        className="text-[9px] font-bold tracking-wider uppercase mt-0.5 opacity-80 max-w-[140px] truncate"
                        style={{ color: selectedColor.id === 'white' || selectedColor.id === 'yellow' ? '#334155' : '#e2e8f0' }}
                      >
                        {tagline}
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                /* Reflective Safety Vest SVG Mockup */
                <div className="relative w-64 h-64 flex items-center justify-center">
                  <svg viewBox="0 0 200 220" className="w-full h-full drop-shadow-xl">
                    {/* Vest Body */}
                    <path
                      d="M 50 30 L 80 30 C 85 50, 115 50, 120 30 L 150 30 L 175 90 L 155 105 L 145 75 L 150 200 L 50 200 L 55 75 L 45 105 L 25 90 Z"
                      fill={selectedColor.hex}
                      stroke="#475569"
                      strokeWidth="2.5"
                    />
                    {/* Reflective Vertical Stripes */}
                    <rect x="70" y="30" width="16" height="170" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1" opacity="0.9" />
                    <rect x="114" y="30" width="16" height="170" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1" opacity="0.9" />
                    {/* Reflective Horizontal Stripe */}
                    <rect x="50" y="140" width="100" height="20" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1" opacity="0.9" />
                    {/* Center zipper / velcro seam */}
                    <line x1="100" y1="50" x2="100" y2="200" stroke="#1e293b" strokeWidth="2" strokeDasharray="4 2" />
                  </svg>

                  {/* Vest Branding Overlay */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pt-2 pointer-events-none text-center px-4">
                    <div className="bg-slate-900/90 text-white px-3 py-1 rounded shadow-md border border-slate-700 max-w-[150px]">
                      {uploadedLogo && (
                        <img src={uploadedLogo} alt="Logo" className="max-h-6 max-w-16 mx-auto object-contain mb-0.5" />
                      )}
                      <p className="font-black text-[10px] uppercase truncate tracking-wider">
                        {companyName || 'CONTRACTOR NAME'}
                      </p>
                      {tagline && (
                        <p className="text-[8px] text-amber-300 font-bold truncate">
                          {tagline}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-2 text-center text-[11px] text-slate-500 font-medium">
              <span>{selectedColor.meaning}</span>
            </div>
          </div>

          {/* Right Column: Customization Controls (6 cols) */}
          <div className="lg:col-span-6 space-y-4">
            
            {/* Gear Switch */}
            <div>
              <label className="block text-xs font-black text-slate-800 uppercase tracking-wider mb-2">
                1. Select Equipment to Brand:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleGearChange('helmet')}
                  className={`p-3 rounded-xl border text-left font-bold text-xs transition flex items-center justify-between ${
                    gearType === 'helmet'
                      ? 'border-orange-500 bg-orange-50 text-orange-950 ring-2 ring-orange-500/20'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div>
                    <p className="font-black">Safety Helmet (HDPE)</p>
                    <p className="text-[10px] text-slate-500 font-normal">IS:2925 Industrial Grade</p>
                  </div>
                  {gearType === 'helmet' && <Check className="w-4 h-4 text-orange-600" />}
                </button>

                <button
                  type="button"
                  onClick={() => handleGearChange('vest')}
                  className={`p-3 rounded-xl border text-left font-bold text-xs transition flex items-center justify-between ${
                    gearType === 'vest'
                      ? 'border-orange-500 bg-orange-50 text-orange-950 ring-2 ring-orange-500/20'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div>
                    <p className="font-black">Reflective Safety Vest</p>
                    <p className="text-[10px] text-slate-500 font-normal">High-Vis Class 2 Fabric</p>
                  </div>
                  {gearType === 'vest' && <Check className="w-4 h-4 text-orange-600" />}
                </button>
              </div>
            </div>

            {/* Color Swatches */}
            <div>
              <label className="block text-xs font-black text-slate-800 uppercase tracking-wider mb-1.5">
                2. Choose Shell / Fabric Color:
              </label>
              <div className="flex flex-wrap gap-2">
                {currentColors.map((color) => {
                  const isChosen = selectedColor.id === color.id;
                  return (
                    <button
                      key={color.id}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-bold transition ${
                        isChosen
                          ? 'border-orange-500 bg-white shadow-xs ring-2 ring-orange-400'
                          : 'border-slate-200 bg-slate-50 hover:bg-white text-slate-700'
                      }`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-slate-400/60 shrink-0"
                        style={{ backgroundColor: color.hex }}
                      />
                      <span>{color.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Texts & Logo Upload */}
            <div className="space-y-2.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Company / Contractor Name (Printed Text) *
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. LARSEN & TOUBRO / IOCL VENDOR"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Safety Slogan / Division
                  </label>
                  <input
                    type="text"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    placeholder="e.g. SAFETY FIRST"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Quantity Needed (Any Qty)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none font-bold"
                  />
                </div>
              </div>

              {/* Upload Logo Preview */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Upload Logo Graphic (Optional)</span>
                  {uploadedLogo && (
                    <button
                      type="button"
                      onClick={() => setUploadedLogo(null)}
                      className="text-[10px] text-red-500 underline"
                    >
                      Clear Logo
                    </button>
                  )}
                </label>
                <label className="flex items-center gap-2 px-3 py-2 border border-dashed border-slate-300 rounded-lg hover:border-orange-400 cursor-pointer bg-slate-50 transition text-xs text-slate-600">
                  <Upload className="w-4 h-4 text-orange-500 shrink-0" />
                  <span className="truncate">
                    {uploadedLogo ? 'Custom Logo Loaded (Click to replace)' : 'Click to upload PNG/JPG logo for mockup'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Print Tech Info */}
            <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-200 text-[11px] text-amber-900 flex items-start gap-2">
              <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-amber-950 font-bold">Industrial Print Durability:</strong> Weatherproof oil-resistant screen printing, micro-prismatic reflective vinyl stickers, and heat transfer. Does not degrade under high sunlight or refinery wash downs.
              </div>
            </div>

          </div>

        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-500">
            Supplying customized branded PPE across <strong className="text-slate-800">All India</strong> • Fast Turnaround
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={handleSendWhatsAppCustomQuote}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition shadow-md active:scale-95"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Get Branded PPE Quote on WhatsApp</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onOpenQuoteModal(`Custom Branded ${gearType === 'helmet' ? 'Helmets' : 'Safety Vests'} (${selectedColor.name}, Qty: ${quantity}) for ${companyName}`);
              }}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs transition shadow-md active:scale-95"
            >
              <span>Submit RFQ Form</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
