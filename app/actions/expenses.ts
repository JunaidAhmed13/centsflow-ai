'use server'

import { supabaseAdmin } from '@/lib/supabase'
import type { Expense, DashboardMetrics, CategoryTotal, DailyTotal } from '@/types'

function monthBounds(month: string): { startISO: string; endISO: string } {
  const [y, m] = month.split('-').map(Number)
  const startISO = `${month}-01T00:00:00.000Z`
  const nextY = m === 12 ? y + 1 : y
  const nextM = m === 12 ? 1 : m + 1
  const endISO = `${nextY}-${String(nextM).padStart(2, '0')}-01T00:00:00.000Z`
  return { startISO, endISO }
}

// Converts any value to a finite number, returning 0 for NaN/Infinity/null/undefined.
function safeAmount(value: unknown): number {
  const n = Number(value)
  return isFinite(n) ? n : 0
}

// Normalises a raw Supabase row into a typed Expense, coercing null fields to safe defaults.
function normaliseRow(row: Record<string, unknown>): Expense {
  return {
    id: String(row.id ?? ''),
    created_at: row.created_at != null ? String(row.created_at) : '',
    amount: safeAmount(row.amount),
    currency: row.currency != null ? String(row.currency) : undefined,
    category: row.category != null ? String(row.category) : 'Other',
    description: row.description != null ? String(row.description) : '',
    user_id: row.user_id != null ? String(row.user_id) : '',
  }
}

export async function getUserExpenses(month: string): Promise<Expense[]> {
  const { startISO, endISO } = monthBounds(month)

  const { data, error } = await supabaseAdmin
    .from('expenses')
    .select('*')
    .gte('created_at', startISO)
    .lt('created_at', endISO)
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(`Supabase query failed: ${error.message}`)
  }

  return ((data ?? []) as Record<string, unknown>[]).map(normaliseRow)
}

export async function getDashboardMetrics(month: string): Promise<DashboardMetrics> {
  const expenses = await getUserExpenses(month)

  const [y, m] = month.split('-').map(Number)
  const now = new Date()
  const isCurrentMonth = now.getFullYear() === y && now.getMonth() + 1 === m

  const daysInMonth = new Date(y, m, 0).getDate()
  const daysElapsed = isCurrentMonth ? now.getDate() : daysInMonth

  // ── Total spend ──────────────────────────────────────────────────────────
  const totalSpend = expenses.reduce((sum, e) => sum + safeAmount(e.amount), 0)

  // ── Category breakdown ───────────────────────────────────────────────────
  const categoryMap = expenses.reduce<Record<string, number>>((acc, e) => {
    const cat = e.category || 'Other'
    acc[cat] = (acc[cat] ?? 0) + safeAmount(e.amount)
    return acc
  }, {})

  const categoryData: CategoryTotal[] = Object.entries(categoryMap)
    .map(([category, total]) => ({ category, total }))
    .sort((a, b) => b.total - a.total)

  const topCategory = categoryData[0]?.category ?? null
  const topCategoryAmount = categoryData[0]?.total ?? 0

  const predictedRunRate =
    daysElapsed > 0 ? (totalSpend / daysElapsed) * daysInMonth : totalSpend

  // ── Daily trend ──────────────────────────────────────────────────────────
  const dailyMap = expenses.reduce<Record<string, number>>((acc, e) => {
    if (e.created_at) {
      const day = e.created_at.split('T')[0]
      if (day) acc[day] = (acc[day] ?? 0) + safeAmount(e.amount)
    }
    return acc
  }, {})

  const trendData: DailyTotal[] = Array.from({ length: daysInMonth }, (_, i) => {
    const day = String(i + 1).padStart(2, '0')
    const iso = `${month}-${day}`
    return {
      date: `${m}/${i + 1}`,
      dateISO: iso,
      amount: dailyMap[iso] ?? 0,
    }
  })

  return {
    totalSpend,
    topCategory,
    topCategoryAmount,
    predictedRunRate,
    categoryData,
    trendData,
    expenses,
    isCurrentMonth,
    daysElapsed,
    daysInMonth,
  }
}
