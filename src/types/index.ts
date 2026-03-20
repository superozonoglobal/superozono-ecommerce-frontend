export type UserRole = 'super_admin' | 'admin' | 'distribuidor';

export interface User {
  id: string;
  email: string;
  password?: string;
  role: UserRole;
  subdomain?: string;
  name?: string;
}

export interface Invitation {
  id: string; // Token
  email: string;
  role: UserRole;
  subdomain?: string;
  createdAt: string;
  status: 'pending' | 'accepted' | 'expired';
}

export interface Product {
  id: number;
  name: string;
  price: number;
  desc?: string;
  icon?: string;
  active: boolean;
  stock?: number;
}

export interface StoreConfig {
  primaryColor: string;
  accentColor: string;
  backgroundColor: string;
  logoBase64?: string;
  showLogo: boolean;
  storeName: string;
  products: Product[];
}
