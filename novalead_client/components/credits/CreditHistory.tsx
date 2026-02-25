import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import type { CreditTransaction } from '@/hooks/useCredits'

export function CreditHistory({ transactions }: { transactions: CreditTransaction[] }) {
  return (
    <div className="rounded-2xl border border-border/50 bg-card/60 backdrop-blur-md shadow-xl shadow-black/5 overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/30">
          <TableRow className="hover:bg-transparent border-border/50">
            <TableHead className="py-4 font-bold text-foreground">Activity Date</TableHead>
            <TableHead className="py-4 font-bold text-foreground">Description</TableHead>
            <TableHead className="py-4 font-bold text-foreground text-center">Type</TableHead>
            <TableHead className="py-4 font-bold text-foreground text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((item) => (
            <TableRow key={item.id} className="group hover:bg-primary/5 transition-colors border-border/50">
              <TableCell className="py-5 text-muted-foreground font-medium">
                {new Date(item.created_at).toLocaleDateString()} at {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </TableCell>
              <TableCell className="py-5 font-semibold text-foreground/90">{item.description}</TableCell>
              <TableCell className="py-5 text-center">
                <Badge
                  className={cn(
                    "font-bold uppercase tracking-tighter px-2.5",
                    item.type === 'debit'
                      ? "bg-red-500/10 text-red-600 hover:bg-red-500/20 border-red-200"
                      : "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-emerald-200"
                  )}
                  variant="outline"
                >
                  {item.type}
                </Badge>
              </TableCell>
              <TableCell className={cn(
                "py-5 text-right font-black text-lg tabular-nums",
                item.type === 'debit' ? "text-red-600" : "text-emerald-600"
              )}>
                {item.type === 'debit' ? '-' : '+'}{item.amount}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
