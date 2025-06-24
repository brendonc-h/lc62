// Common button styles for the application
export const buttonStyles = {
  // Primary button style (candy red)
  primary: 'inline-flex items-center justify-center px-4 py-2 rounded-md font-medium text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75 transition-all duration-200 shadow-sm hover:shadow-md',
  
  // Secondary button style (outline)
  secondary: 'inline-flex items-center justify-center px-4 py-2 rounded-md font-medium text-red-600 bg-white border border-red-500 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75 transition-all duration-200',
  
  // Small button variant
  small: 'text-sm px-3 py-1.5',
  
  // Large button variant
  large: 'text-lg px-6 py-3',
  
  // Full width button
  fullWidth: 'w-full',
  
  // Disabled state
  disabled: 'opacity-50 cursor-not-allowed',
};

// Helper function to combine button styles
export function cn(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
