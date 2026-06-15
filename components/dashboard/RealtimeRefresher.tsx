'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabaseBrowser } from '@/lib/supabaseClient'

/**
 * Subscribes to Supabase Realtime changes on the `expenses` table and
 * re-validates the current route whenever a row is inserted, updated, or
 * deleted (e.g. an n8n webhook writes a new expense). Because the dashboard
 * is a Server Component, router.refresh() re-runs the server fetch and
 * re-renders metrics, Recharts, and the transaction list with fresh data —
 * no manual browser refresh required.
 *
 * Renders nothing.
 */
export function RealtimeRefresher() {
  const router = useRouter()

  useEffect(() => {
    const channel = supabaseBrowser
      .channel('expenses-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'expenses' },
        () => {
          router.refresh()
        }
      )
      .subscribe()

    return () => {
      supabaseBrowser.removeChannel(channel)
    }
  }, [router])

  return null
}
