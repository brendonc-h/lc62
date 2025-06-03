import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { connectToDatabase } from '@/lib/mongodb';

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

    const { db } = await connectToDatabase();

    // Check if user exists
    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    // Create user
    const hashedPassword = await hash(password, 12);
    const now = new Date();
    
    await db.collection<User>('users').insertOne({
      email: email.toLowerCase(),
      name,
      password: hashedPassword,
      points: 0,
      createdAt: now,
      updatedAt: now
    });

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
