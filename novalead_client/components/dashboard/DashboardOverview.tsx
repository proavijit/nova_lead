'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Coins, Filter, Search, Users } from 'lucide-react'

interface StatCardProps {
    title: string
    value: string | number
    description: string
    icon: any
    trend?: string
}

function StatCard({ title, value, description, icon: Icon, trend }: StatCardProps) {
    return (
        <Card className="border-none shadow-lg shadow-black/5 bg-white/60 backdrop-blur-sm overflow-hidden group hover:scale-[1.02] transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{title}</CardTitle>
                <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                    <Icon className="h-4 w-4" />
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-bold">{value}</div>
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    {description}
                    {trend && <span className="text-green-500 font-semibold">{trend}</span>}
                </p>
            </CardContent>
        </Card>
    )
}

export function DashboardOverview({ stats }: { stats: any }) {
    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
                title="Total Leads"
                value={stats.totalLeads}
                description="Total prospects discovered"
                icon={Users}
                trend="+12%"
            />
            <StatCard
                title="Credits Used"
                value={stats.creditsUsed}
                description="Credits consumed this month"
                icon={Coins}
            />
            <StatCard
                title="Saved Searches"
                value={stats.savedSearches}
                description="Active search queries"
                icon={Search}
            />
            <StatCard
                title="Success Rate"
                value={`${stats.successRate}%`}
                description="API query efficiency"
                icon={Filter}
                trend="+2.4%"
            />
        </div>
    )
}
