'use client'

import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useDeleteSearch, useSearchHistory } from '@/hooks/useSearchHistory'

export default function DashboardHistoryPage() {
  const { data = [], isLoading } = useSearchHistory()
  const { mutate: deleteSearch, isPending } = useDeleteSearch()

  if (isLoading) {
    return <p className="text-sm text-slate-600">Loading search history...</p>
  }

  return (
    <div className="space-y-4">
      {data.map((item) => (
        <Card key={item.id} className="rounded-lg border-slate-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-base text-slate-900">{item.prompt}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center justify-between gap-3 text-sm text-slate-600">
            <div className="flex gap-6">
              <span>Leads: {item.result_count ?? 0}</span>
              <span>Credits: {item.credits_used ?? 1}</span>
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
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
