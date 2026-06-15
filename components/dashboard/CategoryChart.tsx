'use client'

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import type { CategoryTotal } from '@/types'

const PALETTE = [
  '#4f46e5', '#0ea5e9', '#10b981',
  '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899',
]

const CustomTooltip = ({
  active,
  payload,
}: {
  active?: boolean
  payload?: { name: string; value: number }[]
}) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white dark:bg-[#0F1523] border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 text-sm shadow-xl">
      <p className="text-slate-600 dark:text-slate-300 font-medium">{payload[0].name}</p>
      <p className="text-indigo-600 dark:text-indigo-300 font-bold">
        PKR {payload[0].value.toLocaleString()}
      </p>
    </div>
  )
}

interface CategoryChartProps {
  data: CategoryTotal[]
}

export function CategoryChart({ data }: CategoryChartProps) {
  if (data.length === 0) {
    return (
      <div
        className="
          p-6 rounded-xl border flex flex-col items-center justify-center h-64 text-sm
          bg-white border-slate-200 text-slate-400
          dark:bg-slate-800/30 dark:border-slate-700/50 dark:text-slate-500
        "
      >
        No category data for this month.
      </div>
    )
  }

  return (
    <div
      className="
        p-6 rounded-xl border transition-colors
        bg-white border-slate-200
        dark:bg-slate-800/30 dark:border-slate-700/50
      "
    >
      <h4 className="text-base font-semibold mb-6 text-slate-800 dark:text-slate-200">
        Spend by Category
      </h4>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={72}
            outerRadius={110}
            dataKey="total"
            nameKey="category"
            paddingAngle={3}
          >
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={PALETTE[index % PALETTE.length]}
                stroke="transparent"
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            iconType="circle"
            iconSize={8}
            formatter={(value: string) => (
              <span style={{ color: '#94a3b8', fontSize: 12 }}>{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
