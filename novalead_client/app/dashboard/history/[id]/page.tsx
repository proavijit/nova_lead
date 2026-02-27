'use client'

import { useParams } from 'next/navigation'

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
      <SearchResultsTable leads={data?.leads ?? []} isLoading={isLoading} />
    </div>
  )
}
