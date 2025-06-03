import { NextResponse } from 'next/server';

// This is a placeholder. In a real app, you would:
// 1. Verify admin authentication
// 2. Connect to your database
// 3. Fetch real orders
export async function GET() {
  // Simulated orders data
  const orders = [
    {
      id: '1',
      createdAt: new Date().toISOString(),
      items: [
        { id: '1', name: 'Carne Asada Tacos', quantity: 2, price: 12.99 },
        { id: '2', name: 'Guacamole', quantity: 1, price: 5.99 },
      ],
      subtotal: 31.97,
      tax: 2.56,
      total: 34.53,
      status: 'preparing',
      customerInfo: {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '(555) 123-4567',
        orderType: 'pickup',
      },
      estimatedTime: 25, // minutes
    },
  ];

  return NextResponse.json(orders);
}
