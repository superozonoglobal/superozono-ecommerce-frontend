export type UserRole = 'ROOT_ADMIN' | 'ADMIN' | 'DISTRIBUTOR';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp?: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName?: string;
  email: string;
  role: UserRole;
  active: boolean;
  invitedBy?: string; // ID of the user who invited them
  invitedByName?: string; // Name of the user who invited them
  createdAt?: string;
  updatedAt?: string;
}

export interface Store {
  id: string;
  name: string;
  subdomain: string;
  address: string;
  phone: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'INACTIVE';
  primaryColor?: string;
  secondaryColor?: string;
  logoUrl?: string;
  bannerUrl?: string;
  ownerId?: string;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  sku: string;
  category: string;
  basePrice: number;
  minPrice?: number;
  maxPrice?: number;
  quantity: number;
  minStockAlert: number;
  status: 'ACTIVE' | 'INACTIVE' | 'OUT_OF_STOCK';
  storeId: string;
  imageUrl?: string;
}

export interface OrderItem {
  productId: string;
  quantity: number;
  productName?: string;
  price?: number;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  totalPrice: number;
  status: 'PENDING' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  storeId: string;
  createdAt: string;
}
