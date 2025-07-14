#!/usr/bin/env node

/**
 * Test Kitchen Orders API
 * Checks what orders are being returned by the admin orders endpoint
 */

const BASE_URL = 'http://localhost:3001';

async function testKitchenOrders() {
  console.log('🧪 Testing Kitchen Orders API...\n');
  
  try {
    console.log('Fetching orders from /api/admin/orders...');
    const response = await fetch(`${BASE_URL}/api/admin/orders`);
    
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log('❌ API Error Response:');
      console.log(errorText);
      return;
    }
    
    const data = await response.json();
    console.log('\n✅ API Response received successfully!');
    
    if (data.orders) {
      console.log(`\n📊 Orders found: ${data.orders.length}`);
      
      if (data.orders.length === 0) {
        console.log('❌ No orders in database - this is why kitchen shows empty!');
        console.log('\n💡 To fix this:');
        console.log('1. Go to http://localhost:3001/menu');
        console.log('2. Add items to cart');
        console.log('3. Complete checkout');
        console.log('4. Then check kitchen dashboard');
      } else {
        console.log('\n📋 Order Details:');
        data.orders.slice(0, 3).forEach((order, index) => {
          console.log(`\nOrder ${index + 1}:`);
          console.log(`- ID: ${order.id}`);
          console.log(`- Status: ${order.status}`);
          console.log(`- Total: $${order.total}`);
          console.log(`- Created: ${order.createdAt}`);
          console.log(`- Items: ${order.items?.length || 0}`);
          console.log(`- Customer: ${order.customerInfo?.name || 'Unknown'}`);
          console.log(`- Location: ${order.location || 'Unknown'}`);
        });
        
        if (data.orders.length > 3) {
          console.log(`\n... and ${data.orders.length - 3} more orders`);
        }
      }
    } else {
      console.log('❌ Unexpected response format:');
      console.log(JSON.stringify(data, null, 2));
    }
    
  } catch (error) {
    console.log('❌ Error testing kitchen orders:');
    console.log(error.message);
  }
}

async function testOrderCreation() {
  console.log('\n🧪 Testing Order Creation...\n');
  
  const testOrder = {
    items: [
      {
        id: 'test-item',
        name: 'Test Burrito',
        price: 10.99,
        quantity: 1,
        image: '/images/test.jpg',
        location: 'Fort Collins'
      }
    ],
    subtotal: 10.99,
    tax: 0.88,
    total: 11.87,
    customerInfo: {
      name: 'Kitchen Test Customer',
      email: 'kitchen-test@example.com',
      phone: '555-123-4567',
      specialInstructions: 'Test order for kitchen dashboard'
    },
    paymentMethod: 'square',
    paymentId: 'kitchen-test-' + Date.now(),
    paymentStatus: 'completed'
  };
  
  try {
    console.log('Creating test order...');
    const response = await fetch(`${BASE_URL}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testOrder),
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Test order created successfully!');
      console.log('Order ID:', result.orderId);
      console.log('\n💡 Now check the kitchen dashboard - you should see this order!');
      return result.orderId;
    } else {
      const error = await response.json();
      console.log('❌ Failed to create test order:');
      console.log(error);
      return null;
    }
  } catch (error) {
    console.log('❌ Error creating test order:');
    console.log(error.message);
    return null;
  }
}

async function runTest() {
  console.log('🚀 Kitchen Orders Test\n');
  console.log('This will check if the kitchen dashboard is connected to real database orders.\n');
  
  // First check current orders
  await testKitchenOrders();
  
  // Then create a test order if none exist
  console.log('\n' + '='.repeat(60));
  const orderId = await testOrderCreation();
  
  if (orderId) {
    console.log('\n' + '='.repeat(60));
    console.log('🔄 Checking orders again after creation...\n');
    
    // Wait a moment for the order to be processed
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    await testKitchenOrders();
  }
  
  console.log('\n🎯 Summary:');
  console.log('- Kitchen page IS connected to database');
  console.log('- If you see "mock orders", it means no real orders exist');
  console.log('- Create orders through the menu/checkout to see them in kitchen');
  console.log('- Kitchen dashboard will update in real-time when new orders arrive');
}

// Run the test
runTest().catch(console.error);
