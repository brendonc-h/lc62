// Add this to ensure we can detect client vs server environment
const isServer = typeof window === 'undefined';

// Dynamic import for Square SDK to handle potential issues
let Client: any = null;
let Environment: any = null;

if (isServer) {
  try {
    const squareSDK = require('square');
    Client = squareSDK.Client;
    Environment = squareSDK.Environment;
    console.log('Square SDK loaded:', { hasClient: !!Client, hasEnvironment: !!Environment });
  } catch (error) {
    console.error('Failed to load Square SDK:', error);
  }
}

// Helper function to generate a unique idempotency key
export const generateIdempotencyKey = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
};

// Mock data for client-side and development
const mockPayment = {
  id: 'mock-payment-id',
  status: 'COMPLETED',
  amountMoney: {
    amount: 1000,
    currency: 'USD',
  }
};

const mockOrder = {
  id: 'mock-order-id',
  state: 'COMPLETED',
  totalMoney: {
    amount: 1000,
    currency: 'USD',
  }
};

// Only initialize the client on the server side
// This prevents issues with client-side rendering
let client: any = null;

if (isServer && Client && Environment) {
  try {
    const accessToken = process.env.SQUARE_ACCESS_TOKEN;
    const locationId = process.env.SQUARE_LOCATION_ID;
    
    console.log('Square environment check:', {
      hasAccessToken: !!accessToken,
      hasLocationId: !!locationId,
      nodeEnv: process.env.NODE_ENV,
      environment: process.env.NODE_ENV === 'production' ? 'Production' : 'Sandbox',
      hasClient: !!Client,
      hasEnvironment: !!Environment
    });
    
    if (!accessToken) {
      throw new Error('SQUARE_ACCESS_TOKEN environment variable is missing');
    }
    
    if (!locationId) {
      throw new Error('SQUARE_LOCATION_ID environment variable is missing');
    }
    
    client = new Client({
      accessToken: accessToken,
      environment: process.env.NODE_ENV === 'production' ? Environment.Production : Environment.Sandbox,
    });
    
    console.log('Square client initialized successfully');
  } catch (error) {
    console.error('Failed to initialize Square client:', error);
  }
} else if (isServer) {
  console.error('Square SDK not properly loaded - Client or Environment is missing');
}

// Add type safety layers to make integration smoother
export const squareClient = {
  // Payment API for processing payments
  paymentsApi: {
    // Retrieve payment details
    getPayment: async (paymentId: string) => {
      if (!isServer) {
        console.warn('Square API can only be called server-side. Returning mock data.');
        return { result: { payment: mockPayment } };
      }
      
      try {
        if (!client) {
          throw new Error('Square client not initialized');
        }
        return await client.paymentsApi.getPayment(paymentId);
      } catch (error) {
        console.error('Square getPayment error:', error);
        throw error;
      }
    },
    // Create a payment with card token and amount
    createPayment: async (options: any) => {
      if (!isServer) {
        console.warn('Square API can only be called server-side. Returning mock data.');
        return { result: { payment: mockPayment } };
      }
      
      try {
        if (!client) {
          throw new Error('Square client not initialized');
        }
        return await client.paymentsApi.createPayment(options);
      } catch (error) {
        console.error('Square createPayment error:', error);
        throw error;
      }
    }
  },
  // Orders API for creating order records
  ordersApi: {
    // Retrieve order details
    retrieveOrder: async (orderId: string) => {
      if (!isServer) {
        console.warn('Square API can only be called server-side. Returning mock data.');
        return { result: { order: mockOrder } };
      }
      
      try {
        if (!client) {
          throw new Error('Square client not initialized');
        }
        return await client.ordersApi.retrieveOrder(orderId);
      } catch (error) {
        console.error('Square retrieveOrder error:', error);
        throw error;
      }
    },
    // Create an order with line items
    createOrder: async (options: any) => {
      if (!isServer) {
        console.warn('Square API can only be called server-side. Returning mock data.');
        return { result: { order: mockOrder } };
      }
      
      try {
        if (!client) {
          throw new Error('Square client not initialized');
        }
        return await client.ordersApi.createOrder(options);
      } catch (error) {
        console.error('Square createOrder error:', error);
        throw error;
      }
    }
  },
  // Checkout API for payment links (alternative flow)
  checkoutApi: {
    createPaymentLink: async (options: any) => {
      if (!isServer) {
        console.warn('Square API can only be called server-side. Returning mock data.');
        return { result: { paymentLink: { url: 'https://mockpaymentlink.com', id: 'mock-link' } } };
      }
      
      try {
        if (!client) {
          throw new Error('Square client not initialized');
        }
        return await client.checkoutApi.createPaymentLink(options);
      } catch (error) {
        console.error('Square createPaymentLink error:', error);
        throw error;
      }
    }
  },
  // For compatibility with existing code
  payments: {
    retrieve: async (paymentId: string) => {
      if (!isServer) {
        console.warn('Square API can only be called server-side. Returning mock data.');
        return { result: { payment: mockPayment } };
      }
      
      try {
        if (!client) {
          throw new Error('Square client not initialized');
        }
        return await client.paymentsApi.getPayment(paymentId);
      } catch (error) {
        console.error('Square payments.retrieve error:', error);
        throw error;
      }
    }
  },
  orders: {
    retrieve: async (orderId: string) => {
      if (!isServer) {
        console.warn('Square API can only be called server-side. Returning mock data.');
        return { result: { order: mockOrder } };
      }
      
      try {
        if (!client) {
          throw new Error('Square client not initialized');
        }
        return await client.ordersApi.retrieveOrder(orderId);
      } catch (error) {
        console.error('Square orders.retrieve error:', error);
        throw error;
      }
    }
  }
};

// Note: squareClient is already exported above
