'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ChefHat, Users, Smartphone, Star, Clock, MapPin, Phone } from 'lucide-react';
import { FiHome, FiShoppingBag, FiUser } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [currentBgIndex, setCurrentBgIndex] = useState(0);
  const [user, setUser] = useState<any>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };
    
    getUser();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });
    
    return () => {
      subscription?.unsubscribe();
    };
  }, [supabase.auth]);
  
  // Colorado scenery backgrounds - alternating between Berthoud and Fort Collins
  const backgrounds = [
    "https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop", // Colorado mountains
    "https://images.pexels.com/photos/1562058/pexels-photo-1562058.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop", // Colorado landscape
    "https://images.pexels.com/photos/1323550/pexels-photo-1323550.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop", // Colorado foothills
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBgIndex((prevIndex) => (prevIndex + 1) % backgrounds.length);
    }, 6000); // Change background every 6 seconds

    return () => clearInterval(interval);
  }, [backgrounds.length]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      {/* Navigation */}
      <nav className="absolute top-0 left-0 right-0 z-50 bg-gradient-to-r from-black/40 to-transparent backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="flex items-center space-x-2">
              <ChefHat className="h-8 w-8 text-yellow-400" />
              <span className="text-2xl font-bold text-white">La Casita</span>
            </Link>
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/" className="text-white hover:text-yellow-400 transition-colors font-medium flex items-center px-3 py-2 rounded-md text-sm">
                <FiHome size={20} className="mr-2" />
                Home
              </Link>
              <Link href="/menu" className="text-white hover:text-yellow-400 transition-colors font-medium flex items-center px-3 py-2 rounded-md text-sm">
                <FiShoppingBag size={20} className="mr-2" />
                Menu
              </Link>
              {user ? (
                <div className="relative group">
                  <button 
                    className="flex items-center text-white hover:text-yellow-400 transition-colors font-medium px-3 py-2 rounded-md text-sm"
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                  >
                    <FiUser size={20} className="mr-2" />
                    {user.name || user.email?.split('@')[0]}
                  </button>
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                      <Link
                        href="/dashboard"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        Dashboard
                      </Link>
                      <button
                        onClick={async () => {
                          await supabase.auth.signOut();
                          window.location.href = '/';
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link 
                  href="/auth/signin" 
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background Images */}
        {backgrounds.map((bg, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-2000 ${
              index === currentBgIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Image
              src={bg}
              alt={`Colorado scenery ${index + 1}`}
              fill
              className="object-cover"
              priority={index === 0}
            />
          </div>
        ))}
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-900/80 via-orange-800/70 to-yellow-600/60"></div>
        
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23dc2626' fill-opacity='0.3'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-yellow-400/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-red-500/20 rounded-full blur-3xl"></div>

        {/* Hero Content */}
        <div className="relative z-10 text-center max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/5 backdrop-blur-md p-8 sm:p-12 rounded-3xl shadow-2xl border border-white/20">
            <div className="flex justify-center mb-6">
              <div className="flex items-center space-x-1 text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-6 w-6 fill-current" />
                ))}
              </div>
            </div>
            
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              ¡Bienvenidos a{' '}
              <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                La Casita
              </span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-white/90 mb-4 font-light">
              Authentic Mexican Cuisine in the Heart of Berthoud
            </p>
            
            <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
              Family recipes passed down through generations, prepared with love and the finest ingredients
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/menu"
                className="group relative inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white text-lg font-semibold rounded-full shadow-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
              >
                <span className="relative z-10">View Our Menu</span>
                <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
              
              <Link
                href="/auth/signup"
                className="group relative inline-flex items-center justify-center px-8 py-4 bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 text-lg font-semibold rounded-full shadow-lg hover:bg-white/20 hover:border-white/50 transition-all duration-300 transform hover:scale-105"
              >
                <span className="relative z-10">Join Our Rewards</span>
              </Link>
            </div>

            {/* Quick Info */}
            <div className="mt-8 pt-8 border-t border-white/20 flex flex-col sm:flex-row gap-6 justify-center items-center text-white/80">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-yellow-400" />
                <span className="text-sm">Open Daily 11am - 9pm</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-5 w-5 text-yellow-400" />
                <span className="text-sm">(970) 532-4223</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-yellow-400" />
                <span className="text-sm">Berthoud, Colorado</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Food Gallery Section */}
      <div className="relative py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-amber-50 to-orange-100">
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
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
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
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
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
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
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
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
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
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
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
      </div>

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
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 bg-transparent border-2 border-white text-white text-lg font-semibold rounded-full shadow-lg hover:bg-white/10 transition-all duration-300"
            >
              Visit Our Location
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}