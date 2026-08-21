-- ============================================================
-- GROUP CHAT SYSTEM MIGRATION
-- ============================================================

CREATE TABLE IF NOT EXISTS public.chat_groups (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    description text,
    avatar text,
    created_by uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.chat_group_members (
    group_id uuid NOT NULL REFERENCES public.chat_groups(id) ON DELETE CASCADE,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role text NOT NULL DEFAULT 'member', -- 'owner', 'admin', 'member'
    joined_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    PRIMARY KEY (group_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.chat_group_messages (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    group_id uuid NOT NULL REFERENCES public.chat_groups(id) ON DELETE CASCADE,
    sender_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    content text NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    deleted_for_everyone boolean DEFAULT false,
    edited_at timestamp with time zone
);

CREATE INDEX IF NOT EXISTS idx_chat_group_members_user_id ON public.chat_group_members(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_group_messages_group_id ON public.chat_group_messages(group_id);

ALTER TABLE public.chat_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_group_messages ENABLE ROW LEVEL SECURITY;

-- Adding to realtime using dynamic plpgsql to avoid errors if already exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'chat_groups') THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_groups;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'chat_group_members') THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_group_members;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'chat_group_messages') THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_group_messages;
    END IF;
END
$$;

DROP POLICY IF EXISTS "Users can view groups they belong to" ON public.chat_groups;
CREATE POLICY "Users can view groups they belong to" ON public.chat_groups
    FOR SELECT TO authenticated
    USING (EXISTS (SELECT 1 FROM public.chat_group_members WHERE group_id = id AND user_id = auth.uid()));

DROP POLICY IF EXISTS "Users can create groups" ON public.chat_groups;
CREATE POLICY "Users can create groups" ON public.chat_groups
    FOR INSERT TO authenticated
    WITH CHECK (auth.uid() = created_by);

DROP POLICY IF EXISTS "Admins can update groups" ON public.chat_groups;
CREATE POLICY "Admins can update groups" ON public.chat_groups
    FOR UPDATE TO authenticated
    USING (EXISTS (SELECT 1 FROM public.chat_group_members WHERE group_id = id AND user_id = auth.uid() AND role IN ('owner', 'admin')));

DROP POLICY IF EXISTS "Owners can delete groups" ON public.chat_groups;
CREATE POLICY "Owners can delete groups" ON public.chat_groups
    FOR DELETE TO authenticated
    USING (EXISTS (SELECT 1 FROM public.chat_group_members WHERE group_id = id AND user_id = auth.uid() AND role = 'owner'));

DROP POLICY IF EXISTS "Users can view members of their groups" ON public.chat_group_members;
CREATE POLICY "Users can view members of their groups" ON public.chat_group_members
    FOR SELECT TO authenticated
    USING (EXISTS (SELECT 1 FROM public.chat_group_members m2 WHERE m2.group_id = group_id AND m2.user_id = auth.uid()));

DROP POLICY IF EXISTS "Admins can add members" ON public.chat_group_members;
CREATE POLICY "Admins can add members" ON public.chat_group_members
    FOR INSERT TO authenticated
    WITH CHECK (EXISTS (SELECT 1 FROM public.chat_group_members m2 WHERE m2.group_id = group_id AND m2.user_id = auth.uid() AND m2.role IN ('owner', 'admin')));

DROP POLICY IF EXISTS "Admins can update members" ON public.chat_group_members;
CREATE POLICY "Admins can update members" ON public.chat_group_members
    FOR UPDATE TO authenticated
    USING (EXISTS (SELECT 1 FROM public.chat_group_members m2 WHERE m2.group_id = group_id AND m2.user_id = auth.uid() AND m2.role IN ('owner', 'admin')));

DROP POLICY IF EXISTS "Admins can remove members or users can leave" ON public.chat_group_members;
CREATE POLICY "Admins can remove members or users can leave" ON public.chat_group_members
    FOR DELETE TO authenticated
    USING (
        auth.uid() = user_id OR 
        EXISTS (SELECT 1 FROM public.chat_group_members m2 WHERE m2.group_id = group_id AND m2.user_id = auth.uid() AND m2.role IN ('owner', 'admin'))
    );

DROP POLICY IF EXISTS "Members can view messages" ON public.chat_group_messages;
CREATE POLICY "Members can view messages" ON public.chat_group_messages
    FOR SELECT TO authenticated
    USING (EXISTS (SELECT 1 FROM public.chat_group_members WHERE group_id = public.chat_group_messages.group_id AND user_id = auth.uid()));

DROP POLICY IF EXISTS "Members can send messages" ON public.chat_group_messages;
CREATE POLICY "Members can send messages" ON public.chat_group_messages
    FOR INSERT TO authenticated
    WITH CHECK (auth.uid() = sender_id AND EXISTS (SELECT 1 FROM public.chat_group_members WHERE group_id = public.chat_group_messages.group_id AND user_id = auth.uid()));

DROP POLICY IF EXISTS "Senders can update their messages" ON public.chat_group_messages;
CREATE POLICY "Senders can update their messages" ON public.chat_group_messages
    FOR UPDATE TO authenticated
    USING (auth.uid() = sender_id);

DROP POLICY IF EXISTS "Senders can delete their messages" ON public.chat_group_messages;
CREATE POLICY "Senders can delete their messages" ON public.chat_group_messages
    FOR DELETE TO authenticated
    USING (auth.uid() = sender_id);

CREATE OR REPLACE FUNCTION public.handle_new_chat_group()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.chat_group_members (group_id, user_id, role)
    VALUES (NEW.id, NEW.created_by, 'owner');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_chat_group_created ON public.chat_groups;
CREATE TRIGGER on_chat_group_created
    AFTER INSERT ON public.chat_groups
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_chat_group();

