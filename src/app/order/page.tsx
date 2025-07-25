'use client';

import { categories, menuItems, MenuItem } from '@/data/menu';
import { useCart } from '@/lib/cart-context';
import { CartItem } from '@/lib/types';
import Link from 'next/link';
import { useState, useCallback } from 'react';
import { ShoppingCartIcon, MapPinIcon, XCircleIcon } from '@heroicons/react/24/solid';
import { isOrderingAllowed } from '@/data/restaurant-hours';

import { useEffect } from 'react';

// Validate menu items at compile time
const invalidMenuItems = menuItems.filter(item => !categories.some(cat => cat.id === item.category));

// Create a reusable debug logging function
const debug = process.env.NODE_ENV === 'development' 
  ? (...args: any[]) => console.log(...args)
  : () => {};

// Combo selection types and data
interface ComboItem {
  itemType: string;
  meatType: string;
}

const comboOptions = [
  { id: 'enchilada', name: 'Enchilada' },
  { id: 'taco', name: 'Taco' },
  { id: 'burrito', name: 'Burrito' },
  { id: 'tamale', name: 'Tamale' },
  { id: 'chile-relleno', name: 'Chile Relleno' },
  { id: 'tostada', name: 'Tostada' }
];

const meatOptions = [
  { id: 'beef', name: 'Beef' },
  { id: 'chicken', name: 'Chicken' },
  { id: 'pork', name: 'Pork' },
  { id: 'bean-cheese', name: 'Bean & Cheese' }
];

