-- Migration: Add lead_snapshot column to searches table and optimize cache indexes
-- Run this in the Supabase SQL Editor

-- Add JSONB column to store complete lead details as snapshot
ALTER TABLE searches
ADD COLUMN IF NOT EXISTS lead_snapshot JSONB;

-- Add GIN index for lead_snapshot JSONB queries
CREATE INDEX IF NOT EXISTS idx_searches_lead_snapshot ON searches USING GIN (lead_snapshot);

-- Add composite index for global_search_cache lookups (filter_hash + status + expires_at)
-- This significantly improves cache hit lookup performance
CREATE INDEX IF NOT EXISTS idx_global_search_cache_lookup 
ON global_search_cache(filter_hash, status, expires_at DESC);

-- Add index for canonical_filters JSONB if not exists
CREATE INDEX IF NOT EXISTS idx_searches_canonical_filters ON searches USING GIN (canonical_filters);

-- Set PERMISSIONS for the new column
GRANT ALL ON TABLE searches TO service_role;
