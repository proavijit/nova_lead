import { Coins, TrendingUp, AlertTriangle } from 'lucide-react'

export function CreditBalance({ balance }: { balance: number }) {
  const progress  = Math.min(100, Math.max(5, Math.round((balance / 100) * 100)))
  const lowCredits = balance <= 10
  const noCredits  = balance === 0

  /* Dynamic colour set based on balance level */
  const scheme = noCredits
    ? { bar: '#ef4444', barBg: '#fee2e2', text: '#dc2626', badge: '#fee2e2', badgeText: '#dc2626', icon: '#ef4444' }
    : lowCredits
    ? { bar: '#f59e0b', barBg: '#fef3c7', text: '#d97706', badge: '#fef3c7', badgeText: '#d97706', icon: '#f59e0b' }
    : { bar: 'linear-gradient(90deg,#14b8a6,#0d9488)', barBg: '#d1fae5', text: '#0d9488', badge: '#ccfbf1', badgeText: '#0f766e', icon: '#0d9488' }

  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl border p-6"
      style={{
        background: 'white',
        borderColor: noCredits ? '#fecaca' : lowCredits ? '#fde68a' : '#d1fae5',
        boxShadow: noCredits
          ? '0 1px 4px rgba(220,38,38,0.08)'
          : lowCredits
          ? '0 1px 4px rgba(245,158,11,0.08)'
          : '0 1px 4px rgba(13,148,136,0.08)',
      }}
    >
      {/* Decorative bg circle */}
      <div
        className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full opacity-[0.06]"
        style={{ background: scheme.text }}
      />

      {/* Header row */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className="grid h-8 w-8 place-items-center rounded-lg"
            style={{ background: scheme.badge }}
          >
            <Coins className="h-4 w-4" style={{ color: scheme.icon }} />
          </span>
          <span
            className="text-xs font-bold uppercase tracking-widest"
            style={{ color: '#9ca3af' }}
          >
            Credits Remaining
          </span>
        </div>

        {/* Status badge */}
        {(lowCredits || noCredits) && (
          <span
            className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold"
            style={{ background: scheme.badge, color: scheme.badgeText }}
          >
            <AlertTriangle className="h-3 w-3" />
            {noCredits ? 'No credits' : 'Low credits'}
          </span>
        )}

        {!lowCredits && !noCredits && (
          <span
            className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold"
            style={{ background: '#ccfbf1', color: '#0f766e' }}
          >
            <TrendingUp className="h-3 w-3" />
            Active
          </span>
        )}
      </div>

      {/* Big number */}
      <div className="mb-4 flex items-end gap-2.5">
        <span
          className="text-6xl font-black leading-none tracking-tight"
          style={{ color: scheme.text, fontFamily: 'Plus Jakarta Sans, sans-serif' }}
        >
          {balance}
        </span>
        <span
          className="mb-1.5 text-sm font-bold uppercase tracking-wider"
          style={{ color: '#9ca3af' }}
        >
          Credits
        </span>
      </div>

      {/* Progress bar */}
      <div className="mb-3 space-y-1.5">
        <div
          className="h-2.5 w-full overflow-hidden rounded-full"
          style={{ background: scheme.barBg }}
        >
          <div
            className="h-2.5 rounded-full transition-all duration-700"
            style={{
              width: `${progress}%`,
              background: scheme.bar,
              boxShadow: noCredits || lowCredits ? 'none' : '0 0 8px rgba(13,148,136,0.4)',
            }}
          />
        </div>
        <div className="flex justify-between text-[10px] font-medium" style={{ color: '#9ca3af' }}>
          <span>0</span>
          <span>{progress}% used</span>
          <span>100</span>
        </div>
      </div>

      {/* Footer note */}
      <p className="text-xs leading-relaxed" style={{ color: '#6b7280' }}>
        {noCredits
          ? 'You have no credits left. Upgrade to continue running AI lead searches.'
          : lowCredits
          ? 'Running low — consider upgrading to keep your pipeline flowing.'
          : 'Use credits to run AI lead discovery searches and export prospect lists.'}
      </p>
    </div>
  )
}
