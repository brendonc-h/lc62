-- 🔍 VERIFICATION SCRIPT FOR SECURITY SETUP
-- Run this to check if the security fixes were applied correctly

-- ==========================================
-- 1. CHECK IF RLS IS ENABLED
-- ==========================================
SELECT 
  schemaname, 
  tablename, 
  rowsecurity as "RLS Enabled"
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('orders', 'customers', 'order_items', 'menu_items')
ORDER BY tablename;

-- ==========================================
-- 2. CHECK EXISTING POLICIES
-- ==========================================
SELECT 
  schemaname,
  tablename,
  policyname,
  cmd as "Command Type",
  CASE 
    WHEN cmd = 'SELECT' THEN 'Read Access'
    WHEN cmd = 'INSERT' THEN 'Create Access'
    WHEN cmd = 'UPDATE' THEN 'Update Access'
    WHEN cmd = 'DELETE' THEN 'Delete Access'
    ELSE cmd
  END as "Access Type"
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, cmd, policyname;

-- ==========================================
-- 3. CHECK VIEW DEFINITION
-- ==========================================
SELECT 
  viewname,
  definition
FROM pg_views 
WHERE schemaname = 'public' 
AND viewname = 'order_details';

-- ==========================================
-- 4. CHECK FUNCTIONS
-- ==========================================
SELECT 
  routine_name,
  routine_type,
  security_type
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name IN ('get_user_orders', 'get_kitchen_orders');

-- ==========================================
-- 5. CHECK TABLE STRUCTURE
-- ==========================================
-- Check orders table columns
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'orders'
ORDER BY ordinal_position;

-- Check customers table columns
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'customers'
ORDER BY ordinal_position;

-- ==========================================
-- 6. TEST BASIC FUNCTIONALITY
-- ==========================================
-- Count records in each table (this will test basic access)
SELECT 'orders' as table_name, COUNT(*) as record_count FROM orders
UNION ALL
SELECT 'customers' as table_name, COUNT(*) as record_count FROM customers
UNION ALL
SELECT 'menu_items' as table_name, COUNT(*) as record_count FROM menu_items;

-- ==========================================
-- INSTRUCTIONS
-- ==========================================
-- Run this entire script in your Supabase SQL editor
-- Review all the output sections to verify:
-- 1. RLS is enabled on all tables
-- 2. Policies exist for each table
-- 3. The order_details view exists
-- 4. Helper functions were created
-- 5. Tables have the expected structure
