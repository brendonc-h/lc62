-- 🔧 SUPABASE DEVELOPMENT CONFIGURATION
-- Run this in your Supabase SQL Editor to configure for development

-- ==========================================
-- 1. DISABLE EMAIL CONFIRMATION FOR DEVELOPMENT
-- ==========================================

-- Note: This should be done in Supabase Dashboard > Authentication > Settings
-- Set "Enable email confirmations" to OFF for development
-- Set "Enable email confirmations" to ON for production

-- ==========================================
-- 2. CHECK CURRENT AUTH SETTINGS
-- ==========================================

-- Check current auth configuration
SELECT 
  raw_app_meta_data,
  raw_user_meta_data,
  email_confirmed_at,
  created_at
FROM auth.users 
ORDER BY created_at DESC 
LIMIT 5;

-- ==========================================
-- 3. MANUALLY CONFIRM USERS (DEVELOPMENT ONLY)
-- ==========================================

-- If you have users that need to be confirmed manually in development:
-- UPDATE auth.users 
-- SET email_confirmed_at = NOW()
-- WHERE email_confirmed_at IS NULL;

-- ==========================================
-- 4. CHECK RLS POLICIES FOR CUSTOMERS TABLE
-- ==========================================

-- Verify that the customer creation policy allows signup
SELECT 
  schemaname,
  tablename,
  policyname,
  cmd,
  permissive,
  roles,
  qual
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename = 'customers'
ORDER BY policyname;

-- ==========================================
-- 5. TEST CUSTOMER CREATION
-- ==========================================

-- Test if we can insert a customer record (this should work with proper RLS)
-- DO NOT RUN THIS - Just for reference
-- INSERT INTO customers (auth_id, name, email, role, points)
-- VALUES ('test-uuid', 'Test User', 'test@example.com', 'customer', 0);

-- ==========================================
-- INSTRUCTIONS FOR SUPABASE DASHBOARD
-- ==========================================

/*
To properly configure for development:

1. Go to Supabase Dashboard > Authentication > Settings
2. Under "User Signups" section:
   - Set "Enable email confirmations" to OFF (for development)
   - Set "Enable phone confirmations" to OFF (for development)
3. Under "Email Templates" section:
   - You can customize the confirmation email template if needed
4. Save the settings

For Production:
- Enable email confirmations
- Configure proper SMTP settings
- Test email delivery
*/
