'use server'

import { auth } from '@clerk/nextjs/server'
import { supabaseAdmin } from '@/lib/supabase'

export type DeleteResult =
  | { success: true }
  | { success: false; error: string }

export async function deleteExpense(expenseId: string): Promise<DeleteResult> {
  try {
    const { userId } = await auth()
    if (!userId) {
      return { success: false, error: 'Unauthorized' }
    }

    // supabaseAdmin uses the Service Role Key (bypasses RLS). The `id` column
    // is int8; passing the string id is coerced safely by Supabase.
    const { error } = await supabaseAdmin
      .from('expenses')
      .delete()
      .eq('id', expenseId)

    if (error) {
      // Log the full error object so it surfaces in Vercel logs.
      console.error('[deleteExpense] Supabase delete failed:', error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (err) {
    console.error('[deleteExpense] Unexpected error:', err)
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error while deleting expense.',
    }
  }
}
