import type { Lead } from '@/types/lead'

export interface SearchHistoryItem {
  id: string
  prompt: string
  created_at: string
  result_count?: number
  total_results?: number
  credits_used?: number
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
