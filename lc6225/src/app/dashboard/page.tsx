'use client';

import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

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
  const { data: session, status } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (isInitialLoading && status === 'loading') {
      return;
    }

    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/dashboard');
      setIsInitialLoading(false);
    } else if (status === 'authenticated' && session?.user) {
      setUser({
        id: session.user.id,
        name: session.user.name || 'User',
        email: session.user.email || '',
        points: session.user.points || 0,
        role: session.user.role,
      });
      setIsInitialLoading(false);
    } else if (status !== 'loading') {
      setIsInitialLoading(false);
    }
  }, [status, session, router, isInitialLoading]);

  useEffect(() => {
    if (user?.role === 'admin') {
      router.replace('/admin');
    }
  }, [user, router]);

  useEffect(() => {
    if (user) {
      // Fetch past orders
      const fetchOrders = async () => {
        try {
          setError('');
          const response = await fetch('/api/orders', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.error || 'Failed to fetch orders');
          }

          setOrders(data.orders || []);
        } catch (err) {
          console.error('Error fetching orders:', err);
          setError(err instanceof Error ? err.message : 'Failed to fetch orders');
        }
      };

      fetchOrders();
    }
  }, [user]);

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push('/auth/signin');
    router.refresh();
  };

  if (isInitialLoading && status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!user && !isInitialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600">
            {status === 'unauthenticated' ? 'Redirecting to sign-in...' : 'You need to be signed in to view this page, or an error occurred.'}
          </p>
          {status !== 'unauthenticated' && (
            <button
              onClick={() => router.push('/auth/signin?callbackUrl=/dashboard')}
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Sign In
            </button>
          )}
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
              Sign Out
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