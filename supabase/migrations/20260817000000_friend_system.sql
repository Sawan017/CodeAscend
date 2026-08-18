-- ============================================================
-- SOCIAL NETWORK MIGRATION
-- Creates friend_requests, friendships, and associated RPCs
-- ============================================================

-- 1. friend_requests table
CREATE TABLE IF NOT EXISTS public.friend_requests (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    sender_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    receiver_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    status text NOT NULL DEFAULT 'pending',
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT friend_requests_status_check CHECK (status IN ('pending', 'accepted', 'rejected')),
    CONSTRAINT prevent_self_request CHECK (sender_id != receiver_id)
);

-- Unique index to prevent duplicate pending/active requests between same users
CREATE UNIQUE INDEX IF NOT EXISTS unique_friend_request ON public.friend_requests (least(sender_id, receiver_id), greatest(sender_id, receiver_id)) WHERE status = 'pending';

-- RLS for friend_requests
ALTER TABLE public.friend_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view requests involving them" ON public.friend_requests;
CREATE POLICY "Users can view requests involving them" ON public.friend_requests
    FOR SELECT TO authenticated
    USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

DROP POLICY IF EXISTS "Users can send requests" ON public.friend_requests;
CREATE POLICY "Users can send requests" ON public.friend_requests
    FOR INSERT TO authenticated
    WITH CHECK (auth.uid() = sender_id);

DROP POLICY IF EXISTS "Users can accept/reject their incoming requests" ON public.friend_requests;
CREATE POLICY "Users can accept/reject their incoming requests" ON public.friend_requests
    FOR UPDATE TO authenticated
    USING (auth.uid() = receiver_id);

DROP POLICY IF EXISTS "Users can cancel their outgoing requests" ON public.friend_requests;
CREATE POLICY "Users can cancel their outgoing requests" ON public.friend_requests
    FOR DELETE TO authenticated
    USING (auth.uid() = sender_id OR auth.uid() = receiver_id);


-- 2. friendships table
CREATE TABLE IF NOT EXISTS public.friendships (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id1 uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    user_id2 uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT prevent_self_friendship CHECK (user_id1 != user_id2)
);

-- Ensure user_id1 is always smaller than user_id2 to prevent duplicated inverse pairs
CREATE UNIQUE INDEX IF NOT EXISTS unique_friendship ON public.friendships (least(user_id1, user_id2), greatest(user_id1, user_id2));

-- RLS for friendships
ALTER TABLE public.friendships ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their friendships" ON public.friendships;
CREATE POLICY "Users can view their friendships" ON public.friendships
    FOR SELECT TO authenticated
    USING (auth.uid() = user_id1 OR auth.uid() = user_id2);

-- Insert/Delete is typically handled via RPC rather than directly, but we'll allow it if needed by triggers/RPCs running as SECURITY DEFINER


-- 3. search_user_by_login_id RPC
-- Safely fetches limited public profile information given an exact login_id
CREATE OR REPLACE FUNCTION public.search_user_by_login_id(query_id text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    target_user_id uuid;
    profile_data jsonb;
BEGIN
    -- Find the user_id matching the exact login_id
    SELECT user_id INTO target_user_id
    FROM public.user_identities
    WHERE login_id = query_id
    LIMIT 1;

    IF target_user_id IS NULL THEN
        RETURN NULL;
    END IF;

    -- Fetch the public profile data
    SELECT data INTO profile_data
    FROM public.profiles
    WHERE user_id = target_user_id;

    -- Return safe JSON
    RETURN json_build_object(
        'userId', target_user_id,
        'login_id', query_id,
        'username', coalesce(profile_data->>'username', ''),
        'displayName', coalesce(profile_data->>'displayName', profile_data->>'username', query_id),
        'avatar', profile_data->>'avatar',
        'level', coalesce((profile_data->>'level')::int, 1),
        'xp', coalesce((profile_data->>'xp')::int, 0)
    );
END;
$$;

GRANT EXECUTE ON FUNCTION public.search_user_by_login_id(text) TO authenticated;


-- 4. Social Network Actions (RPCs)
CREATE OR REPLACE FUNCTION public.send_friend_request(target_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    IF auth.uid() = target_user_id THEN
        RAISE EXCEPTION 'You cannot send a friend request to yourself.';
    END IF;
    
    -- Check if already friends
    IF EXISTS (
        SELECT 1 FROM public.friendships 
        WHERE (user_id1 = auth.uid() AND user_id2 = target_user_id)
           OR (user_id1 = target_user_id AND user_id2 = auth.uid())
    ) THEN
        RAISE EXCEPTION 'You are already friends with this user.';
    END IF;
    
    -- Check if request already exists
    IF EXISTS (
        SELECT 1 FROM public.friend_requests 
        WHERE (sender_id = auth.uid() AND receiver_id = target_user_id AND status = 'pending')
           OR (sender_id = target_user_id AND receiver_id = auth.uid() AND status = 'pending')
    ) THEN
        RAISE EXCEPTION 'A friend request is already pending between these users.';
    END IF;

    INSERT INTO public.friend_requests (sender_id, receiver_id)
    VALUES (auth.uid(), target_user_id);
END;
$$;


CREATE OR REPLACE FUNCTION public.accept_friend_request(request_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    req_sender uuid;
    req_receiver uuid;
BEGIN
    -- Fetch the request and ensure it belongs to the current user
    SELECT sender_id, receiver_id INTO req_sender, req_receiver
    FROM public.friend_requests
    WHERE id = request_id AND status = 'pending';
    
    IF req_receiver != auth.uid() THEN
        RAISE EXCEPTION 'You are not authorized to accept this friend request.';
    END IF;

    -- Update the request status
    UPDATE public.friend_requests
    SET status = 'accepted'
    WHERE id = request_id;

    -- Insert into friendships
    INSERT INTO public.friendships (user_id1, user_id2)
    VALUES (least(req_sender, req_receiver), greatest(req_sender, req_receiver))
    ON CONFLICT DO NOTHING;
END;
$$;


CREATE OR REPLACE FUNCTION public.reject_friend_request(request_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    req_receiver uuid;
BEGIN
    -- Fetch the request and ensure it belongs to the current user
    SELECT receiver_id INTO req_receiver
    FROM public.friend_requests
    WHERE id = request_id AND status = 'pending';
    
    IF req_receiver != auth.uid() THEN
        RAISE EXCEPTION 'You are not authorized to reject this friend request.';
    END IF;

    -- We can either update status to rejected, or simply delete the request.
    -- Deleting keeps the table clean.
    DELETE FROM public.friend_requests WHERE id = request_id;
END;
$$;


CREATE OR REPLACE FUNCTION public.remove_friend(target_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    DELETE FROM public.friendships
    WHERE (user_id1 = auth.uid() AND user_id2 = target_user_id)
       OR (user_id1 = target_user_id AND user_id2 = auth.uid());
       
    DELETE FROM public.friend_requests
    WHERE (sender_id = auth.uid() AND receiver_id = target_user_id)
       OR (sender_id = target_user_id AND receiver_id = auth.uid());
END;
$$;

-- Force PostgREST schema cache reload
NOTIFY pgrst, 'reload schema';
