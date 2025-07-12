'use client';

import React from 'react';
import Link from 'next/link';

export default function TermsOfUse() {
  return (
    <div className="min-h-screen bg-white pt-16 pb-12">
      {/* Terms of Use Header */}
      <div className="relative py-16 bg-gradient-to-r from-red-600 to-orange-500">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight text-white text-center sm:text-5xl lg:text-6xl">
            Terms of Use
          </h1>
          <p className="mt-6 max-w-3xl mx-auto text-xl text-white text-center">
            Guidelines for using our services
          </p>
        </div>
      </div>

      {/* Terms of Use Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="prose prose-lg prose-red mx-auto">
          <h2>Acceptance of Terms</h2>
          <p>
            By accessing or using the La Casita Restaurant website and mobile application (collectively, the "Services"), you agree to be bound by these Terms of Use. If you do not agree to these terms, please do not use our Services.
          </p>

          <h2>Use of Services</h2>
          <p>
            La Casita Restaurant grants you a personal, non-exclusive, non-transferable, limited license to use our Services for personal, non-commercial purposes in accordance with these Terms of Use.
          </p>
          <p>You agree not to:</p>
          <ul>
            <li>Use our Services in any way that violates any applicable local, state, national, or international law</li>
            <li>Use our Services for any unauthorized or illegal purpose</li>
            <li>Attempt to gain unauthorized access to any portion of our Services</li>
            <li>Interfere with or disrupt the operation of our Services or servers</li>
            <li>Impersonate or attempt to impersonate La Casita Restaurant, an employee, another user, or any other person or entity</li>
            <li>Engage in any conduct that restricts or inhibits anyone's use or enjoyment of our Services</li>
          </ul>

          <h2>User Accounts</h2>
          <p>
            When you create an account with us, you must provide information that is accurate, complete, and current at all times. You are responsible for maintaining the confidentiality of your account and password and for restricting access to your device.
          </p>
          <p>
            You agree to accept responsibility for all activities that occur under your account. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.
          </p>

          <h2>Online Orders and Payments</h2>
          <p>
            When you place an order through our Services, you agree to provide current, complete, and accurate information for all orders. We reserve the right to refuse any order you place with us for any reason, including but not limited to product unavailability, errors in pricing or product information, or suspected fraudulent activity.
          </p>
          <p>
            Payment for all orders must be made at the time of purchase. We use third-party payment processors to process payments, and your use of these services is subject to their terms and conditions.
          </p>

          <h2>Intellectual Property</h2>
          <p>
            The content on our Services, including but not limited to text, graphics, logos, images, and software, is the property of La Casita Restaurant or its content suppliers and is protected by United States and international copyright, trademark, and other intellectual property laws.
          </p>
          <p>
            You may not reproduce, distribute, modify, create derivative works of, publicly display, publicly perform, republish, download, store, or transmit any of the material on our Services without our prior written consent.
          </p>

          <h2>Disclaimer of Warranties</h2>
          <p>
            OUR SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE," WITHOUT ANY WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. TO THE FULLEST EXTENT PERMITTED BY LAW, LA CASITA RESTAURANT DISCLAIMS ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
          </p>

          <h2>Limitation of Liability</h2>
          <p>
            TO THE FULLEST EXTENT PERMITTED BY LAW, LA CASITA RESTAURANT SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM YOUR ACCESS TO OR USE OF OR INABILITY TO ACCESS OR USE THE SERVICES.
          </p>

          <h2>Indemnification</h2>
          <p>
            You agree to defend, indemnify, and hold harmless La Casita Restaurant, its affiliates, and their respective officers, directors, employees, contractors, agents, licensors, and suppliers from and against any claims, liabilities, damages, judgments, awards, losses, costs, expenses, or fees (including reasonable attorneys' fees) arising out of or relating to your violation of these Terms of Use or your use of the Services.
          </p>

          <h2>Changes to Terms</h2>
          <p>
            We reserve the right to modify or replace these Terms of Use at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
          </p>

          <h2>Governing Law</h2>
          <p>
            These Terms of Use and your use of the Services shall be governed by and construed in accordance with the laws of the State of Colorado, without regard to its conflict of law provisions.
          </p>

          <h2>Contact Us</h2>
          <p>
            If you have any questions about these Terms of Use, please contact us at:
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
