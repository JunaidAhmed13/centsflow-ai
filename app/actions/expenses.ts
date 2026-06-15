'use server'

import { auth, currentUser } from '@clerk/nextjs/server'
import { supabaseAdmin } from '@/lib/supabase'
import type { Expense, DashboardMetrics, CategoryTotal, DailyTotal } from '@/types'

// Derive ISO date-range boundaries for a given "YYYY-MM" string.
function monthBounds(month: string): { startISO: string; endISO: string } {
  const [y, m] = month.split('-').map(Number)
  const startISO = `${month}-01T00:00:00.000Z`
  const nextY = m === 12 ? y + 1 : y
  const nextM = m === 12 ? 1 : m + 1
  const endISO = `${nextY}-${String(nextM).padStart(2, '0')}-01T00:00:00.000Z`
  return { startISO, endISO }
}

// Returns the verified phone number for the current Clerk user.
export async function getVerifiedPhone(): Promise<string> {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized: no active session.')

  const user = await currentUser()
  const phone = user?.phoneNumbers[0]?.phoneNumber
  if (!phone) throw new Error('No phone number linked to this account. Please add a phone number in your profile.')

  return phone
}

export async function getUserExpenses(month: string): Promise<Expense[]> {
  const phone = await getVerifiedPhone()
  const { startISO, endISO } = monthBounds(month)

  const { data, error } = await supabaseAdmin
    .from('expenses')
    .select('*')
    .eq('user_id', phone)
    .gte('created_at', startISO)
    .lt('created_at', endISO)
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(`Supabase query failed: ${error.message}`)
  }

  return (data as Expense[]) ?? []
}

export async function getDashboardMetrics(month: string): Promise<DashboardMetrics> {
  const expenses = await getUserExpenses(month)

  const [y, m] = month.split('-').map(Number)
  const now = new Date()
  const isCurrentMonth = now.getFullYear() === y && now.getMonth() + 1 === m

  const daysInMonth = new Date(y, m, 0).getDate()
  const daysElapsed = isCurrentMonth ? now.getDate() : daysInMonth

  // ── Total spend ──────────────────────────────────────────────────────────
  const totalSpend = expenses.reduce((sum, e) => sum + Number(e.amount), 0)

  // ── Category breakdown ───────────────────────────────────────────────────
  const categoryMap = expenses.reduce<Record<string, number>>((acc, e) => {
    acc[e.category] = (acc[e.category] ?? 0) + Number(e.amount)
    return acc
  }, {})

  const categoryData: CategoryTotal[] = Object.entries(categoryMap)
    .map(([category, total]) => ({ category, total }))
    .sort((a, b) => b.total - a.total)

  const topCategory = categoryData[0]?.category ?? null
  const topCategoryAmount = categoryData[0]?.total ?? 0

  // For past months run rate equals actual total.
  const predictedRunRate =
    daysElapsed > 0 ? (totalSpend / daysElapsed) * daysInMonth : totalSpend

  // ── Daily trend for every day in the selected month ──────────────────────
  const dailyMap = expenses.reduce<Record<string, number>>((acc, e) => {
    const day = e.created_at.split('T')[0]
    acc[day] = (acc[day] ?? 0) + Number(e.amount)
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
