'use client'

import Link from 'next/link'

import { Users } from 'lucide-react'
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
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Search History</h1>
        <p className="text-muted-foreground mt-1">Access your previous prospect searches and results.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data.map((item) => (
          <Link key={item.id} href={`/history/${item.id}`}>
            <Card className="h-full border-none shadow-lg shadow-black/5 bg-white/60 backdrop-blur-sm transition-all hover:scale-[1.02] hover:shadow-primary/10 ring-1 ring-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="line-clamp-2 text-base font-bold leading-tight min-h-[3rem]">
                  {item.prompt}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-0">
                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Users className="h-3 w-3" /> {item.result_count} Leads
                  </span>
                  <span>•</span>
                  <span>{new Date(item.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center justify-between text-xs pt-3 border-t border-border/50">
                  <span className="text-primary font-semibold">{item.credits_used} Credits Used</span>
                  <span className="text-muted-foreground group-hover:text-primary transition-colors">View Results →</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
