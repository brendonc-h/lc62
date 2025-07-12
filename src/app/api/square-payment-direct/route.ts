import { NextResponse } from 'next/server';
import { squareClient, generateIdempotencyKey } from '@/lib/square-client';
import { OrderDetails } from '@/lib/types';

export async function POST(request: Request) {
  try {
    const { token, orderDetails }: { token: string; orderDetails: OrderDetails } = await request.json();
    
    // Validate required environment variables
    if (!process.env.SQUARE_LOCATION_ID) {
      console.error('SQUARE_LOCATION_ID environment variable is missing');
      return NextResponse.json(
        { error: 'Payment configuration error - missing location ID' },
        { status: 500 }
      );
    }

    // Create the payment request
    const paymentRequest = {
      idempotencyKey: generateIdempotencyKey(),
      sourceId: token,
      amountMoney: {
        amount: Math.round(orderDetails.total * 100), // Convert to cents
        currency: 'USD'
      },
      locationId: process.env.SQUARE_LOCATION_ID,
      note: `La Casita Order - ${orderDetails.customerInfo.name}`,
      buyerEmailAddress: orderDetails.customerInfo.email,
      billingAddress: {
        firstName: orderDetails.customerInfo.name.split(' ')[0] || '',
        lastName: orderDetails.customerInfo.name.split(' ').slice(1).join(' ') || '',
      },
      referenceId: generateIdempotencyKey(),
    };

    console.log('Creating Square payment with request:', {
      amount: paymentRequest.amountMoney.amount,
      currency: paymentRequest.amountMoney.currency,
      locationId: paymentRequest.locationId,
      customerEmail: orderDetails.customerInfo.email
    });

    // Process the payment
    const { result } = await squareClient.paymentsApi.createPayment(paymentRequest);

    if (!result.payment) {
      throw new Error('Payment creation failed - no payment object returned');
    }

    console.log('Square payment created successfully:', {
      paymentId: result.payment.id,
      status: result.payment.status,
      amount: result.payment.amountMoney?.amount
    });

    // Create order record in Square (optional but recommended)
    try {
      const orderRequest = {
        idempotencyKey: generateIdempotencyKey(),
        order: {
          locationId: process.env.SQUARE_LOCATION_ID,
          lineItems: orderDetails.items.map(item => ({
            name: item.name || 'Menu item',
            quantity: (item.quantity || 1).toString(),
            basePriceMoney: {
              amount: Math.round((item.price || 0) * 100),
              currency: 'USD',
            },
            note: item.specialRequest || ''
          })),
          metadata: {
            customerName: orderDetails.customerInfo.name || 'Guest',
            customerEmail: orderDetails.customerInfo.email || '',
            customerPhone: orderDetails.customerInfo.phone || '',
            location: orderDetails.items[0]?.location || 'Default location',
            orderType: 'pickup',
            paymentId: result.payment.id
          }
        }
      };

      const orderResult = await squareClient.ordersApi.createOrder(orderRequest);
      console.log('Square order created:', orderResult.result?.order?.id);
    } catch (orderError) {
      console.warn('Failed to create Square order record:', orderError);
      // Don't fail the payment if order creation fails
    }

    // Return success response
    return NextResponse.json({
      success: true,
      paymentId: result.payment.id,
      status: result.payment.status,
      receiptUrl: result.payment.receiptUrl,
      message: 'Payment processed successfully'
    });

  } catch (error: any) {
    console.error('Error processing Square payment:', error);
    
    // Extract useful error information
    const errorDetails = {
      message: error?.message || 'Unknown error',
      type: error?.constructor?.name || 'Error',
      code: error?.code || error?.statusCode || 'unknown',
      category: error?.category || 'unknown'
    };
    
    console.error('Payment error details:', errorDetails);
    
    // Return error response
    return NextResponse.json(
      { 
        error: 'Payment processing failed', 
        details: errorDetails.message,
        success: false
      },
      { status: 500 }
    );
  }
}
