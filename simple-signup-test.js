// Simple signup test
const fetch = require('node-fetch');

async function testSignup() {
  console.log('Testing signup API...');
  
  const testUser = {
    email: `test${Date.now()}@example.com`,
    firstName: 'Test',
    lastName: 'User',
    password: 'testpassword123',
    confirmPassword: 'testpassword123'
  };
  
  try {
    const response = await fetch('http://localhost:3001/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testUser),
    });
    
    const result = await response.json();
    
    console.log('Status:', response.status);
    console.log('Response:', result);
    
    if (response.ok) {
      console.log('✅ Signup successful!');
    } else {
      console.log('❌ Signup failed');
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testSignup();
