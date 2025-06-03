'use client';

import { categories, menuItems, MenuItem } from '@/data/menu';
import { useCart } from '@/lib/cart-context';
import { CartItem } from '@/lib/types';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { FireIcon, ShoppingCartIcon } from '@heroicons/react/24/solid';

export default function OrderPage() {
  const { state, addItem } = useCart();
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleQuantityChange = (itemId: string, delta: number) => {
    setQuantities((prev: { [key: string]: number }) => ({
      ...prev,
      [itemId]: Math.max(1, (prev[itemId] || 1) + delta)
    }));
  };

  const handleAddToCart = (item: MenuItem) => {
    const quantity = quantities[item.id] || 1;
    const cartItem: CartItem = {
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: quantity,
      image: item.image
    };
    addItem(cartItem);
    
    // Show success message
    setToastMessage(`${quantity} ${quantity > 1 ? 'items' : 'item'} added to cart!`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);

    // Reset quantity after adding to cart
    setQuantities((prev: { [key: string]: number }) => ({ ...prev, [item.id]: 1 }));
  };

  const cartItemCount = state.items.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = state.items.reduce((total, item) => total + (item.price * item.quantity), 0);

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">Online Ordering</h1>
            <p className="mt-4 text-lg text-gray-500">
              Order your favorite Mexican dishes for pickup or delivery
            </p>
          </div>
          <Link
            href="/checkout"
            className="flex items-center gap-3 rounded-md bg-primary-600 px-6 py-3 text-base font-semibold text-white hover:bg-primary-500"
          >
            <div className="relative">
              <ShoppingCartIcon className="h-6 w-6" />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs font-medium text-primary-600">
                  {cartItemCount}
                </span>
              )}
            </div>
            <span>View Cart - ${cartTotal.toFixed(2)}</span>
          </Link>
        </div>

        {/* Toast Notification */}
        {showToast && (
          <div className="fixed bottom-4 right-4 z-50">
            <div className="rounded-md bg-green-50 p-4 shadow-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800">
                    {toastMessage}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-16">
          {categories.map((category) => {
            const items = menuItems.filter((item) => item.category === category.id);
            if (items.length === 0) return null;

            return (
              <div key={category.id} className="mb-16">
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-gray-900">{category.name}</h2>
                  <p className="mt-2 text-lg text-gray-600">{category.description}</p>
                </div>
                <div className="space-y-8">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col md:flex-row gap-8 bg-white rounded-lg shadow-lg overflow-hidden"
                    >
                      <div className="w-full md:w-1/3 h-64 md:h-auto relative">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="text-2xl font-bold text-gray-900">{item.name}</h3>
                            {item.popular && (
                              <span className="mt-1 inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-sm font-medium text-yellow-800">
                                Popular Choice
                              </span>
                            )}
                          </div>
                          <p className="text-2xl font-bold text-primary-600">
                            ${item.price.toFixed(2)}
                          </p>
                        </div>
                        <p className="text-lg text-gray-600 mb-6">{item.description}</p>
                        {item.spicyLevel && (
                          <div className="flex items-center gap-2 mb-6">
                            <span className="text-sm font-medium text-gray-700">Spice Level:</span>
                            <div className="flex items-center gap-1">
                              {[...Array(item.spicyLevel)].map((_, i) => (
                                <FireIcon
                                  key={i}
                                  className="h-5 w-5 text-red-500"
                                  aria-hidden="true"
                                />
                              ))}
                            </div>
                          </div>
                        )}
                        <div className="flex items-center gap-4">
                          <div className="flex items-center rounded-md border border-gray-300">
                            <button
                              type="button"
                              className="px-4 py-2 text-gray-600 hover:text-gray-700 text-lg font-medium"
                              onClick={() => handleQuantityChange(item.id, -1)}
                            >
                              −
                            </button>
                            <span className="px-4 py-2 text-gray-900 text-lg font-medium min-w-[3rem] text-center">
                              {quantities[item.id] || 1}
                            </span>
                            <button
                              type="button"
                              className="px-4 py-2 text-gray-600 hover:text-gray-700 text-lg font-medium"
                              onClick={() => handleQuantityChange(item.id, 1)}
                            >
                              +
                            </button>
                          </div>
                          <button
                            type="button"
                            className="flex-1 rounded-md bg-primary-600 px-6 py-3 text-lg font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                            onClick={() => handleAddToCart(item)}
                          >
                            Add to Cart - ${(item.price * (quantities[item.id] || 1)).toFixed(2)}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
