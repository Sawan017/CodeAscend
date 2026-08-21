-- ==========================================
-- Notifications System
-- ==========================================

CREATE TABLE IF NOT EXISTS public.notifications (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    type text NOT NULL,
    title text NOT NULL,
    body text,
    read boolean DEFAULT false,
    created_at timestamptz DEFAULT now(),
    link_type text,
    link_id text
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at DESC);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notifications"
    ON public.notifications
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
    ON public.notifications
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notifications"
    ON public.notifications
    FOR DELETE
    USING (auth.uid() = user_id);

-- No INSERT policy for client (only backend RPCs / triggers insert notifications to guarantee security)
-- Wait, learning reminders might need client insert? 
-- The user request said: "If a notification table or required fields are missing, create the minimum required structure. Use authenticated user IDs consistently."
-- I'll allow users to insert their own notifications (e.g. learning reminders).
CREATE POLICY "Users can insert their own notifications"
    ON public.notifications
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Real-time
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
