import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight, Check } from 'lucide-react'
import { programs } from '@/lib/programs'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'

export function ProgramsPage() {
  return (
    <main className="min-h-screen bg-[#f8f5ef] text-[#1a1917]">
      <SiteHeader />

      <section className="mx-auto max-w-[1360px] px-5 pb-16 pt-12 sm:px-8 sm:pb-24 sm:pt-20">
        <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:items-end"><div><p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#d70063]">Our programs</p><h1 className="max-w-2xl font-serif text-6xl leading-[.88] tracking-[-0.07em] sm:text-8xl">Small beginnings.<br /><em className="font-normal text-[#d70063]">Limitless potential.</em></h1></div><p className="max-w-xl text-lg leading-relaxed text-[#1a1917]/70 sm:text-xl">Our programs connect education, leadership and practical support to create opportunities for children and young people.</p></div>
        <div id="programs" className="mt-16 border-t border-[#1a1917]/20">{programs.map((program) => <article key={program.name} className="grid gap-8 border-b border-[#1a1917]/15 py-10 sm:py-14 lg:grid-cols-[.25fr_1fr_1fr] lg:items-center lg:gap-12"><div><span className="text-xs font-semibold tracking-[0.18em] text-[#d70063]">{program.number}</span><h2 className="mt-3 font-serif text-4xl tracking-[-0.04em] sm:text-5xl">{program.name}</h2></div><div><p className="max-w-md text-base leading-relaxed text-[#1a1917]/70">{program.shortDescription}</p><ul className="mt-6 grid gap-2">{program.outcomes.map((outcome) => <li key={outcome} className="flex items-center gap-2 text-sm text-[#1a1917]/65"><Check size={15} className="text-[#d70063]" />{outcome}</li>)}</ul></div><div className="relative aspect-[4/3] overflow-hidden rounded-[80px_18px_18px_18px] bg-[#e9e3d9]"><Image src={program.image} alt={program.alt} fill sizes="(max-width: 1023px) calc(100vw - 2.5rem), 33vw" quality={75} loading="lazy" className="object-cover transition-transform duration-500 hover:scale-105" /><div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#1a1917]/75 to-transparent p-5 pt-12"><Link href="/programs" scroll className="inline-flex items-center gap-2 text-sm font-semibold text-white hover:text-[#f1c6d7]">Discover the program <ArrowUpRight size={17} /></Link></div></div></article>)}</div>
      </section>
      <SiteFooter />
    </main>
  )
}
