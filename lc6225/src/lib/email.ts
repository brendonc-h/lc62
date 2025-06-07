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
  return {
    host: process.env.SMTP_HOST || 'smtp.zoho.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  };
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  try {
    console.log('Creating transporter...');
    const transportConfig = await createTestAccount();
    console.log('Transport config:', JSON.stringify({
      ...transportConfig,
      auth: { user: transportConfig.auth.user, pass: '***' } // Don't log actual password
    }, null, 2));
    
    const transporter = nodemailer.createTransport(transportConfig);
    
    // Verify connection configuration
    await new Promise((resolve, reject) => {
      transporter.verify(function(error, success) {
        if (error) {
          console.error('SMTP connection error:', error);
          reject(error);
        } else {
          console.log('SMTP server is ready to take our messages');
          resolve(success);
        }
      });
    });

    const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${token}`;
    console.log('Reset URL:', resetUrl);
    
    const mailOptions = {
      from: 'brendon.curry-hobbs@hhsystems.org',
      to: email,
      subject: 'Reset Your Password',
      html: `
        <p>You requested a password reset. Click the link below to set a new password:</p>
        <p><a href="${resetUrl}">Reset Password</a></p>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `,
    };

    console.log('Sending email with options:', {
      ...mailOptions,
      html: mailOptions.html ? '***HTML CONTENT***' : undefined
    });
    
    const info = await transporter.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId);
    
    if (process.env.NODE_ENV === 'development') {
      const previewUrl = nodemailer.getTestMessageUrl(info);
      console.log('Preview URL:', previewUrl);
    }

    return info;
  } catch (error: unknown) {
    console.error('Error sending email:', error);
    if (error && typeof error === 'object' && 'response' in error) {
      console.error('SMTP Error Response:', (error as any).response);
    }
    throw error;
  }
};
