import { comboOptions, meatOptions } from '@/data/menu';
import { v4 as uuidv4 } from 'uuid';
import { CartItem } from './types';

export interface ComboSelection {
  item: string;  // id of the combo item (taco, enchilada, etc)
  meat: string;  // id of the meat option (beef, chicken, etc)
}

// Simple utility functions for combo management
export const comboUtils = {
  // Validate a combo selection
  validateSelection(selections: ComboSelection[]): { valid: boolean, error?: string } {
    // Check if we have the right number (3) of selections
    if (selections.length !== 3) {
      return { valid: false, error: "Combo must have exactly 3 items." };
    }
    
    // Create a Set to track selected items
    const selectedItems = new Set<string>();
    
    // Check each selection
    for (const selection of selections) {
      // Check for duplicates
      if (selectedItems.has(selection.item)) {
        return { valid: false, error: "No repeat items allowed in combo." };
      }
      
      // Check if item is valid
      if (!comboOptions.some(option => option.id === selection.item)) {
        return { valid: false, error: `Invalid item: ${selection.item}` };
      }
      
      // Check if meat is valid
      if (!meatOptions.some(option => option.id === selection.meat)) {
        return { valid: false, error: `Invalid meat option: ${selection.meat}` };
      }
      
      // Add to selected set
      selectedItems.add(selection.item);
    }
    
    return { valid: true };
  },
  
  // Format combo selections for special request text
  formatComboSpecialRequest(comboType: string, selections: ComboSelection[]): string {
    // Get name displays for items and meats
    const getItemName = (id: string) => {
      const item = comboOptions.find(option => option.id === id);
      return item ? item.name : id;
    };
    
    const getMeatName = (id: string) => {
      const meat = meatOptions.find(option => option.id === id);
      return meat ? meat.name : id;
    };
    
    let specialRequest = `${comboType.toUpperCase()} COMBO:\n`;
    
    selections.forEach((selection, index) => {
      specialRequest += `${index + 1}. ${getItemName(selection.item)} (${getMeatName(selection.meat)})\n`;
    });
    
    specialRequest += "Served with rice and beans.";
    
    return specialRequest;
  },
  
  // Create a cart item from combo selections
  createComboCartItem(comboType: string, comboId: string, comboName: string, price: number, image: string, selections: ComboSelection[]): CartItem {
    return {
      id: `${comboId}-${uuidv4().slice(0, 8)}`,
      name: comboName,
      price: price,
      quantity: 1,
      image: image || '',
      specialRequest: this.formatComboSpecialRequest(comboType, selections),
      location: 'la-casita' // Default location
    };
  }
};
