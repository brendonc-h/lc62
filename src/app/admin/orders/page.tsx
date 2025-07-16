'use client';

import { OrderDetails, OrderStatus } from '@/lib/types';
import { useEffect, useState } from 'react';
import { CheckCircleIcon, XCircleIcon, ClockIcon, ArrowPathIcon, MapPinIcon } from '@heroicons/react/24/outline';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [locationFilter, setLocationFilter] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<{type: 'success' | 'error', message: string} | null>(null);
  const [timeEstimate, setTimeEstimate] = useState<{[orderId: string]: number}>({});
  const [estimateUpdating, setEstimateUpdating] = useState<string | null>(null);

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

  // Function to get all available locations from orders
  const getLocations = () => {
    const locations = new Set<string>();
    orders.forEach(order => {
      if (order.items && order.items.length > 0 && order.items[0].location) {
        locations.add(order.items[0].location);
      }
    });
    return Array.from(locations);
  };

  // Filter orders by location if filter is active
  const filteredOrders = locationFilter
    ? orders.filter(order => 
        order.items && 
        order.items.length > 0 && 
        order.items[0].location === locationFilter
      )
    : orders;

  useEffect(() => {
    // Fetch orders from API with proper error handling
    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/admin/orders', {
          // Add cache: no-store to prevent excessive caching
          cache: 'no-store',
          // Add proper credentials
          credentials: 'include'
        });
        
        if (response.status === 403) {
          console.log('Not authorized to view admin data');
          setOrders([]);
          return;
        }
        
        if (!response.ok) throw new Error('Failed to fetch orders');
        
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div className="sm:flex-auto">
            <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
            <p className="mt-2 text-sm text-gray-700">
              A list of all orders placed through the online ordering system.
            </p>
          </div>
          
          {/* Location filter */}
          <div className="mt-4 sm:mt-0 sm:ml-16">
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Location
            </label>
            <select
              id="location"
              className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm"
              value={locationFilter || ''}
              onChange={(e) => setLocationFilter(e.target.value || null)}
            >
              <option value="">All Locations</option>
              {getLocations().map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Status message */}
        {statusMessage && (
          <div className={`mt-4 p-4 rounded-md ${statusMessage.type === 'success' ? 'bg-green-50' : 'bg-red-50'}`}>
            <div className="flex">
              <div className="flex-shrink-0">
                {statusMessage.type === 'success' ? (
                  <CheckCircleIcon className="h-5 w-5 text-green-400" aria-hidden="true" />
                ) : (
                  <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
                )}
              </div>
              <div className="ml-3">
                <p className={`text-sm font-medium ${statusMessage.type === 'success' ? 'text-green-800' : 'text-red-800'}`}>
                  {statusMessage.message}
                </p>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="mt-8 flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <div className="mt-8 flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead>
                      <tr>
                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                          Order ID
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Customer
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Location
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Items
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Total
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Date
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Status
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Est. Time
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {filteredOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50">
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                            <div className="font-medium text-gray-900">
                              {order.createdAt ? new Date(order.createdAt).toLocaleString() : 'No date'}
                            </div>
                            <div className="text-gray-500">
                              Order #{order.id?.substring(0, 6)}
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            <div className="font-medium text-gray-900">{order.customerInfo.name}</div>
                            <div>{order.customerInfo.phone}</div>
                            <div className="text-xs">{order.customerInfo.email}</div>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            <div className="flex items-center">
                              <MapPinIcon className="h-4 w-4 mr-1 text-red-600" />
                              <span>{order.items?.[0]?.location || 'Unknown'}</span>
                            </div>
                          </td>
                          <td className="px-3 py-4 text-sm text-gray-500">
                            <ul className="space-y-1">
                              {order.items.map((item) => (
                                <li key={item.id} className="text-xs">
                                  {item.quantity}x {item.name}
                                  {item.specialRequest && (
                                    <div className="text-xs italic text-gray-400 truncate max-w-[150px]" title={item.specialRequest}>
                                      Note: {item.specialRequest}
                                    </div>
                                  )}
                                </li>
                              ))}
                            </ul>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            ${order.total.toFixed(2)}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm">
                            <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold leading-4 ${
                              order.status === 'completed'
                                ? 'bg-green-100 text-green-800'
                                : order.status === 'ready'
                                ? 'bg-blue-100 text-blue-800'
                                : order.status === 'in-progress'
                                ? 'bg-purple-100 text-purple-800'
                                : order.status === 'preparing'
                                ? 'bg-orange-100 text-orange-800'
                                : order.status === 'cancelled'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm">
                            {estimateUpdating === order.id ? (
                              <div className="flex items-center">
                                <ArrowPathIcon className="animate-spin h-5 w-5 text-gray-500 mr-2" />
                                <span>Updating...</span>
                              </div>
                            ) : (
                              <div className="flex items-center space-x-2">
                                <input 
                                  type="number" 
                                  min="5"
                                  max="120"
                                  className="w-16 rounded border-gray-300 text-sm"
                                  value={order.estimatedCompletionMinutes || timeEstimate[order.id || ''] || ''}
                                  onChange={(e) => setTimeEstimate(prev => ({
                                    ...prev,
                                    [order.id || '']: parseInt(e.target.value) || 0
                                  }))}
                                  placeholder="mins"
                                />
                                <button
                                  onClick={() => updateTimeEstimate(order.id || '', timeEstimate[order.id || ''] || 15)}
                                  className="rounded bg-orange-100 text-orange-800 hover:bg-orange-200 px-2 py-1 text-xs"
                                >
                                  Set Time
                                </button>
                              </div>
                            )}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm">
                            <div className="flex items-center space-x-2">
                              {updating === order.id ? (
                                <ArrowPathIcon className="animate-spin h-5 w-5 text-gray-500" />
                              ) : (
                                <>
                                  <button
                                    disabled={order.status === 'in-progress'}
                                    onClick={() => updateOrderStatus(order.id || '', 'in-progress')}
                                    className={`rounded px-2 py-1 text-xs ${order.status === 'in-progress' 
                                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                      : 'bg-purple-100 text-purple-800 hover:bg-purple-200'}`}
                                  >
                                    <ClockIcon className="inline-block h-3 w-3 mr-1" />
                                    In Progress
                                  </button>
                                  
                                  <button
                                    disabled={order.status === 'ready'}
                                    onClick={() => updateOrderStatus(order.id || '', 'ready')}
                                    className={`rounded px-2 py-1 text-xs ${order.status === 'ready' 
                                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                      : 'bg-blue-100 text-blue-800 hover:bg-blue-200'}`}
                                  >
                                    Ready
                                  </button>
                                  
                                  <button
                                    disabled={order.status === 'completed'}
                                    onClick={() => updateOrderStatus(order.id || '', 'completed')}
                                    className={`rounded px-2 py-1 text-xs ${order.status === 'completed' 
                                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                      : 'bg-green-100 text-green-800 hover:bg-green-200'}`}
                                  >
                                    <CheckCircleIcon className="inline-block h-3 w-3 mr-1" />
                                    Complete
                                  </button>
                                  
                                  <button
                                    disabled={order.status === 'cancelled'}
                                    onClick={() => updateOrderStatus(order.id || '', 'cancelled')}
                                    className={`rounded px-2 py-1 text-xs ${order.status === 'cancelled' 
                                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                      : 'bg-red-100 text-red-800 hover:bg-red-200'}`}
                                  >
                                    <XCircleIcon className="inline-block h-3 w-3 mr-1" />
                                    Cancel
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
