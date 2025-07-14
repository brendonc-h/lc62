-- Step 2: Check existing RLS policies
SELECT 
  tablename,
  policyname,
  cmd as "command_type"
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, cmd, policyname;
