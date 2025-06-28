'use client';

export const runtime = 'nodejs';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '../../lib/supabaseClient';

interface OrderDetails {
  id: string;
  status: string;
  items: Array<{
    id: string;
    name: string;
    quantity: number;
  }>;
  total: number;
}

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchOrder = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        setOrder(data as OrderDetails);
      } catch (err) {
        console.error('Error fetching order:', err);
        setError('Failed to load order');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, supabase]);

  if (loading) return <div>Loading...</div>;
  if (error || !order) return <div>Order not found</div>;

  return (
    <main className="max-w-3xl mx-auto py-16 px-4">
      <h1 className="text-3xl font-bold mb-6">Thank you for your order!</h1>

      <p className="mb-4">
        Order&nbsp;
        <span className="font-mono">#{id}</span> –{' '}
        <span className="capitalize">{order.status}</span>
      </p>

      <ul className="mb-6 space-y-2">
        {order.items.map((item) => (
          <li key={item.id}>
            {item.quantity}× {item.name}
          </li>
        ))}
      </ul>

      <p className="font-semibold">Total: ${order.total.toFixed(2)}</p>

      <Link href="/" className="mt-8 inline-block text-primary-600 underline">
        Back to home
      </Link>
    </main>
  );
}

export default function OrderConfirmation() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    }>
      <OrderConfirmationContent />
    </Suspense>
  );
}
