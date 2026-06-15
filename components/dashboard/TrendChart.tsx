'use client'

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'
import type { DailyTotal } from '@/types'

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: { value: number }[]
  label?: string
}) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white dark:bg-[#0F1523] border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 text-sm shadow-xl">
      <p className="text-slate-500 dark:text-slate-400 mb-1">{label}</p>
      <p className="text-indigo-600 dark:text-indigo-300 font-bold">
        PKR {payload[0].value.toLocaleString()}
      </p>
    </div>
  )
}

interface TrendChartProps {
  data: DailyTotal[]
  month: string // "YYYY-MM" — used for the title label
}

export function TrendChart({ data, month }: TrendChartProps) {
  const hasData = data.some((d) => d.amount > 0)
  const [y, m] = month.split('-').map(Number)
  const monthName = new Date(y, m - 1, 1).toLocaleDateString('en-US', {
    month: 'long',
  })

  if (!hasData) {
    return (
      <div
        className="
          p-6 rounded-xl border flex flex-col items-center justify-center h-64 text-sm
          bg-white border-slate-200 text-slate-400
          dark:bg-slate-800/30 dark:border-slate-700/50 dark:text-slate-500
        "
      >
        No spending data for {monthName}.
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
        {monthName} — Daily Spending
      </h4>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#4f46e5" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(148,163,184,0.2)"
            vertical={false}
          />
          <XAxis
            dataKey="date"
            tick={{ fill: '#94a3b8', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fill: '#94a3b8', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v: number) =>
              v >= 1000 ? `${(v / 1000).toFixed(0)}k` : `${v}`
            }
            width={36}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="amount"
            stroke="#4f46e5"
            strokeWidth={2.5}
            fill="url(#trendGradient)"
            dot={false}
            activeDot={{
              r: 5,
              fill: '#4f46e5',
              stroke: '#ffffff',
              strokeWidth: 2,
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
