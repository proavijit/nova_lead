'use client'

import { EmptyState } from '@/components/common/EmptyState'
import { CreditBalance } from '@/components/credits/CreditBalance'
import { CreditHistory } from '@/components/credits/CreditHistory'
import { useCreditHistory, useCredits } from '@/hooks/useCredits'

export default function CreditsPage() {
  const { data: balanceData } = useCredits()
  const { data: transactions } = useCreditHistory()

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Credits & Billing</h1>
        <p className="text-muted-foreground mt-1">Manage your AI credits and view transaction history.</p>
      </div>

      <CreditBalance balance={balanceData?.data?.balance ?? 0} />

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Transaction History</h2>
        {transactions && transactions.length > 0 ? (
          <CreditHistory transactions={transactions} />
        ) : (
          <EmptyState title="No transactions" description="Credit activity will show up here." />
        )}
      </div>
    </div>
  )
}
