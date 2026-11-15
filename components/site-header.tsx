'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, Search, X } from 'lucide-react'

const logoUrl = 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/file_00000000ebbc8243b1a46e16cc7df432-Ey2WCQZAaBoXSQKqIEQgRVc2ePrSvh.png'

const siteLinks = [
  { label: 'Home', href: '/' },
  { label: 'Programs', href: '/programs' },
  { label: 'Our Team', href: '/our-team' },
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Volunteer', href: 'mailto:hello@doefoundation.org?subject=Volunteering%20with%20DOE%20Foundation' },
  { label: 'Donate', href: 'mailto:hello@doefoundation.org?subject=Supporting%20DOE%20Foundation' },
  { label: 'Contact Us', href: 'mailto:hello@doefoundation.org' },
  { label: 'News Content', href: '/#testimonials' },
  { label: 'Cookie Policy', href: '/cookie-policy' },
]

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')

  return (
    <header className="relative z-20 border-b border-[#1a1917]/12 bg-[#f8f5ef]/95 px-5 backdrop-blur-sm sm:px-8">
      <div className="mx-auto flex h-[92px] max-w-[1360px] items-center justify-between sm:h-[108px]">
        <Link href="/" aria-label="DOE Foundation home" className="flex items-center justify-center">
          <img src={logoUrl} alt="DOE Foundation" className="h-[90px] w-auto object-contain mix-blend-multiply sm:h-[112px]" />
        </Link>
        <div className="flex items-center gap-1 sm:gap-3">
          <button type="button" aria-label={searchOpen ? 'Close search' : 'Open search'} aria-expanded={searchOpen} onClick={() => setSearchOpen((open) => !open)} className="flex size-12 items-center justify-center rounded-full bg-[#f1c6d7]/45 text-[#1a1917] transition-colors hover:bg-[#f1c6d7] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d70063]">
            {searchOpen ? <X size={24} strokeWidth={2.5} /> : <Search size={24} strokeWidth={2.5} />}
          </button>
          <button type="button" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} aria-controls="site-main-menu" onClick={() => setMenuOpen((open) => !open)} className="flex size-12 items-center justify-center rounded-full bg-[#f1c6d7]/45 text-[#1a1917] transition-colors hover:bg-[#f1c6d7] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d70063]">
            {menuOpen ? <X size={24} strokeWidth={2.5} /> : <Menu size={25} strokeWidth={2.5} />}
          </button>
        </div>
      </div>
      {searchOpen && (
        <form action="/" role="search" className="mx-auto flex max-w-[1360px] items-center gap-3 border-t border-[#1a1917]/10 py-4">
          <label htmlFor="site-search" className="sr-only">Search DOE Foundation</label>
          <Search size={19} strokeWidth={1.6} aria-hidden="true" />
          <input id="site-search" name="q" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search our work, stories, and resources" className="w-full bg-transparent text-base outline-none placeholder:text-[#1a1917]/50" />
          <button type="submit" className="rounded-full bg-[#d70063] px-4 py-2 text-sm font-semibold text-white">Search</button>
        </form>
      )}
      {menuOpen && (
        <nav id="site-main-menu" aria-label="Main navigation" className="mx-auto max-w-[1360px] border-t border-[#1a1917]/10 py-6">
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#d70063]">Explore DOE Foundation</p>
          <ul className="grid gap-x-8 gap-y-1 sm:grid-cols-2 lg:grid-cols-4">
            {siteLinks.map((item) => (
              <li key={item.label}>
                <Link href={item.href} scroll onClick={() => setMenuOpen(false)} className="flex min-h-12 items-center border-b border-[#1a1917]/10 py-3 text-base font-medium text-[#1a1917] transition-colors hover:text-[#d70063] focus-visible:outline-2 focus-visible:outline-[#d70063]">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  )
}
