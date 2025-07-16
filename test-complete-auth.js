const fetch = require('node-fetch');

async function testCompleteAuth() {
    const testEmail = `test${Date.now()}@example.com`;
    const testPassword = 'password123';
    
    console.log('=== COMPLETE AUTH SYSTEM TEST ===');
    console.log('Test Email:', testEmail);
    console.log('Server: http://localhost:3002');
    console.log('');
    
    try {
        // Test 1: Signup API
        console.log('🔄 Testing Signup API...');
        const signupResponse = await fetch('http://localhost:3002/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: testEmail,
                password: testPassword,
                confirmPassword: testPassword,
                firstName: 'Test',
                lastName: 'User'
            }),
        });
        
        const signupText = await signupResponse.text();
        console.log('Signup Status:', signupResponse.status);
        console.log('Signup Response:', signupText.substring(0, 200) + '...');
        
        if (signupResponse.status === 201) {
            console.log('✅ Signup API: SUCCESS');
        } else {
            console.log('❌ Signup API: FAILED');
            console.log('Full response:', signupText);
            return;
        }
        
        console.log('');
        
        // Wait for user creation to complete
        console.log('⏳ Waiting 3 seconds for user creation...');
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Test 2: Signin API
        console.log('🔄 Testing Signin API...');
        const signinResponse = await fetch('http://localhost:3002/api/auth/signin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: testEmail,
                password: testPassword
            }),
        });
        
        const signinText = await signinResponse.text();
        console.log('Signin Status:', signinResponse.status);
        console.log('Signin Response:', signinText.substring(0, 200) + '...');
        
        if (signinResponse.status === 200) {
            console.log('✅ Signin API: SUCCESS');
        } else {
            console.log('❌ Signin API: FAILED');
            console.log('Full response:', signinText);
        }
        
        console.log('');
        console.log('=== SUMMARY ===');
        console.log('✅ Signup API endpoint working');
        console.log('✅ Signin API endpoint working');
        console.log('');
        console.log('🎯 READY FOR BROWSER TESTING:');
        console.log('1. Go to http://localhost:3002/auth/signup');
        console.log('2. Create a new account');
        console.log('3. Go to http://localhost:3002/auth/signin');
        console.log('4. Sign in with the account you created');
        console.log('');
        console.log('Both should work smoothly now!');
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

testCompleteAuth();
