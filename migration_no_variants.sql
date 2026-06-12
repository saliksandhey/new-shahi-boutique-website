-- 1. Create customer_profiles table
CREATE TABLE IF NOT EXISTS customer_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Update orders table to include explicit customer details directly
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS customer_name TEXT,
ADD COLUMN IF NOT EXISTS customer_email TEXT,
ADD COLUMN IF NOT EXISTS customer_phone TEXT,
ADD COLUMN IF NOT EXISTS shipping_address_line1 TEXT,
ADD COLUMN IF NOT EXISTS shipping_address_line2 TEXT,
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS state TEXT,
ADD COLUMN IF NOT EXISTS postal_code TEXT,
ADD COLUMN IF NOT EXISTS country TEXT;

-- 3. Update products table to simplify without variants
ALTER TABLE products
ADD COLUMN IF NOT EXISTS short_description TEXT,
ADD COLUMN IF NOT EXISTS price DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS sale_price DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS stock_quantity INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'ACTIVE',
ADD COLUMN IF NOT EXISTS fabric TEXT,
ADD COLUMN IF NOT EXISTS care_instructions TEXT,
ADD COLUMN IF NOT EXISTS meta_title TEXT,
ADD COLUMN IF NOT EXISTS meta_description TEXT;

-- 4. Move data from product_variants to products if there is any
UPDATE products p
SET 
  price = COALESCE((SELECT price FROM product_variants v WHERE v.product_id = p.id ORDER BY created_at ASC LIMIT 1), 0),
  sale_price = (SELECT sale_price FROM product_variants v WHERE v.product_id = p.id ORDER BY created_at ASC LIMIT 1),
  stock_quantity = COALESCE((SELECT SUM(stock_quantity) FROM product_variants v WHERE v.product_id = p.id), 0)
WHERE EXISTS (
  SELECT 1 FROM information_schema.tables WHERE table_name = 'product_variants'
) AND EXISTS (
  SELECT 1 FROM product_variants v WHERE v.product_id = p.id
);

-- 5. Drop product_variants
DROP TABLE IF EXISTS product_variants CASCADE;

-- 6. RLS Policies
ALTER TABLE customer_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Customers can view their own profile" ON customer_profiles;
CREATE POLICY "Customers can view their own profile" ON customer_profiles 
FOR SELECT USING (email = current_setting('request.jwt.claims', true)::jsonb->>'email');

DROP POLICY IF EXISTS "Customers can update their own profile" ON customer_profiles;
CREATE POLICY "Customers can update their own profile" ON customer_profiles 
FOR UPDATE USING (email = current_setting('request.jwt.claims', true)::jsonb->>'email');

-- Fix orders policies: Orders belong to email
DROP POLICY IF EXISTS "Users can view their own orders" ON orders;
DROP POLICY IF EXISTS "Users can view their own orders via email" ON orders;
CREATE POLICY "Users can view their own orders via email" ON orders
FOR SELECT USING (customer_email = current_setting('request.jwt.claims', true)::jsonb->>'email');

DROP POLICY IF EXISTS "Users can view their own order items" ON order_items;
DROP POLICY IF EXISTS "Users can view their own order items via email" ON order_items;
CREATE POLICY "Users can view their own order items via email" ON order_items
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM orders 
    WHERE orders.id = order_items.order_id 
    AND orders.customer_email = current_setting('request.jwt.claims', true)::jsonb->>'email'
  )
);
