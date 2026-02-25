import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthStore {
  credits: number
  setCredits: (credits: number) => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      credits: 50,
      setCredits: (credits) => set({ credits })
    }),
    { name: 'credits-storage' }
  )
)
