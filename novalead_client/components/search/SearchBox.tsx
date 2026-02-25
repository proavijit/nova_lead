'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Coins, Search } from 'lucide-react'
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
    <Card className="w-full border-none shadow-2xl shadow-primary/5 bg-white/50 backdrop-blur-md overflow-hidden ring-1 ring-primary/10">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-blue-400 to-primary/50" />
      <CardHeader className="pb-4">
        <CardTitle className="flex flex-wrap items-center justify-between gap-4 text-2xl font-bold tracking-tight">
          <span className="flex items-center gap-2">
            <Search className="h-6 w-6 text-primary" />
            Lead Discovery Engine
          </span>
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/20">
            <Coins className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold text-primary">{credits?.data?.balance ?? 0} Credits</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(submit)} className="space-y-6">
            <FormField
              control={form.control}
              name="prompt"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative group">
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-blue-500 rounded-lg blur opacity-10 group-focus-within:opacity-25 transition duration-500" />
                      <Textarea
                        rows={4}
                        className="relative resize-none border-border/50 bg-background/50 focus:bg-background transition-all text-lg placeholder:text-muted-foreground/60 leading-relaxed rounded-lg"
                        placeholder='Describe your ideal target... e.g. "Find 10 Founders of Series A startups in London focused on AI or CleanTech"'
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-sm font-medium" />
                </FormItem>
              )}
            />
            <div className="flex flex-wrap items-center justify-between gap-6 pt-2">
              <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-muted/40 border border-border/40">
                <div className="h-2 w-2 rounded-full bg-blue-500" />
                <p className="text-sm font-medium text-muted-foreground">
                  AI-Optimized Search · <span className="text-foreground">1 Credit per batch</span>
                </p>
              </div>
              <Button
                type="submit"
                disabled={isPending}
                className="h-12 px-8 rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all hover:-translate-y-0.5 active:translate-y-0"
              >
                {isPending ? (
                  <span className="flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Analyzing Market...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Search className="h-4 w-4" />
                    Launch Prospector
                  </span>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
