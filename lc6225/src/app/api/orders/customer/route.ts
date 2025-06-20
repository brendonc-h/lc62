export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { supabase } from '@/lib/supabaseClient';

// Returns the current user's orders, newest first
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { data: orders, error } = await supabase
      .from('orders')
      .select('*')
      .eq('customerEmail', session.user.email)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Customer orders error:', error);
      return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
    }

    type Order = {
      id: string;
      [key: string]: any;
    };
    return NextResponse.json(
      (orders as Order[]).map((o) => ({ id: o.id, ...o }))
    );
  } catch (err) {
    console.error('Customer orders error:', err);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}
