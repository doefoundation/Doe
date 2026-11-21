import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { NewsArticle } from '@/components/news-article'
import { getPublishedNewsBySlug } from '@/lib/cms'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getPublishedNewsBySlug(slug)
  if (!post) return { title: 'Story not found | DOE Foundation' }
  return {
    title: `${post.title} | DOE Foundation`,
    description: post.excerpt || undefined,
    openGraph: { title: post.title, description: post.excerpt || undefined, images: post.cover_image_url ? [post.cover_image_url] : undefined },
  }
}

export default async function NewsArticleRoute({ params }: Props) {
  const { slug } = await params
  const post = await getPublishedNewsBySlug(slug)
  if (!post) notFound()

  return (
    <main className="min-h-screen bg-[#f8f5ef] text-[#1a1917]">
      <SiteHeader />
      <NewsArticle post={post} />
      <SiteFooter />
    </main>
  )
    }
