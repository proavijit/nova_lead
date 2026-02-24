import { ExternalLink } from 'lucide-react'

import { EmptyState } from '@/components/common/EmptyState'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import type { Lead } from '@/types/lead'

interface SearchResultsTableProps {
  leads: Lead[]
  isLoading?: boolean
}

function SafeLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline"
    >
      {label}
      <ExternalLink className="h-3 w-3" />
    </a>
  )
}

export function SearchResultsTable({ leads, isLoading = false }: SearchResultsTableProps) {
  if (!isLoading && leads.length === 0) {
    return <EmptyState title="No leads found" description="Try updating your search prompt." />
  }

  return (
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>LinkedIn</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Company LinkedIn</TableHead>
            <TableHead>Website</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading
            ? Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={`skeleton-${index}`}>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                </TableRow>
              ))
            : leads.map((lead, index) => (
                <TableRow key={`${lead.linkedin_url ?? 'lead'}-${index}`}>
                  <TableCell className="font-medium">{lead.name ?? '-'}</TableCell>
                  <TableCell>{lead.title ?? '-'}</TableCell>
                  <TableCell>
                    {lead.linkedin_url ? <SafeLink href={lead.linkedin_url} label="Profile" /> : '-'}
                  </TableCell>
                  <TableCell>{lead.company?.name ?? '-'}</TableCell>
                  <TableCell>
                    {lead.company?.linkedin_url ? (
                      <SafeLink href={lead.company.linkedin_url} label="Page" />
                    ) : (
                      '-'
                    )}
                  </TableCell>
                  <TableCell>
                    {lead.company?.website ? (
                      <SafeLink
                        href={lead.company.website.startsWith('http') ? lead.company.website : `https://${lead.company.website}`}
                        label={lead.company.website}
                      />
                    ) : (
                      '-'
                    )}
                  </TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>
    </div>
  )
}
