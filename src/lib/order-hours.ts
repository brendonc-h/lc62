/**
 * Order Hours Utility
 * Handles order cutoff times and business hours
 */

export interface OrderHours {
  isOpen: boolean;
  message: string;
  nextOpenTime?: string;
}

/**
 * Check if orders are currently being accepted
 * Orders stop at 6:30 PM (18:30) every day
 */
export function checkOrderHours(): OrderHours {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  
  // Convert current time to minutes since midnight for easier comparison
  const currentTimeMinutes = currentHour * 60 + currentMinute;
  
  // Order cutoff is 6:30 PM (18:30) = 18 * 60 + 30 = 1110 minutes
  const cutoffTimeMinutes = 18 * 60 + 30; // 6:30 PM
  
  // Assuming restaurant opens at 7:00 AM (7 * 60 = 420 minutes)
  const openTimeMinutes = 7 * 60; // 7:00 AM
  
  // Check if current time is within ordering hours (7:00 AM - 6:30 PM)
  const isWithinHours = currentTimeMinutes >= openTimeMinutes && currentTimeMinutes < cutoffTimeMinutes;
  
  if (isWithinHours) {
    return {
      isOpen: true,
      message: 'Orders are being accepted!'
    };
  }
  
  // Calculate next opening time
  let nextOpenDate = new Date(now);
  
  if (currentTimeMinutes >= cutoffTimeMinutes) {
    // After 6:30 PM today, next opening is 7:00 AM tomorrow
    nextOpenDate.setDate(nextOpenDate.getDate() + 1);
  }
  
  // Set to 7:00 AM
  nextOpenDate.setHours(7, 0, 0, 0);
  
  const nextOpenTime = nextOpenDate.toLocaleString('en-US', {
    weekday: 'long',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
  
  return {
    isOpen: false,
    message: `Orders are currently closed. We stop taking orders at 6:30 PM daily.`,
    nextOpenTime: `Next opening: ${nextOpenTime}`
  };
}

/**
 * Get a user-friendly message about current order status
 */
export function getOrderStatusMessage(): string {
  const orderHours = checkOrderHours();
  
  if (orderHours.isOpen) {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTimeMinutes = currentHour * 60 + currentMinute;
    const cutoffTimeMinutes = 18 * 60 + 30; // 6:30 PM
    
    // Calculate minutes until cutoff
    const minutesUntilCutoff = cutoffTimeMinutes - currentTimeMinutes;
    
    if (minutesUntilCutoff <= 60) {
      // Less than 1 hour until cutoff
      const hours = Math.floor(minutesUntilCutoff / 60);
      const minutes = minutesUntilCutoff % 60;
      
      if (hours > 0) {
        return `⏰ Orders close in ${hours} hour${hours > 1 ? 's' : ''} and ${minutes} minutes (6:30 PM)`;
      } else {
        return `⏰ Orders close in ${minutes} minutes (6:30 PM)`;
      }
    }
    
    return '🍽️ Orders are open until 6:30 PM today';
  }
  
  return `🕕 ${orderHours.message} ${orderHours.nextOpenTime || ''}`;
}

/**
 * Check if it's close to closing time (within 1 hour)
 */
export function isCloseToClosing(): boolean {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentTimeMinutes = currentHour * 60 + currentMinute;
  const cutoffTimeMinutes = 18 * 60 + 30; // 6:30 PM
  
  // Check if within 1 hour of closing
  const minutesUntilCutoff = cutoffTimeMinutes - currentTimeMinutes;
  return minutesUntilCutoff > 0 && minutesUntilCutoff <= 60;
}
