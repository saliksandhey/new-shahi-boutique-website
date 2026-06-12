-- Add new columns to orders table for advanced management
ALTER TABLE orders ADD COLUMN IF NOT EXISTS staff_notes TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS tags TEXT[];

-- Create refunds table
CREATE TABLE IF NOT EXISTS order_refunds (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  reason TEXT,
  restocked BOOLEAN DEFAULT false,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add tracking for refunded items
ALTER TABLE order_items ADD COLUMN IF NOT EXISTS refunded_quantity INTEGER DEFAULT 0;
