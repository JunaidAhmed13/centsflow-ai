'use client'

import { useState, useTransition, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, ChevronRight, ArrowUpDown, MoreVertical, Trash2 } from 'lucide-react'
import { deleteExpense } from '@/app/actions/deleteExpense'
import type { Expense } from '@/types'

const CATEGORY_BADGE: Record<string, string> = {
  'Food & Dining':  'bg-amber-100  text-amber-700  border-amber-200  dark:bg-amber-500/15  dark:text-amber-300  dark:border-amber-500/20',
  Transportation:   'bg-sky-100    text-sky-700    border-sky-200    dark:bg-sky-500/15    dark:text-sky-300    dark:border-sky-500/20',
  Utilities:        'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/20',
  SaaS:             'bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-500/15 dark:text-indigo-300 dark:border-indigo-500/20',
}

const DEFAULT_BADGE =
  'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-700/50 dark:text-slate-300 dark:border-slate-600/30'

const PAGE_SIZE = 10
type SortKey = 'created_at' | 'amount'

// ── Row action menu ───────────────────────────────────────────────────────────
function RowMenu({
  expenseId,
  onDelete,
}: {
  expenseId: string
  onDelete: (id: string) => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="
          p-1.5 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100
          text-slate-400 hover:text-slate-600 hover:bg-slate-100
          dark:hover:text-slate-200 dark:hover:bg-slate-700
        "
        aria-label="Row actions"
      >
        <MoreVertical className="w-4 h-4" />
      </button>

      {open && (
        <div
          className="
            absolute right-0 top-8 z-30 w-40 rounded-xl border shadow-lg py-1
            bg-white border-slate-200
            dark:bg-[#0F1523] dark:border-slate-700
          "
        >
          <button
            onClick={() => {
              setOpen(false)
              onDelete(expenseId)
            }}
            className="
              w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors
              text-rose-600 hover:bg-rose-50
              dark:text-rose-400 dark:hover:bg-rose-500/10
            "
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete expense
          </button>
        </div>
      )}
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
interface TransactionsTableProps {
  expenses: Expense[]
}

export function TransactionsTable({ expenses: initialExpenses }: TransactionsTableProps) {
  // Local copy for optimistic deletion
  const [rows, setRows] = useState<Expense[]>(initialExpenses)
  const [page, setPage] = useState(1)
  const [sortKey, setSortKey] = useState<SortKey>('created_at')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  // Keep in sync when parent re-renders with fresh server data
  useEffect(() => {
    setRows(initialExpenses)
  }, [initialExpenses])

  const handleDelete = (id: string) => {
    // Optimistic: remove immediately
    const previous = rows
    setRows((r) => r.filter((e) => e.id !== id))

    startTransition(async () => {
      try {
        const result = await deleteExpense(id)
        if (!result.success) {
          console.error('[Delete] Failed:', result.error)
          setRows(previous) // rollback on a handled failure
          return
        }
        router.refresh() // sync server state
      } catch (err) {
        console.error('[Delete] Failed:', err)
        setRows(previous) // rollback on an unexpected throw
      }
    })
  }

  const handleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDir((d) => (d === 'desc' ? 'asc' : 'desc'))
    } else {
      setSortKey(key)
      setSortDir('desc')
    }
    setPage(1)
  }

  const sorted = [...rows].sort((a, b) => {
    const cmp =
      sortKey === 'created_at'
        ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        : Number(a.amount) - Number(b.amount)
    return sortDir === 'desc' ? -cmp : cmp
  })

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE))
  const paginated = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const SortBtn = ({ colKey, label }: { colKey: SortKey; label: string }) => (
    <button
      onClick={() => handleSort(colKey)}
      className="flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
    >
      {label}
      <ArrowUpDown className="w-3.5 h-3.5 opacity-40" />
    </button>
  )

  return (
    <div
      className="
        rounded-xl border overflow-hidden transition-colors
        bg-white border-slate-200
        dark:bg-slate-800/30 dark:border-slate-700/50
      "
    >
      {/* Header */}
      <div className="px-6 py-4 border-b flex items-center justify-between border-slate-200 dark:border-slate-700/50">
        <h4 className="text-base font-semibold text-slate-800 dark:text-slate-200">
          Transactions
        </h4>
        <span className="text-xs px-2.5 py-1 rounded-full border bg-slate-100 border-slate-200 text-slate-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400">
          {rows.length} total
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="text-xs uppercase tracking-wider bg-slate-50 text-slate-500 border-b border-slate-200 dark:bg-slate-800/60 dark:text-slate-400 dark:border-slate-700/50">
            <tr>
              <th className="px-6 py-3.5"><SortBtn colKey="created_at" label="Date" /></th>
              <th className="px-6 py-3.5">Description</th>
              <th className="px-6 py-3.5">Category</th>
              <th className="px-6 py-3.5 text-right"><SortBtn colKey="amount" label="Amount" /></th>
              <th className="px-3 py-3.5 w-10" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700/30">
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-16 text-center text-slate-400 dark:text-slate-500">
                  <p className="text-base mb-1">No transactions this month.</p>
                  <p className="text-xs">Text an expense on WhatsApp — it will appear here instantly.</p>
                </td>
              </tr>
            ) : (
              paginated.map((expense) => (
                <tr
                  key={expense.id}
                  className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-slate-500 dark:text-slate-400">
                    {new Date(expense.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </td>
                  <td className="px-6 py-4 font-medium max-w-[200px] truncate text-slate-800 dark:text-slate-200">
                    {expense.description}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                        CATEGORY_BADGE[expense.category] ?? DEFAULT_BADGE
                      }`}
                    >
                      {expense.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-mono whitespace-nowrap text-slate-800 dark:text-slate-200">
                    PKR {Number(expense.amount).toLocaleString()}
                  </td>
                  <td className="px-3 py-4">
                    <RowMenu expenseId={expense.id} onDelete={handleDelete} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t flex items-center justify-between text-sm border-slate-200 dark:border-slate-700/50">
          <span className="text-slate-500 dark:text-slate-400">
            Page {page} of {totalPages}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 rounded-lg border transition-colors border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 dark:border-slate-700 dark:bg-slate-800/50 dark:hover:bg-slate-700 dark:text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-2 rounded-lg border transition-colors border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 dark:border-slate-700 dark:bg-slate-800/50 dark:hover:bg-slate-700 dark:text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
