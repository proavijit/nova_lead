'use client'

import { useMutation } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { AuthPayload, AuthResponse } from '@/types/auth'

export function useRegister() {
  return useMutation({
    mutationFn: async (payload: AuthPayload) => {
      const { data } = await api.post<AuthResponse>('/auth/register', payload)
      return data
    }
  })
}

export function useLogin() {
  return useMutation({
    mutationFn: async (payload: AuthPayload) => {
      const { data } = await api.post<AuthResponse>('/auth/login', payload)
      return data
    }
  })
}

export function useMe() {
  return useMutation({
    mutationFn: async () => {
      const { data } = await api.get<{ success: boolean; data: { user: { id: string; email: string; credits: number } } }>(
        '/auth/me'
      )
      return data
    }
  })
}
