import { createClient } from '@/lib/supabase/server'
import { fallbackImpactStats, type ImpactStat, type NewsPost } from '@/lib/cms-types'

const newsColumns = 'id, title, slug, excerpt, content, category, cover_image_url, status, published_at, created_at, updated_at'

export async function getImpactStats(): Promise<ImpactStat[]> {
  const supabase = await createClient()
  const { data, error } = await supabase.from('impact_stats').select('id, label, value, suffix, sort_order').order('sort_order')
  if (error || !data?.length) return fallbackImpactStats
  return data
}

export async function getPublishedNews(limit?: number): Promise<NewsPost[]> {
  const supabase = await createClient()
  let query = supabase
    .from('news_posts')
    .select(newsColumns)
    .eq('status', 'published')
    .lte('published_at', new Date().toISOString())
    .order('published_at', { ascending: false })
  if (limit) query = query.limit(limit)
  const { data, error } = await query
  if (error) return []
  return data as NewsPost[]
}

export async function getPublishedNewsBySlug(slug: string): Promise<NewsPost | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('news_posts')
    .select(newsColumns)
    .eq('slug', slug)
    .eq('status', 'published')
    .lte('published_at', new Date().toISOString())
    .maybeSingle()
  return (data as NewsPost | null) ?? null
}
