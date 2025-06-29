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
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
            <p className="text-lg text-gray-600 mb-6">
              La Casita has been serving authentic Mexican cuisine to the Berthoud community since 2015. 
              Our family recipes have been passed down through generations, bringing the true flavors of 
              Mexico to Colorado.
            </p>
            <p className="text-lg text-gray-600 mb-6">
              We pride ourselves on using only the freshest ingredients, preparing our dishes from scratch 
              daily, and providing a warm, welcoming atmosphere for our guests.
            </p>
            <p className="text-lg text-gray-600">
              Whether you're joining us for a family dinner, picking up takeout, or catering your next event, 
              La Casita is committed to providing exceptional food and service with every visit.
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

      {/* Location Section with Map */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Visit Us</h2>
            <p className="text-xl text-gray-600">Find us in beautiful Northern Colorado</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Berthoud Location */}
            <div className="bg-white rounded-lg shadow-lg p-8 flex flex-col items-center">
              <div className="p-4 bg-red-500 rounded-full mb-4">
                <MapPin className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Berthoud Location</h3>
              <p className="text-gray-600 text-center mb-4">
                950 Mountain Ave<br />
                Berthoud, CO 80513
              </p>
              <Link 
                href="https://maps.google.com/?q=950+Mountain+Ave+Berthoud+CO+80513" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-red-500 hover:text-red-700 font-medium"
              >
                Get Directions
              </Link>
            </div>
            
            {/* Fort Collins Location */}
            <div className="bg-white rounded-lg shadow-lg p-8 flex flex-col items-center">
              <div className="p-4 bg-red-500 rounded-full mb-4">
                <MapPin className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Fort Collins Location</h3>
              <p className="text-gray-600 text-center mb-4">
                2909 E Harmony Rd<br />
                Fort Collins, CO 80528
              </p>
              <Link 
                href="https://maps.google.com/?q=2909+E+Harmony+Rd+Fort+Collins+CO+80528" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-red-500 hover:text-red-700 font-medium"
              >
                Get Directions
              </Link>
            </div>

            {/* Hours Card */}
            <div className="bg-white rounded-lg shadow-lg p-8 flex flex-col items-center">
              <div className="p-4 bg-red-500 rounded-full mb-4">
                <Clock className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Hours</h3>
              <div className="text-gray-600 text-center">
                <p className="mb-2"><span className="font-medium">Monday - Thursday:</span><br />11:00 AM - 9:00 PM</p>
                <p className="mb-2"><span className="font-medium">Friday - Saturday:</span><br />11:00 AM - 10:00 PM</p>
                <p><span className="font-medium">Sunday:</span><br />12:00 PM - 8:00 PM</p>
              </div>
            </div>

            {/* Contact Card */}
            <div className="bg-white rounded-lg shadow-lg p-8 flex flex-col items-center">
              <div className="p-4 bg-red-500 rounded-full mb-4">
                <Phone className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Contact Us</h3>
              <p className="text-gray-600 text-center mb-4">
                <span className="block mb-2">(970) 555-1234</span>
                <span className="block">info@lacasitarestaurant.com</span>
              </p>
              <Link 
                href="tel:+19705551234" 
                className="text-red-500 hover:text-red-700 font-medium"
              >
                Call Now
              </Link>
            </div>
          </div>

          {/* Maps */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Berthoud Map */}
            <div className="rounded-lg overflow-hidden shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4 p-4 bg-white">Berthoud Location</h3>
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3041.356833950407!2d-105.08272992336351!3d40.30844067153222!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x876eadbb4c0e7ea1%3A0x8c2b4be564267d53!2s950%20Mountain%20Ave%2C%20Berthoud%2C%20CO%2080513!5e0!3m2!1sen!2sus!4v1687966875305!5m2!1sen!2sus" 
                width="100%" 
                height="400" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="La Casita Berthoud Location Map"
              />
            </div>
            
            {/* Fort Collins Map */}
            <div className="rounded-lg overflow-hidden shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4 p-4 bg-white">Fort Collins Location</h3>
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3037.990356438717!2d-105.00561792336071!3d40.38899697143048!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x87694a98795eb76d%3A0xc9a618f4c4fd8f79!2s2909%20E%20Harmony%20Rd%2C%20Fort%20Collins%2C%20CO%2080528!5e0!3m2!1sen!2sus!4v1687966990305!5m2!1sen!2sus" 
                width="100%" 
                height="400" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="La Casita Fort Collins Location Map"
              />
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
    </div>
  );
}
