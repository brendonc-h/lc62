export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { ObjectId } from 'mongodb';

// Add any admin emails here
const ADMIN_EMAILS = ['brendon1798@gmail.com', 'info@lacasita.io', 'admin@lacasita.com'];

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;

  if (!email || !ADMIN_EMAILS.includes(email)) {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  const { id } = params;
  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: 'Invalid order id' }, { status: 400 });
  }

  try {
    const { status } = await request.json();
    
    if (!status || !['preparing', 'ready', 'completed', 'cancelled'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    
    const result = await db.collection('orders').updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          status,
          updatedAt: new Date()
        }
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Order status updated successfully' });
  } catch (error) {
    console.error('Update order status error:', error);
    return NextResponse.json({ error: 'Failed to update order status' }, { status: 500 });
  }
}