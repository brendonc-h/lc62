export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { supabase } from '@/lib/supabaseClient';

type User = {
  email: string;
  name: string;
  password: string;
  points: number;
  createdAt: Date;
  updatedAt: Date;
};

export async function POST(request: Request) {
  try {
    const { email, name, password } = await request.json();

    // Basic validation
    if (!email || !name || !password) {
      return NextResponse.json(
        { error: 'Email, name, and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // Check if user exists in Supabase
    const { data: existingUser, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email.toLowerCase())
      .single();
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    // Create user in Supabase
    const hashedPassword = await hash(password, 12);
    const now = new Date().toISOString();

    const { error: insertError } = await supabase
      .from('users')
      .insert([
        {
          email: email.toLowerCase(),
          name,
          password: hashedPassword,
          points: 0,
          createdAt: now,
          updatedAt: now,
        },
      ]);

    if (insertError) {
      console.error('Signup error:', insertError);
      return NextResponse.json(
        { error: 'Failed to create user' },
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
