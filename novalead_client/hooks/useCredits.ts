'use client'

import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

import { api } from '@/lib/api'
import { useAuthStore } from '@/store/authStore'

interface CreditsBalanceResponse {
  success: boolean
  balance: number
}

export interface CreditTransaction {
  id: string
  amount: number
  type: 'debit' | 'credit'
  description: string
  created_at: string
}

interface CreditHistoryResponse {
  success: boolean
  transactions: CreditTransaction[]
}

export function useCredits() {
  const setCredits = useAuthStore((state) => state.setCredits)

  const query = useQuery({
    queryKey: ['credits'],
    queryFn: async () => {
      const { data } = await api.get<CreditsBalanceResponse>('/credits/balance')
      return data
    },
    refetchInterval: 30_000,
    retry: 1
  })

  useEffect(() => {
    if (query.data?.balance !== undefined) {
      setCredits(query.data.balance)
    }
  }, [query.data?.balance, setCredits])

  useEffect(() => {
    if (query.isError) {
      toast.error('Failed to load credits')
    }
  }, [query.isError])

  return query
}

export function useCreditHistory() {
  const query = useQuery({
    queryKey: ['credit-history'],
    queryFn: async () => {
      const { data } = await api.get<CreditHistoryResponse>('/credits/history')
      return data.transactions
    },
    retry: 1
  })

  useEffect(() => {
    if (query.isError) {
      toast.error('Failed to load credit history')
    }
  }, [query.isError])

  return query
}
