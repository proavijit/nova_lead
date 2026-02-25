import { Coins } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function CreditBalance({ balance }: { balance: number }) {
  return (
    <Card className="max-w-md border-none shadow-2xl shadow-primary/10 bg-gradient-to-br from-primary/10 via-background to-blue-600/5 backdrop-blur-md overflow-hidden ring-1 ring-primary/20 hover:scale-[1.02] transition-transform duration-300">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-bold uppercase tracking-widest text-primary/80 flex items-center gap-2">
          <Coins className="h-4 w-4" />
          Available Revenue Credits
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-2">
          <span className="text-5xl font-black tracking-tighter bg-gradient-to-br from-foreground to-foreground/60 bg-clip-text text-transparent">
            {balance}
          </span>
          <span className="text-sm font-semibold text-muted-foreground uppercase">Tokens</span>
        </div>
        <p className="text-xs text-muted-foreground mt-4 font-medium">
          Credits refresh automatically based on your subscription tier.
        </p>
      </CardContent>
    </Card>
  )
}
