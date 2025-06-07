export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { connectToDatabase } from '@/lib/mongodb';

// Returns the current user's orders, newest first
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { db } = await connectToDatabase();
    const orders = await db
      .collection('orders')
      .find({ customerEmail: session.user.email })
      .sort({ createdAt: -1 })
      .toArray();

    // Strip _id & convert to string id
    return NextResponse.json(
      orders.map((o) => ({ id: o._id.toString(), ...o, _id: undefined }))
    );
  } catch (err) {
    console.error('Customer orders error:', err);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}
