'use client'

import { useParams } from 'next/navigation'

import { SearchResultsTable } from '@/components/search/SearchResultsTable'
import { useSearchById } from '@/hooks/useSearchHistory'

export default function HistoryDetailPage() {
  const params = useParams<{ id: string }>()
  const id = params?.id ?? ''
  const { data, isLoading } = useSearchById(id)

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Search #{id}</h1>
      <SearchResultsTable leads={data?.leads ?? []} isLoading={isLoading} />
    </div>
  )
}
