-- Drop the existing customer record insert policy that's too restrictive
DROP POLICY IF EXISTS "Users can insert own customer record" ON customers;

-- Create a new policy that allows service role and authenticated users to insert customers
CREATE POLICY "Allow customer record creation" ON customers
  FOR INSERT WITH CHECK (true);

-- Optional: If you want to restrict this more but still allow your API to work, 
-- you could use a more specific policy instead:
-- CREATE POLICY "Allow customer record creation during signup" ON customers
--   FOR INSERT WITH CHECK (auth.role() = 'service_role' OR auth_id = auth.uid());
