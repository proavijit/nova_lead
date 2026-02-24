'use client'

import { EmptyState } from '@/components/common/EmptyState'
import { CreditBalance } from '@/components/credits/CreditBalance'
import { CreditHistory } from '@/components/credits/CreditHistory'
import { useCreditHistory, useCredits } from '@/hooks/useCredits'

export default function CreditsPage() {
  const { data: balanceData } = useCredits()
  const { data: transactions, isLoading } = useCreditHistory()

  return (
    <div className="space-y-6">
      <CreditBalance balance={balanceData?.balance ?? 0} />
      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading transactions...</p>
      ) : transactions?.length ? (
        <CreditHistory transactions={transactions} />
      ) : (
        <EmptyState title="No transactions" description="Credit activity will show up here." />
      )}
    </div>
  )
}
