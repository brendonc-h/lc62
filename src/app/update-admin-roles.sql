-- Ensure admin roles for La Casita staff emails
UPDATE customers
SET role = 'admin'
WHERE email IN (
  'info@lacasita.io',
  'berthoud@lacasita.io',
  'fortcollins@lacasita.io'
);

-- Create missing customer records if they don't exist
INSERT INTO customers (
  auth_id,
  name,
  first_name,
  last_name,
  email,
  role,
  points
)
SELECT 
  u.id as auth_id,
  COALESCE(u.raw_user_meta_data->>'name', u.email) as name,
  COALESCE(u.raw_user_meta_data->>'first_name', split_part(u.email, '@', 1)) as first_name,
  COALESCE(u.raw_user_meta_data->>'last_name', '') as last_name,
  u.email,
  'admin' as role,
  0 as points
FROM auth.users u
LEFT JOIN customers c ON u.id = c.auth_id
WHERE u.email IN (
  'info@lacasita.io',
  'berthoud@lacasita.io',
  'fortcollins@lacasita.io'
)
AND c.id IS NULL;
