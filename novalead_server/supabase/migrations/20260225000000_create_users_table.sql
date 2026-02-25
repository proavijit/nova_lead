-- Migration: create_users_table
-- Created at: 2026-02-25

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  credits INTEGER DEFAULT 10,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can read own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert own data" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Grant permissions
GRANT ALL ON users TO anon, authenticated;
GRANT ALL ON SEQUENCE users_id_seq TO anon, authenticated;

-- Create register_user function
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

-- Grant execute permission on function
GRANT EXECUTE ON FUNCTION register_user TO anon, authenticated;
