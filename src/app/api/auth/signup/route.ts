export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { createClient } from '@/lib/supabaseClient';

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
  try {
    const { email, firstName, lastName, password, confirmPassword } = await request.json();

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

    const supabase = createClient();
    
    // Create user in Supabase Auth and corresponding profile in the customers table
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: email.toLowerCase().trim(),
      password: password.trim(),
      options: {
        data: {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          role: 'customer',
          points: 0
        }
      }
    });
    
    if (signUpError) {
      console.error('Signup error:', signUpError);
      return NextResponse.json(
        { error: signUpError.message || 'Failed to create account' },
        { status: 500 }
      );
    }
    
    if (!signUpData.user) {
      return NextResponse.json(
        { error: 'Failed to create user account' },
        { status: 500 }
      );
    }
    
    // Insert into customers table
    console.log('Creating customer record with ID:', signUpData.user.id);
    
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

    return NextResponse.json(
      { message: 'User created successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}
