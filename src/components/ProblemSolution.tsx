import React, { useState } from 'react';
import { 
  ArrowDown, 
  TrendingUp, 
  TrendingDown, 
  Sparkles, 
  HelpCircle, 
  Info,
  Check,
  X,
  AlertCircle
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const ProblemSolution: React.FC = () => {
  const { t } = useLanguage();
  const [sliderKg, setSliderKg] = useState<number>(10);

  // Math simulation for interactive visual
  // Traditional: Farmer gets ₹20/kg, Consumer pays ₹40/kg, Middlemen take ₹20/kg
  const tradFarmerIncome = 20 * sliderKg;
  const tradConsumerCost = 40 * sliderKg;
  const tradMiddlemenCut = 20 * sliderKg;

  // Khet2Cart: Farmer gets ₹30/kg, Consumer pays ₹34/kg, Logistics/Platform fee ₹4/kg
  const khetFarmerIncome = 30 * sliderKg;
  const khetConsumerCost = 34 * sliderKg;
  const khetExtraFarmer = khetFarmerIncome - tradFarmerIncome;
  const khetConsumerSaved = tradConsumerCost - khetConsumerCost;

  return (
    <section id="problem-solution" className="py-16 sm:py-20 bg-white border-y border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Problem & Solution Interactive Breakdown</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-['Outfit']">
            {t('problemSolution.title')}
          </h2>
          <p className="text-slate-600 text-base leading-relaxed">
            {t('problemSolution.subtitle')}
          </p>
        </div>

        {/* Interactive Volume Simulator */}
        <div className="mt-8 max-w-xl mx-auto bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-2">
            <span>Simulate Harvest Volume:</span>
            <span className="text-sm font-bold text-emerald-800 bg-white px-2.5 py-1 rounded-lg border border-slate-200 tabular-nums">
              {sliderKg} kg
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="100"
            value={sliderKg}
            onChange={(e) => setSliderKg(parseInt(e.target.value) || 1)}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
          />
          <div className="flex justify-between text-[11px] text-slate-400 mt-1">
            <span>1 kg</span>
            <span>25 kg</span>
            <span>50 kg</span>
            <span>100 kg</span>
          </div>
        </div>

        {/* Side-by-Side Comparison Grid */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          {/* Traditional Supply Chain Column */}
          <div className="rounded-2xl border border-rose-200/80 bg-rose-50/20 p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-rose-100">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700">Broken Legacy Model</span>
                  <h3 className="text-xl font-bold text-slate-900 mt-0.5">
                    {t('problemSolution.traditionalTitle')}
                  </h3>
                </div>
                <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-600">
                  <X className="w-5 h-5 stroke-[2.5]" />
                </div>
              </div>

              {/* Middlemen Waterfall Steps */}
              <div className="my-6 space-y-2.5 text-xs text-slate-700">
                <div className="p-3 bg-white rounded-xl border border-rose-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center font-bold text-[10px]">1</span>
                    <span className="font-semibold text-slate-900">Farmer Gate Price</span>
                  </div>
                  <span className="font-bold text-slate-700 tabular-nums">₹20 / kg (₹{tradFarmerIncome})</span>
                </div>

                <div className="flex justify-center text-rose-400 py-0.5">
                  <ArrowDown className="w-3.5 h-3.5" />
                </div>

                <div className="p-2.5 bg-rose-50/60 rounded-lg border border-rose-100/80 flex items-center justify-between text-[11px] text-slate-600">
                  <span>Village Trader (Aggregator fee)</span>
                  <span className="text-rose-700 font-semibold">+₹3 / kg</span>
                </div>

                <div className="p-2.5 bg-rose-50/60 rounded-lg border border-rose-100/80 flex items-center justify-between text-[11px] text-slate-600">
                  <span>Mandi APMC Commission Agent / Wholesaler</span>
                  <span className="text-rose-700 font-semibold">+₹6 / kg</span>
                </div>

                <div className="p-2.5 bg-rose-50/60 rounded-lg border border-rose-100/80 flex items-center justify-between text-[11px] text-slate-600">
                  <span>City Sub-Distributor & Warehouse Transport</span>
                  <span className="text-rose-700 font-semibold">+₹5 / kg</span>
                </div>

                <div className="p-2.5 bg-rose-50/60 rounded-lg border border-rose-100/80 flex items-center justify-between text-[11px] text-slate-600">
                  <span>Neighborhood Retail Vendor Markup</span>
                  <span className="text-rose-700 font-semibold">+₹6 / kg</span>
                </div>

                <div className="flex justify-center text-rose-400 py-0.5">
                  <ArrowDown className="w-3.5 h-3.5" />
                </div>

                <div className="p-3 bg-rose-100/60 rounded-xl border border-rose-200 flex items-center justify-between font-bold">
                  <div className="flex items-center gap-2 text-rose-950">
                    <span>Final Consumer Pays</span>
                  </div>
                  <span className="text-rose-900 text-sm tabular-nums">₹40 / kg (₹{tradConsumerCost})</span>
                </div>
              </div>
            </div>

            {/* Traditional Summary Metrics */}
            <div className="pt-4 border-t border-rose-100 bg-white/70 p-4 rounded-xl">
              <div className="grid grid-cols-2 gap-3 text-center text-xs">
                <div>
                  <span className="text-slate-500 block">Farmer Cut</span>
                  <span className="font-bold text-rose-700 text-sm tabular-nums">Only 50%</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Middlemen Extract</span>
                  <span className="font-bold text-rose-700 text-sm tabular-nums">₹{tradMiddlemenCut} ({sliderKg}kg)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Khet2Cart Direct Model Column */}
          <div className="rounded-2xl border-2 border-emerald-600 bg-gradient-to-b from-emerald-50/40 via-white to-white p-6 sm:p-8 flex flex-col justify-between shadow-lg shadow-emerald-900/5">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-emerald-100">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">Khet2Cart Direct Model</span>
                  <h3 className="text-xl font-bold text-slate-900 mt-0.5">
                    {t('problemSolution.khet2cartTitle')}
                  </h3>
                </div>
                <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white shadow-xs">
                  <Check className="w-5 h-5 stroke-[2.5]" />
                </div>
              </div>

              {/* Khet2Cart Direct Streamlined Steps */}
              <div className="my-6 space-y-3.5 text-xs text-slate-700">
                <div className="p-3.5 bg-emerald-100/50 rounded-xl border border-emerald-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-xs">✓</span>
                    <div>
                      <span className="font-bold text-emerald-950 block">Direct Farmer Earnings</span>
                      <span className="text-[11px] text-emerald-700">+50% higher than mandi broker rate</span>
                    </div>
                  </div>
                  <span className="font-extrabold text-emerald-800 text-sm tabular-nums">
                    ₹30 / kg (₹{khetFarmerIncome})
                  </span>
                </div>

                <div className="flex justify-center text-emerald-600 py-1">
                  <ArrowDown className="w-4 h-4" />
                </div>

                <div className="p-3 bg-white rounded-xl border border-emerald-100 flex items-center justify-between text-slate-700 shadow-2xs">
                  <div>
                    <span className="font-semibold block">Khet2Cart Transparent Logistics</span>
                    <span className="text-[11px] text-slate-500">Direct farm gate pickup & local EV route delivery</span>
                  </div>
                  <span className="font-bold text-slate-900 tabular-nums">+₹4 / kg</span>
                </div>

                <div className="flex justify-center text-emerald-600 py-1">
                  <ArrowDown className="w-4 h-4" />
                </div>

                <div className="p-3.5 bg-emerald-700 text-white rounded-xl shadow-md flex items-center justify-between">
                  <div>
                    <span className="font-bold text-sm block">Consumer Final Cost</span>
                    <span className="text-[11px] text-emerald-200">Fresh harvest &lt;12 hours from soil</span>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-extrabold tabular-nums block">₹34 / kg (₹{khetConsumerCost})</span>
                    <span className="text-[11px] text-emerald-200">Saves ₹{khetConsumerSaved} on {sliderKg}kg</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Khet2Cart Value Metrics */}
            <div className="pt-4 border-t border-emerald-100 bg-emerald-50/60 p-4 rounded-xl">
              <div className="grid grid-cols-2 gap-3 text-center text-xs">
                <div>
                  <span className="text-emerald-900 block font-medium">Extra Farmer Gain</span>
                  <span className="font-extrabold text-emerald-700 text-base tabular-nums">+₹{khetExtraFarmer}</span>
                </div>
                <div>
                  <span className="text-emerald-900 block font-medium">Consumer Discount</span>
                  <span className="font-extrabold text-emerald-700 text-base tabular-nums">-15% Cheaper</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* 4 Pillars of Transformation */}
        <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
          <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
            <TrendingUp className="w-5 h-5 text-emerald-600 mx-auto mb-1.5" />
            <span className="text-xs text-slate-500 block">{t('problemSolution.statFarmerProfit')}</span>
            <span className="text-lg font-bold text-emerald-700 tabular-nums">+50% Higher</span>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
            <TrendingDown className="w-5 h-5 text-emerald-600 mx-auto mb-1.5" />
            <span className="text-xs text-slate-500 block">{t('problemSolution.statConsumerCost')}</span>
            <span className="text-lg font-bold text-slate-900 tabular-nums">15% Less Expense</span>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
            <Sparkles className="w-5 h-5 text-emerald-600 mx-auto mb-1.5" />
            <span className="text-xs text-slate-500 block">{t('problemSolution.statTransparency')}</span>
            <span className="text-lg font-bold text-slate-900">100% Direct Payout</span>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
            <Check className="w-5 h-5 text-emerald-600 mx-auto mb-1.5" />
            <span className="text-xs text-slate-500 block">{t('problemSolution.statFreshness')}</span>
            <span className="text-lg font-bold text-emerald-700">&lt;12 Hours Old</span>
          </div>
        </div>

        {/* Mandatory Demo Disclaimer */}
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400 text-center">
          <Info className="w-4 h-4 text-slate-400 shrink-0" />
          <span>{t('problemSolution.disclaimer')}</span>
        </div>

      </div>
    </section>
  );
};
