import React, { useState } from 'react';
import { 
  Sprout, 
  ShoppingCart, 
  User as UserIcon, 
  MapPin, 
  Globe, 
  LogOut, 
  ChevronDown, 
  Menu, 
  X,
  LayoutDashboard,
  Calculator,
  Bell
} from 'lucide-react';
import { useLanguage, SUPPORTED_LANGUAGES, SupportedLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

interface NavbarProps {
  onOpenCart: () => void;
  onOpenAuth: (defaultTab?: 'login' | 'register', defaultRole?: 'consumer' | 'farmer') => void;
  onOpenCalculator: () => void;
  currentView: string;
  setCurrentView: (view: 'home' | 'marketplace' | 'farmer-dashboard' | 'admin-dashboard' | 'calculator') => void;
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  onOpenTracking?: (orderId?: string) => void;
}

const CITIES = ['Indore', 'Bhopal', 'Ujjain', 'Dewas', 'Khargone', 'Khandwa', 'Mumbai', 'Delhi'];

export const Navbar: React.FC<NavbarProps> = ({
  onOpenCart,
  onOpenAuth,
  onOpenCalculator,
  currentView,
  setCurrentView,
  selectedCity,
  setSelectedCity,
}) => {
  const { t, language, setLanguage, currentLangMeta } = useLanguage();
  const { user, logout, quickLogin } = useAuth();
  const { itemCount } = useCart();

  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [cityMenuOpen, setCityMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#FAF9F5]/95 backdrop-blur-md border-b border-emerald-900/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo & Tagline */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => {
                setCurrentView('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-2.5 text-left group focus:outline-none"
            >
              <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-emerald-700 to-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-900/15 group-hover:scale-105 transition-transform duration-200">
                <Sprout className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div>
                <span className="text-2xl font-bold tracking-tight text-slate-900 font-['Outfit'] block leading-none">
                  Khet<span className="text-emerald-600">2</span>Cart
                </span>
                <span className="text-[11px] font-medium text-emerald-800/80 tracking-wide uppercase mt-1 block">
                  {t('tagline')}
                </span>
              </div>
            </button>

            {/* City / Deliver To Selector */}
            <div className="relative hidden md:block ml-4 pl-4 border-l border-slate-200">
              <button
                onClick={() => setCityMenuOpen(!cityMenuOpen)}
                className="flex items-center gap-1.5 text-xs text-slate-700 hover:text-emerald-700 bg-white/80 hover:bg-white px-2.5 py-1.5 rounded-lg border border-slate-200 transition-all duration-150"
              >
                <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="text-slate-500">{t('nav.deliverTo')}:</span>
                <span className="font-semibold text-slate-900">{selectedCity}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {cityMenuOpen && (
                <div 
                  className="absolute left-4 mt-2 w-44 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150"
                  onMouseLeave={() => setCityMenuOpen(false)}
                >
                  <div className="px-3 py-1 text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
                    {t('nav.deliverTo')}
                  </div>
                  {CITIES.map((city) => (
                    <button
                      key={city}
                      onClick={() => {
                        setSelectedCity(city);
                        setCityMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-emerald-50 ${
                        selectedCity === city ? 'font-bold text-emerald-700 bg-emerald-50/50' : 'text-slate-700'
                      }`}
                    >
                      {city}
                      {selectedCity === city && <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600">
            <button
              onClick={() => {
                setCurrentView('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`hover:text-emerald-700 transition-colors whitespace-nowrap ${
                currentView === 'home' ? 'text-emerald-700 font-semibold' : ''
              }`}
            >
              {t('nav.home')}
            </button>

            <button
              onClick={() => {
                setCurrentView('marketplace');
              }}
              className={`hover:text-emerald-700 transition-colors whitespace-nowrap ${
                currentView === 'marketplace' ? 'text-emerald-700 font-semibold' : ''
              }`}
            >
              {t('nav.marketplace')}
            </button>

            <a
              href="#problem-solution"
              onClick={(e) => {
                e.preventDefault();
                setCurrentView('home');
                setTimeout(() => {
                  document.getElementById('problem-solution')?.scrollIntoView({ behavior: 'smooth' });
                }, 50);
              }}
              className="hover:text-emerald-700 transition-colors whitespace-nowrap"
            >
              {t('nav.howItWorks')}
            </a>

            <button
              onClick={onOpenCalculator}
              className="flex items-center gap-1.5 hover:text-emerald-700 transition-colors whitespace-nowrap text-emerald-800/90 font-medium"
            >
              <Calculator className="w-4 h-4 text-emerald-600" />
              {t('nav.calculator')}
            </button>

            {/* Role specific quick view */}
            {user?.role === 'farmer' && (
              <button
                onClick={() => setCurrentView('farmer-dashboard')}
                className={`hover:text-emerald-700 transition-colors whitespace-nowrap font-medium text-emerald-700 ${
                  currentView === 'farmer-dashboard' ? 'font-bold' : ''
                }`}
              >
                🌾 {t('nav.dashboard')}
              </button>
            )}

            {user?.role === 'admin' && (
              <button
                onClick={() => setCurrentView('admin-dashboard')}
                className={`hover:text-purple-700 transition-colors whitespace-nowrap font-medium text-purple-700 ${
                  currentView === 'admin-dashboard' ? 'font-bold' : ''
                }`}
              >
                ⚙️ Admin
              </button>
            )}
          </nav>

          {/* Action Zone: Language Selector, Cart, User / Demo Switcher */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            
            {/* Multi-regional Language Selector */}
            <div className="relative">
              <button
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/90 border border-slate-200 text-xs font-medium text-slate-700 hover:border-emerald-600 transition-all shadow-sm"
                title="Select Regional Language"
              >
                <Globe className="w-3.5 h-3.5 text-emerald-600" />
                <span className="font-semibold">{currentLangMeta.nativeName}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {langMenuOpen && (
                <div 
                  className="absolute right-0 mt-2 w-52 max-h-96 overflow-y-auto bg-white rounded-xl shadow-2xl border border-slate-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150"
                  onMouseLeave={() => setLangMenuOpen(false)}
                >
                  <div className="px-3 py-1.5 text-[10px] uppercase font-semibold text-slate-400 tracking-wider border-b border-slate-100">
                    Indian Regional Languages (8)
                  </div>
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code);
                        setLangMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-emerald-50 transition-colors ${
                        language === lang.code ? 'font-bold text-emerald-700 bg-emerald-50' : 'text-slate-700'
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        <span className="font-medium text-slate-800">{lang.name} — {lang.nativeName}</span>
                      </span>
                      {language === lang.code && <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Shopping Cart Button with real count */}
            <button
              onClick={onOpenCart}
              className="relative p-2.5 rounded-xl bg-white/90 border border-slate-200 hover:border-emerald-600 text-slate-700 hover:text-emerald-700 transition-all shadow-sm focus:outline-none"
              aria-label="Open Cart"
            >
              <ShoppingCart className="w-5 h-5 text-emerald-700" />
              {itemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-emerald-600 text-white font-bold text-[11px] w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-pulse">
                  {itemCount}
                </span>
              )}
            </button>

            {/* User Session / Demo Account Selector */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 font-medium hover:bg-emerald-100 transition-all"
                >
                  {user.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={user.name} 
                      className="w-6 h-6 rounded-full object-cover border border-emerald-300"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <UserIcon className="w-4 h-4 text-emerald-700" />
                  )}
                  <span className="hidden sm:inline font-semibold max-w-[100px] truncate">{user.name.split(' ')[0]}</span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-white text-emerald-800 shadow-2xs">
                    {user.role}
                  </span>
                  <ChevronDown className="w-3 h-3 text-emerald-700" />
                </button>

                {userMenuOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-slate-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150"
                    onMouseLeave={() => setUserMenuOpen(false)}
                  >
                    <div className="px-3 py-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900 truncate">{user.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                      <p className="text-[10px] text-emerald-700 capitalize mt-0.5 font-medium">Role: {user.role}</p>
                    </div>

                    {user.role === 'farmer' && (
                      <button
                        onClick={() => {
                          setCurrentView('farmer-dashboard');
                          setUserMenuOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-emerald-50 flex items-center gap-2"
                      >
                        <LayoutDashboard className="w-3.5 h-3.5 text-emerald-600" />
                        {t('farmerDashboard.title')}
                      </button>
                    )}

                    {user.role === 'admin' && (
                      <button
                        onClick={() => {
                          setCurrentView('admin-dashboard');
                          setUserMenuOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-purple-50 flex items-center gap-2"
                      >
                        <LayoutDashboard className="w-3.5 h-3.5 text-purple-600" />
                        Admin Dashboard
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setCurrentView('marketplace');
                        setUserMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-emerald-50 flex items-center gap-2"
                    >
                      <Sprout className="w-3.5 h-3.5 text-emerald-600" />
                      {t('nav.marketplace')}
                    </button>

                    <div className="border-t border-slate-100 my-1 pt-1">
                      <button
                        onClick={() => {
                          logout();
                          setUserMenuOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-medium"
                      >
                        <LogOut className="w-3.5 h-3.5 text-rose-500" />
                        {t('nav.logout')}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenAuth('login')}
                  className="hidden sm:inline-block px-3 py-2 text-xs font-semibold text-slate-700 hover:text-emerald-700 transition-colors"
                >
                  {t('nav.login')}
                </button>
                <button
                  onClick={() => onOpenAuth('register')}
                  className="px-3.5 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-sm transition-all duration-150 whitespace-nowrap"
                >
                  {t('nav.getStarted')}
                </button>
              </div>
            )}

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 py-3 px-2 bg-white rounded-b-2xl shadow-xl animate-in slide-in-from-top-2 duration-150">
            <div className="flex flex-col gap-2 text-sm font-medium text-slate-700">
              <button
                onClick={() => {
                  setCurrentView('home');
                  setMobileMenuOpen(false);
                }}
                className="text-left px-3 py-2 rounded-lg hover:bg-slate-50"
              >
                {t('nav.home')}
              </button>

              <button
                onClick={() => {
                  setCurrentView('marketplace');
                  setMobileMenuOpen(false);
                }}
                className="text-left px-3 py-2 rounded-lg hover:bg-slate-50"
              >
                {t('nav.marketplace')}
              </button>

              <button
                onClick={() => {
                  onOpenCalculator();
                  setMobileMenuOpen(false);
                }}
                className="text-left px-3 py-2 rounded-lg hover:bg-slate-50 text-emerald-800 flex items-center gap-2"
              >
                <Calculator className="w-4 h-4 text-emerald-600" />
                {t('nav.calculator')}
              </button>

              {user?.role === 'farmer' && (
                <button
                  onClick={() => {
                    setCurrentView('farmer-dashboard');
                    setMobileMenuOpen(false);
                  }}
                  className="text-left px-3 py-2 rounded-lg bg-emerald-50 text-emerald-800 font-semibold"
                >
                  🌾 {t('farmerDashboard.title')}
                </button>
              )}

              {user?.role === 'admin' && (
                <button
                  onClick={() => {
                    setCurrentView('admin-dashboard');
                    setMobileMenuOpen(false);
                  }}
                  className="text-left px-3 py-2 rounded-lg bg-purple-50 text-purple-800 font-semibold"
                >
                  ⚙️ Admin Console
                </button>
              )}

              <div className="pt-2 border-t border-slate-100 px-3">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Language / भाषा ({currentLangMeta.nativeName})
                </span>
                <div className="grid grid-cols-2 gap-1.5 py-1">
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code);
                        setMobileMenuOpen(false);
                      }}
                      className={`text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                        language === lang.code
                          ? 'font-bold text-emerald-800 bg-emerald-50 border border-emerald-200'
                          : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {lang.name} — {lang.nativeName}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between px-3">
                <span className="text-xs text-slate-500">{t('nav.deliverTo')}: {selectedCity}</span>
                {!user ? (
                  <button
                    onClick={() => {
                      onOpenAuth('login');
                      setMobileMenuOpen(false);
                    }}
                    className="text-xs font-bold text-emerald-700"
                  >
                    {t('nav.login')}
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="text-xs font-bold text-rose-600"
                  >
                    {t('nav.logout')}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
