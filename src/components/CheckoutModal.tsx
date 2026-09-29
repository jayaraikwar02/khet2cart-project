import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Truck, 
  Home, 
  CreditCard, 
  Smartphone, 
  Banknote, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Order } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderSuccess: (order: Order) => void;
  selectedCity: string;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  onOrderSuccess,
  selectedCity,
}) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { items, subtotal, deliveryFee, platformFee, total, clearCart } = useCart();

  // Form Fields
  const [fullName, setFullName] = useState(user?.name || 'Pooja Agrawal');
  const [phone, setPhone] = useState(user?.phone || '+91 98930 11223');
  const [address, setAddress] = useState('Flat 402, Royal Palms, Scheme 54, Vijay Nagar');
  const [city, setCity] = useState(selectedCity || 'Indore');
  const [state, setState] = useState('Madhya Pradesh');
  const [pincode, setPincode] = useState('452010');
  const [instructions, setInstructions] = useState('Leave with building security or call on arrival.');
  const [deliveryType, setDeliveryType] = useState<'home_delivery' | 'farm_pickup'>('home_delivery');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'cod' | 'card'>('upi');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !address || !pincode) {
      setError('Please fill in all delivery details');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Create order via real backend API
      const newOrder = await api.createOrder({
        consumerName: fullName,
        consumerPhone: phone,
        address,
        city,
        state,
        pincode,
        deliveryInstructions: instructions,
        deliveryType,
        paymentMethod,
      });

      // Clear local cart
      clearCart();

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // ignore
      }

      onOrderSuccess(newOrder);
    } catch (err: any) {
      console.error('Failed to create order', err);
      setError(err.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="relative bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Title */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Farm-to-Doorstep Direct Commerce</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 font-['Outfit']">
            {t('checkout.title')}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Produce will be harvested and packed directly by verified local farmers.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Section 1: Fulfillment Mode */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
              {t('checkout.deliveryOption')}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label 
                className={`p-3.5 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                  deliveryType === 'home_delivery' 
                    ? 'border-emerald-600 bg-emerald-50/50 shadow-xs' 
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="deliveryType"
                  checked={deliveryType === 'home_delivery'}
                  onChange={() => setDeliveryType('home_delivery')}
                  className="accent-emerald-600"
                />
                <div>
                  <span className="text-xs font-bold text-slate-900 block flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5 text-emerald-700" />
                    <span>{t('checkout.homeDelivery')}</span>
                  </span>
                  <span className="text-[11px] text-slate-500">Fast direct EV dispatch (+₹30)</span>
                </div>
              </label>

              <label 
                className={`p-3.5 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                  deliveryType === 'farm_pickup' 
                    ? 'border-emerald-600 bg-emerald-50/50 shadow-xs' 
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="deliveryType"
                  checked={deliveryType === 'farm_pickup'}
                  onChange={() => setDeliveryType('farm_pickup')}
                  className="accent-emerald-600"
                />
                <div>
                  <span className="text-xs font-bold text-slate-900 block flex items-center gap-1">
                    <Home className="w-3.5 h-3.5 text-emerald-700" />
                    <span>{t('checkout.farmPickup')}</span>
                  </span>
                  <span className="text-[11px] text-slate-500">Pick up at farm gate (Free delivery)</span>
                </div>
              </label>
            </div>
          </div>

          {/* Section 2: Contact & Address */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
              {t('checkout.deliveryAddress')}
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                  {t('checkout.fullName')}
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                  {t('checkout.phone')}
                </label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                {t('checkout.address')}
              </label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600 focus:bg-white"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                  {t('checkout.city')}
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                  {t('checkout.state')}
                </label>
                <input
                  type="text"
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                  {t('checkout.pincode')}
                </label>
                <input
                  type="text"
                  required
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                {t('checkout.instructions')}
              </label>
              <input
                type="text"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600 focus:bg-white"
              />
            </div>
          </div>

          {/* Section 3: Payment Options (Simulation) */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
              {t('checkout.paymentMethod')}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <label 
                className={`p-3 rounded-xl border flex flex-col justify-between cursor-pointer transition-all ${
                  paymentMethod === 'upi'
                    ? 'border-emerald-600 bg-emerald-50/50 shadow-xs'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Smartphone className="w-4 h-4 text-emerald-700" />
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'upi'}
                    onChange={() => setPaymentMethod('upi')}
                    className="accent-emerald-600"
                  />
                </div>
                <span className="text-xs font-bold text-slate-900 block">UPI Instant</span>
                <span className="text-[10px] text-slate-500">GPay / PhonePe / Paytm</span>
              </label>

              <label 
                className={`p-3 rounded-xl border flex flex-col justify-between cursor-pointer transition-all ${
                  paymentMethod === 'cod'
                    ? 'border-emerald-600 bg-emerald-50/50 shadow-xs'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Banknote className="w-4 h-4 text-emerald-700" />
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="accent-emerald-600"
                  />
                </div>
                <span className="text-xs font-bold text-slate-900 block">Cash on Delivery</span>
                <span className="text-[10px] text-slate-500">Pay on farm arrival</span>
              </label>

              <label 
                className={`p-3 rounded-xl border flex flex-col justify-between cursor-pointer transition-all ${
                  paymentMethod === 'card'
                    ? 'border-emerald-600 bg-emerald-50/50 shadow-xs'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <CreditCard className="w-4 h-4 text-emerald-700" />
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'card'}
                    onChange={() => setPaymentMethod('card')}
                    className="accent-emerald-600"
                  />
                </div>
                <span className="text-xs font-bold text-slate-900 block">Card (Demo)</span>
                <span className="text-[10px] text-slate-500">Instant test auth</span>
              </label>
            </div>
          </div>

          {/* Section 4: Price Summary & Confirm */}
          <div className="pt-4 border-t border-slate-200 space-y-3">
            <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-xl flex items-center justify-between text-xs">
              <span className="font-semibold text-emerald-950">Farmer Guaranteed Payout:</span>
              <span className="font-extrabold text-emerald-800 text-sm tabular-nums">₹{subtotal}</span>
            </div>

            <div className="flex justify-between items-center text-sm font-bold text-slate-900">
              <span>Total Payable:</span>
              <span className="text-lg text-emerald-800 tabular-nums">
                ₹{deliveryType === 'farm_pickup' ? subtotal + platformFee : total}
              </span>
            </div>

            <button
              type="submit"
              disabled={loading || items.length === 0}
              className="w-full py-3.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-lg shadow-emerald-900/15 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <span>{t('checkout.processing')}</span>
              ) : (
                <>
                  <span>{t('checkout.placeOrder')}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
