import { TrendingUp, TrendingDown } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: string
  subtitle?: string
  trend?: string
  trendPositive?: boolean
}

export function StatsCard({ title, value, subtitle, trend, trendPositive }: StatsCardProps) {
  return (
    <div
      className="
        p-6 rounded-xl border transition-colors
        bg-white border-slate-200 hover:border-slate-300
        dark:bg-slate-800/50 dark:border-slate-700 dark:hover:border-slate-600
      "
    >
      <p className="text-sm font-medium mb-1 text-slate-500 dark:text-slate-400">
        {title}
      </p>
      <h4 className="text-2xl md:text-3xl font-bold mb-2 truncate text-slate-900 dark:text-white">
        {value}
      </h4>
      {trend && (
        <p
          className={`text-xs flex items-center gap-1 font-medium ${
            trendPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500 dark:text-rose-400'
          }`}
        >
          {trendPositive ? (
            <TrendingDown className="w-3.5 h-3.5" />
          ) : (
            <TrendingUp className="w-3.5 h-3.5" />
          )}
          {trend}
        </p>
      )}
      {subtitle && (
        <p className="text-xs mt-1 text-slate-400 dark:text-slate-500">{subtitle}</p>
      )}
    </div>
  )
}
