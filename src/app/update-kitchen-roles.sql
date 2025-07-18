-- Update all users with 'kitchen' role to 'admin' role
UPDATE customers
SET role = 'admin'
WHERE role = 'kitchen';
