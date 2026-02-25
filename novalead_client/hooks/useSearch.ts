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
      toast.success(`Found ${data.data.leads.length} leads`)
      queryClient.invalidateQueries({ queryKey: ['credits'] })
      queryClient.invalidateQueries({ queryKey: ['searches'] })
    },
    onError: (error: any) => {
      const message = error?.response?.data?.error || 'Search failed'
      toast.error(message)
    }
  })
}
