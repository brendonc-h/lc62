'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { OrderStatusBadge } from './OrderStatusBadge';
import { format } from 'date-fns';
import Link from 'next/link';

interface MenuItemData {
  name: string;
}

type OrderItemData = {
  quantity: number;
  menu_items: MenuItemData[];
};

type OrderData = {
  id: string;
  status: string;
  total_price: number;
  created_at: string;
  order_items: OrderItemData[];
};

type SupabaseOrderItem = {
  quantity: number;
  menu_items: MenuItemData[] | null;
};

type SupabaseOrderData = {
  id: string;
  status: string;
  total_price: number;
  created_at: string;
  order_items: SupabaseOrderItem[] | null;
};

export function RecentOrders() {
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentOrders = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('orders')
          .select(`
            id,
            status,
            total_price,
            created_at,
            order_items (
              quantity,
              menu_items (
                name
              )
            )
          `)
          .order('created_at', { ascending: false })
          .limit(3);

        if (error) throw error;
        
        // Transform the data to match our types
        const formattedData: OrderData[] = (data as SupabaseOrderData[] || []).map(order => ({
          ...order,
          order_items: (order.order_items || []).map(item => ({
            quantity: item.quantity,
            menu_items: item.menu_items || []
          }))
        }));
        
        setOrders(formattedData);
      } catch (error) {
        console.error('Error fetching recent orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentOrders();

    const channel = supabase
      .channel('recent_orders')
      .on('postgres_changes', 
        { 
          event: '*',
          schema: 'public',
          table: 'orders'
        },
        fetchRecentOrders
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }


  if (orders.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">You haven't placed any orders yet.</p>
        <Link
          href="/menu"
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700"
        >
          Order Now
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-hidden bg-white shadow sm:rounded-md">
      <ul role="list" className="divide-y divide-gray-200">
        {orders.map((order) => (
          <li key={order.id}>
            <Link 
              href={`/orders#order-${order.id}`}
              className="block hover:bg-gray-50"
            >
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <p className="truncate text-sm font-medium text-red-600">
                    Order #{order.id.slice(0, 8).toUpperCase()}
                  </p>
                  <div className="ml-2 flex flex-shrink-0">
                    <OrderStatusBadge status={order.status} />
                  </div>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <p className="flex items-center text-sm text-gray-500">
                      ${order.total_price.toFixed(2)}
                    </p>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                    <p>
                      {format(new Date(order.created_at), 'MMM d, yyyy')}
                    </p>
                  </div>
                </div>
                {order.order_items.length > 0 && order.order_items[0]?.menu_items?.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 truncate">
                      {order.order_items[0]?.quantity}x {order.order_items[0]?.menu_items[0]?.name || 'Item'}
                      {order.order_items.length > 1 ? ` +${order.order_items.length - 1} more` : ''}
                    </p>
                  </div>
                )}
              </div>
            </Link>
          </li>
        ))}
      </ul>
      <div className="bg-gray-50 px-4 py-4 text-right sm:px-6">
        <Link 
          href="/orders"
          className="text-sm font-medium text-red-600 hover:text-red-500"
        >
          View all orders<span className="sr-only">, orders</span>
        </Link>
      </div>
    </div>
  );
}
