import React, { useState, useEffect } from 'react';
import { 
  X, 
  MapPin, 
  ShieldCheck, 
  Star, 
  Trophy, 
  Sprout, 
  PackageCheck, 
  Phone, 
  Calendar,
  CheckCircle2
} from 'lucide-react';
import { FarmerProfile, Product } from '../types';
import { api } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { ProductCard } from './ProductCard';

interface FarmerProfileModalProps {
  farmerId: string | null;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
}

export const FarmerProfileModal: React.FC<FarmerProfileModalProps> = ({
  farmerId,
  onClose,
  onSelectProduct,
}) => {
  const { t } = useLanguage();
  const [data, setData] = useState<{ farmer: FarmerProfile; products: Product[] } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!farmerId) return;
    async function load() {
      try {
        setLoading(true);
        const res = await api.getFarmerProfile(farmerId!);
        setData(res);
      } catch (err) {
        console.error('Failed to load farmer profile', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [farmerId]);

  if (!farmerId) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="relative bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-slate-700 flex items-center justify-center shadow-md transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {loading || !data ? (
          <div className="p-16 text-center space-y-3">
            <div className="w-10 h-10 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-slate-500 font-semibold">{t('common.loading')}</p>
          </div>
        ) : (
          <div>
            {/* Header Banner */}
            <div className="relative h-44 bg-gradient-to-r from-emerald-800 via-emerald-700 to-amber-700 p-6 flex flex-col justify-end text-white">
              <div className="absolute top-4 left-6 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold text-white">
                <ShieldCheck className="w-4 h-4 text-emerald-300" />
                <span>Khet2Cart Certified Direct Farmer</span>
              </div>
            </div>

            {/* Profile Avatar & Primary Info */}
            <div className="px-6 sm:px-8 pb-6 border-b border-slate-100 relative">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-16 sm:-mt-14 mb-4">
                <div className="flex items-end gap-4">
                  <div className="relative w-28 h-28 rounded-2xl overflow-hidden border-4 border-white shadow-xl bg-slate-100 shrink-0">
                    <img
                      src={data.farmer.avatar || '/src/assets/images/farmer_ramesh_1790693914260.jpg'}
                      alt={data.farmer.farmerName}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-2xl font-extrabold text-slate-900 font-['Outfit']">
                        {data.farmer.farmerName}
                      </h2>
                      <span title="Verified Producer" className="flex items-center">
                        <ShieldCheck className="w-5 h-5 text-emerald-600" />
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{data.farmer.village}, {data.farmer.district} ({data.farmer.state})</span>
                    </div>
                  </div>
                </div>

                {/* Rating Badge */}
                <div className="flex items-center gap-3">
                  <div className="px-3.5 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
                    <div className="flex items-center gap-1 text-emerald-800 font-extrabold text-sm justify-center">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span>{data.farmer.rating}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-medium">Customer Score</span>
                  </div>

                  <div className="px-3.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
                    <div className="font-extrabold text-slate-900 text-sm">
                      {data.farmer.totalOrders}+
                    </div>
                    <span className="text-[10px] text-slate-500 font-medium">Orders Fulfilled</span>
                  </div>
                </div>
              </div>

              {/* Farmer Bio */}
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl">
                {data.farmer.bio}
              </p>

              {/* Key Farm Details Grid */}
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-xs">
                  <span className="text-slate-400 block text-[11px]">Farm Size</span>
                  <span className="font-bold text-slate-900">{data.farmer.farmSize}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-xs">
                  <span className="text-slate-400 block text-[11px]">Farming Experience</span>
                  <span className="font-bold text-slate-900">{data.farmer.yearsOfFarming} Years</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-xs">
                  <span className="text-slate-400 block text-[11px]">Direct Dispatch</span>
                  <span className="font-bold text-emerald-700">Same-Day Harvest</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-xs">
                  <span className="text-slate-400 block text-[11px]">Chemical Policy</span>
                  <span className="font-bold text-emerald-700">Pesticide Free</span>
                </div>
              </div>
            </div>

            {/* Farm Produce Listings */}
            <div className="p-6 sm:p-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-900 font-['Outfit']">
                  Fresh Produce from {data.farmer.farmerName}
                </h3>
                <span className="text-xs font-semibold text-slate-500">
                  {data.products.length} live crops
                </span>
              </div>

              {data.products.length === 0 ? (
                <p className="text-xs text-slate-500 py-6 text-center">
                  No active harvest listings currently published.
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {data.products.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onSelectProduct={(p) => {
                        onClose();
                        onSelectProduct(p);
                      }}
                      onSelectFarmer={() => {}}
                    />
                  ))}
                </div>
              )}
            </div>

          </div>
        )}
      </div>
    </div>
  );
};
