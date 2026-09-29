/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProblemSolution } from './components/ProblemSolution';
import { HowItWorks } from './components/HowItWorks';
import { Marketplace } from './components/Marketplace';
import { ProductDetailModal } from './components/ProductDetailModal';
import { FarmerProfileModal } from './components/FarmerProfileModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { FarmerDashboard } from './components/FarmerDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { EarningsCalculator } from './components/EarningsCalculator';
import { AuthModal } from './components/AuthModal';
import { Footer } from './components/Footer';
import { Product, Order, UserRole } from './types';

function MainApp() {
  const { user } = useAuth();

  // Navigation View State
  const [currentView, setCurrentView] = useState<'home' | 'marketplace' | 'farmer-dashboard' | 'admin-dashboard' | 'calculator'>('home');
  const [selectedCity, setSelectedCity] = useState('Indore');

  // Modal States
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedFarmerId, setSelectedFarmerId] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [trackedOrder, setTrackedOrder] = useState<Order | null>(null);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [authModalConfig, setAuthModalConfig] = useState<{
    isOpen: boolean;
    tab: 'login' | 'register';
    role: UserRole;
  }>({
    isOpen: false,
    tab: 'login',
    role: 'consumer'
  });

  const handleOpenAuth = (tab: 'login' | 'register' = 'login', role: UserRole = 'consumer') => {
    setAuthModalConfig({ isOpen: true, tab, role });
  };

  const handleOrderSuccess = (newOrder: Order) => {
    setIsCheckoutOpen(false);
    setTrackedOrder(newOrder);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F5] text-slate-800 antialiased">
      
      {/* Top Navigation */}
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        selectedCity={selectedCity}
        setSelectedCity={setSelectedCity}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAuth={handleOpenAuth}
        onOpenCalculator={() => setIsCalculatorOpen(true)}
      />

      {/* Main Body Routing */}
      <main className="flex-1">
        {currentView === 'home' && (
          <>
            <Hero
              selectedCity={selectedCity}
              setSelectedCity={setSelectedCity}
              onShopClick={() => setCurrentView('marketplace')}
              onFarmerClick={() => {
                if (user?.role === 'farmer') {
                  setCurrentView('farmer-dashboard');
                } else {
                  handleOpenAuth('register', 'farmer');
                }
              }}
            />

            <ProblemSolution />

            <div className="border-t border-slate-200/60">
              <Marketplace
                selectedCity={selectedCity}
                onSelectProduct={(p) => setSelectedProduct(p)}
                onSelectFarmer={(id) => setSelectedFarmerId(id)}
              />
            </div>

            <HowItWorks />
          </>
        )}

        {currentView === 'marketplace' && (
          <Marketplace
            selectedCity={selectedCity}
            onSelectProduct={(p) => setSelectedProduct(p)}
            onSelectFarmer={(id) => setSelectedFarmerId(id)}
          />
        )}

        {currentView === 'farmer-dashboard' && (
          <FarmerDashboard onOpenCalculator={() => setIsCalculatorOpen(true)} />
        )}

        {currentView === 'admin-dashboard' && (
          <AdminDashboard />
        )}

        {currentView === 'calculator' && (
          <div className="py-12">
            <ProblemSolution />
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals & Drawers */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onOpenFarmer={(id) => {
          setSelectedProduct(null);
          setSelectedFarmerId(id);
        }}
        onBuyNow={() => {
          setSelectedProduct(null);
          setIsCheckoutOpen(true);
        }}
      />

      <FarmerProfileModal
        farmerId={selectedFarmerId}
        onClose={() => setSelectedFarmerId(null)}
        onSelectProduct={(p) => setSelectedProduct(p)}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
        onExplore={() => {
          setIsCartOpen(false);
          setCurrentView('marketplace');
        }}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        selectedCity={selectedCity}
        onOrderSuccess={handleOrderSuccess}
      />

      <OrderTrackingModal
        order={trackedOrder}
        onClose={() => setTrackedOrder(null)}
      />

      <EarningsCalculator
        isOpen={isCalculatorOpen}
        onClose={() => setIsCalculatorOpen(false)}
      />

      <AuthModal
        isOpen={authModalConfig.isOpen}
        defaultTab={authModalConfig.tab}
        defaultRole={authModalConfig.role}
        onClose={() => setAuthModalConfig(prev => ({ ...prev, isOpen: false }))}
        onSuccess={(role) => {
          if (role === 'farmer') {
            setCurrentView('farmer-dashboard');
          } else if (role === 'admin') {
            setCurrentView('admin-dashboard');
          } else {
            setCurrentView('marketplace');
          }
        }}
      />

    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <CartProvider>
          <MainApp />
        </CartProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
