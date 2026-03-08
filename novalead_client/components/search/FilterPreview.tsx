'use client'

import { ChevronDown, Filter } from 'lucide-react'
import { useState } from 'react'

interface FilterPreviewProps {
  filters?: Record<string, string | number | boolean | null>
}

export function FilterPreview({ filters }: FilterPreviewProps) {
  const [open, setOpen] = useState(true)

  if (!filters || Object.keys(filters).length === 0) return null

  const entries = Object.entries(filters)

  return (
    <div
      className="overflow-hidden rounded-2xl border transition-all"
      style={{
        background:   'white',
        borderColor:  '#d1fae5',
        boxShadow:    '0 1px 4px rgba(13,148,136,0.06)',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-3.5 border-b"
        style={{ background: '#f0fdf9', borderColor: '#d1fae5' }}
      >
        <div className="flex items-center gap-2.5">
          <span
            className="grid h-7 w-7 place-items-center rounded-lg"
            style={{ background: '#ccfbf1' }}
          >
            <Filter className="h-3.5 w-3.5" style={{ color: '#0d9488' }} />
          </span>
          <span
            className="text-xs font-bold uppercase tracking-widest"
            style={{ color: '#0f766e' }}
          >
            Extracted Intelligence Parameters
          </span>
          <span
            className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold"
            style={{ background: '#ccfbf1', color: '#0d9488', border: '1px solid #a7f3d0' }}
          >
            {entries.length}
          </span>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle filters"
          className="grid h-7 w-7 place-items-center rounded-lg transition-colors hover:bg-teal-100"
          style={{ color: '#0d9488' }}
        >
          <ChevronDown
            className="h-4 w-4 transition-transform duration-300"
            style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
          />
        </button>
      </div>

      {/* Grid */}
      {open && (
        <div className="grid gap-2.5 p-5 sm:grid-cols-2 lg:grid-cols-3">
          {entries.map(([key, value], i) => {
            /* Cycle subtle accent tints */
            const tints = [
              { dot: '#14b8a6', keyColor: '#0d9488', bg: '#f0fdf9', border: '#d1fae5' },
              { dot: '#f59e0b', keyColor: '#d97706', bg: '#fffbeb', border: '#fde68a' },
              { dot: '#818cf8', keyColor: '#6366f1', bg: '#f5f3ff', border: '#e9d5ff' },
              { dot: '#f472b6', keyColor: '#db2777', bg: '#fdf2f8', border: '#fbcfe8' },
              { dot: '#34d399', keyColor: '#059669', bg: '#f0fdf4', border: '#bbf7d0' },
              { dot: '#fb923c', keyColor: '#ea580c', bg: '#fff7ed', border: '#fed7aa' },
            ]
            const t = tints[i % tints.length]

            return (
              <div
                key={key}
                className="group relative rounded-xl border p-3.5 transition-all duration-150 hover:-translate-y-0.5"
                style={{ background: t.bg, borderColor: t.border }}
                onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 4px 12px rgba(13,148,136,0.1)')}
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}
              >
                {/* Dot indicator */}
                <span
                  className="absolute right-3 top-3 h-2 w-2 rounded-full transition-transform group-hover:scale-125"
                  style={{ background: t.dot }}
                />

                {/* Key */}
                <p
                  className="mb-1.5 text-[10px] font-black uppercase tracking-widest"
                  style={{ color: t.keyColor }}
                >
                  {key.replace(/_/g, ' ')}
                </p>

                {/* Value */}
                <p
                  className="truncate text-sm font-semibold"
                  style={{ color: '#0f1a19' }}
                >
                  {String(value ?? '—')}
                </p>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
