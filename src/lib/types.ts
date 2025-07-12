// Updated types for La Casita restaurant app

export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  variant?: string;
  specialRequest?: string;
  location: string;
};

export type OrderStatus = 'preparing' | 'in-progress' | 'ready' | 'completed' | 'cancelled';

export type OrderDetails = {
  id?: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  customerInfo: CustomerInfo;
  status?: OrderStatus;
  createdAt?: string | Date;
  estimatedTime?: number;
  orderType?: 'pickup';
  variant?: string;
  specialRequest?: string;
  location?: string;
  estimatedCompletionMinutes?: number;
};

export type CustomerInfo = {
  name: string;
  email: string;
  phone: string;
  specialInstructions?: string;
};
