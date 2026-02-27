'use client'

import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'

import { useAuthStore } from '@/store/authStore'

interface CreditsBalanceResponse {
  success: boolean
  data: {
    balance: number
  }
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
  data: CreditTransaction[]
}

export function useCredits() {
  const setCredits = useAuthStore((state) => state.setCredits)
  const query = useQuery({
    queryKey: ['credits'],
    queryFn: async () => {
      const { data } = await api.get<CreditsBalanceResponse>('/credits/balance')
      return data
    }
  })

  useEffect(() => {
    if (typeof query.data?.data?.balance === 'number') {
      setCredits(query.data.data.balance)
    }
  }, [query.data?.data?.balance, setCredits])

  return query
}

export function useCreditHistory() {
  return useQuery({
    queryKey: ['credit-history'],
    queryFn: async () => {
      const { data } = await api.get<CreditHistoryResponse>('/credits/history')
      return data.data
    }
  })
}
