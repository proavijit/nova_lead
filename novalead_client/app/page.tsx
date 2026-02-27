import Link from 'next/link'
import { Bot, CreditCard, Linkedin, Search, Target, Timer, Zap } from 'lucide-react'

const features = [
  { icon: Bot, title: 'AI-Powered Search', text: 'Describe your ideal prospect in plain English.' },
  { icon: Target, title: 'Precision Targeting', text: 'Filter by role, industry, size, and location.' },
  { icon: Timer, title: 'Instant Results', text: 'Get targeted B2B leads in seconds.' },
  { icon: CreditCard, title: 'Credit-Based Access', text: 'Start with free credits and scale on demand.' },
  { icon: Search, title: 'Search History', text: 'Review and reuse previous searches.' },
  { icon: Linkedin, title: 'LinkedIn-Ready', text: 'Every lead comes with profile and company links.' }
]

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
            <Zap className="h-5 w-5 text-[#007BFF]" />
            NovaLead
          </Link>
          <div className="hidden items-center gap-6 text-sm text-slate-600 md:flex">
            <a href="#features">Features</a>
            <a href="#how">How it Works</a>
            <a href="#pricing">Pricing</a>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/login" className="rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-slate-100">
              Log In
            </Link>
            <Link href="/register" className="rounded-md bg-[#007BFF] px-3 py-2 text-sm font-medium text-white">
              Get Started Free
            </Link>
          </div>
        </nav>
      </header>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-16 md:grid-cols-2 md:py-20">
        <div className="space-y-6">
          <h1 className="text-4xl font-bold leading-tight md:text-5xl">Find Your Next Best Customer With the Power of AI</h1>
          <p className="max-w-xl text-base text-slate-600">
            NovaLead turns plain English into a targeted list of decision-makers. Tell us who you need, and get actionable
            leads fast.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/register" className="rounded-md bg-[#007BFF] px-5 py-3 text-sm font-medium text-white">
              Start for Free
            </Link>
            <button className="rounded-md border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700">Watch Demo</button>
          </div>
        </div>

        <div className="grid gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 shadow-sm">
          <div className="rounded-md border border-slate-200 bg-white p-3">
            <p className="text-sm font-semibold">Ava Morgan</p>
            <p className="text-sm text-slate-600">CTO at ClearFlow AI</p>
          </div>
          <div className="rounded-md border border-slate-200 bg-white p-3">
            <p className="text-sm font-semibold">Liam Patel</p>
            <p className="text-sm text-slate-600">VP Engineering at FinAxis</p>
          </div>
          <div className="rounded-md border border-slate-200 bg-white p-3">
            <p className="text-sm font-semibold">Sophia Rahman</p>
            <p className="text-sm text-slate-600">Head of Growth at LoopMetric</p>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 py-6 text-center text-sm text-slate-500">
        Trusted by teams at Stripe, Notion, HubSpot, Zapier, and Atlassian
      </section>

      <section id="features" className="mx-auto max-w-7xl px-4 py-16">
        <h2 className="text-3xl font-bold">Features</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map((item) => (
            <article key={item.title} className="rounded-md border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5">
              <item.icon className="h-5 w-5 text-[#007BFF]" />
              <h3 className="mt-3 text-base font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="how" className="mx-auto max-w-7xl px-4 pb-16">
        <h2 className="text-3xl font-bold">How it Works</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {['Describe', 'AI Converts', 'Get Leads'].map((step, idx) => (
            <div key={step} className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-medium text-[#007BFF]">Step {idx + 1}</p>
              <h3 className="mt-2 text-base font-semibold">{step}</h3>
            </div>
          ))}
        </div>
      </section>

      <section id="pricing" className="mx-auto max-w-7xl px-4 pb-16">
        <h2 className="text-3xl font-bold">Pricing</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xl font-semibold">Starter</p>
            <p className="mt-1 text-slate-600">Free</p>
          </div>
          <div className="rounded-md border border-[#007BFF] bg-white p-5 shadow-sm">
            <p className="text-xl font-semibold">Pro</p>
            <p className="mt-1 text-slate-600">$29/mo</p>
          </div>
          <div className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xl font-semibold">Enterprise</p>
            <p className="mt-1 text-slate-600">Custom</p>
          </div>
        </div>
      </section>
    </div>
  )
}
