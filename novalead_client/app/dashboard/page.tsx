'use client'

import Link from 'next/link'
import { BarChart3, Coins, Search, Users, ArrowRight, TrendingUp } from 'lucide-react'

import { CacheStatusBadge } from '@/components/search/CacheStatusBadge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useCredits } from '@/hooks/useCredits'
import { useSearchHistory } from '@/hooks/useSearchHistory'

/* ─── Stat Card ─────────────────────────────────────────────── */
const statConfig: Record<string, { gradient: string; iconBg: string; iconColor: string; accent: string }> = {
  search:   { gradient: 'from-white to-teal-50/40',  iconBg: '#ccfbf1', iconColor: '#0d9488', accent: '#14b8a6' },
  users:    { gradient: 'from-white to-emerald-50/40', iconBg: '#d1fae5', iconColor: '#059669', accent: '#10b981' },
  coins:    { gradient: 'from-white to-amber-50/40',  iconBg: '#fef3c7', iconColor: '#d97706', accent: '#f59e0b' },
  barchart: { gradient: 'from-white to-violet-50/40', iconBg: '#ede9fe', iconColor: '#7c3aed', accent: '#8b5cf6' },
}

function Stat({
  title, value, icon: Icon, type, trend,
}: {
  title: string
  value: number
  icon: any
  type: keyof typeof statConfig
  trend?: string
}) {
  const cfg = statConfig[type]
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border bg-gradient-to-br ${cfg.gradient} p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md`}
      style={{ borderColor: '#d1fae5', boxShadow: '0 1px 4px rgba(13,148,136,0.06)' }}
    >
      {/* Decorative circle */}
      <div
        className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-10"
        style={{ background: cfg.accent }}
      />

      <div className="flex items-start justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#6b7280' }}>
          {title}
        </p>
        <span
          className="grid h-9 w-9 place-items-center rounded-xl"
          style={{ background: cfg.iconBg }}
        >
          <Icon className="h-4 w-4" style={{ color: cfg.iconColor }} />
        </span>
      </div>

      <p
        className="mt-3 text-4xl font-black tracking-tight"
        style={{ color: '#0f1a19', fontFamily: 'Plus Jakarta Sans, sans-serif' }}
      >
        {value.toLocaleString()}
      </p>

      {trend && (
        <div className="mt-2 flex items-center gap-1">
          <TrendingUp className="h-3 w-3 text-teal-600" />
          <span className="text-xs font-medium text-teal-700">{trend}</span>
        </div>
      )}
    </div>
  )
}

/* ─── Page ───────────────────────────────────────────────────── */
export default function DashboardHomePage() {
  const { data: creditsData } = useCredits()
  const { data: searches = [] } = useSearchHistory()

  const totalSearches    = searches.length
  const totalLeads       = searches.reduce((acc, item) => acc + (item.result_count ?? 0), 0)
  const creditsUsed      = searches.reduce((acc, item) => acc + (item.credits_used ?? 1), 0)
  const creditsRemaining = creditsData?.data?.balance ?? 0

  return (
    <div className="space-y-6" style={{ fontFamily: 'DM Sans, sans-serif' }}>

      {/* ── Page header ──────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-2xl font-black text-gray-900"
            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
          >
            Dashboard
          </h1>
          <p className="mt-0.5 text-sm" style={{ color: '#6b7280' }}>
            Overview of your lead discovery activity
          </p>
        </div>
        <Link
          href="/dashboard/search"
          className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition-all hover:-translate-y-px"
          style={{ background: 'linear-gradient(135deg,#14b8a6,#0d9488)', boxShadow: '0 4px 14px rgba(13,148,136,0.32)' }}
        >
          New Search
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* ── Stat cards ───────────────────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat title="Total Searches"    value={totalSearches}    icon={Search}   type="search"   trend="All time" />
        <Stat title="Total Leads Found" value={totalLeads}       icon={Users}    type="users"    trend="Across searches" />
        <Stat title="Credits Remaining" value={creditsRemaining} icon={Coins}    type="coins" />
        <Stat title="Credits Used"      value={creditsUsed}      icon={BarChart3} type="barchart" />
      </div>

      {/* ── Recent Searches table ────────────────────────────── */}
      <div
        className="overflow-hidden rounded-2xl border"
        style={{ background: 'white', borderColor: '#d1fae5', boxShadow: '0 1px 4px rgba(13,148,136,0.06)' }}
      >
        {/* Card header */}
        <div
          className="flex items-center justify-between border-b px-6 py-4"
          style={{ borderColor: '#d1fae5' }}
        >
          <div>
            <h2 className="text-base font-bold text-gray-900">Recent Searches</h2>
            <p className="mt-0.5 text-xs" style={{ color: '#9ca3af' }}>Your last {Math.min(searches.length, 6)} searches</p>
          </div>
          <Link
            href="/dashboard/history"
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all hover:bg-teal-50"
            style={{ color: '#0d9488', border: '1px solid #a7f3d0' }}
          >
            View all
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {searches.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div
              className="mb-4 grid h-14 w-14 place-items-center rounded-2xl"
              style={{ background: '#ccfbf1' }}
            >
              <Search className="h-6 w-6" style={{ color: '#0d9488' }} />
            </div>
            <p className="text-sm font-semibold text-gray-900">No searches yet</p>
            <p className="mt-1 text-xs" style={{ color: '#9ca3af' }}>Launch your first AI search to see results here</p>
            <Link
              href="/dashboard/search"
              className="mt-4 inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white"
              style={{ background: 'linear-gradient(135deg,#14b8a6,#0d9488)' }}
            >
              Start Searching <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow
                  className="border-0 hover:bg-transparent"
                  style={{ background: '#f0fdf9' }}
                >
                  {['Prompt', 'Cache', 'Leads', 'Credits', 'Date', 'Action'].map((h) => (
                    <TableHead
                      key={h}
                      className="px-5 py-3 text-xs font-bold uppercase tracking-wider"
                      style={{ color: '#6b7280' }}
                    >
                      {h}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>

              <TableBody>
                {searches.slice(0, 6).map((item, idx) => (
                  <TableRow
                    key={item.id}
                    className="border-0 transition-colors"
                    style={{ borderTop: '1px solid #f0fdf9' }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(13,148,136,0.04)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    {/* Prompt */}
                    <TableCell className="max-w-[240px] truncate px-5 py-3.5 text-sm font-medium text-gray-900">
                      <div className="flex items-center gap-2.5">
                        <span
                          className="grid h-7 w-7 flex-shrink-0 place-items-center rounded-lg text-xs font-black text-white"
                          style={{ background: ['#14b8a6','#f59e0b','#818cf8','#f472b6','#34d399','#fb923c'][idx % 6] }}
                        >
                          {idx + 1}
                        </span>
                        <span className="truncate">{item.prompt}</span>
                      </div>
                    </TableCell>

                    {/* Cache */}
                    <TableCell className="px-5 py-3.5">
                      <CacheStatusBadge
                        cacheHit={item.cache_hit}
                        cacheStrategy={item.cache_strategy}
                        className="w-fit"
                      />
                    </TableCell>

                    {/* Leads */}
                    <TableCell className="px-5 py-3.5">
                      <span
                        className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold"
                        style={{ background: '#ccfbf1', color: '#0f766e' }}
                      >
                        {item.result_count ?? 0}
                      </span>
                    </TableCell>

                    {/* Credits */}
                    <TableCell className="px-5 py-3.5">
                      <span
                        className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold"
                        style={{ background: '#fef3c7', color: '#d97706' }}
                      >
                        {item.credits_used ?? 0}
                      </span>
                    </TableCell>

                    {/* Date */}
                    <TableCell className="px-5 py-3.5 text-sm" style={{ color: '#6b7280' }}>
                      {new Date(item.created_at).toLocaleDateString('en-US', {
                        month: 'short', day: 'numeric', year: 'numeric'
                      })}
                    </TableCell>

                    {/* Action */}
                    <TableCell className="px-5 py-3.5">
                      <Link
                        href={`/dashboard/history/${item.id}`}
                        className="inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all hover:bg-teal-50 hover:-translate-y-px"
                        style={{ color: '#0d9488', borderColor: '#a7f3d0' }}
                      >
                        View
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  )
}
