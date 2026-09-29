import React, { useState, useEffect } from 'react';
import { 
  X, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Truck, 
  Package, 
  Leaf, 
  RefreshCw,
  Phone,
  ShieldCheck
} from 'lucide-react';
import { Order, OrderStatus } from '../types';
import { api } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

interface OrderTrackingModalProps {
  order: Order | null;
  onClose: () => void;
}

const STATUS_STEPS: { status: OrderStatus; labelKey: string; descKey: string }[] = [
  { status: 'placed', labelKey: 'tracking.placed', descKey: 'tracking.placedDesc' },
  { status: 'farmer_accepted', labelKey: 'tracking.accepted', descKey: 'tracking.acceptedDesc' },
  { status: 'prepared', labelKey: 'tracking.prepared', descKey: 'tracking.preparedDesc' },
  { status: 'out_for_delivery', labelKey: 'tracking.outForDelivery', descKey: 'tracking.outForDeliveryDesc' },
  { status: 'delivered', labelKey: 'tracking.delivered', descKey: 'tracking.deliveredDesc' },
];

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  order: initialOrder,
  onClose,
}) => {
  const { t } = useLanguage();
  const [order, setOrder] = useState<Order | null>(initialOrder);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    setOrder(initialOrder);
  }, [initialOrder]);

  const refreshStatus = async () => {
    if (!order?.id) return;
    try {
      setRefreshing(true);
      const updated = await api.getOrderById(order.id);
      setOrder(updated);
    } catch (err) {
      console.error('Failed to refresh order status', err);
    } finally {
      setRefreshing(false);
    }
  };

  // Poll for status update every 4 seconds when tracking
  useEffect(() => {
    if (!order?.id || order.status === 'delivered') return;
    const interval = setInterval(refreshStatus, 4000);
    return () => clearInterval(interval);
  }, [order?.id, order?.status]);

  if (!order) return null;

  const currentStepIdx = STATUS_STEPS.findIndex((s) => s.status === order.status);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="relative bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>Direct Farm-to-Table Logistics</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-['Outfit']">
              {t('tracking.title')}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {t('tracking.orderId')}: <span className="font-mono font-bold text-slate-900">{order.orderNumber}</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={refreshStatus}
              className="p-2 rounded-xl text-slate-500 hover:text-emerald-700 hover:bg-slate-100 transition-colors"
              title="Refresh status"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-emerald-600' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Visual Map & Route Simulation Diagram */}
        <div className="my-6 p-5 rounded-2xl bg-gradient-to-r from-emerald-50/80 via-white to-amber-50/80 border border-emerald-100 relative overflow-hidden">
          <div className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider mb-4 flex items-center justify-between">
            <span>{t('tracking.simulatedRoute')}</span>
            <span className="text-slate-500 font-normal">{t('tracking.distanceEst')}</span>
          </div>

          {/* Graphical representation of the route */}
          <div className="relative py-4 flex items-center justify-between">
            {/* Animated dotted route */}
            <div className="absolute top-1/2 left-8 right-8 -translate-y-1/2 border-t-2 border-dashed border-emerald-400 -z-0" />

            {/* Farm Origin */}
            <div className="relative z-10 text-center">
              <div className="w-12 h-12 rounded-2xl bg-emerald-700 text-white flex items-center justify-center mx-auto shadow-md">
                <Leaf className="w-6 h-6" />
              </div>
              <p className="text-xs font-bold text-slate-900 mt-2">Farm Gate</p>
              <p className="text-[10px] text-slate-500">Sanwer Block A</p>
            </div>

            {/* In-Transit Vehicle Simulation Icon */}
            <div className={`relative z-10 text-center transition-all duration-500 ${
              order.status === 'out_for_delivery' || order.status === 'delivered' ? 'scale-110' : 'opacity-70'
            }`}>
              <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center mx-auto shadow-md">
                <Truck className="w-6 h-6" />
              </div>
              <p className="text-xs font-bold text-slate-900 mt-2">Transit</p>
              <p className="text-[10px] text-slate-500">EV Direct Route</p>
            </div>

            {/* Consumer Destination */}
            <div className="relative z-10 text-center">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto shadow-md ${
                order.status === 'delivered' ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
              }`}>
                <MapPin className="w-6 h-6" />
              </div>
              <p className="text-xs font-bold text-slate-900 mt-2">{order.city || 'Indore'}</p>
              <p className="text-[10px] text-slate-500">{order.pincode}</p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs">
            <span className="text-slate-600">Estimated Delivery:</span>
            <span className="font-bold text-emerald-800">{order.estimatedDelivery}</span>
          </div>
        </div>

        {/* 5-Step Order Lifecycle Progress Bar */}
        <div className="space-y-4 my-6">
          {STATUS_STEPS.map((step, idx) => {
            const isCompleted = idx <= currentStepIdx;
            const isCurrent = idx === currentStepIdx;

            return (
              <div key={step.status} className="flex items-start gap-3.5">
                {/* Status indicator line */}
                <div className="flex flex-col items-center">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                    isCompleted 
                      ? 'bg-emerald-600 text-white shadow-xs' 
                      : 'bg-slate-100 text-slate-400 border border-slate-200'
                  }`}>
                    {isCompleted ? '✓' : idx + 1}
                  </div>
                  {idx < STATUS_STEPS.length - 1 && (
                    <div className={`w-0.5 h-8 my-1 transition-colors ${
                      idx < currentStepIdx ? 'bg-emerald-500' : 'bg-slate-200'
                    }`} />
                  )}
                </div>

                {/* Text details */}
                <div className="flex-1 pb-2">
                  <div className="flex items-center justify-between">
                    <h4 className={`text-xs sm:text-sm font-bold ${
                      isCurrent ? 'text-emerald-800 font-extrabold' : (isCompleted ? 'text-slate-900' : 'text-slate-400')
                    }`}>
                      {t(step.labelKey)}
                    </h4>
                    {isCurrent && (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        Active Step
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {t(step.descKey)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Details & Farmer Note Summary */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-slate-500">Delivery Address:</span>
            <span className="font-semibold text-slate-800 text-right max-w-xs">{order.address}, {order.city}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Items Ordered:</span>
            <span className="font-semibold text-slate-800">
              {order.items?.map(i => `${i.quantity}${i.unit} ${i.productName}`).join(', ')}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Farmer Direct Payout:</span>
            <span className="font-bold text-emerald-700">₹{order.farmerEarnings} (100% of harvest)</span>
          </div>
          {order.farmerNotes && (
            <div className="pt-2 border-t border-slate-200 flex justify-between text-emerald-900 font-medium">
              <span>Farmer Harvest Note:</span>
              <span className="italic">{order.farmerNotes}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all"
          >
            Close Tracker
          </button>
        </div>

      </div>
    </div>
  );
};
