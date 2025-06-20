export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { supabase } from '@/lib/supabaseClient';

// Add any admin emails here
const ADMIN_EMAILS = ['brendon1798@gmail.com', 'info@lacasita.io'];

export async function GET() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;

  if (!email || !ADMIN_EMAILS.includes(email)) {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  try {
    const { data: orders, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Admin orders error:', error);
      return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
    }

    const safe = orders.map((o) => ({ id: o.id, ...o }));
    return NextResponse.json(safe);
  } catch (error) {
    console.error('Admin orders error:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}
