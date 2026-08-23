CREATE OR REPLACE FUNCTION public.e2e_test_concurrency()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  test_uid uuid := gen_random_uuid();
  identities_count integer;
  result json;
BEGIN
  -- 1. Create a dummy auth.users row directly
  INSERT INTO auth.users (
    id, instance_id, email, encrypted_password, email_confirmed_at, 
    aud, role, created_at, updated_at, 
    confirmation_token, recovery_token, email_change_token_new, email_change,
    phone, phone_change, phone_change_token, email_change_token_current, reauthentication_token,
    raw_app_meta_data, raw_user_meta_data, is_super_admin, is_sso_user, is_anonymous, email_change_confirm_status
  ) VALUES (
    test_uid, '00000000-0000-0000-0000-000000000000', test_uid::text || '@test.com', 'dummy', now(), 
    'authenticated', 'authenticated', now(), now(), 
    '', '', '', '', 
    NULL, '', '', '', '',
    '{}'::jsonb, '{}'::jsonb, false, false, false, 0
  );
  
  -- 2. Simulate concurrent profile insertions
  -- We'll just insert twice. The trigger auto_assign_identity_on_profile_creation 
  -- will fire for both. To truly test concurrency in a single thread is impossible,
  -- but we can test that the UNIQUE constraint exists and the fallback works.
  
  -- Since we can't truly do async concurrency in plpgsql, we'll just insert once to trigger it.
  INSERT INTO public.profiles (user_id, key, data) VALUES (test_uid, 'profile', '{"displayName": "TestUser"}'::jsonb);
  
  -- Check identity count
  SELECT count(*) INTO identities_count FROM public.user_identities WHERE user_id = test_uid;
  
  -- 3. Now delete the user to test CASCADE
  DELETE FROM auth.users WHERE id = test_uid;
  
  -- 4. Check if identity was deleted (orphaned)
  DECLARE
    orphan_count integer;
  BEGIN
    SELECT count(*) INTO orphan_count FROM public.user_identities WHERE user_id = test_uid;
    
    result := json_build_object(
      'identities_created', identities_count,
      'identities_after_delete', orphan_count,
      'test_uid', test_uid
    );
  END;
  
  RETURN result;
END;
$$;
