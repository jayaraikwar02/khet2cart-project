import React from 'react';
import { Sprout, ShieldCheck, Heart, Leaf } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 pb-8 border-b border-slate-800">
          
          {/* Brand & Mission */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
                <Sprout className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white font-['Outfit']">
                Khet<span className="text-emerald-400">2</span>Cart
              </span>
            </div>
            <p className="text-xs text-emerald-400 font-semibold uppercase tracking-wider">
              {t('tagline')}
            </p>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              Direct digital agricultural commerce connecting smallholder farmers directly with city households to dismantle extortionate intermediary chains.
            </p>
          </div>

          {/* Quick Hub Links */}
          <div className="space-y-2 text-xs">
            <span className="font-bold text-white uppercase tracking-wider block mb-2">Agricultural Hubs</span>
            <ul className="space-y-1.5 text-slate-400">
              <li>Indore · Malwa Black Soil Cluster</li>
              <li>Sanwer · Organic Vegetable Belt</li>
              <li>Dewas · Grains & Pulses Region</li>
              <li>Khargone · Nimar Chilli & Spices</li>
              <li>Ujjain · Traditional Sharbati Wheat</li>
            </ul>
          </div>

          {/* Direct Model Commitments */}
          <div className="space-y-2 text-xs">
            <span className="font-bold text-white uppercase tracking-wider block mb-2">Platform Standards</span>
            <ul className="space-y-1.5 text-slate-400">
              <li>✓ 0% Middlemen Commission</li>
              <li>✓ 100% Direct Farmer Payout</li>
              <li>✓ Morning Same-Day Soil Harvest</li>
              <li>✓ Transparent Fair Price Benchmarking</li>
              <li>✓ Multi-Regional Indian Languages</li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Khet2Cart · Smart India Agricultural Initiative</p>
          <p className="text-slate-400 flex items-center gap-1">
            Empowering Indian Kisans from soil to doorstep
          </p>
        </div>

      </div>
    </footer>
  );
};
