import type { Metadata } from 'next'
import Link from 'next/link'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'

// A friendly 404 page. "noindex" keeps missing pages out of search results.
export const metadata: Metadata = {
  title: 'Page not found | DOE Foundation',
  robots: { index: false, follow: true },
}

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#f8f5ef] text-[#1a1917]">
      <SiteHeader />
      <section className="mx-auto max-w-[1360px] px-5 py-24 sm:px-8 sm:py-32">
        <p className="mb-6 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#d70063]">
          <span className="h-px w-8 bg-[#d70063]" />Error 404
        </p>
        <h1 className="font-serif text-[clamp(3rem,7vw,5.5rem)] leading-[.95] tracking-[-0.06em]">
          We can&apos;t find that <em className="font-normal text-[#d70063]">page.</em>
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-[#1a1917]/70">
          The link may be old or mistyped. Try one of these instead.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          {[
            ['Go to the homepage', '/'],
            ['Read our news', '/news'],
            ['See our programs', '/programs'],
            ['Support our work', '/donate'],
          ].map(([label, href]) => (
            <Link key={href} href={href} className="inline-flex min-h-11 items-center rounded-full border border-[#1a1917]/20 px-6 text-sm font-semibold transition-colors hover:border-[#d70063] hover:text-[#d70063]">
              {label}
            </Link>
          ))}
        </div>
      </section>
      <SiteFooter />
    </main>
  )
}
