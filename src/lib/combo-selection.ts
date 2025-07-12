import { comboOptions, meatOptions } from '@/data/menu';

export interface ComboItem {
  item: string;  // id of the combo item
  meat: string;  // id of the meat option
}

export interface ComboSelectionResult {
  success: boolean;
  combo: ComboItem[];
  error?: string;
}

/**
 * Class for managing combo selections with validation
 */
export class ComboSelection {
  private selected: Set<string> = new Set();
  private combo: ComboItem[] = [];
  private maxItems: number;
  
  /**
   * Create a new combo selection
   * @param maxItems Maximum number of items allowed in the combo (2 for medium, 3 for large)
   */
  constructor(maxItems: number = 3) {
    this.maxItems = maxItems;
  }
  
  /**
   * Add an item to the combo
   * @param itemId ID of the combo item (taco, enchilada, etc)
   * @param meatId ID of the meat option (beef, chicken, etc)
   * @returns Result object with success status, current combo array, and error message if applicable
   */
  addItem(itemId: string, meatId: string): ComboSelectionResult {
    // Validate the combo isn't already full
    if (this.combo.length >= this.maxItems) {
      return {
        success: false,
        combo: [...this.combo],
        error: `Combo already full. Maximum of ${this.maxItems} items allowed.`
      };
    }
    
    // Check if item is already selected
    if (this.selected.has(itemId)) {
      return {
        success: false,
        combo: [...this.combo],
        error: "Item already chosen. No repeat items allowed."
      };
    }
    
    // Validate item and meat selections
    const validItem = comboOptions.some(option => option.id === itemId);
    const validMeat = meatOptions.some(option => option.id === meatId);
    
    if (!validItem || !validMeat) {
      return {
        success: false,
        combo: [...this.combo],
        error: "Invalid selection. Please choose from the available options."
      };
    }
    
    // Add the item to the combo
    this.selected.add(itemId);
    this.combo.push({item: itemId, meat: meatId});
    
    return {
      success: true,
      combo: [...this.combo]
    };
  }
  
  /**
   * Remove an item from the combo
   * @param itemId ID of the combo item to remove
   * @returns Result object with success status and current combo array
   */
  removeItem(itemId: string): ComboSelectionResult {
    if (!this.selected.has(itemId)) {
      return {
        success: false,
        combo: [...this.combo],
        error: "Item not found in combo."
      };
    }
    
    this.selected.delete(itemId);
    this.combo = this.combo.filter(item => item.item !== itemId);
    
    return {
      success: true,
      combo: [...this.combo]
    };
  }
  
  /**
   * Get the current combo selection
   * @returns Array of combo items
   */
  getCombo(): ComboItem[] {
    return [...this.combo];
  }
  
  /**
   * Check if the combo is full
   * @returns Boolean indicating if the combo has reached its maximum items
   */
  isFull(): boolean {
    return this.combo.length >= this.maxItems;
  }
  
  /**
   * Check if the combo is valid (has at least one item)
   * @returns Boolean indicating if the combo is valid
   */
  isValid(): boolean {
    return this.combo.length > 0;
  }
  
  /**
   * Reset the combo to empty
   */
  reset(): void {
    this.selected.clear();
    this.combo = [];
  }
}

/**
 * Create a medium combo selection (3 items)
 */
export const createMediumCombo = (): ComboSelection => {
  return new ComboSelection(3);
};

/**
 * Create a large combo selection (3 items) 
 */
export const createLargeCombo = (): ComboSelection => {
  return new ComboSelection(3);
};
