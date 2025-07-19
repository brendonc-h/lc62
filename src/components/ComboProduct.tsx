'use client';

import React, { useState } from 'react';
import { MenuItem } from '@/data/menu';
import { useCart } from '@/lib/cart-context';
import { ComboItem } from '@/lib/combo-selection';
import ComboSelector from './ComboSelector';
import Image from 'next/image';
import { toast } from 'react-hot-toast';

interface ComboProductProps {
  product: MenuItem;
  comboType: 'medium' | 'large';
}

export default function ComboProduct({ product, comboType }: ComboProductProps) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedCombo, setSelectedCombo] = useState<ComboItem[]>([]);
  const [isComplete, setIsComplete] = useState(false);

  // Format combo selections for display in cart
  const formatComboSelections = (combo: ComboItem[]): string => {
    if (!combo.length) return '';

    const comboOptions = [
      { id: 'taco', name: 'Taco' },
      { id: 'enchilada', name: 'Enchilada' },
      { id: 'tamal', name: 'Tamal' },
      { id: 'tostada', name: 'Tostada' },
      { id: 'chile_relleno', name: 'Chile Relleno' },
      { id: 'burrito', name: 'Burrito' }
    ];
    
    const meatOptions = [
      { id: 'beef', name: 'Beef' },
      { id: 'chicken', name: 'Chicken' },
      { id: 'bean', name: 'Bean' },
      { id: 'cheese', name: 'Cheese' }
    ];
    
    return combo.map((item, index) => {
      const itemName = comboOptions.find(option => option.id === item.item)?.name || item.item;
      const meatName = meatOptions.find(option => option.id === item.meat)?.name || item.meat;
      return `${index + 1}. ${itemName} (${meatName})`;
    }).join('\n');
  };

  // Handle combo selection complete
  const handleComboComplete = (combo: ComboItem[]) => {
    setSelectedCombo(combo);
    setIsComplete(combo.length === 3); // A combo is complete when it has 3 items
  };

  // Add the combo to cart
  const addToCart = () => {
    if (!isComplete) {
      toast.error('Please complete your combo selection first');
      return;
    }

    // Format special request with combo selections
    const specialRequest = `${comboType.toUpperCase()} COMBO:\n${formatComboSelections(selectedCombo)}\nServed with rice and beans.`;

    // Use first selected item's variant if available, otherwise use base price
    const variant = product.variants && product.variants.length > 0 
      ? product.variants[0].name 
      : undefined;
    
    const price = product.variants && product.variants.length > 0 
      ? product.variants[0].price 
      : product.price;

    // Add combo to cart
    addItem({
      id: `${product.id}-${Date.now()}`, // Unique ID for cart item
      name: product.name,
      price: price,
      quantity: quantity,
      image: product.image || '/placeholder.jpg',
      variant: variant,
      specialRequest: specialRequest,
      location: product.locations?.[0] || 'main'
    });

    toast.success('Combo added to cart!');
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Product Image and Details */}
        <div>
          {product.image && (
            <div className="relative h-64 w-full mb-4">
              <Image 
                src={product.image}
                alt={product.name}
                fill
                className="object-cover rounded-lg"
              />
            </div>
          )}
          <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
          <p className="text-gray-700 mb-2">{product.description}</p>
          <p className="text-xl font-bold text-green-700 mb-4">
            ${(typeof product.variants?.[0]?.price === 'number' ? product.variants[0].price.toFixed(2) : '') || 
              (typeof product.price === 'number' ? product.price.toFixed(2) : '0.00')}
          </p>
          
          {/* Quantity Selector */}
          <div className="flex items-center mb-4">
            <span className="mr-3">Quantity:</span>
            <div className="flex items-center border rounded-md">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-1 border-r"
                aria-label="Decrease quantity"
              >
                -
              </button>
              <span className="px-3 py-1">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-1 border-l"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          </div>
          
          {/* Add to Cart Button */}
          <button 
            onClick={addToCart}
            disabled={!isComplete}
            className={`w-full py-2 px-4 ${
              isComplete 
                ? 'bg-green-600 hover:bg-green-700' 
                : 'bg-gray-400 cursor-not-allowed'
            } text-white rounded-md transition`}
          >
            {isComplete ? 'Add to Cart' : 'Complete Your Combo First'}
          </button>
        </div>
        
        {/* Combo Selector */}
        <div>
          <ComboSelector 
            comboType={comboType} 
            onComboComplete={handleComboComplete} 
          />
        </div>
      </div>
      
      {/* Preview of selection */}
      {selectedCombo.length > 0 && (
        <div className="mt-6 p-4 bg-gray-50 rounded-md">
          <h3 className="font-medium text-lg mb-2">Your {comboType} combo preview:</h3>
          <pre className="whitespace-pre-line text-gray-700">
            {formatComboSelections(selectedCombo)}
            {'\nServed with rice and beans.'}
          </pre>
        </div>
      )}
    </div>
  );
}
