-- ==========================================================================
-- RATE LIMITING FOR FRIEND REQUESTS
-- ==========================================================================
-- Prevents abuse and inbox spam by throttling friend requests 
-- to 10 per hour per authenticated user.

DROP TRIGGER IF EXISTS tr_friend_request_rate_limit ON public.friend_requests;
CREATE TRIGGER tr_friend_request_rate_limit
BEFORE INSERT ON public.friend_requests
FOR EACH ROW EXECUTE FUNCTION public.trigger_rate_limit('friend_request', '10', '1 hour');
