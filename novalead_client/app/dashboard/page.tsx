'use client'

import Link from 'next/link'
import { BarChart3, Coins, Search, Users } from 'lucide-react'

import { CacheStatusBadge } from '@/components/search/CacheStatusBadge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useCredits } from '@/hooks/useCredits'
import { useSearchHistory } from '@/hooks/useSearchHistory'

function Stat({ title, value, icon: Icon }: { title: string; value: number; icon: any }) {
  return (
    <Card className="rounded-lg border-slate-200 bg-white shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm text-slate-600">{title}</CardTitle>
        <Icon className="h-4 w-4 text-blue-400" />
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-semibold text-slate-900">{value}</p>
      </CardContent>
    </Card>
  )
}

export default function DashboardHomePage() {
  const { data: creditsData } = useCredits()
  const { data: searches = [] } = useSearchHistory()

  const totalSearches = searches.length
  const totalLeads = searches.reduce((acc, item) => acc + (item.result_count ?? 0), 0)
  const creditsUsed = searches.reduce((acc, item) => acc + (item.credits_used ?? 1), 0)
  const creditsRemaining = creditsData?.data?.balance ?? 0

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Stat title="Total Searches Run" value={totalSearches} icon={Search} />
        <Stat title="Total Leads Found" value={totalLeads} icon={Users} />
        <Stat title="Credits Remaining" value={creditsRemaining} icon={Coins} />
        <Stat title="Credits Used" value={creditsUsed} icon={BarChart3} />
      </div>

      <Card className="rounded-lg border-slate-200 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-slate-900">Recent Searches</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-slate-200 hover:bg-transparent">
                <TableHead>Prompt</TableHead>
                <TableHead>Cache</TableHead>
                <TableHead>Leads Found</TableHead>
                <TableHead>Credits Used</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {searches.slice(0, 6).map((item) => (
                <TableRow key={item.id} className="border-slate-200">
                  <TableCell className="max-w-sm truncate">{item.prompt}</TableCell>
                  <TableCell>
                    <CacheStatusBadge
                      cacheHit={item.cache_hit}
                      cacheStrategy={item.cache_strategy}
                      className="w-fit"
                    />
                  </TableCell>
                  <TableCell>{item.result_count ?? 0}</TableCell>
                  <TableCell>{item.credits_used ?? 0}</TableCell>
                  <TableCell>{new Date(item.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Link className="text-blue-400 hover:underline" href={`/dashboard/history/${item.id}`}>
                      View
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
