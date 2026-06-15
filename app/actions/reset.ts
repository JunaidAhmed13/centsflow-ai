'use server'

import { supabaseAdmin } from '@/lib/supabase'
import { getVerifiedPhone } from '@/app/actions/expenses'

export async function resetAllExpenses(): Promise<{ deleted: number }> {
  const phone = await getVerifiedPhone()

  const { data, error } = await supabaseAdmin
    .from('expenses')
    .delete()
    .eq('user_id', phone)
    .select('id')

  if (error) {
    throw new Error(`Failed to reset expenses: ${error.message}`)
  }

  return { deleted: data?.length ?? 0 }
}
