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

-- Optional cache tables for global result reuse
CREATE TABLE IF NOT EXISTS global_search_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filter_hash TEXT UNIQUE NOT NULL,
  canonical_filters JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  total_results INTEGER DEFAULT 0,
  provider TEXT NOT NULL DEFAULT 'explorium',
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '30 days'),
  last_hit_at TIMESTAMPTZ,
  hit_count BIGINT DEFAULT 0,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
