'use client'

import Link from 'next/link'
import { Coins, Database, Fingerprint, Hash, User, Building2 } from 'lucide-react'

import { ErrorAlert } from '@/components/common/ErrorAlert'
import { CacheStatusBadge } from '@/components/search/CacheStatusBadge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useDeleteSearch, useSearchHistory } from '@/hooks/useSearchHistory'
import type { LeadSnapshotItem } from '@/types/search'

function getLeadPreview(search: any): { title: string | null; company: string | null } {
  if (search.lead_snapshot && search.lead_snapshot.length > 0) {
    const firstLead = search.lead_snapshot[0] as LeadSnapshotItem
    return {
      title: firstLead.title,
      company: firstLead.company?.name ?? null
    }
  }
  return { title: null, company: null }
}

export default function DashboardHistoryPage() {
  const { data = [], isLoading, error } = useSearchHistory()
  const { mutate: deleteSearch, isPending } = useDeleteSearch()

  if (isLoading) {
    return <p className="text-sm text-slate-600">Loading search history...</p>
  }

  if (error) {
    const message = (error as any)?.response?.data?.error || 'Failed to load search history'
    return <ErrorAlert message={message} />
  }

  return (
    <div className="space-y-4">
      {data.map((item) => {
        const preview = getLeadPreview(item)
        return (
          <Card key={item.id} className="rounded-lg border-slate-200 bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-base text-slate-900">{item.prompt}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-slate-600">
              {(preview.title || preview.company) && (
                <div className="flex flex-wrap gap-4 text-sm">
                  {preview.title && (
                    <span className="inline-flex items-center gap-1 text-slate-600">
                      <User className="h-3.5 w-3.5" />
                      {preview.title}
                    </span>
                  )}
                  {preview.company && (
                    <span className="inline-flex items-center gap-1 text-slate-600">
                      <Building2 className="h-3.5 w-3.5" />
                      {preview.company}
                    </span>
                  )}
                </div>
              )}
              <div className="flex flex-wrap items-center gap-2">
                <CacheStatusBadge cacheHit={item.cache_hit} cacheStrategy={item.cache_strategy} />
                <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5">
                  <Coins className="h-3.5 w-3.5 text-slate-500" />
                  Credits charged: <strong className="text-slate-900">{item.credits_charged ?? 0}</strong>
                </span>
                {item.cache_id && (
                  <span
                    className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 font-mono text-xs"
                    title={item.cache_id}
                  >
                    <Fingerprint className="h-3.5 w-3.5 text-slate-500" />
                    Cache: {item.cache_id.slice(0, 8)}...
                  </span>
                )}
                {item.filter_hash && (
                  <span
                    className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 font-mono text-xs text-slate-500"
                    title={`Full hash: ${item.filter_hash}`}
                  >
                    <Hash className="h-3.5 w-3.5" />
                    Hash: {item.filter_hash.slice(0, 10)}...
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex gap-6">
                <span>Leads: {item.result_count ?? 0}</span>
                <span>Credits: {item.credits_used ?? 0}</span>
                <span>{new Date(item.created_at).toLocaleString()}</span>
                </div>
                <div className="flex gap-2">
                  <Link href={`/dashboard/history/${item.id}`}>
                    <Button size="sm" variant="outline" className="border-slate-300 bg-white">
                      View
                    </Button>
                  </Link>
                  <Button
                    size="sm"
                    variant="destructive"
                    disabled={isPending}
                    onClick={() => deleteSearch(item.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
