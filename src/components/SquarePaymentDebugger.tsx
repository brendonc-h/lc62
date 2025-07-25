'use client';

import { useState, useEffect } from 'react';

interface DebugInfo {
  squareSDKLoaded: boolean;
  environmentVars: {
    appId: string;
    locationId: string;
    environment: string;
  };
  cardInstance: boolean;
  buttonState: {
    isInitialized: boolean;
    isProcessing: boolean;
    canClick: boolean;
  };
  networkStatus: string;
  lastError: string | null;
}

interface SquarePaymentDebuggerProps {
  isInitialized: boolean;
  isProcessing: boolean;
  card: any;
  onTestPayment: () => void;
}

export default function SquarePaymentDebugger({
  isInitialized,
  isProcessing,
  card,
  onTestPayment
}: SquarePaymentDebuggerProps) {
  const [debugInfo, setDebugInfo] = useState<DebugInfo>({
    squareSDKLoaded: false,
    environmentVars: {
      appId: '',
      locationId: '',
      environment: ''
    },
    cardInstance: false,
    buttonState: {
      isInitialized: false,
      isProcessing: false,
      canClick: false
    },
    networkStatus: 'Unknown',
    lastError: null
  });

  const [showDebugger, setShowDebugger] = useState(false);

  useEffect(() => {
    const updateDebugInfo = () => {
      const canClick = isInitialized && !isProcessing && !!card;
      
      setDebugInfo({
        squareSDKLoaded: !!window.Square,
        environmentVars: {
          appId: process.env.NEXT_PUBLIC_SQUARE_APP_ID?.slice(0, 10) + '...' || 'Missing',
          locationId: process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID?.slice(0, 10) + '...' || 'Missing',
          environment: process.env.NODE_ENV || 'Unknown'
        },
        cardInstance: !!card,
        buttonState: {
          isInitialized,
          isProcessing,
          canClick
        },
        networkStatus: navigator.onLine ? 'Online' : 'Offline',
        lastError: null
      });
    };

    updateDebugInfo();
    
    // Update debug info every second
    const interval = setInterval(updateDebugInfo, 1000);
    
    return () => clearInterval(interval);
  }, [isInitialized, isProcessing, card]);

  const testSquareConnection = async () => {
    try {
      console.log('=== SQUARE CONNECTION TEST ===');
      console.log('Square SDK loaded:', !!window.Square);
      console.log('App ID:', process.env.NEXT_PUBLIC_SQUARE_APP_ID?.slice(0, 10) + '...');
      console.log('Location ID:', process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID?.slice(0, 10) + '...');
      console.log('Card instance:', !!card);
      console.log('Is initialized:', isInitialized);
      console.log('Is processing:', isProcessing);
      
      if (card) {
        console.log('Testing card tokenization...');
        const tokenResult = await card.tokenize();
        console.log('Tokenization result:', tokenResult);
      }
    } catch (error) {
      console.error('Square connection test failed:', error);
    }
  };

  const generateTestOrder = () => {
    return {
      items: [
        { name: 'TEST Taco', quantity: 2, price: 4.99 },
        { name: 'TEST Burrito', quantity: 1, price: 12.99 }
      ],
      total: 22.97,
      customerInfo: {
        name: 'Test Customer',
        email: 'test@example.com',
        phone: '555-0123',
        specialInstructions: 'TEST ORDER - DO NOT FULFILL'
      }
    };
  };

  if (!showDebugger) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setShowDebugger(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700"
        >
          Debug Square
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white border border-gray-300 rounded-lg shadow-lg p-4 max-w-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Square Payment Debug</h3>
        <button
          onClick={() => setShowDebugger(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>

      <div className="space-y-3 text-sm">
        <div className="grid grid-cols-2 gap-2">
          <div className="font-medium">Square SDK:</div>
          <div className={debugInfo.squareSDKLoaded ? 'text-green-600' : 'text-red-600'}>
            {debugInfo.squareSDKLoaded ? '✓ Loaded' : '✗ Not Loaded'}
          </div>

          <div className="font-medium">Card Instance:</div>
          <div className={debugInfo.cardInstance ? 'text-green-600' : 'text-red-600'}>
            {debugInfo.cardInstance ? '✓ Ready' : '✗ Not Ready'}
          </div>

          <div className="font-medium">Initialized:</div>
          <div className={debugInfo.buttonState.isInitialized ? 'text-green-600' : 'text-red-600'}>
            {debugInfo.buttonState.isInitialized ? '✓ Yes' : '✗ No'}
          </div>

          <div className="font-medium">Processing:</div>
          <div className={debugInfo.buttonState.isProcessing ? 'text-yellow-600' : 'text-green-600'}>
            {debugInfo.buttonState.isProcessing ? '⏳ Yes' : '✓ No'}
          </div>

          <div className="font-medium">Can Click:</div>
          <div className={debugInfo.buttonState.canClick ? 'text-green-600' : 'text-red-600'}>
            {debugInfo.buttonState.canClick ? '✓ Yes' : '✗ No'}
          </div>

          <div className="font-medium">Network:</div>
          <div className={debugInfo.networkStatus === 'Online' ? 'text-green-600' : 'text-red-600'}>
            {debugInfo.networkStatus}
          </div>
        </div>

        <div className="border-t pt-3">
          <div className="font-medium mb-2">Environment:</div>
          <div className="text-xs space-y-1">
            <div>App ID: {debugInfo.environmentVars.appId}</div>
            <div>Location: {debugInfo.environmentVars.locationId}</div>
            <div>Env: {debugInfo.environmentVars.environment}</div>
          </div>
        </div>

        <div className="border-t pt-3 space-y-2">
          <button
            onClick={testSquareConnection}
            className="w-full bg-blue-600 text-white py-2 px-3 rounded text-sm hover:bg-blue-700"
          >
            Test Square Connection
          </button>
          
          <button
            onClick={() => {
              const testOrder = generateTestOrder();
              console.log('Generated test order:', testOrder);
            }}
            className="w-full bg-green-600 text-white py-2 px-3 rounded text-sm hover:bg-green-700"
          >
            Generate Test Order
          </button>

          <button
            onClick={onTestPayment}
            disabled={!debugInfo.buttonState.canClick}
            className="w-full bg-red-600 text-white py-2 px-3 rounded text-sm hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Test Payment Flow
          </button>
        </div>
      </div>
    </div>
  );
}
