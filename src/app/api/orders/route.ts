export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { supabase, createClient } from '@/lib/supabaseClient';
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

    console.log('Creating order with data:', {
      customerInfo: order.customerInfo,
      total: order.total,
      itemCount: order.items.length,
      paymentMethod,
      paymentId
    });

    // Get the current user to link the order
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    let customerId = null;

    if (user) {
      // User is logged in, get their customer record
      const { data: customer, error: customerError } = await supabase
        .from('customers')
        .select('id')
        .eq('auth_id', user.id)
        .single();

      if (customer) {
        customerId = customer.id;
      } else {
        console.warn('Logged in user has no customer record');
      }
    }

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

    // Create the order record (matching the actual database schema)
    const dbOrder = {
      customer_id: customerId, // Link to customer if logged in
      total_price: order.total,
      status: 'preparing',
      notes: JSON.stringify({
        customerInfo: order.customerInfo,
        items: order.items,
        location: orderLocation,
        paymentMethod,
        paymentId,
        paymentStatus,
        specialInstructions: order.customerInfo.specialInstructions
      })
    };

    console.log('Inserting order into database:', dbOrder);

    const { data, error } = await supabase
      .from('orders')
      .insert([dbOrder])
      .select('id')
      .single();

    if (error) {
      console.error('Error creating order:', error);
      return NextResponse.json({
        error: 'Failed to create order',
        details: error.message,
        code: error.code
      }, { status: 500 });
    }

    console.log('Order created successfully:', data);

    // Now create order_items for each item in the order
    const orderItems = [];
    for (const item of order.items) {
      // First, find the menu item by name (since we might not have the exact ID)
      const { data: menuItem, error: menuError } = await supabase
        .from('menu_items')
        .select('id')
        .eq('name', item.name)
        .single();

      if (menuError) {
        console.warn(`Could not find menu item: ${item.name}`, menuError);
        // Continue without linking to menu item
      }

      orderItems.push({
        order_id: data.id,
        menu_item_id: menuItem?.id || null,
        quantity: item.quantity,
        price_each: item.price,
        special_instructions: item.specialRequest || null
      });
    }

    // Insert order items
    if (orderItems.length > 0) {
      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) {
        console.error('Error creating order items:', itemsError);
        // Continue even if order items fail
      } else {
        console.log('Order items created successfully');
      }
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
      console.log('Customer confirmation email sent');
    } catch (emailError) {
      console.error('Failed to send customer confirmation email:', emailError);
      // Continue even if email fails
    }

    // Send notification to the appropriate location admin
    try {
      await sendOrderNotificationToAdmin(orderWithId);
      console.log('Admin notification email sent');
    } catch (emailError) {
      console.error('Failed to send admin notification email:', emailError);
      // Continue even if email fails
    }

    return NextResponse.json({
      orderId: data.id,
      status: 'success',
      message: 'Order created successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
