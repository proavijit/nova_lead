import { Badge } from '@/components/ui/badge'
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
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{new Date(item.created_at).toLocaleString()}</TableCell>
              <TableCell>{item.description}</TableCell>
              <TableCell>
                <Badge variant={item.type === 'debit' ? 'destructive' : 'secondary'}>{item.type}</Badge>
              </TableCell>
              <TableCell>{item.amount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
