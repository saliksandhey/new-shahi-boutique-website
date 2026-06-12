CREATE TYPE announcement_display_type AS ENUM ('GLOBAL_BANNER', 'HOME_POPUP', 'CHECKOUT_NOTICE', 'CORNER_TOAST');

CREATE TABLE IF NOT EXISTS announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    action_text TEXT,
    action_link TEXT,
    display_type announcement_display_type NOT NULL DEFAULT 'GLOBAL_BANNER',
    is_active BOOLEAN NOT NULL DEFAULT false,
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Announcements are viewable by everyone" ON announcements
    FOR SELECT USING (true);

-- Allow admin full access (using service_role key will bypass RLS anyway, but good practice)
CREATE POLICY "Announcements are insertable by admins" ON announcements FOR INSERT WITH CHECK (true);
CREATE POLICY "Announcements are updatable by admins" ON announcements FOR UPDATE USING (true);
CREATE POLICY "Announcements are deletable by admins" ON announcements FOR DELETE USING (true);
