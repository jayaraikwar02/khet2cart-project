import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem } from '../types';
import { api } from '../services/api';
import { useAuth } from './AuthContext';

interface CartContextType {
  items: CartItem[];
  loading: boolean;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => void;
  refreshCart: () => Promise<void>;
  subtotal: number;
  farmerEarnings: number;
  itemCount: number;
  deliveryFee: number;
  platformFee: number;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const refreshCart = async () => {
    try {
      setLoading(true);
      const data = await api.getCart();
      setItems(data);
    } catch (err) {
      console.error('Failed to load cart', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshCart();
  }, [user]);

  const addToCart = async (productId: string, quantity = 1) => {
    try {
      setLoading(true);
      const updated = await api.addToCart(productId, quantity);
      setItems(updated);
    } catch (err) {
      console.error('Failed to add to cart', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    try {
      setLoading(true);
      const updated = await api.updateCartItem(itemId, quantity);
      setItems(updated);
    } catch (err) {
      console.error('Failed to update cart item', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      setLoading(true);
      await api.removeCartItem(itemId);
      setItems(prev => prev.filter(i => i.id !== itemId));
    } catch (err) {
      console.error('Failed to remove cart item', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearCart = () => {
    setItems([]);
  };

  const subtotal = items.reduce((sum, item) => sum + ((item.product?.price || 0) * item.quantity), 0);
  const farmerEarnings = subtotal; // 100% of produce subtotal goes straight to farmers!
  const deliveryFee = items.length > 0 ? 30 : 0;
  const platformFee = items.length > 0 ? 5 : 0;
  const total = subtotal + deliveryFee + platformFee;
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        loading,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        refreshCart,
        subtotal,
        farmerEarnings,
        itemCount,
        deliveryFee,
        platformFee,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
