'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/admin'
import { hasAnyAdmin, requireAdmin } from '@/lib/admin-auth'
import { logActivity } from '@/lib/activity-log'
import { slugify, type ActionState } from '@/lib/cms-types'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function text(formData: FormData, key: string) {
  return String(formData.get(key) ?? '').trim()
}

function refreshPublicSite() {
  revalidatePath('/', 'layout')
}

function isSafeUrl(value: string) {
  return /^(https?:\/\/|\/|mailto:)/.test(value)
}

/* ---------- Authentication ---------- */

export async function signIn(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const email = text(formData, 'email').toLowerCase()
  const password = String(formData.get('password') ?? '')
  if (!EMAIL_PATTERN.test(email) || !password) return { error: 'Enter your email address and password.' }

  const supabase = await createClient()
  const { data: signedIn, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) {
    await logActivity({ email }, 'login.failed', 'Admin sign-in', email)
    if (error.code === 'email_not_confirmed') return { error: 'Please confirm your email address before signing in.' }
    if (error.status === 429) return { error: 'Too many attempts. Please wait a moment and try again.' }
    if (error.code === 'invalid_credentials' || error.status === 400) return { error: 'Invalid email or password.' }
    console.error('Admin sign-in failed', error.code)
    return { error: 'Something went wrong. Please try again.' }
  }

  const { data: isAdmin } = await supabase.rpc('is_admin')
  if (isAdmin !== true) {
    await supabase.auth.signOut()
    return { error: 'This account does not have admin access.' }
  }

  await logActivity({ id: signedIn.user?.id, email }, 'login', 'Admin sign-in')
  redirect('/admin')
}

export async function setupFirstAdmin(_prev: ActionState, formData: FormData): Promise<ActionState> {
  if (await hasAnyAdmin()) return { error: 'An admin account already exists. Please sign in instead.' }

  const email = text(formData, 'email').toLowerCase()
  const password = String(formData.get('password') ?? '')
  const confirm = String(formData.get('confirm') ?? '')
  if (!EMAIL_PATTERN.test(email)) return { error: 'Enter a valid email address.' }
  if (password.length < 8) return { error: 'Password must be at least 8 characters.' }
  if (password !== confirm) return { error: 'Passwords do not match.' }

  const service = createServiceClient()
  const { data, error } = await service.auth.admin.createUser({ email, password, email_confirm: true })
  if (error || !data.user) {
    console.error('First admin creation failed', error?.code)
    return { error: 'Could not create the account. If this email is already registered, use a different one.' }
  }

  const { error: adminError } = await service.from('admin_users').insert({ user_id: data.user.id, email })
  if (adminError) return { error: 'Account created, but admin access could not be granted. Please try again.' }

  const supabase = await createClient()
  await supabase.auth.signInWithPassword({ email, password })
  redirect('/admin')
}

export async function signOut() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (user) await logActivity(user, 'logout', 'Admin sign-in')
  await supabase.auth.signOut()
  redirect('/admin/login')
}

/* ---------- News ---------- */