export default function OrderPage() {
  const { state, addItem } = useCart();
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [selectedVariants, setSelectedVariants] = useState<{[key: string]: string}>({});
  const [specialRequests, setSpecialRequests] = useState<{[key: string]: string}>({});
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [selectedCombos, setSelectedCombos] = useState<{[key: string]: ComboItem[]}>({});
  const [noTortillaOptions, setNoTortillaOptions] = useState<{[key: string]: boolean}>({});
  const [greenChileOptions, setGreenChileOptions] = useState<{[key: string]: string}>({});
  const [addSteakOptions, setAddSteakOptions] = useState<{[key: string]: boolean}>({});
  const [sauceTypeOptions, setSauceTypeOptions] = useState<{[key: string]: string}>({});
  const [addChorizoOptions, setAddChorizoOptions] = useState<{[key: string]: boolean}>({});
  const [meatChoiceOptions, setMeatChoiceOptions] = useState<{[key: string]: string}>({});
  const orderingAllowed = isOrderingAllowed('berthoud');
  const [expandedCategories, setExpandedCategories] = useState<{ [key: string]: boolean }>(() => {
    // Initialize all categories as collapsed by default
    const initialExpanded: { [key: string]: boolean } = {};
    let firstCategorySet = false;
    
    categories.forEach(category => {
      // Expand the first category by default if it has items
      const hasItems = menuItems.some(item => item.category === category.id);
      if (hasItems && !firstCategorySet) {
        initialExpanded[category.id] = true;
        firstCategorySet = true;
      } else {
        initialExpanded[category.id] = false;
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

  // Combo helper functions
  const getRequiredComboItems = (item: MenuItem): number => {
    if (item.id === 'medium-combo' || item.id === 'large-combo') return 3;
    return 0;
  };

  const addComboItem = (comboId: string, maxItems: number) => {
    setSelectedCombos(prev => {
      const currentItems = prev[comboId] || [];
      if (currentItems.length >= maxItems) return prev;
      
      return {
        ...prev,
        [comboId]: [...currentItems, { itemType: comboOptions[0].id, meatType: meatOptions[0].id }]
      };
    });
  };

  const removeComboItem = (comboId: string, index: number) => {
    setSelectedCombos(prev => {
      const currentItems = [...(prev[comboId] || [])];
      currentItems.splice(index, 1);
      return { ...prev, [comboId]: currentItems };
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
      return { ...prev, [comboId]: currentItems };
    });
  };

  const isComboComplete = (item: MenuItem): boolean => {
    const comboId = item.id;
    const requiredItems = getRequiredComboItems(item);
    const selectedItems = selectedCombos[comboId] || [];
    return selectedItems.length === requiredItems;
  };

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

  const handleAddComboToCart = (menuItem: MenuItem) => {
    if (!selectedLocation) {
      setToastMessage('Please select a location first!');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }

    const selections = selectedCombos[menuItem.id] || [];
    if (selections.length !== 3) return; // should already be validated

    const cartItem: CartItem = {
      id: `${menuItem.id}-${Date.now()}`,
      name: menuItem.name,
      price: menuItem.price,
      quantity: 1,
      image: menuItem.image || '/lacasitalogo.jpg',
      specialRequest: formatComboSpecialRequest(selections),
      location: selectedLocation
    };

    addItem(cartItem);
    // Reset selection for that combo after adding to cart
    setSelectedCombos(prev => ({ ...prev, [menuItem.id]: [] }));
    
    // Show success message
    setToastMessage('Combo added to cart!');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleAddToCart = (item: MenuItem) => {
    if (!selectedLocation) {
      setToastMessage('Please select a location first!');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }
    
    const quantity = quantities[item.id] || 1;
    let specialRequest = specialRequests[item.id] || '';

    // Add selected options to special request
    const options = [];
    if (noTortillaOptions[item.id]) {
      options.push('No Tortilla');
    }
    if (greenChileOptions[item.id]) {
      options.push(`Green Chile: ${greenChileOptions[item.id]}`);
    }
    if (addSteakOptions[item.id]) {
      options.push('Add Steak (+$2.00)');
    }
    if (sauceTypeOptions[item.id]) {
      options.push(`${sauceTypeOptions[item.id]} Sauce`);
    }
    if (addChorizoOptions[item.id]) {
      options.push('Add Chorizo (+$1.99)');
    }
    if (meatChoiceOptions[item.id]) {
      options.push(`Add ${meatChoiceOptions[item.id]} (+$2.00)`);
    }

    if (options.length > 0) {
      specialRequest = options.join(', ') + (specialRequest ? ` | ${specialRequest}` : '');
    }

    // Calculate price with add-ons
    let finalPrice = item.price;
    if (addSteakOptions[item.id]) {
      finalPrice += 2.00;
    }
    if (addChorizoOptions[item.id]) {
      finalPrice += 1.99;
    }
    if (meatChoiceOptions[item.id]) {
      finalPrice += 2.00;
    }

    const cartItem: CartItem = {
      id: item.id,
      name: item.name,
      price: finalPrice,
      quantity: quantity,
      image: item.image || '/lacasitalogo.jpg',
      specialRequest: specialRequest,
      location: selectedLocation
    };
    addItem(cartItem);
    
    // Show success message
    setToastMessage(`${quantity} ${quantity > 1 ? 'items' : 'item'} added to cart!`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);

    // Reset quantity and options after adding to cart
    setQuantities((prev) => ({ ...prev, [item.id]: 1 }));
    setNoTortillaOptions((prev) => ({ ...prev, [item.id]: false }));
    setGreenChileOptions((prev) => ({ ...prev, [item.id]: '' }));
    setAddSteakOptions((prev) => ({ ...prev, [item.id]: false }));
    setSauceTypeOptions((prev) => ({ ...prev, [item.id]: '' }));
    setAddChorizoOptions((prev) => ({ ...prev, [item.id]: false }));
    setMeatChoiceOptions((prev) => ({ ...prev, [item.id]: '' }));
  };

  const cartItemCount = state.items.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = state.items.reduce((total, item) => total + (item.price * item.quantity), 0);

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 pb-32 sm:px-6 lg:px-8">
        {/* Location Selector */}
        <div className="bg-amber-50 p-6 rounded-lg shadow-lg mb-8 border-2 border-red-500">
          <h2 className="text-2xl font-bold flex items-center mb-4 text-gray-800">
            <MapPinIcon className="h-7 w-7 mr-2 text-red-600" />
            Select Your Location First
          </h2>
          {!selectedLocation && (
            <div className="bg-amber-100 p-3 rounded-md mb-4 border-l-4 border-amber-500">
              <p className="text-amber-800 font-medium">Please select a location before adding items to your cart</p>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <button
              onClick={() => setSelectedLocation('Berthoud')}
              className={`p-5 rounded-lg flex items-center ${selectedLocation === 'Berthoud' 
                ? 'bg-red-600 text-white border-2 border-red-700 ring-2 ring-red-300' 
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-red-50'}`}
            >
              <div className="flex-1">
                <h3 className="font-bold text-lg">{selectedLocation === 'Berthoud' ? '✓ Berthoud' : 'Berthoud'}</h3>
                <p className="text-sm">
                  950 Mountain Ave, Berthoud, CO 80513
                </p>
                <p className="text-xs mt-1">
                  {selectedLocation === 'Berthoud' ? 'Selected for pickup' : 'Tap to select this location'}
                </p>
              </div>
            </button>

            <button
              onClick={() => setSelectedLocation('Fort Collins')}
              className={`p-5 rounded-lg flex items-center ${selectedLocation === 'Fort Collins' 
                ? 'bg-red-600 text-white border-2 border-red-700 ring-2 ring-red-300' 
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-red-50'}`}
            >
              <div className="flex-1">
                <h3 className="font-bold text-lg">{selectedLocation === 'Fort Collins' ? '✓ Fort Collins' : 'Fort Collins'}</h3>
                <p className="text-sm">
                  2909 E Harmony Rd, Fort Collins, CO 80528
                </p>
                <p className="text-xs mt-1">
                  {selectedLocation === 'Fort Collins' ? 'Selected for pickup' : 'Tap to select this location'}
                </p>
              </div>
            </button>
          </div>
          {!selectedLocation && (
            <p className="mt-2 text-sm text-red-600">* Please select a location to continue with your order</p>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">Online Ordering</h1>
            <p className="mt-4 text-lg text-gray-500">
              Order your favorite Mexican dishes for pickup {selectedLocation && `at our ${selectedLocation} location`}
            </p>
          </div>
          <Link
            href="/checkout"
            className="flex items-center gap-3 rounded-md bg-red-600 px-6 py-3 text-base font-semibold text-white hover:bg-red-700"
          >
            <div className="relative">
              <ShoppingCartIcon className="h-6 w-6" />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs font-medium text-red-600">
                  {cartItemCount}
                </span>
              )}
            </div>
            <span>View Cart {(cartTotal !== undefined && typeof cartTotal === 'number') ? `- $${cartTotal.toFixed(2)}` : ''}</span>
          </Link>
        </div>

        {/* Toast notification */}
        {showToast && (
          <div className={`fixed bottom-4 right-4 ${toastMessage.includes('Please select') ? 'bg-amber-500' : 'bg-green-600'} text-white px-6 py-3 rounded-md shadow-lg z-50`}>
            {toastMessage}
          </div>
        )}

        <div className="mt-16 pb-20">
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
              <div key={category.id} className={`mb-16 ${category.id === 'vegetarian' ? 'mb-24' : ''}`}>
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

                {/* Combo Cards - Full Width */}
                {items.filter(item => item.id === 'medium-combo' || item.id === 'large-combo').map((item) => (
                  <div key={`combo-${item.id}`} className={`transition-all duration-300 overflow-hidden mt-4 ${
                    expandedCategories[category.id] ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                  }`}>
                    <div className="border-2 border-gray-200 rounded-lg p-4 sm:p-6 bg-gradient-to-br from-white to-gray-50 shadow-md hover:shadow-lg transition-shadow duration-200">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="text-lg font-bold text-gray-900">Customize Your {item.name}</h4>
                          <p className="text-sm text-gray-600 mt-1">Select 3 different items with your preferred meat choices - ${(item.price && typeof item.price === 'number') ? item.price.toFixed(2) : '0.00'}</p>
                        </div>
                        <div className="text-right">
                          <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-200">
                            {(selectedCombos[item.id] || []).length}/3 Selected
                          </span>
                        </div>
                      </div>

                      {/* Combo Items */}
                      <div className="space-y-3">
                        {(selectedCombos[item.id] || []).map((selection, index) => (
                          <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                            <span className="flex-shrink-0 w-8 h-8 bg-red-100 text-red-800 rounded-full flex items-center justify-center text-sm font-bold border border-red-200">
                              {index + 1}
                            </span>
                            
                            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Item Type</label>
                                <select
                                  value={selection.itemType}
                                  onChange={(e) => updateComboItem(item.id, index, 'itemType', e.target.value)}
                                  className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-sm focus:border-red-500 focus:outline-none focus:ring-red-500"
                                  disabled={!orderingAllowed.allowed}
                                >
                                  {comboOptions.map(option => {
                                    const isAlreadySelected = (selectedCombos[item.id] || []).some((sel, i) => i !== index && sel.itemType === option.id);
                                    return (
                                      <option key={option.id} value={option.id} disabled={isAlreadySelected}>
                                        {option.name} {isAlreadySelected ? '(Already selected)' : ''}
                                      </option>
                                    );
                                  })}
                                </select>
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Meat Choice</label>
                                <select
                                  value={selection.meatType}
                                  onChange={(e) => updateComboItem(item.id, index, 'meatType', e.target.value)}
                                  className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-sm focus:border-red-500 focus:outline-none focus:ring-red-500"
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
                              type="button"
                              onClick={() => removeComboItem(item.id, index)}
                              className="inline-flex items-center px-3 py-1.5 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-red-500 transition-colors"
                              disabled={!orderingAllowed.allowed}
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                      
                      {/* Add/Remove Controls */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-4 pt-4 border-t border-gray-200 gap-3">
                        <div className="flex items-center gap-3">
                          {(selectedCombos[item.id] || []).length < 3 && (
                            <button
                              type="button"
                              onClick={() => addComboItem(item.id, getRequiredComboItems(item))}
                              className="inline-flex items-center px-4 py-2 border border-green-300 text-sm font-medium rounded-md text-green-700 bg-white hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-green-500 transition-colors"
                              disabled={!orderingAllowed.allowed}
                            >
                              Add Item
                            </button>
                          )}
                          
                          {(selectedCombos[item.id] || []).length > 0 && (
                            <button
                              type="button"
                              onClick={() => setSelectedCombos(prev => ({ ...prev, [item.id]: [] }))}
                              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-500 transition-colors"
                              disabled={!orderingAllowed.allowed}
                            >
                              Reset All
                            </button>
                          )}
                        </div>
                        
                        <button
                          onClick={() => {
                            debug('Combo button clicked:', {
                              isComplete: isComboComplete(item),
                              orderingAllowed: orderingAllowed.allowed,
                              selectedLocation: selectedLocation,
                              selections: selectedCombos[item.id]
                            });
                            handleAddComboToCart(item);
                          }}
                          disabled={!isComboComplete(item) || !orderingAllowed.allowed || !selectedLocation}
                          className={`inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white transition-all ${
                            (!isComboComplete(item) || !orderingAllowed.allowed || !selectedLocation)
                              ? 'bg-gray-400 cursor-not-allowed opacity-50'
                              : 'bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-red-500 hover:shadow-md'
                          }`}
                        >
                          Add Combo to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Regular Items Grid */}
                <div 
                  className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-300 overflow-hidden mt-2 ${
                    expandedCategories[category.id] ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  {items.filter(item => !(item.id === 'medium-combo' || item.id === 'large-combo')).map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col bg-white rounded-lg shadow-md overflow-hidden h-full hover:shadow-lg transition-shadow duration-200"
                    >
                      {/* Popular badge */}
                      <div className="w-full h-8 flex items-center justify-center bg-gray-100 rounded-t">
                        {item.popular && (
                          <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                            Popular
                          </span>
                        )}
                      </div>
                      <div className="p-4 flex flex-col h-full">
                        <div className="flex justify-between items-start">
                          <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                          <span className="text-red-600 font-bold whitespace-nowrap ml-2">${item.price ? item.price.toFixed(2) : '0.00'}</span>
                        </div>
                        
                        {item.description && (
                          <p className="text-sm text-gray-600 mt-2">{item.description}</p>
                        )}
                        
                        <div className="mt-4 space-y-3 flex-grow">
                          {/* Variants */}
                          {item.variants && item.variants.length > 0 && (
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Choose Option</label>
                              <select
                                value={selectedVariants[item.id] || ''}
                                onChange={(e) => setSelectedVariants(prev => ({ ...prev, [item.id]: e.target.value }))}
                                className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-red-500 focus:outline-none focus:ring-red-500"
                              >
                                <option value="">Select option...</option>
                                {item.variants.map((variant) => (
                                  <option key={variant.name} value={variant.name}>
                                    {variant.name} - ${variant.price ? variant.price.toFixed(2) : '0.00'}
                                  </option>
                                ))}
                              </select>
                            </div>
                          )}

                          {/* No Tortilla Option for Breakfast Burritos */}
                          {item.noTortillaOption && (
                            <div>
                              <label className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  checked={noTortillaOptions[item.id] || false}
                                  onChange={(e) => setNoTortillaOptions(prev => ({ ...prev, [item.id]: e.target.checked }))}
                                  className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                                />
                                <span className="text-sm font-medium text-gray-700">No Tortilla</span>
                              </label>
                            </div>
                          )}

                          {/* Green Chile Options */}
                          {item.greenChileOptions && (
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Green Chile</label>
                              <div className="flex space-x-3">
                                {['mild', 'medium', 'hot'].map((level) => (
                                  <label key={level} className="flex items-center space-x-1">
                                    <input
                                      type="radio"
                                      name={`greenChile-${item.id}`}
                                      value={level}
                                      checked={greenChileOptions[item.id] === level}
                                      onChange={(e) => setGreenChileOptions(prev => ({ ...prev, [item.id]: e.target.value }))}
                                      className="text-red-600 focus:ring-red-500"
                                    />
                                    <span className="text-sm text-gray-700 capitalize">{level}</span>
                                  </label>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Add Steak Option */}
                          {item.addSteakOption && (
                            <div>
                              <label className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  checked={addSteakOptions[item.id] || false}
                                  onChange={(e) => setAddSteakOptions(prev => ({ ...prev, [item.id]: e.target.checked }))}
                                  className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                                />
                                <span className="text-sm font-medium text-gray-700">Add Steak (+$2.00)</span>
                              </label>
                            </div>
                          )}

                          {/* Sauce Type Options for Breakfast Meals */}
                          {item.sauceTypeOptions && (
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Sauce Type</label>
                              <div className="flex space-x-3">
                                {['red', 'green'].map((sauce) => (
                                  <label key={sauce} className="flex items-center space-x-1">
                                    <input
                                      type="radio"
                                      name={`sauceType-${item.id}`}
                                      value={sauce}
                                      checked={sauceTypeOptions[item.id] === sauce}
                                      onChange={(e) => setSauceTypeOptions(prev => ({ ...prev, [item.id]: e.target.value }))}
                                      className="text-red-600 focus:ring-red-500"
                                    />
                                    <span className="text-sm text-gray-700 capitalize">{sauce} Sauce</span>
                                  </label>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Add Chorizo Option */}
                          {item.addChorizoOption && (
                            <div>
                              <label className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  checked={addChorizoOptions[item.id] || false}
                                  onChange={(e) => setAddChorizoOptions(prev => ({ ...prev, [item.id]: e.target.checked }))}
                                  className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                                />
                                <span className="text-sm font-medium text-gray-700">Add Chorizo (+$1.99)</span>
                              </label>
                            </div>
                          )}

                          {/* Meat Choice Option */}
                          {item.meatChoiceOption && (
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Add Meat (+$2.00)</label>
                              <div className="grid grid-cols-2 gap-2">
                                {['bacon', 'chorizo', 'ham', 'sausage', 'steak'].map((meat) => (
                                  <label key={meat} className="flex items-center space-x-1">
                                    <input
                                      type="radio"
                                      name={`meatChoice-${item.id}`}
                                      value={meat}
                                      checked={meatChoiceOptions[item.id] === meat}
                                      onChange={(e) => setMeatChoiceOptions(prev => ({ ...prev, [item.id]: e.target.value }))}
                                      className="text-red-600 focus:ring-red-500"
                                    />
                                    <span className="text-sm text-gray-700 capitalize">{meat}</span>
                                  </label>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Special Requests */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Special Requests</label>
                            <textarea
                              value={specialRequests[item.id] || ''}
                              onChange={(e) => setSpecialRequests(prev => ({ ...prev, [item.id]: e.target.value }))}
                              placeholder="Any special requests or modifications..."
                              className="block w-full rounded-md border-gray-300 py-2 px-3 text-base focus:border-red-500 focus:outline-none focus:ring-red-500"
                              rows={2}
                            />
                          </div>
                        </div>
                        
                        {/* Quantity and Add to Cart */}
                        <div className="flex items-center justify-between pt-4 mt-auto">
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={() => handleQuantityChange(item.id, -1)}
                              className="w-10 h-10 rounded-full border-2 border-red-300 text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 flex items-center justify-center font-bold text-lg"
                              disabled={!orderingAllowed.allowed || (quantities[item.id] || 1) <= 1}
                            >
                              −
                            </button>
                            <span className="text-xl font-semibold text-gray-900 min-w-[3rem] text-center">
                              {quantities[item.id] || 1}
                            </span>
                            <button
                              onClick={() => handleQuantityChange(item.id, 1)}
                              className="w-10 h-10 rounded-full border-2 border-red-300 text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 flex items-center justify-center font-bold text-lg"
                              disabled={!orderingAllowed.allowed}
                            >
                              +
                            </button>
                          </div>
                          
                          <button
                            onClick={() => handleAddToCart(item)}
                            className={`px-6 py-3 rounded-lg font-semibold text-white transition-all duration-200 ${
                              orderingAllowed.allowed
                                ? 'bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'
                                : 'bg-gray-400 cursor-not-allowed'
                            }`}
                            disabled={!orderingAllowed.allowed}
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