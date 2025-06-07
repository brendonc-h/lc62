import { NextResponse } from 'next/server';
import { getUsersCollection, getPasswordResetTokensCollection } from '@/lib/db';
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

    // Find the token
    const tokens = await getPasswordResetTokensCollection();
    const resetToken = await tokens.findOne({
      token,
      expires: { $gt: new Date() },
    });

    if (!resetToken) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 400 }
      );
    }

    // Update the user's password
    const users = await getUsersCollection();
    const hashedPassword = await hash(password, 12);
    
    await users.updateOne(
      { _id: resetToken.userId },
      { $set: { password: hashedPassword } }
    );

    // Delete the used token
    await tokens.deleteOne({ token });

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
