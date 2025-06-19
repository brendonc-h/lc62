export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { OrderDetails } from '@/lib/types';

export async function POST(request: Request) {
  try {
    const order: OrderDetails = await request.json();
    
    // Validate required fields
    if (!order.items || order.items.length === 0) {
      return NextResponse.json({ error: 'Order must contain items' }, { status: 400 });
    }
    
    if (!order.customerInfo || !order.customerInfo.name || !order.customerInfo.email || !order.customerInfo.phone) {
      return NextResponse.json({ error: 'Customer information is required' }, { status: 400 });
    }

    const { db } = await connectToDatabase();

    const doc = {
      ...order,
      status: order.status || 'preparing',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection('orders').insertOne(doc);
    
    return NextResponse.json({ 
      id: result.insertedId.toString(),
      message: 'Order placed successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ 
      error: 'Failed to create order',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}