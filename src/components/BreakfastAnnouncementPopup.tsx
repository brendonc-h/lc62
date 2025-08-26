'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { XMarkIcon } from '@heroicons/react/24/outline';

export default function BreakfastAnnouncementPopup() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has dismissed the popup before
    const hasDismissed = localStorage?.getItem('breakfastPopupDismissed');
    if (hasDismissed !== 'true') {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    // Remember user's preference for 7 days
    localStorage?.setItem('breakfastPopupDismissed', 'true');
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 w-full max-w-md p-4 bg-white rounded-lg shadow-lg border border-yellow-200 transform transition-all duration-300 animate-fade-in-up">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900">🍳 Breakfast Special!</h3>
          <p className="mt-1 text-sm text-gray-600">
            Try our delicious breakfast menu, available daily from 7:00 AM to 11:00 AM.
          </p>
          <div className="mt-2">
            <p className="text-sm font-medium text-gray-900">Today's Special:</p>
            <p className="text-sm text-gray-600">Huevos Rancheros - $9.99</p>
          </div>
          <div className="mt-4 flex space-x-3">
            <Link
              href="/breakfast"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
            >
              View Breakfast Menu
            </Link>
            <button
              type="button"
              onClick={handleDismiss}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
            >
              Maybe Later
            </button>
          </div>
        </div>
        <button
          type="button"
          onClick={handleDismiss}
          className="ml-4 flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
        >
          <span className="sr-only">Close</span>
          <XMarkIcon className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}