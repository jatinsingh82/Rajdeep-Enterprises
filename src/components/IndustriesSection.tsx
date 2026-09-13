import React from 'react';
import { Factory, Flame, HardHat, Package, Wrench, Building2, Store, CheckCircle } from 'lucide-react';
import { INDUSTRIES } from '../data/companyData';

interface IndustriesSectionProps {
  onEnquire: (requirement: string) => void;
}

export const IndustriesSection: React.FC<IndustriesSectionProps> = ({ onEnquire }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Factory': return Factory;
      case 'Flame': return Flame;
      case 'HardHat': return HardHat;
      case 'Package': return Package;
      case 'Wrench': return Wrench;
      case 'Building2': return Building2;
      default: return Factory;
    }
  };

  return (
    <div id="industries" className="py-4 sm:py-6 px-1 sm:px-4 w-full bg-slate-50 relative overflow-x-hidden">
      <div className="w-full">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-bold uppercase tracking-wider mb-3">
            Target Customer Segments
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Industries We Serve
          </h2>
          <div className="w-16 h-1 bg-orange-500 mx-auto mt-4 rounded-full"></div>
          <p className="mt-4 text-base text-slate-600">
            We provide targeted protective equipment, traffic accessories, and industrial materials tailored to the safety challenges of various sectors.
          </p>
        </div>

        {/* Industries Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {INDUSTRIES.map((ind) => {
            const Icon = getIcon(ind.iconName);
            return (
              <div
                key={ind.id}
                className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-orange-500 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-slate-900 text-orange-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
                    {ind.name}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {ind.description}
                  </p>

                  {/* Typical PPE supplies needed */}
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                      Key Safety Supplies:
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {ind.commonProducts.map((p, i) => (
                        <span
                          key={i}
                          className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium"
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-3">
                  <button
                    onClick={() => onEnquire(`Supplies for ${ind.name}`)}
                    className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                  >
                    <span>Request Industry Package</span>
                    <span>&rarr;</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Commercial & Small Business Support */}
        <div className="mt-10 p-6 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-100 text-orange-600 rounded-xl">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                Commercial Facilities, Contractors & Individual Workshops
              </h4>
              <p className="text-xs text-slate-500">
                Whether you need single safety kits or ongoing monthly consumables, we support all business sizes.
              </p>
            </div>
          </div>

          <button
            onClick={() => onEnquire("Commercial Business / Small Contractor Supply")}
            className="shrink-0 px-4 py-2 rounded-lg text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 transition"
          >
            Enquire for Your Business
          </button>
        </div>

      </div>
    </div>
  );
};
