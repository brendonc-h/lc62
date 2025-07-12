'use client';

import Navbar from '@/components/Navbar';
import { CartProvider } from '@/lib/cart-context';
import { usePathname } from 'next/navigation';

// Client component for path-aware layout
function PageLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className={`flex-1 ${!isHomePage ? 'pt-20' : ''}`}>{children}</main>
    </div>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {  
  return (
    <CartProvider>
      <PageLayout>{children}</PageLayout>
    </CartProvider>
  );
}