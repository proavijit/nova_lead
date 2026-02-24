import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export function ErrorAlert({ title = 'Error', message }: { title?: string; message: string }) {
  return (
    <Alert variant="destructive">
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  )
}
