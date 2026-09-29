import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  MapPin, 
  Leaf, 
  Sparkles, 
  SlidersHorizontal,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { Product } from '../types';
import { api } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { ProductCard } from './ProductCard';

interface MarketplaceProps {
  onSelectProduct: (product: Product) => void;
  onSelectFarmer: (farmerId: string) => void;
  selectedCity: string;
}

const CATEGORIES = [
  'All Produce',
  'Vegetables',
  'Fruits',
  'Grains',
  'Pulses',
  'Spices',
  'Dairy',
  'Organic Produce'
];

export const Marketplace: React.FC<MarketplaceProps> = ({
  onSelectProduct,
  onSelectFarmer,
  selectedCity,
}) => {
  const { t } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Produce');
  const [organicOnly, setOrganicOnly] = useState(false);
  const [maxPrice, setMaxPrice] = useState<number>(1000);
  const [sortBy, setSortBy] = useState<'distance' | 'price_asc' | 'freshness'>('distance');

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getProducts({
        category: selectedCategory === 'Organic Produce' ? undefined : (selectedCategory === 'All Produce' ? undefined : selectedCategory),
        organic: selectedCategory === 'Organic Produce' ? true : (organicOnly ? true : undefined),
        search: searchQuery || undefined,
        maxPrice: maxPrice < 1000 ? maxPrice : undefined,
        sort: sortBy,
      });
      setProducts(data);
    } catch (err: any) {
      console.error('Failed to load marketplace products', err);
      setError(err.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, organicOnly, sortBy]);

  // Debounced search
  useEffect(() => {
    const handler = setTimeout(() => {
      fetchProducts();
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery, maxPrice]);

  return (
    <div id="marketplace" className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Header Banner & Location Indicator */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            <span>Farmers near {selectedCity} (Madhya Pradesh)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Outfit']">
            {t('nav.marketplace')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Fresh harvest directly listed by certified regional family farms. Zero commission markups.
          </p>
        </div>

        {/* Refresh / Status */}
        <button
          onClick={fetchProducts}
          className="self-start md:self-auto flex items-center gap-1.5 text-xs text-slate-600 hover:text-emerald-700 bg-white px-3 py-1.5 rounded-lg border border-slate-200 transition-colors shadow-2xs"
          title="Refresh Produce"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-emerald-600' : ''}`} />
          <span>Refresh Listings</span>
        </button>
      </div>

      {/* Search & Sort Controls Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs mb-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          
          {/* Search Box */}
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder={t('marketplace.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white transition-all"
            />
          </div>

          {/* Sort By Dropdown */}
          <div className="md:col-span-3 flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-700 focus:outline-none focus:border-emerald-600 cursor-pointer"
            >
              <option value="distance">{t('marketplace.sortDistance')}</option>
              <option value="price_asc">{t('marketplace.sortPriceLow')}</option>
              <option value="freshness">{t('marketplace.sortFreshness')}</option>
            </select>
          </div>

          {/* Organic Only Toggle */}
          <div className="md:col-span-3 flex items-center justify-between sm:justify-end gap-3 px-2">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5 cursor-pointer">
              <Leaf className="w-3.5 h-3.5 text-emerald-600" />
              <span>{t('marketplace.filterOrganic')}</span>
            </label>
            <button
              type="button"
              role="switch"
              aria-checked={organicOnly}
              onClick={() => setOrganicOnly(!organicOnly)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                organicOnly ? 'bg-emerald-600' : 'bg-slate-200'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                  organicOnly ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

        </div>

        {/* Category Horizontal Filter Tabs (Segmented Buttons conforming to constitution) */}
        <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid or State Handling */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <div key={n} className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3 animate-pulse">
              <div className="w-full aspect-[4/3] bg-slate-200 rounded-xl" />
              <div className="h-4 bg-slate-200 rounded w-2/3" />
              <div className="h-3 bg-slate-200 rounded w-1/2" />
              <div className="h-8 bg-slate-100 rounded-lg mt-4" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-rose-200">
          <AlertCircle className="w-8 h-8 text-rose-500 mx-auto mb-2" />
          <p className="text-sm font-bold text-slate-900">Failed to connect to marketplace</p>
          <p className="text-xs text-slate-500 mt-1">{error}</p>
          <button
            onClick={fetchProducts}
            className="mt-4 px-4 py-2 bg-emerald-700 text-white rounded-lg text-xs font-semibold"
          >
            Retry Loading
          </button>
        </div>
      ) : products.length === 0 ? (
        <div className="p-16 text-center bg-white rounded-2xl border border-slate-200 shadow-2xs">
          <Leaf className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">
            {t('marketplace.noProductsFound')}
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search keywords or switching category filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All Produce');
              setOrganicOnly(false);
            }}
            className="mt-4 px-4 py-2 bg-emerald-100 text-emerald-900 rounded-lg text-xs font-bold hover:bg-emerald-200 transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelectProduct={onSelectProduct}
              onSelectFarmer={onSelectFarmer}
            />
          ))}
        </div>
      )}

    </div>
  );
};
