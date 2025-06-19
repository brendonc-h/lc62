'use client';

import { useCart } from '@/lib/cart-context';
import { useState } from 'react';
import { CustomerInfo } from '@/lib/types';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CheckoutPage() {
  const router = useRouter();
  const { state, clearCart } = useCart();
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '',
    email: '',
    phone: '',
    orderType: 'pickup',
    address: '',
    specialInstructions: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const orderData = {
        items: state.items,
        subtotal: state.subtotal,
        tax: state.tax,
        total: state.total,
        customerInfo,
        orderType: customerInfo.orderType,
        status: 'preparing',
        createdAt: new Date().toISOString(),
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to place order');
      }

      const data = await response.json();
      clearCart();
      router.push(`/order-confirmation?id=${data.id}`);
    } catch (err) {
      console.error('Checkout error:', err);
      setError(err instanceof Error ? err.message : 'Something went wrong placing your order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCustomerInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (state.items.length === 0) {
    return (
      <div className="bg-white min-h-screen">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Your cart is empty</h1>
            <p className="mt-4 text-lg text-gray-500">
              Add some delicious items to your cart before checking out.
            </p>
            <Link
              href="/order"
              className="mt-8 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
            >
              Start Ordering
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Checkout</h1>

          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-12">
            <div className="divide-y divide-gray-200">
              {/* Order Summary */}
              <div className="py-6">
                <h2 className="text-lg font-medium text-gray-900">Order Summary</h2>
                <div className="mt-4 space-y-4">
                  {state.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-full w-full object-cover object-center"
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-base font-medium text-gray-900">{item.name}</div>
                          <div className="text-sm text-gray-500">Qty {item.quantity}</div>
                          {item.variant && (
                            <div className="text-sm text-gray-500">{item.variant}</div>
                          )}
                          {item.spiceLevel && (
                            <div className="text-sm text-gray-500">Spice: {item.spiceLevel}</div>
                          )}
                        </div>
                      </div>
                      <p className="text-sm font-medium text-gray-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="mt-6 space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <p>Subtotal</p>
                    <p>${state.subtotal.toFixed(2)}</p>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <p>Tax</p>
                    <p>${state.tax.toFixed(2)}</p>
                  </div>
                  <div className="flex justify-between text-base font-medium text-gray-900">
                    <p>Total</p>
                    <p>${state.total.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              {/* Customer Information */}
              <div className="py-6">
                <h2 className="text-lg font-medium text-gray-900">Customer Information</h2>
                <div className="mt-4 space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={customerInfo.name}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={customerInfo.email}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={customerInfo.phone}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="orderType" className="block text-sm font-medium text-gray-700">
                      Order Type *
                    </label>
                    <select
                      id="orderType"
                      name="orderType"
                      value={customerInfo.orderType}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                    >
                      <option value="pickup">Pickup</option>
                      <option value="delivery">Delivery</option>
                    </select>
                  </div>
                  {customerInfo.orderType === 'delivery' && (
                    <div>
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                        Delivery Address *
                      </label>
                      <textarea
                        id="address"
                        name="address"
                        value={customerInfo.address}
                        onChange={handleInputChange}
                        rows={3}
                        required={customerInfo.orderType === 'delivery'}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                      />
                    </div>
                  )}
                  <div>
                    <label htmlFor="specialInstructions" className="block text-sm font-medium text-gray-700">
                      Special Instructions
                    </label>
                    <textarea
                      id="specialInstructions"
                      name="specialInstructions"
                      value={customerInfo.specialInstructions}
                      onChange={handleInputChange}
                      rows={2}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                    />
                  </div>
                </div>
              </div>

              {/* Payment */}
              <div className="py-6">
                <h2 className="text-lg font-medium text-gray-900">Payment</h2>
                <div className="mt-4">
                  <div className="rounded-md border border-gray-300 px-4 py-3">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">Pay at pickup/delivery</div>
                      <div className="text-lg font-medium text-gray-900">${state.total.toFixed(2)}</div>
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      Payment will be collected when you receive your order.
                    </p>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="mt-6 w-full rounded-md bg-red-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Processing...' : 'Place Order'}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}