"use client";

import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { OrderDetails } from '@/lib/types';

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<OrderDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/auth/signin?callbackUrl=/admin');
    } else if (status === 'authenticated' && session?.user.role !== 'admin') {
      router.replace('/dashboard');
    }
  }, [status, session, router]);

  useEffect(() => {
    if (session?.user.role === 'admin') {
      fetchOrders();
    }
  }, [session]);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/admin/orders', {
        cache: 'no-store',
        credentials: 'include'
      });
      
      if (response.status === 403) {
        setError('Not authorized to view admin data');
        return;
      }
      
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update order status');
      }

      // Refresh orders
      fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status');
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500" />
      </div>
    );
  }

  if (session?.user.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 lg:p-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <button
            onClick={() => signOut({ redirect: true, callbackUrl: '/auth/signin' })}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Sign Out
          </button>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Order Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900">Total Orders</h3>
            <p className="text-3xl font-bold text-red-600">{orders.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900">Preparing</h3>
            <p className="text-3xl font-bold text-yellow-600">
              {orders.filter(o => o.status === 'preparing').length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900">Ready</h3>
            <p className="text-3xl font-bold text-blue-600">
              {orders.filter(o => o.status === 'ready').length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900">Completed</h3>
            <p className="text-3xl font-bold text-green-600">
              {orders.filter(o => o.status === 'completed').length}
            </p>
          </div>
        </div>

        {/* Orders List */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-lg font-medium text-gray-900">Recent Orders</h2>
            <p className="mt-1 text-sm text-gray-500">
              Manage and track all incoming orders
            </p>
          </div>
          <div className="border-t border-gray-200">
            {orders.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No orders found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order Details
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Items
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            #{order.id?.slice(-8)}
                          </div>
                          <div className="text-sm text-gray-500">
                            {order.createdAt ? new Date(order.createdAt).toLocaleString() : 'No date'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {order.orderType || order.customerInfo?.orderType || 'pickup'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {order.customerInfo?.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {order.customerInfo?.phone}
                          </div>
                          <div className="text-sm text-gray-500">
                            {order.customerInfo?.email}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {order.items?.map((item, index) => (
                              <div key={index}>
                                {item.quantity}x {item.name}
                                {item.variant && <span className="text-gray-500"> ({item.variant})</span>}
                                {item.spiceLevel && <span className="text-gray-500"> - {item.spiceLevel}</span>}
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${order.total?.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            order.status === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : order.status === 'ready'
                              ? 'bg-blue-100 text-blue-800'
                              : order.status === 'preparing'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {order.status || 'preparing'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <select
                            value={order.status || 'preparing'}
                            onChange={(e) => updateOrderStatus(order.id!, e.target.value)}
                            className="rounded-md border-gray-300 text-sm focus:border-red-500 focus:ring-red-500"
                          >
                            <option value="preparing">Preparing</option>
                            <option value="ready">Ready</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}