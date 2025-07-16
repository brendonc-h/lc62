// Test script for sign-up functionality
const BASE_URL = 'http://localhost:3001';

async function testSignup() {
  console.log('🧪 Testing Sign-up Functionality\n');
  
  const testUser = {
    email: `test${Date.now()}@example.com`,
    firstName: 'Test',
    lastName: 'User',
    password: 'testpassword123',
    confirmPassword: 'testpassword123'
  };
  
  console.log('Testing with user:', testUser.email);
  
  try {
    // Test 1: Check if signup page loads
    console.log('1. Testing signup page load...');
    const pageResponse = await fetch(`${BASE_URL}/auth/signup`);
    if (pageResponse.ok) {
      console.log('✅ Signup page loads successfully');
    } else {
      console.log('❌ Signup page failed to load');
      return;
    }
    
    // Test 2: Test API endpoint
    console.log('\n2. Testing signup API endpoint...');
    const apiResponse = await fetch(`${BASE_URL}/api/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testUser),
    });
    
    const result = await apiResponse.json();
    
    if (apiResponse.ok) {
      console.log('✅ Signup API successful');
      console.log('Response:', result);
    } else {
      console.log('❌ Signup API failed');
      console.log('Status:', apiResponse.status);
      console.log('Error:', result);
    }
    
    // Test 3: Test validation
    console.log('\n3. Testing validation...');
    const invalidUser = {
      email: 'invalid-email',
      firstName: '',
      lastName: 'User',
      password: '123', // Too short
      confirmPassword: '456' // Doesn't match
    };
    
    const validationResponse = await fetch(`${BASE_URL}/api/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(invalidUser),
    });
    
    const validationResult = await validationResponse.json();
    
    if (!validationResponse.ok) {
      console.log('✅ Validation working correctly');
      console.log('Validation error:', validationResult.error);
    } else {
      console.log('❌ Validation not working properly');
    }
    
  } catch (error) {
    console.error('❌ Test failed with error:', error);
  }
}

// Run the test
testSignup();
