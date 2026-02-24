import { TableCell, TableRow } from '@/components/ui/table'
import type { Lead } from '@/types/lead'
import { LinkedInBadge } from '@/components/leads/LinkedInBadge'

export function LeadRow({ lead }: { lead: Lead }) {
  return (
    <TableRow>
      <TableCell>{lead.name ?? '-'}</TableCell>
      <TableCell>{lead.title ?? '-'}</TableCell>
      <TableCell>
        {lead.linkedin_url ? <LinkedInBadge href={lead.linkedin_url} label="Profile" /> : '-'}
      </TableCell>
      <TableCell>{lead.company?.name ?? '-'}</TableCell>
      <TableCell>
        {lead.company?.linkedin_url ? <LinkedInBadge href={lead.company.linkedin_url} label="Company" /> : '-'}
      </TableCell>
      <TableCell>{lead.company?.website ?? '-'}</TableCell>
    </TableRow>
  )
}
