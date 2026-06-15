'use server'

import { supabaseAdmin } from '@/lib/supabase'

export type ResetResult =
  | { success: true; deleted: number }
  | { success: false; error: string }

export async function resetAllExpenses(): Promise<ResetResult> {
  try {
    // supabaseAdmin uses the Service Role Key, which bypasses RLS entirely —
    // so this delete is not subject to row-level policy rejections. Supabase
    // still requires a WHERE clause on bulk deletes; `gte('id', 0)` matches
    // every row of the int8 primary key while satisfying that guard.
    const { data, error } = await supabaseAdmin
      .from('expenses')
      .delete()
      .gte('id', 0)
      .select('id')

    if (error) {
      // Log the full error object so it surfaces in Vercel logs.
      console.error('[resetAllExpenses] Supabase delete failed:', error)
      return { success: false, error: error.message }
    }

    return { success: true, deleted: data?.length ?? 0 }
  } catch (err) {
    console.error('[resetAllExpenses] Unexpected error:', err)
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error while resetting expenses.',
    }
  }
}
