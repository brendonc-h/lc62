'use client';

import { useState, useEffect } from 'react';
import { isOrderingAllowed } from '@/data/restaurant-hours';
import { ClockIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

interface OrderingStatusProps {
  locationId?: string;
  className?: string;
}

export default function OrderingStatus({ locationId = 'berthoud', className = '' }: OrderingStatusProps) {
  const [status, setStatus] = useState({ allowed: true, message: 'Checking ordering status...' });
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update status and time every minute
  useEffect(() => {
    // Initial check
    setStatus(isOrderingAllowed(locationId));
    
    // Set up interval to update every minute
    const interval = setInterval(() => {
      setCurrentTime(new Date());
      setStatus(isOrderingAllowed(locationId));
    }, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, [locationId]);

  return (
    <div className={`rounded-md p-3 ${status.allowed ? 'bg-green-50' : 'bg-amber-50'} ${className}`}>
      <div className="flex items-center">
        {status.allowed ? (
          <CheckCircleIcon className="h-5 w-5 text-green-400 mr-2" aria-hidden="true" />
        ) : (
          <XCircleIcon className="h-5 w-5 text-amber-400 mr-2" aria-hidden="true" />
        )}
        
        <span className={`text-sm font-medium ${status.allowed ? 'text-green-800' : 'text-amber-800'}`}>
          {status.message}
        </span>
        
        <div className="ml-auto flex items-center text-xs text-gray-500">
          <ClockIcon className="h-4 w-4 mr-1" />
          <span>
            {currentTime.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>
      </div>
    </div>
  );
}
