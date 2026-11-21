import { redirect } from 'next/navigation'
import { connection } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/admin'

export async function getAdminSession() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { supabase, user: null, isAdmin: false }

  const { data: isAdmin } = await supabase.rpc('is_admin')
  return { supabase, user, isAdmin: isAdmin === true }
}

export async function requireAdmin() {
  const session = await getAdminSession()
  if (!session.user || !session.isAdmin) redirect('/admin/login')
  return { supabase: session.supabase, user: session.user }
}

export async function hasAnyAdmin() {
  await connection()
  const service = createServiceClient()
  const { count, error } = await service.from('admin_users').select('user_id', { count: 'exact', head: true })
  if (error) throw new Error('Unable to check admin accounts')
  return (count ?? 0) > 0
}
