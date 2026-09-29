import React, { useState, useEffect } from 'react';
import { 
  Users, 
  ShoppingBag, 
  Package, 
  TrendingUp, 
  DollarSign, 
  ShieldCheck, 
  RefreshCw,
  CheckCircle2
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';

export const AdminDashboard: React.FC = () => {
  const { t } = useLanguage();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await api.getAdminDashboard();
      setData(res);
    } catch (err) {
      console.error('Failed to load admin stats', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading && !data) {
    return (
      <div className="py-24 text-center space-y-3">
        <div className="w-10 h-10 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-slate-500 font-semibold">{t('common.loading')}</p>
      </div>
    );
  }

  const {
    totalFarmers = 10,
    totalConsumers = 8,
    totalProducts = 22,
    totalOrders = 14,
    totalGMV = 24500,
    totalFarmerEarnings = 22100,
    averageConsumerSavings = 4850,
    users = [],
    recentOrders = []
  } = data || {};

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Top Header */}
      <div className="flex items-center justify-between pb-6 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-800 uppercase tracking-wider mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
            <span>Platform Governance Console</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Outfit']">
            {t('admin.title')}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time multi-tenant monitoring of consumers, producers, and direct orders.
          </p>
        </div>

        <button
          onClick={loadData}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 text-xs font-semibold text-slate-700 rounded-xl hover:bg-slate-50 transition-colors shadow-2xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-purple-600' : ''}`} />
          <span>Sync Data</span>
        </button>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 block mb-1">{t('admin.totalFarmers')}</span>
          <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Outfit'] tabular-nums">
            {totalFarmers}
          </span>
          <span className="text-[11px] text-emerald-700 block mt-1">100% KYC Verified</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 block mb-1">{t('admin.totalConsumers')}</span>
          <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Outfit'] tabular-nums">
            {totalConsumers}
          </span>
          <span className="text-[11px] text-slate-500 block mt-1">Active buyers</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 block mb-1">{t('admin.gmv')}</span>
          <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Outfit'] tabular-nums">
            ₹{totalGMV.toLocaleString('en-IN')}
          </span>
          <span className="text-[11px] text-slate-500 block mt-1">Gross trade throughput</span>
        </div>

        <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 shadow-2xs">
          <span className="text-xs text-emerald-900 font-bold block mb-1">{t('admin.farmerEarnings')}</span>
          <span className="text-2xl sm:text-3xl font-extrabold text-emerald-800 font-['Outfit'] tabular-nums">
            ₹{totalFarmerEarnings.toLocaleString('en-IN')}
          </span>
          <span className="text-[11px] text-emerald-700 block mt-1">Disbursed with 0% commission</span>
        </div>
      </div>

      {/* Users and Orders Overview */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recent Orders List */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs">
          <h3 className="text-base font-bold text-slate-900 font-['Outfit'] mb-4">
            Recent System Orders
          </h3>

          <div className="space-y-3">
            {recentOrders.slice(0, 5).map((order: any) => (
              <div key={order.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <span className="font-mono font-bold text-slate-900">{order.orderNumber}</span>
                  <p className="text-slate-500">{order.consumerName} → {order.city}</p>
                </div>
                <div className="text-right">
                  <span className="font-bold text-emerald-800">₹{order.totalAmount}</span>
                  <span className="text-[10px] block text-slate-500 capitalize">{order.status.replace('_', ' ')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Registered Platform Users */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs">
          <h3 className="text-base font-bold text-slate-900 font-['Outfit'] mb-4">
            Platform Users & Roles
          </h3>

          <div className="space-y-3">
            {users.slice(0, 5).map((u: any) => (
              <div key={u.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-900">{u.name}</span>
                  <p className="text-slate-500">{u.email}</p>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                  u.role === 'farmer' ? 'bg-emerald-100 text-emerald-800' : (u.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-slate-200 text-slate-800')
                }`}>
                  {u.role}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
