'use client'

import { useMemo } from 'react'
import { Coins, Database, Fingerprint } from 'lucide-react'

import { ErrorAlert } from '@/components/common/ErrorAlert'
import { CacheStatusBadge } from '@/components/search/CacheStatusBadge'
import { FilterPreview } from '@/components/search/FilterPreview'
import { SearchBox } from '@/components/search/SearchBox'
import { SearchResultsTable } from '@/components/search/SearchResultsTable'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useSearch } from '@/hooks/useSearch'

export default function DashboardSearchPage() {
  const { mutate, isPending, data, error } = useSearch()
  const leads = data?.data?.leads ?? []
  const cacheHit = Boolean(data?.data?.cache_hit)
  const cacheStrategy = data?.data?.cache_strategy ?? (cacheHit ? 'hash' : 'miss')
  const creditsCharged = data?.data?.credits_charged ?? 0
  const cacheId = data?.data?.cache_id ?? null

  const csv = useMemo(() => {
    if (!leads.length) return ''

    const rows = [
      ['name', 'title', 'linkedin_url', 'company_name', 'company_linkedin_url', 'company_website'].join(','),
      ...leads.map((lead: any) =>
        [
          lead.name,
          lead.title,
          lead.linkedin_url,
          lead.company?.name,
          lead.company?.linkedin_url,
          lead.company?.website
        ]
          .map((value) => `"${(value ?? '').toString().replaceAll('"', '""')}"`)
          .join(',')
      )
    ]

    return rows.join('\n')
  }, [leads])

  const exportCsv = () => {
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `leads-${Date.now()}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <SearchBox isPending={isPending} onSearch={(prompt) => mutate({ prompt, page: 1 })} />

      {error && <ErrorAlert message={(error as any)?.response?.data?.error || 'Search failed'} />}

      <FilterPreview filters={data?.data?.filters} />

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Results</h2>
        <Button variant="outline" onClick={exportCsv} disabled={!leads.length}>
          Export CSV
        </Button>
      </div>

      {data?.data && (
        <Card className="rounded-lg border-slate-200 bg-white shadow-sm">
          <CardContent className="flex flex-wrap items-center gap-3 p-4 text-sm text-slate-700">
            <CacheStatusBadge cacheHit={cacheHit} cacheStrategy={cacheStrategy} />
            <span
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1"
              title="How this result was served"
            >
              <Database className="h-3.5 w-3.5 text-slate-500" />
              Strategy: <strong className="text-slate-900">{cacheStrategy}</strong>
            </span>
            <span
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1"
              title="Credits consumed by this search request"
            >
              <Coins className="h-3.5 w-3.5 text-slate-500" />
              Charged: <strong className="text-slate-900">{creditsCharged}</strong>
            </span>
            {cacheId && (
              <span
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 font-mono text-xs"
                title={cacheId}
              >
                <Fingerprint className="h-3.5 w-3.5 text-slate-500" />
                Cache ID: {cacheId.slice(0, 8)}...
              </span>
            )}
          </CardContent>
        </Card>
      )}

      <SearchResultsTable leads={leads} isLoading={isPending} />
    </div>
  )
}
