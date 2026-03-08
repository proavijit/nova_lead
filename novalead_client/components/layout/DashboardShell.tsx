'use client'

import { ReactNode, useState } from 'react'

import { Sidebar } from '@/components/layout/Sidebar'
import { TopBar } from '@/components/layout/TopBar'

export function DashboardShell({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div
      className="min-h-screen"
      style={{
        background: '#f0fdf9',
        backgroundImage:
          'radial-gradient(circle at 12% 0%, rgba(13,148,136,0.07) 0%, transparent 36%),' +
          'radial-gradient(circle at 90% 5%, rgba(20,184,166,0.05) 0%, transparent 30%)',
        fontFamily: 'DM Sans, sans-serif',
        color: '#0f1a19',
      }}
    >
      <div className="flex min-h-screen">

        {/* ── Desktop sidebar ──────────────────────────────── */}
        <Sidebar />

        {/* ── Mobile overlay + drawer ──────────────────────── */}
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <button
              className="fixed inset-0 z-40 md:hidden"
              style={{ background: 'rgba(4,47,46,0.6)', backdropFilter: 'blur(2px)' }}
              onClick={() => setMobileOpen(false)}
              aria-label="Close navigation menu"
            />
            {/* Slide-in drawer */}
            <div
              className="fixed left-0 top-0 z-50 h-screen md:hidden"
              style={{
                animation: 'slideInLeft 220ms cubic-bezier(0.22,1,0.36,1) both',
              }}
            >
              <Sidebar onNavigate={() => setMobileOpen(false)} mobile />
            </div>
          </>
        )}

        {/* ── Main area ────────────────────────────────────── */}
        <div className="flex min-h-screen flex-1 flex-col md:pl-16 lg:pl-60">

          {/* Top bar */}
          <TopBar onMenu={() => setMobileOpen(true)} />

          {/* Page content */}
          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto w-full max-w-7xl">
              {children}
            </div>
          </main>

          {/* Footer bar */}
          <div
            className="border-t px-6 py-3 text-center text-xs"
            style={{ borderColor: '#d1fae5', color: '#9ca3af', background: 'rgba(240,253,250,0.8)' }}
          >
            © 2026 NovaLead · AI Prospecting CRM
          </div>
        </div>
      </div>

      {/* Slide-in keyframe */}
      <style>{`
        @keyframes slideInLeft {
          from { transform: translateX(-100%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
      `}</style>
    </div>
  )
}
