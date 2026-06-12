-- 1. Add the customer_email column to orders
ALTER TABLE public.orders ADD COLUMN customer_email TEXT;

-- 2. Backfill existing orders by extracting the email from the shipping_address JSONB
UPDATE public.orders
SET customer_email = shipping_address->>'email'
WHERE customer_email IS NULL;

-- 3. Now that all existing rows have an email, enforce NOT NULL
ALTER TABLE public.orders ALTER COLUMN customer_email SET NOT NULL;

-- 4. Add RLS Policy so customers can see their own orders based on their authenticated email
-- Note: 'orders' table must have RLS enabled first if it isn't already.
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to view their own orders via customer_email
DROP POLICY IF EXISTS "Customers can view their own orders via email" ON public.orders;
CREATE POLICY "Customers can view their own orders via email" 
ON public.orders FOR SELECT 
USING ( customer_email = auth.jwt()->>'email' );

-- Admins also need access. We can create an admin policy or use service role.
-- (If you access orders via admin pages using service_role, RLS is automatically bypassed).
