-- ==========================================================================
-- PASSWORD POLICY UPDATE: 8-character minimum, 5 rules
-- ==========================================================================
-- Matches the frontend passwordValidation.ts exactly:
--   1. >= 8 characters
--   2. Lowercase letter
--   3. Uppercase letter
--   4. Digit
--   5. Special character
-- ==========================================================================

CREATE OR REPLACE FUNCTION public.validate_strong_password(
  pw text,
  username_ctx text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
IMMUTABLE
AS $$
BEGIN
  -- 1. Minimum length: 8 characters
  IF length(pw) < 8 THEN
    RAISE EXCEPTION 'Password does not meet security requirements.';
  END IF;

  -- 2. Must contain lowercase letter
  IF pw !~ '[a-z]' THEN
    RAISE EXCEPTION 'Password does not meet security requirements.';
  END IF;

  -- 3. Must contain uppercase letter
  IF pw !~ '[A-Z]' THEN
    RAISE EXCEPTION 'Password does not meet security requirements.';
  END IF;

  -- 4. Must contain digit
  IF pw !~ '[0-9]' THEN
    RAISE EXCEPTION 'Password does not meet security requirements.';
  END IF;

  -- 5. Must contain special character
  IF pw !~ '[^a-zA-Z0-9 ]' THEN
    RAISE EXCEPTION 'Password does not meet security requirements.';
  END IF;
END;
$$;

-- reserve_username already calls validate_strong_password(), so it picks up the new rules automatically.

NOTIFY pgrst, 'reload schema';
