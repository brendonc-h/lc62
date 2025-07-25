// restaurant-hours.ts - Contains opening and closing times for La Casita locations

export interface RestaurantHours {
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, etc.
  openTime: string; // 24-hour format "HH:MM"
  closeTime: string; // 24-hour format "HH:MM"
}

export interface LocationHours {
  locationId: string;
  name: string;
  hours: RestaurantHours[];
}

// Define hours for each location
export const locationHours: LocationHours[] = [
  {
    locationId: 'berthoud',
    name: 'Berthoud',
    hours: [
      { dayOfWeek: 0, openTime: 'CLOSED', closeTime: 'CLOSED' }, // Sunday - Closed
      { dayOfWeek: 1, openTime: '07:30', closeTime: '20:00' }, // Monday
      { dayOfWeek: 2, openTime: '07:30', closeTime: '20:00' }, // Tuesday
      { dayOfWeek: 3, openTime: '07:30', closeTime: '20:00' }, // Wednesday
      { dayOfWeek: 4, openTime: '07:30', closeTime: '20:00' }, // Thursday
      { dayOfWeek: 5, openTime: '07:30', closeTime: '20:00' }, // Friday
      { dayOfWeek: 6, openTime: '07:30', closeTime: '14:00' }, // Saturday - 2 PM
    ]
  },
  {
    locationId: 'fortcollins',
    name: 'Fort Collins',
    hours: [
      { dayOfWeek: 0, openTime: 'CLOSED', closeTime: 'CLOSED' }, // Sunday - Closed
      { dayOfWeek: 1, openTime: '07:00', closeTime: '20:00' }, // Monday
      { dayOfWeek: 2, openTime: '07:00', closeTime: '20:00' }, // Tuesday
      { dayOfWeek: 3, openTime: '07:00', closeTime: '20:00' }, // Wednesday
      { dayOfWeek: 4, openTime: '07:00', closeTime: '20:00' }, // Thursday
      { dayOfWeek: 5, openTime: '07:00', closeTime: '20:00' }, // Friday
      { dayOfWeek: 6, openTime: '07:00', closeTime: '14:00' }, // Saturday - 2 PM
    ]
  },
];

// Functions to check if orders are allowed
// Orders stop at 6:30 PM (18:30) daily
export const isOrderingAllowed = (locationId: string = 'berthoud'): { allowed: boolean, message: string } => {
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
    // Calculate minutes until cutoff
    const minutesUntilCutoff = cutoffTimeMinutes - currentTimeMinutes;

    if (minutesUntilCutoff <= 60) {
      // Less than 1 hour until cutoff
      const hours = Math.floor(minutesUntilCutoff / 60);
      const minutes = minutesUntilCutoff % 60;

      if (hours > 0) {
        return {
          allowed: true,
          message: `⏰ Orders close in ${hours} hour${hours > 1 ? 's' : ''} and ${minutes} minutes (6:30 PM)`
        };
      } else {
        return {
          allowed: true,
          message: `⏰ Orders close in ${minutes} minutes (6:30 PM)`
        };
      }
    }

    return {
      allowed: true,
      message: '🍽️ We\'re open and accepting orders until 6:30 PM today'
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
    allowed: false,
    message: `🕕 Orders are closed. We stop taking orders at 6:30 PM daily. Next opening: ${nextOpenTime}`
  };
};

// ORIGINAL FUNCTION (commented out for testing)
/*
export const isOrderingAllowedOriginal = (locationId: string = 'berthoud'): { allowed: boolean, message: string } => {
  const now = new Date();
  const currentDay = now.getDay();
  
  // Find location
  const location = locationHours.find(loc => loc.locationId === locationId);
  if (!location) {
    return { 
      allowed: false, 
      message: "Location not found. Please select a valid location."
    };
  }
  
  // Find today's hours
  const todayHours = location.hours.find(hours => hours.dayOfWeek === currentDay);
  if (!todayHours) {
    return { 
      allowed: false, 
      message: `We don't have hours defined for today at ${location.name}. Please call us for assistance.`
    };
  }
  
  // Parse hours
  const [openHour, openMinute] = todayHours.openTime.split(':').map(Number);
  const [closeHour, closeMinute] = todayHours.closeTime.split(':').map(Number);
  
  // Create Date objects for opening and closing times
  const openTime = new Date(now);
  openTime.setHours(openHour, openMinute, 0, 0);
  
  const closeTime = new Date(now);
  closeTime.setHours(closeHour, closeMinute, 0, 0);
  
  // Check if 30 minutes before closing
  const thirtyMinutesBeforeClose = new Date(closeTime);
  thirtyMinutesBeforeClose.setMinutes(closeTime.getMinutes() - 30);
  
  // Check if we're between opening and 30 minutes before closing
  if (now < openTime) {
    return { 
      allowed: false, 
      message: `We're not open yet. ${location.name} opens at ${todayHours.openTime} today. Please check back then!`
    };
  } else if (now >= thirtyMinutesBeforeClose) {
    return { 
      allowed: false, 
      message: `Sorry, we don't accept online orders within 30 minutes of closing time. ${location.name} closes at ${todayHours.closeTime} today.`
    };
  } else {
    return { 
      allowed: true, 
      message: `We're open and accepting orders until ${thirtyMinutesBeforeClose.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.`
    };
  }
};
*/

// Get readable hours string for a location
export const getReadableHours = (locationId: string = 'berthoud'): string[] => {
  const location = locationHours.find(loc => loc.locationId === locationId);
  if (!location) return ["Hours not available"];
  
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const formattedHours: string[] = [];
  
  location.hours.forEach(hourSet => {
    const day = days[hourSet.dayOfWeek];
    const openTime = formatTimeString(hourSet.openTime);
    const closeTime = formatTimeString(hourSet.closeTime);
    formattedHours.push(`${day}: ${openTime} - ${closeTime}`);
  });
  
  return formattedHours;
};

// Helper to format time from 24hr to 12hr format
const formatTimeString = (time24: string): string => {
  const [hour, minute] = time24.split(':').map(Number);
  const period = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12; // Convert 0 to 12 for 12 AM
  return `${hour12}:${minute.toString().padStart(2, '0')} ${period}`;
};
