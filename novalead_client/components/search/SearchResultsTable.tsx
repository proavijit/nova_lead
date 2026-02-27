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
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <Table>
        <TableHeader className="bg-slate-50">
          <TableRow className="border-slate-200 hover:bg-transparent">
            <TableHead className="py-4 font-bold text-foreground">Name</TableHead>
            <TableHead className="py-4 font-bold text-foreground">Title</TableHead>
            <TableHead className="py-4 font-bold text-foreground text-center">LinkedIn</TableHead>
            <TableHead className="py-4 font-bold text-foreground">Company</TableHead>
            <TableHead className="py-4 font-bold text-foreground text-center">Company LI</TableHead>
            <TableHead className="py-4 font-bold text-foreground">Website</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading
            ? Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={`skeleton-${index}`} className="border-slate-200">
                <TableCell className="py-5"><Skeleton className="h-5 w-24 rounded-lg" /></TableCell>
                <TableCell className="py-5"><Skeleton className="h-5 w-40 rounded-lg" /></TableCell>
                <TableCell className="py-5"><div className="flex justify-center"><Skeleton className="h-5 w-16 rounded-lg" /></div></TableCell>
                <TableCell className="py-5"><Skeleton className="h-5 w-32 rounded-lg" /></TableCell>
                <TableCell className="py-5"><div className="flex justify-center"><Skeleton className="h-5 w-16 rounded-lg" /></div></TableCell>
                <TableCell className="py-5"><Skeleton className="h-5 w-28 rounded-lg" /></TableCell>
              </TableRow>
            ))
            : leads.map((lead, index) => (
              <TableRow
                key={`${lead.linkedin_url ?? 'lead'}-${index}`}
                className="group border-slate-200 transition-colors hover:bg-blue-50/40"
              >
                <TableCell className="py-5 font-semibold text-foreground/90">{lead.name ?? '-'}</TableCell>
                <TableCell className="py-5 text-muted-foreground font-medium">{lead.title ?? '-'}</TableCell>
                <TableCell className="py-5 text-center">
                  {lead.linkedin_url ? (
                    <div className="flex justify-center">
                      <SafeLink href={lead.linkedin_url} label="Profile" />
                    </div>
                  ) : '-'}
                </TableCell>
                <TableCell className="py-5">
                  <span className="font-medium text-foreground/80">{lead.company?.name ?? '-'}</span>
                </TableCell>
                <TableCell className="py-5 text-center">
                  {lead.company?.linkedin_url ? (
                    <div className="flex justify-center">
                      <SafeLink href={lead.company.linkedin_url} label="Page" />
                    </div>
                  ) : (
                    '-'
                  )}
                </TableCell>
                <TableCell className="py-5">
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
