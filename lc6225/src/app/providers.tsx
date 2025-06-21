'use client';

import Navbar from '@/components/Navbar';
import PointsCard from '@/components/PointsCard';
import { CartProvider } from '@/lib/cart-context';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <PointsCard />
      </div>
    </CartProvider>
  );
}