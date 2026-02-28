import type { Lead } from '@/types/lead'

export interface LeadSnapshotItem {
  name: string | null
  title: string | null
  linkedin_url: string | null
  company: {
    name: string | null
    linkedin_url: string | null
    website: string | null
  }
  raw_data?: Record<string, unknown> | null
}

export interface SearchHistoryItem {
  id: string
  prompt: string
  created_at: string
  result_count?: number
  total_results?: number
  credits_used?: number
  credits_charged?: number
  cache_id?: string | null
  cache_hit?: boolean
  cache_strategy?: 'hash' | 'miss' | 'semantic' | string | null
  canonical_filters?: Record<string, unknown> | null
  lead_snapshot?: LeadSnapshotItem[] | null
}

export interface SearchHistoryResponse {
  success: boolean
  data: {
    items: SearchHistoryItem[]
    total: number
    page: number
    limit: number
  }
}

export interface SearchDetailResponse {
  success: boolean
  data: {
    search: SearchHistoryItem
    leads: Lead[]
  }
}
