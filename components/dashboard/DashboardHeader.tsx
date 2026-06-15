'use client'

import { UserButton } from '@clerk/nextjs'
import { LayoutDashboard } from 'lucide-react'
import { ThemeToggle } from '@/components/ThemeToggle'
import { MonthPicker } from '@/components/dashboard/MonthPicker'
import { ResetButton } from '@/components/dashboard/ResetButton'

interface DashboardHeaderProps {
  currentMonth: string // "YYYY-MM"
}

export function DashboardHeader({ currentMonth }: DashboardHeaderProps) {
  return (
    <header
      className="
        h-16 sticky top-0 z-20 px-6 lg:px-8
        flex items-center justify-between
        border-b backdrop-blur-sm
        bg-white/90 border-slate-200
        dark:bg-[#0F1523]/90 dark:border-slate-800
      "
    >
      {/* ── Left: logo ──────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="h-8 w-8 rounded-lg bg-indigo-500 flex items-center justify-center font-bold text-white text-lg">
          ¢
        </div>
        <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-slate-100">
          CentsFlow<span className="text-indigo-500 dark:text-indigo-400">AI</span>
        </span>
        <span
          className="
            hidden md:flex items-center gap-1.5 ml-1 text-xs px-2.5 py-1 rounded-full border
            text-slate-500 bg-slate-100 border-slate-200
            dark:text-slate-500 dark:bg-slate-800/60 dark:border-slate-700/50
          "
        >
          <LayoutDashboard className="w-3.5 h-3.5" />
          Dashboard
        </span>
      </div>

      {/* ── Right: controls ─────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 sm:gap-3">
        <MonthPicker currentMonth={currentMonth} />
        <ResetButton />
        <ThemeToggle />
        <UserButton afterSignOutUrl="/" />
      </div>
    </header>
  )
}
