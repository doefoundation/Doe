import { JsonLd } from '@/components/json-ld'
import { articleJsonLd } from '@/lib/json-ld'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { cache } from 'react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { NewsArticle } from '@/components/news-article'
import { getPublishedNewsBySlug } from '@/lib/cms'
import { SITE_NAME, getSiteUrl, summarize } from '@/lib/site'

type Props = { params: Promise<{ slug: string }> }

// One database lookup per request, shared by the metadata and the page.
const getPost = cache(getPublishedNewsBySlug)

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) return { title: `Story not found | ${SITE_NAME}`, robots: { index: false, follow: false } }

  const description = post.excerpt || summarize(post.content, 200) || undefined
  const path = `/news/${post.slug}`
  const image = post.cover_image_url || '/opengraph-image'

  return {
    title: `${post.title} | ${SITE_NAME}`,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: 'article',
      url: path,
      siteName: SITE_NAME,
      title: post.title,
      description,
      publishedTime: post.published_at ?? undefined,
      modifiedTime: post.updated_at,
      section: post.category,
      images: [{ url: image, alt: post.title }],
    },
    twitter: { card: 'summary_large_image', title: post.title, description, images: [image] },
  }
}

export default async function NewsArticleRoute({ params }: Props) {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) notFound()

  return (
    <main className="min-h-screen bg-[#f8f5ef] text-[#1a1917]">
      <SiteHeader />
      <NewsArticle post={post} shareUrl={`${getSiteUrl()}/news/${post.slug}`} />
      <SiteFooter />
    </main>
  )
}
