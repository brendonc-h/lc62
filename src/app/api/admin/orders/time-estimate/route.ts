import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabaseClient';

export async function PATCH(request: Request) {
  try {
    const supabase = createClient();
    const { orderId, estimatedMinutes } = await request.json();
    
    // Check if user is authenticated and is an admin
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get user's role from the customers table
    const { data: customerData, error: customerError } = await supabase
      .from('customers')
      .select('role')
      .eq('auth_id', user.id)
      .single();
    
    if (customerError || !customerData || customerData.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    
    // Update the order with the time estimate
    const { error: updateError } = await supabase
      .from('orders')
      .update({ estimated_completion_minutes: estimatedMinutes, updated_at: new Date().toISOString() })
      .eq('id', orderId);
    
    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }
    
    return NextResponse.json({ 
      success: true, 
      message: `Order #${orderId} updated with ${estimatedMinutes} minute estimate`
    });
    
  } catch (error) {
    console.error('Error updating time estimate:', error);
    return NextResponse.json({ 
      error: 'Failed to update time estimate' 
    }, { status: 500 });
  }
}
