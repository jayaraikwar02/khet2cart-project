import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  MapPin, 
  Sparkles, 
  TrendingUp, 
  ShieldCheck, 
  Leaf, 
  ShoppingCart,
  CheckCircle2,
  Clock,
  Coins
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface HeroProps {
  onShopClick: () => void;
  onFarmerClick: () => void;
  selectedCity: string;
  setSelectedCity: (city: string) => void;
}

const LIVE_TICKERS = [
  { icon: '🌾', textKey: 'hero.liveFarmerSold', fallback: 'Ramesh Farm just sold 15 kg tomatoes' },
  { icon: '🥕', textKey: 'hero.liveCarrots', fallback: 'Fresh carrots available 3.2 km away' },
  { icon: '💰', textKey: 'hero.liveEarnings', fallback: 'Farmer earnings increased by ₹240' },
  { icon: '📦', textKey: '', fallback: 'Anita Dhakad dispatched fresh chillies to Indore' },
];

export const Hero: React.FC<HeroProps> = ({
  onShopClick,
  onFarmerClick,
  selectedCity,
}) => {
  const { t } = useLanguage();
  const [tickerIndex, setTickerIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % LIVE_TICKERS.length);
    }, 3800);
    return () => clearInterval(timer);
  }, []);

  const currentTicker = LIVE_TICKERS[tickerIndex];

  return (
    <div className="relative overflow-hidden pt-6 pb-16 lg:pt-12 lg:pb-24">
      {/* Background soft agricultural ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-emerald-100/40 via-amber-50/30 to-transparent pointer-events-none -z-10 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Live Marketplace Activity Ticker */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-emerald-900/5 border border-emerald-800/15 text-xs text-emerald-900 font-medium shadow-xs transition-all duration-300">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
            </span>
            <span className="text-sm">{currentTicker.icon}</span>
            <span className="tabular-nums">
              {currentTicker.textKey ? t(currentTicker.textKey) : currentTicker.fallback}
            </span>
          </div>
        </div>

        {/* Main Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Mission, Typography, Actions */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-800">
              <Leaf className="w-3.5 h-3.5 text-emerald-600" />
              <span>{t('tagline')}</span>
              <span className="text-slate-300">·</span>
              <span className="text-slate-500 font-normal">Smart Agricultural Marketplace</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15] font-['Outfit']">
              {t('hero.headline')}
            </h1>

            {/* Subheadline */}
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              {t('hero.subheadline')}
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <button
                onClick={onShopClick}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-sm shadow-md shadow-emerald-900/15 hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>{t('hero.ctaShop')}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onFarmerClick}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-semibold text-sm border border-slate-300 hover:border-emerald-600 transition-all duration-200 shadow-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <Leaf className="w-4 h-4 text-emerald-600" />
                <span>{t('hero.ctaFarmer')}</span>
              </button>
            </div>

            {/* Key Value Trust Indicators */}
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-y-2 gap-x-6 text-xs text-slate-600">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Zero Middlemen Fees</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-emerald-600" />
                <span>Harvested &lt;12h Ago</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Coins className="w-4 h-4 text-emerald-600" />
                <span>100% Direct Farmer Payout</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual - Farm Field transforming into Shopping Cart with direct route */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Main Card with Split Visual Concept */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-emerald-950/10 bg-white">
                
                {/* Hero Photo / Farmland Graphic */}
                <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-slate-100">
                  <img
                    src="/src/assets/images/hero_field_produce_1790693856456.jpg"
                    alt="Indian Farmland Harvest"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  
                  {/* Floating Overlay Badge on Image */}
                  <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-emerald-300 font-semibold">Origin Point</p>
                      <p className="text-sm font-bold">Sanwer Organic Farm Cluster</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-200">Direct Distance</p>
                      <p className="text-sm font-bold text-amber-300">4.2 km to {selectedCity}</p>
                    </div>
                  </div>
                </div>

                {/* Direct Transformation Flow: Farm -> Khet2Cart -> Cart */}
                <div className="p-5 bg-white space-y-4">
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center justify-between">
                    <span>Direct Agricultural Route</span>
                    <span className="text-emerald-700 font-bold">Live Simulation</span>
                  </div>

                  {/* Route Steps */}
                  <div className="relative flex items-center justify-between">
                    {/* Connecting dotted line */}
                    <div className="absolute top-1/2 left-6 right-6 -translate-y-1/2 border-t-2 border-dashed border-emerald-300 -z-0" />

                    {/* Node 1: Farm */}
                    <div className="relative z-10 flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 border-2 border-emerald-600 flex items-center justify-center text-emerald-800 shadow-sm">
                        <Leaf className="w-5 h-5" />
                      </div>
                      <span className="text-[11px] font-bold text-slate-800 mt-1.5">Khet (खेत)</span>
                      <span className="text-[10px] text-slate-500">Soil Harvest</span>
                    </div>

                    {/* Node 2: Khet2Cart Platform */}
                    <div className="relative z-10 flex flex-col items-center">
                      <div className="w-11 h-11 rounded-full bg-emerald-600 border-2 border-white flex items-center justify-center text-white shadow-md">
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <span className="text-[11px] font-bold text-emerald-800 mt-1.5">Khet2Cart</span>
                      <span className="text-[10px] text-emerald-600 font-semibold">Direct Route</span>
                    </div>

                    {/* Node 3: Consumer Cart */}
                    <div className="relative z-10 flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-amber-100 border-2 border-amber-600 flex items-center justify-center text-amber-800 shadow-sm">
                        <ShoppingCart className="w-5 h-5" />
                      </div>
                      <span className="text-[11px] font-bold text-slate-800 mt-1.5">Cart (थाली)</span>
                      <span className="text-[10px] text-slate-500">Fresh Table</span>
                    </div>
                  </div>

                  {/* Price Impact Preview Box */}
                  <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-100 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-slate-600 block">Farmer Earns</span>
                      <span className="text-sm font-bold text-emerald-800">₹30/kg (+50%)</span>
                    </div>
                    <div className="h-6 w-px bg-emerald-200" />
                    <div>
                      <span className="text-slate-600 block">You Pay</span>
                      <span className="text-sm font-bold text-slate-900">₹34/kg (-15%)</span>
                    </div>
                    <div className="h-6 w-px bg-emerald-200" />
                    <div>
                      <span className="text-slate-600 block">Middlemen Cut</span>
                      <span className="text-sm font-bold text-rose-600">₹0</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Verified Quality Tag Floating on side */}
              <div className="absolute -top-3 -right-3 bg-white px-3 py-1.5 rounded-xl shadow-lg border border-slate-100 flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>100% Verified Growers</span>
              </div>
            </div>
          </div>
        </div>

        {/* Metrics Counter Section */}
        <div className="mt-16 pt-8 border-t border-slate-200/80">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            
            <div className="p-4 rounded-xl bg-white/70 border border-slate-200/60 shadow-2xs">
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Outfit'] tabular-nums">
                148+
              </p>
              <p className="text-xs text-slate-500 font-medium mt-1">
                {t('metrics.farmersConnected')}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white/70 border border-slate-200/60 shadow-2xs">
              <p className="text-2xl sm:text-3xl font-extrabold text-emerald-700 font-['Outfit'] tabular-nums">
                2,840+
              </p>
              <p className="text-xs text-slate-500 font-medium mt-1">
                {t('metrics.ordersDelivered')}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white/70 border border-slate-200/60 shadow-2xs">
              <p className="text-2xl sm:text-3xl font-extrabold text-amber-700 font-['Outfit'] tabular-nums">
                ₹4,12,000+
              </p>
              <p className="text-xs text-slate-500 font-medium mt-1">
                {t('metrics.consumerSavings')}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white/70 border border-slate-200/60 shadow-2xs">
              <p className="text-2xl sm:text-3xl font-extrabold text-emerald-800 font-['Outfit'] tabular-nums">
                ₹18,50,000+
              </p>
              <p className="text-xs text-slate-500 font-medium mt-1">
                {t('metrics.farmerEarnings')}
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
