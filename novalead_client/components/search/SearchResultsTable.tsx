import { ExternalLink, Globe, Users } from 'lucide-react'

import { EmptyState } from '@/components/common/EmptyState'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import type { Lead } from '@/types/lead'

interface SearchResultsTableProps {
  leads:      Lead[]
  isLoading?: boolean
}

/* ─── Avatar color cycling ───────────────────────────────────── */
const avatarPalette = [
  { bg: '#ccfbf1', text: '#0f766e' },
  { bg: '#fef3c7', text: '#d97706' },
  { bg: '#ede9fe', text: '#6d28d9' },
  { bg: '#fce7f3', text: '#be185d' },
  { bg: '#d1fae5', text: '#065f46' },
  { bg: '#ffedd5', text: '#c2410c' },
]

/* ─── Helpers ────────────────────────────────────────────────── */
function initials(name: string | null | undefined) {
  if (!name) return 'NA'
  return name.split(' ').filter(Boolean).slice(0, 2).map((p) => p[0]).join('').toUpperCase()
}

function SafeLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-xs font-semibold transition-colors hover:underline"
      style={{ color: '#0d9488' }}
    >
      {label}
      <ExternalLink className="h-3 w-3 flex-shrink-0" aria-hidden="true" />
    </a>
  )
}

/* ─── Skeleton row ───────────────────────────────────────────── */
function SkeletonRow() {
  return (
    <TableRow style={{ borderColor: '#f0fdf9' }}>
      <TableCell className="px-5 py-3.5">
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-8 rounded-full" style={{ background: '#d1fae5' }} />
          <Skeleton className="h-4 w-28 rounded-lg" style={{ background: '#d1fae5' }} />
        </div>
      </TableCell>
      {[40, 16, 32, 16, 28].map((w, i) => (
        <TableCell key={i} className="px-5 py-3.5">
          <Skeleton className={`h-4 w-${w} rounded-lg`} style={{ background: '#d1fae5' }} />
        </TableCell>
      ))}
    </TableRow>
  )
}

/* ─── Component ─────────────────────────────────────────────── */
export function SearchResultsTable({ leads, isLoading = false }: SearchResultsTableProps) {

  /* Empty state */
  if (!isLoading && leads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div
          className="mb-4 grid h-14 w-14 place-items-center rounded-2xl"
          style={{ background: '#f0fdf9', border: '1px solid #d1fae5' }}
        >
          <Users className="h-6 w-6" style={{ color: '#0d9488' }} />
        </div>
        <p className="text-sm font-bold text-gray-900">No results yet</p>
        <p className="mt-1 text-xs" style={{ color: '#9ca3af' }}>
          Launch a search above to discover leads.
        </p>
      </div>
    )
  }

  const headers = ['Name', 'Title', 'LinkedIn', 'Company', 'Company LI', 'Website']

  return (
    <div className="overflow-x-auto">
      <Table>
        {/* Header */}
        <TableHeader>
          <TableRow
            className="hover:bg-transparent"
            style={{ background: '#f0fdf9', borderBottom: '1px solid #d1fae5' }}
          >
            {headers.map((h) => (
              <TableHead
                key={h}
                className="px-5 py-3 text-xs font-black uppercase tracking-widest"
                style={{ color: '#6b7280' }}
              >
                {h}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        {/* Body */}
        <TableBody>
          {isLoading
            ? Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={`sk-${i}`} />)
            : leads.map((lead, idx) => {
                const avatar = avatarPalette[idx % avatarPalette.length]

                return (
                  <TableRow
                    key={`${lead.linkedin_url ?? 'lead'}-${idx}`}
                    style={{ borderColor: '#f0fdf9', background: idx % 2 === 0 ? 'white' : '#fafffe' }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(13,148,136,0.04)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = idx % 2 === 0 ? 'white' : '#fafffe')}
                  >
                    {/* Name + avatar */}
                    <TableCell className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <span
                          className="grid h-8 w-8 flex-shrink-0 place-items-center rounded-full text-[11px] font-black"
                          style={{ background: avatar.bg, color: avatar.text }}
                        >
                          {initials(lead.name)}
                        </span>
                        <span className="text-sm font-semibold" style={{ color: '#0f1a19' }}>
                          {lead.name ?? '—'}
                        </span>
                      </div>
                    </TableCell>

                    {/* Title */}
                    <TableCell className="px-5 py-3.5 text-sm" style={{ color: '#4b5563' }}>
                      {lead.title ?? '—'}
                    </TableCell>

                    {/* LinkedIn */}
                    <TableCell className="px-5 py-3.5">
                      {lead.linkedin_url
                        ? <SafeLink href={lead.linkedin_url} label="Profile" />
                        : <span style={{ color: '#d1d5db' }}>—</span>}
                    </TableCell>

                    {/* Company name */}
                    <TableCell className="px-5 py-3.5 text-sm font-medium" style={{ color: '#374151' }}>
                      {lead.company?.name ?? '—'}
                    </TableCell>

                    {/* Company LinkedIn */}
                    <TableCell className="px-5 py-3.5">
                      {lead.company?.linkedin_url
                        ? <SafeLink href={lead.company.linkedin_url} label="Page" />
                        : <span style={{ color: '#d1d5db' }}>—</span>}
                    </TableCell>

                    {/* Website */}
                    <TableCell className="px-5 py-3.5">
                      {lead.company?.website ? (
                        <a
                          href={lead.company.website.startsWith('http') ? lead.company.website : `https://${lead.company.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-semibold transition-colors hover:underline"
                          style={{ color: '#0d9488' }}
                        >
                          <Globe className="h-3.5 w-3.5 flex-shrink-0" />
                          {lead.company.website.replace(/^https?:\/\//, '')}
                        </a>
                      ) : (
                        <span style={{ color: '#d1d5db' }}>—</span>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })}
        </TableBody>
      </Table>
    </div>
  )
}
