'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Clock3, Coins, Search } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useCredits } from '@/hooks/useCredits'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/search', label: 'Search', icon: Search },
  { href: '/history', label: 'History', icon: Clock3 },
  { href: '/credits', label: 'Credits', icon: Coins }
]

export function Sidebar() {
  const pathname = usePathname()
  const { data } = useCredits()

  return (
    <aside className="flex h-full w-full flex-col border-r bg-card px-4 py-6 md:w-64">
      <div>
        <p className="text-lg font-semibold">NovaLead</p>
        <p className="text-xs text-muted-foreground">AI Prospecting</p>
      </div>

      <Separator className="my-4" />

      <div className="mb-4 flex items-center justify-between rounded-md bg-muted/60 px-3 py-2">
        <span className="text-sm text-muted-foreground">Credits</span>
        <Badge variant="outline">{data?.balance ?? 0}</Badge>
      </div>

      <nav className="space-y-1">
        {navItems.map((item) => {
          const active = pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors',
                active ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
