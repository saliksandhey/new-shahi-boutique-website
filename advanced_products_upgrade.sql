-- 1. Upgrade `products` table
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS fabric VARCHAR,
ADD COLUMN IF NOT EXISTS material VARCHAR,
ADD COLUMN IF NOT EXISTS care_instructions TEXT,
ADD COLUMN IF NOT EXISTS country_of_origin VARCHAR,
ADD COLUMN IF NOT EXISTS weight DECIMAL,
ADD COLUMN IF NOT EXISTS dimensions VARCHAR,
ADD COLUMN IF NOT EXISTS meta_title VARCHAR,
ADD COLUMN IF NOT EXISTS meta_description TEXT,
ADD COLUMN IF NOT EXISTS og_image VARCHAR,
ADD COLUMN IF NOT EXISTS keywords VARCHAR,
ADD COLUMN IF NOT EXISTS canonical_url VARCHAR;

-- 2. Upgrade `product_images` table
ALTER TABLE public.product_images
ADD COLUMN IF NOT EXISTS position INTEGER DEFAULT 0;

-- 3. Upgrade `product_variants` table
-- We'll add the new columns and keep size/color for fallback, or migrate them.
ALTER TABLE public.product_variants
ADD COLUMN IF NOT EXISTS sku VARCHAR,
ADD COLUMN IF NOT EXISTS price_override DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS sale_price_override DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS attributes JSONB DEFAULT '{}'::jsonb;

-- Migrate existing size and color into attributes JSONB if they exist
UPDATE public.product_variants
SET attributes = jsonb_build_object(
  'Size', size,
  'Color', color
)
WHERE size IS NOT NULL OR color IS NOT NULL;

-- 4. Create `product_size_guides` table
CREATE TABLE IF NOT EXISTS public.product_size_guides (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    size_name VARCHAR NOT NULL,
    chest VARCHAR,
    length VARCHAR,
    shoulder VARCHAR,
    sleeve VARCHAR,
    waist VARCHAR,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

ALTER TABLE public.product_size_guides ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Product size guides viewable by everyone." ON public.product_size_guides FOR SELECT USING (true);
