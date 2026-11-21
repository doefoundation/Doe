import type { Metadata } from 'next'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { NewsCard } from '@/components/news-card'
import { getPublishedNews } from '@/lib/cms'

export const metadata: Metadata = {
  title: 'News & Updates | DOE Foundation',
  description: 'The latest stories, events, and announcements from the Davida Omosomi Empowerment Foundation.',
}

export default async function NewsRoute() {
  const posts = await getPublishedNews()

  return (
    <main className="min-h-screen bg-[#f8f5ef] text-[#1a1917]">
      <SiteHeader />
      <section className="mx-auto max-w-[1360px] px-5 py-16 sm:px-8 sm:py-24">
        <p className="mb-6 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#d70063]">
          <span className="h-px w-8 bg-[#d70063]" />Stories from the field
        </p>
        <h1 className="font-serif text-[clamp(3.2rem,7vw,6rem)] leading-[.95] tracking-[-0.06em]">
          News & <em className="font-normal text-[#d70063]">updates.</em>
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-[#1a1917]/70">
          Follow our debate competitions, school outreach, scholarships, and the young leaders shaping their communities.
        </p>

        {posts.length ? (
          <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <li key={post.id} className="relative">
                <NewsCard post={post} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-14 rounded-2xl border border-dashed border-[#1a1917]/20 px-6 py-16 text-center">
            <p className="font-serif text-2xl">No stories yet.</p>
            <p className="mt-2 text-[#1a1917]/60">Check back soon for news from DOE Foundation.</p>
          </div>
        )}
      </section>
      <SiteFooter />
    </main>
  )
}
