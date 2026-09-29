import React, { useState } from 'react';
import { 
  MapPin, 
  Search, 
  ShoppingBag, 
  CreditCard, 
  Truck, 
  UserCheck, 
  FileText, 
  PlusCircle, 
  DollarSign, 
  PackageCheck, 
  BarChart3,
  CheckCircle2,
  Users
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const HowItWorks: React.FC = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'consumer' | 'farmer'>('consumer');

  const consumerSteps = [
    {
      num: '01',
      icon: MapPin,
      title: t('howItWorks.cStep1Title'),
      desc: t('howItWorks.cStep1Desc'),
    },
    {
      num: '02',
      icon: UserCheck,
      title: t('howItWorks.cStep2Title'),
      desc: t('howItWorks.cStep2Desc'),
    },
    {
      num: '03',
      icon: Search,
      title: t('howItWorks.cStep3Title'),
      desc: t('howItWorks.cStep3Desc'),
    },
    {
      num: '04',
      icon: ShoppingBag,
      title: t('howItWorks.cStep4Title'),
      desc: t('howItWorks.cStep4Desc'),
    },
    {
      num: '05',
      icon: CreditCard,
      title: t('howItWorks.cStep5Title'),
      desc: t('howItWorks.cStep5Desc'),
    },
    {
      num: '06',
      icon: Truck,
      title: t('howItWorks.cStep6Title'),
      desc: t('howItWorks.cStep6Desc'),
    },
  ];

  const farmerSteps = [
    {
      num: '01',
      icon: Users,
      title: t('howItWorks.fStep1Title'),
      desc: t('howItWorks.fStep1Desc'),
    },
    {
      num: '02',
      icon: PlusCircle,
      title: t('howItWorks.fStep2Title'),
      desc: t('howItWorks.fStep2Desc'),
    },
    {
      num: '03',
      icon: DollarSign,
      title: t('howItWorks.fStep3Title'),
      desc: t('howItWorks.fStep3Desc'),
    },
    {
      num: '04',
      icon: FileText,
      title: t('howItWorks.fStep4Title'),
      desc: t('howItWorks.fStep4Desc'),
    },
    {
      num: '05',
      icon: PackageCheck,
      title: t('howItWorks.fStep5Title'),
      desc: t('howItWorks.fStep5Desc'),
    },
    {
      num: '06',
      icon: BarChart3,
      title: t('howItWorks.fStep6Title'),
      desc: t('howItWorks.fStep6Desc'),
    },
  ];

  const currentSteps = activeTab === 'consumer' ? consumerSteps : farmerSteps;

  return (
    <section className="py-16 sm:py-20 bg-[#FAF9F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading & Interactive Tab Selector */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-['Outfit']">
            {t('howItWorks.title')}
          </h2>

          {/* Segmented Control Buttons (conforming to frontend design constitution: functional buttons, not static badges) */}
          <div className="inline-flex items-center p-1.5 bg-slate-200/70 rounded-xl">
            <button
              onClick={() => setActiveTab('consumer')}
              className={`px-5 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                activeTab === 'consumer'
                  ? 'bg-white text-emerald-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t('howItWorks.consumerTab')}
            </button>
            <button
              onClick={() => setActiveTab('farmer')}
              className={`px-5 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                activeTab === 'farmer'
                  ? 'bg-white text-emerald-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t('howItWorks.farmerTab')}
            </button>
          </div>
        </div>

        {/* 6 Step Cards Grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentSteps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="relative bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-emerald-600/30 transition-all duration-200 group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded">
                      Step {step.num}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mb-1.5 font-['Outfit']">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center gap-1.5 text-[11px] text-emerald-800 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Real-time platform sync</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
