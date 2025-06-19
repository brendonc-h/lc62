'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { ShoppingCartIcon } from '@heroicons/react/24/solid';
import { useCart } from '@/lib/cart-context';

export default function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const { state } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Don't show navbar on auth pages
  if (pathname.startsWith('/auth')) {
    return null;
  }

  const cartItemCount = state.items.reduce((total, item) => total + item.quantity, 0);

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Menu', href: '/menu' },
    { name: 'Order Online', href: '/order' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <nav className="bg-white shadow-lg border-b border-red-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-red-600 hover:text-red-700 transition-colors">
              La Casita
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`${
                  pathname === item.href
                    ? 'text-red-600 border-b-2 border-red-600'
                    : 'text-gray-700 hover:text-red-600'
                } px-3 py-2 text-sm font-medium transition-colors duration-200`}
              >
                {item.name}
              </Link>
            ))}

            {/* Cart Icon */}
            <Link
              href="/checkout"
              className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 transition-colors relative"
            >
              <ShoppingCartIcon className="h-6 w-6" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {status === 'authenticated' ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  Welcome, {session.user?.name}
                </span>
                {session.user?.role === 'admin' && (
                  <Link
                    href="/admin"
                    className="text-sm font-medium text-red-600 hover:text-red-700"
                  >
                    Admin
                  </Link>
                )}
                <Link
                  href="/dashboard"
                  className="text-sm font-medium text-gray-700 hover:text-red-600"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: '/auth/signin' })}
                  className="text-sm font-medium text-gray-700 hover:text-red-600"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <div className="flex space-x-4">
                <Link
                  href="/auth/signin"
                  className="text-sm font-medium text-gray-700 hover:text-red-600"
                >
                  Sign in
                </Link>
                <Link
                  href="/auth/signup"
                  className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition-colors"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              type="button"
              className="text-gray-700 hover:text-red-600 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              <Link
                href="/checkout"
                className="flex items-center gap-2 px-3 py-2 text-base font-medium text-red-600 hover:bg-red-50 rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                <ShoppingCartIcon className="h-5 w-5" />
                Cart ({cartItemCount})
              </Link>

              {status === 'authenticated' ? (
                <>
                  <div className="px-3 py-2 text-sm text-gray-600">
                    Welcome, {session.user?.name}
                  </div>
                  {session.user?.role === 'admin' && (
                    <Link
                      href="/admin"
                      className="block px-3 py-2 text-base font-medium text-red-600 hover:bg-red-50 rounded-md"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Admin
                    </Link>
                  )}
                  <Link
                    href="/dashboard"
                    className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-md"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      signOut({ callbackUrl: '/auth/signin' });
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-md"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/signin"
                    className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-md"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="block px-3 py-2 text-base font-medium bg-red-600 text-white hover:bg-red-700 rounded-md"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}