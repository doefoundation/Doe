import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { formatDate, type NewsPost } from '@/lib/cms-types'

export function NewsCard({ post }: { post: NewsPost }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#1a1917]/10 bg-white">
      <div className="relative aspect-[16/10] overflow-hidden bg-[#e9e3d9]">
        {post.cover_image_url ? (
        <>
  <img src={post.cover_image_url} alt="" aria-hidden="true" loading="lazy" className="absolute inset-0 h-full w-full scale-110 object-cover opacity-80 blur-2xl" />
  <img src={post.cover_image_url} alt="" loading="lazy" className="relative h-full w-full object-contain transition-transform duration-500 group-hover:scale-105" />
</>  
        ) : (
          <div className="flex h-full items-center justify-center font-serif text-4xl italic text-[#d70063]/40" aria-hidden="true">DOE</div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#d70063]">
          {post.category}
          <span className="text-[#1a1917]/45"> · <time dateTime={post.published_at ?? undefined}>{formatDate(post.published_at)}</time></span>
        </p>
        <h3 className="mt-3 font-serif text-2xl leading-tight tracking-[-0.02em] text-pretty">
          <Link href={`/news/${post.slug}`} className="after:absolute after:inset-0 focus-visible:outline-2 focus-visible:outline-[#d70063]">
            {post.title}
          </Link>
        </h3>
        {post.excerpt && <p className="mt-3 line-clamp-3 leading-relaxed text-[#1a1917]/65">{post.excerpt}</p>}
        <span className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-semibold transition-colors group-hover:text-[#d70063]">
          Read story <ArrowUpRight size={16} aria-hidden="true" />
        </span>
      </div>
    </article>
  )
}
