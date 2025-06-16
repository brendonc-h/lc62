'use client';

import { categories, menuItems, MenuItem, SpiceLevel } from '@/data/menu';
import { useCart } from '@/lib/cart-context';
import { CartItem } from '@/lib/types';
import Link from 'next/link';
import { useState, useCallback } from 'react';
import { FireIcon, ShoppingCartIcon } from '@heroicons/react/24/solid';

// Log all categories and menu items for debugging
console.log('All categories:', categories);
console.log('All menu items:', menuItems);

// Log menu items that don't have matching categories
const invalidMenuItems = menuItems.filter(item => !categories.some(cat => cat.id === item.category));
if (invalidMenuItems.length > 0) {
  console.warn('Menu items with invalid categories:', invalidMenuItems);
}

export default function OrderPage() {
  const { state, addItem } = useCart();
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [selectedVariants, setSelectedVariants] = useState<{[key: string]: string}>({});
  const [spiceLevels, setSpiceLevels] = useState<{[key: string]: SpiceLevel}>(() => {
    // Initialize with default spice levels for items that have them
    const initialLevels: {[key: string]: SpiceLevel} = {};
    menuItems.forEach(item => {
      if (item.defaultSpiceLevel) {
        initialLevels[item.id] = item.defaultSpiceLevel;
      }
    });
    return initialLevels;
  });
  const [expandedCategories, setExpandedCategories] = useState<{ [key: string]: boolean }>(() => {
    // Initialize all categories as collapsed by default
    const initialExpanded: { [key: string]: boolean } = {};
    categories.forEach(category => {
      initialExpanded[category.id] = false;
      
      // Expand the first category by default if it has items
      const hasItems = menuItems.some(item => item.category === category.id);
      if (hasItems && Object.keys(initialExpanded).length === 0) {
        initialExpanded[category.id] = true;
      }
    });
    return initialExpanded;
  });

  const toggleCategory = useCallback((categoryId: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  }, []);

  const handleQuantityChange = useCallback((itemId: string, delta: number) => {
    setQuantities(prev => ({
      ...prev,
      [itemId]: Math.max(1, (prev[itemId] || 1) + delta)
    }));
  }, []);

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
            className="flex items-center gap-3 rounded-md bg-red-600 px-6 py-3 text-base font-semibold text-white hover:bg-red-700"
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
            const items = menuItems.filter((item) => {
              // Debug: Log items that don't match any category
              if (!item.category) {
                console.warn(`Menu item ${item.name} (${item.id}) has no category`);
                return false;
              }
              return item.category === category.id;
            });
            
            // Debug: Log categories with no items
            if (items.length === 0) {
              console.log(`No items found for category: ${category.name} (${category.id})`);
              return null;
            }

            return (
              <div key={category.id} className="mb-16">
                <div className="mb-4 flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <button
                      onClick={() => toggleCategory(category.id)}
                      className="inline-flex items-center justify-center px-4 py-2 rounded-md font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 whitespace-nowrap"
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
                      {/* Popular badge */}
                      <div className="w-full h-8 flex items-center justify-center bg-gray-100 rounded-t">
                        {item.popular && (
                          <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                            Popular
                          </span>
                        )}
                      </div>
                      <div className="p-4 flex flex-col h-full">
                        <div className="flex justify-between items-start">
                          <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                          <span className="text-red-600 font-bold whitespace-nowrap ml-2">${item.price.toFixed(2)}</span>
                        </div>
                        
                        {item.description && (
                          <p className="text-sm text-gray-600 mt-2">{item.description}</p>
                        )}
                        
                        {typeof item.spicyLevel === 'number' && item.spicyLevel > 0 && (
                          <div className="flex items-center gap-1.5 mt-2 mb-3">
                            <span className="text-xs text-gray-500">Spice Level:</span>
                            {[...Array(3)].map((_, i) => (
                              <FireIcon
                                key={i}
                                className={`h-4 w-4 ${i < item.spicyLevel! ? 'text-red-500' : 'text-gray-200'}`}
                                aria-hidden="true"
                              />
                            ))}
                          </div>
                        )}
                        
                        <div className="mt-4 space-y-3">
                          {item.variants && item.variants.length > 0 && (
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Style
                              </label>
                              <select
                                value={selectedVariants[item.id] || ''}
                                onChange={(e) => setSelectedVariants(prev => ({
                                  ...prev,
                                  [item.id]: e.target.value
                                }))}
                                className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm"
                              >
                                <option value="">Select an option</option>
                                {item.variants.map(variant => (
                                  <option key={variant.name} value={variant.name}>
                                    {variant.name} - ${variant.price.toFixed(2)}
                                  </option>
                                ))}
                              </select>
                              {selectedVariants[item.id] && (
                                <p className="mt-1 text-xs text-gray-500">
                                  {item.variants.find(v => v.name === selectedVariants[item.id])?.description}
                                </p>
                              )}
                            </div>
                          )}

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Spice Level
                            </label>
                            <div className="flex space-x-4">
                              {(['mild', 'medium', 'hot'] as SpiceLevel[]).map((level) => (
                                <label key={level} className="inline-flex items-center">
                                  <input
                                    type="radio"
                                    name={`spice-${item.id}`}
                                    checked={spiceLevels[item.id] === level || (!spiceLevels[item.id] && item.defaultSpiceLevel === level)}
                                    onChange={() => setSpiceLevels(prev => ({
                                      ...prev,
                                      [item.id]: level
                                    }))}
                                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
                                  />
                                  <span className="ml-2 text-sm text-gray-700 capitalize">{level}</span>
                                </label>
                              ))}
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-2">
                            <div className="flex items-center border border-gray-300 rounded-md">
                              <button
                                type="button"
                                onClick={() => handleQuantityChange(item.id, -1)}
                                className="text-red-600 hover:text-red-900 font-bold text-lg px-2"
                              >
                                -
                              </button>
                              <span className="px-2">{quantities[item.id] || 1}</span>
                              <button
                                type="button"
                                onClick={() => handleQuantityChange(item.id, 1)}
                                className="text-red-600 hover:text-red-900 font-bold text-lg px-2"
                              >
                                +
                              </button>
                            </div>
                            
                            <button
                              onClick={() => handleAddToCart(item)}
                              disabled={item.variants && !selectedVariants[item.id]}
                              className={`inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                                (item.variants && !selectedVariants[item.id])
                                  ? 'bg-gray-400 cursor-not-allowed'
                                  : 'bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'
                              }`}
                            >
                              Add to Cart
                            </button>
                          </div>
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
