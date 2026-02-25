'use client'

import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

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
  const credits = useAuthStore((state) => state.credits)
  const setCredits = useAuthStore((state) => state.setCredits)

  return {
    data: {
      success: true,
      data: { balance: credits }
    } as CreditsBalanceResponse,
    isLoading: false,
    isError: false,
    credits,
    setCredits
  }
}

export function useCreditHistory() {
  const transactions: CreditTransaction[] = []
  
  return {
    data: transactions,
    isLoading: false,
    isError: false
  }
}
