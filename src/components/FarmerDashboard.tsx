import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  PlusCircle, 
  TrendingUp, 
  DollarSign, 
  ShoppingBag, 
  CheckCircle2, 
  Clock, 
  Check, 
  AlertCircle,
  Truck,
  Leaf,
  ShieldCheck,
  RefreshCw,
  Calculator
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Order, Product, OrderStatus } from '../types';

interface FarmerDashboardProps {
  onOpenCalculator: () => void;
}

export const FarmerDashboard: React.FC<FarmerDashboardProps> = ({ onOpenCalculator }) => {
  const { t } = useLanguage();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'products' | 'add-product' | 'earnings'>('overview');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Add Product Form State
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState<'Vegetables' | 'Fruits' | 'Grains' | 'Pulses' | 'Spices' | 'Dairy'>('Vegetables');
  const [newProdPrice, setNewProdPrice] = useState<number>(30);
  const [newProdQuantity, setNewProdQuantity] = useState<number>(50);
  const [newProdUnit, setNewProdUnit] = useState<string>('kg');
  const [newProdOrganic, setNewProdOrganic] = useState<boolean>(true);
  const [newProdDescription, setNewProdDescription] = useState<string>('');
  const [submittingProduct, setSubmittingProduct] = useState(false);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const res = await api.getFarmerDashboard();
      setData(res);
    } catch (err) {
      console.error('Failed to load farmer dashboard', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const handleUpdateStatus = async (orderId: string, status: OrderStatus) => {
    try {
      setUpdatingOrderId(orderId);
      await api.updateOrderStatus(orderId, status, 'Farmer verified quality and updated status.');
      setSuccessToast(t('farmerDashboard.statusUpdated'));
      setTimeout(() => setSuccessToast(null), 3000);
      await loadDashboard();
    } catch (err) {
      console.error('Failed to update order status', err);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName || !newProdPrice || !newProdQuantity) return;

    try {
      setSubmittingProduct(true);
      await api.createProduct({
        name: newProdName,
        category: newProdCategory,
        price: Number(newProdPrice),
        quantity: Number(newProdQuantity),
        unit: newProdUnit,
        organic: newProdOrganic,
        description: newProdDescription || 'Fresh morning harvest straight from our farm.',
        harvestDate: new Date().toISOString().split('T')[0],
      });

      setSuccessToast('New produce successfully listed on Khet2Cart marketplace!');
      setTimeout(() => setSuccessToast(null), 3500);

      // Reset form
      setNewProdName('');
      setNewProdDescription('');
      setActiveTab('products');
      await loadDashboard();
    } catch (err) {
      console.error('Failed to add product', err);
    } finally {
      setSubmittingProduct(false);
    }
  };

  if (loading && !data) {
    return (
      <div className="py-24 text-center space-y-3">
        <div className="w-10 h-10 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-slate-500 font-semibold">{t('common.loading')}</p>
      </div>
    );
  }

  const stats = data?.stats || {
    todaysOrders: 3,
    pendingOrders: 1,
    totalSales: 3840,
    farmerEarnings: 3840,
    thisMonth: 10752,
    thisWeek: 3840,
    protectedSavings: 1344
  };

  const orders: Order[] = data?.recentOrders || [];
  const products: Product[] = data?.myProducts || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Toast alert */}
      {successToast && (
        <div className="fixed top-24 right-6 z-50 bg-emerald-800 text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 text-xs font-bold animate-in fade-in slide-in-from-top-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-300" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Dashboard Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Verified Producer Console</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Outfit']">
            {t('farmerDashboard.title')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {t('farmerDashboard.greeting')} ({user?.village || 'Sanwer, Indore'})
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenCalculator}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-xs font-bold rounded-xl border border-emerald-200 transition-colors"
          >
            <Calculator className="w-4 h-4 text-emerald-700" />
            <span>Earnings Calculator</span>
          </button>

          <button
            onClick={() => setActiveTab('add-product')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{t('farmerDashboard.addProduct')}</span>
          </button>
        </div>
      </div>

      {/* 4 Stat Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium text-slate-500">{t('farmerDashboard.todaysOrders')}</span>
            <ShoppingBag className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Outfit'] tabular-nums">
            {stats.todaysOrders}
          </p>
          <span className="text-[11px] text-emerald-700 font-medium">Harvest queued for dispatch</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium text-slate-500">{t('farmerDashboard.pendingOrders')}</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-amber-700 font-['Outfit'] tabular-nums">
            {stats.pendingOrders}
          </p>
          <span className="text-[11px] text-slate-500">Requires packing or confirmation</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium text-slate-500">{t('farmerDashboard.farmerEarnings')}</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-emerald-800 font-['Outfit'] tabular-nums">
            ₹{stats.farmerEarnings}
          </p>
          <span className="text-[11px] text-emerald-700 font-medium">100% Direct Payout</span>
        </div>

        <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 shadow-2xs">
          <div className="flex items-center justify-between text-emerald-800 mb-2">
            <span className="text-xs font-bold">Middleman Protection</span>
            <TrendingUp className="w-4 h-4 text-emerald-700" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-emerald-900 font-['Outfit'] tabular-nums">
            +₹{stats.protectedSavings}
          </p>
          <span className="text-[11px] text-emerald-800 font-semibold">Earned above mandi broker rates</span>
        </div>
      </div>

      {/* Navigation Tabs (Functional segmented controls) */}
      <div className="mt-8 flex items-center gap-1.5 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'overview'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          {t('nav.dashboard')}
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'orders'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <span>{t('farmerDashboard.orders')}</span>
          <span className="px-1.5 py-0.2 rounded-full bg-emerald-700 text-white text-[10px]">
            {orders.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'products'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <span>{t('farmerDashboard.myProducts')}</span>
          <span className="px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-800 text-[10px]">
            {products.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('add-product')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1 ${
            activeTab === 'add-product'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>{t('farmerDashboard.addProduct')}</span>
        </button>

        <button
          onClick={() => setActiveTab('earnings')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'earnings'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          {t('farmerDashboard.earnings')}
        </button>
      </div>

      {/* Tab 1: Overview & Recent Orders */}
      {activeTab === 'overview' && (
        <div className="mt-6 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 font-['Outfit']">
                Active Consumer Orders Requiring Action
              </h3>
              <button
                onClick={() => setActiveTab('orders')}
                className="text-xs font-bold text-emerald-700 hover:underline"
              >
                View all orders →
              </button>
            </div>

            {orders.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">No orders currently waiting.</p>
            ) : (
              <div className="space-y-3">
                {orders.slice(0, 3).map((order) => (
                  <div
                    key={order.id}
                    className="p-4 rounded-xl border border-slate-200/80 bg-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-slate-900">{order.orderNumber}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          order.status === 'delivered' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {order.status.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 font-medium mt-1">
                        Buyer: {order.consumerName} · {order.city}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {order.items?.map(i => `${i.quantity}${i.unit} ${i.productName}`).join(', ')}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 self-end md:self-auto">
                      <span className="text-sm font-extrabold text-emerald-800 mr-2 tabular-nums">
                        ₹{order.farmerEarnings}
                      </span>

                      {/* Interactive Farmer Lifecycle Actions */}
                      {order.status === 'placed' && (
                        <button
                          disabled={updatingOrderId === order.id}
                          onClick={() => handleUpdateStatus(order.id, 'farmer_accepted')}
                          className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer"
                        >
                          {t('farmerDashboard.acceptOrder')}
                        </button>
                      )}

                      {order.status === 'farmer_accepted' && (
                        <button
                          disabled={updatingOrderId === order.id}
                          onClick={() => handleUpdateStatus(order.id, 'prepared')}
                          className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer"
                        >
                          {t('farmerDashboard.markPrepared')}
                        </button>
                      )}

                      {order.status === 'prepared' && (
                        <button
                          disabled={updatingOrderId === order.id}
                          onClick={() => handleUpdateStatus(order.id, 'out_for_delivery')}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer"
                        >
                          {t('farmerDashboard.markReady')}
                        </button>
                      )}

                      {order.status === 'out_for_delivery' && (
                        <button
                          disabled={updatingOrderId === order.id}
                          onClick={() => handleUpdateStatus(order.id, 'delivered')}
                          className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer"
                        >
                          {t('farmerDashboard.markDelivered')}
                        </button>
                      )}

                      {order.status === 'delivered' && (
                        <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" />
                          <span>Fulfilled</span>
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: All Orders */}
      {activeTab === 'orders' && (
        <div className="mt-6 bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900 font-['Outfit']">
              All Consumer Harvest Orders
            </h3>
            <span className="text-xs text-slate-500 font-medium">Real-time database sync</span>
          </div>

          <div className="space-y-3">
            {orders.map((order) => (
              <div
                key={order.id}
                className="p-4 rounded-xl border border-slate-200/80 bg-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-slate-900">{order.orderNumber}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      order.status === 'delivered' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {order.status.replace('_', ' ')}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'Today'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 font-medium mt-1">
                    Buyer: {order.consumerName} · Phone: {order.consumerPhone}
                  </p>
                  <p className="text-xs text-slate-500">
                    Address: {order.address}, {order.city}
                  </p>
                  <p className="text-[11px] text-emerald-800 font-semibold mt-1">
                    Items: {order.items?.map(i => `${i.quantity}${i.unit} ${i.productName}`).join(', ')}
                  </p>
                </div>

                <div className="flex items-center gap-2 self-end md:self-auto">
                  <span className="text-sm font-extrabold text-emerald-800 mr-2 tabular-nums">
                    ₹{order.farmerEarnings}
                  </span>

                  {order.status === 'placed' && (
                    <button
                      disabled={updatingOrderId === order.id}
                      onClick={() => handleUpdateStatus(order.id, 'farmer_accepted')}
                      className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer"
                    >
                      {t('farmerDashboard.acceptOrder')}
                    </button>
                  )}

                  {order.status === 'farmer_accepted' && (
                    <button
                      disabled={updatingOrderId === order.id}
                      onClick={() => handleUpdateStatus(order.id, 'prepared')}
                      className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer"
                    >
                      {t('farmerDashboard.markPrepared')}
                    </button>
                  )}

                  {order.status === 'prepared' && (
                    <button
                      disabled={updatingOrderId === order.id}
                      onClick={() => handleUpdateStatus(order.id, 'out_for_delivery')}
                      className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer"
                    >
                      {t('farmerDashboard.markReady')}
                    </button>
                  )}

                  {order.status === 'out_for_delivery' && (
                    <button
                      disabled={updatingOrderId === order.id}
                      onClick={() => handleUpdateStatus(order.id, 'delivered')}
                      className="px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer"
                    >
                      {t('farmerDashboard.markDelivered')}
                    </button>
                  )}

                  {order.status === 'delivered' && (
                    <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      <span>Order Delivered</span>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: My Products */}
      {activeTab === 'products' && (
        <div className="mt-6 bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900 font-['Outfit']">
              Live Listed Produce on Marketplace
            </h3>
            <button
              onClick={() => setActiveTab('add-product')}
              className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Add New Produce</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((prod) => (
              <div key={prod.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center gap-3">
                <img
                  src={prod.image || '/src/assets/images/product_tomatoes_1790693869427.jpg'}
                  alt={prod.name}
                  className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-200"
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] uppercase font-bold text-emerald-700">{prod.category}</span>
                  <h4 className="text-xs font-bold text-slate-900 truncate">{prod.name}</h4>
                  <p className="text-xs font-extrabold text-emerald-800 tabular-nums">
                    ₹{prod.price} / {prod.unit}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Stock: {prod.quantity} {prod.unit}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Add Product Form with Fair Price Benchmark */}
      {activeTab === 'add-product' && (
        <div className="mt-6 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-2xs max-w-2xl mx-auto">
          <div className="mb-6">
            <h3 className="text-xl font-extrabold text-slate-900 font-['Outfit']">
              {t('addProduct.title')}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Add your harvest directly into the marketplace database. It will immediately be discoverable by consumers.
            </p>
          </div>

          <form onSubmit={handleCreateProduct} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                {t('addProduct.name')} *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Fresh Red Desi Tomatoes"
                value={newProdName}
                onChange={(e) => setNewProdName(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600 focus:bg-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  {t('addProduct.category')} *
                </label>
                <select
                  value={newProdCategory}
                  onChange={(e) => setNewProdCategory(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600"
                >
                  <option value="Vegetables">Vegetables (सब्जियां)</option>
                  <option value="Fruits">Fruits (फल)</option>
                  <option value="Grains">Grains (अनाज)</option>
                  <option value="Pulses">Pulses (दालें)</option>
                  <option value="Spices">Spices (मसाले)</option>
                  <option value="Dairy">Dairy (दुग्ध उत्पाद)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  {t('addProduct.unit')}
                </label>
                <select
                  value={newProdUnit}
                  onChange={(e) => setNewProdUnit(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600"
                >
                  <option value="kg">kg (Kilogram)</option>
                  <option value="dozen">dozen (दर्जन)</option>
                  <option value="litre">litre (लीटर)</option>
                  <option value="bundle">bundle (गड्डी)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  {t('addProduct.price')} *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={newProdPrice}
                  onChange={(e) => setNewProdPrice(Number(e.target.value))}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  {t('addProduct.quantity')} *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={newProdQuantity}
                  onChange={(e) => setNewProdQuantity(Number(e.target.value))}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600 focus:bg-white"
                />
              </div>
            </div>

            {/* Smart Feature: Fair Price Indicator */}
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs">
              <span className="font-bold text-emerald-900 block mb-1">
                {t('addProduct.benchmarkFair')}:
              </span>
              <div className="flex items-center justify-between text-slate-700">
                <span>Estimated Local Mandi Rate: ₹{Math.round(newProdPrice * 0.7)}/kg</span>
                <span className="font-extrabold text-emerald-800">
                  {newProdPrice < 25 ? 'Great Value' : (newProdPrice <= 45 ? 'Fair Direct Price' : 'Premium Grade')}
                </span>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                {t('addProduct.description')}
              </label>
              <textarea
                rows={3}
                placeholder="Notes on soil, seed variety, and morning harvest..."
                value={newProdDescription}
                onChange={(e) => setNewProdDescription(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600 focus:bg-white"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="organicCheckbox"
                checked={newProdOrganic}
                onChange={(e) => setNewProdOrganic(e.target.checked)}
                className="w-4 h-4 accent-emerald-600 rounded"
              />
              <label htmlFor="organicCheckbox" className="text-xs font-medium text-slate-700 cursor-pointer">
                {t('addProduct.organic')}
              </label>
            </div>

            <button
              type="submit"
              disabled={submittingProduct}
              className="w-full py-3 px-4 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-900/10 cursor-pointer disabled:opacity-50"
            >
              {submittingProduct ? 'Publishing produce...' : t('addProduct.submit')}
            </button>
          </form>
        </div>
      )}

      {/* Tab 5: Earnings Analysis */}
      {activeTab === 'earnings' && (
        <div className="mt-6 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs">
            <h3 className="text-base font-bold text-slate-900 font-['Outfit'] mb-4">
              Direct Farmer Take-Home Revenue Comparison
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-xs text-slate-500 block">Total Realized Revenue</span>
                <span className="text-2xl font-extrabold text-slate-900 tabular-nums">₹{stats.totalSales}</span>
                <span className="text-[11px] text-emerald-700 block mt-1">100% credited to your account</span>
              </div>

              <div className="p-4 bg-rose-50 rounded-xl border border-rose-200">
                <span className="text-xs text-rose-800 block">Traditional Trader Estimate</span>
                <span className="text-2xl font-extrabold text-rose-900 tabular-nums">
                  ₹{Math.round(stats.totalSales * 0.65)}
                </span>
                <span className="text-[11px] text-rose-700 block mt-1">35% lost to middlemen & mandi cess</span>
              </div>

              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                <span className="text-xs text-emerald-800 block">Direct Selling Gain</span>
                <span className="text-2xl font-extrabold text-emerald-800 tabular-nums">
                  +₹{stats.protectedSavings}
                </span>
                <span className="text-[11px] text-emerald-700 block mt-1">Direct bonus preserved by Khet2Cart</span>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
