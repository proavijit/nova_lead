import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import type { User } from '@/types/auth'

interface AuthStore {
  user: User | null
  token: string | null
  setAuth: (user: User, token: string) => void
  setCredits: (credits: number) => void
  logout: () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      setAuth: (user, token) => {
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', token)
          document.cookie = `token=${token}; path=/; samesite=lax`
        }
        set({ user, token })
      },
      setCredits: (credits) => {
        const current = get().user
        if (!current) return
        set({ user: { ...current, credits } })
      },
      logout: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token')
          document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
        }
        set({ user: null, token: null })
      }
    }),
    { name: 'auth-storage' }
  )
)
