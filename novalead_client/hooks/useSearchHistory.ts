'use client'

import { useQuery } from '@tanstack/react-query'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { api } from '@/lib/api'
import type { SearchDetailResponse, SearchHistoryResponse } from '@/types/search'

export function useSearchHistory() {
  return useQuery({
    queryKey: ['searches'],
    queryFn: async () => {
      const { data } = await api.get<SearchHistoryResponse>('/searches')
      return (data.data.items || []).map((item) => ({
        ...item,
        result_count: item.result_count ?? item.total_results ?? 0,
        credits_charged: item.credits_charged ?? item.credits_used ?? 0,
        credits_used: item.credits_used ?? item.credits_charged ?? 0,
        cache_hit: Boolean(item.cache_hit),
        cache_strategy: item.cache_strategy ?? (item.cache_hit ? 'hash' : 'miss'),
        cache_id: item.cache_id ?? null,
        filter_hash: item.filter_hash ?? null,
        lead_snapshot: item.lead_snapshot ?? null
      }))
    },
    staleTime: 30_000,
    retry: 1,
    meta: {
      errorMessage: 'Failed to load search history'
    }
  })
}

export function useDeleteSearch() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/searches/${id}`)
      return id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['searches'] })
      toast.success('Search deleted')
    },
    onError: () => {
      toast.error('Failed to delete search')
    }
  })
}

export function useSearchById(id: string) {
  return useQuery({
    queryKey: ['searches', id],
    queryFn: async () => {
      const { data } = await api.get<SearchDetailResponse>(`/searches/${id}`)
      
      const rawLeads = data.data.leads || []
      const leadSnapshot = data.data.search.lead_snapshot
      
      const leads = rawLeads.length > 0 ? rawLeads : (leadSnapshot || []).map((snapshot: any) => ({
        name: snapshot.name ?? null,
        title: snapshot.title ?? null,
        linkedin_url: snapshot.linkedin_url ?? null,
        company: {
          name: snapshot.company?.name ?? null,
          linkedin_url: snapshot.company?.linkedin_url ?? null,
          website: snapshot.company?.website ?? null
        }
      }))

      return {
        ...data.data,
        search: {
          ...data.data.search,
          result_count: data.data.search.result_count ?? data.data.search.total_results ?? 0,
          credits_charged: data.data.search.credits_charged ?? data.data.search.credits_used ?? 0,
          credits_used: data.data.search.credits_used ?? data.data.search.credits_charged ?? 0,
          cache_hit: Boolean(data.data.search.cache_hit),
          cache_strategy:
            data.data.search.cache_strategy ?? (data.data.search.cache_hit ? 'hash' : 'miss'),
          cache_id: data.data.search.cache_id ?? null,
          lead_snapshot: leadSnapshot ?? null
        },
        leads: leads.map((lead: any) => ({
          name: lead.name ?? null,
          title: lead.title ?? null,
          linkedin_url: lead.linkedin_url ?? null,
          company: {
            name: lead.company?.name ?? lead.company_name ?? null,
            linkedin_url: lead.company?.linkedin_url ?? lead.company_linkedin_url ?? null,
            website: lead.company?.website ?? lead.company_website ?? null
          }
        }))
      }
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
