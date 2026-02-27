'use client'

import Link from 'next/link'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Zap } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRegister } from '@/hooks/useAuth'

export default function RegisterPage() {
  const router = useRouter()
  const { mutateAsync, isPending } = useRegister()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    try {
      await mutateAsync({ email, password })
      setSuccess('Registration successful. Redirecting to login...')
      setTimeout(() => router.replace('/login'), 1200)
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Registration failed')
    }
  }

  return (
    <div className="grid min-h-screen bg-[#f8fafc] md:grid-cols-2">
      <div className="hidden md:flex flex-col justify-between border-r border-slate-200 bg-white p-10">
        <div className="flex items-center gap-2 text-xl font-semibold">
          <Zap className="h-6 w-6 text-blue-400" />
          NovaLead
        </div>
        <div>
          <h1 className="text-4xl font-bold">Start with 10 free credits.</h1>
          <p className="mt-4 text-slate-600">Create your account and begin prospecting in minutes.</p>
        </div>
      </div>
      <div className="grid place-items-center p-4">
        <Card className="w-full max-w-md rounded-lg border-slate-200 bg-white shadow-sm">
          <CardContent className="pt-6">
            <form className="space-y-4" onSubmit={submit}>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
                    onClick={() => setShowPassword((s) => !s)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              {success && <p className="text-sm text-green-600">{success}</p>}
              <Button className="w-full bg-[#007BFF] text-white hover:bg-[#0069d9]" disabled={isPending}>
                {isPending ? 'Creating account...' : 'Create Account'}
              </Button>
              <p className="text-sm text-slate-600">
                Already have an account?{' '}
                <Link href="/login" className="text-blue-600 hover:underline">
                  Login
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
