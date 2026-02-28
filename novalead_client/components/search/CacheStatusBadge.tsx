import { Archive, Brain, DatabaseZap } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

type CacheStrategy = 'hash' | 'miss' | 'semantic' | string | null | undefined

function strategyLabel(strategy: CacheStrategy) {
  if (!strategy) return 'miss'
  return strategy
}

function strategyIcon(strategy: CacheStrategy) {
  if (strategy === 'semantic') return Brain
  if (strategy === 'hash') return Archive
  return DatabaseZap
}

export function CacheStatusBadge({
  cacheHit,
  cacheStrategy,
  className
}: {
  cacheHit?: boolean
  cacheStrategy?: CacheStrategy
  className?: string
}) {
  const Icon = strategyIcon(cacheStrategy)
  const label = cacheHit ? `Cache Hit (${strategyLabel(cacheStrategy)})` : 'Cache Miss'

  return (
    <Badge
      variant="outline"
      className={cn(
        'inline-flex gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold',
        cacheHit
          ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
          : 'border-amber-200 bg-amber-50 text-amber-700',
        className
      )}
      title={cacheHit ? 'Served from global cache' : 'Fetched from provider and stored in cache'}
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </Badge>
  )
}
