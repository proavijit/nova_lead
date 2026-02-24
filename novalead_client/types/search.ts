import type { Lead } from '@/types/lead'

export interface SearchHistoryItem {
  id: string
  prompt: string
  created_at: string
  result_count: number
  credits_used: number
}

export interface SearchHistoryResponse {
  success: boolean
  searches: SearchHistoryItem[]
}

export interface SearchDetailResponse {
  success: boolean
  search: SearchHistoryItem
  leads: Lead[]
}
