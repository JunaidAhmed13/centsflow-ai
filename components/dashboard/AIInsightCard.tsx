import { Sparkles } from 'lucide-react'

interface AIInsightCardProps {
  insight: string
}

export function AIInsightCard({ insight }: AIInsightCardProps) {
  return (
    <div
      className="
        rounded-xl border p-5 flex gap-4 items-start transition-colors
        bg-indigo-50 border-indigo-100
        dark:bg-indigo-950/40 dark:border-indigo-500/20
      "
    >
      <div
        className="
          shrink-0 w-9 h-9 rounded-lg flex items-center justify-center mt-0.5
          bg-indigo-100 dark:bg-indigo-500/20
        "
      >
        <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
      </div>
      <div>
        <h5 className="font-semibold text-sm mb-1.5 flex items-center gap-2 text-indigo-700 dark:text-indigo-300">
          AI Spending Insight
          <span
            className="
              text-xs font-normal px-2 py-0.5 rounded-full
              bg-indigo-100 text-indigo-500
              dark:bg-indigo-500/10 dark:text-indigo-400
            "
          >
            Groq · Llama 3
          </span>
        </h5>
        <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          {insight}
        </p>
      </div>
    </div>
  )
}
