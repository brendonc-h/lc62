import nodemailer from 'nodemailer';

// Create a test account for development
const createTestAccount = async () => {
  if (process.env.NODE_ENV !== 'production') {
    console.log('Using Ethereal test account for development');
    const testAccount = await nodemailer.createTestAccount();
    return {
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    };
  }
  
  // In production, use Zoho SMTP settings
  console.log('Using Zoho SMTP for production');
  const host = process.env.SMTP_HOST || 'smtp.zoho.com';
  const port = parseInt(process.env.SMTP_PORT || '587');
  const secure = process.env.SMTP_SECURE === 'true';
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;

  if (!user || !pass) {
    console.error('Missing SMTP credentials');
    throw new Error('Missing SMTP credentials');
  }

  return {
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
    // Add these options to handle special characters and improve reliability
    tls: {
      rejectUnauthorized: false,
    },
    requireTLS: true,
  };
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  let transporter;
  try {
    console.log('Creating email transporter with config:', {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      user: process.env.SMTP_USER ? '***' : 'not set',
      environment: process.env.NODE_ENV
    });

    const smtpConfig = await createTestAccount();
    console.log('SMTP Configuration:', {
      ...smtpConfig,
      auth: { user: smtpConfig.auth.user ? '***' : 'not set' }
    });

    transporter = nodemailer.createTransport(smtpConfig);
    
    // Verify connection configuration
    try {
      await transporter.verify();
      console.log('Server is ready to take our messages');
    } catch (verifyError) {
      console.error('SMTP Connection Error:', verifyError);
      throw new Error('Failed to connect to email server');
    }

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
    
    // If using ethereal for testing, log the preview URL
    if (process.env.NODE_ENV !== 'production') {
      const previewUrl = nodemailer.getTestMessageUrl(info);
      console.log('Preview URL:', previewUrl);
    }

    console.log('Password reset email sent successfully to:', email);
    return true;
  } catch (error: unknown) {
    console.error('Error sending email:', error);
    if (error && typeof error === 'object' && 'response' in error) {
      console.error('SMTP Error Response:', (error as any).response);
    }
    throw error;
  }
};
