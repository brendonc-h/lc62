export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { createClient } from '@/lib/supabaseClient';
import { sendVerificationEmail } from '@/lib/email';

// For debugging
const ENV_DEBUG = {
  SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NODE_ENV: process.env.NODE_ENV,
};

type User = {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;
  points: number;
  createdAt: Date;
  updatedAt: Date;
};

export async function POST(request: Request) {
  console.log('Starting signup process');
  console.log('Environment variables:', ENV_DEBUG);
  
  try {
    const { email, firstName, lastName, password, confirmPassword } = await request.json();
    console.log('Received signup request for:', email);

    // Basic validation
    if (!email || !firstName || !lastName || !password || !confirmPassword) {
      return NextResponse.json(
        { error: 'Email, first name, last name, password, and password confirmation are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }
    
    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: 'Passwords do not match' },
        { status: 400 }
      );
    }

    console.log('Creating Supabase client (server-side)');
    const supabase = createClient();
    
    // Create user in Supabase Auth and corresponding profile in the customers table
    console.log('Attempting to create user in Supabase Auth...');
    try {
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: email.toLowerCase().trim(),
        password: password.trim(),
        options: {
          data: {
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            role: 'customer',
            points: 0
          },
          // Use process.env.NEXT_PUBLIC_SITE_URL without hardcoded fallback
          emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`
        }
      });
      
      if (signUpError) {
        console.error('Signup error:', signUpError);

        // Handle specific error types
        if (signUpError.message?.includes('rate limit') || signUpError.status === 429) {
          return NextResponse.json(
            { error: 'Too many signup attempts. Please wait a few minutes and try again.' },
            { status: 429 }
          );
        }

        if (signUpError.message?.includes('already registered')) {
          return NextResponse.json(
            { error: 'An account with this email already exists. Please sign in instead.' },
            { status: 400 }
          );
        }

        return NextResponse.json(
          { error: signUpError.message || 'Failed to create account' },
          { status: 500 }
        );
      }
      
      if (!signUpData?.user) {
        console.error('No user data returned from signup');
        return NextResponse.json(
          { error: 'Failed to create user account' },
          { status: 500 }
        );
      }

      console.log('User created successfully:', signUpData.user.id);
      
      // Try to send a custom verification email
      try {
        if (signUpData.user.email) {
          console.log('Sending verification email to', signUpData.user.email);
          // Generate a verification token - in a real app, you might want to store this
          // or use Supabase's built-in token
          const token = signUpData.user.id;
          const emailSent = await sendVerificationEmail(signUpData.user.email, token);
          
          if (emailSent) {
            console.log('Custom verification email sent successfully');
          } else {
            console.warn('Failed to send email but continuing with signup');
          }
        }
      } catch (emailError) {
        console.error('Failed to send custom verification email:', emailError);
        // We'll continue with the signup process even if the email fails
        // as Supabase will handle the verification email as a fallback
      }
    
      // Insert into customers table
      console.log('Creating customer record with ID:', signUpData.user.id);
      
      // First check if a customer record already exists to avoid duplicates
      const { data: existingCustomer } = await supabase
        .from('customers')
        .select('id, email')
        .eq('auth_id', signUpData.user.id)
        .single();
        
      if (existingCustomer) {
        console.log('Customer record already exists:', existingCustomer);
      } else {
        // Insert new customer record
        const { error: customerError } = await supabase
          .from('customers')
          .insert({
            auth_id: signUpData.user.id,
            name: `${firstName.trim()} ${lastName.trim()}`,
            first_name: firstName.trim(),
            last_name: lastName.trim(),
            email: email.toLowerCase().trim(),
            role: 'customer',
            points: 0
          });

        if (customerError) {
          console.error('Customer creation error:', customerError);
          
          // Log more detailed information about the error
          if (customerError.details) {
            console.error('Error details:', customerError.details);
          }
          
          if (customerError.hint) {
            console.error('Error hint:', customerError.hint);
          }
          
          if (customerError.message) {
            console.error('Error message:', customerError.message);
          }
          
          return NextResponse.json(
            { error: 'Account created, but there was an error setting up your profile', details: customerError },
            { status: 500 }
          );
        }
      }
      
      console.log('Signup process completed successfully');
      return NextResponse.json(
        { message: 'User created successfully' },
        { status: 201 }
      );
      
    } catch (authError) {
      console.error('Error during auth.signUp operation:', authError);
      return NextResponse.json(
        { error: 'Authentication service error', details: String(authError) },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Unhandled signup error:', error);
    return NextResponse.json(
      { error: 'Failed to process signup request', details: String(error) },
      { status: 500 }
    );
  }
}
