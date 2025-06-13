'use client';

import { useCart } from '@/lib/cart-context';
import { useState } from 'react';
import { CustomerInfo } from '@/lib/types';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { buttonStyles } from '@/lib/button-styles';

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: state.items,
          subtotal: state.subtotal,
          tax: state.tax,
          total: state.total,
          customerInfo,
          orderType: customerInfo.orderType,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to place order');
      }

      const data = await response.json();
      clearCart();
      router.push(`/order-confirmation?id=${data.id}`);
    } catch (err) {
      console.error('Checkout error:', err);
      alert('Something went wrong placing your order. Please try again.');
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

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Checkout</h1>

          <div className="mt-8">
            <div className="rounded-md bg-blue-50 p-4 mb-8">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">
                    Already have an account?
                  </h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500 underline">
                      Sign in to your account
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-4">
            <div className="space-y-6">
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
                      Name
                    </label>
                    <div className="relative mt-1 rounded-md shadow-sm">
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={customerInfo.name}
                        onChange={handleInputChange}
                        required
                        className="block w-full rounded-md border-gray-300 pl-3 pr-10 py-2 focus:border-red-500 focus:ring-red-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <div className="relative mt-1 rounded-md shadow-sm">
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={customerInfo.email}
                        onChange={handleInputChange}
                        required
                        className="block w-full rounded-md border-gray-300 pl-3 pr-10 py-2 focus:border-red-500 focus:ring-red-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                      Phone
                    </label>
                    <div className="relative mt-1 rounded-md shadow-sm">
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={customerInfo.phone}
                        onChange={handleInputChange}
                        required
                        className="block w-full rounded-md border-gray-300 pl-3 pr-10 py-2 focus:border-red-500 focus:ring-red-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="orderType" className="block text-sm font-medium text-gray-700">
                      Order Type
                    </label>
                    <div className="relative mt-1 rounded-md shadow-sm">
                      <select
                        id="orderType"
                        name="orderType"
                        value={customerInfo.orderType}
                        onChange={handleInputChange}
                        required
                        className="block w-full rounded-md border-gray-300 pl-3 pr-10 py-2 focus:border-red-500 focus:ring-red-500"
                      >
                        <option value="pickup">Pickup</option>
                        <option value="delivery">Delivery</option>
                      </select>
                    </div>
                  </div>
                  {customerInfo.orderType === 'delivery' && (
                    <div>
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                        Delivery Address
                      </label>
                      <div className="relative mt-1 rounded-md shadow-sm">
                        <textarea
                          id="address"
                          name="address"
                          value={customerInfo.address}
                          onChange={handleInputChange}
                          rows={3}
                          required={customerInfo.orderType === 'delivery'}
                          className="block w-full rounded-md border-gray-300 pl-3 pr-10 py-2 focus:border-red-500 focus:ring-red-500"
                        />
                      </div>
                    </div>
                  )}
                  <div>
                    <label htmlFor="instructions" className="block text-sm font-medium text-gray-700">
                      Special Instructions
                    </label>
                    <textarea
                      id="instructions"
                      name="specialInstructions"
                      value={customerInfo.specialInstructions}
                      onChange={handleInputChange}
                      rows={2}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
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
                    className={`${buttonStyles.primary} ${buttonStyles.fullWidth} ${loading ? buttonStyles.disabled : ''}`}
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
