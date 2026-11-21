export type NewsStatus = 'draft' | 'published'

export type NewsPost = {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  category: string
  cover_image_url: string | null
  status: NewsStatus
  published_at: string | null
  created_at: string
  updated_at: string
}

export type Announcement = {
  id: string
  message: string
  link_label: string | null
  link_url: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export type ImpactStat = {
  id: string
  label: string
  value: number
  suffix: string
  sort_order: number
}

export type ActionState = { error?: string; success?: string } | null

export const fallbackImpactStats: ImpactStat[] = [
  { id: 'students', label: 'Students empowered through debates', value: 1200, suffix: '+', sort_order: 1 },
  { id: 'schools', label: 'Schools reached', value: 76, suffix: '', sort_order: 2 },
  { id: 'scholarships', label: 'Scholarships disbursed', value: 150, suffix: '', sort_order: 3 },
  { id: 'competitions', label: 'Competitions (international & local)', value: 7, suffix: '', sort_order: 4 },
]

export function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
    .replace(/-+$/g, '')
}

export function formatDate(iso: string | null) {
  if (!iso) return ''
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Africa/Lagos' }).format(new Date(iso))
}
