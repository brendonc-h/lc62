import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { hash } from 'bcryptjs';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json(
        { error: 'Token and password are required' },
        { status: 400 }
      );
    }

    // Find the token in Supabase
    const { data: resetToken, error: tokenError } = await supabase
      .from('password_reset_tokens')
      .select('*')
      .eq('token', token)
      .gt('expires', new Date().toISOString())
      .eq('used', false)
      .single();

    if (tokenError || !resetToken) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 400 }
      );
    }

    // Update the user's password in Supabase
    const hashedPassword = await hash(password, 12);
    const { error: userUpdateError } = await supabase
      .from('customers')
      .update({ password: hashedPassword, updated_at: new Date().toISOString() })
      .eq('id', resetToken.customer_id);

    if (userUpdateError) {
      return NextResponse.json(
        { error: 'Failed to update password' },
        { status: 500 }
      );
    }

    // Mark the token as used in Supabase
    const { error: tokenUpdateError } = await supabase
      .from('password_reset_tokens')
      .update({ used: true })
      .eq('token', token);

    if (tokenUpdateError) {
      return NextResponse.json(
        { error: 'Failed to update token' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Password has been reset successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { error: 'Failed to reset password' },
      { status: 500 }
    );
  }
}
