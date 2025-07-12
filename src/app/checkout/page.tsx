'use client';

import { useCart } from '@/lib/cart-context';
import { useState, useEffect } from 'react';
import { CustomerInfo } from '@/lib/types';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { buttonStyles } from '@/lib/button-styles';
import Image from 'next/image';
import { createClient } from '@/lib/supabaseClient';
import { User } from '@supabase/supabase-js';
import SquarePaymentForm from '@/components/SquarePaymentForm';

export default function CheckoutPage() {
  const router = useRouter();
  const { state, clearCart } = useCart();
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '',
    email: '',
    phone: '',
    specialInstructions: '',
  });
  const [loading, setLoading] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  // Only online payment is available
  const paymentMethod = 'online';
  
  // Check authentication state when component loads
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        setIsLoggedIn(true);
        
        // If user is logged in, try to fetch their profile data
        try {
          const { data: customer } = await supabase
            .from('customers')
            .select('name, email, phone')
            .eq('auth_id', session.user.id)
            .single();
            
          if (customer) {
            // Pre-fill the customer info form
            setCustomerInfo(prev => ({
              ...prev,
              name: customer.name || '',
              email: customer.email || session.user?.email || '',
              phone: customer.phone || ''
            }));
          }
        } catch (error) {
          console.warn('Could not fetch customer profile:', error);
        }
      } else {
        setUser(null);
        setIsLoggedIn(false);
      }
    };
    
    checkAuth();
  }, [supabase]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCustomerInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProceedToPayment = () => {
    // Validate customer info
    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone) {
      setPaymentError('Please fill in all required customer information');
      return;
    }
    
    // Check if we have items in the cart
    if (!state.items.length) {
      setPaymentError('Your cart is empty');
      return;
    }
    
    setPaymentError(null);
    setShowPaymentForm(true);
  };

  const handlePaymentSuccess = async (paymentResult: any) => {
    console.log('Payment successful:', paymentResult);
    setPaymentSuccess(true);
    
    // Clear the cart
    clearCart();
    
    // Redirect to success page
    setTimeout(() => {
      router.push(`/order-confirmation?payment_id=${paymentResult.paymentId}&status=success`);
    }, 2000);
  };

  const handlePaymentError = (error: string) => {
    setPaymentError(error);
    setShowPaymentForm(false);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    handleProceedToPayment();
  };

  return (
    <div className="bg-white">
      <div className="bg-gradient-to-b from-white to-gray-50 py-12">
        <div className="mx-auto max-w-lg px-4 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-red-600">Complete Your Order</h1>

          <div className="mt-8">
            {!isLoggedIn ? (
              <div className="rounded-md bg-blue-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">
                      Already have an account?
                    </h3>
                    <div className="mt-2 text-sm text-blue-700">
                      <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500 underline">
                        Sign in to your account
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-md bg-green-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800">
                      Signed in as {user?.email}
                    </h3>
                    <div className="mt-1 text-sm text-green-700">
                      Your information has been pre-filled for a faster checkout.
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="mt-6">
            <div className="space-y-8">
              {/* Order Summary */}
              <div className="py-6">
                <h2 className="text-lg font-medium text-gray-900">Order Summary</h2>
                <div className="mt-4 space-y-4">
                  {state.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-full w-full object-cover object-center"
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-base font-medium text-gray-900">{item.name}</div>
                          <div className="text-sm text-gray-500">Qty {item.quantity}</div>
                        </div>
                      </div>
                      <p className="text-sm font-medium text-gray-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="mt-6 space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <p>Subtotal</p>
                    <p>${state.subtotal.toFixed(2)}</p>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <p>Tax</p>
                    <p>${state.tax.toFixed(2)}</p>
                  </div>
                  <div className="flex justify-between text-base font-medium text-gray-900">
                    <p>Total</p>
                    <p>${state.total.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              {/* Customer Information */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-bold text-gray-900 border-b pb-2 mb-4">Customer Information</h3>
                <div className="space-y-5">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={customerInfo.name}
                        onChange={handleInputChange}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm px-4 py-3"
                        placeholder="Your full name"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-1">
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={customerInfo.email}
                        onChange={handleInputChange}
                        required
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm px-4 py-3"
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                      Phone <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-1">
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={customerInfo.phone}
                        onChange={handleInputChange}
                        required
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm px-4 py-3"
                        placeholder="(555) 555-5555"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="instructions" className="block text-sm font-medium text-gray-700">
                      Special Instructions
                    </label>
                    <textarea
                      id="instructions"
                      name="specialInstructions"
                      value={customerInfo.specialInstructions || ''}
                      onChange={handleInputChange}
                      rows={3}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm px-4 py-3"
                      placeholder="Any special requests or notes for your order?"
                    />
                  </div>
                </div>
              </div>

              {/* Payment */}
              <div className="py-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h2 className="text-lg font-bold text-gray-900 border-b pb-2 mb-4">Payment</h2>
                  
                  {/* Payment Method Information */}
                  <div className="mt-6">
                    <h3 className="text-base font-medium text-gray-900 mb-2">Payment Method</h3>
                    
                    {/* Online Payment Info */}
                    <div className="flex items-center mb-4">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600 mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                      </div>
                      <div className="flex-1 border border-blue-500 bg-blue-50 rounded-md p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-sm font-medium">Pay Online with Square</div>
                            <div className="text-xs text-gray-500">Secure payment via credit/debit card</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {!showPaymentForm && !paymentSuccess && (
                    <>
                      <div className="rounded-md border border-gray-300 px-4 py-3 mt-6">
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-medium text-gray-600">
                            Pay now with Square
                          </div>
                          <div className="text-lg font-medium text-gray-900">${state.total.toFixed(2)}</div>
                        </div>
                        <p className="mt-2 text-sm text-gray-500">
                          Enter your card details securely below.
                        </p>
                      </div>
                      
                      {/* Error message display */}
                      {paymentError && (
                        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                          <p className="text-sm text-red-600 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {paymentError}
                          </p>
                        </div>
                      )}
                      
                      <button
                        type="submit"
                        disabled={loading || isProcessingPayment}
                        className={`${buttonStyles.primary} ${buttonStyles.fullWidth} ${(loading || isProcessingPayment) ? buttonStyles.disabled : ''} mt-4`}
                      >
                        {loading || isProcessingPayment ? 'Processing...' : 'Continue to Payment'}
                      </button>
                    </>
                  )}
                  
                  {showPaymentForm && !paymentSuccess && (
                    <div className="mt-6">
                      <SquarePaymentForm
                        orderDetails={{
                          items: state.items.map(item => ({
                            ...item,
                            name: item.name || 'Menu Item',
                            price: item.price || 0,
                            quantity: item.quantity || 1,
                            location: item.location || 'Main',
                          })),
                          subtotal: state.subtotal,
                          tax: state.tax,
                          total: state.total,
                          customerInfo,
                        }}
                        onPaymentSuccess={handlePaymentSuccess}
                        onPaymentError={handlePaymentError}
                        isProcessing={isProcessingPayment}
                        setIsProcessing={setIsProcessingPayment}
                      />
                      
                      <button
                        onClick={() => setShowPaymentForm(false)}
                        className="w-full mt-4 py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Back to Order Details
                      </button>
                    </div>
                  )}
                  
                  {paymentSuccess && (
                    <div className="mt-6 p-6 bg-green-50 border border-green-200 rounded-md text-center">
                      <div className="flex items-center justify-center mb-4">
                        <svg className="h-12 w-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium text-green-900 mb-2">Payment Successful!</h3>
                      <p className="text-sm text-green-700">Redirecting to confirmation page...</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}