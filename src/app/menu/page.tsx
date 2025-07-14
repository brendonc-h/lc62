'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/lib/cart-context';
import type { CartItem } from '@/lib/types';
import { categories, menuItems, comboOptions, meatOptions, type MenuItem } from '@/data/menu';
import Link from 'next/link';
import { FireIcon, ChevronDownIcon, ShoppingCartIcon, XCircleIcon, ClockIcon } from '@heroicons/react/24/solid';
import OrderingStatus from '@/components/OrderingStatus';
import { isOrderingAllowed } from '@/data/restaurant-hours';

type VariantType = 'protein' | 'size' | 'spiceLevel';

type SelectedVariants = {
  [itemId: string]: {
    [K in VariantType]?: string;
  };
};

type ComboItem = {
  itemType: string;
  meatType: string;
};

type SelectedCombos = {
  [itemId: string]: ComboItem[];
};

export default function MenuPage() {
  const { addItem } = useCart();
  const [selectedVariants, setSelectedVariants] = useState<SelectedVariants>({});
  const [selectedCombos, setSelectedCombos] = useState<SelectedCombos>({});
  const [orderingAllowed, setOrderingAllowed] = useState({ allowed: true, message: '' });
  const [expandedItems, setExpandedItems] = useState<{[key: string]: boolean}>(() => {
    const initialItems: {[key: string]: boolean} = {};
    menuItems.forEach(item => {
      initialItems[item.id] = false;
    });
    return initialItems;
  });
  
  // Check if ordering is allowed and update every minute
  useEffect(() => {
    // Initial check
    setOrderingAllowed(isOrderingAllowed());
    
    // Set up interval to update every minute
    const interval = setInterval(() => {
      setOrderingAllowed(isOrderingAllowed());
    }, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, []);
  const [expandedCategories, setExpandedCategories] = useState<{[key: string]: boolean}>(() => {
    const initialCategories: {[key: string]: boolean} = {};
    categories.forEach(category => {
      // All categories should be collapsed by default
      initialCategories[category.id] = false;
    });
    return initialCategories;
  });

  const toggleItemExpansion = (itemId: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const toggleCategoryExpansion = (categoryId: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const handleVariantChange = (itemId: string, type: VariantType, value: string) => {
    setSelectedVariants(prev => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        [type]: value
      }
    }));
  };
  
  // Helper to format special request text for combos
const formatComboSpecialRequest = (selections: ComboItem[]) => {
  const getItemName = (id: string) => {
    const item = comboOptions.find(option => option.id === id);
    return item ? item.name : id;
  };
  
  const getMeatName = (id: string) => {
    const meat = meatOptions.find(option => option.id === id);
    return meat ? meat.name : id;
  };
  
  return selections
    .map((sel, idx) => `${idx + 1}. ${getItemName(sel.itemType)} (${getMeatName(sel.meatType)})`)
    .join('\n') + '\nServed with rice and beans.';
};

// Handle adding completed combo to cart
const handleAddComboToCart = (menuItem: MenuItem) => {
  const selections = selectedCombos[menuItem.id] || [];
  if (selections.length !== 3) return; // should already be validated

  const cartItem: CartItem = {
    id: `${menuItem.id}-${Date.now()}`,
    name: menuItem.name,
    price: menuItem.price,
    quantity: 1,
    image: menuItem.image || '',
    specialRequest: formatComboSpecialRequest(selections),
    location: 'la-casita'
  };

  addItem(cartItem);
  // Reset selection for that combo after adding to cart
  setSelectedCombos(prev => ({ ...prev, [menuItem.id]: [] }));
};

// Combo selection functions
  const addComboItem = (comboId: string, maxItems: number) => {
    setSelectedCombos(prev => {
      const currentItems = prev[comboId] || [];
      if (currentItems.length >= maxItems) return prev;
      
      return {
        ...prev,
        [comboId]: [
          ...currentItems,
          { itemType: comboOptions[0].id, meatType: meatOptions[0].id }
        ]
      };
    });
  };
  
  const updateComboItem = (comboId: string, index: number, field: 'itemType' | 'meatType', value: string) => {
    setSelectedCombos(prev => {
      const currentItems = [...(prev[comboId] || [])];
      if (index >= currentItems.length) return prev;
      
      // If selecting the same item type that already exists in another position, prevent it
      if (field === 'itemType') {
        const itemAlreadyExists = currentItems.some((item, i) => i !== index && item.itemType === value);
        if (itemAlreadyExists) return prev;
      }
      
      currentItems[index] = { ...currentItems[index], [field]: value };
      
      return {
        ...prev,
        [comboId]: currentItems
      };
    });
  };
  
  const removeComboItem = (comboId: string, index: number) => {
    setSelectedCombos(prev => {
      const currentItems = [...(prev[comboId] || [])];
      if (index >= currentItems.length) return prev;
      
      currentItems.splice(index, 1);
      
      return {
        ...prev,
        [comboId]: currentItems
      };
    });
  };
  
  const getRequiredComboItems = (item: MenuItem): number => {
    if (item.id === 'medium-combo' || item.id === 'large-combo') return 3;
    return 0;
  };
  
  const isComboComplete = (item: MenuItem): boolean => {
    const comboId = item.id;
    const requiredItems = getRequiredComboItems(item);
    const selectedItems = selectedCombos[comboId] || [];
    return selectedItems.length === requiredItems;
  };

  const getVariantPrice = (item: MenuItem) => {
    if (!item.variants || !selectedVariants[item.id]) return item.price;
    
    const selectedVariant = item.variants.find(variant => {
      const matchesProtein = !selectedVariants[item.id].protein || variant.protein === selectedVariants[item.id].protein;
      const matchesSize = !selectedVariants[item.id].size || variant.size === selectedVariants[item.id].size;
      return matchesProtein && matchesSize;
    });

    return selectedVariant?.price || item.price;
  };

  const renderVariantDropdown = (item: MenuItem, type: VariantType, label: string) => {
    if (!item.variants?.some(v => v[type] !== undefined)) return null;

    const optionSet = new Set<string>();
    const uniqueOptions: string[] = [];
    
    item.variants.forEach(variant => {
      const value = variant[type];
      if (value !== undefined) {
        const strValue = String(value);
        if (!optionSet.has(strValue)) {
          optionSet.add(strValue);
          uniqueOptions.push(strValue);
        }
      }
    });
    
    if (uniqueOptions.length <= 1) return null;
    
    const selectedValue = selectedVariants[item.id]?.[type] || uniqueOptions[0];

    return (
      <div className="mt-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}:</label>
        <div className="relative">
          <select
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md"
            value={selectedValue}
            onChange={(e) => handleVariantChange(item.id, type, e.target.value)}
          >
            {uniqueOptions.map((option) => (
              <option key={option} value={option}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>
    );
  };

  const renderComboSelector = (item: MenuItem) => {
    if (item.id !== 'medium-combo' && item.id !== 'large-combo') return null;

    const comboId = item.id;
    const maxItems = getRequiredComboItems(item);
    const selectedItems = selectedCombos[comboId] || [];
    
    return (
      <div className="mt-6 border-2 border-gray-300 rounded-xl p-3 sm:p-6 lg:p-8 bg-gradient-to-br from-white to-gray-50 shadow-lg min-h-[400px] sm:min-h-[450px] lg:min-h-[500px] mx-3 sm:mx-4 lg:mx-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h4 className="text-xl font-bold text-gray-900">Customize Your Combo</h4>
            <p className="text-base text-gray-700 mt-2 font-medium">Select {maxItems} different items with your preferred meat choices</p>
          </div>
          <div className="text-right">
            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold bg-red-100 text-red-800 border border-red-200">
              {selectedItems.length}/{maxItems} Selected
            </span>
          </div>
        </div>
        
        {selectedItems.length === 0 && (
          <button
            onClick={() => orderingAllowed.allowed ? addComboItem(comboId, maxItems) : null}
            className={`w-full py-3 px-4 border-2 border-dashed rounded-lg text-sm font-medium transition-all duration-200 ${
              orderingAllowed.allowed 
                ? 'border-gray-300 bg-white text-gray-700 hover:border-red-300 hover:bg-red-50 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500' 
                : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
            disabled={!orderingAllowed.allowed}
          >
            <div className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              {orderingAllowed.allowed ? 'Add Your First Item' : 'Ordering Currently Closed'}
            </div>
          </button>
        )}

        <div className="space-y-3 sm:space-y-4 lg:space-y-5">
          {selectedItems.map((comboItem, index) => (
            <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 lg:gap-5 p-3 sm:p-4 lg:p-5 bg-white rounded-lg border-2 border-gray-200 shadow-sm">
              <span className="flex-shrink-0 w-10 h-10 bg-red-100 text-red-800 rounded-full flex items-center justify-center text-lg font-bold border border-red-200">
                {index + 1}
              </span>
              
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-5 w-full">
                <div>
                  <label className="block text-base font-semibold text-gray-700 mb-2">Item Type</label>
                  <select
                    className={`block w-full rounded-md border-gray-300 py-3 pl-3 pr-10 text-base font-medium focus:border-red-500 focus:outline-none focus:ring-red-500 ${
                      !orderingAllowed.allowed ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-white'
                    }`}
                    value={comboItem.itemType}
                    onChange={(e) => orderingAllowed.allowed ? updateComboItem(comboId, index, 'itemType', e.target.value) : null}
                    disabled={!orderingAllowed.allowed}
                  >
                    {comboOptions.map(option => {
                      const isAlreadySelected = selectedItems.some((item, i) => i !== index && item.itemType === option.id);
                      return (
                        <option key={option.id} value={option.id} disabled={isAlreadySelected}>
                          {option.name} {isAlreadySelected ? '(Already selected)' : ''}
                        </option>
                      );
                    })}
                  </select>
                </div>
                
                <div>
                  <label className="block text-base font-semibold text-gray-700 mb-2">Meat Choice</label>
                  <select
                    className={`block w-full rounded-md border-gray-300 py-3 pl-3 pr-10 text-base font-medium focus:border-red-500 focus:outline-none focus:ring-red-500 ${
                      !orderingAllowed.allowed ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-white'
                    }`}
                    value={comboItem.meatType}
                    onChange={(e) => orderingAllowed.allowed ? updateComboItem(comboId, index, 'meatType', e.target.value) : null}
                    disabled={!orderingAllowed.allowed}
                  >
                    {meatOptions.map(meat => (
                      <option key={meat.id} value={meat.id}>
                        {meat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <button
                onClick={() => orderingAllowed.allowed ? removeComboItem(comboId, index) : null}
                className={`flex-shrink-0 p-2 text-red-600 hover:text-red-800 transition-colors hover:bg-red-50 rounded-full ${
                  !orderingAllowed.allowed ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                title="Remove item"
                disabled={!orderingAllowed.allowed}
              >
                <XCircleIcon className="h-6 w-6" />
              </button>
            </div>
          ))}
        </div>
        
        {/* Add/Remove Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-5 sm:mt-6 lg:mt-7 pt-5 sm:pt-6 lg:pt-7 border-t-2 border-gray-200 gap-3 sm:gap-4 lg:gap-5">
          <div className="flex items-center gap-4">
            {selectedItems.length < maxItems && (
              <button
                onClick={() => orderingAllowed.allowed ? addComboItem(comboId, maxItems) : null}
                className={`inline-flex items-center px-6 py-3 border-2 border-red-300 text-lg font-semibold rounded-lg text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors ${
                  !orderingAllowed.allowed ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={!orderingAllowed.allowed}
              >
                + Add Item
              </button>
            )}
            {selectedItems.length > 0 && (
              <button
                onClick={() => orderingAllowed.allowed ? setSelectedCombos(prev => ({ ...prev, [comboId]: [] })) : null}
                className={`inline-flex items-center px-6 py-3 border-2 border-gray-300 text-lg font-semibold rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors ${
                  !orderingAllowed.allowed ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={!orderingAllowed.allowed}
              >
                Reset All
              </button>
            )}
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {selectedItems.length === maxItems && orderingAllowed.allowed ? (
              <div className="flex items-center text-green-600 text-base font-bold">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Ready to order!
              </div>
            ) : !orderingAllowed.allowed ? (
              <div className="text-base text-gray-600 font-medium">
                {orderingAllowed.message}
              </div>
            ) : (
              <div className="text-base text-gray-600 font-medium">
                Select {maxItems - selectedItems.length} more item{maxItems - selectedItems.length !== 1 ? 's' : ''}
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-6">
          <button
            onClick={() => {
              console.log('Menu combo button clicked:', {
                isComplete: selectedItems.length === maxItems,
                orderingAllowed: orderingAllowed.allowed,
                selections: selectedItems
              });
              handleAddComboToCart(item);
            }}
            disabled={selectedItems.length !== maxItems || !orderingAllowed.allowed}
            className={`w-full py-4 px-6 rounded-lg font-bold text-white transition-all duration-200 text-lg ${
              selectedItems.length === maxItems && orderingAllowed.allowed
                ? 'bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 shadow-lg hover:shadow-xl transform hover:scale-[1.02]'
                : 'bg-gray-400 cursor-not-allowed opacity-50'
            }`}
          >
            {!orderingAllowed.allowed 
              ? orderingAllowed.message
              : selectedItems.length !== maxItems 
              ? `Select ${maxItems - selectedItems.length} More Item${maxItems - selectedItems.length !== 1 ? 's' : ''}`
              : 'Add Combo to Cart'
            }
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-none">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 text-center mb-6">Our Menu</h2>
          
          {/* Restaurant hours and ordering status */}
          <div className="mb-6">
            <OrderingStatus className="mb-2" />
          </div>
          <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">
            Discover our authentic Mexican dishes made with fresh ingredients and traditional recipes
          </p>
          <Link
            href="/order"
            className="mt-8 inline-flex items-center gap-2 rounded-md bg-red-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 transition-colors duration-200"
          >
            <ShoppingCartIcon className="h-5 w-5" />
            Order Online
          </Link>
        </div>

        <div className="mt-16">
          {categories.map((category) => {
            const items = menuItems.filter((item) => item.category === category.id);
            if (items.length === 0) return null;

            const isExpanded = expandedCategories[category.id];
            
            return (
              <div key={category.id} className="mb-8 border-b border-gray-200 dark:border-gray-700 pb-8">
                <button
                  onClick={() => toggleCategoryExpansion(category.id)}
                  className="w-full text-left focus:outline-none group"
                >
                  <div className={`rounded-xl p-6 bg-gradient-to-r ${category.color || 'from-gray-400 to-gray-600'} shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        {category.emoji && (
                          <div className="text-4xl bg-white bg-opacity-20 rounded-full p-3 backdrop-blur-sm">
                            {category.emoji}
                          </div>
                        )}
                        <div>
                          <h2 className="text-3xl font-bold text-white group-hover:text-yellow-100 transition-colors">
                            {category.name}
                          </h2>
                          <p className="mt-2 text-lg text-white text-opacity-90">{category.description}</p>
                        </div>
                      </div>
                      <ChevronDownIcon
                        className={`h-8 w-8 text-white text-opacity-80 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                </button>
                <div className={`space-y-8 mt-6 ${isExpanded ? 'block' : 'hidden'}`}>
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
                    >
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h3 className="text-2xl font-bold text-gray-900">{item.name}</h3>
                              <button
                                onClick={() => toggleItemExpansion(item.id)}
                                className="md:hidden text-gray-400 hover:text-gray-500"
                              >
                                <ChevronDownIcon 
                                  className={`h-6 w-6 transform ${expandedItems[item.id] ? 'rotate-180' : ''}`} 
                                  aria-hidden="true" 
                                />
                              </button>
                            </div>
                            {item.popular && (
                              <span className="mt-1 inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-sm font-medium text-yellow-800">
                                Popular Choice
                              </span>
                            )}
                          </div>
                          <p className="text-2xl font-bold text-red-600 ml-4 whitespace-nowrap">
                            ${getVariantPrice(item).toFixed(2)}
                          </p>
                        </div>
                        
                        <p className="text-lg text-gray-600 mb-4">{item.description}</p>
                        
                        <div className={`space-y-3 ${expandedItems[item.id] ? 'block' : 'hidden md:block'}`}>
                          {item.spicyLevel && (
                            <div className="flex items-center gap-2">
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

                          <div className="space-y-3 mt-3">
                            {renderVariantDropdown(item, 'protein', 'Protein')}
                            {renderVariantDropdown(item, 'size', 'Size')}
                            {renderVariantDropdown(item, 'spiceLevel', 'Spice Level')}
                            {renderComboSelector(item)}
                          </div>
                          
                          {/* Show add to cart button for combos when all items are selected */}
                          {(item.id === 'medium-combo' || item.id === 'large-combo') && isComboComplete(item) && (
                            <div className="mt-4">
                              <button
                                className={`w-full flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${orderingAllowed.allowed ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-400 cursor-not-allowed'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500`}
                                disabled={!orderingAllowed.allowed}
                                onClick={() => orderingAllowed.allowed ? handleAddComboToCart(item) : null}
                              >
                                <ShoppingCartIcon className="h-5 w-5 mr-1" />
                                {orderingAllowed.allowed ? 'Add to Cart' : 'Ordering Closed'}
                              </button>
                              {!orderingAllowed.allowed && (
                                <p className="mt-2 text-xs text-amber-600">
                                  <ClockIcon className="inline-block h-4 w-4 mr-1" />
                                  {orderingAllowed.message}
                                </p>
                              )}
                            </div>
                          )}
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
