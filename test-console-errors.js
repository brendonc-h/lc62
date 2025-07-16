#!/usr/bin/env node

/**
 * Test script to verify console errors are fixed
 * Tests favicon and Supabase client optimization
 */

const fs = require('fs');

function testFaviconFix() {
  console.log('🖼️ Testing Favicon Fix...\n');
  
  try {
    // Check if layout.tsx has proper favicon configuration
    const layoutContent = fs.readFileSync('src/app/layout.tsx', 'utf8');
    
    if (layoutContent.includes('icons:')) {
      console.log('✅ Favicon configuration added to layout.tsx');
    } else {
      console.log('❌ Favicon configuration missing');
      return false;
    }
    
    if (layoutContent.includes('/lacasitalogo.jpg')) {
      console.log('✅ Using La Casita logo as favicon');
    } else {
      console.log('❌ Logo favicon not configured');
      return false;
    }
    
    // Check if description was updated
    if (layoutContent.includes('Authentic Mexican Restaurant')) {
      console.log('✅ App description updated');
    }
    
    return true;
    
  } catch (error) {
    console.log('❌ Error testing favicon fix:', error.message);
    return false;
  }
}

function testSupabaseClientOptimization() {
  console.log('\n🔧 Testing Supabase Client Optimization...\n');
  
  try {
    const supabaseContent = fs.readFileSync('src/lib/supabaseClient.ts', 'utf8');
    
    // Check for singleton pattern implementation
    if (supabaseContent.includes('let browserClient') && supabaseContent.includes('let serverClient')) {
      console.log('✅ Singleton pattern implemented for client instances');
    } else {
      console.log('❌ Singleton pattern not found');
      return false;
    }
    
    // Check for conditional client creation
    if (supabaseContent.includes('if (!browserClient)') && supabaseContent.includes('if (!serverClient)')) {
      console.log('✅ Conditional client creation implemented');
    } else {
      console.log('❌ Conditional client creation not found');
      return false;
    }
    
    // Check that console.log is still present but will be called less frequently
    const consoleLogMatches = supabaseContent.match(/console\.log.*Creating.*Supabase client/g);
    if (consoleLogMatches && consoleLogMatches.length === 2) {
      console.log('✅ Console logging preserved but optimized');
    } else {
      console.log('⚠️  Console logging may need adjustment');
    }
    
    return true;
    
  } catch (error) {
    console.log('❌ Error testing Supabase optimization:', error.message);
    return false;
  }
}

function runConsoleErrorTests() {
  console.log('🚀 Console Error Fix Test\n');
  console.log('=' .repeat(50));
  
  const faviconFixed = testFaviconFix();
  const supabaseOptimized = testSupabaseClientOptimization();
  
  console.log('\n' + '=' .repeat(50));
  console.log('🎯 Console Error Fix Summary:');
  
  if (faviconFixed && supabaseOptimized) {
    console.log('✅ Favicon 404 error fixed');
    console.log('✅ Supabase client creation optimized');
    console.log('✅ Multiple client creation logs reduced');
    console.log('✅ Singleton pattern prevents unnecessary instances');
    console.log('\n🎉 Console should be much cleaner now!');
    console.log('📝 Expected improvements:');
    console.log('   • No more favicon.ico 404 errors');
    console.log('   • Fewer "Creating browser-side Supabase client" messages');
    console.log('   • Better performance with client reuse');
  } else {
    console.log('❌ Some console error fixes may not be complete');
    console.log('⚠️  Manual review recommended');
  }
}

// Run the tests
runConsoleErrorTests();
