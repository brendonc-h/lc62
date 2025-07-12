export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { OrderDetails } from '@/lib/types';
import { sendOrderConfirmationEmail, sendOrderNotificationToAdmin } from '@/lib/email-utils';
import { client } from '@/lib/square-client';

export async function POST(request: Request) {
  try {
    const orderRequest = await request.json();
    const order: OrderDetails = orderRequest;
    // Extract payment information if present
    const paymentMethod = orderRequest.paymentMethod || 'instore';
    const paymentId = orderRequest.paymentId || null;
    const paymentStatus = orderRequest.paymentStatus || null;
    
    // Verify that all items in the order have the same location
    const orderLocation = order.items[0]?.location;
    if (!orderLocation) {
      return NextResponse.json({ error: 'Order items must have a location' }, { status: 400 });
    }
    
    const locationMismatch = order.items.some(item => item.location !== orderLocation);
    if (locationMismatch) {
      return NextResponse.json({ 
        error: 'All items in an order must be from the same location'
      }, { status: 400 });
    }
    
    // If this is a Square payment, verify the payment status if we have a payment ID
    if (paymentMethod === 'online' && paymentId) {
      try {
        // Verify payment with Square using paymentsApi
        const { result } = await client.paymentsApi.getPayment(paymentId);
        if (result.payment?.status !== 'COMPLETED') {
          return NextResponse.json({ error: 'Payment not completed' }, { status: 400 });
        }
      } catch (squareError) {
        console.error('Error verifying Square payment:', squareError);
        // Continue if we can't verify (might be in sandbox mode)
      }
    }
    
    const doc = {
      ...order,
      status: 'preparing',
      createdAt: new Date().toISOString(),
      paymentMethod,
      paymentId,
      paymentStatus,
    };

    // Create a more database-friendly order structure
    const dbOrder = {
      customer_name: order.customerInfo.name,
      customer_email: order.customerInfo.email,
      customer_phone: order.customerInfo.phone,
      total_price: order.total,
      status: 'preparing',
      location: order.items[0]?.location || '',
      items_json: JSON.stringify(order.items),
      payment_method: paymentMethod,
      payment_id: paymentId,
      payment_status: paymentStatus,
      created_at: new Date().toISOString(),
      order_type: order.customerInfo.orderType || 'pickup',
      special_instructions: order.customerInfo.specialInstructions || '',
    };
    
    const { data, error } = await supabase
      .from('orders')
      .insert([dbOrder])
      .select('id')
      .single();

    if (error) {
      console.error('Error creating order:', error);
      return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
    }
    
    // Add the order ID to the order object for email notifications
    const orderWithId: OrderDetails = {
      ...order,
      id: data.id,
      status: 'preparing',
      createdAt: new Date().toISOString()
    };
    
    // Send confirmation email to customer
    try {
      await sendOrderConfirmationEmail(orderWithId);
    } catch (emailError) {
      console.error('Failed to send customer confirmation email:', emailError);
      // Continue even if email fails
    }
    
    // Send notification to the appropriate location admin
    try {
      await sendOrderNotificationToAdmin(orderWithId);
    } catch (emailError) {
      console.error('Failed to send admin notification email:', emailError);
      // Continue even if email fails
    }
    
    return NextResponse.json({ id: data.id }, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
