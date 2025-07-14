export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { error } from 'console';

// Add any admin emails here
const ADMIN_EMAILS = ['brendon1798@gmail.com', 'info@lacasita.io', 'berthoud@lacasita.io','fortcollins@lacasita.io'];

export async function GET() {
  try {
    // Fetch orders with their items and customer information
    const { data: orders, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          menu_items (
            name,
            price
          )
        ),
        customers (
          name,
          email
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Admin orders error:', error);
      return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
    }

    // Transform the data to match the expected format
    const transformedOrders = orders?.map(order => {
      // Parse notes to get additional order information
      let orderInfo: any = {};
      try {
        orderInfo = order.notes ? JSON.parse(order.notes) : {};
      } catch (e) {
        console.warn('Could not parse order notes:', order.notes);
      }

      // Transform order items
      const items = order.order_items?.map((item: any) => ({
        id: item.menu_items?.name || 'Unknown Item',
        name: item.menu_items?.name || 'Unknown Item',
        quantity: item.quantity,
        price: item.price_each,
        specialRequest: item.special_instructions
      })) || [];

      return {
        id: order.id,
        total: order.total_price,
        status: order.status,
        createdAt: order.created_at,
        items: items,
        customerInfo: orderInfo.customerInfo || {
          name: order.customers?.name || 'Guest',
          email: order.customers?.email || orderInfo.customerInfo?.email || 'No email'
        },
        location: orderInfo.location || 'Unknown',
        paymentMethod: orderInfo.paymentMethod || 'unknown',
        estimatedCompletionMinutes: order.estimated_completion_minutes
      };
    }) || [];

    return NextResponse.json({ orders: transformedOrders });
  } catch (error) {
    console.error('Admin orders error:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}
