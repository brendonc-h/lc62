-- 🔍 DATABASE SCHEMA DISCOVERY
-- Run this first to understand your current database structure

-- ==========================================
-- 1. CHECK EXISTING TABLES AND COLUMNS
-- ==========================================

-- List all tables in public schema
SELECT table_name, table_type
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- Check orders table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'orders'
ORDER BY ordinal_position;

-- Check order_items table structure (if it exists)
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'order_items'
ORDER BY ordinal_position;

-- Check customers table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'customers'
ORDER BY ordinal_position;

-- Check menu_items table structure (if it exists)
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'menu_items'
ORDER BY ordinal_position;

-- ==========================================
-- 2. CHECK EXISTING VIEWS
-- ==========================================

-- List all views
SELECT table_name, view_definition
FROM information_schema.views 
WHERE table_schema = 'public';

-- Check if order_details view exists and its definition
SELECT definition 
FROM pg_views 
WHERE schemaname = 'public' 
AND viewname = 'order_details';

-- ==========================================
-- 3. CHECK EXISTING RLS POLICIES
-- ==========================================

-- Check which tables have RLS enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';

-- Check existing policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies 
WHERE schemaname = 'public';

-- ==========================================
-- 4. CHECK FOREIGN KEY RELATIONSHIPS
-- ==========================================

SELECT 
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM 
    information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
AND tc.table_schema = 'public';

-- ==========================================
-- 5. SAMPLE DATA CHECK
-- ==========================================

-- Check if there's data in orders table
SELECT COUNT(*) as order_count FROM orders;

-- Check if there's data in customers table  
SELECT COUNT(*) as customer_count FROM customers;

-- Check order structure (first few records)
SELECT id, customer_id, total_price, status, created_at, 
       CASE 
         WHEN length(notes::text) > 100 
         THEN left(notes::text, 100) || '...'
         ELSE notes::text
       END as notes_preview
FROM orders 
LIMIT 3;

-- ==========================================
-- INSTRUCTIONS:
-- ==========================================
-- 1. Run this script in your Supabase SQL editor
-- 2. Review the output to understand your database structure
-- 3. Share the results so I can create the correct security fixes
-- 4. Pay special attention to:
--    - Column names in orders and order_items tables
--    - Whether order_items table exists
--    - Current RLS status
--    - Existing view definitions
