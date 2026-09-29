import React, { useState } from 'react';
import { 
  X, 
  Plus, 
  Minus, 
  ShoppingCart, 
  MapPin, 
  ShieldCheck, 
  Sparkles, 
  Leaf, 
  Clock, 
  Calendar, 
  Check,
  UserCheck
} from 'lucide-react';
import { Product, FarmerProfile } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onOpenFarmer: (farmerId: string) => void;
  onBuyNow: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onOpenFarmer,
  onBuyNow,
}) => {
  const { t } = useLanguage();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [imgError, setImgError] = useState(false);

  if (!product) return null;

  const handleAdd = async () => {
    try {
      setAdding(true);
      await addToCart(product.id, quantity);
      setAdded(true);
      setTimeout(() => setAdded(false), 1600);
    } catch (err) {
      console.error(err);
    } finally {
      setAdding(false);
    }
  };

  const handleBuyNow = async () => {
    try {
      setAdding(true);
      await addToCart(product.id, quantity);
      onBuyNow();
    } catch (err) {
      console.error(err);
    } finally {
      setAdding(false);
    }
  };

  const totalCost = product.price * quantity;
  const farmerReceives = totalCost; // 100% of produce price goes directly to farmer

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="relative bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200"
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

        <div className="grid grid-cols-1 md:grid-cols-2">
          
          {/* Left: Product Image */}
          <div className="relative aspect-square md:aspect-auto w-full h-full bg-slate-100">
            {!imgError ? (
              <img
                src={product.image}
                alt={product.name}
                referrerPolicy="no-referrer"
                onError={() => setImgError(true)}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-6 text-emerald-800 bg-emerald-50">
                <Leaf className="w-16 h-16 mb-2 opacity-50" />
                <span className="text-sm font-bold text-center">{product.name}</span>
              </div>
            )}

            {/* Badges on image */}
            <div className="absolute top-4 left-4 flex flex-col gap-1.5 pointer-events-none">
              {product.organic && (
                <span className="px-2.5 py-1 rounded-md bg-emerald-800 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1 shadow-md">
                  <Leaf className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Certified Organic</span>
                </span>
              )}
              <span className="px-2.5 py-1 rounded-md bg-white/95 text-emerald-900 text-xs font-bold tracking-tight shadow-md flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>{product.freshnessScore}% Farm Fresh</span>
              </span>
            </div>

            <div className="absolute bottom-4 left-4 px-3 py-1 rounded-md bg-black/70 text-white text-xs font-medium flex items-center gap-1.5 backdrop-blur-xs">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>{product.distanceKm || 4.2} km from your door</span>
            </div>
          </div>

          {/* Right: Product Details & Purchase Module */}
          <div className="p-6 md:p-7 flex flex-col justify-between space-y-4">
            <div>
              {/* Category & Status */}
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
                <span className="font-semibold text-emerald-700 uppercase tracking-wider">
                  {product.category}
                </span>
                <span className="tabular-nums">Stock: {product.quantity} {product.unit} available</span>
              </div>

              {/* Title */}
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug font-['Outfit']">
                {product.name}
              </h2>

              {/* Pricing Display */}
              <div className="mt-2.5 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-slate-900 tabular-nums">
                  ₹{product.price}
                </span>
                <span className="text-xs font-semibold text-slate-500">
                  per {product.unit}
                </span>
                {product.benchmarkPrice && (
                  <span className="text-xs text-slate-400 line-through tabular-nums ml-1">
                    Mandi ₹{product.benchmarkPrice}
                  </span>
                )}
              </div>

              {/* USP Highlight Callout: Direct Farmer Receipt */}
              <div className="mt-3.5 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950">
                <div className="flex items-center gap-1.5 font-bold text-emerald-800 mb-0.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Khet2Cart Direct Pricing USP</span>
                </div>
                <p className="leading-relaxed">
                  {t('marketplace.farmerReceivesNote', {
                    amount: `₹${farmerReceives}`,
                    total: `₹${totalCost}`
                  })}
                </p>
              </div>

              {/* Farmer Info Card with click to profile */}
              <div 
                onClick={() => onOpenFarmer(product.farmerId)}
                className="mt-4 p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-emerald-50/50 hover:border-emerald-300 transition-all cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-800 font-bold text-sm">
                    {product.farmerName.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-bold text-slate-900">{product.farmerName}</span>
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    </div>
                    <span className="text-[11px] text-slate-500">{product.village}, {product.district}</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-700 hover:underline">
                  {t('common.viewProfile')} →
                </span>
              </div>

              {/* Metadata Details */}
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-600">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Harvest: {product.harvestDate}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Clean Sort & Dispatch &lt;4h</span>
                </div>
              </div>

              {/* Description */}
              <p className="mt-3 text-xs text-slate-600 line-clamp-3 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Quantity Stepper & Actions */}
            <div className="pt-3 border-t border-slate-100 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">Quantity ({product.unit}):</span>
                <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1.5 hover:bg-slate-200 text-slate-700 transition-colors"
                    aria-label="Decrease"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-4 text-xs font-extrabold text-slate-900 tabular-nums">
                    {quantity} {product.unit}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-1.5 hover:bg-slate-200 text-slate-700 transition-colors"
                    aria-label="Increase"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  onClick={handleAdd}
                  disabled={adding}
                  className="w-full py-2.5 px-4 rounded-xl border border-emerald-700 text-emerald-800 hover:bg-emerald-50 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {added ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-700" />
                      <span>Added to Cart!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4 text-emerald-700" />
                      <span>{t('marketplace.addToCart')}</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={adding}
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all shadow-md shadow-emerald-900/10 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Buy Now (₹{totalCost})</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
