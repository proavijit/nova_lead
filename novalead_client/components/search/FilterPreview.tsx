'use client'

import { ChevronDown, Filter } from 'lucide-react'
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
    <Card className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <CardHeader className="bg-slate-50 pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-600">
            <Filter className="h-4 w-4 text-primary" />
            Extracted Intelligence Parameters
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={() => setOpen((v) => !v)} aria-label="Toggle filters">
            <ChevronDown className={`h-4 w-4 text-primary transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      {open && (
        <CardContent className="grid gap-3 p-6 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(filters).map(([key, value]) => (
            <div key={key} className="group relative rounded-md border border-slate-200 bg-white p-3 transition hover:border-blue-200">
              <div className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-primary/20 group-hover:bg-primary transition-colors" />
              <p className="mb-1 text-[10px] font-bold uppercase tracking-wide text-blue-600">{key.replace(/_/g, ' ')}</p>
              <p className="truncate font-medium text-slate-700">{String(value ?? '-')}</p>
            </div>
          ))}
        </CardContent>
      )}
    </Card>
  )
}
