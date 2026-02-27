import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthStore {
  token: string | null
  user: {
    id: string
    email: string
  } | null
  credits: number
  setAuth: (token: string, user: { id: string; email: string; credits?: number }) => void
  clearAuth: () => void
  setCredits: (credits: number) => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      credits: 50,
      setAuth: (token, user) =>
        set({
          token,
          user: { id: user.id, email: user.email },
          credits: user.credits ?? 0
        }),
      clearAuth: () => set({ token: null, user: null, credits: 0 }),
      setCredits: (credits) => set({ credits })
    }),
    { name: 'nova-auth-storage' }
  )
)
