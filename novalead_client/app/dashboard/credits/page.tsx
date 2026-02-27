'use client'

import { useState } from 'react'

import { CreditBalance } from '@/components/credits/CreditBalance'
import { CreditHistory } from '@/components/credits/CreditHistory'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useCreditHistory, useCredits } from '@/hooks/useCredits'

export default function DashboardCreditsPage() {
  const [open, setOpen] = useState(false)
  const { data: balanceData } = useCredits()
  const { data: transactions = [] } = useCreditHistory()

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <CreditBalance balance={balanceData?.data?.balance ?? 0} />
        <Button onClick={() => setOpen(true)}>Buy Credits</Button>
      </div>

      <Card className="rounded-lg border-slate-200 bg-white shadow-sm">
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>{transactions.length ? <CreditHistory transactions={transactions} /> : <p>No transactions yet.</p>}</CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Credit Plans</DialogTitle>
          </DialogHeader>
          <div className="space-y-2 text-sm text-slate-700">
            <p>Starter: 10 credits (Free)</p>
            <p>Pro: 200 credits ($29/month)</p>
            <p>Enterprise: Unlimited (Custom pricing)</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
