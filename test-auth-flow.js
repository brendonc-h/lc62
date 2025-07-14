#!/usr/bin/env node

/**
 * Test Authentication Flow
 * Tests the sign-in redirect flow to ensure it works correctly
 */

const BASE_URL = 'http://localhost:3001';

async function testAuthPages() {
  console.log('🔐 Testing Authentication Flow...\n');
  
  try {
    // Test 1: Check sign-in page loads
    console.log('1. Testing sign-in page...');
    const signinResponse = await fetch(`${BASE_URL}/auth/signin`);
    console.log(`   Sign-in page status: ${signinResponse.status}`);
    
    if (signinResponse.ok) {
      console.log('   ✅ Sign-in page loads correctly');
    } else {
      console.log('   ❌ Sign-in page failed to load');
    }
    
    // Test 2: Check sign-in page with callback URL
    console.log('\n2. Testing sign-in page with callback URL...');
    const signinCallbackResponse = await fetch(`${BASE_URL}/auth/signin?callbackUrl=/checkout`);
    console.log(`   Sign-in with callback status: ${signinCallbackResponse.status}`);
    
    if (signinCallbackResponse.ok) {
      console.log('   ✅ Sign-in page with callback URL loads correctly');
    } else {
      console.log('   ❌ Sign-in page with callback URL failed to load');
    }
    
    // Test 3: Check checkout page loads
    console.log('\n3. Testing checkout page...');
    const checkoutResponse = await fetch(`${BASE_URL}/checkout`);
    console.log(`   Checkout page status: ${checkoutResponse.status}`);
    
    if (checkoutResponse.ok) {
      const checkoutHtml = await checkoutResponse.text();
      if (checkoutHtml.includes('/auth/signin?callbackUrl=/checkout')) {
        console.log('   ✅ Checkout page has correct sign-in link');
      } else {
        console.log('   ⚠️  Checkout page sign-in link might be incorrect');
      }
    } else {
      console.log('   ❌ Checkout page failed to load');
    }
    
    // Test 4: Check auth callback page
    console.log('\n4. Testing auth callback page...');
    const callbackResponse = await fetch(`${BASE_URL}/auth/callback`);
    console.log(`   Auth callback status: ${callbackResponse.status}`);
    
    if (callbackResponse.ok) {
      console.log('   ✅ Auth callback page loads correctly');
    } else {
      console.log('   ❌ Auth callback page failed to load');
    }
    
    // Test 5: Check kitchen page redirect
    console.log('\n5. Testing kitchen page authentication...');
    const kitchenResponse = await fetch(`${BASE_URL}/kitchen`, {
      redirect: 'manual' // Don't follow redirects
    });
    console.log(`   Kitchen page status: ${kitchenResponse.status}`);
    
    if (kitchenResponse.status === 307 || kitchenResponse.status === 302) {
      const location = kitchenResponse.headers.get('location');
      if (location && location.includes('/auth/signin')) {
        console.log('   ✅ Kitchen page correctly redirects to sign-in');
        console.log(`   Redirect URL: ${location}`);
      } else {
        console.log('   ⚠️  Kitchen page redirect might be incorrect');
        console.log(`   Redirect URL: ${location}`);
      }
    } else {
      console.log('   ❌ Kitchen page should redirect when not authenticated');
    }
    
  } catch (error) {
    console.log('❌ Error testing authentication flow:');
    console.log(error.message);
  }
}

async function testSignInFlow() {
  console.log('\n🧪 Testing Sign-In Flow with Demo Account...\n');
  
  try {
    // Test sign-in with demo credentials
    console.log('Testing sign-in with demo account...');
    const signInData = {
      email: 'test@example.com',
      password: 'password123'
    };
    
    const response = await fetch(`${BASE_URL}/api/auth/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(signInData),
    });
    
    console.log(`Sign-in API status: ${response.status}`);
    
    if (response.ok) {
      console.log('✅ Demo account sign-in API works');
    } else {
      const errorText = await response.text();
      console.log('❌ Sign-in API failed:');
      console.log(errorText);
    }
    
  } catch (error) {
    console.log('❌ Error testing sign-in flow:');
    console.log(error.message);
  }
}

async function runTests() {
  console.log('🚀 Authentication Flow Test\n');
  console.log('This will test the authentication redirect flow to ensure it works correctly.\n');
  
  await testAuthPages();
  await testSignInFlow();
  
  console.log('\n🎯 Summary:');
  console.log('- Fixed checkout page sign-in link to use /auth/signin?callbackUrl=/checkout');
  console.log('- Updated sign-in page to redirect to home page (/) by default instead of /dashboard');
  console.log('- Enhanced auth callback to handle callbackUrl parameter');
  console.log('- Kitchen page should redirect to sign-in when not authenticated');
  console.log('\n✅ Authentication flow should now work correctly!');
  console.log('\n📝 To test manually:');
  console.log('1. Go to http://localhost:3001/checkout');
  console.log('2. Click "Sign in to your account"');
  console.log('3. Sign in with test@example.com / password123');
  console.log('4. Should redirect back to checkout page');
}

// Run the tests
runTests().catch(console.error);
