-- ============================================================================
-- NOVA LEAD - Database Setup Script
-- ============================================================================
-- Run this in Supabase Dashboard: https://supabase.com/dashboard
-- Select your project → SQL Editor → New Query → Paste this script → Run
-- ============================================================================

-- STEP 1: Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  credits INTEGER DEFAULT 10,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- STEP 2: Disable Row Level Security (for simplicity - we use custom JWT)
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- STEP 3: Grant permissions
GRANT ALL ON users TO anon, authenticated;
GRANT ALL ON SEQUENCE users_id_seq TO anon, authenticated;

-- STEP 4: Create register_user function
CREATE OR REPLACE FUNCTION register_user(
  user_email TEXT,
  user_password_hash TEXT,
  initial_credits INTEGER DEFAULT 10
)
RETURNS TABLE(id UUID, email TEXT, credits INTEGER, created_at TIMESTAMPTZ)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_user RECORD;
BEGIN
  INSERT INTO users (email, password_hash, credits)
  VALUES (user_email, user_password_hash, initial_credits)
  RETURNING id, email, credits, created_at
  INTO new_user;
  RETURN QUERY SELECT new_user.id, new_user.email, new_user.credits, new_user.created_at;
END;
$$;

-- STEP 5: Grant execute permission on function
GRANT EXECUTE ON FUNCTION register_user TO anon, authenticated;

-- STEP 6: Verify - this should return the users table
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
