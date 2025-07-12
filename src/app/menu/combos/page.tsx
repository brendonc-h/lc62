'use client';

import React from 'react';
import { menuItems } from '@/data/menu';
import ComboProduct from '@/components/ComboProduct';
import { Toaster } from 'react-hot-toast';

export default function CombosPage() {
  // Get the medium and large combo menu items
  const mediumCombo = menuItems.find(item => item.id === 'medium-combo');
  const largeCombo = menuItems.find(item => item.id === 'large-combo');

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">La Casita Combo Meals</h1>
      <Toaster position="top-right" />

      {/* Medium Combo */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold border-b-2 border-orange-500 pb-2 mb-6">Medium Combos</h2>
        <p className="mb-6 text-gray-600">
          Our medium combo includes 3 items of your choice (no repeats allowed), served with rice and beans.
          Choose from tacos, enchiladas, tamales, tostadas, chile rellenos, and burritos with your choice of meat.
        </p>
        
        {mediumCombo ? (
          <ComboProduct product={mediumCombo} comboType="medium" />
        ) : (
          <p>Medium combo not found</p>
        )}
      </div>

      {/* Large Combo */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold border-b-2 border-orange-500 pb-2 mb-6">Large Combos</h2>
        <p className="mb-6 text-gray-600">
          Our large combo includes 3 items of your choice (no repeats allowed), served with rice and beans.
          Choose from tacos, enchiladas, tamales, tostadas, chile rellenos, and burritos with your choice of meat.
        </p>
        
        {largeCombo ? (
          <ComboProduct product={largeCombo} comboType="large" />
        ) : (
          <p>Large combo not found</p>
        )}
      </div>

      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">Note</h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>
                Both medium and large combos now feature 3 items each. The difference is in pricing.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
