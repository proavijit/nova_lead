'use client'

import { useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { Coins, Database, Fingerprint, Download, Search } from 'lucide-react'

import { ErrorAlert } from '@/components/common/ErrorAlert'
import { CacheStatusBadge } from '@/components/search/CacheStatusBadge'
import { FilterPreview } from '@/components/search/FilterPreview'
import { SearchBox } from '@/components/search/SearchBox'
import { SearchResultsTable } from '@/components/search/SearchResultsTable'
import { useSearch } from '@/hooks/useSearch'

export default function DashboardSearchPage() {
  const params = useSearchParams()
  const initialPrompt = params.get('prompt') || ''
  const { mutate, isPending, data, error } = useSearch()

  const leads          = data?.data?.leads ?? []
  const cacheHit       = Boolean(data?.data?.cache_hit)
  const cacheStrategy  = data?.data?.cache_strategy ?? (cacheHit ? 'hash' : 'miss')
  const creditsCharged = data?.data?.credits_charged ?? 0
  const cacheId        = data?.data?.cache_id ?? null

  const csv = useMemo(() => {
    if (!leads.length) return ''
    const rows = [
      ['name', 'title', 'linkedin_url', 'company_name', 'company_linkedin_url', 'company_website'].join(','),
      ...leads.map((lead: any) =>
        [lead.name, lead.title, lead.linkedin_url, lead.company?.name, lead.company?.linkedin_url, lead.company?.website]
          .map((v) => `"${(v ?? '').toString().replaceAll('"', '""')}"`)
          .join(',')
      ),
    ]
    return rows.join('\n')
  }, [leads])

  const exportCsv = () => {
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href = url
    a.download = `leads-${Date.now()}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-5" style={{ fontFamily: 'DM Sans, sans-serif' }}>

      {/* Page header */}
      <div>
        <h1
          className="text-2xl font-black text-gray-900"
          style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
        >
          New Search
        </h1>
        <p className="mt-0.5 text-sm" style={{ color: '#6b7280' }}>
          Describe your ideal prospect and let AI find verified leads instantly.
        </p>
      </div>

      {/* Search box — unchanged component */}
      <SearchBox
        isPending={isPending}
        onSearch={(prompt) => mutate({ prompt, page: 1 })}
        initialPrompt={initialPrompt}
      />

      {/* Error */}
      {error && (
        <ErrorAlert message={(error as any)?.response?.data?.error || 'Search failed'} />
      )}

      {/* Filter preview — unchanged component */}
      <FilterPreview filters={data?.data?.filters} />

      {/* Results header row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span
            className="grid h-8 w-8 place-items-center rounded-lg"
            style={{ background: '#ccfbf1' }}
          >
            <Search className="h-4 w-4" style={{ color: '#0d9488' }} />
          </span>
          <div>
            <h2 className="text-base font-bold text-gray-900">Results</h2>
            {leads.length > 0 && (
              <p className="text-xs" style={{ color: '#9ca3af' }}>
                {leads.length} lead{leads.length !== 1 ? 's' : ''} found
              </p>
            )}
          </div>
        </div>

        <button
          onClick={exportCsv}
          disabled={!leads.length}
          className="inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition-all hover:-translate-y-px hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-40"
          style={{
            borderColor: leads.length ? '#a7f3d0' : '#e5e7eb',
            color: leads.length ? '#0f766e' : '#9ca3af',
            background: 'white',
          }}
        >
          <Download className="h-4 w-4" />
          Export CSV
        </button>
      </div>

      {/* Cache / meta info bar */}
      {data?.data && (
        <div
          className="flex flex-wrap items-center gap-2.5 rounded-2xl border p-4"
          style={{ background: 'white', borderColor: '#d1fae5', boxShadow: '0 1px 4px rgba(13,148,136,0.06)' }}
        >
          {/* Cache hit/miss badge — unchanged component */}
          <CacheStatusBadge cacheHit={cacheHit} cacheStrategy={cacheStrategy} />

          {/* Strategy */}
          <span
            className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium"
            style={{ borderColor: '#d1fae5', background: '#f0fdf9', color: '#374151' }}
          >
            <Database className="h-3.5 w-3.5" style={{ color: '#0d9488' }} />
            Strategy:&nbsp;<strong style={{ color: '#0f766e' }}>{cacheStrategy}</strong>
          </span>

          {/* Credits charged */}
          <span
            className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium"
            style={{ borderColor: '#fde68a', background: '#fffbeb', color: '#374151' }}
          >
            <Coins className="h-3.5 w-3.5 text-amber-500" />
            Charged:&nbsp;<strong style={{ color: '#d97706' }}>{creditsCharged}</strong>
          </span>

          {/* Cache ID */}
          {cacheId && (
            <span
              className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-xs"
              style={{ borderColor: '#e9d5ff', background: '#faf5ff', color: '#6b7280' }}
              title={cacheId}
            >
              <Fingerprint className="h-3.5 w-3.5 text-violet-500" />
              Cache ID:&nbsp;{cacheId.slice(0, 8)}…
            </span>
          )}
        </div>
      )}

      {/* Results table — unchanged component */}
      <div
        className="overflow-hidden rounded-2xl border"
        style={{
          borderColor: '#d1fae5',
          boxShadow: '0 1px 4px rgba(13,148,136,0.06)',
        }}
      >
        <SearchResultsTable leads={leads} isLoading={isPending} />
      </div>
    </div>
  )
}
