-- Migration: Add credits column to users table
-- Run this in Supabase SQL Editor or let the server run it on startup

-- Add credits column with default value 0
ALTER TABLE users ADD COLUMN IF NOT EXISTS credits INTEGER NOT NULL DEFAULT 0;

-- Add password_hash column if missing
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash TEXT;

-- Refresh the schema cache (Supabase-specific)
NOTIFY pgrst, 'reload schema';
