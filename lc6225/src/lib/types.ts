export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
};

export type OrderDetails = {
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  customerInfo: CustomerInfo;
};

export type CustomerInfo = {
  name: string;
  email: string;
  phone: string;
  orderType: 'pickup' | 'delivery';
  address?: string;
  specialInstructions?: string;
};
