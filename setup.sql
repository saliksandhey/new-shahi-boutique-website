-- Phase 5 Required Tables

-- 1. Store Settings (for Razorpay keys)
CREATE TABLE IF NOT EXISTS public.store_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR NOT NULL UNIQUE,
    value TEXT NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- RLS for Store Settings (Admin only)
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read access to public for safe keys" ON public.store_settings 
    FOR SELECT USING (key NOT LIKE '%secret%');

CREATE POLICY "Allow all access to authenticated users" ON public.store_settings 
    FOR ALL USING (auth.role() = 'authenticated'); -- Adjust if you have a specific admin role


-- 2. Cart Items
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
CREATE POLICY "Users can manage their own cart" ON public.cart_items 
    FOR ALL USING (auth.uid() = user_id);


-- 3. Orders
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
CREATE POLICY "Users can view their own orders" ON public.orders 
    FOR SELECT USING (auth.uid() = user_id);


-- 4. Order Items
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
CREATE POLICY "Users can view their own order items" ON public.order_items 
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.orders WHERE id = order_items.order_id AND user_id = auth.uid())
    );

-- Helper function to generate order number
CREATE SEQUENCE IF NOT EXISTS order_seq START 1;
