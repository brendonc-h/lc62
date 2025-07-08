import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

// Create reusable transporter with proper error handling
const createTransporter = async (): Promise<Transporter<SMTPTransport.SentMessageInfo>> => {
  try {
    // For development environment, try to use Ethereal test account
    if (process.env.NODE_ENV !== 'production') {
      try {
        console.log('Attempting to create Ethereal test account');
        const testAccount = await nodemailer.createTestAccount();
        console.log('Ethereal test account created successfully');
        
        return nodemailer.createTransport({
          host: 'smtp.ethereal.email',
          port: 587,
          secure: false,
          auth: {
            user: testAccount.user,
            pass: testAccount.pass,
          }
        });
      } catch (etherealError) {
        console.warn('Failed to create Ethereal account:', etherealError);
        console.log('Falling back to environment SMTP settings...');
      }
    }
    
    // Use configured SMTP settings (production or fallback)
    console.log('Using configured SMTP settings');
    const host = process.env.SMTP_HOST || 'smtp.zoho.com';
    const port = parseInt(process.env.SMTP_PORT || '587');
    const secure = process.env.SMTP_SECURE === 'true';
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASSWORD;

    if (!user || !pass) {
      throw new Error('Missing SMTP credentials in environment variables');
    }

    return nodemailer.createTransport({
      host,
      port,
      secure,
      auth: {
        user,
        pass,
      },
      tls: {
        rejectUnauthorized: false,
      },
      requireTLS: true,
    });
  } catch (error) {
    console.error('Error setting up email transport:', error);
    throw new Error('Failed to set up email transport');
  }
};

// Helper function to verify SMTP connection
const verifyTransport = async (transporter: Transporter): Promise<void> => {
  try {
    await transporter.verify();
    console.log('SMTP server is ready to accept messages');
  } catch (error) {
    console.error('SMTP Connection Error:', error);
    throw new Error('Failed to connect to email server');
  }
};

// Send a verification email to a new user
export const sendVerificationEmail = async (email: string, token: string): Promise<boolean> => {
  try {
    console.log('Creating email transporter for verification email');
    
    // Get transporter
    const transporter = await createTransporter();
    await verifyTransport(transporter);
    
    // Use the site URL from environment or fallback to Supabase URL
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const verificationUrl = `${siteUrl}/auth/callback?token=${token}`;
    
    console.log('Sending verification email to:', email);
    console.log('Verification URL:', verificationUrl);

    const mailOptions = {
      from: `"La Casita" <${process.env.EMAIL_FROM || 'noreply@lacasita.com'}>`,
      to: email,
      subject: 'Verify Your Email Address',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Welcome to La Casita!</h2>
          <p>Thank you for signing up. Please verify your email address by clicking the button below:</p>
          <a href="${verificationUrl}" style="
            display: inline-block;
            padding: 10px 20px;
            background-color: #ef4444;
            color: white;
            text-decoration: none;
            border-radius: 4px;
            margin: 15px 0;
          ">Verify Email Address</a>
          <p>Or copy and paste this link into your browser:</p>
          <p><a href="${verificationUrl}" style="color: #3b82f6; word-break: break-all;">${verificationUrl}</a></p>
          <p>This link will expire in 24 hours.</p>
          <p>If you didn't create an account with us, please ignore this email.</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    
    // Log preview URL for development
    if (process.env.NODE_ENV !== 'production') {
      // Using as any to avoid TypeScript errors with older nodemailer versions
      const previewUrl = nodemailer.getTestMessageUrl(info as any);
      if (previewUrl) {
        console.log('Preview URL:', previewUrl);
      }
    }

    console.log('Verification email sent successfully to:', email);
    return true;
  } catch (error) {
    console.error('Error sending verification email:', error);
    if (error && typeof error === 'object' && 'response' in error) {
      console.error('SMTP Error Response:', (error as any).response);
    }
    // Don't throw the error - instead return false to allow the application to continue
    return false;
  }
};

// Send a password reset email
export const sendPasswordResetEmail = async (email: string, token: string): Promise<boolean> => {
  try {
    console.log('Creating email transporter for password reset');
    
    // Get transporter
    const transporter = await createTransporter();
    await verifyTransport(transporter);

    const resetUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/reset-password?token=${token}`;
    
    console.log('Sending password reset email to:', email);
    console.log('Reset URL:', resetUrl);

    const mailOptions = {
      from: `"La Casita" <${process.env.EMAIL_FROM || 'noreply@lacasita.com'}>`,
      to: email,
      subject: 'Password Reset Request',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Password Reset</h2>
          <p>You requested a password reset. Click the button below to set a new password:</p>
          <a href="${resetUrl}" style="
            display: inline-block;
            padding: 10px 20px;
            background-color: #ef4444;
            color: white;
            text-decoration: none;
            border-radius: 4px;
            margin: 15px 0;
          ">Reset Password</a>
          <p>Or copy and paste this link into your browser:</p>
          <p><a href="${resetUrl}" style="color: #3b82f6; word-break: break-all;">${resetUrl}</a></p>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request this, please ignore this email.</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    
    // Log preview URL for development
    if (process.env.NODE_ENV !== 'production') {
      // Using as any to avoid TypeScript errors with older nodemailer versions
      const previewUrl = nodemailer.getTestMessageUrl(info as any);
      if (previewUrl) {
        console.log('Preview URL:', previewUrl);
      }
    }

    console.log('Password reset email sent successfully to:', email);
    return true;
  } catch (error) {
    console.error('Error sending password reset email:', error);
    if (error && typeof error === 'object' && 'response' in error) {
      console.error('SMTP Error Response:', (error as any).response);
    }
    // Don't throw the error - instead return false to allow the application to continue
    return false;
  }
};
