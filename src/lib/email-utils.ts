import { OrderDetails, CustomerInfo } from './types';
import nodemailer from 'nodemailer';
// Import from email.ts (not email-fixed.ts)
import nodemailerTransport from 'nodemailer/lib/smtp-transport';
import type { Transporter } from 'nodemailer';

// Copy required functions from email.ts since they're not exported
// Create reusable transporter with proper error handling
const createTransporter = async (): Promise<Transporter<nodemailerTransport.SentMessageInfo>> => {
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

// Send order confirmation email to customer
export const sendOrderConfirmationEmail = async (orderDetails: OrderDetails): Promise<boolean> => {
  try {
    const { customerInfo, items, subtotal, tax, total } = orderDetails;
    
    // Get transporter
    const transporter = await createTransporter();
    await verifyTransport(transporter);
    
    const mailOptions = {
      from: `"La Casita" <${process.env.EMAIL_FROM || 'orders@lacasita.com'}>`,
      to: customerInfo.email,
      subject: `Order Confirmation #${orderDetails.id}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Thank You for Your Order!</h2>
          <p>Hi ${customerInfo.name},</p>
          <p>We've received your order and are preparing it for pickup at our ${items[0].location} location.</p>
          
          <h3>Order Details (#${orderDetails.id})</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background-color: #f3f4f6;">
                <th style="padding: 8px; text-align: left; border-bottom: 1px solid #e5e7eb;">Item</th>
                <th style="padding: 8px; text-align: right; border-bottom: 1px solid #e5e7eb;">Qty</th>
                <th style="padding: 8px; text-align: right; border-bottom: 1px solid #e5e7eb;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${items.map(item => `
                <tr>
                  <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">
                    ${item.name}
                    ${item.specialRequest ? `<br><small><em>Note: ${item.specialRequest}</em></small>` : ''}
                  </td>
                  <td style="padding: 8px; text-align: right; border-bottom: 1px solid #e5e7eb;">${item.quantity}</td>
                  <td style="padding: 8px; text-align: right; border-bottom: 1px solid #e5e7eb;">$${(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="2" style="padding: 8px; text-align: right; font-weight: bold;">Subtotal:</td>
                <td style="padding: 8px; text-align: right;">$${subtotal.toFixed(2)}</td>
              </tr>
              <tr>
                <td colspan="2" style="padding: 8px; text-align: right; font-weight: bold;">Tax:</td>
                <td style="padding: 8px; text-align: right;">$${tax.toFixed(2)}</td>
              </tr>
              <tr style="background-color: #f9fafb;">
                <td colspan="2" style="padding: 8px; text-align: right; font-weight: bold;">Total:</td>
                <td style="padding: 8px; text-align: right; font-weight: bold;">$${total.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
          
          <div style="margin-top: 24px; padding: 16px; background-color: #f3f4f6; border-radius: 4px;">
            <h4 style="margin-top: 0;">Pickup Information:</h4>
            <p><strong>Location:</strong> La Casita ${items[0].location}</p>
            <p><strong>Address:</strong> ${items[0].location === 'Berthoud' ? 
              '950 Mountain Ave, Berthoud, CO 80513' : 
              '2909 E Harmony Rd, Fort Collins, CO 80528'}</p>
            <p><strong>Pickup Time:</strong> Your order should be ready in approximately 20-30 minutes.</p>
            <p>You'll receive another email when your order is ready for pickup.</p>
          </div>
          
          <p style="margin-top: 24px;">Thank you for choosing La Casita!</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('Order confirmation email sent to customer:', customerInfo.email);
    
    return true;
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
    return false;
  }
};

// Send order notification to the appropriate location admin
export const sendOrderNotificationToAdmin = async (orderDetails: OrderDetails): Promise<boolean> => {
  try {
    // Determine which location email to send to based on the first item's location
    // (all items in an order will have the same location)
    const location = orderDetails.items[0]?.location || 'Unknown';
    const locationEmail = location === 'Berthoud' ? 'berthoud@lacasita.io' : 'fortcollins@lacasita.io';
    
    // Get transporter
    const transporter = await createTransporter();
    await verifyTransport(transporter);
    
    const mailOptions = {
      from: `"La Casita Orders" <${process.env.EMAIL_FROM || 'orders@lacasita.com'}>`,
      to: locationEmail,
      // Also CC the main admin for backup
      cc: 'info@lacasita.io',
      subject: `New Order #${orderDetails.id} - ${location} Location`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>New Order Received - ${location} Location</h2>
          <p><strong>Order #${orderDetails.id}</strong> has been received and needs to be prepared.</p>
          
          <div style="padding: 12px; background-color: #f9fafb; border-left: 4px solid #ef4444; margin: 16px 0;">
            <p><strong>Customer Information:</strong></p>
            <p><strong>Name:</strong> ${orderDetails.customerInfo.name}</p>
            <p><strong>Phone:</strong> ${orderDetails.customerInfo.phone}</p>
            <p><strong>Email:</strong> ${orderDetails.customerInfo.email}</p>
          </div>
          
          <h3>Order Details:</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background-color: #f3f4f6;">
                <th style="padding: 8px; text-align: left; border-bottom: 1px solid #e5e7eb;">Item</th>
                <th style="padding: 8px; text-align: right; border-bottom: 1px solid #e5e7eb;">Qty</th>
                <th style="padding: 8px; text-align: right; border-bottom: 1px solid #e5e7eb;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${orderDetails.items.map(item => `
                <tr>
                  <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">
                    ${item.name}
                    ${item.specialRequest ? `<br><small><em>Note: ${item.specialRequest}</em></small>` : ''}
                  </td>
                  <td style="padding: 8px; text-align: right; border-bottom: 1px solid #e5e7eb;">${item.quantity}</td>
                  <td style="padding: 8px; text-align: right; border-bottom: 1px solid #e5e7eb;">$${(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="2" style="padding: 8px; text-align: right; font-weight: bold;">Subtotal:</td>
                <td style="padding: 8px; text-align: right;">$${orderDetails.subtotal.toFixed(2)}</td>
              </tr>
              <tr>
                <td colspan="2" style="padding: 8px; text-align: right; font-weight: bold;">Tax:</td>
                <td style="padding: 8px; text-align: right;">$${orderDetails.tax.toFixed(2)}</td>
              </tr>
              <tr style="background-color: #f9fafb;">
                <td colspan="2" style="padding: 8px; text-align: right; font-weight: bold;">Total:</td>
                <td style="padding: 8px; text-align: right; font-weight: bold;">$${orderDetails.total.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
          
          <div style="margin-top: 24px;">
            <p>Please update the order status using the admin dashboard when you start preparing the order and when it's ready for pickup.</p>
            <p><a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin/orders" style="color: #ef4444;">Go to Admin Dashboard</a></p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Order notification email sent to ${location} admin:`, locationEmail);
    
    return true;
  } catch (error) {
    console.error('Error sending order notification email to admin:', error);
    return false;
  }
};

// Send order status update to customer
export const sendOrderStatusUpdateEmail = async (
  orderId: string,
  customerEmail: string,
  customerName: string,
  location: string,
  status: 'preparing' | 'in-progress' | 'ready' | 'completed' | 'cancelled',
  estimatedMinutes?: number
): Promise<boolean> => {
  try {
    // Get transporter
    const transporter = await createTransporter();
    await verifyTransport(transporter);
    
    let subject = '';
    let statusText = '';
    let additionalInfo = '';
    
    switch (status) {
      case 'in-progress':
        subject = `Order #${orderId} Update - We're Working on Your Order`;
        statusText = 'Your order is now being prepared';
        if (estimatedMinutes) {
          additionalInfo = `Our kitchen team has started preparing your delicious food. We estimate it will be ready in approximately ${estimatedMinutes} minutes. We'll let you know when it's ready for pickup!`;
        } else {
          additionalInfo = 'Our kitchen team has started preparing your delicious food. We\'ll let you know when it\'s ready for pickup!';
        }
        break;
      case 'ready':
        subject = `Order #${orderId} is Ready for Pickup!`;
        statusText = 'Your order is ready for pickup';
        additionalInfo = 'Please come to our ' + location + ' location to pick up your order. We look forward to seeing you!';
        break;
      case 'completed':
        subject = `Thank you for picking up your Order #${orderId}`;
        statusText = 'Your order has been completed';
        additionalInfo = 'Thank you for choosing La Casita! We hope you enjoyed your meal and look forward to serving you again soon.';
        break;
      case 'cancelled':
        subject = `Order #${orderId} - Cancellation Confirmation`;
        statusText = 'Your order has been cancelled';
        additionalInfo = 'If you have any questions about this cancellation, please contact us.';
        break;
      default:
        subject = `Order #${orderId} Status Update`;
        statusText = 'Your order status has been updated';
        additionalInfo = 'Check your account for more details.';
    }
    
    const mailOptions = {
      from: `"La Casita" <${process.env.EMAIL_FROM || 'orders@lacasita.com'}>`,
      to: customerEmail,
      subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>${statusText}</h2>
          <p>Hi ${customerName},</p>
          <p>${additionalInfo}</p>
          
          <div style="margin-top: 24px; padding: 16px; background-color: #f3f4f6; border-radius: 4px;">
            <h4 style="margin-top: 0;">Order Information:</h4>
            <p><strong>Order ID:</strong> #${orderId}</p>
            <p><strong>Location:</strong> La Casita ${location}</p>
            <p><strong>Address:</strong> ${location === 'Berthoud' ? 
              '950 Mountain Ave, Berthoud, CO 80513' : 
              '2909 E Harmony Rd, Fort Collins, CO 80528'}</p>
            ${status === 'ready' ? '<p><strong>Pickup:</strong> Your order is ready now and will be held for you at the counter.</p>' : ''}
          </div>
          
          <p style="margin-top: 24px;">Thank you for choosing La Casita!</p>
          <p>If you have any questions, please call us at ${location === 'Berthoud' ? '(970) 555-1234' : '(970) 555-5678'}.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Order status update email sent to customer:`, customerEmail);
    
    return true;
  } catch (error) {
    console.error('Error sending order status update email:', error);
    return false;
  }
};

export default {
  sendOrderConfirmationEmail,
  sendOrderNotificationToAdmin,
  sendOrderStatusUpdateEmail
};
