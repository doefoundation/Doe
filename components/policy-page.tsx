import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'

export function PolicyPage({ type }: { type: 'privacy' | 'cookies' }) {
  const isPrivacy = type === 'privacy'
  const title = isPrivacy ? 'Privacy Policy' : 'Cookie Policy'

  return (
    <main className="min-h-screen bg-[#f8f5ef] text-[#1a1917]">
      <SiteHeader />
      <section className="mx-auto min-h-[55vh] max-w-[1000px] px-5 py-16 sm:px-8 sm:py-24">
        <p className="mt-12 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#d70063]">DOE Foundation</p>
        <h1 className="mt-4 font-serif text-6xl leading-[.92] tracking-[-0.06em] sm:text-8xl">{title}</h1>
        <div className="mt-8 max-w-2xl border-t border-[#1a1917]/15 pt-7 text-base leading-relaxed text-[#1a1917]/70 sm:text-lg">
          <p>The DOE Foundation is preparing this policy information for publication. For current questions about {isPrivacy ? 'how we handle information you share with us' : 'cookies and similar technologies on this website'}, please contact our team.</p>
          <a href="mailto:hello@doefoundation.org" className="mt-6 inline-flex font-semibold text-[#d70063] underline decoration-[#d70063]/40 underline-offset-4 hover:decoration-[#d70063]">hello@doefoundation.org</a>
        </div>
      </section>
      <SiteFooter />
    </main>
  )
}
