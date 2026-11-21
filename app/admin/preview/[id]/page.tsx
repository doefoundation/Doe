import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ExternalLink, Eye } from 'lucide-react'
import { requireAdmin } from '@/lib/admin-auth'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { NewsArticle } from '@/components/news-article'
import { formatDate, type NewsPost } from '@/lib/cms-types'

export default async function PreviewArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound()

  const { supabase } = await requireAdmin()
  const { data } = await supabase
    .from('news_posts')
    .select('id, title, slug, excerpt, content, category, cover_image_url, status, published_at, created_at, updated_at')
    .eq('id', id)
    .maybeSingle()
  if (!data) notFound()
  const post = data as NewsPost

  const scheduled = post.status === 'published' && post.published_at !== null && new Date(post.published_at).getTime() > Date.now()
  const live = post.status === 'published' && !scheduled
  const label = post.status === 'draft' ? 'Draft — not visible to the public' : scheduled ? `Scheduled — goes live ${formatDate(post.published_at)}` : 'Published — live on the website'

  return (
    <main className="min-h-screen bg-[#f8f5ef] text-[#1a1917]">
      <div className="sticky top-0 z-50 flex flex-wrap items-center justify-between gap-3 bg-[#1a1917] px-5 py-3 text-sm text-white sm:px-8">
        <p className="flex items-center gap-2 font-medium">
          <Eye size={16} aria-hidden="true" className="text-[#ff5fa8]" />
          <span><span className="font-semibold">Preview</span> · {label}</span>
        </p>
        <div className="flex items-center gap-4">
          {live && (
            <Link href={`/news/${post.slug}`} target="_blank" className="inline-flex items-center gap-1.5 font-semibold text-white/80 hover:text-white">
              View live <ExternalLink size={14} aria-hidden="true" />
            </Link>
          )}
          <Link href={`/admin/news/${post.id}`} className="inline-flex items-center gap-1.5 rounded-full bg-[#d70063] px-4 py-1.5 font-semibold hover:bg-[#b80055]">
            <ArrowLeft size={14} aria-hidden="true" /> Back to editor
          </Link>
        </div>
      </div>
      <SiteHeader />
      <NewsArticle post={post} showBackLink={false} />
      <SiteFooter />
    </main>
  )
    }
