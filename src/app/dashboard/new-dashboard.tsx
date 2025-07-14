'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '../../lib/supabaseClient';

type AuthUser = {
  id: string;
  email?: string | null;
  user_metadata?: {
    name?: string;
    full_name?: string;
  };
};

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
  total: number;
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

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [allOrders, setAllOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  // Check if user is admin - redirect admins to admin dashboard
  const isAdmin = user?.role === 'admin' || user?.email?.includes('admin') || user?.email?.endsWith('@lacasita.com');

  // Redirect admins to admin dashboard
  useEffect(() => {
    if (user && isAdmin) {
      router.push('/admin');
    }
  }, [user, isAdmin, router]);

  const fetchAllOrders = async () => {
    if (!isAdmin) return;
    
    try {
      const { data: orders, error } = await supabase
        .from('orders')
        .select(`
          *,
          customers (name, email),
          order_items (
            quantity,
            price_each,
            menu_items (name, price)
          )
        `)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.warn('Could not fetch admin orders:', error);
        setAllOrders([]);
      } else {
        setAllOrders(orders || []);
      }
    } catch (err) {
      console.warn('Error fetching admin orders:', err);
      setAllOrders([]);
    }
  };

  const fetchOrders = async (customerId: string) => {
    try {
      // Instead of calling API, fetch directly from Supabase
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
          )
        `)
        .eq('customer_id', customerId)
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('No orders found, showing empty state:', error);
        setOrders([]);
        return;
      }

      setOrders(orders || []);
    } catch (err) {
      console.warn('Error fetching orders, showing empty state:', err);
      setOrders([]);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get the current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError || !session?.user) {
          router.push('/auth/signin?callbackUrl=/dashboard');
          return;
        }
        const authUser = session.user as AuthUser;
        
        // Fetch customer data
        const { data: customer, error: customerError } = await supabase
          .from('customers')
          .select('*')
          .eq('auth_id', authUser.id)
          .single();

        if (!customer || customerError) {
          // Create customer if doesn't exist
          const userName = authUser.user_metadata?.full_name || 
                          authUser.user_metadata?.name || 
                          authUser.email?.split('@')[0] || 
                          'Customer';
                          
          const { data: newCustomer, error: createError } = await supabase
            .from('customers')
            .upsert({
              auth_id: authUser.id,
              name: userName,
              email: authUser.email || '',
              points: 0,
              created_at: new Date().toISOString()
            })
            .select()
            .single();

          if (newCustomer) {
            setUser({
              id: newCustomer.id,
              name: newCustomer.name,
              email: newCustomer.email,
              points: newCustomer.points,
              role: 'customer'
            });
            await fetchOrders(newCustomer.id);
          } else {
            console.error('Failed to create customer:', createError);
            setError('Failed to create customer account. Please try again later.');
          }
        } else {
          setUser({
            id: customer.id,
            name: customer.name,
            email: customer.email,
            points: customer.points,
            role: customer.role || 'customer'
          });
          await fetchOrders(customer.id);
        }
      } catch (err) {
        console.warn('Failed to load user data, showing empty dashboard:', err);
        setUser(null);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (isAdmin && !loading) {
      fetchAllOrders();
    }
  }, [isAdmin, loading]);

  // Calculate stats for admin dashboard
  const stats = {
    totalOrders: orders.length,
    totalRevenue: orders.reduce((sum, order) => sum + (order.total_price || 0), 0),
    pendingOrders: orders.filter(order => order.status === 'pending').length,
    completedOrders: orders.filter(order => order.status === 'completed').length
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show dashboard with placeholder data if user is null or no orders
  const hasOrders = orders && orders.length > 0;
  const displayOrders = hasOrders ? orders : [];
  const userName = user?.name || 'Guest User';
  const userPoints = user?.points || 0;



  // If user is admin, they will be redirected to admin dashboard
  if (isAdmin) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Redirecting to admin dashboard...</p>
        </div>
      </div>
    );
  }

  // This code is now unreachable but keeping for reference
  if (false) {
    const adminStats = {
      totalOrders: allOrders.length,
      totalRevenue: allOrders.reduce((sum, order) => sum + (order.total || 0), 0),
      pendingOrders: allOrders.filter(order => order.status === 'pending').length,
      completedOrders: allOrders.filter(order => order.status === 'completed').length
    };

    return (
      <main className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">🏆 Admin Dashboard - La Casita</h1>
            <p className="text-gray-600">Kitchen & Order Management System</p>
          </div>

          {/* Admin Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Orders</h3>
              <p className="text-3xl font-bold text-blue-600">{adminStats.totalOrders}</p>
              <p className="text-sm text-gray-500">All time</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Revenue</h3>
              <p className="text-3xl font-bold text-green-600">${adminStats.totalRevenue.toFixed(2)}</p>
              <p className="text-sm text-gray-500">Total earned</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Pending Orders</h3>
              <p className="text-3xl font-bold text-yellow-600">{adminStats.pendingOrders}</p>
              <p className="text-sm text-gray-500">Need attention</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Completed</h3>
              <p className="text-3xl font-bold text-purple-600">{adminStats.completedOrders}</p>
              <p className="text-sm text-gray-500">Orders done</p>
            </div>
          </div>

          {/* Kitchen Order Management */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-800">🍳 Kitchen Orders - For Cooks</h3>
              <div className="flex gap-2">
                <button 
                  onClick={() => fetchAllOrders()}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                >
                  🔄 Refresh Orders
                </button>
              </div>
            </div>
            
            {allOrders.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-4xl">🍽️</span>
                </div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h4>
                <p className="text-gray-500">Orders will appear here when customers place them</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Order #</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Customer</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Items</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Time</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {allOrders.slice(0, 20).map((order: any) => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4 text-sm font-medium text-gray-900">
                          #{order.id.slice(-8)}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-600">
                          {order.customers?.name || 'Guest'}
                          <br />
                          <span className="text-xs text-gray-400">{order.customers?.email}</span>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-600">
                          {(order.order_items || []).map((item: any, idx: number) => (
                            <div key={idx} className="mb-1">
                              <span className="font-medium">{item.quantity}x</span> {item.menu_items?.name || 'Unknown Item'}
                            </div>
                          ))}
                        </td>
                        <td className="px-4 py-4">
                          <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                            order.status === 'completed' ? 'bg-green-100 text-green-800' :
                            order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                            order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {order.status || 'pending'}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-500">
                          {new Date(order.created_at).toLocaleString()}
                        </td>
                        <td className="px-4 py-4 text-sm font-medium text-gray-900 text-right">
                          ${(order.total || 0).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    );
  }

  // Customer Dashboard
  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {userName}!</h1>
          <p className="text-gray-600">Here's your La Casita dashboard</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Orders</h3>
            <p className="text-3xl font-bold text-orange-600">{displayOrders.length}</p>
            <p className="text-sm text-gray-500">
              {hasOrders ? 'Lifetime orders' : 'No orders yet'}
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Loyalty Points</h3>
            <p className="text-3xl font-bold text-green-600">{userPoints}</p>
            <p className="text-sm text-gray-500">Available points</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Spent</h3>
            <p className="text-3xl font-bold text-blue-600">
              ${hasOrders ? displayOrders.reduce((sum, order) => sum + (order.total || 0), 0).toFixed(2) : '0.00'}
            </p>
            <p className="text-sm text-gray-500">Lifetime spending</p>
          </div>
        </div>

        {/* Order History */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Orders</h3>
          
          {!hasOrders ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h4 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h4>
              <p className="text-gray-500 mb-6">Start exploring our delicious Mexican cuisine!</p>
              <a 
                href="/order" 
                className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                Browse Menu
              </a>
            </div>
          ) : (
            <div className="space-y-4">
              {displayOrders.slice(0, 5).map((order: any) => (
                <div key={order.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900">Order #{order.id.slice(-8)}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(order.created_at).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {(order.items || []).length} item(s)
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">${(order.total || 0).toFixed(2)}</p>
                      <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                        order.status === 'completed' ? 'bg-green-100 text-green-800' :
                        order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {order.status || 'pending'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
