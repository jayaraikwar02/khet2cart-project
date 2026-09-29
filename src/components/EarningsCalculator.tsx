import React, { useState } from 'react';
import { 
  X, 
  Calculator, 
  TrendingUp, 
  Sparkles, 
  Info, 
  CheckCircle2,
  DollarSign
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface EarningsCalculatorProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRESETS = [
  { name: 'Tomato (टमाटर)', trad: 20, khet: 30, qty: 500 },
  { name: 'Wheat (गेहूं)', trad: 32, khet: 44, qty: 1200 },
  { name: 'Potato (आलू)', trad: 16, khet: 26, qty: 800 },
  { name: 'Soybean (सोयाबीन)', trad: 38, khet: 52, qty: 1000 },
  { name: 'Mango (आम)', trad: 80, khet: 140, qty: 400 },
];

export const EarningsCalculator: React.FC<EarningsCalculatorProps> = ({ isOpen, onClose }) => {
  const { t } = useLanguage();

  const [tradPrice, setTradPrice] = useState<number>(20);
  const [khetPrice, setKhetPrice] = useState<number>(30);
  const [quantity, setQuantity] = useState<number>(500);

  if (!isOpen) return null;

  const tradIncome = tradPrice * quantity;
  const khetIncome = khetPrice * quantity;
  const extraGain = khetIncome - tradIncome;
  const percentGain = tradIncome > 0 ? Math.round((extraGain / tradIncome) * 100) : 50;

  const applyPreset = (preset: typeof PRESETS[0]) => {
    setTradPrice(preset.trad);
    setKhetPrice(preset.khet);
    setQuantity(preset.qty);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="relative bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-slate-100 p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">
            <Calculator className="w-3.5 h-3.5 text-emerald-600" />
            <span>Middleman Elimination Simulator</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 font-['Outfit']">
            {t('calculator.title')}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {t('calculator.subtitle')}
          </p>
        </div>

        {/* Quick Presets */}
        <div className="mb-6">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-2">
            Sample Crop Presets:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {PRESETS.map((p) => (
              <button
                key={p.name}
                onClick={() => applyPreset(p)}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-50 text-[11px] font-medium text-slate-700 hover:text-emerald-800 transition-colors cursor-pointer"
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>

        {/* Calculation Inputs */}
        <div className="space-y-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
          <div>
            <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
              <span>{t('calculator.traditionalPrice')}</span>
              <span className="text-rose-700 tabular-nums">₹{tradPrice}/kg</span>
            </div>
            <input
              type="number"
              min="1"
              value={tradPrice}
              onChange={(e) => setTradPrice(Math.max(1, Number(e.target.value)))}
              className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
              <span>{t('calculator.khet2cartPrice')}</span>
              <span className="text-emerald-700 tabular-nums">₹{khetPrice}/kg</span>
            </div>
            <input
              type="number"
              min="1"
              value={khetPrice}
              onChange={(e) => setKhetPrice(Math.max(1, Number(e.target.value)))}
              className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
              <span>{t('calculator.quantity')}</span>
              <span className="text-slate-900 tabular-nums">{quantity} kg</span>
            </div>
            <input
              type="number"
              min="10"
              step="50"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
              className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600"
            />
          </div>
        </div>

        {/* Results Comparison Grid */}
        <div className="mt-6 grid grid-cols-2 gap-3 text-center">
          <div className="p-4 bg-rose-50/60 rounded-xl border border-rose-200">
            <span className="text-xs text-rose-800 block">{t('calculator.traditionalIncome')}</span>
            <span className="text-xl font-bold text-rose-900 tabular-nums">
              ₹{tradIncome.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
            <span className="text-xs text-emerald-800 block">{t('calculator.khet2cartIncome')}</span>
            <span className="text-xl font-extrabold text-emerald-800 tabular-nums">
              ₹{khetIncome.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Highlight Result Callout */}
        <div className="mt-4 p-4 bg-emerald-700 text-white rounded-2xl shadow-md text-center space-y-1">
          <span className="text-xs uppercase tracking-wider text-emerald-200 font-semibold block">
            {t('calculator.badgeProtection')}
          </span>
          <p className="text-2xl sm:text-3xl font-extrabold tabular-nums">
            +₹{extraGain.toLocaleString('en-IN')}
          </p>
          <p className="text-xs text-emerald-100">
            With Khet2Cart, you could earn <span className="font-bold text-white">+{percentGain}% more income</span> directly from consumers.
          </p>
        </div>

        <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-slate-400 text-center">
          <Info className="w-3.5 h-3.5 shrink-0" />
          <span>*Calculations are for educational and hackathon demonstration estimates.</span>
        </div>

      </div>
    </div>
  );
};
