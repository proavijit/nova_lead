'use client'

import { Coins } from 'lucide-react'

import { useAuthStore } from '@/store/authStore'

export function TopBar() {
  const credits = useAuthStore((state) => state.credits)

  return (
    <header className="flex h-14 items-center justify-end border-b bg-background px-4">
      <div className="flex items-center gap-2 text-sm font-medium">
        <Coins className="h-4 w-4 text-yellow-500" />
        <span>{credits} credits</span>
      </div>
    </header>
  )
}
