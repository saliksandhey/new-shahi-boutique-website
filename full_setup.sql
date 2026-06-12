-- FULL DATABASE SCHEMA FOR SHAHI BOUTIQUE

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-------------------------------------------------
-- 1. PROFILES
-------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR NOT NULL UNIQUE,
    full_name VARCHAR,
    phone VARCHAR,
    role VARCHAR DEFAULT 'CUSTOMER',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile." ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);

-------------------------------------------------
-- 2. CATEGORIES
-------------------------------------------------
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR NOT NULL,
    slug VARCHAR NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Categories are viewable by everyone." ON public.categories FOR SELECT USING (true);

-------------------------------------------------
-- 3. PRODUCTS
-------------------------------------------------
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    name VARCHAR NOT NULL,
    slug VARCHAR NOT NULL UNIQUE,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    sale_price DECIMAL(10,2),
    stock_quantity INTEGER NOT NULL DEFAULT 0,
    status VARCHAR DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Products are viewable by everyone." ON public.products FOR SELECT USING (true);

-------------------------------------------------
-- 4. PRODUCT IMAGES
-------------------------------------------------
CREATE TABLE IF NOT EXISTS public.product_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    url VARCHAR NOT NULL,
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Product images viewable by everyone." ON public.product_images FOR SELECT USING (true);

-------------------------------------------------
-- 5. PRODUCT VARIANTS
-------------------------------------------------
CREATE TABLE IF NOT EXISTS public.product_variants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    size VARCHAR,
    color VARCHAR,
    stock_quantity INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Product variants viewable by everyone." ON public.product_variants FOR SELECT USING (true);

-------------------------------------------------
-- 6. COUPONS
-------------------------------------------------
CREATE TABLE IF NOT EXISTS public.coupons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR NOT NULL UNIQUE,
    discount_type VARCHAR NOT NULL, -- 'percentage' or 'fixed'
    discount_value DECIMAL(10,2) NOT NULL,
    min_purchase_amount DECIMAL(10,2) DEFAULT 0,
    valid_until TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Coupons viewable by everyone." ON public.coupons FOR SELECT USING (is_active = true);

-------------------------------------------------
-- 7. STORE SETTINGS
-------------------------------------------------
CREATE TABLE IF NOT EXISTS public.store_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR NOT NULL UNIQUE,
    value TEXT NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read access to public for safe keys" ON public.store_settings FOR SELECT USING (key NOT LIKE '%secret%');

-------------------------------------------------
-- 8. CART ITEMS
-------------------------------------------------
CREATE TABLE IF NOT EXISTS public.cart_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    variant_id UUID REFERENCES public.product_variants(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    UNIQUE(user_id, product_id, variant_id)
);

ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own cart" ON public.cart_items FOR ALL USING (auth.uid() = user_id);

-------------------------------------------------
-- 9. ORDERS
-------------------------------------------------
CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled');
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'failed', 'refunded');

CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number VARCHAR NOT NULL UNIQUE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    shipping_cost DECIMAL(10,2) NOT NULL DEFAULT 0,
    discount_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    coupon_id UUID REFERENCES public.coupons(id) ON DELETE SET NULL,
    status order_status DEFAULT 'pending',
    payment_status payment_status DEFAULT 'pending',
    payment_method VARCHAR NOT NULL,
    razorpay_order_id VARCHAR,
    razorpay_payment_id VARCHAR,
    shipping_address JSONB NOT NULL,
    tracking_number VARCHAR,
    courier_name VARCHAR,
    tracking_url VARCHAR,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id);

-------------------------------------------------
-- 10. ORDER ITEMS
-------------------------------------------------
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    variant_id UUID REFERENCES public.product_variants(id) ON DELETE SET NULL,
    product_name VARCHAR NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    quantity INTEGER NOT NULL,
    size VARCHAR,
    color VARCHAR,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own order items" ON public.order_items FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.orders WHERE id = order_items.order_id AND user_id = auth.uid())
);

-------------------------------------------------
-- UTILITIES
-------------------------------------------------
-- Sequence for Order Numbers
CREATE SEQUENCE IF NOT EXISTS order_seq START 1;

-- RPC for Top Products
CREATE OR REPLACE FUNCTION get_top_products(limit_num INT DEFAULT 5)
RETURNS TABLE (
    product_name VARCHAR,
    total_sold BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        oi.product_name, 
        SUM(oi.quantity) as total_sold
    FROM public.order_items oi
    JOIN public.orders o ON o.id = oi.order_id
    WHERE o.payment_status = 'paid'
    GROUP BY oi.product_name
    ORDER BY total_sold DESC
    LIMIT limit_num;
END;
$$ LANGUAGE plpgsql;
