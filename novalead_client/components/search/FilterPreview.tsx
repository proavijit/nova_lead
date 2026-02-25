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
    <Card className="border-none shadow-xl shadow-primary/5 bg-white/40 backdrop-blur-md overflow-hidden ring-1 ring-border/50">
      <CardHeader className="pb-3 bg-muted/20">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
            <Filter className="h-4 w-4 text-primary" />
            Extracted Intelligence Parameters
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={() => setOpen((v) => !v)} className="hover:bg-primary/10">
            <ChevronDown className={`h-4 w-4 text-primary transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      {open && (
        <CardContent className="grid gap-3 p-6 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(filters).map(([key, value]) => (
            <div key={key} className="group relative rounded-xl border border-border/50 bg-background/50 p-3 hover:border-primary/30 hover:bg-white transition-all duration-300">
              <div className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-primary/20 group-hover:bg-primary transition-colors" />
              <p className="text-[10px] font-black uppercase text-primary/60 tracking-tighter mb-1">{key.replace(/_/g, ' ')}</p>
              <p className="font-bold text-foreground/80 truncate">{String(value ?? '-')}</p>
            </div>
          ))}
        </CardContent>
      )}
    </Card>
  )
}
