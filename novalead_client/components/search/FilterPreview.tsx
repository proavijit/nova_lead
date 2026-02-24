'use client'

import { ChevronDown } from 'lucide-react'
import { useState } from 'react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface FilterPreviewProps {
  filters?: Record<string, string | number | boolean | null>
}

export function FilterPreview({ filters }: FilterPreviewProps) {
  const [open, setOpen] = useState(true)

  if (!filters || Object.keys(filters).length === 0) return null

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Parsed Filters</CardTitle>
          <Button variant="ghost" size="sm" onClick={() => setOpen((v) => !v)}>
            <ChevronDown className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      {open && (
        <CardContent className="grid gap-2 text-sm sm:grid-cols-2">
          {Object.entries(filters).map(([key, value]) => (
            <div key={key} className="rounded border bg-muted/30 px-3 py-2">
              <p className="text-xs uppercase text-muted-foreground">{key}</p>
              <p className="font-medium">{String(value ?? '-')}</p>
            </div>
          ))}
        </CardContent>
      )}
    </Card>
  )
}
