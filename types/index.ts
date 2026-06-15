export interface Expense {
  id: string
  created_at: string
  amount: number
  currency?: string
  category: string
  description: string
  user_id: string
}

export interface CategoryTotal {
  category: string
  total: number
}

export interface DailyTotal {
  date: string     // display label e.g. "6/14"
  dateISO: string  // ISO date for sorting
  amount: number
}

export interface DashboardMetrics {
  totalSpend: number
  topCategory: string | null
  topCategoryAmount: number
  predictedRunRate: number
  categoryData: CategoryTotal[]
  trendData: DailyTotal[]
  expenses: Expense[]
  isCurrentMonth: boolean
  daysElapsed: number
  daysInMonth: number
}
