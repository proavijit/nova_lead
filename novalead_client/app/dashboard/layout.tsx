'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import { DashboardShell } from '@/components/layout/DashboardShell'
import { api } from '@/lib/api'
import { useAuthStore } from '@/store/authStore'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const setAuth = useAuthStore((state) => state.setAuth)
  const clearAuth = useAuthStore((state) => state.clearAuth)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const boot = async () => {
      const token = localStorage.getItem('nova_token')
      if (!token) {
        router.replace('/login')
        return
      }

      try {
        const { data } = await api.get<{ success: boolean; data: { user: { id: string; email: string; credits: number } } }>(
          '/auth/me'
        )
        setAuth(token, data.data.user)
        setReady(true)
      } catch {
        localStorage.removeItem('nova_token')
        clearAuth()
        router.replace('/login')
      }
    }

    boot()
  }, [clearAuth, router, setAuth])

  if (!ready) {
    return <div className="grid min-h-screen place-items-center bg-[#f8fafc] text-slate-700">Loading dashboard...</div>
  }

  return <DashboardShell>{children}</DashboardShell>
}
