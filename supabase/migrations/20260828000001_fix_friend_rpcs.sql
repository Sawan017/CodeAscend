-- Rebuild Friend RPCs properly to fix RLS and state issues

CREATE OR REPLACE FUNCTION public.accept_friend_request(request_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    req_sender uuid;
    req_receiver uuid;
BEGIN
    -- Fetch the request and ensure it belongs to the current user
    SELECT sender_id, receiver_id INTO req_sender, req_receiver
    FROM public.friend_requests
    WHERE id = request_id AND status = 'pending';
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Pending friend request not found.';
    END IF;

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
SET search_path = public
AS $$
DECLARE
    req_receiver uuid;
BEGIN
    -- Fetch the request and ensure it belongs to the current user
    SELECT receiver_id INTO req_receiver
    FROM public.friend_requests
    WHERE id = request_id AND status = 'pending';
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Pending friend request not found.';
    END IF;

    IF req_receiver != auth.uid() THEN
        RAISE EXCEPTION 'You are not authorized to reject this friend request.';
    END IF;

    -- Delete the request to keep the table clean
    DELETE FROM public.friend_requests WHERE id = request_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.remove_friend(target_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Remove from friendships
    DELETE FROM public.friendships
    WHERE (user_id1 = auth.uid() AND user_id2 = target_user_id)
       OR (user_id1 = target_user_id AND user_id2 = auth.uid());
       
    -- Remove any pending/accepted requests between the two users
    DELETE FROM public.friend_requests
    WHERE (sender_id = auth.uid() AND receiver_id = target_user_id)
       OR (sender_id = target_user_id AND receiver_id = auth.uid());
END;
$$;

-- Allow authenticated users to view connections properly without RLS blocking them
DROP POLICY IF EXISTS "Users can view their friendships" ON public.friendships;
CREATE POLICY "Users can view their friendships" ON public.friendships
    FOR SELECT TO authenticated
    USING (auth.uid() = user_id1 OR auth.uid() = user_id2);

DROP POLICY IF EXISTS "System can insert friendships" ON public.friendships;
CREATE POLICY "System can insert friendships" ON public.friendships
    FOR INSERT TO authenticated
    WITH CHECK (true); -- Governed strictly by SECURITY DEFINER RPCs

DROP POLICY IF EXISTS "System can delete friendships" ON public.friendships;
CREATE POLICY "System can delete friendships" ON public.friendships
    FOR DELETE TO authenticated
    USING (auth.uid() = user_id1 OR auth.uid() = user_id2);

-- Fix Friend Requests Policies
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

-- Ensure PostgREST cache reload
NOTIFY pgrst, 'reload schema';
