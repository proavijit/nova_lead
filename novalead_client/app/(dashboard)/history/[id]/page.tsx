'use client'

import { useParams } from 'next/navigation'

import { SearchResultsTable } from '@/components/search/SearchResultsTable'
import { useSearchById } from '@/hooks/useSearchHistory'

export default function HistoryDetailPage() {
  const params = useParams<{ id: string }>()
  const id = params?.id ?? ''
  const { data, isLoading } = useSearchById(id)

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">Search Results</h1>
        {data?.search && (
          <p className="text-muted-foreground italic">"{data.search.prompt}"</p>
        )}
      </div>
      <SearchResultsTable leads={data?.leads ?? []} isLoading={isLoading} />
    </div>
  )
}
