'use client'

import { DashboardOverview } from '@/components/dashboard/DashboardOverview'
import { useSearchHistory } from '@/hooks/useSearchHistory'
import { useCredits } from '@/hooks/useCredits'

export default function DashboardHomePage() {
  const { data: searches } = useSearchHistory()
  const { data: creditsData } = useCredits()

  const stats = {
    totalLeads: searches?.reduce((acc: number, s: any) => acc + (s.result_count || 0), 0) || 0,
    creditsUsed: searches?.length || 0,
    savedSearches: searches?.length || 0,
    successRate: 98
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">System Overview</h1>
        <p className="text-muted-foreground mt-1">Real-time performance metrics and prospecting activity.</p>
      </div>

      <DashboardOverview stats={stats} />

      <div className="grid gap-6 md:grid-cols-2">
        {/* Placeholder for Recent Activity or charts */}
      </div>
    </div>
  )
}
