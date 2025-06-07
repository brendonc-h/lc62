import { NextResponse } from 'next/server';
import { getUsersCollection, getPasswordResetTokensCollection } from '@/lib/db';
import { sendPasswordResetEmail } from '@/lib/email';
import { v4 as uuidv4 } from 'uuid';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const users = await getUsersCollection();
    const user = await users.findOne({ email });

    if (!user) {
      // Don't reveal that the email doesn't exist
      return NextResponse.json(
        { message: 'If an account with that email exists, you will receive a password reset link' },
        { status: 200 }
      );
    }

    // Generate a reset token
    const token = uuidv4();
    const expires = new Date();
    expires.setHours(expires.getHours() + 1); // Token expires in 1 hour

    // Store the token in the database
    const tokens = await getPasswordResetTokensCollection();
    await tokens.insertOne({
      token,
      userId: user._id,
      email,
      expires,
    });

    // Send the email
    await sendPasswordResetEmail(email, token);

    return NextResponse.json(
      { message: 'If an account with that email exists, you will receive a password reset link' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'Failed to process password reset request' },
      { status: 500 }
    );
  }
}
