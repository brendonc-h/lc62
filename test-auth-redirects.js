#!/usr/bin/env node

/**
 * Test script to verify authentication redirects are fixed
 * Tests that all auth flows redirect to production URL instead of localhost
 */

const fs = require('fs');
const path = require('path');

function testAuthFiles() {
  console.log('🔐 Testing Authentication Redirect Fixes...\n');
  
  const authFiles = [
    'src/app/auth/signin/page.tsx',
    'src/app/auth/signup/page.tsx',
    'src/app/auth/callback/page.tsx'
  ];
  
  let allTestsPassed = true;
  
  authFiles.forEach(filePath => {
    console.log(`📄 Testing ${filePath}:`);
    
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Check for problematic window.location.origin fallbacks
      const windowLocationMatches = content.match(/window\.location\.origin/g);
      if (windowLocationMatches) {
        console.log(`❌ Found ${windowLocationMatches.length} window.location.origin references`);
        allTestsPassed = false;
      } else {
        console.log('✅ No window.location.origin fallbacks found');
      }
      
      // Check for production URL fallbacks
      const productionFallbacks = content.match(/https:\/\/la-casita-restaurant\.windsurf\.build/g);
      if (productionFallbacks) {
        console.log(`✅ Found ${productionFallbacks.length} production URL fallbacks`);
      } else {
        console.log('⚠️  No production URL fallbacks found');
        allTestsPassed = false;
      }
      
      // Check for proper environment variable usage
      const envVarUsage = content.match(/process\.env\.NEXT_PUBLIC_SITE_URL/g);
      if (envVarUsage) {
        console.log(`✅ Found ${envVarUsage.length} proper environment variable usages`);
      }
      
    } catch (error) {
      console.log(`❌ Error reading ${filePath}:`, error.message);
      allTestsPassed = false;
    }
    
    console.log('');
  });
  
  return allTestsPassed;
}

function testEnvironmentConfig() {
  console.log('🔧 Testing Environment Configuration...\n');
  
  try {
    const envContent = fs.readFileSync('.env.local', 'utf8');
    
    if (envContent.includes('NEXT_PUBLIC_SITE_URL=https://la-casita-restaurant.windsurf.build')) {
      console.log('✅ Production site URL configured in .env.local');
    } else {
      console.log('❌ Production site URL not found in .env.local');
      return false;
    }
    
    if (envContent.includes('NODE_ENV=production')) {
      console.log('✅ NODE_ENV set to production');
    } else {
      console.log('⚠️  NODE_ENV not set to production');
    }
    
    return true;
    
  } catch (error) {
    console.log('❌ Error reading .env.local:', error.message);
    return false;
  }
}

function runAuthRedirectTests() {
  console.log('🚀 Authentication Redirect Fix Test\n');
  console.log('=' .repeat(60));
  
  const authTestsPassed = testAuthFiles();
  const envTestsPassed = testEnvironmentConfig();
  
  console.log('\n' + '=' .repeat(60));
  console.log('🎯 Authentication Redirect Fix Summary:');
  
  if (authTestsPassed && envTestsPassed) {
    console.log('✅ All authentication redirects fixed');
    console.log('✅ No more localhost fallbacks');
    console.log('✅ Production URL fallbacks implemented');
    console.log('✅ Environment variables properly configured');
    console.log('\n🎉 Authentication will now redirect to production domain!');
    console.log('🔗 Users will be redirected to: https://la-casita-restaurant.windsurf.build');
  } else {
    console.log('❌ Some authentication redirect issues remain');
    console.log('⚠️  Manual review required');
  }
}

// Run the tests
runAuthRedirectTests();
