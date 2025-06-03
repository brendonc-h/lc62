export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { OrderDetails } from '@/lib/types';

export async function POST(request: Request) {
  try {
    const order: OrderDetails = await request.json();
    const { db } = await connectToDatabase();

    const doc = {
      ...order,
      status: 'preparing',
      createdAt: new Date(),
    };

    const result = await db.collection('orders').insertOne(doc);
    return NextResponse.json({ id: result.insertedId.toString() }, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
