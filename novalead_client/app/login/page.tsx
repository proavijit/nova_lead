'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Lock, Mail, ArrowRight, Check, Zap } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useLogin } from '@/hooks/useAuth'
import { useAuthStore } from '@/store/authStore'

/* ─── Left panel illustration ───────────────────────────────── */
function DashboardIllustration() {
  return (
    <svg viewBox="0 0 400 320" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-sm drop-shadow-2xl">
      <defs>
        <linearGradient id="lg1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#14b8a6" />
          <stop offset="100%" stopColor="#0d9488" />
        </linearGradient>
        <linearGradient id="lg2" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#14b8a6" stopOpacity="0" />
          <stop offset="50%" stopColor="#14b8a6" />
          <stop offset="100%" stopColor="#14b8a6" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Main card */}
      <rect x="30" y="20" width="340" height="210" rx="18" fill="white" fillOpacity="0.1" stroke="white" strokeOpacity="0.18" strokeWidth="1" />

      {/* Window dots */}
      <circle cx="52" cy="44" r="5" fill="#f87171" fillOpacity="0.8" />
      <circle cx="68" cy="44" r="5" fill="#fbbf24" fillOpacity="0.8" />
      <circle cx="84" cy="44" r="5" fill="#34d399" fillOpacity="0.8" />

      {/* Search bar */}
      <rect x="44" y="60" width="298" height="28" rx="8" fill="white" fillOpacity="0.12" stroke="white" strokeOpacity="0.1" strokeWidth="1" />
      <circle cx="58" cy="74" r="6" fill="white" fillOpacity="0.3" />
      <rect x="72" y="70" width="130" height="8" rx="4" fill="white" fillOpacity="0.4" />
      <rect x="304" y="64" width="30" height="20" rx="6" fill="url(#lg1)" fillOpacity="0.9" />

      {/* Table header */}
      <rect x="44" y="100" width="298" height="18" rx="4" fill="white" fillOpacity="0.07" />
      <rect x="54" y="106" width="36" height="6" rx="3" fill="#99f6e4" fillOpacity="0.6" />
      <rect x="120" y="106" width="48" height="6" rx="3" fill="#99f6e4" fillOpacity="0.6" />
      <rect x="200" y="106" width="40" height="6" rx="3" fill="#99f6e4" fillOpacity="0.6" />
      <rect x="272" y="106" width="56" height="6" rx="3" fill="#99f6e4" fillOpacity="0.6" />

      {/* Rows */}
      {[
        { y: 126, color: '#14b8a6', letter: 'J', w1: 68, w2: 82, w3: 60 },
        { y: 152, color: '#f59e0b', letter: 'L', w1: 60, w2: 74, w3: 70 },
        { y: 178, color: '#818cf8', letter: 'S', w1: 74, w2: 66, w3: 55 },
      ].map(({ y, color, letter, w1, w2, w3 }) => (
        <g key={y}>
          <circle cx="60" cy={y + 9} r="9" fill={color} fillOpacity="0.75" />
          <text x="56" y={y + 13} fill="white" fontSize="8" fontWeight="bold" fontFamily="system-ui">{letter}</text>
          <rect x="76" y={y + 4} width={w1} height="7" rx="3.5" fill="white" fillOpacity="0.55" />
          <rect x="76" y={y + 14} width={w1 - 20} height="5" rx="2.5" fill="white" fillOpacity="0.25" />
          <rect x="160" y={y + 6} width={w2} height="7" rx="3.5" fill="white" fillOpacity="0.4" />
          <rect x="272" y={y + 4} width={w3} height="16" rx="6" fill="url(#lg1)" fillOpacity="0.7" />
          <rect x="280" y={y + 8} width={w3 - 16} height="7" rx="3.5" fill="white" fillOpacity="0.85" />
        </g>
      ))}

      {/* Divider line */}
      <rect x="44" y="214" width="298" height="1" rx="1" fill="url(#lg2)" />

      {/* Bottom stat cards */}
      <rect x="30" y="228" width="118" height="72" rx="14" fill="white" fillOpacity="0.12" stroke="white" strokeOpacity="0.18" strokeWidth="1" />
      <text x="48" y="256" fill="white" fontSize="22" fontWeight="800" fontFamily="system-ui">2M+</text>
      <rect x="48" y="262" width="68" height="7" rx="3.5" fill="white" fillOpacity="0.35" />
      <rect x="48" y="275" width="44" height="6" rx="3" fill="#34d399" fillOpacity="0.7" />

      <rect x="162" y="228" width="118" height="72" rx="14" fill="white" fillOpacity="0.12" stroke="white" strokeOpacity="0.18" strokeWidth="1" />
      <text x="180" y="256" fill="white" fontSize="22" fontWeight="800" fontFamily="system-ui">95%</text>
      <rect x="180" y="262" width="72" height="7" rx="3.5" fill="white" fillOpacity="0.35" />
      <rect x="180" y="275" width="50" height="6" rx="3" fill="#fbbf24" fillOpacity="0.7" />

      <rect x="294" y="228" width="106" height="72" rx="14" fill="url(#lg1)" fillOpacity="0.35" stroke="white" strokeOpacity="0.18" strokeWidth="1" />
      <text x="312" y="256" fill="white" fontSize="20" fontWeight="800" fontFamily="system-ui">10k+</text>
      <rect x="312" y="262" width="62" height="7" rx="3.5" fill="white" fillOpacity="0.35" />
      <rect x="312" y="275" width="40" height="6" rx="3" fill="white" fillOpacity="0.4" />

      {/* Sparkle dots */}
      <circle cx="380" cy="16" r="4" fill="#34d399" fillOpacity="0.8" />
      <circle cx="392" cy="6" r="2.5" fill="#34d399" fillOpacity="0.5" />
      <circle cx="396" cy="22" r="2" fill="#34d399" fillOpacity="0.35" />
    </svg>
  )
}

