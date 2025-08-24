"use client";

import React, { useState } from 'react';
import { categories, menuItems, MenuItem } from '@/data/menu';
import { useCart } from '@/lib/cart-context';
import { isOrderingAllowed } from '@/data/restaurant-hours';
import Link from 'next/link';

export default function BreakfastPage() {
  const breakfastCategoryIds = new Set(['breakfast-burritos', 'breakfast-meals']);
  const breakfastCategories = categories.filter(c => breakfastCategoryIds.has(c.id));
  const breakfastItems = menuItems.filter(i => breakfastCategoryIds.has(i.category));

  const { state, addItem, clearCart } = useCart();
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [customerInfo, setCustomerInfo] = useState({ name: '', email: '', phone: '', specialInstructions: '' });
  const [submitting, setSubmitting] = useState(false);
  const orderingAllowed = isOrderingAllowed();

  function addToCart(item: MenuItem) {
    if (!selectedLocation) return alert('Please select a location first');
    const cartItem = {
      id: `${item.id}-${Date.now()}`,
      name: item.name,
      price: item.price,
      quantity: 1,
      image: item.image || '/lacasitalogo.jpg',
      specialRequest: item.specialRequest || '',
      location: selectedLocation
    };
    addItem(cartItem);
  }

  async function handlePlaceOrder() {
    if (!orderingAllowed.allowed) return alert(orderingAllowed.message || 'Ordering is closed');
    if (!selectedLocation) return alert('Select a location');
    if (!customerInfo.name || !customerInfo.phone) return alert('Please provide name and phone');
    if (state.items.length === 0) return alert('Cart is empty');

    const payload = {
      items: state.items,
      subtotal: state.subtotal,
      tax: state.tax,
      total: state.total,
      customerInfo,
      orderType: 'pickup',
      location: selectedLocation
    };

    try {
      setSubmitting(true);
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create order');
      alert('Order placed! Order id: ' + (data.orderId || data.id || 'unknown'));
      clearCart();
      // optionally redirect to order confirmation
      // router.push('/order-confirmation');
    } catch (err: any) {
      console.error('Place order error', err);
      alert('Failed to place order: ' + (err.message || err));
    } finally { setSubmitting(false); }
  }

  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold mb-4">Breakfast Menu</h1>
        <p className="text-sm text-gray-600 mb-6">Morning favorites — add to cart and place an order for pickup.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {breakfastCategories.map(cat => (
            <div key={cat.id} className="rounded-lg border p-4">
              <h2 className="font-bold text-lg">{cat.name}</h2>
              <p className="text-sm text-gray-600">{cat.description}</p>
              <div className="mt-4 space-y-3">
                {breakfastItems.filter(i => i.category === cat.id).map(item => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div>
                      <div className="font-semibold">{item.name}</div>
                      <div className="text-xs text-gray-600">{item.description}</div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="font-bold">${item.price.toFixed(2)}</div>
                      <div>
                        <button onClick={() => addToCart(item)} className="px-3 py-1 rounded bg-red-600 text-white">Add</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-lg border p-4">
            <h3 className="font-bold mb-2">Pickup Location</h3>
            <div className="space-y-2">
              <button className={`w-full text-left p-3 rounded ${selectedLocation==='Berthoud'? 'bg-red-600 text-white' : 'bg-white border'}`} onClick={()=>setSelectedLocation('Berthoud')}>Berthoud</button>
              <button className={`w-full text-left p-3 rounded ${selectedLocation==='Fort Collins'? 'bg-red-600 text-white' : 'bg-white border'}`} onClick={()=>setSelectedLocation('Fort Collins')}>Fort Collins</button>
            </div>
          </div>

          <div className="rounded-lg border p-4">
            <h3 className="font-bold mb-2">Your Info</h3>
            <div className="space-y-2">
              <input className="w-full p-2 border rounded" placeholder="Name" value={customerInfo.name} onChange={e=>setCustomerInfo({...customerInfo,name:e.target.value})} />
              <input className="w-full p-2 border rounded" placeholder="Phone" value={customerInfo.phone} onChange={e=>setCustomerInfo({...customerInfo,phone:e.target.value})} />
              <input className="w-full p-2 border rounded" placeholder="Email (optional)" value={customerInfo.email} onChange={e=>setCustomerInfo({...customerInfo,email:e.target.value})} />
              <textarea className="w-full p-2 border rounded" placeholder="Special instructions" value={customerInfo.specialInstructions} onChange={e=>setCustomerInfo({...customerInfo,specialInstructions:e.target.value})} />
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-lg border p-4">
          <h3 className="font-bold mb-3">Cart</h3>
          <div className="space-y-3">
            {state.items.length === 0 && <div className="text-sm text-gray-600">Your cart is empty.</div>}
            {state.items.map(it => (
              <div key={it.id} className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{it.name}</div>
                  <div className="text-xs text-gray-600">{it.specialRequest}</div>
                </div>
                <div className="text-right">
                  <div>${(it.price * it.quantity).toFixed(2)}</div>
                  <div className="text-xs text-gray-600">Qty: {it.quantity}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 text-right">
            <div className="text-sm text-gray-600">Subtotal: ${state.subtotal.toFixed(2)}</div>
            <div className="text-sm text-gray-600">Tax: ${state.tax.toFixed(2)}</div>
            <div className="font-bold">Total: ${state.total.toFixed(2)}</div>
          </div>

          <div className="mt-4 flex gap-3">
            <button onClick={handlePlaceOrder} disabled={submitting} className="px-4 py-2 bg-red-600 text-white rounded font-bold">{submitting? 'Placing...' : 'Place Order'}</button>
            <Link href="/order" className="px-4 py-2 bg-gray-200 rounded">View full ordering</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
