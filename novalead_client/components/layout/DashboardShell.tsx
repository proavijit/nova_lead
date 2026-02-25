import { ReactNode } from 'react'

import { Sidebar } from '@/components/layout/Sidebar'
import { TopBar } from '@/components/layout/TopBar'

export function DashboardShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#fcfcfd] dark:bg-[#09090b]">
      <div className="mx-auto flex max-w-[1600px]">
        <div className="hidden md:block">
          <Sidebar />
        </div>
        <div className="flex min-h-screen flex-1 flex-col overflow-hidden">
          <TopBar />
          <main className="flex-1 px-6 py-8 md:px-12 bg-gradient-to-br from-transparent to-primary/5">
            <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
