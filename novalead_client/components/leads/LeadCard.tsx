import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Lead } from '@/types/lead'
import { LinkedInBadge } from '@/components/leads/LinkedInBadge'

export function LeadCard({ lead }: { lead: Lead }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{lead.name ?? '-'}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <p>{lead.title ?? '-'}</p>
        <p>{lead.company?.name ?? '-'}</p>
        <div className="flex gap-2">
          {lead.linkedin_url && <LinkedInBadge href={lead.linkedin_url} label="Profile" />}
          {lead.company?.linkedin_url && <LinkedInBadge href={lead.company.linkedin_url} label="Company" />}
        </div>
      </CardContent>
    </Card>
  )
}
