const fetch = require('node-fetch');

async function testSignupStatus() {
    const testEmail = 'bill@gmail.com';
    const testPassword = 'password123';
    
    console.log('Testing signup status for:', testEmail);
    console.log('Server URL: http://localhost:3002');
    
    try {
        // Test signup
        console.log('\n=== TESTING SIGNUP ===');
        const signupResponse = await fetch('http://localhost:3002/api/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: testEmail,
                password: testPassword,
                firstName: 'Bill',
                lastName: 'Test'
            }),
        });
        
        const signupResult = await signupResponse.text();
        console.log('Signup Status:', signupResponse.status);
        console.log('Signup Response:', signupResult);
        
        // Test signin
        console.log('\n=== TESTING SIGNIN ===');
        const signinResponse = await fetch('http://localhost:3002/api/auth/signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: testEmail,
                password: testPassword
            }),
        });
        
        const signinResult = await signinResponse.text();
        console.log('Signin Status:', signinResponse.status);
        console.log('Signin Response:', signinResult);
        
    } catch (error) {
        console.error('Test failed:', error);
    }
}

testSignupStatus();
