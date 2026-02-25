'use client'

import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

import { api } from '@/lib/api'
import type { SearchDetailResponse, SearchHistoryResponse } from '@/types/search'

export function useSearchHistory() {
  return useQuery({
    queryKey: ['searches'],
    queryFn: async () => {
      const { data } = await api.get<SearchHistoryResponse>('/searches')
      return data.data.items
    },
    staleTime: 30_000,
    retry: 1,
    meta: {
      errorMessage: 'Failed to load search history'
    }
  })
}

export function useSearchById(id: string) {
  return useQuery({
    queryKey: ['searches', id],
    queryFn: async () => {
      const { data } = await api.get<SearchDetailResponse>(`/searches/${id}`)
      return data.data
    },
    enabled: Boolean(id),
    retry: 1
  })
}

export function useSearchHistoryToast() {
  return {
    onError: () => toast.error('Failed to load search history')
  }
}
