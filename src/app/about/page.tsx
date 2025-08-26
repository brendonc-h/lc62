'use client';

import React from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function About() {
  return (
    <div className="min-h-screen bg-white pt-16 pb-12">
      {/* About Us Header */}
      <div className="relative py-16 bg-gradient-to-r from-red-600 to-orange-500">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight text-white text-center sm:text-5xl lg:text-6xl">
            About La Casita
          </h1>
          <p className="mt-6 max-w-3xl mx-auto text-xl text-white text-center">
            Authentic Mexican cuisine served with love in Berthoud, Colorado
          </p>
        </div>
      </div>

      {/* Story Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Family Story</h2>
            <p className="text-lg text-gray-600 mb-4">
              I, David, and my wife Maricruz have been here for a little over 20 years! We have had a roller coaster of emotions and not so fun adventure while we have been here.
            </p>
            <p className="text-lg text-gray-600 mb-4">
              My wife and I migrated from Mexico to Fort Collins Colorado on a December night with a freezing cold not knowing what was waiting for us this winter. The cold was horrible - freezing for the next couple months we had to walk 5 miles to work in the cold, not being able to find an affordable place near work or an affordable car.
            </p>
            <p className="text-lg text-gray-600 mb-4">
              We started to work at a Mexican restaurant working 14+ hours nonstop to make a living. There would be times where I wouldn't get home until 2:30am because we would have to deep clean everything before closing on top of waiting until everyone left.
            </p>
            <p className="text-lg text-gray-600 mb-4">
              These experiences made my wife and I consider saving up money to open our own business. We realized that we would love to be our own boss and not let anyone boss us around.
            </p>
            <p className="text-lg text-gray-600 mb-4">
              When 2005 came around, our first baby was born, reassuring us that we needed our own business to spend quality time with our family. From 2005 forward, we've been saving money to open our own Mexican restaurant! When we found out we had a baby boy on the way in 2011, we kept working harder for our dreams to come true.
            </p>
            <p className="text-lg text-gray-600 mb-4">
              Finally in 2020, we got the huge opportunity to open our own Mexican restaurant! This was like a dream come true. From then on, we've been working hard to make our customers feel like family.
            </p>
            <p className="text-lg text-gray-600 mb-4">
              After 4 years, we had the privilege to open a second location in Fort Collins! Our dreams finally came true and we are a happy family-owned business!
            </p>
            <p className="text-lg text-gray-600 font-medium">
              We thank each and every one of our customers for the opportunity they have given us - we would not be here if it wasn't for you!
            </p>
          </div>
          <div className="rounded-lg overflow-hidden shadow-xl">
            <Image 
              src="/image0.jpeg" 
              alt="La Casita Restaurant" 
              width={600} 
              height={400} 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Location Section with Maps */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Visit Us</h2>
            <p className="text-xl text-gray-600">Find us in beautiful Northern Colorado</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Berthoud Location */}
            <div className="bg-white rounded-lg shadow-xl overflow-hidden">
              <div className="p-8">
                <div className="flex items-center mb-6">
                  <div className="p-3 bg-red-500 rounded-full mr-4">
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Berthoud Location</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <p className="text-gray-700 mb-4">
                      <span className="block font-medium text-lg mb-2">Address:</span>
                      405 5th St<br />
                      Berthoud, CO 80513
                    </p>
                    <p className="text-gray-700 mb-4">
                      <span className="block font-medium text-lg mb-2">Service Options:</span>
                      <span className="block">• Outdoor seating</span>
                      <span className="block">• Kids' menu</span>
                      <span className="block">• Dogs allowed outside</span>
                    </p>
                    <Link
                      href="https://maps.google.com/?q=405+5th+St+Berthoud+CO+80513"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-red-500 hover:text-red-700 font-medium"
                    >
                      Get Directions
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </Link>
                  </div>
                  
                  <div>
                    <p className="text-gray-700 mb-4">
                      <span className="block font-medium text-lg mb-2">Hours:</span>
                      <span className="block"><span className="font-medium">Mon - Fri:</span> 7:30 AM - 8:00 PM</span>
                      <span className="block"><span className="font-medium">Saturday:</span> 7:30 AM - 2:00 PM</span>
                      <span className="block"><span className="font-medium">Sunday:</span> Closed</span>
                    </p>
                    <div className="space-y-2">
                      <Link
                        href="tel:+19703446448"
                        className="inline-flex items-center text-red-500 hover:text-red-700 font-medium"
                      >
                        <Phone className="h-4 w-4 mr-1" />
                        (970) 344-6448
                      </Link>
                      <div className="block">
                        <Link
                          href="https://orderlacasitaauthenticmexicanrestaurant.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-red-500 hover:text-red-700 font-medium"
                        >
                          <Mail className="h-4 w-4 mr-1" />
                         Info@lacasita.io
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Berthoud Map */}
              <div className="h-80 w-full">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3041.2!2d-105.0808!3d40.3084!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x876eadb9c0e7ea1%3A0x8c2b4be564267d53!2s405%205th%20St%2C%20Berthoud%2C%20CO%2080513!5e0!3m2!1sen!2sus!4v1687966875305!5m2!1sen!2sus" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen={true} 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="La Casita Berthoud Location Map"
                />
              </div>
            </div>
            
            {/* Fort Collins Location */}
            <div className="bg-white rounded-lg shadow-xl overflow-hidden">
              <div className="p-8">
                <div className="flex items-center mb-6">
                  <div className="p-3 bg-red-500 rounded-full mr-4">
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Fort Collins Location</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <p className="text-gray-700 mb-4">
                      <span className="block font-medium text-lg mb-2">Address:</span>
                      1720 W Mulberry St<br />
                      Fort Collins, CO 80521
                    </p>
                    <Link
                      href="https://maps.google.com/?q=1720+W+Mulberry+St+Fort+Collins+CO+80521"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-red-500 hover:text-red-700 font-medium"
                    >
                      Get Directions
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </Link>
                  </div>
                  
                  <div>
                    <p className="text-gray-700 mb-4">
                      <span className="block font-medium text-lg mb-2">Hours:</span>
                      <span className="block"><span className="font-medium">Mon - Fri:</span> 7:00 AM - 8:00 PM</span>
                      <span className="block"><span className="font-medium">Saturday:</span> 7:00 AM - 2:00 PM</span>
                      <span className="block"><span className="font-medium">Sunday:</span> Closed</span>
                    </p>
                    <div className="space-y-2">
                      <Link
                        href="tel:+19705688363"
                        className="inline-flex items-center text-red-500 hover:text-red-700 font-medium"
                      >
                        <Phone className="h-4 w-4 mr-1" />
                        (970) 568-8363
                      </Link>
                      <div className="block">
                        <Link
                          href="https://lacasitamexicancuisineco.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-red-500 hover:text-red-700 font-medium"
                        >
                          <Mail className="h-4 w-4 mr-1" />
                          info@lacasita.io
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Fort Collins Map */}
              <div className="h-80 w-full">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3037.990356438717!2d-105.08561792336071!3d40.38899697143048!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x87694a98795eb76d%3A0xc9a618f4c4fd8f79!2s1720%20W%20Mulberry%20St%2C%20Fort%20Collins%2C%20CO%2080521!5e0!3m2!1sen!2sus!4v1687966990305!5m2!1sen!2sus" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen={true} 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="La Casita Fort Collins Location Map"
                />
              </div>
            </div>
          </div>
          
          {/* Contact Card */}
          <div className="mt-12">
            <div className="bg-white rounded-lg shadow-lg p-8 flex flex-col items-center max-w-md mx-auto">
              <div className="p-4 bg-red-500 rounded-full mb-4">
                <Mail className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Contact Us</h3>
              <p className="text-gray-600 text-center mb-4">
                <span className="block mb-2">info@lacasita.io</span>
              </p>
              <Link 
                href="mailto:info@lacasita.io" 
                className="text-red-500 hover:text-red-700 font-medium"
              >
                Email Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-red-600 to-orange-500 rounded-2xl overflow-hidden shadow-xl">
          <div className="px-6 py-12 md:p-12 text-center">
            <h2 className="text-3xl font-bold text-white mb-6">Ready to Experience Authentic Mexican Cuisine?</h2>
            <p className="text-xl text-white mb-8 max-w-3xl mx-auto">
              Join us at La Casita for an unforgettable dining experience or order online for pickup!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/menu" 
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-red-600 font-bold rounded-full hover:bg-gray-100 transition-all duration-300"
              >
                View Our Menu
              </Link>
              <Link 
                href="/order" 
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-bold rounded-full hover:bg-white/10 transition-all duration-300"
              >
                Order Online
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Legal Links Footer */}
      <section className="py-12 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-6">Legal Information</h3>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Link 
                href="/privacy" 
                className="text-gray-600 hover:text-red-600 transition-colors"
              >
                Privacy Policy
              </Link>
              <Link 
                href="/terms" 
                className="text-gray-600 hover:text-red-600 transition-colors"
              >
                Terms of Use
              </Link>
            </div>
            <p className="mt-6 text-sm text-gray-500">
              © {new Date().getFullYear()} La Casita Restaurant. All rights reserved.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
