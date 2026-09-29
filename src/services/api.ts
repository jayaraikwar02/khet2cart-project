import { User, Product, FarmerProfile, CartItem, Order, OrderStatus, AdminStats, FarmerEarnings } from '../types';

const API_BASE = import.meta.env.VITE_API_URL || '';

// Token storage key
const TOKEN_KEY = 'khet2cart_jwt_token';
const GUEST_SESSION_KEY = 'khet2cart_guest_session';

function getGuestSession(): string {
  let session = localStorage.getItem(GUEST_SESSION_KEY);
  if (!session) {
    session = 'guest_' + Math.random().toString(36).substring(2, 9);
    localStorage.setItem(GUEST_SESSION_KEY, session);
  }
  return session;
}

export function getStoredToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setStoredToken(token: string | null) {
  try {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  } catch {
    // ignore
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken();
  const guestSession = getGuestSession();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'x-guest-session': guestSession,
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMsg = `HTTP ${response.status} Error`;
    try {
      const errorData = await response.json();
      errorMsg = errorData.error || errorData.detail || errorMsg;
    } catch {
      // ignore
    }
    throw new Error(errorMsg);
  }

  return response.json();
}

export const api = {
  // Authentication
  async register(data: any): Promise<{ user: User; token: string }> {
    const res = await request<{ user: User; token: string }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (res.token) setStoredToken(res.token);
    return res;
  },

  async login(credentials: { email: string; password: string }): Promise<{ user: User; token: string }> {
    const res = await request<{ user: User; token: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    if (res.token) setStoredToken(res.token);
    return res;
  },

  async getCurrentUser(): Promise<User | null> {
    const token = getStoredToken();
    if (!token) return null;
    try {
      const res = await request<{ user: User }>('/api/auth/me');
      return res.user;
    } catch {
      setStoredToken(null);
      return null;
    }
  },

  logout() {
    setStoredToken(null);
  },

  // Products
  async getProducts(params?: {
    category?: string;
    search?: string;
    organic?: boolean;
    maxPrice?: number;
    farmerId?: string;
    sort?: string;
  }): Promise<Product[]> {
    const query = new URLSearchParams();
    if (params?.category) query.append('category', params.category);
    if (params?.search) query.append('search', params.search);
    if (params?.organic) query.append('organic', 'true');
    if (params?.maxPrice) query.append('maxPrice', String(params.maxPrice));
    if (params?.farmerId) query.append('farmerId', params.farmerId);
    if (params?.sort) query.append('sort', params.sort);

    const queryString = query.toString() ? `?${query.toString()}` : '';
    return request<Product[]>(`/api/products${queryString}`);
  },

  async getProductById(id: string): Promise<Product & { farmer?: FarmerProfile }> {
    return request<Product & { farmer?: FarmerProfile }>(`/api/products/${id}`);
  },

  async createProduct(data: Partial<Product>): Promise<Product> {
    return request<Product>('/api/products', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Farmers
  async getFarmers(): Promise<FarmerProfile[]> {
    return request<FarmerProfile[]>('/api/farmers');
  },

  async getFarmerProfile(id: string): Promise<{ farmer: FarmerProfile; products: Product[] }> {
    return request<{ farmer: FarmerProfile; products: Product[] }>(`/api/farmers/${id}`);
  },

  // Cart
  async getCart(): Promise<CartItem[]> {
    return request<CartItem[]>('/api/cart');
  },

  async addToCart(productId: string, quantity = 1): Promise<CartItem[]> {
    return request<CartItem[]>('/api/cart', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity }),
    });
  },

  async updateCartItem(itemId: string, quantity: number): Promise<CartItem[]> {
    return request<CartItem[]>(`/api/cart/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    });
  },

  async removeCartItem(itemId: string): Promise<{ success: boolean }> {
    return request<{ success: boolean }>(`/api/cart/${itemId}`, {
      method: 'DELETE',
    });
  },

  // Orders
  async createOrder(orderData: any): Promise<Order> {
    return request<Order>('/api/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  },

  async getOrders(): Promise<Order[]> {
    return request<Order[]>('/api/orders');
  },

  async getOrderById(id: string): Promise<Order> {
    return request<Order>(`/api/orders/${id}`);
  },

  async updateOrderStatus(orderId: string, status: OrderStatus, farmerNotes?: string): Promise<Order> {
    return request<Order>(`/api/orders/${orderId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, farmerNotes }),
    });
  },

  // Farmer Dashboard
  async getFarmerDashboard(): Promise<{
    farmer: FarmerProfile;
    stats: any;
    weeklySales: any[];
    topProducts: any[];
    recentOrders: Order[];
    myProducts: Product[];
  }> {
    return request<any>('/api/farmer/dashboard');
  },

  // Admin Dashboard
  async getAdminDashboard(): Promise<AdminStats & { users: User[]; recentOrders: Order[]; products: Product[] }> {
    return request<any>('/api/admin/dashboard');
  },

  // Notifications
  async getNotifications(): Promise<any[]> {
    return request<any[]>('/api/notifications');
  },

  async markNotificationRead(id: string): Promise<void> {
    await request(`/api/notifications/${id}/read`, { method: 'PUT' });
  },

  // Calculator
  async calculateBenchmark(traditionalPrice: number, khet2cartPrice: number, quantity: number): Promise<any> {
    return request('/api/calculator/benchmark', {
      method: 'POST',
      body: JSON.stringify({ traditionalPrice, khet2cartPrice, quantity }),
    });
  },
};
