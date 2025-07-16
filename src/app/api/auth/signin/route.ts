export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabaseClient';

export async function POST(request: Request) {
  console.log('Starting signin process');
  
  const supabase = createClient();
  
  try {
    const { email, password } = await request.json();
    console.log('Received signin request for:', email);

    // Basic validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Attempt to sign in with Supabase
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email: email.toLowerCase().trim(),
      password: password.trim(),
    });

    if (signInError) {
      console.error('Signin error:', signInError);
      
      // Handle specific error cases
      if (signInError.message.includes('Invalid login credentials')) {
        return NextResponse.json(
          { error: 'Invalid email or password' },
          { status: 401 }
        );
      } else if (signInError.message.includes('Email not confirmed')) {
        return NextResponse.json(
          { 
            error: 'Please check your email to confirm your account before signing in.',
            code: 'EMAIL_NOT_CONFIRMED'
          },
          { status: 401 }
        );
      } else if (signInError.message.includes('Too many requests')) {
        return NextResponse.json(
          { error: 'Too many signin attempts. Please wait a moment and try again.' },
          { status: 429 }
        );
      } else {
        return NextResponse.json(
          { error: signInError.message || 'Failed to sign in' },
          { status: 401 }
        );
      }
    }

    if (!data?.user) {
      return NextResponse.json(
        { error: 'No user data returned' },
        { status: 500 }
      );
    }

    console.log('User signed in successfully:', data.user.id);

    // Check if user has a customer record
    const { data: customerData, error: customerError } = await supabase
      .from('customers')
      .select('id, name, email, role')
      .eq('auth_id', data.user.id)
      .single();

    if (customerError && customerError.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error fetching customer data:', customerError);
    }

    // If no customer record exists, create one
    if (!customerData) {
      console.log('Creating customer record for user:', data.user.id);
      
      const { error: createCustomerError } = await supabase
        .from('customers')
        .insert({
          auth_id: data.user.id,
          name: `${data.user.user_metadata?.firstName || ''} ${data.user.user_metadata?.lastName || ''}`.trim() || 'User',
          first_name: data.user.user_metadata?.firstName || '',
          last_name: data.user.user_metadata?.lastName || '',
          email: data.user.email,
          role: 'customer',
          points: 0
        });

      if (createCustomerError) {
        console.error('Failed to create customer record:', createCustomerError);
        // Don't fail signin if customer record creation fails
      }
    }

    return NextResponse.json(
      {
        message: 'Signed in successfully',
        user: {
          id: data.user.id,
          email: data.user.email,
          role: customerData?.role || 'customer'
        },
        session: data.session
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Unhandled signin error:', error);
    return NextResponse.json(
      { error: 'Failed to process signin request', details: String(error) },
      { status: 500 }
    );
  }
}
