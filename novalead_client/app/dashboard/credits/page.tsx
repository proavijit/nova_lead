'use client'

import { useState } from 'react'
import { CheckCircle2, Coins, Zap, ArrowRight, X, Sparkles } from 'lucide-react'

import { CreditBalance } from '@/components/credits/CreditBalance'
import { CreditHistory } from '@/components/credits/CreditHistory'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useCreditHistory, useCredits } from '@/hooks/useCredits'

/* ─── Plan data ─────────────────────────────────────────────── */
const plans = [
  {
    name: 'Starter',
    price: 'Free',
    credits: '10 credits',
    desc: 'Perfect to explore NovaLead and run your first searches.',
    color: '#ccfbf1',
    textColor: '#0f766e',
    border: '#a7f3d0',
    highlight: false,
  },
  {
    name: 'Pro',
    price: '$29/mo',
    credits: '200 credits',
    desc: 'Great for individual sales reps with active outbound pipelines.',
    color: 'linear-gradient(135deg,#14b8a6,#0d9488)',
    textColor: '#ffffff',
    border: '#0d9488',
    highlight: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    credits: 'Unlimited',
    desc: 'For high-volume teams with advanced CRM and reporting needs.',
    color: '#f0fdf9',
    textColor: '#0f1a19',
    border: '#d1fae5',
    highlight: false,
  },
]

export default function DashboardCreditsPage() {
  const [open, setOpen] = useState(false)
  const { data: balanceData }      = useCredits()
  const { data: transactions = [] } = useCreditHistory()

  return (
    <div className="space-y-6" style={{ fontFamily: 'DM Sans, sans-serif' }}>

      {/* Page header */}
      <div>
        <h1
          className="text-2xl font-black text-gray-900"
          style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
        >
          Credits
        </h1>
        <p className="mt-0.5 text-sm" style={{ color: '#6b7280' }}>
          Track your credit balance and usage across all lead searches.
        </p>
      </div>

      {/* Top grid: balance + upsell card */}
      <div className="grid gap-4 lg:grid-cols-3">

        {/* Balance — existing component */}
        <div className="lg:col-span-2">
          <CreditBalance balance={balanceData?.data?.balance ?? 0} />
        </div>

        {/* Get More Credits card */}
        <div
          className="relative overflow-hidden rounded-2xl p-5 text-white"
          style={{ background: 'linear-gradient(145deg,#042f2e,#065f46,#0d9488)', boxShadow: '0 8px 32px rgba(13,148,136,0.28)' }}
        >
          {/* Blobs */}
          <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full blur-2xl" style={{ background: 'rgba(52,211,153,0.2)' }} />
          <div className="pointer-events-none absolute -bottom-6 -left-6 h-24 w-24 rounded-full blur-2xl" style={{ background: 'rgba(20,184,166,0.15)' }} />

          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-xl" style={{ background: 'rgba(255,255,255,0.15)' }}>
                <Zap className="h-4 w-4 text-white" />
              </span>
              <div>
                <p className="text-sm font-bold text-white">Get More Credits</p>
                <p className="text-xs" style={{ color: '#99f6e4' }}>Scale your pipeline</p>
              </div>
            </div>

            <p className="text-xs leading-relaxed" style={{ color: 'rgba(204,251,241,0.85)' }}>
              Need higher volume? Choose a plan that matches your outbound pipeline goals.
            </p>

            <button
              onClick={() => setOpen(true)}
              className="group flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold transition-all hover:-translate-y-px"
              style={{ background: 'white', color: '#0f766e', boxShadow: '0 2px 8px rgba(0,0,0,0.12)' }}
            >
              View Plans
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Usage History */}
      <div
        className="overflow-hidden rounded-2xl border"
        style={{ background: 'white', borderColor: '#d1fae5', boxShadow: '0 1px 4px rgba(13,148,136,0.06)' }}
      >
        {/* Header */}
        <div
          className="flex items-center gap-3 border-b px-6 py-4"
          style={{ borderColor: '#f0fdf9', background: '#fafffe' }}
        >
          <span className="grid h-8 w-8 place-items-center rounded-lg" style={{ background: '#ccfbf1' }}>
            <Coins className="h-4 w-4" style={{ color: '#0d9488' }} />
          </span>
          <div>
            <h2 className="text-sm font-bold text-gray-900">Usage History</h2>
            <p className="text-xs" style={{ color: '#9ca3af' }}>
              {transactions.length} transaction{transactions.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        <div className="px-6 py-5">
          {transactions.length ? (
            <CreditHistory transactions={transactions} />
          ) : (
            /* Empty state */
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="mb-3 grid h-12 w-12 place-items-center rounded-2xl" style={{ background: '#f0fdf9' }}>
                <Coins className="h-5 w-5" style={{ color: '#0d9488' }} />
              </div>
              <p className="text-sm font-semibold text-gray-900">No transactions yet</p>
              <p className="mt-1 text-xs" style={{ color: '#9ca3af' }}>
                Credit usage will appear here after your first search.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── Plans Dialog ─────────────────────────────────────── */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="max-w-md rounded-2xl border-0 p-0 overflow-hidden"
          style={{ boxShadow: '0 20px 60px rgba(13,148,136,0.18)' }}
        >
          {/* Dialog header */}
          <div
            className="relative flex items-center justify-between border-b px-6 py-4"
            style={{ borderColor: '#d1fae5', background: '#f0fdf9' }}
          >
            <div className="flex items-center gap-2.5">
              <span className="grid h-8 w-8 place-items-center rounded-lg" style={{ background: '#ccfbf1' }}>
                <Sparkles className="h-4 w-4" style={{ color: '#0d9488' }} />
              </span>
              <DialogTitle className="text-base font-bold text-gray-900">
                Credit Plans
              </DialogTitle>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="grid h-7 w-7 place-items-center rounded-lg transition-colors hover:bg-gray-100"
              style={{ color: '#9ca3af' }}
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Plans */}
          <div className="space-y-3 p-5">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className="relative overflow-hidden rounded-xl border p-4 transition-all hover:-translate-y-0.5 hover:shadow-md"
                style={{
                  background: plan.highlight ? plan.color : plan.color,
                  borderColor: plan.border,
                  boxShadow: plan.highlight ? '0 4px 16px rgba(13,148,136,0.25)' : undefined,
                }}
              >
                {plan.highlight && (
                  <span
                    className="absolute right-3 top-3 rounded-full px-2 py-0.5 text-xs font-bold"
                    style={{ background: 'rgba(255,255,255,0.25)', color: 'white' }}
                  >
                    Popular
                  </span>
                )}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2
                      className="h-4 w-4 flex-shrink-0 mt-0.5"
                      style={{ color: plan.highlight ? 'rgba(255,255,255,0.9)' : '#059669' }}
                    />
                    <div>
                      <p
                        className="text-sm font-bold"
                        style={{ color: plan.textColor }}
                      >
                        {plan.name}
                        <span
                          className="ml-2 text-xs font-normal opacity-80"
                        >
                          · {plan.credits}
                        </span>
                      </p>
                      <p
                        className="mt-0.5 text-xs leading-relaxed"
                        style={{ color: plan.highlight ? 'rgba(255,255,255,0.75)' : '#6b7280' }}
                      >
                        {plan.desc}
                      </p>
                    </div>
                  </div>
                  <span
                    className="flex-shrink-0 text-base font-black"
                    style={{ color: plan.textColor }}
                  >
                    {plan.price}
                  </span>
                </div>
              </div>
            ))}

            <p className="pt-1 text-center text-xs" style={{ color: '#9ca3af' }}>
              No credit card required for Starter · Cancel anytime
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
