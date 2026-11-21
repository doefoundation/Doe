import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { NewsCard } from '@/components/news-card'
import type { NewsPost } from '@/lib/cms-types'

export function LatestNews({ posts }: { posts: NewsPost[] }) {
  if (!posts.length) return null

  return (
    <section id="latest-news" aria-labelledby="latest-news-heading" className="bg-[#f8f5ef] px-5 py-16 sm:px-8 sm:py-24">
      <div className="mx-auto max-w-[1360px]">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#d70063]">News & updates</p>
            <h2 id="latest-news-heading" className="font-serif text-5xl leading-[.95] tracking-[-0.05em] sm:text-6xl">
              Latest from <em className="font-normal text-[#d70063]">DOE.</em>
            </h2>
          </div>
          <Link href="/news" className="inline-flex w-fit items-center gap-2 rounded-full border border-[#1a1917]/20 px-5 py-3 text-sm font-semibold transition-colors hover:border-[#d70063] hover:text-[#d70063]">
            View all news <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </div>
        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <li key={post.id} className="relative">
              <NewsCard post={post} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
