import { Archive, Brain, DatabaseZap } from 'lucide-react'
import { cn } from '@/lib/utils'

type CacheStrategy = 'hash' | 'miss' | 'semantic' | string | null | undefined

function strategyLabel(strategy: CacheStrategy) {
  if (!strategy) return 'miss'
  return strategy
}

function strategyIcon(strategy: CacheStrategy) {
  if (strategy === 'semantic') return Brain
  if (strategy === 'hash')     return Archive
  return DatabaseZap
}

export function CacheStatusBadge({
  cacheHit,
  cacheStrategy,
  className,
}: {
  cacheHit?:      boolean
  cacheStrategy?: CacheStrategy
  className?:     string
}) {
  const Icon  = strategyIcon(cacheStrategy)
  const label = cacheHit
    ? `Cache Hit · ${strategyLabel(cacheStrategy)}`
    : 'Cache Miss'

  /* ── Color schemes ── */
  const hit  = { bg: '#f0fdf9', border: '#a7f3d0', text: '#0f766e' }   // teal-mint
  const miss = { bg: '#fffbeb', border: '#fde68a', text: '#d97706' }   // amber

  const scheme = cacheHit ? hit : miss

  return (
    <span
      className={cn('inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold', className)}
      style={{
        background:   scheme.bg,
        borderColor:  scheme.border,
        color:        scheme.text,
      }}
      title={cacheHit ? 'Served from global cache' : 'Fetched from provider and stored in cache'}
    >
      <Icon className="h-3.5 w-3.5 flex-shrink-0" />
      {label}
    </span>
  )
}
