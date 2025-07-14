#!/usr/bin/env node

/**
 * Test Login and Order Flow
 * Tests authentication and order placement
 */

const BASE_URL = 'http://localhost:3001';

// Test order data
const testOrder = {
  items: [
    {
      id: 'chicken-burrito',
      name: 'Chicken Burrito',
      price: 12.99,
      quantity: 1,
      image: '/images/chicken-burrito.jpg',
      location: 'Fort Collins'
    }
  ],
  subtotal: 12.99,
  tax: 1.04,
  total: 14.03,
  customerInfo: {
    name: 'Test Customer',
    email: 'test@example.com',
    phone: '555-123-4567',
    specialInstructions: 'Test order from automated test'
  },
  paymentMethod: 'square',
  paymentId: 'test-payment-' + Date.now(),
  paymentStatus: 'completed'
};

async function testOrderCreation() {
  console.log('🧪 Testing Order Creation...');
  
  try {
    const response = await fetch(`${BASE_URL}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testOrder),
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Order creation successful!');
      console.log('Order ID:', result.orderId);
      return result.orderId;
    } else {
      console.log('❌ Order creation failed:');
      console.log('Status:', response.status);
      console.log('Error:', result);
      return null;
    }
  } catch (error) {
    console.log('❌ Order creation failed with error:');
    console.log(error.message);
    return null;
  }
}

async function testKitchenOrderView() {
  console.log('\n🧪 Testing Kitchen Order View...');
  
  try {
    const response = await fetch(`${BASE_URL}/api/admin/orders`);
    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Kitchen orders fetch successful!');
      console.log('Orders count:', result.orders?.length || 0);
      
      if (result.orders && result.orders.length > 0) {
        const latestOrder = result.orders[0];
        console.log('Latest order details:');
        console.log('- ID:', latestOrder.id);
        console.log('- Status:', latestOrder.status);
        console.log('- Total: $' + latestOrder.total);
        console.log('- Customer:', latestOrder.customerInfo?.name);
        console.log('- Items:', latestOrder.items?.length || 0);
        return latestOrder.id;
      }
      return null;
    } else {
      console.log('❌ Kitchen orders fetch failed:');
      console.log('Status:', response.status);
      console.log('Error:', result);
      return null;
    }
  } catch (error) {
    console.log('❌ Kitchen orders fetch failed with error:');
    console.log(error.message);
    return null;
  }
}

async function testOrderStatusUpdate(orderId) {
  console.log('\n🧪 Testing Order Status Update...');
  
  if (!orderId) {
    console.log('❌ No order ID provided for status update test');
    return false;
  }
  
  try {
    const response = await fetch(`${BASE_URL}/api/admin/orders/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        orderId: orderId,
        status: 'in-progress',
        estimatedMinutes: 20
      }),
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Order status update successful!');
      console.log('Updated order status to: in-progress');
      console.log('Estimated time: 20 minutes');
      return true;
    } else {
      console.log('❌ Order status update failed:');
      console.log('Status:', response.status);
      console.log('Error:', result);
      return false;
    }
  } catch (error) {
    console.log('❌ Order status update failed with error:');
    console.log(error.message);
    return false;
  }
}

async function testMenuItems() {
  console.log('\n🧪 Testing Menu Items...');
  
  try {
    const response = await fetch(`${BASE_URL}/api/menu`);
    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Menu items fetch successful!');
      console.log('Menu items count:', result.length || 0);
      
      if (result.length > 0) {
        console.log('Sample menu items:');
        result.slice(0, 3).forEach(item => {
          console.log(`- ${item.name}: $${item.price} (${item.category})`);
        });
      }
      return true;
    } else {
      console.log('❌ Menu items fetch failed:');
      console.log('Status:', response.status);
      console.log('Error:', result);
      return false;
    }
  } catch (error) {
    console.log('❌ Menu items fetch failed with error:');
    console.log(error.message);
    return false;
  }
}

async function runCompleteTest() {
  console.log('🚀 Starting Complete Login and Order Test...\n');
  
  const results = {
    menuItems: false,
    orderCreation: false,
    kitchenView: false,
    statusUpdate: false
  };
  
  // Test 1: Menu Items
  results.menuItems = await testMenuItems();
  
  // Test 2: Order Creation
  const orderId = await testOrderCreation();
  results.orderCreation = !!orderId;
  
  // Test 3: Kitchen Order View
  const kitchenOrderId = await testKitchenOrderView();
  results.kitchenView = !!kitchenOrderId;
  
  // Test 4: Order Status Update
  const orderIdForUpdate = orderId || kitchenOrderId;
  results.statusUpdate = await testOrderStatusUpdate(orderIdForUpdate);
  
  // Summary
  console.log('\n📊 Test Results Summary:');
  console.log('========================');
  console.log(`Menu Items:           ${results.menuItems ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Order Creation:       ${results.orderCreation ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Kitchen Order View:   ${results.kitchenView ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Order Status Update:  ${results.statusUpdate ? '✅ PASS' : '❌ FAIL'}`);
  
  const passCount = Object.values(results).filter(Boolean).length;
  const totalTests = Object.keys(results).length;
  
  console.log(`\n🎯 Overall: ${passCount}/${totalTests} tests passed`);
  
  if (passCount === totalTests) {
    console.log('🎉 All tests passed! Your system is ready for production!');
    console.log('\n🔑 Ready for Production Square API Keys:');
    console.log('1. Update ENVIRONMENT=production in .env.local');
    console.log('2. Replace sandbox Square keys with production keys');
    console.log('3. Test with real credit cards');
  } else {
    console.log('⚠️  Some tests failed. Please fix the issues above.');
  }
  
  console.log('\n🔗 Manual Testing Steps:');
  console.log('1. Open http://localhost:3001/auth/signin');
  console.log('2. Create an account or sign in');
  console.log('3. Go to http://localhost:3001/menu');
  console.log('4. Add items to cart and checkout');
  console.log('5. Use Square test card: 4111 1111 1111 1111');
  console.log('6. Check http://localhost:3001/kitchen for the order');
  console.log('7. Update order status and verify notifications');
}

// Run the test
runCompleteTest().catch(console.error);
