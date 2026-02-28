export interface Company {
  name: string | null
  linkedin_url: string | null
  website: string | null
}

export interface Lead {
  name: string | null
  title: string | null
  linkedin_url: string | null
  company: Company
}

export interface SearchResponse {
  success: boolean
  data: {
    search_id: string
    cache_id?: string | null
    cache_hit?: boolean
    cache_strategy?: 'hash' | 'miss' | 'semantic' | string | null
    credits_charged?: number
    credits_remaining: number
    total_results: number
    page: number
    leads: Lead[]
    filters?: Record<string, any>
  }
}
