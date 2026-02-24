import { ExternalLink } from 'lucide-react'

import { Badge } from '@/components/ui/badge'

interface LinkedInBadgeProps {
  href: string
  label: string
}

export function LinkedInBadge({ href, label }: LinkedInBadgeProps) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      <Badge variant="outline" className="inline-flex items-center gap-1 hover:bg-muted">
        {label}
        <ExternalLink className="h-3 w-3" />
      </Badge>
    </a>
  )
}
