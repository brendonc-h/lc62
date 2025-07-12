'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { buttonStyles } from '@/lib/button-styles';

function PaymentReturnContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [orderId, setOrderId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const checkPaymentStatus = async () => {
      try {
        // Get stored payment ID and order details from localStorage
        const paymentId = localStorage.getItem('pendingSquarePaymentId');
        const orderDetailsStr = localStorage.getItem('pendingOrderDetails');
        
        if (!paymentId || !orderDetailsStr) {
          throw new Error('Payment information not found');
        }

        // Status from Square redirect
        const status = searchParams.get('status');
        
        if (status === 'success') {
          // Submit order to our backend
          const orderDetails = JSON.parse(orderDetailsStr);
          const response = await fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ...orderDetails,
              paymentMethod: 'online',
              paymentId,
              paymentStatus: 'completed',
            }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to complete order');
          }

          const data = await response.json();
          setOrderId(data.id);
          setStatus('success');
          
          // Clear the pending payment data
          localStorage.removeItem('pendingSquarePaymentId');
          localStorage.removeItem('pendingOrderDetails');
        } else {
          // Payment failed or was cancelled
          setStatus('error');
          setError('The payment was not completed or was cancelled.');
        }
      } catch (err) {
        console.error('Payment return error:', err);
        setStatus('error');
        setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      }
    };

    checkPaymentStatus();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <img
          className="mx-auto h-20 w-auto"
          src="/logo.png"
          alt="La Casita"
        />
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {status === 'loading' && 'Processing Payment...'}
          {status === 'success' && 'Payment Successful!'}
          {status === 'error' && 'Payment Issue'}
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {status === 'loading' && (
            <div className="flex flex-col items-center justify-center py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
              <p className="mt-4 text-center text-gray-700">
                Please wait while we process your payment...
              </p>
            </div>
          )}

          {status === 'success' && (
            <div className="space-y-6">
              <div className="rounded-md bg-green-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <CheckCircleIcon className="h-5 w-5 text-green-400" aria-hidden="true" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800">Payment Complete</h3>
                    <div className="mt-2 text-sm text-green-700">
                      <p>Your order has been successfully placed!</p>
                      {orderId && (
                        <p className="font-medium mt-1">Order #{orderId}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-sm text-center text-gray-600">
                <p>
                  We've sent a confirmation email with your order details.
                  Your order is now being prepared.
                </p>
              </div>

              <div>
                <Link href="/menu" className={buttonStyles.primary + ' ' + buttonStyles.fullWidth}>
                  Return to Menu
                </Link>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="space-y-6">
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Payment Issue</h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>{error || 'There was an issue processing your payment.'}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-sm text-center text-gray-600">
                <p>
                  You have not been charged. Please try again or choose a different payment method.
                </p>
              </div>

              <div>
                <Link href="/checkout" className={buttonStyles.primary + ' ' + buttonStyles.fullWidth}>
                  Return to Checkout
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function PaymentReturnPage() {
  return (
    <Suspense fallback={<PaymentReturnFallback />}>
      <PaymentReturnContent />
    </Suspense>
  );
}

function PaymentReturnFallback() {
  return (
    <div className="min-h-screen bg-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <img
          className="mx-auto h-20 w-auto"
          src="/logo.png"
          alt="La Casita"
        />
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Processing Payment...
        </h2>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="flex flex-col items-center justify-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            <p className="mt-4 text-center text-gray-700">
              Please wait...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
