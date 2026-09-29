import React, { useState } from 'react';
import { 
  Plus, 
  Check, 
  MapPin, 
  ShieldCheck, 
  Sparkles, 
  Leaf, 
  Clock, 
  User,
  Heart
} from 'lucide-react';
import { Product } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
  onSelectProduct: (product: Product) => void;
  onSelectFarmer: (farmerId: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelectProduct,
  onSelectFarmer,
}) => {
  const { t } = useLanguage();
  const { addToCart } = useCart();
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const handleAdd = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      setAdding(true);
      await addToCart(product.id, 1);
      setAdded(true);
      setTimeout(() => setAdded(false), 1600);
    } catch (err) {
      console.error(err);
    } finally {
      setAdding(false);
    }
  };

  // Farmer receives estimate: 100% of produce price goes directly to farmer
  const farmerReceives = product.price;
  const consumerTotalEst = product.price;

  return (
    <div
      onClick={() => onSelectProduct(product)}
      className="group relative bg-white rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-lg hover:border-emerald-600/40 transition-all duration-200 flex flex-col justify-between overflow-hidden cursor-pointer"
    >
      <div>
        {/* Product Image Slot with Fallback Container */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
          {!imgError ? (
            <img
              src={product.image}
              alt={product.name}
              referrerPolicy="no-referrer"
              onError={() => setImgError(true)}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-emerald-50 to-amber-50 text-emerald-800 p-4">
              <Leaf className="w-10 h-10 mb-2 opacity-60 text-emerald-600" />
              <span className="text-xs font-semibold text-center">{product.name}</span>
            </div>
          )}

          {/* Top badges bar (Clean, non-pill subtle tags) */}
          <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
            {product.organic ? (
              <span className="px-2 py-0.5 rounded-md bg-emerald-800/90 backdrop-blur-xs text-white text-[10px] font-bold tracking-wide uppercase flex items-center gap-1 shadow-xs">
                <Leaf className="w-3 h-3 text-emerald-300" />
                <span>Organic</span>
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-md bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-semibold tracking-wide">
                Direct Harvest
              </span>
            )}

            <span className="px-2 py-0.5 rounded-md bg-white/95 backdrop-blur-xs text-emerald-900 text-[10px] font-bold tracking-tight shadow-xs tabular-nums flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>{product.freshnessScore}% Fresh</span>
            </span>
          </div>

          {/* Distance Indicator floating on bottom corner */}
          <div className="absolute bottom-2 left-2.5 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-white text-[10px] font-medium flex items-center gap-1">
            <MapPin className="w-3 h-3 text-emerald-400" />
            <span className="tabular-nums">{product.distanceKm || 4.2} km away</span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 space-y-2">
          
          {/* Category & Harvest Time unboxed text with typographic separator */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <span className="font-medium text-emerald-700">{product.category}</span>
            <span aria-hidden="true">·</span>
            <span>Harvested {product.harvestDate}</span>
          </div>

          {/* Product Title */}
          <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-1 font-['Outfit']">
            {product.name}
          </h3>

          {/* Farmer & Village line (Clickable to view farm profile) */}
          <div 
            onClick={(e) => {
              e.stopPropagation();
              onSelectFarmer(product.farmerId);
            }}
            className="flex items-center justify-between text-xs text-slate-600 hover:text-emerald-700 transition-colors pt-0.5"
          >
            <div className="flex items-center gap-1.5 truncate">
              <User className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="font-semibold text-slate-800 hover:underline truncate">
                {product.farmerName}
              </span>
              <span className="text-slate-400">·</span>
              <span className="text-slate-500 truncate">{product.village}</span>
            </div>
            <span title="Verified Producer" className="shrink-0 flex items-center">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            </span>
          </div>

          {/* Farmer receives USP highlight box */}
          <div className="mt-2.5 p-2 rounded-lg bg-emerald-50/70 border border-emerald-100 text-[11px] text-emerald-950 font-medium">
            <span>
              {t('marketplace.farmerReceivesNote', {
                amount: `₹${farmerReceives}`,
                total: `₹${consumerTotalEst}`
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Footer Price & Add Action */}
      <div className="p-4 pt-0">
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-extrabold text-slate-900 tabular-nums">
                ₹{product.price}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                / {product.unit}
              </span>
            </div>
            {product.benchmarkPrice && (
              <span className="text-[11px] text-slate-400 line-through tabular-nums">
                Mandi: ₹{product.benchmarkPrice}
              </span>
            )}
          </div>

          {/* Functional Add to Cart Button */}
          <button
            onClick={handleAdd}
            disabled={adding}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-150 flex items-center gap-1.5 shadow-xs cursor-pointer ${
              added
                ? 'bg-emerald-600 text-white shadow-emerald-900/10'
                : 'bg-emerald-700 hover:bg-emerald-800 text-white'
            }`}
          >
            {added ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added!</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>{t('marketplace.addToCart')}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
