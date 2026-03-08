'use client'

import Link from 'next/link'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Lock, Mail, User, ArrowRight, Check } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRegister } from '@/hooks/useAuth'

/* ─── tiny inline helpers ─────────────────────────────────── */
function FeaturePill({ text }: { text: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-teal-400/30 bg-white/10 px-3 py-1 text-xs font-medium text-teal-50 backdrop-blur-sm">
      <Check className="h-3 w-3 text-teal-300" />
      {text}
    </span>
  )
}

/* ─── SVG Illustration ─────────────────────────────────────── */
function LeadIllustration() {
  return (
    <svg viewBox="0 0 420 340" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-sm drop-shadow-2xl">
      {/* Main dashboard card */}
      <rect x="20" y="30" width="310" height="200" rx="18" fill="white" fillOpacity="0.12" stroke="white" strokeOpacity="0.2" strokeWidth="1" />
      
      {/* Top bar dots */}
      <circle cx="44" cy="54" r="5" fill="#f87171" fillOpacity="0.8" />
      <circle cx="60" cy="54" r="5" fill="#fbbf24" fillOpacity="0.8" />
      <circle cx="76" cy="54" r="5" fill="#34d399" fillOpacity="0.8" />

      {/* Search bar */}
      <rect x="36" y="72" width="280" height="30" rx="8" fill="white" fillOpacity="0.15" />
      <rect x="46" y="82" width="120" height="10" rx="5" fill="white" fillOpacity="0.5" />
      <rect x="272" y="78" width="36" height="18" rx="6" fill="#14b8a6" fillOpacity="0.9" />

      {/* Table header */}
      <rect x="36" y="114" width="280" height="20" rx="4" fill="white" fillOpacity="0.08" />
      <rect x="46" y="120" width="40" height="8" rx="4" fill="white" fillOpacity="0.4" />
      <rect x="116" y="120" width="50" height="8" rx="4" fill="white" fillOpacity="0.4" />
      <rect x="196" y="120" width="40" height="8" rx="4" fill="white" fillOpacity="0.4" />
      <rect x="266" y="120" width="40" height="8" rx="4" fill="white" fillOpacity="0.4" />

      {/* Row 1 */}
      <circle cx="52" cy="150" r="10" fill="#14b8a6" fillOpacity="0.7" />
      <text x="47" y="154" fill="white" fontSize="9" fontWeight="bold">A</text>
      <rect x="70" y="145" width="70" height="8" rx="4" fill="white" fillOpacity="0.6" />
      <rect x="70" y="157" width="50" height="6" rx="3" fill="white" fillOpacity="0.3" />
      <rect x="196" y="145" width="55" height="8" rx="4" fill="white" fillOpacity="0.6" />
      <rect x="268" y="143" width="40" height="14" rx="5" fill="#0d9488" fillOpacity="0.7" />
      <rect x="275" y="147" width="26" height="6" rx="3" fill="white" fillOpacity="0.8" />

      {/* Row 2 */}
      <circle cx="52" cy="185" r="10" fill="#f59e0b" fillOpacity="0.7" />
      <text x="47" y="189" fill="white" fontSize="9" fontWeight="bold">L</text>
      <rect x="70" y="180" width="65" height="8" rx="4" fill="white" fillOpacity="0.6" />
      <rect x="70" y="192" width="45" height="6" rx="3" fill="white" fillOpacity="0.3" />
      <rect x="196" y="180" width="48" height="8" rx="4" fill="white" fillOpacity="0.6" />
      <rect x="268" y="178" width="40" height="14" rx="5" fill="#0d9488" fillOpacity="0.7" />
      <rect x="275" y="182" width="26" height="6" rx="3" fill="white" fillOpacity="0.8" />

      {/* Row 3 */}
      <circle cx="52" cy="218" r="10" fill="#818cf8" fillOpacity="0.7" />
      <text x="47" y="222" fill="white" fontSize="9" fontWeight="bold">S</text>
      <rect x="70" y="213" width="75" height="8" rx="4" fill="white" fillOpacity="0.6" />
      <rect x="70" y="225" width="55" height="6" rx="3" fill="white" fillOpacity="0.3" />
      <rect x="196" y="213" width="52" height="8" rx="4" fill="white" fillOpacity="0.6" />
      <rect x="268" y="211" width="40" height="14" rx="5" fill="#0d9488" fillOpacity="0.7" />
      <rect x="275" y="215" width="26" height="6" rx="3" fill="white" fillOpacity="0.8" />

      {/* Floating stat card 1 */}
      <rect x="260" y="220" width="130" height="64" rx="14" fill="white" fillOpacity="0.15" stroke="white" strokeOpacity="0.25" strokeWidth="1" />
      <text x="276" y="244" fill="white" fontSize="22" fontWeight="bold" fontFamily="system-ui">2M+</text>
      <rect x="276" y="251" width="60" height="7" rx="3.5" fill="white" fillOpacity="0.45" />
      <rect x="276" y="263" width="40" height="6" rx="3" fill="#34d399" fillOpacity="0.7" />

      {/* Floating stat card 2 */}
      <rect x="10" y="210" width="110" height="58" rx="14" fill="white" fillOpacity="0.15" stroke="white" strokeOpacity="0.25" strokeWidth="1" />
      <text x="26" y="234" fill="white" fontSize="20" fontWeight="bold" fontFamily="system-ui">95%</text>
      <rect x="26" y="241" width="55" height="7" rx="3.5" fill="white" fillOpacity="0.45" />
      <rect x="26" y="253" width="38" height="6" rx="3" fill="#fbbf24" fillOpacity="0.7" />

      {/* AI sparkle dots */}
      <circle cx="370" cy="60" r="4" fill="#34d399" fillOpacity="0.9" />
      <circle cx="385" cy="45" r="2.5" fill="#34d399" fillOpacity="0.6" />
      <circle cx="395" cy="68" r="2" fill="#34d399" fillOpacity="0.4" />

      {/* Bottom accent line */}
      <rect x="36" y="238" width="160" height="3" rx="2" fill="url(#grad1)" />
      <defs>
        <linearGradient id="grad1" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#14b8a6" />
          <stop offset="100%" stopColor="#14b8a6" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  )
}

