import React from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  ShieldCheck, 
  Leaf,
  Sparkles
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: () => void;
  onExplore: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  onCheckout,
  onExplore,
}) => {
  const { t } = useLanguage();
  const { 
    items, 
    updateQuantity, 
    removeItem, 
    subtotal, 
    farmerEarnings, 
    deliveryFee, 
    platformFee, 
    total,
    itemCount,
    loading
  } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end">
      <div 
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="p-5 border-b border-slate-200/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-800">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 font-['Outfit']">
                {t('cart.title')}
              </h2>
              <span className="text-xs text-slate-500">
                {itemCount} {t('cart.itemsCount')}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">
                {t('cart.emptyTitle')}
              </h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                {t('cart.emptyDesc')}
              </p>
              <button
                onClick={() => {
                  onClose();
                  onExplore();
                }}
                className="mt-4 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all"
              >
                {t('cart.exploreCta')}
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="p-3 bg-slate-50/70 border border-slate-200/80 rounded-2xl flex items-center gap-3"
              >
                {/* Product Thumbnail */}
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-white shrink-0 border border-slate-200">
                  <img
                    src={item.product?.image || '/src/assets/images/product_tomatoes_1790693869427.jpg'}
                    alt={item.product?.name || 'Produce'}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-slate-900 truncate">
                    {item.product?.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 truncate">
                    {item.product?.farmerName} · {item.product?.village}
                  </p>
                  <p className="text-xs font-extrabold text-emerald-800 mt-1 tabular-nums">
                    ₹{item.product?.price} / {item.product?.unit}
                  </p>
                </div>

                {/* Stepper & Delete */}
                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-slate-400 hover:text-rose-500 transition-colors p-1"
                    title={t('cart.remove')}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex items-center border border-slate-200 rounded-lg bg-white overflow-hidden shadow-2xs">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="px-2 py-1 text-slate-600 hover:bg-slate-100 transition-colors"
                      aria-label="Decrease"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="px-2 text-xs font-bold text-slate-900 tabular-nums">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-2 py-1 text-slate-600 hover:bg-slate-100 transition-colors"
                      aria-label="Increase"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Price Summary & Checkout Action */}
        {items.length > 0 && (
          <div className="p-5 border-t border-slate-200 bg-slate-50/50 space-y-3">
            
            {/* Direct Farmer Benefit Highlight Box */}
            <div className="p-3 bg-emerald-100/60 rounded-xl border border-emerald-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-emerald-950 font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>₹{farmerEarnings} {t('cart.directFarmerShare')}</span>
              </div>
              <span className="text-[10px] text-emerald-700 font-semibold uppercase">100% Payout</span>
            </div>

            {/* Price Lines */}
            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>{t('cart.subtotal')}</span>
                <span className="font-semibold text-slate-800 tabular-nums">₹{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>{t('cart.deliveryFee')}</span>
                <span className="font-semibold text-slate-800 tabular-nums">₹{deliveryFee}</span>
              </div>
              <div className="flex justify-between">
                <span>{t('cart.platformFee')}</span>
                <span className="font-semibold text-slate-800 tabular-nums">₹{platformFee}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-extrabold text-slate-900">
                <span>{t('cart.total')}</span>
                <span className="text-base text-emerald-800 tabular-nums">₹{total}</span>
              </div>
            </div>

            {/* Checkout CTA */}
            <button
              onClick={() => {
                onClose();
                onCheckout();
              }}
              className="w-full py-3.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-900/15 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>{t('cart.checkoutBtn')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
