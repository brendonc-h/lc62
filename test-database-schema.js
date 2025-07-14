#!/usr/bin/env node

/**
 * Test Database Schema
 * Checks if the database columns exist and tests order status update
 */

const BASE_URL = 'http://localhost:3001';

async function testDatabaseSchema() {
  console.log('🔍 Testing Database Schema...');
  
  try {
    // First, let's get the latest order to test with
    const ordersResponse = await fetch(`${BASE_URL}/api/admin/orders`);
    const ordersResult = await ordersResponse.json();
    
    if (!ordersResponse.ok) {
      console.log('❌ Failed to fetch orders:', ordersResult);
      return;
    }
    
    console.log('✅ Orders fetch successful!');
    console.log('Orders count:', ordersResult.orders?.length || 0);
    
    if (!ordersResult.orders || ordersResult.orders.length === 0) {
      console.log('❌ No orders found to test with');
      return;
    }
    
    const latestOrder = ordersResult.orders[0];
    console.log('Latest order ID:', latestOrder.id);
    console.log('Latest order status:', latestOrder.status);
    
    // Now test the status update
    console.log('\n🧪 Testing Order Status Update...');
    
    const statusResponse = await fetch(`${BASE_URL}/api/admin/orders/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        orderId: latestOrder.id,
        status: 'in-progress',
        estimatedMinutes: 25
      }),
    });

    const statusResult = await statusResponse.json();
    
    if (statusResponse.ok) {
      console.log('✅ Order status update successful!');
      console.log('Updated order:', statusResult.order);
    } else {
      console.log('❌ Order status update failed:');
      console.log('Status:', statusResponse.status);
      console.log('Error:', statusResult);
      
      // If it's a schema cache issue, let's try to refresh it
      if (statusResult.error && statusResult.error.includes('schema cache')) {
        console.log('\n🔄 Schema cache issue detected. This usually resolves itself in a few minutes.');
        console.log('You may need to:');
        console.log('1. Wait a few minutes for Supabase to refresh the schema cache');
        console.log('2. Or restart your Supabase project');
        console.log('3. Or run the SQL commands again in Supabase SQL Editor');
      }
    }
    
  } catch (error) {
    console.log('❌ Test failed with error:');
    console.log(error.message);
  }
}

// Run the test
testDatabaseSchema().catch(console.error);
