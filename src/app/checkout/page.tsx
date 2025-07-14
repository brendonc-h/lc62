'use client';

import { useCart } from '@/lib/cart-context';
import { useState, useEffect } from 'react';
import { CustomerInfo, OrderDetails } from '@/lib/types';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { buttonStyles } from '@/lib/button-styles';
import Image from 'next/image';
import { createClient } from '@/lib/supabaseClient';
import { User } from '@supabase/supabase-js';
import SquarePaymentForm from '@/components/SquarePaymentForm';
import { checkOrderHours, getOrderStatusMessage, isCloseToClosing } from '@/lib/order-hours';

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
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [orderHours, setOrderHours] = useState(checkOrderHours());
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

  // Check order hours periodically
  useEffect(() => {
    const checkHours = () => {
      setOrderHours(checkOrderHours());
    };

    // Check immediately
    checkHours();

    // Check every minute
    const interval = setInterval(checkHours, 60000);

    return () => clearInterval(interval);
  }, []);

  // Phone number formatting function
  const formatPhoneNumber = (value: string) => {
    // Remove all non-numeric characters
    const phoneNumber = value.replace(/\D/g, '');

    // Format as (XXX) XXX-XXXX
    if (phoneNumber.length === 0) return '';
    if (phoneNumber.length <= 3) return `(${phoneNumber}`;
    if (phoneNumber.length <= 6) return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
  };

  // Validation functions
  const validateField = (name: string, value: string) => {
    const errors: {[key: string]: string} = {};

    switch (name) {
      case 'name':
        if (!value.trim()) errors.name = 'Name is required';
        else if (value.trim().length < 2) errors.name = 'Name must be at least 2 characters';
        break;
      case 'email':
        if (!value.trim()) errors.email = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) errors.email = 'Please enter a valid email address';
        break;
      case 'phone':
        const phoneDigits = value.replace(/\D/g, '');
        if (!phoneDigits) errors.phone = 'Phone number is required';
        else if (phoneDigits.length !== 10) errors.phone = 'Please enter a valid 10-digit phone number';
        break;
    }

    return errors;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    // Clear previous error for this field
    setFormErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[name];
      return newErrors;
    });

    // Special handling for phone number formatting
    if (name === 'phone') {
      const formattedPhone = formatPhoneNumber(value);
      setCustomerInfo((prev) => ({
        ...prev,
        [name]: formattedPhone,
      }));

      // Validate phone number
      const phoneErrors = validateField(name, formattedPhone);
      if (Object.keys(phoneErrors).length > 0) {
        setFormErrors(prev => ({ ...prev, ...phoneErrors }));
      }
    } else {
      setCustomerInfo((prev) => ({
        ...prev,
        [name]: value,
      }));

      // Validate other fields
      const fieldErrors = validateField(name, value);
      if (Object.keys(fieldErrors).length > 0) {
        setFormErrors(prev => ({ ...prev, ...fieldErrors }));
      }
    }
  };

  const handleProceedToPayment = () => {
    // Check if orders are still open
    const currentOrderHours = checkOrderHours();
    if (!currentOrderHours.isOpen) {
      setPaymentError('Sorry, orders are currently closed. We stop taking orders at 6:30 PM daily.');
      return;
    }

    // Validate customer info
    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone) {
      setPaymentError('Please fill in all required customer information');
      return;
    }

    // Validate phone number format (should have 10 digits)
    const phoneDigits = customerInfo.phone.replace(/\D/g, '');
    if (phoneDigits.length !== 10) {
      setPaymentError('Please enter a valid 10-digit phone number');
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

    try {
      // Create order in our database
      const orderData = {
        items: state.items,
        subtotal: state.subtotal,
        tax: state.tax,
        total: state.total,
        customerInfo,
        paymentMethod: 'square',
        paymentId: paymentResult.paymentId,
        paymentStatus: 'completed'
      };

      console.log('Creating order in database:', orderData);

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Failed to create order:', errorData);
        throw new Error(errorData.error || 'Failed to create order');
      }

      const orderResult = await response.json();
      console.log('Order created successfully:', orderResult);

      // Clear the cart
      clearCart();

      // Redirect to success page with order ID
      setTimeout(() => {
        router.push(`/order-confirmation?order_id=${orderResult.orderId}&payment_id=${paymentResult.paymentId}&status=success`);
      }, 2000);

    } catch (error) {
      console.error('Error creating order:', error);
      setPaymentError('Payment successful but failed to create order. Please contact support.');
    }
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

          {/* Order Hours Status */}
          <div className={`mt-6 rounded-md p-4 ${orderHours.isOpen ?
            (isCloseToClosing() ? 'bg-yellow-50 border border-yellow-200' : 'bg-green-50 border border-green-200') :
            'bg-red-50 border border-red-200'
          }`}>
            <div className="flex">
              <div className="flex-shrink-0">
                {orderHours.isOpen ? (
                  isCloseToClosing() ? (
                    <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )
                ) : (
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <div className="ml-3">
                <p className={`text-sm font-medium ${orderHours.isOpen ?
                  (isCloseToClosing() ? 'text-yellow-800' : 'text-green-800') :
                  'text-red-800'
                }`}>
                  {getOrderStatusMessage()}
                </p>
                {!orderHours.isOpen && orderHours.nextOpenTime && (
                  <p className="mt-1 text-sm text-red-700">{orderHours.nextOpenTime}</p>
                )}
              </div>
            </div>
          </div>

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
                      <Link href="/auth/signin?callbackUrl=/checkout" className="font-medium text-blue-600 hover:text-blue-500 underline">
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
                        className={`block w-full rounded-md shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm px-4 py-3 ${
                          formErrors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                        placeholder="Your full name"
                      />
                      {formErrors.name && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
                      )}
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
                        className={`block w-full rounded-md shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm px-4 py-3 ${
                          formErrors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                        placeholder="you@example.com"
                      />
                      {formErrors.email && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
                      )}
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
                        className={`block w-full rounded-md shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm px-4 py-3 ${
                          formErrors.phone ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                        placeholder="(555) 555-5555"
                      />
                      {formErrors.phone && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.phone}</p>
                      )}
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
                        disabled={loading || isProcessingPayment || !orderHours.isOpen}
                        className={`${buttonStyles.primary} ${buttonStyles.fullWidth} ${(loading || isProcessingPayment || !orderHours.isOpen) ? buttonStyles.disabled : ''} mt-4 flex items-center justify-center`}
                      >
                        {(loading || isProcessingPayment) && (
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        )}
                        {!orderHours.isOpen ? 'Orders Closed' : (loading || isProcessingPayment ? 'Processing...' : 'Continue to Payment')}
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
                        } as OrderDetails}
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