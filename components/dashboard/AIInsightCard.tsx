import { Sparkles, AlertTriangle } from 'lucide-react'

interface AIInsightCardProps {
  insight: string
}

// Phrases the server action returns when it cannot produce a real insight.
const FALLBACK_MARKERS = [
  'unavailable',
  'Unable to generate',
  'not configured',
  'Add your first expense',
]

function isFallback(text: string) {
  return FALLBACK_MARKERS.some((m) => text.toLowerCase().includes(m.toLowerCase()))
}

export function AIInsightCard({ insight }: AIInsightCardProps) {
  const fallback = isFallback(insight)

  return (
    <div
      className={`
        rounded-xl border p-5 flex gap-4 items-start transition-colors
        ${
          fallback
            ? 'bg-slate-50 border-slate-200 dark:bg-slate-800/40 dark:border-slate-700/50'
            : 'bg-indigo-50 border-indigo-100 dark:bg-indigo-950/40 dark:border-indigo-500/20'
        }
      `}
    >
      <div
        className={`
          shrink-0 w-9 h-9 rounded-lg flex items-center justify-center mt-0.5
          ${
            fallback
              ? 'bg-slate-200 dark:bg-slate-700/50'
              : 'bg-indigo-100 dark:bg-indigo-500/20'
          }
        `}
      >
        {fallback ? (
          <AlertTriangle className="w-5 h-5 text-slate-500 dark:text-slate-400" />
        ) : (
          <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
        )}
      </div>
      <div>
        <h5
          className={`font-semibold text-sm mb-1.5 flex items-center gap-2 ${
            fallback
              ? 'text-slate-600 dark:text-slate-300'
              : 'text-indigo-700 dark:text-indigo-300'
          }`}
        >
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

/**
 * Skeleton shown inside the Suspense boundary while the Groq insight resolves,
 * so the AI section communicates a loading state instead of failing silently.
 */
export function AIInsightSkeleton() {
  return (
    <div
      className="
        rounded-xl border p-5 flex gap-4 items-start
        bg-indigo-50 border-indigo-100
        dark:bg-indigo-950/40 dark:border-indigo-500/20
      "
    >
      <div className="shrink-0 w-9 h-9 rounded-lg flex items-center justify-center mt-0.5 bg-indigo-100 dark:bg-indigo-500/20">
        <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400 animate-pulse" />
      </div>
      <div className="flex-1 space-y-2">
        <div className="h-4 w-40 rounded bg-indigo-100 dark:bg-indigo-500/20 animate-pulse" />
        <div className="h-3 w-full rounded bg-slate-200 dark:bg-slate-700/50 animate-pulse" />
        <div className="h-3 w-2/3 rounded bg-slate-200 dark:bg-slate-700/50 animate-pulse" />
      </div>
    </div>
  )
}
