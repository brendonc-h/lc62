'use client';

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface DineInSpecialsPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DineInSpecialsPopup({ isOpen, onClose }: DineInSpecialsPopupProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-[#FFF8F2] rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-red-600 to-orange-600 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-2">🎉 Dine-In Specials!</h2>
              <p className="text-white/90">Exclusive offers for dining in at La Casita</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
              aria-label="Close popup"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {/* ½‑Price Combo Plate */}
            <article className="relative text-center bg-white border-2 border-dashed border-[#C62828] rounded-xl p-5 hover:shadow-lg transition-shadow">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-[#C62828] text-white px-3 py-1 rounded-full text-sm font-bold">
                POPULAR
              </div>
              <h3 className="text-xl font-bold text-[#C62828] mb-2 mt-2">½‑Price Combo Plate</h3>
              <p className="text-base mb-3">
                Buy one combination plate, get a second of equal or lesser value <span className="font-semibold">50% off</span>
              </p>
              <p className="text-[0.7rem] leading-snug text-gray-700">
                Dine‑in only • No separate checks <br />
                Not valid on breakfast items <br />
                Cannot be combined with other offers <br />
                Expires Aug 31 2025
              </p>
            </article>

            {/* $5 Off $25+ */}
            <article className="relative text-center bg-white border-2 border-dashed border-[#C62828] rounded-xl p-5 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-bold text-[#C62828] mb-2">$5 Off $25+</h3>
              <p className="text-base mb-3">
                Save five bucks when you spend $25 or more
              </p>
              <p className="text-[0.7rem] leading-snug text-gray-700">
                Dine‑in only • One coupon per table/order • No separate checks <br />
                Not valid on breakfast items <br />
                Cannot be combined with other offers <br />
                Expires Aug 31 2025
              </p>
            </article>

            {/* 15% Off $20+ */}
            <article className="relative text-center bg-white border-2 border-dashed border-[#C62828] rounded-xl p-5 lg:col-span-1 sm:col-span-2 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-bold text-[#C62828] mb-2">15% Off $20+</h3>
              <p className="text-base mb-3">Enjoy 15% off any order over $20</p>
              <p className="text-[0.7rem] leading-snug text-gray-700">
                Dine‑in only • No separate checks <br />
                Not valid on breakfast items <br />
                Cannot be combined with other offers <br />
                Expires Aug 31 2025
              </p>
            </article>
          </section>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 mb-4">
              🏪 <strong>Dine-in only specials</strong> - Visit us at our Berthoud or Fort Collins locations!
            </p>
            <button
              onClick={onClose}
              className="bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold py-3 px-8 rounded-full hover:from-red-700 hover:to-orange-700 transition-all duration-300 transform hover:scale-105"
            >
              Got It! 👍
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Hook to manage popup state with localStorage
export function useDineInSpecialsPopup() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if user has seen the popup today
    const lastShown = localStorage.getItem('dineInSpecialsLastShown');
    const today = new Date().toDateString();
    
    if (lastShown !== today) {
      // Show popup after 3 seconds
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const closePopup = () => {
    setIsOpen(false);
    // Remember that user saw it today
    localStorage.setItem('dineInSpecialsLastShown', new Date().toDateString());
  };

  return { isOpen, closePopup };
}
