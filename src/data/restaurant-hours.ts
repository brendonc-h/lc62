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
      { dayOfWeek: 0, openTime: '11:00', closeTime: '20:00' }, // Sunday
      { dayOfWeek: 1, openTime: '11:00', closeTime: '21:00' }, // Monday
      { dayOfWeek: 2, openTime: '11:00', closeTime: '21:00' }, // Tuesday
      { dayOfWeek: 3, openTime: '11:00', closeTime: '21:00' }, // Wednesday
      { dayOfWeek: 4, openTime: '11:00', closeTime: '21:00' }, // Thursday
      { dayOfWeek: 5, openTime: '11:00', closeTime: '22:00' }, // Friday
      { dayOfWeek: 6, openTime: '11:00', closeTime: '22:00' }, // Saturday
    ]
  },
  {
    locationId: 'fortcollins',
    name: 'Fort Collins',
    hours: [
      { dayOfWeek: 0, openTime: '11:00', closeTime: '20:00' }, // Sunday
      { dayOfWeek: 1, openTime: '11:00', closeTime: '21:00' }, // Monday
      { dayOfWeek: 2, openTime: '11:00', closeTime: '21:00' }, // Tuesday
      { dayOfWeek: 3, openTime: '11:00', closeTime: '21:00' }, // Wednesday
      { dayOfWeek: 4, openTime: '11:00', closeTime: '21:00' }, // Thursday
      { dayOfWeek: 5, openTime: '11:00', closeTime: '22:00' }, // Friday
      { dayOfWeek: 6, openTime: '11:00', closeTime: '22:00' }, // Saturday
    ]
  },
];

// Functions to check if orders are allowed
// TEMPORARILY DISABLED FOR TESTING - ALWAYS ALLOWS ORDERING
export const isOrderingAllowed = (locationId: string = 'berthoud'): { allowed: boolean, message: string } => {
  return { 
    allowed: true, 
    message: "We're open and accepting orders! (Testing mode - time restrictions disabled)"
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
