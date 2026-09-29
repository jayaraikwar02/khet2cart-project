import React, { useState } from 'react';
import { 
  X, 
  User, 
  Lock, 
  Mail, 
  Phone, 
  MapPin, 
  Leaf, 
  ShoppingBag, 
  ShieldCheck, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'login' | 'register';
  defaultRole?: UserRole;
  onSuccess?: (role: UserRole) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'login',
  defaultRole = 'consumer',
  onSuccess,
}) => {
  const { t } = useLanguage();
  const { login, register, quickLogin } = useAuth();

  const [isLogin, setIsLogin] = useState(defaultTab === 'login');
  const [role, setRole] = useState<UserRole>(defaultRole);

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [village, setVillage] = useState('Sanwer');
  const [district, setDistrict] = useState('Indore');
  const [state, setState] = useState('Madhya Pradesh');
  const [farmSize, setFarmSize] = useState('5 Acres');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      if (isLogin) {
        const u = await login(email, password);
        if (onSuccess) onSuccess(u.role);
      } else {
        const u = await register({
          name,
          email,
          password,
          role,
          phone,
          village: role === 'farmer' ? village : undefined,
          district: role === 'farmer' ? district : 'Indore',
          state: role === 'farmer' ? state : 'Madhya Pradesh',
          farmSize: role === 'farmer' ? farmSize : undefined,
          location: role === 'consumer' ? 'Indore' : village,
        });
        if (onSuccess) onSuccess(u.role);
      }
      onClose();
    } catch (err: any) {
      console.error('Authentication error', err);
      setError(err.message || 'Authentication failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuick = async (selectedRole: UserRole) => {
    try {
      setLoading(true);
      setError(null);
      const u = await quickLogin(selectedRole);
      if (onSuccess) onSuccess(u.role);
      onClose();
    } catch (err: any) {
      console.error(err);
      setError('Quick login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="relative bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-100 p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-emerald-700 text-white flex items-center justify-center mx-auto mb-2 shadow-md">
            <Leaf className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 font-['Outfit']">
            {isLogin ? t('auth.login') : t('auth.register')}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {t('tagline')}
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex bg-slate-100 p-1 rounded-xl mb-5">
          <button
            type="button"
            onClick={() => {
              setIsLogin(true);
              setError(null);
            }}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
              isLogin ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {t('nav.login')}
          </button>
          <button
            type="button"
            onClick={() => {
              setIsLogin(false);
              setError(null);
            }}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
              !isLogin ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {t('auth.register')}
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl">
            {error}
          </div>
        )}

        {/* Quick Demo Login Buttons (Crucial for Hackathon Demo Flow) */}
        <div className="mb-5 p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-2xl">
          <span className="text-[11px] font-bold text-emerald-950 uppercase tracking-wider block mb-2 text-center">
            {t('auth.demoAccountsTitle')}
          </span>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuick('consumer')}
              className="py-1.5 px-2 bg-white hover:bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-lg text-[11px] font-bold transition-colors cursor-pointer text-center"
            >
              Consumer
            </button>
            <button
              type="button"
              onClick={() => handleQuick('farmer')}
              className="py-1.5 px-2 bg-white hover:bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-lg text-[11px] font-bold transition-colors cursor-pointer text-center"
            >
              Farmer
            </button>
            <button
              type="button"
              onClick={() => handleQuick('admin')}
              className="py-1.5 px-2 bg-white hover:bg-purple-100 text-purple-900 border border-purple-300 rounded-lg text-[11px] font-bold transition-colors cursor-pointer text-center"
            >
              Admin
            </button>
          </div>
        </div>

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          
          {/* Registration Role Selection */}
          {!isLogin && (
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1.5">
                Select Your Account Type:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('consumer')}
                  className={`p-2.5 rounded-xl border text-left text-xs font-semibold transition-all ${
                    role === 'consumer' ? 'border-emerald-600 bg-emerald-50 text-emerald-900 shadow-2xs' : 'border-slate-200 text-slate-600'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4 mb-1 text-emerald-700" />
                  <span>Consumer / Buyer</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('farmer')}
                  className={`p-2.5 rounded-xl border text-left text-xs font-semibold transition-all ${
                    role === 'farmer' ? 'border-emerald-600 bg-emerald-50 text-emerald-900 shadow-2xs' : 'border-slate-200 text-slate-600'
                  }`}
                >
                  <Leaf className="w-4 h-4 mb-1 text-emerald-700" />
                  <span>Farmer / Producer</span>
                </button>
              </div>
            </div>
          )}

          {!isLogin && (
            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                {t('auth.name')} *
              </label>
              <input
                type="text"
                required
                placeholder="Ramesh Patidar"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600 focus:bg-white"
              />
            </div>
          )}

          <div>
            <label className="text-[11px] font-semibold text-slate-600 block mb-1">
              {t('auth.email')} *
            </label>
            <input
              type="email"
              required
              placeholder="farmer@demo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600 focus:bg-white"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-600 block mb-1">
              {t('auth.password')} *
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600 focus:bg-white"
            />
          </div>

          {/* Farmer Specific Fields */}
          {!isLogin && role === 'farmer' && (
            <>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                    {t('auth.village')}
                  </label>
                  <input
                    type="text"
                    value={village}
                    onChange={(e) => setVillage(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                    {t('auth.district')}
                  </label>
                  <input
                    type="text"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                  {t('auth.farmSize')}
                </label>
                <input
                  type="text"
                  placeholder="e.g. 8.5 Acres"
                  value={farmSize}
                  onChange={(e) => setFarmSize(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600 focus:bg-white"
                />
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-900/10 cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : (isLogin ? t('auth.login') : t('auth.register'))}
          </button>
        </form>

      </div>
    </div>
  );
};
