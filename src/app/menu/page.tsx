'use client';

import { useState } from 'react';
import { categories, menuItems, type MenuItem } from '@/data/menu';
import Link from 'next/link';
import { FireIcon, ChevronDownIcon, ShoppingCartIcon } from '@heroicons/react/24/solid';

type VariantType = 'protein' | 'size' | 'spiceLevel';

type SelectedVariants = {
  [itemId: string]: {
    [K in VariantType]?: string;
  };
};

export default function MenuPage() {
  const [selectedVariants, setSelectedVariants] = useState<SelectedVariants>({});
  const [expandedItems, setExpandedItems] = useState<{[key: string]: boolean}>(() => {
    const initialItems: {[key: string]: boolean} = {};
    menuItems.forEach(item => {
      initialItems[item.id] = false;
    });
    return initialItems;
  });
  const [expandedCategories, setExpandedCategories] = useState<{[key: string]: boolean}>(() => {
    const initialCategories: {[key: string]: boolean} = {};
    categories.forEach(category => {
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

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">Our Menu</h1>
          <p className="mt-4 text-lg text-gray-500">
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
              <div key={category.id} className="mb-8 border-b border-gray-200 pb-8">
                <button
                  onClick={() => toggleCategoryExpansion(category.id)}
                  className="w-full text-left focus:outline-none group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900 group-hover:text-red-600 transition-colors">
                        {category.name}
                      </h2>
                      <p className="mt-2 text-lg text-gray-600">{category.description}</p>
                    </div>
                    <ChevronDownIcon 
                      className={`h-6 w-6 text-gray-500 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
                      aria-hidden="true" 
                    />
                  </div>
                </button>
                <div className={`space-y-8 mt-6 ${isExpanded ? 'block' : 'hidden'}`}>
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white rounded-lg shadow-lg overflow-hidden"
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
