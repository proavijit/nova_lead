'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { api } from '@/lib/api'
import type { SearchResponse } from '@/types/lead'

interface SearchPayload {
  prompt: string
  page: number
}

export function useSearch() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: SearchPayload) => {
      const { data } = await api.post<SearchResponse>('/prospects/search', payload)
      return data
    },
    onSuccess: (data) => {
      const cacheHit = Boolean(data.data.cache_hit)
      const strategy = data.data.cache_strategy ? ` (${data.data.cache_strategy})` : ''
      const charged = data.data.credits_charged ?? 0
      const summary = cacheHit
        ? `Cache hit${strategy}: ${data.data.leads.length} leads, 0 credits charged`
        : `Cache miss: ${data.data.leads.length} leads, ${charged} credit${charged === 1 ? '' : 's'} charged`

      toast.success(summary)
      queryClient.invalidateQueries({ queryKey: ['credits'] })
      queryClient.invalidateQueries({ queryKey: ['searches'] })
    },
    onError: (error: any) => {
      const message = error?.response?.data?.error || 'Search failed'
      toast.error(message)
    }
  })
}
