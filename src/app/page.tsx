'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChefHat, Users, Smartphone, Star, Clock, MapPin, Phone } from 'lucide-react';
import { createClient } from '../lib/supabaseClient';
import { User, AuthChangeEvent, Session } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [currentBgIndex, setCurrentBgIndex] = useState(0);
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
      if (session?.user) {
        setUser(session.user);
        setIsLoggedIn(true);
      } else {
        setUser(null);
        setIsLoggedIn(false);
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [supabase.auth]);
  
  // Background images for each location
  const backgrounds = [
    { image: '/Lc33.jpeg', location: 'Berthoud' },
    { image: '/focostore.jpg', location: 'Fort Collins' }
  ]; // Cycle between locations

  // Change background image every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBgIndex((prevIndex) => (prevIndex + 1) % backgrounds.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [backgrounds.length]);

  return (
    <div className="min-h-screen">
      <main>
        {/* Hero Section with Gradient Background */}
        <div className="relative h-screen flex items-center justify-center pt-16 overflow-hidden">
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${backgrounds[currentBgIndex].image})` }}
          />
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-black bg-opacity-50" />
          
          {/* Location Badge */}
          <div className="absolute top-5 right-5 bg-orange-500 text-white px-4 py-2 rounded-full font-semibold shadow-lg">
            {backgrounds[currentBgIndex].location} Location
          </div>
          
          {/* Content */}
          <div className="relative z-10 text-center text-white px-4 max-w-4xl">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Welcome to{' '}
              <span className="text-orange-400">La Casita</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 leading-relaxed">
              Authentic Mexican flavors crafted with love and tradition
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/menu"
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105"
              >
                Order Now
              </Link>
              <Link
                href="/menu"
                className="border-2 border-white hover:bg-white hover:text-black text-white font-bold py-4 px-8 rounded-full text-lg transition-all duration-300"
              >
                View Menu
              </Link>
            </div>
          </div>
        </div>

      </main>

      {/* Food Gallery Section */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-amber-50 to-orange-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent mb-4">
              Authentic Mexican Flavors
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Every dish is crafted with traditional recipes and the freshest ingredients
            </p>
          </div>

          {/* Food Images Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <div className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <div className="aspect-w-16 aspect-h-12 relative h-64">
                <Image
                  src="/image9.jpeg"
                  alt="Delicious Mexican dessert with chocolate drizzle"
                  width={500}
                  height={300}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  priority
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">Sweet Endings</h3>
                <p className="text-gray-600">Traditional Mexican desserts to complete your meal</p>
              </div>
            </div>

            <div className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <div className="aspect-w-16 aspect-h-12 relative h-64">
                <Image
                  src="/image0.jpeg"
                  alt="Grilled Mexican steak with peppers and sides"
                  width={500}
                  height={300}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  priority
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">Carne Asada</h3>
                <p className="text-gray-600">Perfectly grilled steak with fresh vegetables</p>
              </div>
            </div>

            <div className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <div className="aspect-w-16 aspect-h-12 relative h-64">
                <Image
                  src="/image10.jpeg"
                  alt="Mexican combination plate with enchiladas and sides"
                  width={500}
                  height={300}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  priority
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">Combination Plates</h3>
                <p className="text-gray-600">Perfect variety of our most popular dishes</p>
              </div>
            </div>

            <div className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <div className="aspect-w-16 aspect-h-12 relative h-64">
                <Image
                  src="/image1.jpeg"
                  alt="Cheese enchiladas with rice and beans"
                  width={500}
                  height={300}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  priority
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">Enchiladas</h3>
                <p className="text-gray-600">Homemade tortillas filled with cheese and topped with our signature sauce</p>
              </div>
            </div>

            <div className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <div className="aspect-w-16 aspect-h-12 relative h-64">
                <Image
                  src="/image11.jpeg"
                  alt="Grilled steak with potatoes and peppers"
                  width={500}
                  height={300}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  priority
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">Specialty Steaks</h3>
                <p className="text-gray-600">Premium cuts grilled to perfection with authentic seasonings</p>
              </div>
            </div>

            {/* Call to Action Card */}
            <div className="group relative bg-gradient-to-br from-red-600 to-orange-600 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center">
              <div className="p-8 text-center text-white">
                <ChefHat className="h-16 w-16 mx-auto mb-4 text-yellow-300" />
                <h3 className="text-2xl font-bold mb-4">See Full Menu</h3>
                <p className="mb-6">Discover all our authentic Mexican dishes</p>
                <Link
                  href="/menu"
                  className="inline-flex items-center justify-center px-6 py-3 bg-white text-red-600 font-semibold rounded-full hover:bg-gray-100 transition-colors"
                >
                  View Menu
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <div className="relative py-24 px-4 sm:px-6 lg:px-8 bg-white">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23dc2626' fill-opacity='0.4'%3E%3Cpath d='M20 20c0 0-10-10-10-10s10-10 10-10 10 10 10 10-10 10-10 10z'/%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent mb-4">
              Why Choose La Casita?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience the authentic taste of Mexico with our commitment to quality, tradition, and exceptional service
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {/* Feature 1 */}
            <div className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-red-200">
              <div className="relative">
                <div className="absolute -top-4 -left-4 w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-full opacity-10 group-hover:opacity-20 transition-opacity"></div>
                <div className="relative flex justify-center mb-6">
                  <div className="p-4 bg-gradient-to-br from-red-500 to-orange-500 rounded-full shadow-lg">
                    <ChefHat className="h-8 w-8 text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">Fresh Ingredients</h3>
                <p className="text-gray-600 text-center leading-relaxed">
                  We source only the finest local produce and authentic Mexican spices to create dishes that burst with flavor and tradition.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-red-200">
              <div className="relative">
                <div className="absolute -top-4 -left-4 w-16 h-16 bg-gradient-to-br from-yellow-500 to-red-500 rounded-full opacity-10 group-hover:opacity-20 transition-opacity"></div>
                <div className="relative flex justify-center mb-6">
                  <div className="p-4 bg-gradient-to-br from-yellow-500 to-red-500 rounded-full shadow-lg">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">Family Recipes</h3>
                <p className="text-gray-600 text-center leading-relaxed">
                  Our menu features time-honored recipes passed down through generations, bringing authentic Mexican flavors to your table.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-red-200">
              <div className="relative">
                <div className="absolute -top-4 -left-4 w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full opacity-10 group-hover:opacity-20 transition-opacity"></div>
                <div className="relative flex justify-center mb-6">
                  <div className="p-4 bg-gradient-to-br from-orange-500 to-red-500 rounded-full shadow-lg">
                    <Smartphone className="h-8 w-8 text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">Easy Online Ordering</h3>
                <p className="text-gray-600 text-center leading-relaxed">
                  Order your favorite dishes online with just a few clicks. Quick, convenient pickup and delivery options available.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-red-600 to-orange-600">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Experience Authentic Mexican Cuisine?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join us at La Casita for an unforgettable dining experience in beautiful Colorado
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/menu"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-red-600 text-lg font-semibold rounded-full shadow-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
            >
              Order Online Now
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center justify-center px-8 py-4 bg-transparent border-2 border-white text-white text-lg font-semibold rounded-full shadow-lg hover:bg-white/10 transition-all duration-300"
            >
              Visit Our Locations
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}