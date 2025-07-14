'use client';

import { useState, useEffect, useRef } from 'react';
import { OrderDetails } from '@/lib/types';

interface SquarePaymentFormProps {
  orderDetails: OrderDetails;
  onPaymentSuccess: (result: any) => void;
  onPaymentError: (error: string) => void;
  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;
}

export default function SquarePaymentForm({
  orderDetails,
  onPaymentSuccess,
  onPaymentError,
  isProcessing,
  setIsProcessing,
}: SquarePaymentFormProps) {
  const [card, setCard] = useState<any>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const containerId = useRef(`card-container-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
  const containerIdValue = containerId.current;

  // Initialize Square payment form
  useEffect(() => {
    if (isInitialized) return;

    const initializeSquare = async () => {
      console.log('Initializing Square payment form...');
      
      try {
        // Wait for Square SDK to load
        let attempts = 0;
        const maxAttempts = 50;
        
        while (!window.Square && attempts < maxAttempts) {
          console.log(`Waiting for Square SDK... attempt ${attempts + 1}`);
          await new Promise(resolve => setTimeout(resolve, 100));
          attempts++;
        }
        
        if (!window.Square) {
          throw new Error('Square SDK failed to load');
        }
        
        const appId = process.env.NEXT_PUBLIC_SQUARE_APP_ID;
        const locationId = process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID;
        
        if (!appId || !locationId) {
          throw new Error('Square configuration missing');
        }
        
        console.log('Creating Square payments instance...');
        const payments = window.Square.payments(appId, locationId);
        
        console.log('Creating card instance...');
        const cardInstance = await payments.card({
          style: {
            input: {
              fontSize: '16px',
              fontFamily: 'Arial, sans-serif',
              color: '#333',
            },
            '.input-container': {
              borderColor: '#d1d5db',
              borderRadius: '6px',
            },
            '.input-container.is-focus': {
              borderColor: '#dc2626',
            },
            '.input-container.is-error': {
              borderColor: '#ef4444',
            },
          },
        });
        
        console.log('Attaching card to container:', containerIdValue);
        await cardInstance.attach(`#${containerIdValue}`);
        
        // Add event listeners for debugging
        cardInstance.addEventListener('cardBrandChanged', (event: any) => {
          console.log('Card brand changed:', event.cardBrand);
        });
        
        cardInstance.addEventListener('errorClassAdded', (event: any) => {
          console.log('Error class added:', event);
        });
        
        cardInstance.addEventListener('errorClassRemoved', (event: any) => {
          console.log('Error class removed:', event);
        });
        
        cardInstance.addEventListener('focusClassAdded', (event: any) => {
          console.log('Focus class added:', event);
        });
        
        cardInstance.addEventListener('focusClassRemoved', (event: any) => {
          console.log('Focus class removed:', event);
        });
        
        console.log('Square initialized successfully');
        setCard(cardInstance);
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize Square:', error);
        onPaymentError('Failed to initialize payment form. Please refresh and try again.');
      }
    };

    initializeSquare();

    // Cleanup on unmount
    return () => {
      if (card) {
        try {
          card.destroy();
        } catch (error) {
          console.warn('Error destroying card:', error);
        }
      }
    };
  }, [onPaymentError, isInitialized, containerIdValue, card]);

  const handlePayment = async () => {
    if (!card) {
      onPaymentError('Payment form not initialized');
      return;
    }

    setIsProcessing(true);

    try {
      console.log('Tokenizing card...');
      const tokenResult = await card.tokenize();
      
      if (tokenResult.status === 'OK') {
        console.log('Card tokenized successfully:', tokenResult.token);
        
        // Process payment with backend
        const response = await fetch('/api/square-payment-direct', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            token: tokenResult.token,
            orderDetails,
          }),
        });

        const result = await response.json();

        if (response.ok && result.success) {
          console.log('Payment processed successfully:', result);
          onPaymentSuccess(result);
        } else {
          console.error('Payment processing failed:', result);
          onPaymentError(result.error || 'Payment processing failed');
        }
      } else {
        console.error('Card tokenization failed:', tokenResult.errors);
        const errorMessage = tokenResult.errors?.[0]?.detail || 'Card validation failed';
        onPaymentError(errorMessage);
      }
    } catch (error) {
      console.error('Payment error:', error);
      onPaymentError('Payment processing failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-white p-6 rounded-lg border">
        <h3 className="text-lg font-semibold mb-4">Payment Information</h3>
        
        {/* Square card input container */}
        <div 
          id={containerIdValue}
          className="mb-4 p-3 border rounded-md"
          style={{ minHeight: '40px' }}
        />
        
        {!isInitialized && (
          <div className="text-sm text-gray-500 mb-4">
            Loading payment form...
          </div>
        )}
        
        <button
          onClick={handlePayment}
          disabled={!isInitialized || isProcessing}
          className="w-full bg-red-600 text-white py-3 px-4 rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? 'Processing...' : `Pay $${orderDetails.total.toFixed(2)}`}
        </button>
      </div>
    </div>
  );
}
