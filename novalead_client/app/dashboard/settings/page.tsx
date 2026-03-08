'use client'

import { useState } from 'react'
import { User, Lock, Bell, Trash2, Save, Check, ShieldCheck, SlidersHorizontal } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuthStore } from '@/store/authStore'

/* ─── Section wrapper ───────────────────────────────────────── */
function Section({
  icon: Icon,
  title,
  subtitle,
  iconBg,
  iconColor,
  children,
}: {
  icon: any
  title: string
  subtitle: string
  iconBg: string
  iconColor: string
  children: React.ReactNode
}) {
  return (
    <div
      className="overflow-hidden rounded-2xl border transition-shadow hover:shadow-md"
      style={{ background: 'white', borderColor: '#d1fae5', boxShadow: '0 1px 4px rgba(13,148,136,0.06)' }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-3.5 border-b px-6 py-4"
        style={{ borderColor: '#f0fdf9', background: '#fafffe' }}
      >
        <span
          className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-xl"
          style={{ background: iconBg }}
        >
          <Icon className="h-4.5 w-4.5" style={{ color: iconColor }} />
        </span>
        <div>
          <h3 className="text-sm font-bold text-gray-900">{title}</h3>
          <p className="text-xs" style={{ color: '#9ca3af' }}>{subtitle}</p>
        </div>
      </div>

      {/* Body */}
      <div className="px-6 py-5">{children}</div>
    </div>
  )
}

/* ─── Styled input ──────────────────────────────────────────── */
function Field({ id, label, type = 'text', value, onChange, placeholder }: {
  id: string; label: string; type?: string
  value?: string; onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#6b7280' }}>
        {label}
      </Label>
      <Input
        id={id} type={type} value={value} onChange={onChange} placeholder={placeholder}
        className="h-10 rounded-xl border-gray-200 bg-gray-50/60 text-sm transition-all focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
      />
    </div>
  )
}

/* ─── Page ───────────────────────────────────────────────────── */
export default function DashboardSettingsPage() {
  const user = useAuthStore((state) => state.user)
  const [name, setName]     = useState('NovaLead User')
  const [email, setEmail]   = useState(user?.email || '')
  const [notify, setNotify] = useState(true)

  return (
    <div className="space-y-6" style={{ fontFamily: 'DM Sans, sans-serif' }}>

      {/* Page header */}
      <div>
        <h1 className="text-2xl font-black text-gray-900" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
          Settings
        </h1>
        <p className="mt-0.5 text-sm" style={{ color: '#6b7280' }}>
          Manage your profile, security, and workspace preferences.
        </p>
      </div>

      {/* ── Profile ────────────────────────────────────────────── */}
      <Section
        icon={User} title="Profile" subtitle="Update your display name and email address"
        iconBg="#ccfbf1" iconColor="#0d9488"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="name"  label="Full Name" value={name}  onChange={(e) => setName(e.target.value)}  placeholder="Your name" />
          <Field id="email" label="Email"     value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" type="email" />
        </div>

        {/* Avatar preview row */}
        <div className="mt-4 flex items-center gap-3 rounded-xl border p-3" style={{ borderColor: '#d1fae5', background: '#f0fdf9' }}>
          <span
            className="grid h-10 w-10 place-items-center rounded-full text-sm font-black text-white"
            style={{ background: 'linear-gradient(135deg,#14b8a6,#0d9488)' }}
          >
            {name.slice(0, 2).toUpperCase()}
          </span>
          <div>
            <p className="text-sm font-semibold text-gray-900">{name || 'NovaLead User'}</p>
            <p className="text-xs" style={{ color: '#9ca3af' }}>{email || 'No email set'}</p>
          </div>
        </div>

        <div className="mt-4">
          <button
            className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition-all hover:-translate-y-px active:scale-[0.98]"
            style={{ background: 'linear-gradient(135deg,#14b8a6,#0d9488)', boxShadow: '0 4px 14px rgba(13,148,136,0.3)' }}
          >
            <Save className="h-3.5 w-3.5" />
            Save Profile
          </button>
        </div>
      </Section>

      {/* ── Security ───────────────────────────────────────────── */}
      <Section
        icon={ShieldCheck} title="Security" subtitle="Change your password to keep your account safe"
        iconBg="#d1fae5" iconColor="#059669"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="newPassword"     label="New Password"     type="password" placeholder="Min. 8 characters" />
          <Field id="confirmPassword" label="Confirm Password" type="password" placeholder="Repeat new password" />
        </div>

        {/* Password strength hint */}
        <div className="mt-3 flex items-center gap-2">
          {['Uppercase', 'Number', '8+ chars'].map((hint) => (
            <span
              key={hint}
              className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium"
              style={{ background: '#f0fdf9', color: '#6b7280', border: '1px solid #d1fae5' }}
            >
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: '#d1d5db' }} />
              {hint}
            </span>
          ))}
        </div>

        <div className="mt-4">
          <button
            className="inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-all hover:bg-teal-50 hover:-translate-y-px"
            style={{ borderColor: '#a7f3d0', color: '#0f766e', background: 'white' }}
          >
            <Lock className="h-3.5 w-3.5" />
            Update Password
          </button>
        </div>
      </Section>

      {/* ── Preferences ────────────────────────────────────────── */}
      <Section
        icon={SlidersHorizontal} title="Preferences" subtitle="Configure notifications and workspace behaviour"
        iconBg="#fef3c7" iconColor="#d97706"
      >
        <label
          className="flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors hover:bg-amber-50/30"
          style={{ borderColor: '#fde68a', background: '#fffbeb' }}
        >
          {/* Custom checkbox */}
          <div className="relative mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center">
            <input
              type="checkbox"
              checked={notify}
              onChange={(e) => setNotify(e.target.checked)}
              className="peer h-4 w-4 cursor-pointer appearance-none rounded border-2 border-gray-300 bg-white checked:border-teal-500 checked:bg-teal-500 transition-all"
            />
            <Check className="pointer-events-none absolute h-2.5 w-2.5 text-white opacity-0 peer-checked:opacity-100" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">Email Notifications</p>
            <p className="mt-0.5 text-xs leading-relaxed" style={{ color: '#6b7280' }}>
              Notify me when new credits are added or when a search completes
            </p>
          </div>
        </label>

        <div className="mt-4">
          <button
            className="inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-all hover:bg-teal-50 hover:-translate-y-px"
            style={{ borderColor: '#a7f3d0', color: '#0f766e', background: 'white' }}
          >
            <Bell className="h-3.5 w-3.5" />
            Save Preferences
          </button>
        </div>
      </Section>

      {/* ── Danger Zone ────────────────────────────────────────── */}
      <div
        className="overflow-hidden rounded-2xl border"
        style={{ background: '#fff5f5', borderColor: '#fecaca', boxShadow: '0 1px 4px rgba(220,38,38,0.06)' }}
      >
        {/* Header */}
        <div
          className="flex items-center gap-3.5 border-b px-6 py-4"
          style={{ borderColor: '#fecaca', background: '#fef2f2' }}
        >
          <span className="grid h-9 w-9 place-items-center rounded-xl" style={{ background: '#fee2e2' }}>
            <Trash2 className="h-4 w-4 text-red-600" />
          </span>
          <div>
            <h3 className="text-sm font-bold text-red-800">Danger Zone</h3>
            <p className="text-xs text-red-500">Irreversible actions — proceed with caution</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-5">
          <div>
            <p className="text-sm font-semibold text-red-800">Delete Account</p>
            <p className="mt-0.5 text-xs" style={{ color: '#ef4444' }}>
              Permanently removes your account and all associated data. This cannot be undone.
            </p>
          </div>
          <button
            className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition-all hover:-translate-y-px active:scale-[0.98]"
            style={{ background: 'linear-gradient(135deg,#ef4444,#dc2626)', boxShadow: '0 4px 12px rgba(220,38,38,0.3)' }}
          >
            <Trash2 className="h-3.5 w-3.5" />
            Delete Account
          </button>
        </div>
      </div>
    </div>
  )
}
