'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { BadgeDollarSign, Clock3, LayoutDashboard, LogOut, Search, Settings, Zap } from 'lucide-react'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useCredits } from '@/hooks/useCredits'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/authStore'

const navItems = [
  { href: '/dashboard',          label: 'Dashboard',      icon: LayoutDashboard },
  { href: '/dashboard/search',   label: 'New Search',     icon: Search },
  { href: '/dashboard/history',  label: 'Search History', icon: Clock3 },
  { href: '/dashboard/credits',  label: 'Credits',        icon: BadgeDollarSign },
  { href: '/dashboard/settings', label: 'Settings',       icon: Settings },
]

interface SidebarProps {
  onNavigate?: () => void
  mobile?: boolean
}

export function Sidebar({ onNavigate, mobile = false }: SidebarProps) {
  const pathname  = usePathname()
  const router    = useRouter()
  const { data }  = useCredits()
  const user      = useAuthStore((s) => s.user)
  const clearAuth = useAuthStore((s) => s.clearAuth)

  const initials = (user?.email || 'NL').slice(0, 2).toUpperCase()
  const balance  = data?.data?.balance ?? 0

  const logout = () => {
    localStorage.removeItem('nova_token')
    clearAuth()
    router.replace('/login')
  }

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-30 flex h-screen flex-col',
        mobile ? 'w-60 px-3 py-4' : 'hidden w-16 px-2 py-4 md:flex lg:w-60 lg:px-3'
      )}
      style={{
        background: 'linear-gradient(180deg, #021a18 0%, #042f2e 60%, #053b37 100%)',
        borderRight: '1px solid rgba(13,148,136,0.18)',
      }}
    >

      {/* ── Logo ──────────────────────────────────────────── */}
      <Link
        href="/"
        className="mb-8 flex items-center gap-3 rounded-xl px-2 py-1.5 transition-colors hover:bg-white/5"
        onClick={onNavigate}
      >
        <span
          className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-xl text-white"
          style={{
            background: 'linear-gradient(135deg,#14b8a6,#0d9488)',
            boxShadow: '0 4px 12px rgba(13,148,136,0.45)',
          }}
        >
          <Zap className="h-4.5 w-4.5" />
        </span>
        <div className={cn('min-w-0', !mobile && 'hidden lg:block')}>
          <p className="text-sm font-bold text-white leading-tight">NovaLead</p>
          <p className="text-xs leading-tight" style={{ color: 'rgba(153,246,228,0.6)' }}>
            AI Prospecting CRM
          </p>
        </div>
      </Link>

      {/* ── Nav label ─────────────────────────────────────── */}
      <p
        className={cn(
          'mb-2 px-3 text-[10px] font-bold uppercase tracking-widest',
          !mobile && 'hidden lg:block'
        )}
        style={{ color: 'rgba(153,246,228,0.4)' }}
      >
        Menu
      </p>

      {/* ── Nav items ─────────────────────────────────────── */}
      <nav className="space-y-0.5">
        {navItems.map((item) => {
          const active = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              title={item.label}
              className={cn(
                'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150',
                active
                  ? 'text-white'
                  : 'hover:bg-white/6'
              )}
              style={
                active
                  ? {
                      background: 'rgba(13,148,136,0.22)',
                      borderRight: '2px solid #0d9488',
                      color: '#5eead4',
                    }
                  : { color: 'rgba(153,246,228,0.65)' }
              }
              onMouseEnter={(e) => {
                if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
              }}
              onMouseLeave={(e) => {
                if (!active) e.currentTarget.style.background = 'transparent'
              }}
            >
              {/* Icon wrapper */}
              <span
                className={cn(
                  'grid h-7 w-7 flex-shrink-0 place-items-center rounded-lg transition-colors',
                  active ? '' : 'group-hover:bg-white/8'
                )}
                style={
                  active
                    ? { background: 'rgba(13,148,136,0.35)' }
                    : {}
                }
              >
                <item.icon
                  className="h-4 w-4"
                  style={{ color: active ? '#2dd4bf' : 'inherit' }}
                />
              </span>

              <span className={cn('truncate', !mobile && 'hidden lg:inline')}>
                {item.label}
              </span>

              {/* Active dot for collapsed (icon-only) mode */}
              {active && !mobile && (
                <span
                  className="absolute right-0 h-6 w-0.5 rounded-l-full lg:hidden"
                  style={{ background: '#0d9488' }}
                />
              )}
            </Link>
          )
        })}
      </nav>

      {/* ── Bottom user card ──────────────────────────────── */}
      <div
        className="mt-auto rounded-2xl p-3 space-y-3"
        style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(13,148,136,0.2)',
        }}
      >
        {/* Credits row */}
        <div className={cn('flex items-center justify-between', !mobile && 'lg:flex hidden')}>
          <span className="text-xs font-medium" style={{ color: 'rgba(153,246,228,0.55)' }}>
            Credits
          </span>
          <span
            className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-black"
            style={{
              background: balance > 3
                ? 'rgba(13,148,136,0.3)'
                : 'rgba(245,158,11,0.25)',
              color: balance > 3 ? '#2dd4bf' : '#fbbf24',
              border: `1px solid ${balance > 3 ? 'rgba(13,148,136,0.4)' : 'rgba(245,158,11,0.4)'}`,
            }}
          >
            {balance}
          </span>
        </div>

        {/* Collapsed credits badge (icon-only) */}
        <div className={cn(!mobile && 'flex justify-center lg:hidden')}>
          <span
            className={cn(
              'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-black',
              !mobile && 'lg:hidden'
            )}
            style={{
              background: balance > 3 ? 'rgba(13,148,136,0.3)' : 'rgba(245,158,11,0.25)',
              color: balance > 3 ? '#2dd4bf' : '#fbbf24',
            }}
          >
            {balance}
          </span>
        </div>

        {/* User info */}
        <div className="flex items-center gap-2.5">
          <Avatar className="h-8 w-8 flex-shrink-0">
            <AvatarFallback
              className="text-xs font-bold"
              style={{ background: 'linear-gradient(135deg,#14b8a6,#0d9488)', color: 'white' }}
            >
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className={cn('min-w-0 flex-1', !mobile && 'hidden lg:block')}>
            <p
              className="truncate text-xs font-semibold"
              style={{ color: 'rgba(204,251,241,0.9)' }}
            >
              {user?.email || 'user@novalead.app'}
            </p>
            <p className="text-[10px]" style={{ color: 'rgba(153,246,228,0.45)' }}>
              Active
            </p>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={logout}
          className={cn(
            'flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition-all hover:bg-red-500/15',
            !mobile ? 'w-10 justify-center lg:w-full lg:justify-start' : 'w-full'
          )}
          style={{ color: 'rgba(252,165,165,0.75)' }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#fca5a5')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(252,165,165,0.75)')}
        >
          <LogOut className="h-3.5 w-3.5 flex-shrink-0" />
          <span className={cn(!mobile && 'hidden lg:inline')}>Logout</span>
        </button>
      </div>
    </aside>
  )
}
