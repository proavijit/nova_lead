'use client'

import { useParams } from 'next/navigation'
import { Coins, Fingerprint } from 'lucide-react'

import { CacheStatusBadge } from '@/components/search/CacheStatusBadge'
import { SearchResultsTable } from '@/components/search/SearchResultsTable'
import { useSearchById } from '@/hooks/useSearchHistory'

export default function DashboardHistoryDetailPage() {
  const params = useParams<{ id: string }>()
  const id = params?.id ?? ''
  const { data, isLoading } = useSearchById(id)

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold">Search Detail</h2>
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
            <span
              className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 font-mono text-xs"
              title={data.search.cache_id}
            >
              <Fingerprint className="h-3.5 w-3.5 text-slate-500" />
              {data.search.cache_id}
            </span>
          )}
        </div>
      )}
      <SearchResultsTable leads={data?.leads ?? []} isLoading={isLoading} />
    </div>
  )
}
