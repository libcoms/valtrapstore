export type ProductCategory = "valtrap" | "ushki";
export type ValtrapType = "konkur" | "vyezdka" | "universalny" | "pony";
export type OrderStatus = "new" | "accepted" | "in_progress" | "done";
export type UserRole = "user" | "operator" | "admin";

export interface Product {
  id: string;
  name: string;
  description?: string | null;
  category: ProductCategory;
  valtrapType?: ValtrapType | null;
  price: number;
  images: string[];
  colors: string[];
  sizes: string[];
  manufacturer?: string | null;
  inStock: boolean;
  isSet: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CartItem {
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
  color?: string;
  size?: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  productImage?: string;
  isSet?: boolean;
  quantity: number;
  price: number;
  color?: string;
  size?: string;
}

export interface Order {
  id: string;
  status: OrderStatus;
  total: number;
  name: string;
  phone: string;
  address: string;
  comment?: string | null;
  items: OrderItem[];
  userId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CheckoutFormData {
  name: string;
  phone: string;
  address: string;
  comment?: string;
  privacyConsent: boolean;
}

export interface ProductFilters {
  category?: ProductCategory;
  valtrapType?: ValtrapType;
  color?: string;
  size?: string;
  minPrice?: number;
  maxPrice?: number;
}
