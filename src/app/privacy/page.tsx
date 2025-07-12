'use client';

import React from 'react';
import Link from 'next/link';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white pt-16 pb-12">
      {/* Privacy Policy Header */}
      <div className="relative py-16 bg-gradient-to-r from-red-600 to-orange-500">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight text-white text-center sm:text-5xl lg:text-6xl">
            Privacy Policy
          </h1>
          <p className="mt-6 max-w-3xl mx-auto text-xl text-white text-center">
            How we handle and protect your information
          </p>
        </div>
      </div>

      {/* Privacy Policy Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="prose prose-lg prose-red mx-auto">
          <h2>Introduction</h2>
          <p>
            This Privacy Policy explains how La Casita Restaurant ("we," "our," or "us") collects, uses, and shares information about you when you use our website, mobile applications, or other online services (collectively, the "Services").
          </p>
          <p>
            By using our Services, you agree to the collection, use, and sharing of your information as described in this Privacy Policy. If you do not agree with our policies and practices, do not use our Services.
          </p>

          <h2>Information We Collect</h2>
          <p>We may collect the following types of information:</p>
          <ul>
            <li>
              <strong>Personal Information:</strong> When you create an account, place an order, or contact us, we collect information such as your name, email address, phone number, and delivery address.
            </li>
            <li>
              <strong>Order Information:</strong> When you place an order, we collect details about the items ordered, payment method, special instructions, and order history.
            </li>
            <li>
              <strong>Payment Information:</strong> When you make a purchase, payment information is processed by our third-party payment processors. We do not store complete credit card information on our servers.
            </li>
            <li>
              <strong>Usage Information:</strong> We collect information about how you interact with our Services, including the pages you visit, the time and date of your visit, and other analytics data.
            </li>
            <li>
              <strong>Device Information:</strong> We may collect information about the device you use to access our Services, including the hardware model, operating system, and browser type.
            </li>
          </ul>

          <h2>How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Process and fulfill your orders</li>
            <li>Create and manage your account</li>
            <li>Communicate with you about your orders, account, or requests</li>
            <li>Send promotional communications, such as special offers or promotions (if you have opted in)</li>
            <li>Improve our Services and develop new features</li>
            <li>Detect and prevent fraudulent activity and other misuse of our Services</li>
            <li>Comply with legal obligations</li>
          </ul>

          <h2>Sharing Your Information</h2>
          <p>We may share your information with:</p>
          <ul>
            <li>
              <strong>Service Providers:</strong> We share information with third-party service providers who perform services on our behalf, such as payment processing, data analysis, email delivery, hosting, and customer service.
            </li>
            <li>
              <strong>Legal Requirements:</strong> We may disclose information if required to do so by law or in response to valid requests by public authorities.
            </li>
            <li>
              <strong>Business Transfers:</strong> If we are involved in a merger, acquisition, or sale of all or a portion of our assets, your information may be transferred as part of that transaction.
            </li>
          </ul>

          <h2>Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to protect the security of your personal information. However, no method of transmission over the Internet or method of electronic storage is 100% secure, and we cannot guarantee absolute security.
          </p>

          <h2>Your Choices</h2>
          <p>
            You may access, update, or delete your account information at any time by logging into your account or contacting us directly. You may also opt-out of receiving promotional communications from us by following the instructions in those communications.
          </p>

          <h2>Children's Privacy</h2>
          <p>
            Our Services are not intended for children under 13 years of age, and we do not knowingly collect personal information from children under 13.
          </p>

          <h2>Changes to This Privacy Policy</h2>
          <p>
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
          </p>

          <h2>Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at:
          </p>
          <p>
            Email: <a href="mailto:info@lacasita.io" className="text-red-500 hover:text-red-700">info@lacasita.io</a><br />
            Phone: (970) 555-1234
          </p>

          <div className="mt-8">
            <p className="text-gray-500 text-sm">Last Updated: June 1, 2023</p>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Link 
            href="/about" 
            className="inline-flex items-center justify-center px-6 py-3 border border-red-500 text-red-500 font-medium rounded-md hover:bg-red-50 transition-colors"
          >
            Back to About Us
          </Link>
        </div>
      </div>
    </div>
  );
}
