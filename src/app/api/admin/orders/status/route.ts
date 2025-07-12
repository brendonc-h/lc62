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
      .select()
      .single();
    
    if (error) {
      console.error('Error updating order status:', error);
      return NextResponse.json({ error: 'Failed to update order status' }, { status: 500 });
    }
    
    // Get the customer information and order details for sending email
    try {
      // Customer data should be stored in the order object
      const customerEmail = order.customer.email;
      const customerName = order.customer.name;
      
      // Get the location from the first item in the order
      const location = order.items && order.items.length > 0 ? order.items[0].location : 'Unknown';
      
      // Send email notification to customer about status update
      await sendOrderStatusUpdateEmail(
        orderId, 
        customerEmail, 
        customerName, 
        location,
        status as 'preparing' | 'in-progress' | 'ready' | 'completed' | 'cancelled',
        estimatedMinutes || order.estimated_completion_minutes
      );
    } catch (emailError) {
      console.error('Failed to send order status update email:', emailError);
      // Continue with the response even if email fails
    }
    
    return NextResponse.json({ success: true, order: data });
  } catch (error) {
    console.error('Error updating order status:', error);
    return NextResponse.json({ error: 'Failed to update order status' }, { status: 500 });
  }
}
