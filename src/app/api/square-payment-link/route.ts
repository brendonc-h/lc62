export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { createPaymentLink } from '@/lib/square-client';

export async function POST(request: Request) {
  try {
    const { amount, currency, name } = await request.json();
    
    console.log('Creating Square payment link:', { amount, currency, name });
    
    if (!amount || !currency || !name) {
      return NextResponse.json({ 
        error: 'Missing required fields: amount, currency, name' 
      }, { status: 400 });
    }

    const result = await createPaymentLink({
      amount,
      currency,
      name
    });

    if (result.success) {
      return NextResponse.json({
        success: true,
        paymentUrl: result.paymentUrl,
        paymentId: result.paymentId
      });
    } else {
      return NextResponse.json({
        error: (result as any).error || 'Failed to create payment link'
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Square payment link API error:', error);
    return NextResponse.json({ 
      error: 'Failed to create payment link',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
