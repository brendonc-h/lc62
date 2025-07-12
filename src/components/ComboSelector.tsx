import React, { useState, useEffect } from 'react';
import { ComboSelection, ComboItem, createMediumCombo, createLargeCombo } from '@/lib/combo-selection';
import { comboOptions, meatOptions } from '@/data/menu';

interface ComboSelectorProps {
  comboType: 'medium' | 'large';
  onComboComplete: (combo: ComboItem[]) => void;
}

export default function ComboSelector({ comboType, onComboComplete }: ComboSelectorProps) {
  // Initialize the appropriate combo selection based on type
  const [comboSelection] = useState<ComboSelection>(
    comboType === 'medium' ? createMediumCombo() : createLargeCombo()
  );
  
  const [selectedItems, setSelectedItems] = useState<ComboItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [currentItem, setCurrentItem] = useState<string>('');
  const [currentMeat, setCurrentMeat] = useState<string>('');
  
  const maxItems = 3; // Both medium and large combos have 3 items
  
  // Update selected items and notify parent component when combo changes
  useEffect(() => {
    if (selectedItems.length > 0) {
      onComboComplete(selectedItems);
    }
  }, [selectedItems, onComboComplete]);
  
  // Add an item to the combo
  const handleAddItem = () => {
    if (!currentItem || !currentMeat) {
      setError('Please select both an item and a meat option');
      return;
    }
    
    const result = comboSelection.addItem(currentItem, currentMeat);
    
    if (result.success) {
      setSelectedItems([...result.combo]);
      setError(null);
      // Reset selections if combo is full
      if (result.combo.length >= maxItems) {
        setCurrentItem('');
        setCurrentMeat('');
      }
    } else {
      setError(result.error || 'Failed to add item');
    }
  };
  
  // Remove an item from the combo
  const handleRemoveItem = (itemId: string) => {
    const result = comboSelection.removeItem(itemId);
    if (result.success) {
      setSelectedItems([...result.combo]);
      setError(null);
    }
  };
  
  // Reset the combo
  const handleResetCombo = () => {
    comboSelection.reset();
    setSelectedItems([]);
    setCurrentItem('');
    setCurrentMeat('');
    setError(null);
  };
  
  // Get display name for an item or meat by ID
  const getItemName = (id: string) => {
    const item = comboOptions.find(option => option.id === id);
    return item ? item.name : id;
  };
  
  const getMeatName = (id: string) => {
    const meat = meatOptions.find(option => option.id === id);
    return meat ? meat.name : id;
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="text-lg font-bold mb-4">
        {comboType === 'medium' ? 'Medium Combo (Choose 3 Items)' : 'Large Combo (Choose 3 Items)'}
      </h3>
      
      {/* Selected Items Display */}
      {selectedItems.length > 0 && (
        <div className="mb-4">
          <h4 className="font-medium mb-2">Your Selections:</h4>
          <ul className="list-disc pl-5 space-y-2">
            {selectedItems.map((item, index) => (
              <li key={index} className="flex justify-between items-center">
                <span>
                  {getItemName(item.item)} ({getMeatName(item.meat)})
                </span>
                <button 
                  onClick={() => handleRemoveItem(item.item)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Item Selection Form */}
      {selectedItems.length < maxItems && (
        <div className="space-y-4">
          <div>
            <label htmlFor="combo-item" className="block text-sm font-medium text-gray-700 mb-1">
              Select Item {selectedItems.length + 1}:
            </label>
            <select
              id="combo-item"
              value={currentItem}
              onChange={(e) => setCurrentItem(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
              <option value="">Select an item...</option>
              {comboOptions.map((option) => (
                <option 
                  key={option.id} 
                  value={option.id}
                  disabled={selectedItems.some(item => item.item === option.id)}
                >
                  {option.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="meat-option" className="block text-sm font-medium text-gray-700 mb-1">
              Select Meat:
            </label>
            <select
              id="meat-option"
              value={currentMeat}
              onChange={(e) => setCurrentMeat(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
              <option value="">Select meat...</option>
              {meatOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex justify-between">
            <button
              onClick={handleAddItem}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
            >
              Add to Combo
            </button>
            
            {selectedItems.length > 0 && (
              <button
                onClick={handleResetCombo}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      )}
      
      {/* Error Display */}
      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
      
      {/* Status/Complete Message */}
      {selectedItems.length >= maxItems && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
          <p className="text-sm text-green-600">Your combo is complete! ✓</p>
        </div>
      )}
      
      <div className="mt-4 text-sm text-gray-500">
        <p>Your combo includes rice and beans.</p>
        <p>No repeat items allowed.</p>
      </div>
    </div>
  );
}
