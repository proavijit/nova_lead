'use client'

import { useMemo } from 'react'
import { useParams } from 'next/navigation'
import { Coins, Fingerprint } from 'lucide-react'

import { CacheStatusBadge } from '@/components/search/CacheStatusBadge'
import { SearchResultsTable } from '@/components/search/SearchResultsTable'
import { Button } from '@/components/ui/button'
import { useSearchById } from '@/hooks/useSearchHistory'

export default function DashboardHistoryDetailPage() {
  const params = useParams<{ id: string }>()
  const id = params?.id ?? ''
  const { data, isLoading } = useSearchById(id)
  const leads = data?.leads ?? []

  const csv = useMemo(() => {
    if (!leads.length) return ''

    const rows = [
      ['name', 'title', 'linkedin_url', 'company_name', 'company_linkedin_url', 'company_website'].join(','),
      ...leads.map((lead: any) =>
        [
          lead.name,
          lead.title,
          lead.linkedin_url,
          lead.company?.name ?? lead.company_name,
          lead.company?.linkedin_url ?? lead.company_linkedin_url,
          lead.company?.website ?? lead.company_website
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
    a.download = `leads-${id}-${Date.now()}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold">Search Detail</h2>
        <p className="text-slate-600">{data?.search?.prompt || 'Loading prompt...'}</p>
      </div>

      {data?.search && (
        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
          <CacheStatusBadge cacheHit={data.search.cache_hit} cacheStrategy={data.search.cache_strategy} />
          <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5">
            <Coins className="h-3.5 w-3.5 text-slate-500" />
            Credits charged: <strong className="text-slate-900">{data.search.credits_charged ?? 0}</strong>
          </span>
          {data.search.cache_id && (
            <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 font-mono text-xs" title={data.search.cache_id}>
              <Fingerprint className="h-3.5 w-3.5 text-slate-500" />
              {data.search.cache_id}
            </span>
          )}
        </div>
      )}

      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold">Results</h3>
        <Button variant="outline" onClick={exportCsv} disabled={!leads.length} className="rounded-lg border-slate-300 bg-white">
          Export CSV
        </Button>
      </div>

      <SearchResultsTable leads={leads} isLoading={isLoading} />
    </div>
  )
}

