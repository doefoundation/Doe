import { headers } from 'next/headers'
import { createServiceClient } from '@/lib/supabase/admin'

type Actor = { id?: string | null; email?: string | null }

/**
 * Records an admin action. Never throws: a logging problem must not
 * block the action the admin was trying to do.
 */
export async function logActivity(actor: Actor, action: string, entity: string, label?: string | null) {
  try {
    const h = await headers()
    const ip = (h.get('x-forwarded-for')?.split(',')[0] ?? h.get('x-real-ip') ?? '').trim().slice(0, 45) || null

    const { error } = await createServiceClient()
      .from('admin_activity_log')
      .insert({
        actor_id: actor.id ?? null,
        actor_email: actor.email ?? null,
        action,
        entity,
        label: label ? label.slice(0, 200) : null,
        ip,
      })

    if (error) console.error('Activity log failed', error.code)
  } catch {
    console.error('Activity log failed')
  }
}
