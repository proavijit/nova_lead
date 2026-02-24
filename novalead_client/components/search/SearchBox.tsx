'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Search } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { useCredits } from '@/hooks/useCredits'

const schema = z.object({
  prompt: z.string().trim().min(3, 'Enter at least 3 characters')
})

type FormValues = z.infer<typeof schema>

interface SearchBoxProps {
  isPending: boolean
  onSearch: (prompt: string) => void
}

export function SearchBox({ isPending, onSearch }: SearchBoxProps) {
  const { data: credits } = useCredits()

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { prompt: '' }
  })

  const submit = ({ prompt }: FormValues) => {
    onSearch(prompt)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex flex-wrap items-center justify-between gap-2">
          Find Leads With AI
          <Badge variant="outline">{credits?.balance ?? 0} credits remaining</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(submit)} className="space-y-4">
            <FormField
              control={form.control}
              name="prompt"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      rows={4}
                      className="resize-none"
                      placeholder='e.g. "Find 5 CTOs at fintech startups in Canada with 50-500 employees"'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm text-muted-foreground">
                This search will use <strong>1 credit</strong>
              </p>
              <Button type="submit" disabled={isPending}>
                <Search className="mr-2 h-4 w-4" />
                {isPending ? 'Searching...' : 'Search'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
