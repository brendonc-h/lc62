'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabaseClient';
import {
  UserCircleIcon,
  ShoppingBagIcon,
  HomeIcon,
  Bars3Icon,
  XMarkIcon,
  ArrowLeftOnRectangleIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline';

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Role-based navigation
  const getNavigation = () => {
    const baseNav = [
      { name: 'Home', href: '/', icon: HomeIcon },
      { name: 'Menu', href: '/menu', icon: ShoppingBagIcon },
    ];

    if (!user) {
      return [...baseNav, { name: 'About Us', href: '/about', icon: MapPinIcon }];
    }

    // Customer navigation
    const customerNav = [
      ...baseNav,
      { name: 'My Orders', href: '/orders', icon: ShoppingBagIcon },
      { name: 'Dashboard', href: '/dashboard', icon: UserCircleIcon },
      { name: 'About Us', href: '/about', icon: MapPinIcon },
    ];

    // Admin navigation
    if (user.role === 'admin') {
      return [
        ...baseNav,
        { name: 'Admin Dashboard', href: '/admin', icon: UserCircleIcon },
        { name: 'Kitchen', href: '/kitchen', icon: ShoppingBagIcon },
        { name: 'Orders Management', href: '/admin/orders', icon: ShoppingBagIcon },
      ];
    }

    // Kitchen staff navigation
    if (user.role === 'kitchen') {
      return [
        ...baseNav,
        { name: 'Kitchen Dashboard', href: '/kitchen', icon: ShoppingBagIcon },
        { name: 'My Orders', href: '/orders', icon: ShoppingBagIcon },
      ];
    }

    return customerNav;
  };

  const navigation = getNavigation();

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: authData, error } = await supabase.auth.getUser();

        if (error || !authData?.user) {
          setUser(null);
          setLoading(false);
          return;
        }

        // Fetch user profile to get role
        const { data: profile, error: profileError } = await supabase
          .from('customers')
          .select('role, name')
          .eq('auth_id', authData.user.id)
          .single();

        if (profileError) {
          console.warn('Could not fetch user profile:', profileError);
          setUser({
            ...authData.user,
            role: 'customer', // Default role
            name: authData.user.email?.split('@')[0] || 'User'
          });
        } else {
          setUser({
            ...authData.user,
            role: profile.role || 'customer',
            name: profile.name || authData.user.email?.split('@')[0] || 'User'
          });
        }
      } catch (err) {
        console.error('Error fetching user:', err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    getUser();

    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      getUser();
    });

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  if (pathname.startsWith('/auth')) {
    return null;
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 w-full bg-transparent backdrop-blur-md">

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo & Nav */}
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-red-700 to-orange-600 bg-clip-text text-transparent hover:from-red-800 hover:to-orange-700 transition-all duration-300 tracking-tight">
              La&nbsp;Casita
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`${
                    pathname === item.href
                      ? 'bg-white/20 text-yellow-300 font-semibold shadow-lg'
                      : 'text-yellow-200 hover:bg-white/10 hover:text-yellow-100'
                  } px-3 py-2 rounded-md text-sm font-medium flex items-center transition-all duration-200`}
                >
                  <item.icon className="h-5 w-5 mr-1.5" />
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Profile Section */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {!loading && user ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 max-w-xs rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <UserCircleIcon className="h-8 w-8 text-yellow-200" />
                  <span className="hidden md:inline text-sm font-medium text-yellow-200">
                    {user.name || user.email?.split('@')[0]}
                  </span>
                </button>

                {isProfileOpen && (
                  <div
                    className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
                    role="menu"
                  >
                    <div className="py-1" role="none">
                      <Link
                        href="/dashboard"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <UserCircleIcon className="mr-3 h-5 w-5 text-gray-500" />
                        Dashboard
                      </Link>
                      <button
                        onClick={async () => {
                          await supabase.auth.signOut();
                          window.location.href = '/';
                        }}
                        className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        <ArrowLeftOnRectangleIcon className="mr-3 h-5 w-5 text-red-500" />
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex space-x-3">
                <Link
                  href="/auth/signin"
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white hover:bg-white/20 rounded-md transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  href="/auth/signup"
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md shadow-sm transition-colors"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="block h-6 w-6" />
              ) : (
                <Bars3Icon className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`${
          isMobileMenuOpen ? 'block' : 'hidden'
        } sm:hidden w-full bg-black/80 backdrop-blur-sm`}
      >
        <div className="px-4 pt-4 pb-3 space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`${
                pathname === item.href
                  ? 'bg-white/20 border-white/50 text-white'
                  : 'border-transparent text-white hover:bg-white/10 hover:border-white/30'
              } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <div className="flex items-center">
                <item.icon className="h-5 w-5 mr-2" />
                {item.name}
              </div>
            </Link>
          ))}

          {!loading && user && (
            <div className="pt-4 pb-3 border-t border-white/20">
              <div className="flex items-center px-4">
                <UserCircleIcon className="h-10 w-10 text-white/80" />
                <div className="ml-3">
                  <div className="text-base font-medium text-white">
                    {user.name || user.email}
                  </div>
                </div>
              </div>
              <div className="mt-3 space-y-1">
                <Link
                  href="/dashboard"
                  className="block px-4 py-2 text-base font-medium text-white/80 hover:text-white hover:bg-white/10"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  onClick={async () => {
                    await supabase.auth.signOut();
                    window.location.href = '/';
                  }}
                  className="w-full text-left block px-4 py-2 text-base font-medium text-red-400 hover:bg-white/10"
                >
                  Sign out
                </button>
              </div>
            </div>
          )}

          {!loading && !user && (
            <div className="pt-4 pb-3 border-t border-white/20">
              <div className="space-y-1">
                <Link
                  href="/auth/signin"
                  className="block w-full px-4 py-2 text-base font-medium text-center text-white bg-white/10 hover:bg-white/20 rounded-md"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign in
                </Link>
                <Link
                  href="/auth/signup"
                  className="block w-full px-4 py-2 text-base font-medium text-center text-white bg-red-600 hover:bg-red-700 rounded-md shadow-sm"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign up
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
