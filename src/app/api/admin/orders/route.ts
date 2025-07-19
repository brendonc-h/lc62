export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { error } from 'console';

// Define the order type based on the Supabase schema
interface Order {
  id: string;
  customer_id: string;
  total_price: number;
  status: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  estimated_completion_minutes?: number;
  order_items?: any[];
  customers?: any;
}

// Add any admin emails here
const ADMIN_EMAILS = ['brendon1798@gmail.com', 'info@lacasita.io', 'berthoud@lacasita.io','fortcollins@lacasita.io'];

// Function to normalize location names to ensure consistency
function normalizeLocation(location: string | undefined): string {
  if (!location) return 'Unknown';

  const normalized = location.toLowerCase().trim();

  // Handle various forms of location names
  if (normalized.includes('berthoud')) return 'Berthoud';
  if (normalized.includes('fort collins') || normalized.includes('fortcollins')) return 'Fort Collins';

  // Handle legacy/test values
  if (normalized === 'la-casita' || normalized === 'lacasita') return 'Berthoud'; // Default to Berthoud for legacy data

  // Return original if no match (but capitalized)
  return location.charAt(0).toUpperCase() + location.slice(1).toLowerCase();
}

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
    const transformedOrders = orders?.map((order: Order) => {
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
        total: order.total_price || 0,
        status: order.status,
        createdAt: order.created_at,
        items: items,
        customerInfo: orderInfo.customerInfo || {
          name: order.customers?.name || 'Guest',
          email: order.customers?.email || orderInfo.customerInfo?.email || 'No email'
        },
        location: normalizeLocation(orderInfo.location) || 'Unknown',
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
