'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { ChevronDown } from 'lucide-react'

// Build a list of the last 12 months in "YYYY-MM" format, newest first
function buildMonthOptions(): { value: string; label: string }[] {
  const options: { value: string; label: string }[] = []
  const now = new Date()

  for (let i = 0; i < 12; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    const label = d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    options.push({ value, label })
  }

  return options
}

interface MonthPickerProps {
  currentMonth: string // "YYYY-MM"
}

export function MonthPicker({ currentMonth }: MonthPickerProps) {
  const router = useRouter()
  const options = buildMonthOptions()

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    router.push(`/dashboard?month=${e.target.value}`)
  }

  return (
    <div className="relative flex items-center">
      <select
        value={currentMonth}
        onChange={handleChange}
        className="
          appearance-none pl-3 pr-8 py-1.5 rounded-lg text-sm font-medium
          border cursor-pointer transition-colors
          bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200
          dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-700
          focus:outline-none focus:ring-2 focus:ring-indigo-500/50
        "
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-2 w-3.5 h-3.5 pointer-events-none text-slate-400" />
    </div>
  )
}
