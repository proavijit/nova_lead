'use client'

import { useRouter } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

import { api } from '@/lib/api'
import { useAuthStore } from '@/store/authStore'
import type { AuthPayload, AuthResponse } from '@/types/auth'

export function useAuth() {
  const router = useRouter()
  const setAuth = useAuthStore((state) => state.setAuth)
  const logoutStore = useAuthStore((state) => state.logout)

  const login = useMutation({
    mutationFn: async (payload: AuthPayload) => {
      const { data } = await api.post<AuthResponse>('/auth/login', payload)
      return data
    },
    onSuccess: (data) => {
      setAuth(data.user, data.token)
      toast.success('Logged in successfully')
      router.push('/search')
    },
    onError: (error: any) => {
      const message = error?.response?.data?.error || 'Login failed'
      toast.error(message)
    }
  })

  const register = useMutation({
    mutationFn: async (payload: AuthPayload) => {
      const { data } = await api.post<AuthResponse>('/auth/register', payload)
      return data
    },
    onSuccess: (data) => {
      setAuth(data.user, data.token)
      toast.success('Account created successfully')
      router.push('/search')
    },
    onError: (error: any) => {
      const message = error?.response?.data?.error || 'Registration failed'
      toast.error(message)
    }
  })

  const logout = () => {
    logoutStore()
    toast.success('Logged out')
    router.push('/login')
  }

  return { login, register, logout }
}
