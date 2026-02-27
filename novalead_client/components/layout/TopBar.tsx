'use client'

import { Menu, Wallet } from 'lucide-react'
import { usePathname } from 'next/navigation'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useCredits } from '@/hooks/useCredits'
import { useAuthStore } from '@/store/authStore'

const titles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/dashboard/search': 'New Search',
  '/dashboard/history': 'Search History',
  '/dashboard/credits': 'Credits',
  '/dashboard/settings': 'Settings'
}

export function TopBar({ onMenu }: { onMenu: () => void }) {
  const pathname = usePathname()
  const { data } = useCredits()
  const user = useAuthStore((state) => state.user)
  const initials = (user?.email || 'NL').slice(0, 2).toUpperCase()

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 md:px-6">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="text-slate-700 md:hidden"
          onClick={onMenu}
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <h1 className="text-base font-semibold text-slate-900 md:text-lg">{titles[pathname] || 'Dashboard'}</h1>
      </div>

      <div className="flex items-center gap-3">
        <Badge className="bg-blue-500 text-white">
          <Wallet className="mr-1 h-3 w-3" />
          {data?.data?.balance ?? 0} Credits
        </Badge>
        <Avatar className="h-8 w-8">
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}
