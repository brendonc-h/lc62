-- 🔒 IMMEDIATE SECURITY FIXES FOR LA CASITA
-- Run these SQL commands in your Supabase SQL editor

-- ==========================================
-- 1. FIX SECURITY DEFINER VIEW (CRITICAL)
-- ==========================================

-- Drop the problematic view
DROP VIEW IF EXISTS public.order_details;

-- Create a secure view with proper permissions
CREATE VIEW public.order_details
WITH (security_invoker=true)
AS
SELECT
  o.id,
  o.customer_id,
  o.total_price,
  o.status,
  o.created_at,
  o.updated_at,
  o.notes,
  -- Only include customer info for authorized users
  CASE
    WHEN auth.uid() = o.customer_id OR auth.jwt() ->> 'role' IN ('admin', 'kitchen')
    THEN o.notes::jsonb
    ELSE NULL
  END as customer_info
FROM orders o
WHERE
  -- Only show orders to authorized users
  auth.uid() = o.customer_id OR
  auth.jwt() ->> 'role' IN ('admin', 'kitchen');

-- ==========================================
-- 2. ENABLE ROW LEVEL SECURITY (RLS)
-- ==========================================

-- Enable RLS on orders table
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own orders, admins/kitchen can view all
CREATE POLICY "orders_select_policy" ON orders
FOR SELECT USING (
  auth.uid() = customer_id OR 
  auth.jwt() ->> 'role' IN ('admin', 'kitchen')
);

-- Policy: Users can insert their own orders
CREATE POLICY "orders_insert_policy" ON orders
FOR INSERT WITH CHECK (
  auth.uid() = customer_id OR
  auth.jwt() ->> 'role' IN ('admin', 'kitchen')
);

-- Policy: Only admins/kitchen can update orders
CREATE POLICY "orders_update_policy" ON orders
FOR UPDATE USING (
  auth.jwt() ->> 'role' IN ('admin', 'kitchen')
);

-- Enable RLS on order_items table
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view items for their orders
CREATE POLICY "order_items_select_policy" ON order_items
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM orders 
    WHERE orders.id = order_items.order_id 
    AND (
      auth.uid() = orders.customer_id OR 
      auth.jwt() ->> 'role' IN ('admin', 'kitchen')
    )
  )
);

-- Policy: Users can insert items for their orders
CREATE POLICY "order_items_insert_policy" ON order_items
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM orders 
    WHERE orders.id = order_items.order_id 
    AND (
      auth.uid() = orders.customer_id OR
      auth.jwt() ->> 'role' IN ('admin', 'kitchen')
    )
  )
);

-- Enable RLS on customers table
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own profile
CREATE POLICY "customers_select_policy" ON customers
FOR SELECT USING (
  auth.uid() = auth_id OR
  auth.jwt() ->> 'role' IN ('admin')
);

-- Policy: Users can update their own profile
CREATE POLICY "customers_update_policy" ON customers
FOR UPDATE USING (
  auth.uid() = auth_id
);

-- Policy: Anyone can insert (for registration)
CREATE POLICY "customers_insert_policy" ON customers
FOR INSERT WITH CHECK (true);

-- ==========================================
-- 3. SECURE MENU ITEMS (READ-ONLY FOR CUSTOMERS)
-- ==========================================

-- Enable RLS on menu_items (if it exists)
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can read menu items
CREATE POLICY "menu_items_select_policy" ON menu_items
FOR SELECT USING (true);

-- Policy: Only admins can modify menu items
CREATE POLICY "menu_items_insert_policy" ON menu_items
FOR INSERT WITH CHECK (
  auth.jwt() ->> 'role' = 'admin'
);

CREATE POLICY "menu_items_update_policy" ON menu_items
FOR UPDATE USING (
  auth.jwt() ->> 'role' = 'admin'
);

CREATE POLICY "menu_items_delete_policy" ON menu_items
FOR DELETE USING (
  auth.jwt() ->> 'role' = 'admin'
);

-- ==========================================
-- 4. CREATE SECURE FUNCTIONS
-- ==========================================

-- Function to get user's own orders
CREATE OR REPLACE FUNCTION get_user_orders()
RETURNS TABLE (
  id uuid,
  total_price decimal,
  status text,
  created_at timestamp,
  items jsonb
)
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    o.id,
    o.total_price,
    o.status,
    o.created_at,
    o.notes as items
  FROM orders o
  WHERE o.customer_id = auth.uid()
  ORDER BY o.created_at DESC;
END;
$$;

-- Function to get kitchen orders (admin/kitchen only)
CREATE OR REPLACE FUNCTION get_kitchen_orders()
RETURNS TABLE (
  id uuid,
  customer_id uuid,
  total_price decimal,
  status text,
  created_at timestamp,
  customer_info jsonb,
  items jsonb
)
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  -- Check if user has kitchen/admin role
  IF auth.jwt() ->> 'role' NOT IN ('admin', 'kitchen') THEN
    RAISE EXCEPTION 'Unauthorized access';
  END IF;

  RETURN QUERY
  SELECT 
    o.id,
    o.customer_id,
    o.total_price,
    o.status,
    o.created_at,
    o.notes as customer_info,
    o.notes as items
  FROM orders o
  ORDER BY o.created_at DESC;
END;
$$;

-- ==========================================
-- 5. AUDIT LOGGING SETUP
-- ==========================================

-- Create audit log table
CREATE TABLE IF NOT EXISTS audit_log (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  table_name text NOT NULL,
  operation text NOT NULL,
  old_data jsonb,
  new_data jsonb,
  user_id uuid REFERENCES auth.users(id),
  created_at timestamp DEFAULT now()
);

-- Enable RLS on audit log
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs
CREATE POLICY "audit_log_select_policy" ON audit_log
FOR SELECT USING (
  auth.jwt() ->> 'role' = 'admin'
);

-- Create audit trigger function
CREATE OR REPLACE FUNCTION audit_trigger()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO audit_log (
    table_name,
    operation,
    old_data,
    new_data,
    user_id
  ) VALUES (
    TG_TABLE_NAME,
    TG_OP,
    CASE WHEN TG_OP = 'DELETE' THEN to_jsonb(OLD) ELSE NULL END,
    CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN to_jsonb(NEW) ELSE NULL END,
    auth.uid()
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Add audit triggers to important tables
CREATE TRIGGER orders_audit_trigger
  AFTER INSERT OR UPDATE OR DELETE ON orders
  FOR EACH ROW EXECUTE FUNCTION audit_trigger();

CREATE TRIGGER customers_audit_trigger
  AFTER INSERT OR UPDATE OR DELETE ON customers
  FOR EACH ROW EXECUTE FUNCTION audit_trigger();

-- ==========================================
-- 6. VERIFICATION QUERIES
-- ==========================================

-- Run these to verify the fixes worked:

-- Check RLS is enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('orders', 'order_items', 'customers', 'menu_items');

-- Check policies exist
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies 
WHERE schemaname = 'public';

-- Check view definition
SELECT definition 
FROM pg_views 
WHERE schemaname = 'public' 
AND viewname = 'order_details';

-- ==========================================
-- NOTES:
-- ==========================================
-- 1. Run these commands in your Supabase SQL editor
-- 2. Test thoroughly in development before applying to production
-- 3. Backup your database before making changes
-- 4. Monitor for any application errors after applying
-- 5. Update your application code to use the new secure functions if needed
