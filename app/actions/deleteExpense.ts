'use server'

import { auth } from '@clerk/nextjs/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function deleteExpense(expenseId: string): Promise<void> {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  const { error } = await supabaseAdmin
    .from('expenses')
    .delete()
    .eq('id', expenseId)

  if (error) {
    throw new Error(`Failed to delete expense: ${error.message}`)
  }
}
