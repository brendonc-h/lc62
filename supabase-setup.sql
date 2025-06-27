-- La Casita Restaurant App Database Setup
-- Run this SQL in your Supabase SQL Editor

-- Drop existing tables if they exist (careful with production data!)
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS menu_items CASCADE;

-- Create customers table
CREATE TABLE customers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  auth_id UUID UNIQUE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  points INTEGER DEFAULT 0,
  role TEXT DEFAULT 'customer',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add foreign key constraint separately (safer)
ALTER TABLE customers 
ADD CONSTRAINT customers_auth_id_fkey 
FOREIGN KEY (auth_id) 
REFERENCES auth.users(id) 
ON DELETE CASCADE;

-- Create menu_items table
CREATE TABLE menu_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  category TEXT,
  available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create orders table
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  total_price DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create order_items table
CREATE TABLE order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  menu_item_id UUID REFERENCES menu_items(id),
  quantity INTEGER NOT NULL,
  price_each DECIMAL(10,2) NOT NULL,
  special_instructions TEXT
);

-- Enable Row Level Security
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own customer record" ON customers;
DROP POLICY IF EXISTS "Users can insert own customer record" ON customers;
DROP POLICY IF EXISTS "Users can update own customer record" ON customers;
DROP POLICY IF EXISTS "Users can view own orders" ON orders;
DROP POLICY IF EXISTS "Users can view own order items" ON order_items;
DROP POLICY IF EXISTS "Anyone can view menu items" ON menu_items;

-- RLS Policies for customers
CREATE POLICY "Users can view own customer record" ON customers
  FOR SELECT USING (auth_id = auth.uid());

CREATE POLICY "Users can insert own customer record" ON customers
  FOR INSERT WITH CHECK (auth_id = auth.uid());

CREATE POLICY "Users can update own customer record" ON customers
  FOR UPDATE USING (auth_id = auth.uid());

-- RLS Policies for orders
CREATE POLICY "Users can view own orders" ON orders
  FOR SELECT USING (customer_id IN (
    SELECT id FROM customers WHERE auth_id = auth.uid()
  ));

CREATE POLICY "Users can insert own orders" ON orders
  FOR INSERT WITH CHECK (customer_id IN (
    SELECT id FROM customers WHERE auth_id = auth.uid()
  ));

-- RLS Policies for order_items
CREATE POLICY "Users can view own order items" ON order_items
  FOR SELECT USING (order_id IN (
    SELECT id FROM orders WHERE customer_id IN (
      SELECT id FROM customers WHERE auth_id = auth.uid()
    )
  ));

CREATE POLICY "Users can insert own order items" ON order_items
  FOR INSERT WITH CHECK (order_id IN (
    SELECT id FROM orders WHERE customer_id IN (
      SELECT id FROM customers WHERE auth_id = auth.uid()
    )
  ));

-- Public read for menu_items
CREATE POLICY "Anyone can view menu items" ON menu_items
  FOR SELECT USING (true);

-- Insert some sample menu items
INSERT INTO menu_items (name, description, price, category) VALUES
('Chicken Burrito', 'Grilled chicken with rice, beans, cheese, and salsa', 12.99, 'Burritos'),
('Beef Tacos', 'Three soft shell tacos with seasoned beef', 9.99, 'Tacos'),
('Cheese Quesadilla', 'Crispy tortilla filled with melted cheese', 8.99, 'Quesadillas'),
('Guacamole & Chips', 'Fresh guacamole served with tortilla chips', 6.99, 'Appetizers'),
('Chicken Fajitas', 'Sizzling chicken fajitas with peppers and onions', 15.99, 'Entrees')
ON CONFLICT DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_customers_auth_id ON customers(auth_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_category ON menu_items(category);
