'use client'

import Link from 'next/link'
import { useMemo, useState, type FormEvent, type KeyboardEvent } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowUpRight, Menu, Search, X } from 'lucide-react'
import { siteSearchItems, type SiteSearchItem } from '@/lib/site-search'

const logoUrl = 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/file_00000000ebbc8243b1a46e16cc7df432-Ey2WCQZAaBoXSQKqIEQgRVc2ePrSvh.png'

function normalizeSearchText(value: string) {
  return value.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^\p{L}\p{N}]+/gu, ' ').trim()
}

const siteLinks = [
  { label: 'Home', href: '/' },
  { label: 'Programs', href: '/programs' },
  { label: 'Our Team', href: '/our-team' },
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Volunteer', href: 'mailto:hello@doefoundation.org?subject=Volunteering%20with%20DOE%20Foundation' },
  { label: 'Donate', href: '/donate' },
  { label: 'Contact Us', href: 'mailto:hello@doefoundation.org' },
  { label: 'News Content', href: '/#testimonials' },
  { label: 'Cookie Policy', href: '/cookie-policy' },
]

export function SiteHeader() {
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const normalizedQuery = normalizeSearchText(query)
  const searchResults = useMemo(() => {
    if (!normalizedQuery) return siteSearchItems.filter((item) => item.popular).slice(0, 4)

    const terms = normalizedQuery.split(/\s+/)
    return siteSearchItems
      .filter((item) => {
        const searchableText = normalizeSearchText(`${item.title} ${item.description} ${item.keywords.join(' ')}`)
        return terms.every((term) => searchableText.includes(term))
      })
      .sort((first, second) => {
        const firstTitle = normalizeSearchText(first.title)
        const secondTitle = normalizeSearchText(second.title)
        const firstScore = firstTitle.startsWith(normalizedQuery) ? 2 : firstTitle.includes(normalizedQuery) ? 1 : 0
        const secondScore = secondTitle.startsWith(normalizedQuery) ? 2 : secondTitle.includes(normalizedQuery) ? 1 : 0
        return secondScore - firstScore
      })
      .slice(0, 7)
  }, [normalizedQuery])

  function navigateToResult(result: SiteSearchItem) {
    setSearchOpen(false)
    setQuery('')
    if (result.href.startsWith('mailto:')) {
      window.location.href = result.href
      return
    }
    router.push(result.href)
  }

  function handleSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const firstResult = searchResults[0]
    if (firstResult) navigateToResult(firstResult)
  }

  function handleSearchKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key !== 'Enter') return
    if (event.nativeEvent.isComposing || event.keyCode === 229) {
      event.preventDefault()
      return
    }
    event.preventDefault()
    const firstResult = searchResults[0]
    if (firstResult) navigateToResult(firstResult)
  }

  return (
    <header className="relative z-20 border-b border-[#1a1917]/12 bg-[#f8f5ef]/95 px-5 backdrop-blur-sm sm:px-8">
      <div className="mx-auto flex h-[92px] max-w-[1360px] items-center justify-between sm:h-[108px]">
        <Link href="/" aria-label="DOE Foundation home" className="flex items-center justify-center">
          <img src={logoUrl} alt="DOE Foundation" className="h-[90px] w-auto object-contain mix-blend-multiply sm:h-[112px]" />
        </Link>
        <div className="flex items-center gap-1 sm:gap-3">
          <button type="button" aria-label={searchOpen ? 'Close search' : 'Open search'} aria-expanded={searchOpen} aria-controls="site-search-panel" onClick={() => { setSearchOpen((open) => !open); setMenuOpen(false) }} className="flex size-12 items-center justify-center rounded-full bg-[#f1c6d7]/45 text-[#1a1917] transition-colors hover:bg-[#f1c6d7] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d70063]">
            {searchOpen ? <X size={24} strokeWidth={2.5} /> : <Search size={24} strokeWidth={2.5} />}
          </button>
          <button type="button" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} aria-controls="site-main-menu" onClick={() => setMenuOpen((open) => !open)} className="flex size-12 items-center justify-center rounded-full bg-[#f1c6d7]/45 text-[#1a1917] transition-colors hover:bg-[#f1c6d7] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d70063]">
            {menuOpen ? <X size={24} strokeWidth={2.5} /> : <Menu size={25} strokeWidth={2.5} />}
          </button>
        </div>
      </div>
      {searchOpen && (
        <div id="site-search-panel" className="mx-auto max-w-[1360px] border-t border-[#1a1917]/10 py-4">
          <form role="search" onSubmit={handleSearchSubmit} className="flex items-center gap-3 border-b border-[#1a1917]/25 pb-3">
            <label htmlFor="site-search" className="sr-only">Search DOE Foundation</label>
            <Search size={19} strokeWidth={1.6} aria-hidden="true" />
            <input id="site-search" type="search" autoFocus value={query} onChange={(event) => setQuery(event.target.value)} onKeyDown={handleSearchKeyDown} placeholder="Search programs, people, stories, and more" aria-controls="site-search-results" className="w-full bg-transparent text-base outline-none placeholder:text-[#1a1917]/50" />
            <button type="submit" disabled={!searchResults.length} className="rounded-full bg-[#d70063] px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40">Search</button>
          </form>
          <div className="pt-4" aria-live="polite">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#1a1917]/50">{normalizedQuery ? `Results for “${query.trim()}”` : 'Popular destinations'}</p>
            {searchResults.length > 0 ? (
              <ul id="site-search-results" className="grid gap-1 sm:grid-cols-2 lg:grid-cols-3">
                {searchResults.map((result) => (
                  <li key={`${result.title}-${result.href}`}>
                    <Link href={result.href} scroll onClick={() => { setSearchOpen(false); setQuery('') }} className="group flex h-full items-start justify-between gap-4 rounded-xl px-3 py-3 transition-colors hover:bg-[#f1c6d7]/35 focus-visible:outline-2 focus-visible:outline-[#d70063]">
                      <span><span className="block text-sm font-semibold text-[#1a1917]">{result.title}</span><span className="mt-1 block text-xs leading-relaxed text-[#1a1917]/60">{result.description}</span></span>
                      <ArrowUpRight size={16} aria-hidden="true" className="mt-0.5 shrink-0 text-[#d70063]" />
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p id="site-search-results" role="status" className="rounded-xl bg-[#f1c6d7]/25 px-3 py-4 text-sm text-[#1a1917]/70">No matching pages found. Try searching for programs, debate, scholarships, or a team member.</p>
            )}
          </div>
        </div>
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
