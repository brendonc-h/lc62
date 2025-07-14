-- Step 1: Check if Row Level Security is enabled
SELECT 
  schemaname, 
  tablename, 
  rowsecurity as "RLS_Enabled"
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('orders', 'customers', 'order_items', 'menu_items')
ORDER BY tablename;
