#!/usr/bin/env node

/**
 * Production Authentication Test for lacasita.io
 * Tests the current authentication flow issues
 */

const PRODUCTION_URL = 'https://lacasita.io';

async function testProductionAuth() {
  console.log('🔐 Testing Production Authentication at lacasita.io\n');
  
  try {
    // Test signin page
    console.log('1. Testing signin page...');
    const signinResponse = await fetch(`${PRODUCTION_URL}/auth/signin`);
    
    if (signinResponse.ok) {
      console.log('✅ Signin page loads correctly');
      
      const signinHtml = await signinResponse.text();
      
      // Check for Google OAuth configuration
      if (signinHtml.includes('lacasita.io/auth/callback')) {
        console.log('✅ Google OAuth configured for production domain');
      } else if (signinHtml.includes('localhost')) {
        console.log('❌ Still references localhost in OAuth config');
      }
      
      // Check callback URL configuration
      if (signinHtml.includes('/menu')) {
        console.log('✅ Signin redirects to menu page');
      }
      
    } else {
      console.log('❌ Signin page failed to load');
    }
    
    // Test callback page
    console.log('\n2. Testing auth callback page...');
    const callbackResponse = await fetch(`${PRODUCTION_URL}/auth/callback`);
    
    if (callbackResponse.ok) {
      console.log('✅ Auth callback page accessible');
    } else {
      console.log('❌ Auth callback page failed to load');
    }
    
    // Test menu page (where users should be redirected)
    console.log('\n3. Testing menu page...');
    const menuResponse = await fetch(`${PRODUCTION_URL}/menu`);
    
    if (menuResponse.ok) {
      console.log('✅ Menu page loads correctly');
    } else {
      console.log('❌ Menu page failed to load');
    }
    
    // Test API endpoints
    console.log('\n4. Testing API endpoints...');
    
    try {
      const authSigninAPI = await fetch(`${PRODUCTION_URL}/api/auth/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test@example.com', password: 'test' })
      });
      
      if (authSigninAPI.status === 400 || authSigninAPI.status === 401) {
        console.log('✅ Auth signin API is responding (expected 400/401 for test credentials)');
      } else {
        console.log('⚠️  Auth signin API response:', authSigninAPI.status);
      }
    } catch (apiError) {
      console.log('❌ Auth signin API not accessible');
    }
    
  } catch (error) {
    console.log('❌ Production auth test failed:', error.message);
  }
}

async function testSupabaseConfig() {
  console.log('\n🔧 Testing Supabase Configuration...\n');
  
  // These are the expected configurations for production
  const expectedConfig = {
    supabaseUrl: 'https://tpoqcxqyolnrkekdnorj.supabase.co',
    siteUrl: 'https://lacasita.io',
    callbackUrl: 'https://lacasita.io/auth/callback',
    redirectAfterSignin: 'https://lacasita.io/menu'
  };
  
  console.log('Expected Production Configuration:');
  console.log('✅ Supabase URL:', expectedConfig.supabaseUrl);
  console.log('✅ Site URL:', expectedConfig.siteUrl);
  console.log('✅ OAuth Callback:', expectedConfig.callbackUrl);
  console.log('✅ Signin Redirect:', expectedConfig.redirectAfterSignin);
  
  console.log('\n📋 Checklist for Supabase Dashboard:');
  console.log('□ Authentication → Providers → Google → Authorized redirect URIs');
  console.log('  Should contain: https://lacasita.io/auth/callback');
  console.log('□ Authentication → Settings → Site URL');
  console.log('  Should be: https://lacasita.io');
  console.log('□ Authentication → Settings → Email confirmations');
  console.log('  Should be: DISABLED (as you mentioned)');
}

async function diagnoseCommonIssues() {
  console.log('\n🔍 Common Authentication Issues:\n');
  
  console.log('1. **Google OAuth redirects to localhost:3000**');
  console.log('   → Check Supabase Dashboard → Auth → Providers → Google');
  console.log('   → Remove any localhost URLs from redirect URIs');
  console.log('   → Ensure only https://lacasita.io/auth/callback is listed');
  
  console.log('\n2. **Regular signin redirects to home instead of menu**');
  console.log('   → Check if router.push(callbackUrl) is working');
  console.log('   → Verify callbackUrl is set to "/menu"');
  console.log('   → Check browser console for navigation errors');
  
  console.log('\n3. **Authentication state not persisting**');
  console.log('   → Check if Supabase client is properly configured');
  console.log('   → Verify session storage is working');
  console.log('   → Check for CORS issues in production');
  
  console.log('\n4. **Callback processing fails**');
  console.log('   → Check auth/callback page for error handling');
  console.log('   → Verify exchangeCodeForSession is working');
  console.log('   → Check ensureCustomerRecord function');
}

async function runProductionTests() {
  console.log('🚀 La Casita Production Authentication Test\n');
  console.log('Testing authentication at: https://lacasita.io');
  console.log('=' .repeat(60));
  
  await testProductionAuth();
  await testSupabaseConfig();
  await diagnoseCommonIssues();
  
  console.log('\n' + '=' .repeat(60));
  console.log('🎯 Next Steps:');
  console.log('1. Check browser console on lacasita.io for JavaScript errors');
  console.log('2. Test actual signin with a real account');
  console.log('3. Monitor network tab during authentication flow');
  console.log('4. Verify Supabase Dashboard settings match expected config');
  
  console.log('\n💡 Quick Test:');
  console.log('1. Go to https://lacasita.io/auth/signin');
  console.log('2. Try signing in with email/password');
  console.log('3. Check browser console for errors');
  console.log('4. Try Google OAuth signin');
  console.log('5. Check if redirects work properly');
}

// Run the tests
runProductionTests().catch(console.error);
