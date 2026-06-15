'use server'

import Groq from 'groq-sdk'
import type { CategoryTotal } from '@/types'

export async function getSpendingInsight(
  totalSpend: number,
  topCategory: string | null,
  categoryData: CategoryTotal[],
  predictedRunRate: number
): Promise<string> {
  if (categoryData.length === 0) {
    return 'Add your first expense to start receiving AI-powered spending insights.'
  }

  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) {
    console.error('[Groq] GROQ_API_KEY is not set in environment variables.')
    return 'AI insights unavailable: API key not configured.'
  }

  // Instantiate per-call so env vars are guaranteed to be loaded
  const groq = new Groq({ apiKey })

  const summary = categoryData
    .map((c) => `${c.category}: PKR ${c.total.toLocaleString()}`)
    .join(', ')

  const prompt = `You are a sharp, concise personal finance advisor. Analyze this user's monthly spending data and give ONE actionable insight in 2–3 sentences. Be direct and specific — no generic advice.

Data:
- Total spend this month: PKR ${totalSpend.toLocaleString()}
- Projected monthly total: PKR ${Math.round(predictedRunRate).toLocaleString()}
- Breakdown by category: ${summary}
- Highest spending category: ${topCategory ?? 'N/A'}

Respond with ONLY the insight text. No labels, no preamble, no bullet points.`

  try {
    const completion = await groq.chat.completions.create({
      model: 'llama3-8b-8192',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 150,
      temperature: 0.6,
    })

    const text = completion.choices[0]?.message?.content?.trim()
    if (!text) {
      console.error('[Groq] Empty response from API. Full response:', JSON.stringify(completion))
      return 'Unable to generate insight at this time.'
    }

    return text
  } catch (error) {
    console.error('[Groq] API call failed:', error)
    return 'AI insights temporarily unavailable.'
  }
}
