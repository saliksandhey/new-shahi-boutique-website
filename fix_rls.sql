-- Run this in your Supabase SQL Editor to fix the RLS violation errors.
-- This disables Row-Level Security (RLS) on all your tables so that your 
-- Next.js backend can seamlessly insert and update records using the standard anonymous key.

ALTER TABLE categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants DISABLE ROW LEVEL SECURITY;
ALTER TABLE product_images DISABLE ROW LEVEL SECURITY;
ALTER TABLE coupons DISABLE ROW LEVEL SECURITY;
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE order_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE order_timeline DISABLE ROW LEVEL SECURITY;
ALTER TABLE order_refunds DISABLE ROW LEVEL SECURITY;
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- If you prefer keeping RLS enabled but want to explicitly grant full access to everyone (Anon),
-- you can alternatively run the following (uncomment them):
-- CREATE POLICY "Enable full access to categories" ON categories FOR ALL USING (true) WITH CHECK (true);
