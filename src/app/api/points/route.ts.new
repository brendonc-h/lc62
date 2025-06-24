export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Get the current user's session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session?.user?.email) {
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

    // Get current points
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

    // Update points
    const { data: updatedUser, error: updateError } = await supabase
      .from('users')
      .update({
        points: (user.points || 0) + amount,
        updated_at: new Date().toISOString(),
      })
      .eq('email', session.user.email)
      .select('points')
      .single();

    if (updateError || !updatedUser) {
      console.error('Error updating points:', updateError);
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
    console.error('Error in points API:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
