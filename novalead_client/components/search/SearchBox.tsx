'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Bot, Coins, Search, Sparkles, Zap } from 'lucide-react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { useCredits } from '@/hooks/useCredits'

const schema = z.object({
  prompt: z.string().trim().min(3, 'Enter at least 3 characters')
})

type FormValues = z.infer<typeof schema>

interface SearchBoxProps {
  isPending:      boolean
  onSearch:       (prompt: string) => void
  initialPrompt?: string
}

export function SearchBox({ isPending, onSearch, initialPrompt }: SearchBoxProps) {
  const { data: credits } = useCredits()
  const balance = credits?.data?.balance ?? 0
  const lowCredits = balance <= 3

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { prompt: '' }
  })

  useEffect(() => {
    if (initialPrompt) form.setValue('prompt', initialPrompt)
  }, [form, initialPrompt])

  const submit = ({ prompt }: FormValues) => onSearch(prompt)
  const prompt = form.watch('prompt') || ''
  const charCount = prompt.length
  const isReady   = charCount >= 3

  return (
    <div
      className="w-full overflow-hidden rounded-2xl border"
      style={{
        background:  'white',
        borderColor: '#d1fae5',
        boxShadow:   '0 2px 12px rgba(13,148,136,0.08)',
      }}
    >
      {/* ── Header ────────────────────────────────────────── */}
      <div
        className="flex flex-wrap items-center justify-between gap-4 border-b px-6 py-4"
        style={{ background: '#fafffe', borderColor: '#d1fae5' }}
      >
        {/* Title */}
        <div className="flex items-center gap-2.5">
          <span
            className="grid h-9 w-9 place-items-center rounded-xl"
            style={{ background: 'linear-gradient(135deg,#14b8a6,#0d9488)' }}
          >
            <Search className="h-4 w-4 text-white" />
          </span>
          <div>
            <h2
              className="text-base font-black text-gray-900 leading-tight"
              style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
            >
              Lead Discovery Engine
            </h2>
            <p className="text-xs" style={{ color: '#9ca3af' }}>
              Plain English → Verified leads
            </p>
          </div>
        </div>

        {/* Credits badge */}
        <div
          className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold"
          style={{
            background:  lowCredits ? 'rgba(245,158,11,0.1)'  : '#ccfbf1',
            color:       lowCredits ? '#d97706'               : '#0f766e',
            border:      `1px solid ${lowCredits ? 'rgba(245,158,11,0.35)' : '#a7f3d0'}`,
          }}
        >
          <Coins className="h-3.5 w-3.5" />
          {balance} Credits
          {lowCredits && (
            <span className="ml-0.5 h-1.5 w-1.5 animate-pulse rounded-full bg-amber-400" />
          )}
        </div>
      </div>

      {/* ── Body ──────────────────────────────────────────── */}
      <div className="px-6 py-5">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(submit)} className="space-y-4">
            <FormField
              control={form.control}
              name="prompt"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="space-y-2">
                      {/* Textarea */}
                      <div className="relative">
                        <Textarea
                          rows={4}
                          className="min-h-[110px] w-full resize-none rounded-xl px-4 py-3.5 text-sm leading-relaxed transition-all"
                          style={{
                            border:      `1.5px solid ${isReady ? '#0d9488' : '#e5e7eb'}`,
                            background:  '#fafffe',
                            color:       '#0f1a19',
                            outline:     'none',
                            boxShadow:   isReady ? '0 0 0 3px rgba(13,148,136,0.1)' : 'none',
                          }}
                          placeholder="Describe your ideal prospect… e.g. 'Find 10 founders of Series A startups in the US'"
                          aria-label="Search prompt"
                          {...field}
                          onFocus={(e) => {
                            e.currentTarget.style.border    = '1.5px solid #0d9488'
                            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(13,148,136,0.12)'
                          }}
                          onBlur={(e) => {
                            e.currentTarget.style.border    = `1.5px solid ${isReady ? '#0d9488' : '#e5e7eb'}`
                            e.currentTarget.style.boxShadow = isReady ? '0 0 0 3px rgba(13,148,136,0.1)' : 'none'
                            field.onBlur()
                          }}
                        />

                        {/* Ready indicator dot */}
                        {isReady && (
                          <span
                            className="absolute right-3 top-3 h-2 w-2 rounded-full"
                            style={{ background: '#0d9488', boxShadow: '0 0 6px rgba(13,148,136,0.5)' }}
                          />
                        )}
                      </div>

                      {/* Char count + AI models row */}
                      <div className="flex items-center justify-between">
                        <span
                          className="text-xs font-medium"
                          style={{ color: charCount >= 3 ? '#0d9488' : '#9ca3af' }}
                        >
                          {charCount} characters{charCount < 3 && charCount > 0 ? ` · ${3 - charCount} more needed` : ''}
                        </span>
                        <span
                          className="inline-flex items-center gap-1 text-xs"
                          style={{ color: '#9ca3af' }}
                        >
                          <Sparkles className="h-3 w-3 text-teal-500" />
                          <Bot className="h-3 w-3 text-teal-500" />
                          AI-optimized
                        </span>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs font-medium text-red-500" />
                </FormItem>
              )}
            />

            {/* Footer row */}
            <div
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border px-4 py-3"
              style={{ background: '#f0fdf9', borderColor: '#d1fae5' }}
            >
              {/* Info pill */}
              <p className="inline-flex items-center gap-2 text-xs font-medium" style={{ color: '#6b7280' }}>
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ background: '#0d9488', boxShadow: '0 0 5px rgba(13,148,136,0.5)' }}
                />
                AI-Optimized Search · 1 Credit per batch
              </p>

              {/* Submit */}
              <button
                type="submit"
                disabled={isPending}
                className="group inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white transition-all duration-150 hover:-translate-y-px active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                style={{
                  background:  isPending
                    ? '#0d9488'
                    : 'linear-gradient(135deg,#14b8a6,#0d9488)',
                  boxShadow:   isPending ? 'none' : '0 4px 16px rgba(13,148,136,0.35)',
                }}
              >
                {isPending ? (
                  <>
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Analyzing…
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4 transition-transform group-hover:scale-110" />
                    Launch Prospector
                  </>
                )}
              </button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}
