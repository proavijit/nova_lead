'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { BadgeDollarSign, Clock3, LayoutDashboard, LogOut, Search, Settings, Zap } from 'lucide-react'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useCredits } from '@/hooks/useCredits'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/authStore'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/search', label: 'New Search', icon: Search },
  { href: '/dashboard/history', label: 'Search History', icon: Clock3 },
  { href: '/dashboard/credits', label: 'Credits', icon: BadgeDollarSign },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings }
]

interface SidebarProps {
  onNavigate?: () => void
}

export function Sidebar({ onNavigate }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { data } = useCredits()
  const user = useAuthStore((state) => state.user)
  const clearAuth = useAuthStore((state) => state.clearAuth)

  const initials = (user?.email || 'NL').slice(0, 2).toUpperCase()

  const logout = () => {
    localStorage.removeItem('nova_token')
    clearAuth()
    router.replace('/login')
  }

  return (
    <aside className="flex h-full w-72 flex-col border-r border-slate-200 bg-white p-4">
      <Link href="/" className="mb-8 flex items-center gap-2 px-2" onClick={onNavigate}>
        <Zap className="h-6 w-6 text-blue-400" />
        <div>
          <p className="text-lg font-semibold text-slate-900">NovaLead</p>
          <p className="text-xs text-slate-500">AI Prospecting CRM</p>
        </div>
      </Link>

      <nav className="space-y-1">
        {navItems.map((item) => {
          const active = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition',
                active ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="mt-auto space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-500">Credits</span>
          <Badge className="bg-blue-500 text-white">{data?.data?.balance ?? 0}</Badge>
        </div>
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate text-sm text-slate-700">{user?.email || 'user@novalead.app'}</p>
          </div>
        </div>
        <Button variant="outline" className="w-full border-slate-300 bg-white text-slate-700" onClick={logout}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </aside>
  )
}
