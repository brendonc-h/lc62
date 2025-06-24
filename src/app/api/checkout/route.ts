import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { OrderDetails } from '@/lib/types';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function POST(request: Request) {
  try {
    const orderDetails: OrderDetails = await request.json();

    // Create a Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(orderDetails.total * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        orderType: orderDetails.customerInfo.orderType,
        customerName: orderDetails.customerInfo.name,
        customerEmail: orderDetails.customerInfo.email,
        customerPhone: orderDetails.customerInfo.phone,
      },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Error processing payment:', error);
    return NextResponse.json(
      { error: 'Error processing payment' },
      { status: 500 }
    );
  }
}
