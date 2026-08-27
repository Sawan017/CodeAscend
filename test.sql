CREATE TABLE public.user_dob (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  dob DATE NOT NULL,
  CONSTRAINT dob_age_check CHECK (dob <= (CURRENT_DATE - INTERVAL '18 years')::date)
);
