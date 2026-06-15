'use client'

import { useEffect, useState } from 'react'

/**
 * Displays the live current date from the user's actual browser timezone.
 * Computed on the client (after mount) so it never shows a cached/server
 * build timestamp. Re-evaluates once per minute to roll over at midnight.
 */
export function LiveDateCard() {
  const [now, setNow] = useState<Date | null>(null)

  useEffect(() => {
    setNow(new Date())
    const id = setInterval(() => setNow(new Date()), 60_000)
    return () => clearInterval(id)
  }, [])

  const todayDay = now
    ? now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
    : ''
  const todayYear = now ? now.getFullYear().toString() : ''

  return (
    <div
      className="
        inline-flex flex-col px-5 py-3.5 rounded-xl border-2 shrink-0
        bg-indigo-950/60 border-indigo-500/50
        dark:bg-indigo-950/60 dark:border-indigo-500/50
      "
    >
      <span className="text-xl sm:text-2xl font-extrabold text-white tracking-tight leading-none min-h-[1.75rem]">
        {todayDay}
      </span>
      <span className="text-sm text-indigo-300 font-medium mt-1 min-h-[1.25rem]">
        {todayYear}
      </span>
    </div>
  )
}
