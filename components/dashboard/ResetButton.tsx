'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2, AlertTriangle, X } from 'lucide-react'
import { resetAllExpenses } from '@/app/actions/reset'

export function ResetButton() {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleDelete = () => {
    setError(null)
    startTransition(async () => {
      try {
        const result = await resetAllExpenses()
        if (!result.success) {
          setError(result.error)
          return
        }
        setOpen(false)
        router.refresh()
        console.log(`[Reset] Deleted ${result.deleted} expenses.`)
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Something went wrong.')
      }
    })
  }

  return (
    <>
      {/* ── Trigger button ─────────────────────────────────────────────── */}
      <button
        onClick={() => setOpen(true)}
        className="
          flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium
          border transition-colors
          bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100
          dark:bg-rose-500/10 dark:border-rose-500/30 dark:text-rose-400 dark:hover:bg-rose-500/20
        "
      >
        <Trash2 className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Reset Data</span>
      </button>

      {/* ── Confirmation modal ─────────────────────────────────────────── */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => !isPending && setOpen(false)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          {/* Modal */}
          <div
            className="
              relative z-10 w-full max-w-sm rounded-2xl border p-6 shadow-2xl
              bg-white border-slate-200
              dark:bg-[#0F1523] dark:border-slate-700
            "
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={() => setOpen(false)}
              disabled={isPending}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Icon */}
            <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-500/15 flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6 text-rose-600 dark:text-rose-400" />
            </div>

            <h3 className="text-lg font-bold mb-2 text-slate-900 dark:text-slate-100">
              Delete All Expenses?
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
              This will permanently delete <strong>all expenses</strong> linked to your phone number from Supabase. This action cannot be undone.
            </p>

            {error && (
              <p className="text-xs text-rose-500 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 rounded-lg px-3 py-2 mb-4">
                {error}
              </p>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setOpen(false)}
                disabled={isPending}
                className="
                  flex-1 py-2.5 rounded-xl text-sm font-medium border transition-colors
                  bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100
                  dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-700
                  disabled:opacity-50
                "
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isPending}
                className="
                  flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors
                  bg-rose-600 hover:bg-rose-500 text-white
                  disabled:opacity-60 disabled:cursor-not-allowed
                "
              >
                {isPending ? 'Deleting…' : 'Delete All'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
