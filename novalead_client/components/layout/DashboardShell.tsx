'use client'

import { ReactNode, useState } from 'react'

import { Sidebar } from '@/components/layout/Sidebar'
import { TopBar } from '@/components/layout/TopBar'

export function DashboardShell({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900">
      <div className="mx-auto flex max-w-[1400px]">
        <div className="hidden h-screen md:block">
          <Sidebar />
        </div>

        {mobileOpen && (
          <>
            <button
              className="fixed inset-0 z-40 bg-black/50 md:hidden"
              onClick={() => setMobileOpen(false)}
              aria-label="Close navigation menu"
            />
            <div className="fixed left-0 top-0 z-50 h-screen md:hidden">
              <Sidebar onNavigate={() => setMobileOpen(false)} />
            </div>
          </>
        )}

        <div className="flex min-h-screen flex-1 flex-col">
          <TopBar onMenu={() => setMobileOpen(true)} />
          <main className="flex-1 px-4 py-6 md:px-8">
            <div className="mx-auto w-full max-w-6xl">{children}</div>
          </main>
        </div>
      </div>
    </div>
  )
}