/* ─── Main Page ─────────────────────────────────────────────── */
export default function RegisterPage() {
  const router = useRouter()
  const { mutateAsync, isPending } = useRegister()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    if (!fullName.trim()) return setError('Full name is required')
    if (password !== confirmPassword) return setError('Passwords do not match')
    if (!agreeTerms) return setError('Please accept terms to continue')
    try {
      await mutateAsync({ email, password })
      setSuccess('Registration successful. Redirecting…')
      setTimeout(() => router.replace('/login'), 1200)
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Registration failed')
    }
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row font-[DM_Sans,sans-serif]">

      {/* ── LEFT PANEL ─────────────────────────────────────── */}
      <aside
        className="relative hidden md:flex md:w-[52%] flex-col justify-between overflow-hidden p-12"
        style={{
          background: 'linear-gradient(145deg, #042f2e 0%, #065f46 40%, #0d9488 100%)',
        }}
      >
        {/* Mesh blobs */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-teal-400/20 blur-3xl" />
          <div className="absolute top-1/2 -right-16 h-80 w-80 rounded-full bg-emerald-400/15 blur-3xl" />
          <div className="absolute -bottom-20 left-1/3 h-60 w-60 rounded-full bg-cyan-400/10 blur-3xl" />
        </div>

        {/* Subtle grid texture */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/20 backdrop-blur-sm">
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-white" stroke="currentColor" strokeWidth="2.2">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span className="text-xl font-bold tracking-tight text-white">NovaLead</span>
        </div>

        {/* Illustration */}
        <div className="relative z-10 flex justify-center">
          <LeadIllustration />
        </div>

        {/* Bottom copy */}
        <div className="relative z-10 space-y-6">
          <div className="space-y-3">
            <h2 className="text-3xl font-bold leading-snug text-white">
              Build a repeatable pipeline<br />
              <span className="text-teal-300">powered by AI.</span>
            </h2>
            <p className="text-sm leading-relaxed text-teal-100/80">
              Describe who you're looking for in plain English — NovaLead finds verified decision-makers in seconds.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <FeaturePill text="AI-Powered Search" />
            <FeaturePill text="Verified Contacts" />
            <FeaturePill text="CSV Export" />
            <FeaturePill text="Free to Start" />
          </div>

          {/* Testimonial */}
          {/* <div className="rounded-2xl border border-white/10 bg-white/8 p-4 backdrop-blur-sm">
            <p className="text-sm italic leading-relaxed text-teal-50/90">
              "NovaLead cut our prospecting time in half. We found 200 qualified leads in our first session."
            </p>
            <div className="mt-3 flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-400/30 text-xs font-bold text-white">
                AK
              </span>
              <div>
                <p className="text-xs font-semibold text-white">Alex Kim</p>
                <p className="text-xs text-teal-300/70">Head of Sales, Streamline</p>
              </div>
            </div>
          </div> */}
        </div>
      </aside>

      {/* ── RIGHT PANEL ─────────────────────────────────────── */}
      <main
        className="flex flex-1 flex-col items-center justify-center px-6 py-12 md:px-14"
        style={{ background: '#f8fffe' }}
      >
        {/* Mobile logo */}
        <div className="mb-8 flex items-center gap-2 md:hidden">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-600">
            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 text-white" stroke="currentColor" strokeWidth="2.2">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span className="text-lg font-bold text-gray-900">NovaLead</span>
        </div>

        <div className="w-full max-w-[420px] space-y-7">

          {/* Heading */}
          <div className="space-y-1.5">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Create your account</h1>
            <p className="text-sm text-gray-500">Start finding leads in under 60 seconds.</p>
          </div>

          {/* Form card */}
          <div
            className="rounded-2xl border p-7 shadow-sm"
            style={{ background: '#ffffff', borderColor: '#d1fae5' }}
          >
            <form className="space-y-4" onSubmit={submit}>

              {/* Full Name */}
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-sm font-medium text-gray-700">Full Name</Label>
                <div className="relative">
                  <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="name"
                    placeholder="Jane Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="h-11 rounded-xl border-gray-200 bg-gray-50/60 pl-10 text-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="jane@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-11 rounded-xl border-gray-200 bg-gray-50/60 pl-10 text-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password</Label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Min. 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-11 rounded-xl border-gray-200 bg-gray-50/60 pl-10 pr-11 text-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">Confirm Password</Label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Repeat password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="h-11 rounded-xl border-gray-200 bg-gray-50/60 pl-10 text-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all"
                  />
                </div>
              </div>

              {/* Terms */}
              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-gray-100 bg-gray-50/50 p-3 transition-colors hover:bg-teal-50/40">
                <div className="relative mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="peer h-4 w-4 cursor-pointer appearance-none rounded border-2 border-gray-300 bg-white checked:border-teal-500 checked:bg-teal-500 transition-all"
                  />
                  <Check className="pointer-events-none absolute h-2.5 w-2.5 text-white opacity-0 peer-checked:opacity-100" />
                </div>
                <span className="text-xs leading-relaxed text-gray-600">
                  I agree to NovaLead's{' '}
                  <span className="font-semibold text-teal-700 hover:underline cursor-pointer">Terms of Service</span>{' '}
                  and{' '}
                  <span className="font-semibold text-teal-700 hover:underline cursor-pointer">Privacy Policy</span>
                </span>
              </label>

              {/* Feedback */}
              {error && (
                <div className="flex items-center gap-2 rounded-lg border border-red-100 bg-red-50 px-3 py-2.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-500 flex-shrink-0" />
                  <p className="text-xs font-medium text-red-600">{error}</p>
                </div>
              )}
              {success && (
                <div className="flex items-center gap-2 rounded-lg border border-teal-100 bg-teal-50 px-3 py-2.5">
                  <Check className="h-3.5 w-3.5 text-teal-600 flex-shrink-0" />
                  <p className="text-xs font-medium text-teal-700">{success}</p>
                </div>
              )}

              {/* Submit */}
              <Button
                type="submit"
                disabled={isPending}
                className="group h-11 w-full rounded-xl text-sm font-semibold text-white transition-all duration-200 active:scale-[0.98] disabled:opacity-60"
                style={{
                  background: isPending
                    ? '#0d9488'
                    : 'linear-gradient(135deg, #14b8a6, #0d9488)',
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
                      Creating account…
                    </>
                  ) : (
                    <>
                      Create Account
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </>
                  )}
                </span>
              </Button>
            </form>
          </div>

          {/* Footer link */}
          <p className="text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-teal-700 hover:text-teal-600 hover:underline transition-colors">
              Sign in
            </Link>
          </p>

          {/* Trust row */}
          <div className="flex items-center justify-center gap-5 pt-1">
            {['Free forever', 'No credit card', 'Cancel anytime'].map((t) => (
              <span key={t} className="flex items-center gap-1 text-xs text-gray-400">
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
