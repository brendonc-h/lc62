export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { sendOrderStatusUpdateEmail } from '@/lib/email-utils';

// Add any admin emails here - same as in the orders route
const ADMIN_EMAILS = ['brendon1798@gmail.com', 'info@lacasita.io', 'berthoud@lacasita.io', 'fortcollins@lacasita.io'];

// Update an order status
export async function PATCH(request: Request) {
  try {
    const { orderId, status, estimatedMinutes } = await request.json();
    
    // Validate status
    const validStatuses = ['preparing', 'in-progress', 'ready', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status value' }, { status: 400 });
    }
    
    // Validate order ID
    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }
    
    // Get the order to check if it exists and to get customer data for notifications
    const { data: order, error: fetchError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();
      
    if (fetchError || !order) {
      console.error('Error fetching order:', fetchError);
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }
    
    // Update the status and time estimate if provided
    const updateData: any = { 
      status, 
      updated_at: new Date().toISOString() 
    };
    
    // Add estimated completion time if provided
    if (estimatedMinutes !== undefined) {
      updateData.estimated_completion_minutes = estimatedMinutes;
    }
    
    const { data, error } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', orderId)
      .select();
    
    if (error) {
      console.error('Error updating order status:', error);
      return NextResponse.json({ error: 'Failed to update order status' }, { status: 500 });
    }

    if (!data || data.length === 0) {
      console.error('No order found with ID:', orderId);
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const updatedOrder = data[0];
    
    // Get the customer information and order details for sending email
    try {
      // Parse the notes field to get customer and order data
      const orderData = JSON.parse(order.notes || '{}');
      const customerInfo = orderData.customerInfo || {};
      const customerEmail = customerInfo.email;
      const customerName = customerInfo.name;

      // Get the location from the order data
      const location = orderData.location || 'Unknown';

      if (customerEmail && customerName) {
        // Send email notification to customer about status update
        await sendOrderStatusUpdateEmail(
          orderId,
          customerEmail,
          customerName,
          location,
          status as 'preparing' | 'in-progress' | 'ready' | 'completed' | 'cancelled',
          estimatedMinutes || order.estimated_completion_minutes
        );
        console.log(`Order status update email sent to: ${customerEmail}`);
      } else {
        console.log('No customer email found for order:', orderId);
      }
    } catch (emailError) {
      console.error('Failed to send order status update email:', emailError);
      // Continue with the response even if email fails
    }
    
    return NextResponse.json({ success: true, order: updatedOrder });
  } catch (error) {
    console.error('Error updating order status:', error);
    return NextResponse.json({ error: 'Failed to update order status' }, { status: 500 });
  }
}
