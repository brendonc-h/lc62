import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabaseClient';
import { client } from '@/lib/square-client';
import { sendOrderConfirmationEmail, sendOrderNotificationToAdmin } from '@/lib/email-utils';
import { OrderDetails } from '@/lib/types';

import crypto from 'crypto';

// Verify Square webhook signatures
const verifySquareSignature = (signature: string, body: string) => {
  // Skip verification in development for easier testing
  if (process.env.NODE_ENV !== 'production') {
    console.warn('Webhook signature verification skipped in development mode');
    return true;
  }
  
  try {
    // Get the signature key from environment variables
    const signatureKey = process.env.SQUARE_WEBHOOK_SIGNATURE_KEY;
    if (!signatureKey) {
      console.error('Missing SQUARE_WEBHOOK_SIGNATURE_KEY environment variable');
      return false;
    }
    
    // Create an HMAC using the signature key
    const hmac = crypto.createHmac('sha256', signatureKey);
    hmac.update(body);
    
    // Get the signature as base64
    const calculatedSignature = hmac.digest('base64');
    
    // Compare with the provided signature
    return crypto.timingSafeEqual(
      Buffer.from(calculatedSignature),
      Buffer.from(signature)
    );
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return false;
  }
};

export async function POST(req: Request) {
  const supabase = createClient();
  
  try {
    const signature = req.headers.get('square-signature') || '';
    const rawBody = await req.text();
    
    // Verify the webhook signature from Square
    if (!verifySquareSignature(signature, rawBody)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }
    
    const payload = JSON.parse(rawBody);
    const { type, data } = payload;

    // Handle payment completed events
    if (type === 'payment.updated' && data?.object?.payment?.status === 'COMPLETED') {
      const paymentId = data.object.payment.id;
      const orderId = data.object.payment.order_id;
      
      if (!orderId) {
        console.error('No order ID found in payment webhook');
        return NextResponse.json({ status: 'no order id' }, { status: 200 });
      }
      
      // Get order details from Square using ordersApi
      const { result } = await client.ordersApi.retrieveOrder(orderId);
      if (!result?.order) {
        return NextResponse.json({ status: 'order not found' }, { status: 200 });
      }
      
      const squareOrder = result.order;
      // Use type assertion to tell TypeScript about the structure
      const metadata = (squareOrder.metadata || {}) as Record<string, string>;
      const location = metadata.location || '';
      
      // Extract customer info from order
      const customerName = metadata.customerName || '';
      
      // Type assertions to handle the fulfillments structure
      type FulfillmentType = {
        shipmentDetails?: {
          recipient?: {
            emailAddress?: string;
            phoneNumber?: string;
          };
        };
      };
      
      const fulfillments = (squareOrder.fulfillments || []) as FulfillmentType[];
      const buyerEmail = fulfillments[0]?.shipmentDetails?.recipient?.emailAddress || '';
      const buyerPhone = fulfillments[0]?.shipmentDetails?.recipient?.phoneNumber || '';
      
      // Create order in our database
      const orderItems = squareOrder.lineItems?.map((item: any) => ({
        id: item.uid || '',
        name: item.name || '',
        quantity: parseInt(item.quantity) || 1,
        price: parseFloat(item.basePriceMoney?.amount?.toString() || '0') / 100,
        image: '', // We don't have this from Square
        location: location,
        specialRequest: item.note || ''
      })) || [];
      
      // Calculate order totals
      const subtotal = parseFloat(squareOrder.netAmountDueMoney?.amount?.toString() || '0') / 100;
      const tax = parseFloat(squareOrder.totalTaxMoney?.amount?.toString() || '0') / 100;
      const total = parseFloat(squareOrder.totalMoney?.amount?.toString() || '0') / 100;
      
      // Insert order into our database
      const { data: insertedOrder, error } = await supabase
        .from('orders')
        .insert({
          square_order_id: orderId,
          square_payment_id: paymentId,
          total_price: total,
          status: 'preparing',
          customer_name: customerName,
          customer_email: buyerEmail,
          customer_phone: buyerPhone,
          location: location,
          items_json: JSON.stringify(orderItems),
        })
        .select()
        .single();
        
      if (error) {
        console.error('Error inserting order:', error);
        return NextResponse.json({ status: 'db error', message: error.message }, { status: 200 });
      }
      
      // Create order details for email notifications
      const orderDetails: OrderDetails = {
        id: insertedOrder.id,
        items: orderItems,
        subtotal,
        tax,
        total,
        status: 'preparing',
        createdAt: new Date().toISOString(),
        customerInfo: {
          name: customerName,
          email: buyerEmail,
          phone: buyerPhone,
        }
      };
      
      // Send email notifications
      await Promise.all([
        sendOrderConfirmationEmail(orderDetails),
        sendOrderNotificationToAdmin(orderDetails)
      ]);
      
      return NextResponse.json({ status: 'success', orderId: insertedOrder.id }, { status: 200 });
    }
    
    // Handle other webhook types
    return NextResponse.json({ status: 'ignored', type }, { status: 200 });
    
  } catch (error) {
    console.error('Error processing Square webhook:', error);
    return NextResponse.json(
      { error: 'Error processing webhook' },
      { status: 500 }
    );
  }
}
