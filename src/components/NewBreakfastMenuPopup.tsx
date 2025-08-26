'use client';

import React, { useState, useEffect } from 'react';
import { X, Sparkles, Star, ChefHat } from 'lucide-react';
import Link from 'next/link';

interface NewBreakfastMenuPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NewBreakfastMenuPopup({ isOpen, onClose }: NewBreakfastMenuPopupProps) {
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
        className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal with sparkly animations */}
      <div className="relative bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 rounded-3xl max-w-2xl w-full shadow-2xl border-4 border-gradient-to-r from-yellow-400 via-orange-400 to-red-400 overflow-hidden">
        
        {/* Sparkle animations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="sparkle sparkle-1">✨</div>
          <div className="sparkle sparkle-2">⭐</div>
          <div className="sparkle sparkle-3">✨</div>
          <div className="sparkle sparkle-4">🌟</div>
          <div className="sparkle sparkle-5">✨</div>
          <div className="sparkle sparkle-6">⭐</div>
        </div>

        {/* Header with gradient and glow */}
        <div className="relative bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white p-8 text-center">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors z-10"
            aria-label="Close popup"
          >
            <X className="h-6 w-6" />
          </button>
          
          <div className="flex items-center justify-center mb-4">
            <ChefHat className="h-12 w-12 mr-3 animate-bounce" />
            <div className="text-4xl font-black tracking-tight">
              <span className="bg-gradient-to-r from-white to-yellow-100 bg-clip-text text-transparent">
                NEW!
              </span>
            </div>
            <Sparkles className="h-12 w-12 ml-3 animate-pulse" />
          </div>
          
          <h2 className="text-3xl sm:text-4xl font-black mb-3 drop-shadow-lg">
            🍳 BREAKFAST MENU 🥞
          </h2>
          
          <p className="text-xl font-semibold text-yellow-100 drop-shadow">
            Delicious Morning Favorites Now Available!
          </p>
        </div>

        {/* Content */}
        <div className="p-8 text-center">
          <div className="mb-6">
            <div className="flex justify-center items-center space-x-4 mb-4">
              <div className="flex items-center bg-white rounded-full px-4 py-2 shadow-lg border-2 border-yellow-300">
                <Star className="h-5 w-5 text-yellow-500 mr-2" />
                <span className="font-bold text-gray-800">Skillets</span>
              </div>
              <div className="flex items-center bg-white rounded-full px-4 py-2 shadow-lg border-2 border-orange-300">
                <Star className="h-5 w-5 text-orange-500 mr-2" />
                <span className="font-bold text-gray-800">Omelets</span>
              </div>
              <div className="flex items-center bg-white rounded-full px-4 py-2 shadow-lg border-2 border-red-300">
                <Star className="h-5 w-5 text-red-500 mr-2" />
                <span className="font-bold text-gray-800">Waffles</span>
              </div>
            </div>
            
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              Start your day with our <span className="font-bold text-orange-600">authentic Mexican breakfast</span> featuring 
              fresh skillets, fluffy omelets, crispy waffles, and so much more!
            </p>
            
            <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl p-6 border-2 border-dashed border-orange-300 mb-6">
              <div className="text-2xl font-bold text-orange-800 mb-2">🌟 Berthoud Location Only! 🌟</div>
              <div className="text-lg text-orange-700">Try any breakfast item today!</div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/order"
              onClick={onClose}
              className="group relative bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl border-4 border-white"
            >
              <span className="relative z-10 flex items-center justify-center">
                <ChefHat className="h-6 w-6 mr-2" />
                Order Breakfast Now!
                <Sparkles className="h-5 w-5 ml-2 animate-pulse" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
            
            <button
              onClick={onClose}
              className="bg-white text-gray-700 font-semibold py-4 px-8 rounded-full text-lg border-2 border-gray-300 hover:bg-gray-50 transition-all duration-300"
            >
              Maybe Later
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .sparkle {
          position: absolute;
          font-size: 1.5rem;
          animation: sparkle 3s infinite;
        }
        
        .sparkle-1 {
          top: 10%;
          left: 15%;
          animation-delay: 0s;
        }
        
        .sparkle-2 {
          top: 20%;
          right: 20%;
          animation-delay: 0.5s;
        }
        
        .sparkle-3 {
          top: 60%;
          left: 10%;
          animation-delay: 1s;
        }
        
        .sparkle-4 {
          top: 70%;
          right: 15%;
          animation-delay: 1.5s;
        }
        
        .sparkle-5 {
          top: 40%;
          left: 80%;
          animation-delay: 2s;
        }
        
        .sparkle-6 {
          top: 80%;
          left: 70%;
          animation-delay: 2.5s;
        }
        
        @keyframes sparkle {
          0%, 100% {
            opacity: 0;
            transform: scale(0.5) rotate(0deg);
          }
          50% {
            opacity: 1;
            transform: scale(1.2) rotate(180deg);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
      `}</style>
    </div>
  );
}

// Hook to manage popup state - shows every time
export function useNewBreakfastMenuPopup() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Show popup after 2 seconds every time the page loads
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  const closePopup = () => {
    setIsOpen(false);
  };

  return { isOpen, closePopup };
}
