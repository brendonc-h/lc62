import { SpiceLevel } from '@/data/menu';

export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  variant?: string;
  spiceLevel?: SpiceLevel;
};

export type OrderStatus = 'preparing' | 'ready' | 'completed' | 'cancelled';

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
  orderType?: 'pickup' | 'delivery';
  variant?: string;
  spiceLevel?: SpiceLevel;
};

export type CustomerInfo = {
  name: string;
  email: string;
  phone: string;
  orderType: 'pickup' | 'delivery';
  address?: string;
  specialInstructions?: string;
};
