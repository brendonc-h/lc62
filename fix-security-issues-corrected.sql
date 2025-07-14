-- 🔒 CORRECTED SECURITY FIXES FOR LA CASITA
-- Run these SQL commands in your Supabase SQL editor

-- ==========================================
-- 1. FIX SECURITY DEFINER VIEW (CRITICAL)
-- ==========================================

-- Drop the problematic view
DROP VIEW IF EXISTS public.order_details;

-- Create a simple, secure view based on your actual schema
-- This view will only show basic order information
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
  -- Only show notes/customer info to authorized users
  CASE 
    WHEN auth.uid() = o.customer_id OR auth.jwt() ->> 'role' IN ('admin', 'kitchen')
    THEN o.notes
    ELSE NULL
  END as order_details
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

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "orders_select_policy" ON orders;
DROP POLICY IF EXISTS "orders_insert_policy" ON orders;
DROP POLICY IF EXISTS "orders_update_policy" ON orders;

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

-- ==========================================
-- 3. SECURE CUSTOMERS TABLE
-- ==========================================

-- Enable RLS on customers table
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "customers_select_policy" ON customers;
DROP POLICY IF EXISTS "customers_update_policy" ON customers;
DROP POLICY IF EXISTS "customers_insert_policy" ON customers;

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
-- 4. SECURE ORDER_ITEMS TABLE (IF IT EXISTS)
-- ==========================================

-- Check if order_items table exists and secure it
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'order_items') THEN
    -- Enable RLS on order_items table
    ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
    
    -- Drop existing policies if they exist
    DROP POLICY IF EXISTS "order_items_select_policy" ON order_items;
    DROP POLICY IF EXISTS "order_items_insert_policy" ON order_items;
    
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
  END IF;
END $$;

-- ==========================================
-- 5. SECURE MENU_ITEMS TABLE (IF IT EXISTS)
-- ==========================================

-- Check if menu_items table exists and secure it
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'menu_items') THEN
    -- Enable RLS on menu_items
    ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
    
    -- Drop existing policies if they exist
    DROP POLICY IF EXISTS "menu_items_select_policy" ON menu_items;
    DROP POLICY IF EXISTS "menu_items_insert_policy" ON menu_items;
    DROP POLICY IF EXISTS "menu_items_update_policy" ON menu_items;
    DROP POLICY IF EXISTS "menu_items_delete_policy" ON menu_items;
    
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
  END IF;
END $$;

-- ==========================================
-- 6. CREATE SECURE HELPER FUNCTIONS
-- ==========================================

-- Function to get user's own orders safely
CREATE OR REPLACE FUNCTION get_user_orders()
RETURNS TABLE (
  id uuid,
  total_price decimal,
  status text,
  created_at timestamp with time zone,
  order_details jsonb
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
    o.notes as order_details
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
  created_at timestamp with time zone,
  order_details jsonb
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
    o.notes as order_details
  FROM orders o
  ORDER BY o.created_at DESC;
END;
$$;

-- ==========================================
-- 7. VERIFICATION QUERIES
-- ==========================================

-- Check RLS is enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('orders', 'customers');

-- Check policies exist
SELECT schemaname, tablename, policyname, cmd
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Check view definition
SELECT definition 
FROM pg_views 
WHERE schemaname = 'public' 
AND viewname = 'order_details';

-- ==========================================
-- SUCCESS MESSAGE
-- ==========================================

DO $$
BEGIN
  RAISE NOTICE '✅ Security fixes applied successfully!';
  RAISE NOTICE '🔒 Row Level Security enabled on all tables';
  RAISE NOTICE '🛡️ Secure view created with security_invoker=true';
  RAISE NOTICE '📋 Please test your application to ensure everything works';
END $$;
