-- Migration: add global search cache tables + search metadata columns
-- Created at: 2026-02-28

CREATE TABLE IF NOT EXISTS public.global_search_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filter_hash TEXT NOT NULL UNIQUE,
  canonical_filters JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'ready', 'failed')),
  total_results INTEGER NOT NULL DEFAULT 0,
  provider TEXT NOT NULL DEFAULT 'explorium',
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '30 days'),
  last_hit_at TIMESTAMPTZ,
  hit_count BIGINT NOT NULL DEFAULT 0,
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.global_cached_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cache_id UUID NOT NULL REFERENCES public.global_search_cache(id) ON DELETE CASCADE,
  lead_rank INTEGER NOT NULL DEFAULT 0,
  name TEXT,
  title TEXT,
  linkedin_url TEXT,
  company_name TEXT,
  company_linkedin_url TEXT,
  company_website TEXT,
  raw_data JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.searches
  ADD COLUMN IF NOT EXISTS cache_id UUID REFERENCES public.global_search_cache(id),
  ADD COLUMN IF NOT EXISTS cache_hit BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS cache_strategy TEXT,
  ADD COLUMN IF NOT EXISTS credits_charged INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS canonical_filters JSONB;

CREATE INDEX IF NOT EXISTS idx_global_search_cache_status_expires
  ON public.global_search_cache(status, expires_at);

CREATE INDEX IF NOT EXISTS idx_global_cached_leads_cache_rank
  ON public.global_cached_leads(cache_id, lead_rank);

CREATE INDEX IF NOT EXISTS idx_searches_user_created_at
  ON public.searches(user_id, created_at DESC);

ALTER TABLE public.global_search_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.global_cached_leads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role full access global_search_cache" ON public.global_search_cache;
DROP POLICY IF EXISTS "Service role full access global_cached_leads" ON public.global_cached_leads;
DROP POLICY IF EXISTS "Authenticated read global_search_cache" ON public.global_search_cache;
DROP POLICY IF EXISTS "Authenticated read global_cached_leads" ON public.global_cached_leads;

CREATE POLICY "Service role full access global_search_cache"
  ON public.global_search_cache FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role full access global_cached_leads"
  ON public.global_cached_leads FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated read global_search_cache"
  ON public.global_search_cache FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated read global_cached_leads"
  ON public.global_cached_leads FOR SELECT
  USING (auth.role() = 'authenticated');
