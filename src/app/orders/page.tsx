'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import Link from 'next/link';
import { ArrowLeftIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js';

interface MenuItemData {
  name: string;
}

type SupabaseOrderItem = {
  quantity: number;
  price_each: number;
  menu_item: MenuItemData[] | null;
};

type SupabaseOrderData = {
  id: string;
  total_price: number;
  status: string;
  created_at: string;
  estimated_ready_time: string | null;
  order_items: SupabaseOrderItem[] | null;
};

interface OrderItem {
  name: string;
  quantity: number;
  price_each: number;
}

interface Order {
  id: string;
  total_price: number;
  status: string;
  created_at: string;
  estimated_ready_time: string | null;
  items: OrderItem[];
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchOrders = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth/signin');
        return;
      }

      try {
        const { data: ordersData, error } = await supabase
          .from('orders')
          .select(`
            id,
            total_price,
            status,
            created_at,
            estimated_ready_time,
            order_items:order_items(
              quantity,
              price_each,
              menu_item:menu_items(name)
            )
          `)
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Transform the Supabase data to our app's data model
        const formattedOrders: Order[] = (ordersData as unknown as SupabaseOrderData[] || []).map(order => {
          const items: OrderItem[] = (order.order_items || []).map(item => ({
            name: item.menu_item?.[0]?.name || 'Unknown Item',
            quantity: item.quantity,
            price_each: item.price_each
          }));
          
          return {
            id: order.id,
            total_price: order.total_price,
            status: order.status,
            created_at: order.created_at,
            estimated_ready_time: order.estimated_ready_time,
            items
          };
        });

        setOrders(formattedOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();

    const channel = supabase
      .channel('order_updates')
      .on('postgres_changes', 
        { 
          event: '*',
          schema: 'public',
          table: 'orders'
        },
        (payload: RealtimePostgresChangesPayload<any>) => {
          if (payload.eventType === 'UPDATE') {
            setOrders(prev => 
              prev.map(order => 
                order.id === payload.new.id ? { ...order, ...payload.new } : order
              )
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [router]);

  const getStatusColor = (status: string) => {
    const statusColors: Record<string, string> = {
      received: 'bg-orange-100 text-orange-800',
      preparing: 'bg-blue-100 text-blue-800',
      ready: 'bg-green-100 text-green-800',
      completed: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-8">
            <Link 
              href="/dashboard" 
              className="mr-4 p-1 rounded-full hover:bg-gray-100"
            >
              <ArrowLeftIcon className="h-6 w-6 text-gray-600" />
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          </div>
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-8">
          <Link 
            href="/dashboard" 
            className="mr-4 p-1 rounded-full hover:bg-gray-100"
          >
            <ArrowLeftIcon className="h-6 w-6 text-gray-600" />
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
        </div>
        
        {orders.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="mx-auto h-16 w-16 text-gray-400">
              <ShoppingBagIcon className="h-full w-full" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No orders yet</h3>
            <p className="mt-1 text-gray-500">Your orders will appear here once you place them.</p>
            <div className="mt-6">
              <Link
                href="/menu"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                View Menu
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} id={`order-${order.id}`} className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                  <div>
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Order #{order.id.slice(0, 8).toUpperCase()}
                    </h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">
                      Placed on {format(new Date(order.created_at), 'MMMM d, yyyy h:mm a')}
                    </p>
                  </div>
                  <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
                <div className="border-t border-gray-200">
                  <dl>
                    {order.estimated_ready_time && (
                      <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">Estimated ready</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                          {format(new Date(order.estimated_ready_time), 'MMMM d, yyyy h:mm a')}
                        </dd>
                      </div>
                    )}
                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Items</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        <ul className="border border-gray-200 rounded-md divide-y divide-gray-200">
                          {order.items.map((item, idx) => (
                            <li key={idx} className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                              <div className="w-0 flex-1 flex items-center">
                                <span className="ml-2 flex-1 w-0 truncate">
                                  {item.quantity}x {item.name}
                                </span>
                              </div>
                              <div className="ml-4 flex-shrink-0">
                                ${(item.quantity * item.price_each).toFixed(2)}
                              </div>
                            </li>
                          ))}
                        </ul>
                      </dd>
                    </div>
                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Total amount</dt>
                      <dd className="mt-1 text-sm font-semibold text-gray-900 sm:mt-0 sm:col-span-2">
                        ${order.total_price.toFixed(2)}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
