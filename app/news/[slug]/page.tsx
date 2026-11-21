import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { getPublishedNewsBySlug } from '@/lib/cms'
import { formatDate } from '@/lib/cms-types'

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

  const paragraphs = post.content.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean)

  return (
    <main className="min-h-screen bg-[#f8f5ef] text-[#1a1917]">
      <SiteHeader />
      <article className="mx-auto max-w-[820px] px-5 py-14 sm:px-8 sm:py-20">
        <Link href="/news" className="inline-flex items-center gap-2 text-sm font-semibold text-[#1a1917]/70 hover:text-[#d70063]">
          <ArrowLeft size={16} aria-hidden="true" /> All news
        </Link>
        <p className="mt-10 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#d70063]">
          {post.category}
          <span className="text-[#1a1917]/45"> · <time dateTime={post.published_at ?? undefined}>{formatDate(post.published_at)}</time></span>
        </p>
        <h1 className="mt-4 font-serif text-[clamp(2.5rem,6vw,4.5rem)] leading-[1.02] tracking-[-0.05em] text-balance">{post.title}</h1>
        {post.excerpt && <p className="mt-6 text-xl leading-relaxed text-[#1a1917]/70">{post.excerpt}</p>}
        {post.cover_image_url && (
          <img src={post.cover_image_url} alt="" className="mt-10 aspect-[16/9] w-full rounded-2xl object-cover" />
        )}
        <div className="mt-10 flex flex-col gap-6 text-lg leading-relaxed text-[#1a1917]/85">
          {paragraphs.map((paragraph, index) => (
            <p key={index} className="whitespace-pre-line">{paragraph}</p>
          ))}
        </div>
      </article>
      <SiteFooter />
    </main>
  )
}
