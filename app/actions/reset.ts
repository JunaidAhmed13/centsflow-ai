'use server'

import { supabaseAdmin } from '@/lib/supabase'

export async function resetAllExpenses(): Promise<{ deleted: number }> {
  // Deletes every expense row regardless of user_id (test-data agnostic).
  // The `.not('id', 'is', null)` predicate satisfies Supabase's requirement
  // that a delete include a filter, while matching all rows.
  const { data, error } = await supabaseAdmin
    .from('expenses')
    .delete()
    .not('id', 'is', null)
    .select('id')

  if (error) {
    throw new Error(`Failed to reset expenses: ${error.message}`)
  }

  return { deleted: data?.length ?? 0 }
}
