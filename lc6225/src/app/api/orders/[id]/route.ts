export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: 'Invalid order id' }, { status: 400 });
  }

  try {
    const { db } = await connectToDatabase();
    const doc = await db.collection('orders').findOne({ _id: new ObjectId(id) });

    if (!doc) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ id, ...doc, _id: undefined });
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 });
  }
}
