export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { supabase } from '@/lib/supabaseClient';

// Extend the session type to include our custom fields
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      points: number;
      role?: string;
    };
  }
}


export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { message: 'Not authenticated' },
        { status: 401 }
      );
    }

    const data = await request.json();
    const amount = Number(data?.amount);
    
    if (isNaN(amount) || amount <= 0 || !Number.isInteger(amount)) {
      return NextResponse.json(
        { message: 'Invalid amount. Please provide a positive number.' },
        { status: 400 }
      );
    }

    // Update user's points in Supabase
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('points')
      .eq('email', session.user.email)
      .single();

    if (userError || !user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    const { data: updatedUser, error: updateError } = await supabase
      .from('users')
      .update({
        points: (user.points || 0) + amount,
        updatedAt: new Date().toISOString(),
      })
      .eq('email', session.user.email)
      .select('points')
      .single();

    if (updateError || !updatedUser) {
      return NextResponse.json(
        { message: 'Failed to update points' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: 'Points updated successfully',
        newPoints: updatedUser.points,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating points:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
