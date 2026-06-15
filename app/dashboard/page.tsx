import { Suspense } from 'react'
import { getDashboardMetrics } from '@/app/actions/expenses'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import { StatsCard } from '@/components/dashboard/StatsCard'
import { CategoryChart } from '@/components/dashboard/CategoryChart'
import { TrendChart } from '@/components/dashboard/TrendChart'
import { TransactionsTable } from '@/components/dashboard/TransactionsTable'
import { AIInsightSkeleton } from '@/components/dashboard/AIInsightCard'
import { AsyncInsight } from '@/components/dashboard/AsyncInsight'
import { RealtimeRefresher } from '@/components/dashboard/RealtimeRefresher'
import { LiveDateCard } from '@/components/dashboard/LiveDateCard'

// Realtime drives freshness now — opt out of ISR caching so router.refresh()
// always re-runs the server fetch against live Supabase data.
export const dynamic = 'force-dynamic'

interface PageProps {
  searchParams: { month?: string | string[] }
}

function currentMonthISO() {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

function monthLabel(month: string) {
  const [y, m] = month.split('-').map(Number)
  return new Date(y, m - 1, 1).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  })
}

export default async function DashboardPage({ searchParams }: PageProps) {
  const rawMonth = searchParams.month
  const month =
    typeof rawMonth === 'string' && /^\d{4}-\d{2}$/.test(rawMonth)
      ? rawMonth
      : currentMonthISO()

  // Fetch metrics once; the AI insight streams in separately via Suspense so a
  // slow or failing Groq call never blocks the rest of the dashboard.
  const metrics = await getDashboardMetrics(month)

  const formatPKR = (value: number) =>
    `PKR ${Math.round(value).toLocaleString('en-US')}`

  const projectedVsActual =
    metrics.daysElapsed > 0 && metrics.totalSpend > 0
      ? ((metrics.predictedRunRate - metrics.totalSpend) / metrics.totalSpend) * 100
      : 0

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] transition-colors duration-200">
      {/* Subscribes to Supabase Realtime and refreshes this route on any DB mutation */}
      <RealtimeRefresher />
      <DashboardHeader currentMonth={month} />

      {/* Full-width main — no max-w constraint, just horizontal padding */}
      <main className="px-6 lg:px-8 py-8 space-y-8 animate-fade-in">

        {/* ── Top row: date card + page subtitle ─────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">

          {/* Date card — live client-side date in the user's timezone */}
          <LiveDateCard />

          {/* Month label + context */}
          <div className="text-right hidden sm:block">
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              {monthLabel(month)}
            </h1>
            <p className="text-slate-500 text-sm mt-0.5">
              {metrics.isCurrentMonth
                ? `Day ${metrics.daysElapsed} of ${metrics.daysInMonth} · ${metrics.daysInMonth - metrics.daysElapsed} days remaining`
                : `Full month · ${metrics.daysInMonth} days`}
            </p>
          </div>
        </div>

        {/* ── KPI stat cards ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <StatsCard
            title="Total Spend"
            value={formatPKR(metrics.totalSpend)}
            trend={
              metrics.totalSpend > 0 && metrics.isCurrentMonth
                ? `${Math.abs(projectedVsActual).toFixed(0)}% ${projectedVsActual >= 0 ? 'below' : 'above'} projected pace`
                : undefined
            }
            trendPositive={projectedVsActual >= 0}
          />
          <StatsCard
            title="Top Category"
            value={metrics.topCategory ?? '—'}
            subtitle={
              metrics.topCategory
                ? `${formatPKR(metrics.topCategoryAmount)} this month`
                : 'No transactions yet'
            }
          />
          <StatsCard
            title={metrics.isCurrentMonth ? 'Predicted Run Rate' : 'Monthly Total'}
            value={formatPKR(metrics.predictedRunRate)}
            subtitle={
              metrics.isCurrentMonth
                ? `Based on ${metrics.daysElapsed}-day pace`
                : 'Actual spend for this month'
            }
          />
        </div>

        {/* ── AI Insight (streamed; shows skeleton while Groq resolves) ──── */}
        <Suspense fallback={<AIInsightSkeleton />}>
          <AsyncInsight
            totalSpend={metrics.totalSpend}
            topCategory={metrics.topCategory}
            categoryData={metrics.categoryData}
            predictedRunRate={metrics.predictedRunRate}
          />
        </Suspense>

        {/* ── Charts ─────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CategoryChart data={metrics.categoryData} />
          <TrendChart data={metrics.trendData} month={month} />
        </div>

        {/* ── Transactions table ─────────────────────────────────────────── */}
        <TransactionsTable expenses={metrics.expenses} />

        <p className="text-center text-xs text-slate-400 dark:text-slate-600 pb-4">
          CentsFlow AI may produce inaccurate metrics. Please verify transaction logs independently. Built by JunaidAhmed13.
        </p>
      </main>
    </div>
  )
}
