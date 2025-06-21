import Image from 'next/image';
import Link from 'next/link';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export default async function Home() {
  const supabase = createServerComponentClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar handled globally; removed duplicate */}
      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836"
            alt="Mexican food spread"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gray-900/60" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-32 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
              Welcome to La Casita
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-200">
              Experience authentic Mexican cuisine in the heart of Berthoud, Colorado
            </p>
            <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/menu"
                className="inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                View Our Menu
              </Link>
              {!session && (
                <Link
                  href="/auth/signup"
                  className="inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Join Our Rewards
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
            <div className="text-center">
              <h3 className="mt-2 text-xl font-semibold text-gray-900">Fresh Ingredients</h3>
              <p className="mt-4 text-gray-500">
                We use only the freshest ingredients to create authentic Mexican flavors.
              </p>
            </div>
            <div className="text-center">
              <h3 className="mt-2 text-xl font-semibold text-gray-900">Family Recipes</h3>
              <p className="mt-4 text-gray-500">
                Traditional recipes passed down through generations.
              </p>
            </div>
            <div className="text-center">
              <h3 className="mt-2 text-xl font-semibold text-gray-900">Online Ordering</h3>
              <p className="mt-4 text-gray-500">
                Easy online ordering for pickup or delivery.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
