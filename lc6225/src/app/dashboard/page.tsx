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
};

type Order = {
  id: string;
  date: string;
  total: number;
  status: string;
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

        // Fetch user profile
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authUser.id)
          .single();

        if (profileError) throw profileError;

        setUser({
          id: authUser.id,
          name: profile.name || authUser.email?.split('@')[0] || 'User',
          email: authUser.email || '',
          points: profile.points || 0,
          role: profile.role || 'customer',
        });

        // Fetch user orders
        const { data: ordersData, error: ordersError } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', authUser.id)
          .order('created_at', { ascending: false });

        if (ordersError) throw ordersError;

        setOrders(ordersData.map(order => ({
          id: order.id,
          date: new Date(order.created_at).toLocaleDateString(),
          total: order.total,
          status: order.status,
        })));
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to load user data');
      } finally {
        setLoading(false);
      }
    };

    getUser();

    // Listen for auth changes
    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        router.push('/auth/signin');
      }
    });

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, [router]);

  useEffect(() => {
    if (user?.role === 'admin') {
      router.replace('/admin');
    }
  }, [user, router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/auth/signin');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-red-500">{error || 'User not found'}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Retry
          </button>
          <button
            onClick={handleSignOut}
            className="mt-4 ml-4 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  if (user) {
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
                                Date: {new Date(order.date).toLocaleDateString()}
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