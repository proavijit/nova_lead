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
    <aside className="sticky top-0 flex h-screen w-full flex-col border-r bg-card/50 backdrop-blur-xl px-4 py-8 md:w-72">
      <div className="px-3 mb-8">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
          NovaLead
        </h1>
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mt-1">
          Revenue Intelligence
        </p>
      </div>

      <div className="mb-8 p-4 rounded-xl bg-gradient-to-br from-primary/10 to-blue-600/10 border border-primary/20">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-semibold text-primary">AI Credits</span>
          <Badge className="bg-primary hover:bg-primary shadow-sm">{data?.data?.balance ?? 0}</Badge>
        </div>
        <div className="w-full bg-muted rounded-full h-1.5 mt-2">
          <div
            className="bg-primary h-1.5 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(((data?.data?.balance ?? 0) / 100) * 100, 100)}%` }}
          />
        </div>
      </div>

      <nav className="space-y-2 flex-1">
        {navItems.map((item) => {
          const active = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200',
                active
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-[1.02]'
                  : 'hover:bg-muted text-muted-foreground hover:text-foreground'
              )}
            >
              <item.icon className={cn("h-5 w-5", active ? "text-primary-foreground" : "text-muted-foreground group-hover:text-primary transition-colors")} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="mt-auto px-3 py-4 border-t border-border/50">
        <div className="flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs text-muted-foreground font-medium">System Online</span>
        </div>
      </div>
    </aside>
  )
}
