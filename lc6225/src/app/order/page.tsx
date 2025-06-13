'use client';

import { categories, menuItems, MenuItem } from '@/data/menu';
import { useCart } from '@/lib/cart-context';
import { CartItem } from '@/lib/types';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useCallback } from 'react';
import { FireIcon, ShoppingCartIcon } from '@heroicons/react/24/solid';
import { buttonStyles } from '@/lib/button-styles';

export default function OrderPage() {
  const { state, addItem } = useCart();
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<{ [key: string]: boolean }>(() => {
    // Initialize all categories as collapsed by default
    const initialExpanded: { [key: string]: boolean } = {};
    categories.forEach(category => {
      initialExpanded[category.id] = false;
    });
    return initialExpanded;
  });

  const toggleCategory = useCallback((categoryId: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  }, []);

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
                <div className="mb-4 flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <button
                      onClick={() => toggleCategory(category.id)}
                      className={`${buttonStyles.primary} px-4 py-2 whitespace-nowrap flex items-center`}
                      style={{ minWidth: '120px' }}
                    >
                      {category.name}
                      <span className="ml-2">
                        {expandedCategories[category.id] ? '−' : '+'}
                      </span>
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 mt-1.5">
                    {category.description}
                  </p>
                </div>
                <div 
                  className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-300 overflow-hidden mt-2 ${
                    expandedCategories[category.id] ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
                  }`}
                >
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col bg-white rounded-lg shadow-md overflow-hidden h-full hover:shadow-lg transition-shadow duration-200"
                    >
                      <div className="w-full h-40 relative">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="p-4 flex flex-col flex-grow">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-lg font-bold text-gray-900">{item.name}</h3>
                          <p className="text-lg font-bold text-primary-600">
                            ${item.price.toFixed(2)}
                          </p>
                        </div>
                        {item.popular && (
                          <span className="inline-flex items-center rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-800 mb-2 self-start">
                            Popular
                          </span>
                        )}
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.description}</p>
                        {item.spicyLevel && (
                          <div className="flex items-center gap-1.5 mt-auto">
                            <span className="text-xs font-medium text-gray-500">Spice:</span>
                            <div className="flex items-center gap-0.5">
                              {[...Array(item.spicyLevel)].map((_, i) => (
                                <FireIcon
                                  key={i}
                                  className="h-4 w-4 text-red-500"
                                  aria-hidden="true"
                                />
                              ))}
                            </div>
                          </div>
                        )}
                        <div className="flex items-center gap-2 mt-4">
                          <div className="flex items-center rounded-md border border-red-300 bg-white">
                            <button
                              type="button"
                              className="px-3 py-1 text-red-600 hover:bg-red-50 text-base font-medium transition-colors"
                              onClick={() => handleQuantityChange(item.id, -1)}
                            >
                              −
                            </button>
                            <span className="px-3 py-1 text-gray-900 bg-gray-50 text-base font-medium">
                              {quantities[item.id] || 1}
                            </span>
                            <button
                              type="button"
                              className="px-3 py-1 text-red-600 hover:bg-red-50 text-base font-medium transition-colors"
                              onClick={() => handleQuantityChange(item.id, 1)}
                            >
                              +
                            </button>
                          </div>
                          <button
                            type="button"
                            className={`${buttonStyles.primary} flex-1 whitespace-nowrap`}
                            onClick={() => handleAddToCart(item)}
                          >
                            Add to Cart
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
