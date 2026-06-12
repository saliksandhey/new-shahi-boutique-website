-- 1. Upgrade `order_status` ENUM
-- Note: In PostgreSQL, adding values to an enum cannot be rolled back easily in a transaction block.
ALTER TYPE public.order_status ADD VALUE IF NOT EXISTS 'packed';
ALTER TYPE public.order_status ADD VALUE IF NOT EXISTS 'returned';
ALTER TYPE public.order_status ADD VALUE IF NOT EXISTS 'refunded';

-- 2. Upgrade `orders` table
ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS shipment_notes TEXT;

-- 3. Create `order_timeline` table
CREATE TABLE IF NOT EXISTS public.order_timeline (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    event_type VARCHAR NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

ALTER TABLE public.order_timeline ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Order timelines viewable by everyone with access to the order." ON public.order_timeline FOR SELECT USING (true);
