import { getSpendingInsight } from '@/app/actions/insights'
import { AIInsightCard } from '@/components/dashboard/AIInsightCard'
import type { CategoryTotal } from '@/types'

interface AsyncInsightProps {
  totalSpend: number
  topCategory: string | null
  categoryData: CategoryTotal[]
  predictedRunRate: number
}

/**
 * Server component that awaits the Groq insight in isolation. Rendered inside
 * a <Suspense> boundary on the dashboard so the rest of the page paints
 * immediately while the LLM call resolves — the slow/failing AI call no longer
 * blocks metrics, charts, or the transaction table.
 */
export async function AsyncInsight({
  totalSpend,
  topCategory,
  categoryData,
  predictedRunRate,
}: AsyncInsightProps) {
  const insight = await getSpendingInsight(
    totalSpend,
    topCategory,
    categoryData,
    predictedRunRate
  )
  return <AIInsightCard insight={insight} />
}
