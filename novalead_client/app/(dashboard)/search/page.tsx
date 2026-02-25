'use client'

import { useMemo } from 'react'

import { ErrorAlert } from '@/components/common/ErrorAlert'
import { FilterPreview } from '@/components/search/FilterPreview'
import { SearchBox } from '@/components/search/SearchBox'
import { SearchResultsTable } from '@/components/search/SearchResultsTable'
import { Button } from '@/components/ui/button'
import { useSearch } from '@/hooks/useSearch'

export default function SearchPage() {
  const { mutate, isPending, data, error } = useSearch()

  const leads = data?.data?.leads ?? []

  const csv = useMemo(() => {
    if (!leads.length) return ''

    const rows = [
      ['name', 'title', 'linkedin_url', 'company_name', 'company_linkedin_url', 'company_website'].join(','),
      ...leads.map((lead: any) =>
        [
          lead.name,
          lead.title,
          lead.linkedin_url,
          lead.company?.name,
          lead.company?.linkedin_url,
          lead.company?.website
        ]
          .map((value) => `"${(value ?? '').toString().replaceAll('"', '""')}"`)
          .join(',')
      )
    ]

    return rows.join('\n')
  }, [leads])

  const exportCsv = () => {
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `leads-${Date.now()}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <SearchBox isPending={isPending} onSearch={(prompt) => mutate({ prompt, page: 1 })} />

      {error && <ErrorAlert message={(error as any)?.response?.data?.error || 'Search failed'} />}

      <FilterPreview filters={data?.data?.filters} />

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Results</h2>
        <Button variant="outline" onClick={exportCsv} disabled={!leads.length}>
          Export CSV
        </Button>
      </div>

      <SearchResultsTable leads={leads} isLoading={isPending} />
    </div>
  )
}
