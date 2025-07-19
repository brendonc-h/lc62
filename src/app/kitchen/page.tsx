'use client';

import { OrderDetails, OrderStatus } from '@/lib/types';
import { useEffect, useState } from 'react';
import { CheckCircleIcon, XCircleIcon, ClockIcon, ArrowPathIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js';

export default function KitchenDashboard() {
  const [orders, setOrders] = useState<OrderDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [locationFilter, setLocationFilter] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<{type: 'success' | 'error', message: string} | null>(null);
  const [timeEstimate, setTimeEstimate] = useState<{[orderId: string]: number}>({});
  const [estimateUpdating, setEstimateUpdating] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  // Check authentication and role
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user: authUser }, error } = await supabase.auth.getUser();
        
        if (error || !authUser) {
          router.replace('/auth/signin?callbackUrl=/kitchen');
          return;
        }

        // Fetch user profile to check role
        const { data: profile, error: profileError } = await supabase
          .from('customers')
          .select('*')
          .eq('auth_id', authUser.id)
          .single();

        if (profileError) throw profileError;

        // Allow both admin and kitchen roles
        if (profile.role !== 'admin' && profile.role !== 'kitchen') {
          router.replace('/dashboard');
          return;
        }

        setUser({
          ...authUser,
          role: profile.role,
          name: profile.name || authUser.email?.split('@')[0] || 'Kitchen Staff'
        });
      } catch (error) {
        console.error('Error checking auth status:', error);
        router.replace('/auth/signin');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  // Function to update order time estimate
  const updateTimeEstimate = async (orderId: string, minutes: number) => {
    setEstimateUpdating(orderId);
    setStatusMessage(null);
    
    try {
      const response = await fetch('/api/admin/orders/time-estimate', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderId, estimatedMinutes: minutes }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update time estimate');
      }
      
      // Update local state
      setTimeEstimate(prev => ({
        ...prev,
        [orderId]: minutes
      }));
      
      // Update the orders array with the new time estimate
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId ? { ...order, estimatedCompletionMinutes: minutes } : order
        )
      );
      
      setStatusMessage({
        type: 'success', 
        message: `Order #${orderId} estimated time set to ${minutes} minutes`
      });
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setStatusMessage(null);
      }, 3000);
      
    } catch (error) {
      console.error('Error updating time estimate:', error);
      setStatusMessage({
        type: 'error', 
        message: `Failed to update time estimate: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    } finally {
      setEstimateUpdating(null);
    }
  };

  // Function to update order status
  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    setUpdating(orderId);
    setStatusMessage(null);
    
    try {
      // Get current time estimate for this order (if any)
      const currentEstimate = timeEstimate[orderId] || orders.find(o => o.id === orderId)?.estimatedCompletionMinutes;
      
      const response = await fetch('/api/admin/orders/status', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          orderId, 
          status: newStatus,
          estimatedMinutes: currentEstimate // Include current time estimate with status update
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update status');
      }
      
      // Update local state to reflect the change
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId ? { ...order, status: newStatus as OrderStatus } : order
        )
      );
      
      setStatusMessage({
        type: 'success', 
        message: `Order #${orderId} updated to ${newStatus}`
      });
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setStatusMessage(null);
      }, 3000);
      
    } catch (error) {
      console.error('Error updating order status:', error);
      setStatusMessage({
        type: 'error', 
        message: `Failed to update order: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    } finally {
      setUpdating(null);
    }
  };

  // Fetch orders
  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/admin/orders');
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      const data = await response.json();
      setOrders(data.orders || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setStatusMessage({
        type: 'error',
        message: 'Failed to load orders'
      });
    }
  };

  useEffect(() => {
    if (user) {
      fetchOrders();
      
      // Set up real-time subscription for order updates
      const channel = supabase
        .channel('kitchen_orders')
        .on('postgres_changes', 
          { 
            event: '*',
            schema: 'public',
            table: 'orders'
          },
          (payload: RealtimePostgresChangesPayload<any>) => {
            console.log('Order update received:', payload);
            fetchOrders(); // Refresh orders when changes occur
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to signin
  }

  // Filter orders based on location and status
  const filteredOrders = orders.filter(order => {
    // Only show active orders (not completed or cancelled)
    const activeStatuses = ['preparing', 'in-progress', 'ready'];
    const isActive = activeStatuses.includes(order.status || 'preparing');
    
    if (!isActive) return false;
    
    if (locationFilter && order.location !== locationFilter) {
      return false;
    }
    return true;
  });

  // Get unique locations from actual orders data
  const getUniqueLocations = () => {
    const locationSet = new Set<string>();
    // Add safety check for orders array
    if (orders && Array.isArray(orders)) {
      orders.forEach(order => {
        if (order.location && order.location !== 'Unknown') {
          locationSet.add(order.location);
        }
      });
    }
    return Array.from(locationSet).sort();
  };

  const locations = getUniqueLocations().length > 0 ? getUniqueLocations() : ['Fort Collins', 'Berthoud'];

  return (
    <div className="min-h-screen bg-gray-100 p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">🍳 Kitchen Dashboard</h1>
            <p className="text-gray-600">Welcome back, {user.name}</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={fetchOrders}
              className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 flex items-center gap-2"
            >
              <ArrowPathIcon className="h-4 w-4" />
              Refresh
            </button>
            <button
              onClick={async () => {
                await supabase.auth.signOut();
                router.push('/auth/signin');
              }}
              className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-800"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Status Message */}
        {statusMessage && (
          <div className={`mb-6 p-4 rounded-md ${
            statusMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {statusMessage.message}
          </div>
        )}

        {/* Location Filter */}
        <div className="mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setLocationFilter(null)}
              className={`px-4 py-2 rounded-md ${
                locationFilter === null ? 'bg-orange-600 text-white' : 'bg-white text-gray-700 border'
              }`}
            >
              All Locations
            </button>
            {locations.map(location => (
              <button
                key={location}
                onClick={() => setLocationFilter(location)}
                className={`px-4 py-2 rounded-md ${
                  locationFilter === location ? 'bg-orange-600 text-white' : 'bg-white text-gray-700 border'
                }`}
              >
                {location}
              </button>
            ))}
          </div>
        </div>

        {/* Orders Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-orange-100 p-4 rounded-lg">
            <h3 className="font-semibold text-orange-800">Preparing</h3>
            <p className="text-2xl font-bold text-orange-900">
              {filteredOrders.filter(o => o.status === 'preparing').length}
            </p>
          </div>
          <div className="bg-blue-100 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-800">In Progress</h3>
            <p className="text-2xl font-bold text-blue-900">
              {filteredOrders.filter(o => o.status === 'in-progress').length}
            </p>
          </div>
          <div className="bg-green-100 p-4 rounded-lg">
            <h3 className="font-semibold text-green-800">Ready</h3>
            <p className="text-2xl font-bold text-green-900">
              {filteredOrders.filter(o => o.status === 'ready').length}
            </p>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="bg-white p-8 rounded-lg shadow text-center">
              <p className="text-gray-500">No active orders at the moment</p>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div key={order.id} className="bg-white p-6 rounded-lg shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">Order #{order.id}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPinIcon className="h-4 w-4" />
                      {order.location || 'Unknown Location'}
                      <span>•</span>
                      <span>{new Date(order.createdAt || '').toLocaleTimeString()}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      order.status === 'preparing' ? 'bg-orange-100 text-orange-800' :
                      order.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'ready' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {order.status || 'preparing'}
                    </span>
                  </div>
                </div>

                {/* Order Items */}
                <div className="mb-4">
                  <h4 className="font-medium mb-2">Items:</h4>
                  <div className="space-y-1">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>{item.quantity}x {item.name}</span>
                        <span>${(item.price && item.quantity && typeof item.price === 'number')
                          ? (item.price * item.quantity).toFixed(2)
                          : '0.00'}</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between font-semibold">
                      <span>Total:</span>
                      <span>${(order.total && typeof order.total === 'number') ? order.total.toFixed(2) : '0.00'}</span>
                    </div>
                  </div>
                </div>

                {/* Time Estimate */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estimated completion time (minutes):
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      min="5"
                      max="120"
                      step="5"
                      value={timeEstimate[order.id!] || order.estimatedCompletionMinutes || ''}
                      onChange={(e) => setTimeEstimate(prev => ({
                        ...prev,
                        [order.id!]: parseInt(e.target.value) || 0
                      }))}
                      className="border rounded px-3 py-1 w-20"
                      placeholder="30"
                    />
                    <button
                      onClick={() => updateTimeEstimate(order.id!, timeEstimate[order.id!] || 30)}
                      disabled={estimateUpdating === order.id}
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                    >
                      {estimateUpdating === order.id ? 'Updating...' : 'Set Time'}
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  {order.status === 'preparing' && (
                    <button
                      onClick={() => updateOrderStatus(order.id!, 'in-progress')}
                      disabled={updating === order.id}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                    >
                      <ClockIcon className="h-4 w-4" />
                      {updating === order.id ? 'Starting...' : 'Start Cooking'}
                    </button>
                  )}
                  
                  {order.status === 'in-progress' && (
                    <button
                      onClick={() => updateOrderStatus(order.id!, 'ready')}
                      disabled={updating === order.id}
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
                    >
                      <CheckCircleIcon className="h-4 w-4" />
                      {updating === order.id ? 'Marking Ready...' : 'Mark Ready'}
                    </button>
                  )}
                  
                  {order.status === 'ready' && (
                    <button
                      onClick={() => updateOrderStatus(order.id!, 'completed')}
                      disabled={updating === order.id}
                      className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:opacity-50 flex items-center gap-2"
                    >
                      <CheckCircleIcon className="h-4 w-4" />
                      {updating === order.id ? 'Completing...' : 'Mark Completed'}
                    </button>
                  )}
                  
                  <button
                    onClick={() => updateOrderStatus(order.id!, 'cancelled')}
                    disabled={updating === order.id}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
                  >
                    <XCircleIcon className="h-4 w-4" />
                    {updating === order.id ? 'Cancelling...' : 'Cancel Order'}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
