-- 1. Fix Product Images mapping
ALTER TABLE product_images RENAME COLUMN is_main TO is_primary;
ALTER TABLE product_images RENAME COLUMN display_order TO position;

-- 2. Fix Product Variants mapping
ALTER TABLE product_variants RENAME COLUMN price TO price_override;
ALTER TABLE product_variants RENAME COLUMN sale_price TO sale_price_override;
ALTER TABLE product_variants ALTER COLUMN price_override DROP NOT NULL;

-- 3. Create missing product_size_guides table
CREATE TABLE IF NOT EXISTS product_size_guides (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  size_name TEXT NOT NULL,
  chest TEXT,
  length TEXT,
  shoulder TEXT,
  sleeve TEXT,
  waist TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Disable RLS on the new table
ALTER TABLE product_size_guides DISABLE ROW LEVEL SECURITY;
