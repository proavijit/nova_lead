-- SQL to create users table in Supabase
-- Run this in Supabase SQL Editor

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  credits INTEGER DEFAULT 10,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Disable RLS for simplicity (the app uses custom JWT, not Supabase Auth)
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- Grant permissions on users table
GRANT ALL ON users TO anon, authenticated;
GRANT ALL ON SEQUENCE users_id_seq TO anon, authenticated;
