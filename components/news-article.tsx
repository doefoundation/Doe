import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { MarkdownContent } from '@/components/markdown-content'
import { formatDate, type NewsPost } from '@/lib/cms-types'

type ArticleData = Pick<NewsPost, 'title' | 'excerpt' | 'content' | 'category' | 'cover_image_url' | 'published_at'>

export function NewsArticle({ post, showBackLink = true }: { post: ArticleData; showBackLink?: boolean }) {
  return (
    <article className="mx-auto max-w-[820px] px-5 py-14 sm:px-8 sm:py-20">
      {showBackLink && (
        <Link href="/news" className="inline-flex items-center gap-2 text-sm font-semibold text-[#1a1917]/70 hover:text-[#d70063]">
          <ArrowLeft size={16} aria-hidden="true" /> All news
        </Link>
      )}
      <p className={`${showBackLink ? 'mt-10' : ''} text-[11px] font-semibold uppercase tracking-[0.2em] text-[#d70063]`}>
        {post.category}
        {post.published_at && (
          <span className="text-[#1a1917]/45"> · <time dateTime={post.published_at}>{formatDate(post.published_at)}</time></span>
        )}
      </p>
      <h1 className="mt-4 font-serif text-[clamp(2.5rem,6vw,4.5rem)] leading-[1.02] tracking-[-0.05em] text-balance">{post.title || 'Untitled article'}</h1>
      {post.excerpt && <p className="mt-6 text-xl leading-relaxed text-[#1a1917]/70">{post.excerpt}</p>}
      {post.cover_image_url && <img src={post.cover_image_url} alt="" className="mt-10 aspect-[16/9] w-full rounded-2xl object-cover" />}
      <div className="mt-10">
        <MarkdownContent source={post.content} />
      </div>
    </article>
  )
      }
