'use client'

import { Menu, Wallet, ChevronRight } from 'lucide-react'
import { usePathname } from 'next/navigation'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { useCredits } from '@/hooks/useCredits'
import { useAuthStore } from '@/store/authStore'

const titles: Record<string, { label: string; parent?: string }> = {
  '/dashboard':          { label: 'Dashboard' },
  '/dashboard/search':   { label: 'New Search',     parent: 'Dashboard' },
  '/dashboard/history':  { label: 'Search History', parent: 'Dashboard' },
  '/dashboard/credits':  { label: 'Credits',        parent: 'Dashboard' },
  '/dashboard/settings': { label: 'Settings',       parent: 'Dashboard' },
}

export function TopBar({ onMenu }: { onMenu: () => void }) {
  const pathname = usePathname()
  const { data } = useCredits()
  const user     = useAuthStore((s) => s.user)

  const initials = (user?.email || 'NL').slice(0, 2).toUpperCase()
  const balance  = data?.data?.balance ?? 0
  const page     = titles[pathname] ?? { label: 'Dashboard' }
  const lowCredits = balance <= 3

  return (
    <header
      className="sticky top-0 z-20 flex h-[60px] items-center justify-between border-b px-4 sm:px-6 lg:px-8"
      style={{
        background: 'rgba(248,255,254,0.94)',
        borderColor: '#d1fae5',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
      }}
    >

      {/* ── Left: hamburger + breadcrumb title ────────────── */}
      <div className="flex items-center gap-3">
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          className="rounded-lg md:hidden"
          style={{ color: '#0d9488', background: 'transparent' }}
          onClick={onMenu}
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-sm">
          {page.parent && (
            <>
              <span style={{ color: '#9ca3af' }}>{page.parent}</span>
              <ChevronRight className="h-3.5 w-3.5" style={{ color: '#d1fae5' }} />
            </>
          )}
          <h1
            className="font-bold"
            style={{ color: '#0f1a19', fontFamily: 'Plus Jakarta Sans, sans-serif' }}
          >
            {page.label}
          </h1>
        </div>
      </div>

      {/* ── Right: credits badge + avatar ─────────────────── */}
      <div className="flex items-center gap-2.5">

        {/* Credits badge */}
        <div
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition-all"
          style={{
            background: lowCredits
              ? 'rgba(245,158,11,0.12)'
              : 'rgba(13,148,136,0.1)',
            color: lowCredits ? '#d97706' : '#0f766e',
            border: `1px solid ${lowCredits ? 'rgba(245,158,11,0.3)' : 'rgba(13,148,136,0.25)'}`,
          }}
          title={lowCredits ? 'Low credits — consider upgrading' : `${balance} credits available`}
        >
          <Wallet className="h-3.5 w-3.5" />
          <span>{balance}</span>
          <span className="hidden sm:inline" style={{ opacity: 0.7 }}>Credits</span>
          {lowCredits && (
            <span
              className="ml-0.5 h-1.5 w-1.5 rounded-full animate-pulse"
              style={{ background: '#f59e0b' }}
            />
          )}
        </div>

        {/* Divider */}
        <div className="h-5 w-px" style={{ background: '#d1fae5' }} />

        {/* Avatar */}
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback
              className="text-xs font-black"
              style={{
                background: 'linear-gradient(135deg,#14b8a6,#0d9488)',
                color: 'white',
              }}
            >
              {initials}
            </AvatarFallback>
          </Avatar>
          {/* Email (hidden on small screens) */}
          <span
            className="hidden max-w-[140px] truncate text-xs font-medium lg:block"
            style={{ color: '#6b7280' }}
          >
            {user?.email || 'user@novalead.app'}
          </span>
        </div>
      </div>
    </header>
  )
}
