import { Coins } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function CreditBalance({ balance }: { balance: number }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Current Balance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 text-3xl font-bold">
          <Coins className="h-7 w-7" />
          {balance}
        </div>
      </CardContent>
    </Card>
  )
}
