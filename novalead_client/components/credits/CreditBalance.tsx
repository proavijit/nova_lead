import { Coins } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function CreditBalance({ balance }: { balance: number }) {
  return (
    <Card className="max-w-md rounded-lg border border-slate-200 bg-white shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-600">
          <Coins className="h-4 w-4" />
          Available Revenue Credits
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-2">
          <span className="text-5xl font-bold tracking-tight text-slate-900">{balance}</span>
          <span className="text-sm font-semibold text-muted-foreground uppercase">Tokens</span>
        </div>
        <p className="text-xs text-muted-foreground mt-4 font-medium">
          Credits refresh automatically based on your subscription tier.
        </p>
      </CardContent>
    </Card>
  )
}
