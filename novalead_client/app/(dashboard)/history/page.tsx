'use client'

import Link from 'next/link'

import { EmptyState } from '@/components/common/EmptyState'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useSearchHistory } from '@/hooks/useSearchHistory'

export default function HistoryPage() {
  const { data, isLoading } = useSearchHistory()

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading history...</p>
  }

  if (!data?.length) {
    return <EmptyState title="No search history" description="Your previous searches will appear here." />
  }

  return (
    <div className="space-y-4">
      {data.map((item) => (
        <Link key={item.id} href={`/history/${item.id}`}>
          <Card className="transition hover:border-primary">
            <CardHeader>
              <CardTitle className="line-clamp-1 text-base">{item.prompt}</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-1 text-sm text-muted-foreground sm:grid-cols-3">
              <p>{new Date(item.created_at).toLocaleString()}</p>
              <p>{item.result_count} results</p>
              <p>{item.credits_used} credits used</p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
