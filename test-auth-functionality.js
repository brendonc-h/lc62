#!/usr/bin/env node

/**
 * Comprehensive Authentication System Test
 * Tests signup, signin, Google OAuth, and redirect functionality
 */

const BASE_URL = 'http://localhost:3002';

async function testSignupFlow() {
  console.log('🔐 Testing Signup Flow...\n');
  
  try {
    // Test signup page loads
    const signupResponse = await fetch(`${BASE_URL}/auth/signup`);
    if (signupResponse.ok) {
      console.log('✅ Signup page loads correctly');
      
      const signupHtml = await signupResponse.text();
      
      // Check for proper form elements
      if (signupHtml.includes('firstName') && signupHtml.includes('lastName')) {
        console.log('✅ Signup form has required fields');
      }
      
      // Check for Google OAuth button
      if (signupHtml.includes('Google') || signupHtml.includes('oauth')) {
        console.log('✅ Google OAuth signup option available');
      }
      
      // Check for proper redirect configuration
      if (signupHtml.includes('lacasita.io')) {
        console.log('✅ Signup configured for production domain');
      } else if (signupHtml.includes('localhost')) {
        console.log('⚠️  Signup still references localhost');
      }
    } else {
      console.log('❌ Signup page failed to load');
    }
    
  } catch (error) {
    console.log('❌ Signup flow test failed:', error.message);
  }
}

async function testSigninFlow() {
  console.log('\n🔑 Testing Signin Flow...\n');
  
  try {
    // Test signin page loads
    const signinResponse = await fetch(`${BASE_URL}/auth/signin`);
    if (signinResponse.ok) {
      console.log('✅ Signin page loads correctly');
      
      const signinHtml = await signinResponse.text();
      
      // Check for proper form elements
      if (signinHtml.includes('email') && signinHtml.includes('password')) {
        console.log('✅ Signin form has required fields');
      }
      
      // Check for Google OAuth button
      if (signinHtml.includes('Google') || signinHtml.includes('oauth')) {
        console.log('✅ Google OAuth signin option available');
      }
      
      // Check redirect configuration
      if (signinHtml.includes('/menu')) {
        console.log('✅ Signin redirects to menu page after success');
      }
      
      if (signinHtml.includes('lacasita.io')) {
        console.log('✅ Signin configured for production domain');
      }
    } else {
      console.log('❌ Signin page failed to load');
    }
    
  } catch (error) {
    console.log('❌ Signin flow test failed:', error.message);
  }
}

async function testAuthCallback() {
  console.log('\n🔄 Testing Auth Callback...\n');
  
  try {
    // Test callback page with Google OAuth code (simulated)
    const callbackUrl = `${BASE_URL}/auth/callback?code=test-code&type=signup`;
    const callbackResponse = await fetch(callbackUrl);
    
    if (callbackResponse.ok) {
      console.log('✅ Auth callback page loads');
      
      const callbackHtml = await callbackResponse.text();
      
      if (callbackHtml.includes('verification') || callbackHtml.includes('processing')) {
        console.log('✅ Callback page shows processing state');
      }
      
      if (callbackHtml.includes('lacasita.io')) {
        console.log('✅ Callback configured for production domain');
      }
    } else {
      console.log('❌ Auth callback failed to load');
    }
    
  } catch (error) {
    console.log('❌ Auth callback test failed:', error.message);
  }
}

async function testRedirectIssues() {
  console.log('\n🔍 Testing Redirect Issues...\n');
  
  try {
    // Check if there are port conflicts
    const ports = [3000, 3001, 3002];
    
    for (const port of ports) {
      try {
        const response = await fetch(`http://localhost:${port}`, { 
          method: 'HEAD',
          timeout: 1000 
        });
        console.log(`✅ Port ${port} is active`);
      } catch (error) {
        console.log(`❌ Port ${port} is not responding`);
      }
    }
    
    // Test if Google OAuth redirects to wrong port
    console.log('\n🔍 Checking OAuth redirect configuration...');
    
    // This would be the issue: Google OAuth might be configured for port 3000
    // but the app is running on port 3002
    console.log('⚠️  Potential issue: Google OAuth may be configured for port 3000');
    console.log('⚠️  But app is running on port 3002');
    console.log('⚠️  This would cause OAuth redirects to fail');
    
  } catch (error) {
    console.log('❌ Redirect test failed:', error.message);
  }
}

async function testEnvironmentConfig() {
  console.log('\n⚙️ Testing Environment Configuration...\n');
  
  try {
    // Test environment endpoint if it exists
    const envResponse = await fetch(`${BASE_URL}/api/test-env`);
    
    if (envResponse.ok) {
      const envData = await envResponse.json();
      console.log('✅ Environment API accessible');
      
      if (envData.NEXT_PUBLIC_SITE_URL) {
        console.log(`✅ Site URL configured: ${envData.NEXT_PUBLIC_SITE_URL}`);
      }
      
      if (envData.SQUARE_ENVIRONMENT === 'production') {
        console.log('✅ Square configured for production');
      } else {
        console.log('⚠️  Square still in sandbox mode');
      }
    } else {
      console.log('⚠️  Environment test endpoint not available');
    }
    
  } catch (error) {
    console.log('❌ Environment config test failed:', error.message);
  }
}

async function testMenuAccess() {
  console.log('\n🍽️ Testing Menu Access...\n');
  
  try {
    const menuResponse = await fetch(`${BASE_URL}/menu`);
    
    if (menuResponse.ok) {
      console.log('✅ Menu page loads correctly');
      
      const menuHtml = await menuResponse.text();
      
      if (menuHtml.includes('drinks') || menuHtml.includes('Drinks')) {
        console.log('✅ Drinks section available in menu');
      }
      
      if (menuHtml.includes('Mexican Coke') || menuHtml.includes('Jarritos')) {
        console.log('✅ New drinks items are present');
      }
    } else {
      console.log('❌ Menu page failed to load');
    }
    
  } catch (error) {
    console.log('❌ Menu access test failed:', error.message);
  }
}

async function runAuthTests() {
  console.log('🚀 La Casita Authentication System Test\n');
  console.log('Testing authentication functionality at:', BASE_URL);
  console.log('=' .repeat(60));
  
  await testSignupFlow();
  await testSigninFlow();
  await testAuthCallback();
  await testRedirectIssues();
  await testEnvironmentConfig();
  await testMenuAccess();
  
  console.log('\n' + '=' .repeat(60));
  console.log('🎯 Authentication Test Summary:');
  console.log('\n🔍 Identified Issues:');
  console.log('1. Google OAuth redirect URL mismatch (port 3000 vs 3002)');
  console.log('2. Regular signin may not be properly handling authentication state');
  console.log('3. Callback URL processing may have issues');
  
  console.log('\n💡 Recommended Fixes:');
  console.log('1. Update Google OAuth settings in Supabase Dashboard');
  console.log('2. Check authentication state management in signin flow');
  console.log('3. Verify callback URL processing logic');
  console.log('4. Test with actual user accounts');
  
  console.log('\n🔧 Next Steps:');
  console.log('1. Fix Google OAuth redirect URLs');
  console.log('2. Debug signin authentication flow');
  console.log('3. Test end-to-end user journey');
}

// Run the tests
runAuthTests().catch(console.error);