export async function saveNews(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const { supabase, user } = await requireAdmin()

  const id = text(formData, 'id')
  const title = text(formData, 'title')
  const slug = slugify(text(formData, 'slug') || title)
  const excerpt = text(formData, 'excerpt')
  const content = text(formData, 'content')
  const category = text(formData, 'category') || 'News'
  const coverImageUrl = text(formData, 'cover_image_url') || null
  const status = formData.get('status') === 'published' ? 'published' : 'draft'
  const scheduled = text(formData, 'publish_mode') === 'scheduled'
  const scheduledFor = text(formData, 'published_at')

  if (title.length < 3 || title.length > 200) return { error: 'Title must be between 3 and 200 characters.' }
  if (!slug) return { error: 'Add a URL slug using letters or numbers.' }
  if (excerpt.length > 400) return { error: 'Summary must be 400 characters or fewer.' }
  if (category.length > 60) return { error: 'Category must be 60 characters or fewer.' }
  if (coverImageUrl && !/^https:\/\//.test(coverImageUrl)) return { error: 'Cover image must be an https:// URL.' }
  if (status === 'published' && !content) return { error: 'Add some content before publishing.' }

  let publishedAt: string | null = null
  if (status === 'published') {
    if (scheduled) {
      const when = new Date(scheduledFor)
      if (!scheduledFor || Number.isNaN(when.getTime())) return { error: 'Choose a valid date and time to schedule this article.' }
      if (when.getTime() < Date.now() + 60_000) return { error: 'The scheduled time must be in the future. To go live immediately, choose "Publish now".' }
      publishedAt = when.toISOString()
    } else if (scheduledFor) {
      // Publish with a date chosen by the admin (today or any past date).
      const when = new Date(scheduledFor)
      if (Number.isNaN(when.getTime()) || when.getFullYear() < 2000) return { error: 'Choose a valid article date.' }
      if (when.getTime() > Date.now() + 60_000) return { error: 'The article date cannot be in the future. To go live later, choose "Schedule for later".' }
      publishedAt = when.toISOString()
    } else {
      // Publish now. Keep the original date if the article is already live; otherwise use the current time.
      let existingDate: string | null = null
      if (id) {
        const { data: existing } = await supabase.from('news_posts').select('published_at').eq('id', id).maybeSingle()
        existingDate = existing?.published_at ?? null
      }
      publishedAt = existingDate && new Date(existingDate).getTime() <= Date.now() ? existingDate : new Date().toISOString()
    }
  }

  const values = {
    title,
    slug,
    excerpt,
    content,
    category,
    cover_image_url: coverImageUrl,
    status,
    published_at: publishedAt,
    updated_at: new Date().toISOString(),
  }

  const { error } = id
    ? await supabase.from('news_posts').update(values).eq('id', id)
    : await supabase.from('news_posts').insert({ ...values, author_id: user.id })

  if (error) {
    if (error.code === '23505') return { error: 'Another article already uses this URL slug. Choose a different one.' }
    console.error('Saving news failed', error.code)
    return { error: 'Could not save the article. Please try again.' }
  }

  await logActivity(user, id ? 'news.update' : 'news.create', 'News article', `${title} (${status})`)
  refreshPublicSite()
  redirect(`/admin/news?saved=${scheduled && status === 'published' ? 'scheduled' : status}`)
}

export async function deleteNews(formData: FormData) {
  const { supabase, user } = await requireAdmin()
  const id = text(formData, 'id')
  if (!id) return
  const { data: post } = await supabase.from('news_posts').select('title').eq('id', id).maybeSingle()
  await supabase.from('news_posts').delete().eq('id', id)
  await logActivity(user, 'news.delete', 'News article', post?.title ?? id)
  refreshPublicSite()
  redirect('/admin/news?deleted=1')
}

/* ---------- Announcements ---------- */

export async function saveAnnouncement(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const { supabase, user } = await requireAdmin()

  const id = text(formData, 'id')
  const message = text(formData, 'message')
  const linkLabel = text(formData, 'link_label') || null
  const linkUrl = text(formData, 'link_url') || null
  const isActive = formData.get('is_active') === 'on'

  if (message.length < 3 || message.length > 280) return { error: 'Message must be between 3 and 280 characters.' }
  if (linkLabel && linkLabel.length > 40) return { error: 'Link text must be 40 characters or fewer.' }
  if (linkUrl && !isSafeUrl(linkUrl)) return { error: 'Link must start with https://, / or mailto:' }
  if (linkLabel && !linkUrl) return { error: 'Add a link URL for the link text.' }

  if (isActive) {
    let deactivate = supabase.from('announcements').update({ is_active: false }).eq('is_active', true)
    if (id) deactivate = deactivate.neq('id', id)
    await deactivate
  }

  const values = { message, link_label: linkLabel, link_url: linkUrl, is_active: isActive, updated_at: new Date().toISOString() }
  const { error } = id
    ? await supabase.from('announcements').update(values).eq('id', id)
    : await supabase.from('announcements').insert(values)

  if (error) {
    console.error('Saving announcement failed', error.code)
    return { error: 'Could not save the announcement. Please try again.' }
  }

  await logActivity(user, id ? 'announcement.update' : 'announcement.create', 'Announcement', message.slice(0, 80))
  refreshPublicSite()
  redirect('/admin/announcements?saved=1')
}

export async function toggleAnnouncement(formData: FormData) {
  const { supabase, user } = await requireAdmin()
  const id = text(formData, 'id')
  const activate = formData.get('activate') === 'true'
  if (!id) return

  if (activate) await supabase.from('announcements').update({ is_active: false }).eq('is_active', true)
  await supabase.from('announcements').update({ is_active: activate, updated_at: new Date().toISOString() }).eq('id', id)
  await logActivity(user, activate ? 'announcement.activate' : 'announcement.deactivate', 'Announcement', id)
  refreshPublicSite()
}

export async function deleteAnnouncement(formData: FormData) {
  const { supabase, user } = await requireAdmin()
  const id = text(formData, 'id')
  if (!id) return
  await supabase.from('announcements').delete().eq('id', id)
  await logActivity(user, 'announcement.delete', 'Announcement', id)
  refreshPublicSite()
  redirect('/admin/announcements')
}

/* ---------- Impact stats ---------- */

export async function saveImpactStats(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const { supabase, user } = await requireAdmin()

  const ids = formData.getAll('id').map(String)
  const labels = formData.getAll('label').map((v) => String(v).trim())
  const values = formData.getAll('value').map((v) => Number(v))
  const suffixes = formData.getAll('suffix').map((v) => String(v).trim())

  for (let i = 0; i < ids.length; i++) {
    if (labels[i].length < 2 || labels[i].length > 80) return { error: `Stat ${i + 1}: label must be between 2 and 80 characters.` }
    if (!Number.isInteger(values[i]) || values[i] < 0 || values[i] > 100_000_000) return { error: `Stat ${i + 1}: value must be a whole number of 0 or more.` }
    if (suffixes[i].length > 4) return { error: `Stat ${i + 1}: suffix must be 4 characters or fewer.` }
  }

  const now = new Date().toISOString()
  const results = await Promise.all(
    ids.map((id, i) =>
      supabase.from('impact_stats').update({ label: labels[i], value: values[i], suffix: suffixes[i], sort_order: i + 1, updated_at: now }).eq('id', id),
    ),
  )
  if (results.some((result) => result.error)) return { error: 'Some stats could not be saved. Please try again.' }

  await logActivity(user, 'stats.update', 'Impact stats', `${ids.length} stats saved`)
  refreshPublicSite()
  return { success: 'Impact stats updated. The homepage now shows the new figures.' }
}

export async function addImpactStat() {
  const { supabase, user } = await requireAdmin()
  const { count } = await supabase.from('impact_stats').select('id', { count: 'exact', head: true })
  await supabase.from('impact_stats').insert({ label: 'New stat', value: 0, suffix: '', sort_order: (count ?? 0) + 1 })
  await logActivity(user, 'stats.add', 'Impact stat')
  refreshPublicSite()
}

export async function deleteImpactStat(formData: FormData) {
  const { supabase, user } = await requireAdmin()
  const id = text(formData, 'id')
  if (!id) return
  await supabase.from('impact_stats').delete().eq('id', id)
  await logActivity(user, 'stats.delete', 'Impact stat', id)
  refreshPublicSite()
}

/* ---------- Admin accounts ---------- */

export async function addAdmin(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const { user } = await requireAdmin()

  const email = text(formData, 'email').toLowerCase()
  const password = String(formData.get('password') ?? '')
  if (!EMAIL_PATTERN.test(email)) return { error: 'Enter a valid email address.' }
  if (password.length < 8) return { error: 'Temporary password must be at least 8 characters.' }

  const service = createServiceClient()
  const { data, error } = await service.auth.admin.createUser({ email, password, email_confirm: true })
  if (error || !data.user) return { error: 'Could not create this admin. The email may already be registered.' }

  const { error: adminError } = await service.from('admin_users').insert({ user_id: data.user.id, email })
  if (adminError) return { error: 'Account created, but admin access could not be granted.' }

  await logActivity(user, 'admin.add', 'Admin account', email)
  revalidatePath('/admin/admins')
  return { success: `${email} can now sign in at /admin with the temporary password.` }
}

export async function removeAdmin(formData: FormData) {
  const { user } = await requireAdmin()
  const userId = text(formData, 'user_id')
  if (!userId || userId === user.id) return

  const service = createServiceClient()
  const { data: target } = await service.from('admin_users').select('email').eq('user_id', userId).maybeSingle()
  await service.from('admin_users').delete().eq('user_id', userId)
  await logActivity(user, 'admin.remove', 'Admin account', target?.email ?? userId)
  revalidatePath('/admin/admins')
}