/* ─── Google icon ────────────────────────────────────────────── */
function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  )
}

/* ─── Page ───────────────────────────────────────────────────── */
export default function LoginPage() {
  const router = useRouter()
  const setAuth = useAuthStore((state) => state.setAuth)
  const { mutateAsync, isPending } = useLogin()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('nova_token')
    if (token) router.replace('/dashboard')
  }, [router])

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      const response = await mutateAsync({ email, password })
      const token = response.data.token
      localStorage.setItem('nova_token', token)
      setAuth(token, response.data.user)
      router.replace('/dashboard')
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Login failed')
    }
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row" style={{ fontFamily: 'DM Sans, sans-serif' }}>

      {/* ── LEFT PANEL ─────────────────────────────────────── */}
      <aside
        className="relative hidden md:flex md:w-[52%] flex-col justify-between overflow-hidden p-12"
        style={{ background: 'linear-gradient(145deg, #042f2e 0%, #065f46 45%, #0d9488 100%)' }}
      >
        {/* Blobs */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 -left-20 h-72 w-72 rounded-full blur-3xl" style={{ background: 'rgba(20,184,166,0.2)' }} />
          <div className="absolute top-1/2 -right-16 h-80 w-80 rounded-full blur-3xl" style={{ background: 'rgba(52,211,153,0.12)' }} />
          <div className="absolute -bottom-20 left-1/4 h-60 w-60 rounded-full blur-3xl" style={{ background: 'rgba(13,148,136,0.15)' }} />
        </div>

        {/* Grid texture */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.8) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.8) 1px,transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl ring-1 ring-white/20" style={{ background: 'rgba(255,255,255,0.15)' }}>
            <Zap className="h-5 w-5 text-white" />
          </span>
          <span className="text-xl font-bold tracking-tight text-white">NovaLead</span>
        </div>

        {/* Illustration */}
        <div className="relative z-10 flex justify-center py-4">
          <DashboardIllustration />
        </div>

        {/* Bottom copy + testimonial */}
        <div className="relative z-10 space-y-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold leading-snug text-white">
              Find high-intent B2B leads<br />
              <span style={{ color: '#5eead4' }}>before your competitors.</span>
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(153,246,228,0.8)' }}>
              Turn one sentence into a complete decision-maker list with verified profiles.
            </p>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3">
            {[['2M+', 'Leads Found'], ['95%', 'Accuracy'], ['10k+', 'Users']].map(([val, lbl]) => (
              <div
                key={lbl}
                className="rounded-xl p-3 text-center"
                style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                <p className="text-lg font-black text-white">{val}</p>
                <p className="text-xs" style={{ color: '#99f6e4' }}>{lbl}</p>
              </div>
            ))}
          </div>

          {/* Testimonial */}
          <div
            className="rounded-2xl p-4"
            style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}
          >
            <div className="flex gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-yellow-400 text-xs">★</span>
              ))}
            </div>
            <p className="text-sm italic leading-relaxed" style={{ color: 'rgba(204,251,241,0.9)' }}>
              "NovaLead reduced our prospecting cycle from 2 days to 20 minutes."
            </p>
            <div className="mt-3 flex items-center gap-2.5">
              <span
                className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white"
                style={{ background: 'rgba(20,184,166,0.4)' }}
              >
                RM
              </span>
              <div>
                <p className="text-xs font-semibold text-white">RevOps Team</p>
                <p className="text-xs" style={{ color: 'rgba(153,246,228,0.6)' }}>Mid-Market SaaS</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* ── RIGHT PANEL ─────────────────────────────────────── */}
      <main
        className="flex flex-1 flex-col items-center justify-center px-6 py-12 md:px-14"
        style={{ background: '#f8fffe' }}
      >
        {/* Mobile logo */}
        <div className="mb-8 flex items-center gap-2 md:hidden">
          <span
            className="flex h-9 w-9 items-center justify-center rounded-xl text-white"
            style={{ background: 'linear-gradient(135deg,#14b8a6,#0d9488)' }}
          >
            <Zap className="h-4 w-4" />
          </span>
          <span className="text-lg font-bold text-gray-900">NovaLead</span>
        </div>

        <div className="w-full max-w-[400px] space-y-7">

          {/* Heading */}
          <div className="space-y-1.5">
            <h1
              className="text-3xl font-black tracking-tight text-gray-900"
              style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
            >
              Welcome back
            </h1>
            <p className="text-sm" style={{ color: '#6b7280' }}>
              Sign in to your NovaLead account
            </p>
          </div>

          {/* Google button */}
          {/* <button
            type="button"
            className="flex h-11 w-full items-center justify-center gap-2.5 rounded-xl border text-sm font-semibold transition-all hover:-translate-y-px hover:shadow-md"
            style={{ borderColor: '#d1fae5', background: 'white', color: '#374151' }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#0d9488'; e.currentTarget.style.color = '#0f766e' }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#d1fae5'; e.currentTarget.style.color = '#374151' }}
          >
            <GoogleIcon />
            Continue with Google
          </button> */}

          {/* Divider */}
          <div className="relative flex items-center gap-3">
            <div className="h-px flex-1" style={{ background: '#d1fae5' }} />
            <span className="text-xs font-medium" style={{ color: '#9ca3af' }}>or sign in with email</span>
            <div className="h-px flex-1" style={{ background: '#d1fae5' }} />
          </div>

          {/* Form card */}
          <div
            className="rounded-2xl border p-7 shadow-sm"
            style={{ background: 'white', borderColor: '#d1fae5' }}
          >
            <form className="space-y-4" onSubmit={submit}>

              {/* Email */}
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
                <div className="relative">
                  <Mail
                    className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2"
                    style={{ color: '#9ca3af' }}
                  />
                  <Input
                    id="email"
                    type="email"
                    placeholder="jane@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-11 rounded-xl border-gray-200 bg-gray-50/60 pl-10 text-sm transition-all focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password</Label>
                  <button
                    type="button"
                    className="text-xs font-semibold transition-colors hover:underline"
                    style={{ color: '#0d9488' }}
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock
                    className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2"
                    style={{ color: '#9ca3af' }}
                  />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-11 rounded-xl border-gray-200 bg-gray-50/60 pl-10 pr-11 text-sm transition-all focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors hover:text-gray-600"
                    style={{ color: '#9ca3af' }}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div
                  className="flex items-center gap-2 rounded-lg border px-3 py-2.5"
                  style={{ background: '#fef2f2', borderColor: '#fecaca' }}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-red-500 flex-shrink-0" />
                  <p className="text-xs font-medium text-red-600">{error}</p>
                </div>
              )}

              {/* Submit */}
              <Button
                type="submit"
                disabled={isPending}
                className="group h-11 w-full rounded-xl text-sm font-bold text-white transition-all duration-200 active:scale-[0.98] disabled:opacity-60"
                style={{
                  background: isPending ? '#0d9488' : 'linear-gradient(135deg,#14b8a6,#0d9488)',
                  boxShadow: '0 4px 16px rgba(13,148,136,0.35)',
                }}
              >
                <span className="flex items-center justify-center gap-2">
                  {isPending ? (
                    <>
                      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      Signing in…
                    </>
                  ) : (
                    <>
                      Sign In
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </>
                  )}
                </span>
              </Button>
            </form>
          </div>

          {/* Sign up link */}
          <p className="text-center text-sm" style={{ color: '#6b7280' }}>
            Don&apos;t have an account?{' '}
            <Link
              href="/register"
              className="font-bold transition-colors hover:underline"
              style={{ color: '#0d9488' }}
            >
              Create one free
            </Link>
          </p>

          {/* Trust row */}
          <div className="flex items-center justify-center gap-5">
            {['No credit card', 'Free forever', 'Cancel anytime'].map((t) => (
              <span key={t} className="flex items-center gap-1 text-xs" style={{ color: '#9ca3af' }}>
                <Check className="h-3 w-3 text-teal-500" />
                {t}
              </span>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
