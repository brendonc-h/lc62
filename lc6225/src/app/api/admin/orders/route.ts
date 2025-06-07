export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';

// Add any admin emails here
const ADMIN_EMAILS = ['admin@example.com', 'brendon1798@gmail.com', 'info@lacasita.io'];

export async function GET() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;

  if (!email || !ADMIN_EMAILS.includes(email)) {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  try {
    const { db } = await connectToDatabase();
    const orders = await db
      .collection('orders')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    const safe = orders.map((o) => ({ id: o._id.toString(), ...o, _id: undefined }));
    return NextResponse.json(safe);
  } catch (error) {
    console.error('Admin orders error:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}
