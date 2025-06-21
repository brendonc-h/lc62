'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

type User = {
  id: string;
  name: string;
  email: string;
  points: number;
  role?: string;
  phone?: string;
};

type MenuItem = {
  id: string;
  name: string;
  description?: string;
  price: number;
  image_url?: string;
};

type OrderItem = {
  id: string;
  order_id: string;
  menu_item_id: string;
  quantity: number;
  price_each: number;
  menu_item: MenuItem;
};

type Order = {
  id: string;
  customer_id: string;
  total_price: number;
  total: number; // For backward compatibility
  points_redeemed: number;
  created_at: string;
  status: string;
  order_items: OrderItem[];
  items?: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
};

type OrderStats = {
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  completedOrders: number;
};

const AdminDashboard = ({ orders, stats }: { orders: Order[]; stats: OrderStats }) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold">Admin Dashboard</h2>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Total Orders</h3>
          <p className="text-2xl font-bold">{stats.totalOrders}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Total Revenue</h3>
          <p className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Pending Orders</h3>
          <p className="text-2xl font-bold">{stats.pendingOrders}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Completed Orders</h3>
          <p className="text-2xl font-bold">{stats.completedOrders}</p>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Recent Orders</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="text-left text-gray-500 text-sm">
                <th className="pb-2">Order ID</th>
                <th className="pb-2">Date</th>
                <th className="pb-2">Status</th>
                <th className="pb-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 5).map((order) => (
                <tr key={order.id} className="border-t">
                  <td className="py-3">#{order.id.substring(0, 8)}</td>
                  <td>{new Date(order.created_at).toLocaleDateString()}</td>
                  <td>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      order.status === 'completed' ? 'bg-green-100 text-green-800' :
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="text-right">${order.total_price.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const CustomerDashboard = ({ user, orders }: { user: User; orders: Order[] }) => {
  const router = useRouter();
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4">Welcome back, {user.name}!</h2>
        <div className="flex items-center space-x-4">
          <div className="bg-indigo-100 p-4 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <p className="text-gray-600">Loyalty Points</p>
            <p className="text-2xl font-bold">{user.points || 0} pts</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Order History</h3>
        {orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="border-b pb-4 last:border-b-0 last:pb-0">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <p className="font-medium">Order #{order.id.substring(0, 8)}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    order.status === 'completed' ? 'bg-green-100 text-green-800' :
                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {order.status}
                  </span>
                </div>
                <div className="text-right">
                  <p className="font-semibold">${order.total_price.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="mt-2 text-gray-500">No past orders found</p>
            <button
              onClick={() => router.push('/products')}
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Start Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
        
        if (authError || !authUser) {
          router.push('/auth/signin?callbackUrl=/dashboard');
          return;
        }

        // Fetch customer data
        const { data: customer, error: customerError } = await supabase
          .from('customers')
          .select('*')
          .eq('auth_id', authUser.id)
          .single();

        // If customer doesn't exist, create one
        if (!customer || customerError) {
          const { data: newCustomer, error: createError } = await supabase
            .from('customers')
            .upsert({
              auth_id: authUser.id,
              name: authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'Customer',
              email: authUser.email || '',
              points: 0
            })
            .select()
            .single();

          if (createError) throw createError;
          setUser(newCustomer);
        } else {
          setUser({
            id: customer.id,
            name: customer.name,
            email: customer.email,
            points: customer.points || 0,
            role: 'customer'
          });
        }

        // Fetch customer's orders
        const { data: ordersData, error: ordersError } = await supabase
          .from('orders')
          .select(`
            *,
            order_items (
              *,
              menu_item:menu_items (*)
            )
          `)
          .eq('customer_id', customer?.id || '')
          .order('created_at', { ascending: false });

        if (ordersError) throw ordersError;

        // Transform orders to match our type
        const transformedOrders = (ordersData || []).map(order => ({
          ...order,
          total: order.total_price, // For backward compatibility
          status: order.status || 'pending',
          // Map order_items to items for backward compatibility
          items: (order.order_items || []).map((item: OrderItem) => ({
            name: item.menu_item?.name || 'Unknown Item',
            quantity: item.quantity,
            price: item.price_each
          }))
        }));

        setOrders(transformedOrders);
      } catch (err) {
        console.error('Error in dashboard:', err);
        setError('Failed to load user data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, [router]);

  // Calculate stats for admin dashboard
  const stats = {
    totalOrders: orders.length,
    totalRevenue: orders.reduce((sum, order) => sum + (order.total_price || 0), 0),
    pendingOrders: orders.filter(order => order.status === 'pending').length,
    completedOrders: orders.filter(order => order.status === 'completed' || order.status === 'delivered').length,
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500">{error}</p>
          <button
            onClick={() => router.push('/auth/signin')}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  if (user) {
    const handleSignOut = async () => {
      await supabase.auth.signOut();
      router.push('/auth/signin');
    };

    return (
      <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <button
              onClick={handleSignOut}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign out
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-500"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
            <div className="px-4 py-5 sm:px-6">
              <h2 className="text-2xl font-bold text-gray-900">Welcome back, {user.name}!</h2>
              <p className="mt-1 text-sm text-gray-500">View your points balance and past orders.</p>
            </div>

            <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
              <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-6 rounded-lg mb-8">
                <h3 className="text-lg font-medium text-gray-900">Your Points</h3>
                <p className="mt-1 text-4xl font-bold text-indigo-600">{user.points}</p>
                <p className="mt-2 text-sm text-gray-500">Earn points with every purchase!</p>
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Past Orders</h3>
                {orders.length === 0 ? (
                  <p className="text-sm text-gray-500">No orders found.</p>
                ) : (
                  <div className="bg-white shadow overflow-hidden sm:rounded-md">
                    <ul className="divide-y divide-gray-200">
                      {orders.map((order) => (
                        <li key={order.id} className="px-6 py-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-900">Order #{order.id}</p>
                              <p className="mt-1 text-sm text-gray-500">
                                Date: {new Date(order.created_at).toLocaleDateString()}
                              </p>
                              <p className="mt-1 text-sm text-gray-500">Total: ${order.total.toFixed(2)}</p>
                            </div>
                            <p
                              className={`text-sm font-medium ${
                                order.status === 'Delivered'
                                  ? 'text-green-600'
                                  : order.status === 'Pending'
                                  ? 'text-yellow-600'
                                  : 'text-red-600'
                              }`}
                            >
                              {order.status}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <p>Loading dashboard...</p>
    </div>
  );
}