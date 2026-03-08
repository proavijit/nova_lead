import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import type { CreditTransaction } from '@/hooks/useCredits'

export function CreditHistory({ transactions }: { transactions: CreditTransaction[] }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <Table>
        <TableHeader className="bg-slate-50">
          <TableRow className="hover:bg-slate-50 border-slate-200">
            <TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Date</TableHead>
            <TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Search Query</TableHead>
            <TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Type</TableHead>
            <TableHead className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">Credits Used</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((item) => (
            <TableRow key={item.id} className="border-slate-100 hover:bg-blue-50/30">
              <TableCell className="px-4 py-3 text-sm text-slate-600">
                {new Date(item.created_at).toLocaleDateString()} {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </TableCell>
              <TableCell className="px-4 py-3 text-sm font-medium text-slate-800">{item.description}</TableCell>
              <TableCell className="px-4 py-3">
                <Badge
                  className={cn(
                    'font-semibold uppercase tracking-tight',
                    item.type === 'debit'
                      ? 'border-red-200 bg-red-50 text-red-600 hover:bg-red-50'
                      : 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-50'
                  )}
                  variant="outline"
                >
                  {item.type}
                </Badge>
              </TableCell>
              <TableCell className={cn('px-4 py-3 text-right text-base font-bold tabular-nums', item.type === 'debit' ? 'text-red-600' : 'text-emerald-700')}>
                {item.type === 'debit' ? '-' : '+'}
                {item.amount}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

