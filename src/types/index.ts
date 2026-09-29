export type UserRole = 'consumer' | 'farmer' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  village?: string;
  district?: string;
  state?: string;
  farmSize?: string;
  location?: string;
  avatar?: string;
  token?: string;
}

export interface FarmerProfile {
  id: string;
  userId: string;
  farmerName: string;
  village: string;
  district: string;
  state: string;
  yearsOfFarming: number;
  farmSize: string;
  rating: number;
  totalOrders: number;
  verified: boolean;
  bio: string;
  phone: string;
  avatar: string;
  coordinates?: { lat: number; lng: number };
}

export interface Product {
  id: string;
  farmerId: string;
  farmerName: string;
  village: string;
  district: string;
  name: string;
  category: 'Vegetables' | 'Fruits' | 'Grains' | 'Pulses' | 'Spices' | 'Dairy' | 'Organic Produce';
  price: number;
  unit: string; // e.g. 'kg', 'dozen', 'litre'
  quantity: number; // available stock
  harvestDate: string; // YYYY-MM-DD
  freshnessScore: number; // percentage e.g. 96
  organic: boolean;
  description: string;
  image: string;
  fairPriceStatus?: 'Good Value' | 'Fair Price' | 'Higher than local average';
  benchmarkPrice?: number;
  distanceKm?: number;
}

export interface CartItem {
  id: string;
  userId: string;
  productId: string;
  product: Product;
  quantity: number;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  farmerId: string;
  farmerName: string;
  price: number;
  quantity: number;
  unit: string;
  image: string;
}

export type OrderStatus = 'placed' | 'farmer_accepted' | 'prepared' | 'out_for_delivery' | 'delivered';

export interface Order {
  id: string;
  orderNumber: string;
  consumerId: string;
  consumerName: string;
  consumerPhone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  deliveryInstructions?: string;
  deliveryType: 'home_delivery' | 'farm_pickup';
  paymentMethod: 'upi' | 'cod' | 'card';
  paymentStatus: 'paid' | 'pending';
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  platformFee: number;
  totalAmount: number;
  farmerEarnings: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  estimatedDelivery: string;
  farmerNotes?: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  role: 'consumer' | 'farmer' | 'admin' | 'all';
  title: string;
  message: string;
  read: boolean;
  timestamp: string;
  type: 'order' | 'price' | 'info' | 'earnings';
}

export interface FarmerEarnings {
  totalEarnings: number;
  thisMonth: number;
  thisWeek: number;
  pendingPayments: number;
  protectedSavings: number;
  weeklySales: { day: string; amount: number; orders: number }[];
  topProducts: { name: string; soldKg: number; revenue: number }[];
}

export interface AdminStats {
  totalFarmers: number;
  totalConsumers: number;
  totalProducts: number;
  totalOrders: number;
  totalGMV: number;
  totalFarmerEarnings: number;
  averageConsumerSavings: number;
}
