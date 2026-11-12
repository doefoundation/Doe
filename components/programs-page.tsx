'use client'

import Link from 'next/link'
import { ArrowLeft, ArrowUpRight, Check, Menu, Search, X } from 'lucide-react'
import { useState } from 'react'
import { programs } from '@/lib/programs'

const logoUrl = 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/file_00000000ebbc8243b1a46e16cc7df432-Ey2WCQZAaBoXSQKqIEQgRVc2ePrSvh.png'

export function ProgramsPage() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <main className="min-h-screen bg-[#f8f5ef] text-[#1a1917]">
      <header className="border-b border-[#1a1917]/12 bg-[#f8f5ef]/95 px-5 backdrop-blur-sm sm:px-8">
        <div className="mx-auto flex h-[92px] max-w-[1360px] items-center justify-between sm:h-[108px]">
          <Link href="/" aria-label="DOE Foundation home"><img src={logoUrl} alt="DOE Foundation" className="h-[90px] w-auto object-contain mix-blend-multiply sm:h-[112px]" /></Link>
          <div className="flex items-center gap-1 sm:gap-3">
            <button type="button" aria-label={searchOpen ? 'Close search' : 'Open search'} aria-expanded={searchOpen} onClick={() => setSearchOpen((open) => !open)} className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f1c6d7]/45 text-[#1a1917] transition-colors hover:bg-[#f1c6d7] focus-visible:outline-2 focus-visible:outline-[#d70063]">{searchOpen ? <X size={24} strokeWidth={2.5} /> : <Search size={24} strokeWidth={2.5} />}</button>
            <button type="button" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)} className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f1c6d7]/45 text-[#1a1917] transition-colors hover:bg-[#f1c6d7] focus-visible:outline-2 focus-visible:outline-[#d70063]">{menuOpen ? <X size={24} strokeWidth={2.5} /> : <Menu size={25} strokeWidth={2.5} />}</button>
          </div>
        </div>
        {menuOpen && <nav aria-label="Main navigation" className="mx-auto max-w-[1360px] border-t border-[#1a1917]/10 py-6"><ul className="grid gap-1 sm:grid-cols-4">{['Our work', 'Who we are', 'Get involved', 'Stories'].map((item) => <li key={item}><Link href={item === 'Our work' ? '#programs' : `/#${item.toLowerCase().replaceAll(' ', '-')}`} onClick={() => setMenuOpen(false)} className="flex items-center justify-between border-b border-[#1a1917]/10 py-3 text-lg hover:text-[#d70063]">{item}<ArrowUpRight size={18} /></Link></li>)}</ul></nav>}
        {searchOpen && <div className="mx-auto max-w-[1360px] border-t border-[#1a1917]/10 py-4"><label htmlFor="program-search" className="sr-only">Search programs</label><div className="flex items-center gap-3 border-b border-[#1a1917]/35 pb-2"><Search size={19} /><input id="program-search" autoFocus placeholder="Search our programs" className="w-full bg-transparent text-base outline-none placeholder:text-[#1a1917]/50" /></div></div>}
      </header>

      <section className="mx-auto max-w-[1360px] px-5 pb-16 pt-12 sm:px-8 sm:pb-24 sm:pt-20">
        <Link href="/" className="mb-12 inline-flex items-center gap-2 text-sm font-semibold hover:text-[#d70063]"><ArrowLeft size={17} /> Back to home</Link>
        <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:items-end"><div><p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#d70063]">Our programs</p><h1 className="max-w-2xl font-serif text-6xl leading-[.88] tracking-[-0.07em] sm:text-8xl">Small beginnings.<br /><em className="font-normal text-[#d70063]">Limitless potential.</em></h1></div><p className="max-w-xl text-lg leading-relaxed text-[#1a1917]/70 sm:text-xl">Our programs connect education, leadership and practical support to create opportunities for children and young people.</p></div>
        <div id="programs" className="mt-16 border-t border-[#1a1917]/20">{programs.map((program) => <article key={program.name} className="grid gap-8 border-b border-[#1a1917]/15 py-10 sm:py-14 lg:grid-cols-[.25fr_1fr_1fr] lg:items-center lg:gap-12"><div><span className="text-xs font-semibold tracking-[0.18em] text-[#d70063]">{program.number}</span><h2 className="mt-3 font-serif text-4xl tracking-[-0.04em] sm:text-5xl">{program.name}</h2></div><div><p className="max-w-md text-base leading-relaxed text-[#1a1917]/70">{program.shortDescription}</p><ul className="mt-6 grid gap-2">{program.outcomes.map((outcome) => <li key={outcome} className="flex items-center gap-2 text-sm text-[#1a1917]/65"><Check size={15} className="text-[#d70063]" />{outcome}</li>)}</ul></div><div className="relative aspect-[4/3] overflow-hidden rounded-[80px_18px_18px_18px] bg-[#e9e3d9]"><img src={program.image} alt={program.alt} className="h-full w-full object-cover transition-transform duration-500 hover:scale-105" /><div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#1a1917]/75 to-transparent p-5 pt-12"><Link href="/programs" className="inline-flex items-center gap-2 text-sm font-semibold text-white hover:text-[#f1c6d7]">Discover the program <ArrowUpRight size={17} /></Link></div></div></article>)}</div>
      </section>
      <footer className="bg-[#1a1917] px-5 py-10 text-center text-white sm:px-8 sm:py-12"><div className="mx-auto flex max-w-[1360px] flex-col items-center gap-3"><p className="text-sm font-medium text-white/85 sm:text-base">©2026 The Davida Omosomi Empowerment Foundation</p><p className="text-xs leading-relaxed text-white/55 sm:text-sm">Registered as an Incorporated Trustee in Nigeria</p><p className="mt-2 text-xs text-white/65">Made with <span role="img" aria-label="love">❤️</span> by CJ</p><Link href="/" className="mt-2 text-xs uppercase tracking-[0.14em] text-white/60 hover:text-white">Return home</Link></div></footer>
    </main>
  )
}
