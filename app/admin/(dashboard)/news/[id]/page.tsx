import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { requireAdmin } from '@/lib/admin-auth'
import { PageHeading } from '@/components/admin/admin-shell'
import { NewsForm } from '@/components/admin/news-form'
import type { NewsPost } from '@/lib/cms-types'

export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound()

  const { supabase } = await requireAdmin()
  const { data: post } = await supabase
    .from('news_posts')
    .select('id, title, slug, excerpt, content, category, cover_image_url, status, published_at, created_at, updated_at')
    .eq('id', id)
    .maybeSingle()
  if (!post) notFound()

  return (
    <>
      <Link href="/admin/news" className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-[#1a1917]/60 hover:text-[#d70063]">
        <ArrowLeft size={16} aria-hidden="true" /> All articles
      </Link>
      <PageHeading eyebrow="News" title="Edit article" />
      <NewsForm post={post as NewsPost} />
    </>
  )
}
