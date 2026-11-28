import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { MarkdownContent } from '@/components/markdown-content'
import { ShareButtons, ShareIconBar } from '@/components/share-buttons'
import { formatDate, type NewsPost } from '@/lib/cms-types'

type ArticleData = Pick<NewsPost, 'title' | 'excerpt' | 'content' | 'category' | 'cover_image_url' | 'published_at'>

export function NewsArticle({ post, showBackLink = true, shareUrl }: { post: ArticleData; showBackLink?: boolean; shareUrl?: string }) {
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
      <h1 className="mt-5 break-words font-serif text-[clamp(2rem,5.2vw,3.25rem)] font-normal leading-[1.18] tracking-[-0.015em]">
        {post.title || 'Untitled article'}
      </h1>
      {post.excerpt && <p className="mt-6 text-lg leading-8 text-[#1a1917]/70 sm:text-xl sm:leading-9">{post.excerpt}</p>}
      {shareUrl && <ShareIconBar url={shareUrl} title={post.title} summary={post.excerpt || undefined} />}
                  {post.cover_image_url && <img src={post.cover_image_url} alt="" className="mt-10 h-auto w-full rounded-2xl" />}
      <div className="mt-12 border-t border-[#1a1917]/10 pt-10">
        <MarkdownContent source={post.content} />
      </div>
      {shareUrl && <ShareButtons url={shareUrl} title={post.title} summary={post.excerpt || undefined} />}
    </article>
  )
}
