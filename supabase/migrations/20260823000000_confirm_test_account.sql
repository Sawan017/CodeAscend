-- One-time administrative confirmation for E2E test account
UPDATE auth.users 
SET email_confirmed_at = now()
WHERE id = '8eedd216-5995-4568-bc2b-4de552f01907';
