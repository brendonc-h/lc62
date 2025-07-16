import { NextResponse } from 'next/server';
import { squareClient, generateIdempotencyKey } from '@/lib/square-client';
import { OrderDetails } from '@/lib/types';

export async function POST(request: Request) {
  try {
    const orderDetails: OrderDetails = await request.json();
    
    // Make sure we have the Square Location ID
    if (!process.env.SQUARE_LOCATION_ID) {
      console.error('SQUARE_LOCATION_ID environment variable is missing');
      return NextResponse.json(
        { error: 'Payment configuration error - missing location ID' },
        { status: 500 }
      );
    }
    
    // Ensure we have a site URL for the redirect
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
    
    // Create a payment link with Square
    const { result } = await squareClient.checkoutApi.createPaymentLink({
      idempotencyKey: generateIdempotencyKey(),
      quickPay: {
        name: 'La Casita Order',
        priceMoney: {
          amount: Math.round(orderDetails.total * 100),
          currency: 'USD'
        },
        locationId: process.env.SQUARE_LOCATION_ID as string,
      },
      checkoutOptions: {
        redirectUrl: `${siteUrl}/payment-return?status=success`,
        askForShippingAddress: false,
        enableCoupon: false,
        merchantSupportEmail: `${orderDetails.items[0]?.location?.toLowerCase() || 'info'}@lacasita.io`,
      },
      prePopulatedData: {
        buyerEmail: orderDetails.customerInfo.email,
        buyerPhoneNumber: orderDetails.customerInfo.phone,
      },
      order: {
        locationId: process.env.SQUARE_LOCATION_ID as string,
        lineItems: orderDetails.items.map(item => ({
          name: item.name || 'Menu item',
          quantity: (item.quantity || 1).toString(),
          basePriceMoney: {
            amount: Math.round((item.price || 0) * 100),
            currency: 'USD',
          },
          note: item.specialRequest || ''
        })),
        referenceId: generateIdempotencyKey(),
        metadata: {
          customerName: orderDetails.customerInfo.name || 'Guest',
          location: orderDetails.items[0]?.location || 'Default location',
          orderType: 'pickup'
        }
      },
    });

    // Check if we have a valid payment link URL
    if (!result?.paymentLink?.url) {
      console.error('Square payment link creation failed - no URL returned');
      return NextResponse.json(
        { error: 'Failed to generate payment link' },
        { status: 500 }
      );
    }
    
    // Log the successful payment link creation
    console.log('Square payment link created successfully:', { 
      paymentId: result.paymentLink?.id,
      checkoutUrl: result.paymentLink?.url.substring(0, 50) + '...' // Truncate for log safety
    });
    
    // Return the payment link URL for redirect
    return NextResponse.json({ 
      paymentLinkUrl: result.paymentLink?.url,
      paymentId: result.paymentLink?.id,
      success: true
    });
  } catch (error: any) {
    // Detailed error logging
    console.error('Error processing Square payment:', error);
    
    // Extract useful error information when available
    const errorDetails = {
      message: error?.message || 'Unknown error',
      type: error?.constructor?.name || 'Error',
      code: error?.code || error?.statusCode || 'unknown',
    };
    
    console.error('Error details:', errorDetails);
    
    // Return a helpful error response
    return NextResponse.json(
      { 
        error: 'Error processing payment', 
        details: errorDetails.message,
        success: false
      },
      { status: 500 }
    );
  }
}
