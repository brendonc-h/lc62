#!/usr/bin/env node

/**
 * Complete Order Flow Test
 * Tests the entire order system from creation to kitchen management
 */

const BASE_URL = 'http://localhost:3001';

// Test order data
const testOrder = {
  items: [
    {
      id: 'chicken-burrito',
      name: 'Chicken Burrito',
      price: 12.99,
      quantity: 2,
      image: '/images/chicken-burrito.jpg',
      location: 'Fort Collins',
      specialRequest: 'Extra spicy please'
    },
    {
      id: 'beef-tacos',
      name: 'Beef Tacos',
      price: 9.99,
      quantity: 1,
      image: '/images/beef-tacos.jpg',
      location: 'Fort Collins'
    }
  ],
  subtotal: 35.97,
  tax: 2.88,
  total: 38.85,
  customerInfo: {
    name: 'Test Customer',
    email: 'test@example.com',
    phone: '555-123-4567',
    specialInstructions: 'Please call when ready'
  },
  paymentMethod: 'square',
  paymentId: 'test-payment-123',
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
      console.log('Status:', result.status);
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

async function testAdminOrdersFetch() {
  console.log('\n🧪 Testing Admin Orders Fetch...');
  
  try {
    const response = await fetch(`${BASE_URL}/api/admin/orders`);
    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Admin orders fetch successful!');
      console.log('Orders count:', result.orders?.length || 0);
      
      if (result.orders && result.orders.length > 0) {
        const latestOrder = result.orders[0];
        console.log('Latest order:');
        console.log('- ID:', latestOrder.id);
        console.log('- Status:', latestOrder.status);
        console.log('- Total:', latestOrder.total);
        console.log('- Items:', latestOrder.items?.length || 0);
        console.log('- Customer:', latestOrder.customerInfo?.name);
        return latestOrder.id;
      }
      return null;
    } else {
      console.log('❌ Admin orders fetch failed:');
      console.log('Status:', response.status);
      console.log('Error:', result);
      return null;
    }
  } catch (error) {
    console.log('❌ Admin orders fetch failed with error:');
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
        estimatedMinutes: 25
      }),
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Order status update successful!');
      console.log('Updated order:', result.order?.id);
      console.log('New status:', result.order?.status);
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

async function testSquarePaymentAPI() {
  console.log('\n🧪 Testing Square Payment API...');
  
  try {
    const response = await fetch(`${BASE_URL}/api/square-payment-link`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: 3885, // $38.85 in cents
        currency: 'USD',
        name: 'Test Order Payment'
      }),
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Square payment API test successful!');
      console.log('Payment URL created:', result.paymentUrl ? 'Yes' : 'No');
      return true;
    } else {
      console.log('❌ Square payment API test failed:');
      console.log('Status:', response.status);
      console.log('Error:', result);
      return false;
    }
  } catch (error) {
    console.log('❌ Square payment API test failed with error:');
    console.log(error.message);
    return false;
  }
}

async function testMenuItemsFetch() {
  console.log('\n🧪 Testing Menu Items Fetch...');
  
  try {
    const response = await fetch(`${BASE_URL}/api/menu`);
    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Menu items fetch successful!');
      console.log('Menu items count:', result.length || 0);
      
      if (result.length > 0) {
        console.log('Sample menu item:');
        console.log('- Name:', result[0].name);
        console.log('- Price:', result[0].price);
        console.log('- Category:', result[0].category);
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
  console.log('🚀 Starting Complete Order System Test...\n');
  
  const results = {
    menuFetch: false,
    squarePayment: false,
    orderCreation: false,
    adminOrdersFetch: false,
    statusUpdate: false
  };
  
  // Test 1: Menu Items
  results.menuFetch = await testMenuItemsFetch();
  
  // Test 2: Square Payment API
  results.squarePayment = await testSquarePaymentAPI();
  
  // Test 3: Order Creation
  const orderId = await testOrderCreation();
  results.orderCreation = !!orderId;
  
  // Test 4: Admin Orders Fetch
  const fetchedOrderId = await testAdminOrdersFetch();
  results.adminOrdersFetch = !!fetchedOrderId;
  
  // Test 5: Order Status Update
  const orderIdForUpdate = orderId || fetchedOrderId;
  results.statusUpdate = await testOrderStatusUpdate(orderIdForUpdate);
  
  // Summary
  console.log('\n📊 Test Results Summary:');
  console.log('========================');
  console.log(`Menu Items Fetch:     ${results.menuFetch ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Square Payment API:   ${results.squarePayment ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Order Creation:       ${results.orderCreation ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Admin Orders Fetch:   ${results.adminOrdersFetch ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Order Status Update:  ${results.statusUpdate ? '✅ PASS' : '❌ FAIL'}`);
  
  const passCount = Object.values(results).filter(Boolean).length;
  const totalTests = Object.keys(results).length;
  
  console.log(`\n🎯 Overall: ${passCount}/${totalTests} tests passed`);
  
  if (passCount === totalTests) {
    console.log('🎉 All tests passed! Your order system is working correctly.');
  } else {
    console.log('⚠️  Some tests failed. Check the errors above and fix the issues.');
  }
  
  console.log('\n🔗 Next Steps:');
  console.log('1. Open http://localhost:3001/menu to test the frontend');
  console.log('2. Place a test order using Square test card: 4111 1111 1111 1111');
  console.log('3. Check http://localhost:3001/kitchen to see the order');
  console.log('4. Update order status and verify customer notifications');
}

// Run the test
runCompleteTest().catch(console.error);
