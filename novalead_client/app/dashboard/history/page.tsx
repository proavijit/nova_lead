'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import {
  Building2, CalendarClock, Coins, Fingerprint, Hash,
  Play, Search as SearchIcon, User, ArrowRight, Trash2, Clock3
} from 'lucide-react'

import { EmptyState } from '@/components/common/EmptyState'
import { ErrorAlert } from '@/components/common/ErrorAlert'
import { CacheStatusBadge } from '@/components/search/CacheStatusBadge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useDeleteSearch, useSearchHistory } from '@/hooks/useSearchHistory'
import type { LeadSnapshotItem } from '@/types/search'

function getLeadPreview(search: any): { title: string | null; company: string | null } {
  if (search.lead_snapshot?.length > 0) {
    const first = search.lead_snapshot[0] as LeadSnapshotItem
    return { title: first.title, company: first.company?.name ?? null }
  }
  return { title: null, company: null }
}

/* Row index → avatar color */
const avatarColors = ['#14b8a6', '#f59e0b', '#818cf8', '#f472b6', '#34d399', '#fb923c']

export default function DashboardHistoryPage() {
  const { data = [], isLoading, error } = useSearchHistory()
  const { mutate: deleteSearch, isPending } = useDeleteSearch()
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const v = query.trim().toLowerCase()
    return v ? data.filter((i) => i.prompt.toLowerCase().includes(v)) : data
  }, [data, query])

  /* ── Loading ── */
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="h-32 animate-pulse rounded-2xl border"
            style={{ background: '#f0fdf9', borderColor: '#d1fae5' }}
          />
        ))}
      </div>
    )
  }

  /* ── Error ── */
  if (error) {
    return <ErrorAlert message={(error as any)?.response?.data?.error || 'Failed to load search history'} />
  }

  return (
    <div className="space-y-6" style={{ fontFamily: 'DM Sans, sans-serif' }}>

      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-2xl font-black text-gray-900"
            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
          >
            Search History
          </h1>
          <p className="mt-0.5 text-sm" style={{ color: '#6b7280' }}>
            Review and reuse your previous AI lead searches.
          </p>
        </div>
        {data.length > 0 && (
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold"
            style={{ background: '#ccfbf1', color: '#0f766e', border: '1px solid #a7f3d0' }}
          >
            <Clock3 className="h-3.5 w-3.5" />
            {data.length} search{data.length !== 1 ? 'es' : ''}
          </span>
        )}
      </div>

      {/* Filter bar */}
      <div
        className="rounded-2xl border p-4"
        style={{ background: 'white', borderColor: '#d1fae5', boxShadow: '0 1px 4px rgba(13,148,136,0.06)' }}
      >
        <div className="relative">
          <SearchIcon
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2"
            style={{ color: '#9ca3af' }}
          />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter by search prompt…"
            className="h-11 rounded-xl border-gray-200 bg-gray-50/60 pl-10 text-sm transition-all focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
          />
        </div>
      </div>

      {/* Empty state */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div
            className="mb-4 grid h-16 w-16 place-items-center rounded-2xl"
            style={{ background: '#f0fdf9', border: '1px solid #d1fae5' }}
          >
            <Clock3 className="h-7 w-7" style={{ color: '#0d9488' }} />
          </div>
          <p className="text-base font-bold text-gray-900">
            {query ? 'No matching searches' : 'No searches yet'}
          </p>
          <p className="mt-1 text-sm" style={{ color: '#9ca3af' }}>
            {query ? 'Try a different keyword.' : 'Start your first search to build history.'}
          </p>
          {!query && (
            <Link
              href="/dashboard/search"
              className="mt-5 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-all hover:-translate-y-px"
              style={{ background: 'linear-gradient(135deg,#14b8a6,#0d9488)', boxShadow: '0 4px 14px rgba(13,148,136,0.3)' }}
            >
              Start New Search <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>
      ) : (
        <div className="grid gap-3">
          {filtered.map((item, idx) => {
            const preview    = getLeadPreview(item)
            const accentColor = avatarColors[idx % avatarColors.length]

            return (
              <div
                key={item.id}
                className="group overflow-hidden rounded-2xl border bg-white transition-all duration-200 hover:-translate-y-0.5"
                style={{ borderColor: '#d1fae5', boxShadow: '0 1px 4px rgba(13,148,136,0.06)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#0d9488'
                  e.currentTarget.style.boxShadow   = '0 6px 24px rgba(13,148,136,0.12)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#d1fae5'
                  e.currentTarget.style.boxShadow   = '0 1px 4px rgba(13,148,136,0.06)'
                }}
              >
                {/* Top accent strip */}
                <div className="h-0.5 w-full transition-all group-hover:h-1" style={{ background: `linear-gradient(90deg,${accentColor},transparent)` }} />

                <div className="p-5">
                  {/* Row 1: index badge + prompt + result count */}
                  <div className="flex items-start gap-3">
                    <span
                      className="mt-0.5 grid h-7 w-7 flex-shrink-0 place-items-center rounded-lg text-xs font-black text-white"
                      style={{ background: accentColor }}
                    >
                      {idx + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-2 text-sm font-bold text-gray-900 leading-snug">
                        {item.prompt}
                      </p>
                    </div>
                    <span
                      className="flex-shrink-0 inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold"
                      style={{ background: '#ccfbf1', color: '#0f766e', border: '1px solid #a7f3d0' }}
                    >
                      {item.result_count ?? 0} leads
                    </span>
                  </div>

                  {/* Row 2: meta chips */}
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    {/* Date */}
                    <span
                      className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium"
                      style={{ background: '#f9fafb', color: '#6b7280', border: '1px solid #e5e7eb' }}
                    >
                      <CalendarClock className="h-3.5 w-3.5" />
                      {new Date(item.created_at).toLocaleString('en-US', {
                        month: 'short', day: 'numeric', year: 'numeric',
                        hour: '2-digit', minute: '2-digit',
                      })}
                    </span>

                    {/* Credits */}
                    <span
                      className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold"
                      style={{ background: '#fffbeb', color: '#d97706', border: '1px solid #fde68a' }}
                    >
                      <Coins className="h-3.5 w-3.5" />
                      {item.credits_used ?? 0} credits
                    </span>

                    {/* Cache badge — unchanged component */}
                    <CacheStatusBadge cacheHit={item.cache_hit} cacheStrategy={item.cache_strategy} />

                    {/* Cache ID */}
                    {item.cache_id && (
                      <span
                        className="inline-flex items-center gap-1 rounded-full border px-2.5 py-1 font-mono text-xs"
                        style={{ background: '#faf5ff', borderColor: '#e9d5ff', color: '#7c3aed' }}
                        title={item.cache_id}
                      >
                        <Fingerprint className="h-3.5 w-3.5" />
                        {item.cache_id.slice(0, 8)}…
                      </span>
                    )}

                    {/* Filter hash */}
                    {item.filter_hash && (
                      <span
                        className="inline-flex items-center gap-1 rounded-full border px-2.5 py-1 font-mono text-xs"
                        style={{ background: '#f8fafc', borderColor: '#e2e8f0', color: '#64748b' }}
                        title={`Full hash: ${item.filter_hash}`}
                      >
                        <Hash className="h-3.5 w-3.5" />
                        {item.filter_hash.slice(0, 10)}…
                      </span>
                    )}
                  </div>

                  {/* Row 3: lead preview */}
                  {(preview.title || preview.company) && (
                    <div
                      className="mt-3 flex flex-wrap gap-4 rounded-xl px-3 py-2.5 text-xs"
                      style={{ background: '#f0fdf9', border: '1px solid #d1fae5' }}
                    >
                      {preview.title && (
                        <span className="inline-flex items-center gap-1.5 font-medium" style={{ color: '#374151' }}>
                          <User className="h-3.5 w-3.5" style={{ color: '#0d9488' }} />
                          {preview.title}
                        </span>
                      )}
                      {preview.company && (
                        <span className="inline-flex items-center gap-1.5 font-medium" style={{ color: '#374151' }}>
                          <Building2 className="h-3.5 w-3.5" style={{ color: '#0d9488' }} />
                          {preview.company}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Row 4: actions */}
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap gap-2">
                      {/* Re-run */}
                      <Link href={`/dashboard/search?prompt=${encodeURIComponent(item.prompt)}`}>
                        <button
                          className="inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold text-white transition-all hover:-translate-y-px active:scale-[0.98]"
                          style={{
                            background: 'linear-gradient(135deg,#14b8a6,#0d9488)',
                            boxShadow: '0 2px 10px rgba(13,148,136,0.3)',
                          }}
                        >
                          <Play className="h-3.5 w-3.5" />
                          Re-run Search
                        </button>
                      </Link>

                      {/* View Details */}
                      <Link href={`/dashboard/history/${item.id}`}>
                        <button
                          className="inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-semibold transition-all hover:bg-teal-50 hover:-translate-y-px"
                          style={{ borderColor: '#a7f3d0', color: '#0f766e', background: 'white' }}
                        >
                          View Details
                          <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      </Link>
                    </div>

                    {/* Delete */}
                    <button
                      disabled={isPending}
                      onClick={() => deleteSearch(item.id)}
                      className="inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all hover:bg-red-50 hover:-translate-y-px disabled:opacity-40"
                      style={{ color: '#ef4444', border: '1px solid #fecaca', background: 'white' }}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
