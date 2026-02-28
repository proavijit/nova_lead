-- NovaLead Database Setup Script
-- Run this in the Supabase SQL Editor

-- 1. Create EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create TABLES

-- users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  credits INTEGER DEFAULT 10,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- searches table
CREATE TABLE IF NOT EXISTS searches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  prompt TEXT NOT NULL,
  filters JSONB NOT NULL,
  total_results INTEGER,
  credits_used INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- leads table
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  search_id UUID REFERENCES searches(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT,
  title TEXT,
  linkedin_url TEXT,
  company_name TEXT,
  company_linkedin_url TEXT,
  company_website TEXT,
  raw_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- credit_transactions table
CREATE TABLE IF NOT EXISTS credit_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,         -- negative = deduct, positive = add
  reason TEXT,                     -- 'search', 'top_up', 'refund'
  search_id UUID REFERENCES searches(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- global_search_cache table
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

-- global_cached_leads table
CREATE TABLE IF NOT EXISTS global_cached_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cache_id UUID REFERENCES global_search_cache(id) ON DELETE CASCADE,
  lead_rank INTEGER DEFAULT 0,
  name TEXT,
  title TEXT,
  linkedin_url TEXT,
  company_name TEXT,
  company_linkedin_url TEXT,
  company_website TEXT,
  raw_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE searches
  ADD COLUMN IF NOT EXISTS cache_id UUID REFERENCES global_search_cache(id),
  ADD COLUMN IF NOT EXISTS cache_hit BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS cache_strategy TEXT,
  ADD COLUMN IF NOT EXISTS credits_charged INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS canonical_filters JSONB;

CREATE INDEX IF NOT EXISTS idx_global_search_cache_status_expires ON global_search_cache(status, expires_at);
CREATE INDEX IF NOT EXISTS idx_global_cached_leads_cache_rank ON global_cached_leads(cache_id, lead_rank);
CREATE INDEX IF NOT EXISTS idx_searches_user_created_at ON searches(user_id, created_at DESC);

-- 3. Create RPC FUNCTIONS

-- registration function (bypasses schema cache issues)
CREATE OR REPLACE FUNCTION register_user(user_email TEXT, user_password_hash TEXT, initial_credits INTEGER)
RETURNS JSON AS $$
DECLARE
    new_user_id UUID;
    result JSON;
BEGIN
    INSERT INTO users (email, password_hash, credits)
    VALUES (user_email, user_password_hash, initial_credits)
    RETURNING id INTO new_user_id;
    
    SELECT json_build_object('id', id, 'email', email, 'credits', credits, 'created_at', created_at)
    INTO result
    FROM users
    WHERE id = new_user_id;
    
    RETURN result;
EXCEPTION WHEN OTHERS THEN
    RETURN json_build_object('error', SQLERRM);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- credit decrement function
CREATE OR REPLACE FUNCTION decrement_credits(user_id_param UUID, amount_param INTEGER)
RETURNS VOID AS $$
BEGIN
    UPDATE users
    SET credits = credits - amount_param
    WHERE id = user_id_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Set PERMISSIONS
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO service_role;

GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

-- 5. SEED DATA
-- Add a test admin user (password: password123)
-- Hash generated for 'password123' via bcrypt
INSERT INTO users (email, password_hash, credits)
VALUES ('admin@novalead.com', '$2a$10$wR.N/o6mIeNIsL7Z9D7DbeB28s2Q/mK6C9x3eGf6xJ5uV7Yp2k8m.', 100)
ON CONFLICT (email) DO NOTHING;

-- Force schema reload
NOTIFY pgrst, 'reload schema';
