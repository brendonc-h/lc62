import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { sendPasswordResetEmail } from '@/lib/email';
import { v4 as uuidv4 } from 'uuid';


// Helper function to mask sensitive information in logs
const maskEmail = (email: string) => {
  if (!email) return 'undefined';
  const [name, domain] = email.split('@');
  if (!name || !domain) return 'invalid-email';
  const maskedName = name.length > 2 
    ? name[0] + '*'.repeat(Math.min(name.length - 2, 3)) + name.slice(-1)
    : name[0] + '*';
  return `${maskedName}@${domain}`;
};

export const runtime = 'nodejs';

export async function POST(request: Request) {
  console.log('Received password reset request');
  
  try {
    const { email } = await request.json();
    console.log('Request email:', maskEmail(email));

    if (!email) {
      console.error('No email provided in request');
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Look up user in Supabase customers table
    const { data: user, error: userError } = await supabase
      .from('customers')
      .select('*')
      .eq('email', email.toLowerCase())
      .single();

    if (userError || !user) {
      console.log('No user found with email:', maskEmail(email));
      // Don't reveal that the email doesn't exist
      return NextResponse.json(
        { message: 'If an account with that email exists, you will receive a password reset link' },
        { status: 200 }
      );
    }

    console.log('User found, generating reset token...');
    // Generate a reset token
    const token = uuidv4();
    const expires = new Date();
    expires.setHours(expires.getHours() + 1); // Token expires in 1 hour

    // Store the token in Supabase
    console.log('Storing reset token in Supabase...');
    const { error: tokenError } = await supabase
      .from('password_reset_tokens')
      .insert([
        {
          token,
          customer_id: user.id,
          email: user.email,
          expires: expires.toISOString(),
          used: false,
          created_at: new Date().toISOString(),
        },
      ]);

    if (tokenError) {
      console.error('Failed to store reset token:', tokenError);
      return NextResponse.json(
        { error: 'Failed to process password reset request' },
        { status: 500 }
      );
    }

    console.log('Sending password reset email...');
    // Send the email
    try {
      await sendPasswordResetEmail(user.email, token);
      console.log('Password reset email sent successfully');
    } catch (emailError) {
      console.error('Failed to send password reset email:', emailError);
      // Don't expose the error details to the client
      return NextResponse.json(
        { error: 'Failed to send password reset email. Please try again later.' },
        { status: 500 }
      );
    }

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
