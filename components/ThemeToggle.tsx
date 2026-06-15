'use client'

import { Sun, Moon } from 'lucide-react'
import { useTheme } from './ThemeProvider'

export function ThemeToggle() {
  const { theme, toggle } = useTheme()

  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className="
        w-9 h-9 rounded-lg flex items-center justify-center transition-colors
        bg-slate-100 hover:bg-slate-200 text-slate-600
        dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-400
      "
    >
      {theme === 'dark' ? (
        <Sun className="w-4 h-4" />
      ) : (
        <Moon className="w-4 h-4" />
      )}
    </button>
  )
}
