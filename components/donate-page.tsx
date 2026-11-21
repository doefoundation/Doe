import Image from 'next/image'
import Link from 'next/link'
import { ArrowDown, ArrowRight, ArrowUpRight, HandHeart, Users } from 'lucide-react'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { CopyAccountButton } from '@/components/copy-account-button'
import { programs } from '@/lib/programs'

const debateProgram = programs[1]

const sponsorships = [
  {
    amount: '₦150,000',
    title: 'Sponsor one student',
    description: 'Give one learner a full academic year of debate training, practice, and the confidence to speak up.',
    icon: Users,
  },
  {
    amount: '₦1,000,000',
    title: 'Sponsor a debate club',
    description: 'Help establish a lasting club where students can keep learning, questioning, and growing together.',
    icon: HandHeart,
  },
]

export function DonatePage() {
  return (
    <main className="min-h-screen bg-[#f8f5ef] text-[#1a1917]">
      <SiteHeader />

      <section className="mx-auto grid max-w-[1360px] gap-10 px-5 pb-16 pt-12 sm:px-8 sm:pb-24 sm:pt-20 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:gap-16">
        <div>
          <p className="mb-5 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#d70063]"><span className="h-px w-8 bg-[#d70063]" />Give a young person a voice</p>
          <h1 className="max-w-3xl font-serif text-6xl leading-[.9] tracking-[-0.07em] sm:text-8xl">Sponsor a <em className="font-normal text-[#d70063]">Debate Club.</em></h1>
          <p className="mt-7 max-w-2xl font-serif text-2xl leading-snug sm:text-3xl">What if the next generation of Nigerian leaders learned to question instead of just memorize?</p>
          <p className="mt-6 max-w-2xl text-[16px] leading-relaxed text-[#1a1917]/75">Across Nigeria, primary and secondary school students are taught through a rigid curriculum that rewards cramming over thinking. In a world that demands creativity, problem-solving and independent judgment, this holds our children back. They deserve to be raised to question the norm, speak with confidence and think for themselves.</p>
          <Link href="#sponsorships" className="mt-8 inline-flex items-center gap-3 rounded-full bg-[#d70063] px-6 py-3.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d70063]">Explore sponsorships <ArrowDown size={17} aria-hidden="true" /></Link>
        </div>
        <div className="relative aspect-[4/3] overflow-hidden rounded-[90px_18px_18px_18px] bg-[#e9e3d9]">
          <Image src={debateProgram.image} alt="Students building confidence through debate and literacy" fill priority sizes="(max-width: 1023px) 100vw, 45vw" quality={80} className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a1917]/75 via-transparent to-transparent" />
          <p className="absolute bottom-6 left-6 right-6 font-serif text-2xl leading-tight text-white sm:bottom-8 sm:left-8 sm:right-8 sm:text-3xl">Critical thinking belongs in every classroom.</p>
        </div>
      </section>

      <section aria-labelledby="impact-heading" className="bg-[#e9e3d9] px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-[1100px]">
          <div className="grid gap-8 sm:grid-cols-[1fr_auto] sm:items-end">
            <div>
              <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#d70063]">The work so far</p>
              <h2 id="impact-heading" className="font-serif text-4xl leading-tight tracking-[-0.05em] sm:text-5xl">An impact that <em className="font-normal text-[#d70063]">keeps growing.</em></h2>
            </div>
            <div className="flex items-end gap-4 border-l-2 border-[#d70063] pl-5">
              <p className="font-serif text-6xl leading-none tracking-[-0.06em] text-[#d70063] sm:text-7xl">76+</p>
              <p className="max-w-[180px] pb-1 text-sm font-semibold leading-relaxed text-[#1a1917]/70">schools reached with free debate workshops and competitions in 2026</p>
            </div>
          </div>
          <div className="mt-12 grid gap-6 border-t border-[#1a1917]/15 pt-8 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#d70063]">Where we&apos;re going</p>
              <p className="mt-3 max-w-3xl text-[16px] leading-relaxed text-[#1a1917]/75">In 2027, we want to make that impact last. We will build permanent debate clubs in underserved schools, with a goal of 50 clubs across Nigeria, so that critical thinking becomes part of school life rather than a one-off event.</p>
            </div>
            <div className="rounded-2xl bg-[#f8f5ef] px-6 py-5 text-center">
              <p className="font-serif text-5xl leading-none text-[#d70063]">50</p>
              <p className="mt-2 text-xs font-semibold uppercase tracking-[0.15em] text-[#1a1917]/60">Clubs by 2027</p>
            </div>
          </div>
        </div>
      </section>

      <section id="sponsorships" aria-labelledby="sponsorships-heading" className="mx-auto max-w-[1200px] px-5 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#d70063]">Your support creates opportunity</p>
          <h2 id="sponsorships-heading" className="font-serif text-5xl leading-[.95] tracking-[-0.05em] sm:text-6xl">Choose how you&apos;ll <em className="font-normal text-[#d70063]">make a difference.</em></h2>
          <p className="mt-5 text-[16px] leading-relaxed text-[#1a1917]/70">Your gift gives a child a voice, and gives a school a lasting platform for confident thinkers and communicators.</p>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {sponsorships.map(({ amount, title, description, icon: Icon }) => (
            <article key={title} className="rounded-[28px] border border-[#1a1917]/10 bg-white/70 p-7 shadow-[0_20px_50px_-42px_rgba(26,25,23,.4)] sm:p-9">
              <span className="flex size-12 items-center justify-center rounded-full bg-[#f1c6d7]/45 text-[#d70063]"><Icon size={22} strokeWidth={1.8} aria-hidden="true" /></span>
              <p className="mt-7 font-serif text-4xl tracking-[-0.04em] text-[#d70063] sm:text-5xl">{amount}</p>
              <h3 className="mt-2 font-serif text-2xl sm:text-3xl">{title}</h3>
              <p className="mt-3 min-h-[3.5rem] text-[15px] leading-relaxed text-[#1a1917]/70">{description}</p>
              <Link href="#bank-transfer" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#1a1917] transition-colors hover:text-[#d70063]">Sponsor now <ArrowRight size={17} aria-hidden="true" /></Link>
            </article>
          ))}
        </div>
      </section>

      <section id="bank-transfer" aria-labelledby="bank-heading" className="bg-[#1a1917] px-5 py-16 text-white sm:px-8 sm:py-20">
        <div className="mx-auto grid max-w-[1100px] gap-10 lg:grid-cols-[.9fr_1.1fr] lg:items-center lg:gap-16">
          <div>
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#f1a4c3]">Make your gift</p>
            <h2 id="bank-heading" className="font-serif text-5xl leading-[.95] tracking-[-0.05em] sm:text-6xl">Sponsor a student or a club today.</h2>
            <p className="mt-5 max-w-lg text-[16px] leading-relaxed text-white/75">Help us raise a generation that thinks boldly.</p>
          </div>
          <div className="rounded-[28px] border border-white/10 bg-white/[0.06] p-6 sm:p-9">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#f1a4c3]">Bank transfer</p>
            <dl className="mt-6 grid gap-5">
              <div><dt className="text-xs uppercase tracking-[0.15em] text-white/55">Bank</dt><dd className="mt-1 text-lg font-semibold">United Bank of Africa</dd></div>
              <div><dt className="text-xs uppercase tracking-[0.15em] text-white/55">Account name</dt><dd className="mt-1 text-lg font-semibold">The Davida Omosomi Empowerment Foundation</dd></div>
              <div className="flex flex-wrap items-end justify-between gap-4 border-t border-white/10 pt-5">
                <div><dt className="text-xs uppercase tracking-[0.15em] text-white/55">Account number</dt><dd className="mt-1 font-mono text-3xl font-semibold tracking-[0.08em] sm:text-4xl">1029860127</dd></div>
                <CopyAccountButton />
              </div>
            </dl>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1100px] px-5 py-14 text-center sm:px-8 sm:py-16">
        <p className="text-[15px] leading-relaxed text-[#1a1917]/70">For partnerships, call <a href="tel:+2349066555162" className="font-semibold text-[#1a1917] underline underline-offset-4">+234 906 655 5162</a> or email <a href="mailto:info@thedoefoundation.com" className="font-semibold text-[#d70063] underline underline-offset-4">info@thedoefoundation.com</a>.</p>
      </section>

      <SiteFooter />
    </main>
  )
}
