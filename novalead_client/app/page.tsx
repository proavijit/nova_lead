'use client'

import Link from 'next/link'
import HeroIllustration from '@/components/ui/HeroIllustration';
import { useState } from 'react';

import {
  ArrowRight, Bot, Check, CirclePlay, CreditCard, Menu,
  Search, Target, Timer, Linkedin, X, Zap, Github, Twitter
} from 'lucide-react'

/* ─── Data ──────────────────────────────────────────────────── */
const navLinks = [
  { href: '#features', label: 'Features' },
  { href: '#how', label: 'How It Works' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#resources', label: 'Resources' }
]

const features = [
  { icon: Search, title: 'AI-Powered Search', text: 'Describe your ideal prospect in plain English. Our AI understands context and finds exact matches.' },
  { icon: Target, title: 'Precision Targeting', text: 'Filter by role, industry, company size, and location for laser-focused results.' },
  { icon: Timer, title: 'Instant Results', text: 'Get a targeted list of B2B decision-makers in under 10 seconds.' },
  { icon: CreditCard, title: 'Credit-Based Access', text: 'Start with free credits. Scale as your pipeline grows with transparent pricing.' },
  { icon: Bot, title: 'Search History', text: 'Review, reuse, and refine all your previous searches from one place.' },
  { icon: Linkedin, title: 'LinkedIn-Ready', text: 'Every lead comes with verified LinkedIn profile and company page links.' }
]

const steps = [
  { title: 'Describe Your Ideal Lead', text: "Tell us the job titles, industries, company size, and locations you're targeting." },
  { title: 'AI Discovers Matches', text: 'Our AI scans millions of verified profiles to find your perfect-fit leads instantly.' },
  { title: 'Export & Engage', text: 'Review results, export to CSV, or push directly to your CRM and start outreach.' }
]

const companyLogos = ['Stripe', 'Notion', 'HubSpot', 'Zapier', 'Atlassian']

const pricingFeatures = [
  'AI-powered lead discovery', 'Verified emails and phone numbers',
  'LinkedIn profile matching', 'Company intelligence data',
  'Advanced search filters', 'CSV export',
  'Campaign analytics', 'Unlimited searches'
]



/* ─── Redesigned How It Works SVG ───────────────────────────── */

function HowItWorksSVG() {
  return (
    <svg
      viewBox="0 0 720 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full rounded-2xl"
    >
      {/* Background */}
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="720" y2="200">
          <stop offset="0%" stopColor="#022c22" />
          <stop offset="100%" stopColor="#064e3b" />
        </linearGradient>

        <linearGradient id="btn" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#14b8a6" />
          <stop offset="100%" stopColor="#22c55e" />
        </linearGradient>
      </defs>

      <rect width="720" height="200" rx="18" fill="url(#bg)" />

      {/* Search Bar */}
      <rect x="30" y="26" width="360" height="44" rx="12" fill="#065f46" stroke="#0d9488" />
      <circle cx="52" cy="48" r="9" fill="#14b8a6" fillOpacity="0.5" />
      <rect x="70" y="44" width="190" height="9" rx="5" fill="#a7f3d0" fillOpacity="0.5" />

      {/* Search Button */}
      <rect x="300" y="32" width="80" height="30" rx="8" fill="url(#btn)" />
      <rect x="320" y="42" width="40" height="10" rx="5" fill="white" fillOpacity="0.9" />

      {/* Export Button */}
      <rect x="590" y="26" width="100" height="44" rx="12" fill="#0d9488" />
      <rect x="612" y="42" width="60" height="10" rx="5" fill="white" fillOpacity="0.9" />

      {/* Status Chips */}
      <g>
        <rect x="30" y="82" width="100" height="24" rx="8" fill="#065f46" stroke="#0d9488" />
        <rect x="40" y="89" width="80" height="10" rx="5" fill="#34d399" fillOpacity="0.8" />

        <rect x="140" y="82" width="90" height="24" rx="8" fill="#065f46" stroke="#0d9488" />
        <rect x="150" y="89" width="70" height="10" rx="5" fill="#fbbf24" fillOpacity="0.7" />

        <rect x="240" y="82" width="80" height="24" rx="8" fill="#065f46" stroke="#0d9488" />
        <rect x="250" y="89" width="60" height="10" rx="5" fill="#818cf8" fillOpacity="0.7" />
      </g>

      {/* Table Rows */}
      {[120, 150, 180].map((y, i) => (
        <g key={i}>
          <rect
            x="30"
            y={y}
            width="660"
            height="26"
            rx="6"
            fill={i % 2 === 0 ? "#065f46" : "#064e3b"}
            fillOpacity="0.6"
          />

          <circle
            cx="50"
            cy={y + 13}
            r="8"
            fill={["#14b8a6", "#f59e0b", "#818cf8"][i]}
          />

          <rect x="66" y={y + 9} width="90" height="8" rx="4" fill="white" fillOpacity="0.6" />
          <rect x="200" y={y + 9} width="120" height="8" rx="4" fill="white" fillOpacity="0.35" />
          <rect x="360" y={y + 9} width="90" height="8" rx="4" fill="#34d399" fillOpacity="0.5" />
          <rect x="500" y={y + 7} width="90" height="12" rx="6" fill="#0d9488" fillOpacity="0.7" />
          <rect x="610" y={y + 9} width="70" height="8" rx="4" fill="white" fillOpacity="0.25" />
        </g>
      ))}
    </svg>
  )
}

/* ─── Page ───────────────────────────────────────────────────── */
export default function Home() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen text-slate-900" style={{ background: '#f8fffe', fontFamily: 'DM Sans, sans-serif' }}>

      {/* ── NAVBAR ────────────────────────────────────────────── */}
      <header
        className="sticky top-0 z-50 border-b"
        style={{ background: 'rgba(248,255,254,0.92)', borderColor: '#d1fae5', backdropFilter: 'blur(16px)' }}
      >
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <span
              className="grid h-9 w-9 place-items-center rounded-xl text-white shadow-sm"
              style={{ background: 'linear-gradient(135deg,#14b8a6,#0d9488)' }}
            >
              <Zap className="h-4.5 w-4.5" />
            </span>
            <span className="text-lg font-bold tracking-tight text-gray-900">NovaLead</span>
          </Link>

          <div className="hidden items-center gap-7 text-sm font-medium md:flex" style={{ color: '#374151' }}>
            {navLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="transition-colors hover:text-teal-700"
              >
                {item.label}
              </a>
            ))}
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <Link
              href="/login"
              className="rounded-lg border px-4 py-2 text-sm font-semibold transition-all hover:border-teal-500 hover:text-teal-700"
              style={{ borderColor: '#a7f3d0', color: '#0f766e', background: 'white' }}
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="rounded-lg px-4 py-2 text-sm font-semibold text-white transition-all hover:-translate-y-px"
              style={{ background: 'linear-gradient(135deg,#14b8a6,#0d9488)', boxShadow: '0 4px 14px rgba(13,148,136,0.35)' }}
            >
              Start Free Trial
            </Link>
          </div>

          <button
            className="grid h-10 w-10 place-items-center rounded-lg border bg-white md:hidden"
            style={{ borderColor: '#d1fae5' }}
            onClick={() => setMobileOpen((p) => !p)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5 text-gray-600" /> : <Menu className="h-5 w-5 text-gray-600" />}
          </button>
        </nav>

        {mobileOpen && (
          <div className="border-t bg-white px-4 py-4 md:hidden" style={{ borderColor: '#d1fae5' }}>
            <div className="space-y-1">
              {navLinks.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-teal-50 hover:text-teal-700"
                >
                  {item.label}
                </a>
              ))}
            </div>
            <div className="mt-4 grid gap-2">
              <Link href="/login" onClick={() => setMobileOpen(false)}
                className="rounded-lg border px-4 py-2.5 text-center text-sm font-semibold"
                style={{ borderColor: '#a7f3d0', color: '#0f766e' }}
              >
                Sign In
              </Link>
              <Link href="/register" onClick={() => setMobileOpen(false)}
                className="rounded-lg px-4 py-2.5 text-center text-sm font-semibold text-white"
                style={{ background: 'linear-gradient(135deg,#14b8a6,#0d9488)' }}
              >
                Start Free Trial
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* ── HERO ──────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        {/* Background blobs */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-32 -top-20 h-96 w-96 rounded-full blur-3xl" style={{ background: 'rgba(13,148,136,0.1)' }} />
          <div className="absolute -right-20 top-10 h-80 w-80 rounded-full blur-3xl" style={{ background: 'rgba(20,184,166,0.08)' }} />
          <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full blur-3xl" style={{ background: 'rgba(52,211,153,0.07)' }} />
        </div>

        {/* Subtle dot grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: 'radial-gradient(circle, #0d9488 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />

        <div className="relative mx-auto grid max-w-7xl gap-12 px-4 pb-16 pt-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:pt-24">
          {/* Left */}
          <div className="space-y-8">

            {/* Eyebrow */}
            <span
              className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold"
              style={{
                borderColor: "rgba(20,184,166,0.25)",
                background: "rgba(20,184,166,0.08)",
                color: "#0f766e",
                fontFamily: "Inter, sans-serif"
              }}
            >
              <span className="h-2 w-2 rounded-full bg-teal-500 animate-pulse" />
              Built for modern SaaS growth teams
            </span>

            {/* Headline */}
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight"
              style={{
                color: "#0f172a",
                fontFamily: "Sora, Inter, sans-serif",
                letterSpacing: "-0.02em"
              }}
            >
              Discover{" "}
              <span
                style={{
                  background: "linear-gradient(135deg,#0ea5a4,#14b8a6,#22c55e)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent"
                }}
              >
                High-Intent
              </span>{" "}
              B2B Leads with AI
            </h1>

            {/* Description */}
            <p
              className="max-w-xl text-lg leading-relaxed"
              style={{
                color: "#475569",
                fontFamily: "Inter, sans-serif"
              }}
            >
              NovaLead turns simple targeting into verified B2B prospects with rich
              company insights — ready for outreach in minutes.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-wrap items-center gap-4">

              <Link
                href="/register"
                className="group inline-flex items-center gap-2 rounded-xl px-7 py-3.5 text-sm font-semibold text-white transition"
                style={{
                  background: "linear-gradient(135deg,#14b8a6,#0ea5a4)",
                  boxShadow: "0 10px 30px rgba(20,184,166,0.35)",
                  fontFamily: "Inter"
                }}
              >
                Start Free Trial
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <button
                className="inline-flex items-center gap-2 rounded-xl border px-6 py-3.5 text-sm font-semibold transition hover:bg-teal-50"
                style={{
                  borderColor: "#d1fae5",
                  color: "#334155",
                  background: "white",
                  fontFamily: "Inter"
                }}
              >
                <CirclePlay className="h-4 w-4 text-teal-600" />
                Watch Product Tour
              </button>

            </div>

            {/* Rating */}
            <div className="flex items-center gap-4">

              <div className="flex -space-x-2">
                {["#14b8a6", "#f59e0b", "#6366f1", "#f472b6", "#22c55e"].map((c, i) => (
                  <span
                    key={i}
                    className="h-8 w-8 rounded-full border-2 border-white"
                    style={{ background: c }}
                  />
                ))}
              </div>

              <div
                className="text-sm"
                style={{ color: "#475569", fontFamily: "Inter" }}
              >
                <span className="font-semibold text-slate-900">4.9/5</span>
                <span className="ml-1 text-yellow-500">★★★★★</span>
                <span className="ml-1 text-slate-500">from 2,000+ reviews</span>
              </div>

            </div>

          </div>

          {/* Right — Dashboard mockup */}
          <div className="relative">
            {/* Outer glow */}
            <div
              className="absolute inset-0 rounded-3xl blur-2xl"
              style={{ background: 'rgba(13,148,136,0.12)', transform: 'scale(0.95) translateY(8px)' }}
            />
            <div
              className="relative rounded-3xl border p-4 shadow-2xl"
              style={{ background: 'white', borderColor: '#d1fae5', boxShadow: '0 20px 60px rgba(13,148,136,0.15)' }}
            >
              {/* Mock topbar */}
              <div
                className="mb-3 flex items-center justify-between rounded-xl px-4 py-2.5 text-sm"
                style={{ background: '#042f2e' }}
              >
                <span className="flex items-center gap-2 font-medium text-white">
                  <Zap className="h-3.5 w-3.5 text-teal-400" />
                  Lead Discovery Engine
                </span>
                <span
                  className="rounded-full px-2 py-0.5 text-xs font-semibold"
                  style={{ background: 'rgba(52,211,153,0.2)', color: '#34d399' }}
                >
                  Live
                </span>
              </div>
              <HeroIllustration />
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ─────────────────────────────────────────────── */}
      <section className="mx-auto mb-16 max-w-4xl px-4 sm:px-6">
        <div
          className="grid grid-cols-1 gap-px rounded-2xl overflow-hidden border sm:grid-cols-3"
          style={{ borderColor: '#d1fae5', background: '#d1fae5' }}
        >
          {[['10,000+', 'Active Users', '#0d9488'], ['2M+', 'Leads Discovered', '#f59e0b'], ['95%', 'Accuracy Rate', '#14b8a6']].map(([value, label, color]) => (
            <div key={label} className="flex flex-col items-center justify-center gap-1 py-8 text-center" style={{ background: '#f8fffe' }}>
              <p className="text-4xl font-black" style={{ color }}>{value}</p>
              <p className="text-sm font-medium" style={{ color: '#6b7280' }}>{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── LOGOS ─────────────────────────────────────────────── */}
      <section className="border-y py-9" style={{ background: 'white', borderColor: '#d1fae5' }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <p className="text-center text-xs font-bold uppercase tracking-[0.2em]" style={{ color: '#9ca3af' }}>
            Trusted By Leading Companies
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-10">
            {companyLogos.map((logo) => (
              <span
                key={logo}
                className="cursor-default text-base font-black tracking-tight transition-all duration-200 hover:scale-105"
                style={{ color: '#d1d5db' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#0d9488')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#d1d5db')}
              >
                {logo}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ──────────────────────────────────────────── */}
      <section id="features" className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span
            className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-widest"
            style={{ borderColor: 'rgba(13,148,136,0.3)', color: '#0f766e', background: '#ccfbf1' }}
          >
            Features
          </span>
          <h2
            className="mt-4 text-3xl font-black sm:text-4xl"
            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', color: '#0f1a19' }}
          >
            Everything You Need to Find Leads
          </h2>
          <p className="mt-3 text-base" style={{ color: '#6b7280' }}>
            Powerful AI-driven tools to discover, qualify, and manage your sales pipeline.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {features.map((item, i) => (
            <article
              key={item.title}
              className="group relative rounded-2xl border p-6 transition-all duration-200 hover:-translate-y-1"
              style={{ background: 'white', borderColor: '#d1fae5', boxShadow: '0 1px 4px rgba(13,148,136,0.06)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#0d9488'
                e.currentTarget.style.boxShadow = '0 8px 30px rgba(13,148,136,0.14)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#d1fae5'
                e.currentTarget.style.boxShadow = '0 1px 4px rgba(13,148,136,0.06)'
              }}
            >
              <span
                className="grid h-11 w-11 place-items-center rounded-xl"
                style={{ background: '#ccfbf1', color: '#0d9488' }}
              >
                <item.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 text-base font-bold" style={{ color: '#0f1a19' }}>{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed" style={{ color: '#6b7280' }}>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────────── */}
      <section id="how" className="py-20" style={{ background: '#042f2e' }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <span
              className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-widest"
              style={{ borderColor: 'rgba(52,211,153,0.3)', color: '#34d399', background: 'rgba(52,211,153,0.1)' }}
            >
              How It Works
            </span>
            <h2
              className="mt-4 text-3xl font-black text-white sm:text-4xl"
              style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
            >
              Start Finding Leads in Minutes
            </h2>
            <p className="mt-3 text-base" style={{ color: '#99f6e4' }}>
              Three simple steps to transform your lead generation.
            </p>
          </div>

          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {steps.map((step, idx) => (
              <div
                key={step.title}
                className="relative rounded-2xl border p-6"
                style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(13,148,136,0.3)' }}
              >
                {/* Connector line (desktop) */}
                {idx < 2 && (
                  <div
                    className="absolute -right-2.5 top-9 hidden h-px w-5 lg:block"
                    style={{ background: 'rgba(13,148,136,0.4)' }}
                  />
                )}
                <span
                  className="grid h-9 w-9 place-items-center rounded-full text-sm font-black text-white"
                  style={{ background: 'linear-gradient(135deg,#14b8a6,#0d9488)' }}
                >
                  {idx + 1}
                </span>
                <h3 className="mt-4 text-lg font-bold text-white">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: '#99f6e4' }}>{step.text}</p>
              </div>
            ))}
          </div>

          {/* Dashboard preview */}
          <div className="mt-10 overflow-hidden rounded-2xl border" style={{ borderColor: 'rgba(13,148,136,0.3)' }}>
            <div className="flex items-center gap-2 px-4 py-2.5" style={{ background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(13,148,136,0.2)' }}>
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: '#f87171' }} />
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: '#fbbf24' }} />
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: '#34d399' }} />
              <span className="ml-2 text-xs font-medium" style={{ color: '#99f6e4' }}>Lead Discovery Engine — Results</span>
            </div>
            <div className="p-4">
              <HowItWorksSVG />
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div
          className="relative overflow-hidden rounded-3xl px-8 py-14 text-center"
          style={{ background: 'linear-gradient(135deg, #042f2e 0%, #065f46 50%, #0d9488 100%)' }}
        >
          {/* Blob */}
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full blur-3xl" style={{ background: 'rgba(52,211,153,0.15)' }} />
          <div className="pointer-events-none absolute -bottom-12 -left-12 h-48 w-48 rounded-full blur-3xl" style={{ background: 'rgba(20,184,166,0.12)' }} />

          <div className="relative">
            <h2
              className="text-3xl font-black text-white sm:text-4xl"
              style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
            >
              Ready to Transform Your Lead Generation?
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-base" style={{ color: '#99f6e4' }}>
              Join 10,000+ sales teams discovering qualified leads with AI. Start free — no credit card required.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-teal-800 transition hover:-translate-y-0.5"
                style={{ background: 'white', boxShadow: '0 4px 16px rgba(0,0,0,0.15)' }}
              >
                Get Started Free
                <ArrowRight className="h-4 w-4" />
              </Link>
              <button
                className="inline-flex items-center gap-2 rounded-xl border px-6 py-3 text-sm font-bold text-white transition hover:bg-white/10"
                style={{ borderColor: 'rgba(255,255,255,0.4)' }}
              >
                Schedule Demo
              </button>
            </div>

            <div className="mt-6 flex flex-wrap justify-center gap-6 text-sm" style={{ color: '#99f6e4' }}>
              {['Free forever', 'No credit card required', 'Cancel anytime'].map((t) => (
                <span key={t} className="inline-flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5 text-teal-300" />
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── PRICING ───────────────────────────────────────────── */}
      <section id="pricing" className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
        <div className="text-center">
          <span
            className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-widest"
            style={{ borderColor: 'rgba(13,148,136,0.3)', color: '#0f766e', background: '#ccfbf1' }}
          >
            Pricing
          </span>
          <h2
            className="mt-4 text-3xl font-black sm:text-4xl"
            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', color: '#0f1a19' }}
          >
            Free Forever
          </h2>
          <p className="mt-3 text-base" style={{ color: '#6b7280' }}>
            Full access to every feature. No credit card, no hidden fees, no catches.
          </p>
        </div>

        <div
          className="mx-auto mt-10 max-w-md rounded-3xl border-2 bg-white p-8 text-center"
          style={{ borderColor: '#0d9488', boxShadow: '0 12px 48px rgba(13,148,136,0.18)' }}
        >
          <span
            className="inline-block rounded-full px-3 py-1 text-xs font-black uppercase tracking-widest"
            style={{ background: '#ccfbf1', color: '#0f766e' }}
          >
            Free Forever
          </span>
          <p className="mt-5 text-6xl font-black" style={{ color: '#0f1a19', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            $0
          </p>
          <p className="text-sm font-medium" style={{ color: '#9ca3af' }}>/forever</p>
          <p className="mt-2 text-sm" style={{ color: '#6b7280' }}>Everything you need to find and manage leads</p>

          <Link
            href="/register"
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-white transition-all hover:-translate-y-0.5"
            style={{ background: 'linear-gradient(135deg,#14b8a6,#0d9488)', boxShadow: '0 4px 16px rgba(13,148,136,0.35)' }}
          >
            Get Started Free
            <ArrowRight className="h-4 w-4" />
          </Link>

          <ul className="mt-6 space-y-2.5 text-left text-sm" style={{ color: '#374151' }}>
            {pricingFeatures.map((item) => (
              <li key={item} className="flex items-center gap-2.5">
                <span
                  className="grid h-5 w-5 flex-shrink-0 place-items-center rounded-full"
                  style={{ background: '#ccfbf1' }}
                >
                  <Check className="h-3 w-3" style={{ color: '#0d9488' }} />
                </span>
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-5 text-xs" style={{ color: '#9ca3af' }}>No credit card required. No hidden fees.</p>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────── */}
      <footer id="resources" className="border-t" style={{ background: '#042f2e', borderColor: 'rgba(13,148,136,0.2)' }}>
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2.5">
              <span
                className="grid h-9 w-9 place-items-center rounded-xl text-white"
                style={{ background: 'linear-gradient(135deg,#14b8a6,#0d9488)' }}
              >
                <Zap className="h-4 w-4" />
              </span>
              <span className="text-lg font-bold text-white">NovaLead</span>
            </Link>
            <p className="mt-3 text-sm leading-relaxed" style={{ color: '#99f6e4', opacity: 0.75 }}>
              AI-powered lead discovery CRM for modern sales teams.
            </p>
            <div className="mt-5 flex items-center gap-3">
              {[Twitter, Linkedin, Github].map((Icon, i) => (
                <span
                  key={i}
                  className="grid h-8 w-8 cursor-pointer place-items-center rounded-lg transition-all hover:scale-110"
                  style={{ background: 'rgba(255,255,255,0.07)', color: '#99f6e4' }}
                >
                  <Icon className="h-4 w-4" />
                </span>
              ))}
            </div>
          </div>

          {[
            { heading: 'Product', items: ['Features', 'Pricing', 'Integrations', 'API', 'Changelog'] },
            { heading: 'Company', items: ['About', 'Blog', 'Careers', 'Press', 'Contact'] },
            { heading: 'Resources', items: ['Documentation', 'Help Center', 'Community', 'Privacy Policy', 'Terms'] }
          ].map(({ heading, items }) => (
            <div key={heading}>
              <p className="mb-4 text-sm font-bold text-white">{heading}</p>
              <ul className="space-y-2.5">
                {items.map((item) => (
                  <li
                    key={item}
                    className="cursor-pointer text-sm transition-colors hover:text-teal-300"
                    style={{ color: 'rgba(153,246,228,0.65)' }}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div
          className="border-t px-4 py-5 text-center text-xs sm:px-6"
          style={{ borderColor: 'rgba(13,148,136,0.15)', color: 'rgba(153,246,228,0.45)' }}
        >
          © 2026 NovaLead. All rights reserved. &nbsp;·&nbsp; Privacy &nbsp;·&nbsp; Terms
        </div>
      </footer>
    </div>
  )
}
