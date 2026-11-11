'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, ChevronRight, Menu, Search, X } from 'lucide-react'
import { programs } from '@/lib/programs'

const logoUrl = 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/file_00000000ebbc8243b1a46e16cc7df432-Ey2WCQZAaBoXSQKqIEQgRVc2ePrSvh.png'

const navItems = ['Our work', 'Who we are', 'Get involved', 'Stories']

const heroImages = [
  { src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/15-cQBBTFwjpRjQBkMF3nfTMtzv2bmoxo.jpeg', alt: 'DOE Foundation students and mentors celebrating together' },
  { src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/20-8nShIXaDzLxfypSIRabs4PRbZuGaWk.jpeg', alt: 'DOE Foundation team members gathered at an education event' },
  { src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/13-DXKEfcAKHMUIWC8rtLyeE7N3kXhXT7.jpg', alt: 'Students and educators gathered outside a school' },
  { src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/10-YXCFMuRSlnjMMRPamarjB1bAazqIyU.jpeg', alt: 'A student speaker presenting at a debate event' },
  { src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/9-5kM9OMsC7vDYKzvBl8DpovpiBkZDhJ.jpeg', alt: 'Students participating in an educational debate event' },
]

export function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [heroImageIndex, setHeroImageIndex] = useState(0)
  const [impactValues, setImpactValues] = useState([0, 0, 0, 0])
  const impactRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const interval = window.setInterval(() => {
      setHeroImageIndex((currentIndex) => (currentIndex + 1) % heroImages.length)
    }, 5000)

    return () => window.clearInterval(interval)
  }, [])

  useEffect(() => {
    const section = impactRef.current
    if (!section) return

    let animationFrame = 0
    let hasStarted = false
    const targets = [1200, 76, 153, 7]

    const animateCounters = () => {
      const startTime = performance.now()
      const duration = 2800
      const tick = (now: number) => {
        const progress = Math.min((now - startTime) / duration, 1)
        const easedProgress = 1 - Math.pow(1 - progress, 3)
        setImpactValues(targets.map((target) => Math.floor(target * easedProgress)))
        if (progress < 1) animationFrame = window.requestAnimationFrame(tick)
      }
      animationFrame = window.requestAnimationFrame(tick)
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !hasStarted) {
        hasStarted = true
        animateCounters()
        observer.disconnect()
      }
    }, { threshold: 0.3 })

    observer.observe(section)
    return () => {
      observer.disconnect()
      window.cancelAnimationFrame(animationFrame)
    }
  }, [])

  return (
    <main className="min-h-screen overflow-hidden bg-[#f8f5ef] text-[#1a1917]">
      <header className="relative z-20 border-b border-[#1a1917]/12 bg-[#f8f5ef]/95 px-5 backdrop-blur-sm sm:px-8">
        <div className="mx-auto flex h-[92px] max-w-[1360px] items-center justify-between sm:h-[108px]">
          <a href="#top" aria-label="DOE Foundation home" className="flex items-center justify-center">
            <img src={logoUrl} alt="DOE Foundation" className="h-[82px] w-auto object-contain mix-blend-multiply sm:h-[104px]" />
          </a>

          <div className="flex items-center gap-1 sm:gap-3">
            <button
              type="button"
              aria-label={searchOpen ? 'Close search' : 'Open search'}
              aria-expanded={searchOpen}
              onClick={() => setSearchOpen((open) => !open)}
              className="group flex h-11 w-11 items-center justify-center rounded-full transition-colors hover:bg-[#e9e3d9] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d70063]"
            >
              {searchOpen ? <X size={22} strokeWidth={1.7} /> : <Search size={21} strokeWidth={1.7} />}
            </button>

            <button
              type="button"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
              className="group flex h-11 w-11 items-center justify-center rounded-full transition-colors hover:bg-[#e9e3d9] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d70063]"
            >
              {menuOpen ? <X size={23} strokeWidth={1.7} /> : <Menu size={23} strokeWidth={1.7} />}
            </button>
          </div>
        </div>

        {searchOpen && (
          <div className="mx-auto max-w-[1360px] border-t border-[#1a1917]/10 py-4">
            <label htmlFor="site-search" className="sr-only">Search DOE Foundation</label>
            <div className="flex items-center gap-3 border-b border-[#1a1917]/35 pb-2">
              <Search size={19} strokeWidth={1.6} aria-hidden="true" />
              <input
                id="site-search"
                autoFocus
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && !event.nativeEvent.isComposing && event.keyCode !== 229) {
                    event.preventDefault()
                  }
                }}
                placeholder="Search our work, stories, and resources"
                className="w-full bg-transparent text-base outline-none placeholder:text-[#1a1917]/50"
              />
              {query && <span className="text-xs uppercase tracking-[0.16em] text-[#1a1917]/50">Press enter</span>}
            </div>
          </div>
        )}

        {menuOpen && (
          <nav aria-label="Main navigation" className="mx-auto max-w-[1360px] border-t border-[#1a1917]/10 py-6">
            <ul className="grid gap-1 sm:grid-cols-4">
              {navItems.map((item) => (
                <li key={item}>
                  <a href={`#${item.toLowerCase().replaceAll(' ', '-')}`} onClick={() => setMenuOpen(false)} className="flex items-center justify-between border-b border-[#1a1917]/10 py-3 text-lg transition-colors hover:text-[#d70063]">
                    {item}<ArrowUpRight size={18} strokeWidth={1.5} />
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </header>

      <section id="top" className="mx-auto max-w-[1360px] px-5 py-16 sm:px-8 lg:py-24">
        <div className="max-w-[680px]">
          <p className="mb-7 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#d70063]"><span className="h-px w-8 bg-[#d70063]" />Education changes everything</p>
          <h1 className="max-w-[680px] font-serif text-[clamp(3.8rem,8vw,7.5rem)] leading-[.88] tracking-[-0.075em]">Every child deserves a <em className="font-normal text-[#d70063]">good Education.</em></h1>
          <p className="mt-9 max-w-[470px] text-lg leading-relaxed text-[#1a1917]/70 sm:text-xl">We open doors to quality education, mentorship, and opportunity for young people building a brighter future.</p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a href="#get-involved" className="inline-flex items-center gap-4 rounded-full bg-[#d70063] px-6 py-3.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d70063]">Support our work <ArrowUpRight size={18} /></a>
            <a href="#our-work" className="group inline-flex items-center gap-2 px-2 py-3.5 text-sm font-semibold">Explore our work <ChevronRight size={17} className="transition-transform group-hover:translate-x-1" /></a>
          </div>
        </div>
        <div className="relative mt-14 -mx-5 w-[calc(100%+2.5rem)] sm:-mx-8 sm:w-[calc(100%+4rem)]">
          <div className="relative min-h-[380px] aspect-[4/3] overflow-hidden bg-[#e9e3d9] sm:min-h-[520px] sm:aspect-[16/9]">
            <img key={heroImages[heroImageIndex].src} src={heroImages[heroImageIndex].src} alt={heroImages[heroImageIndex].alt} className="absolute inset-0 h-full w-full object-contain animate-in fade-in duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1a1917]/65 via-transparent to-transparent" />
            <div className="absolute bottom-8 left-6 right-6 text-white sm:bottom-12 sm:left-12 sm:right-12"><p className="font-serif text-3xl leading-tight sm:text-4xl">A better future starts with a chance.</p><p className="mt-4 text-xs uppercase tracking-[0.18em] text-white/80">DOE Foundation · Since 2010</p></div>
            <div className="absolute bottom-5 right-6 flex gap-1.5 sm:bottom-8 sm:right-10" aria-label="Hero image slides">
              {heroImages.map((image, index) => <span key={image.src} className={`h-1.5 rounded-full transition-all ${index === heroImageIndex ? 'w-7 bg-white' : 'w-1.5 bg-white/55'}`} aria-hidden="true" />)}
            </div>
          </div>
        </div>
      </section>

      <section id="who-we-are" className="border-y border-[#1a1917]/12 bg-[#f8f5ef] px-5 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-[900px] text-center">
          <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#d70063]">Who we are</p>
          <h2 className="font-serif text-5xl leading-[.95] tracking-[-0.05em] sm:text-6xl">Who are <em className="font-normal text-[#d70063]">we?</em></h2>
          <div className="mx-auto mt-10 max-w-2xl">
            <p className="leading-relaxed text-[#1a1917]/70">The Davida Omosomi Empowerment Foundation (DOE Foundation) is a child- and youth-focused nonprofit dedicated to raising a generation of purposeful leaders through advocacy, literacy development, and community-centered initiatives.</p>
            <details className="group mt-8">
              <summary className="mx-auto flex w-fit cursor-pointer list-none items-center gap-3 rounded-full bg-[#d70063] px-5 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 marker:hidden focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d70063] [&::-webkit-details-marker]:hidden">See More <span className="text-xl font-normal leading-none transition-transform group-open:rotate-45">+</span></summary>
              <div className="mt-10 grid gap-8 border-t border-[#1a1917]/15 pt-8 sm:grid-cols-2">
                <div><p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#d70063]">Vision</p><p className="leading-relaxed text-[#1a1917]/70">To develop primary and secondary school students across Africa into confident thinkers and communicators through debate education and advocacy.</p></div>
                <div><p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#d70063]">Mission</p><p className="leading-relaxed text-[#1a1917]/70">We partner with schools to deliver structured debate training, organize competitions and establish debate societies that build students&apos; critical thinking, public speaking, and civic engagement skills.</p></div>
              </div>
            </details>
          </div>
        </div>
      </section>

      <section ref={impactRef} id="our-impact" className="border-y border-[#1a1917]/12 bg-[#e9e3d9] px-5 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-[1100px]">
          <div className="text-center"><p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#d70063]">Our impact</p><h2 className="font-serif text-5xl leading-[.95] tracking-[-0.05em] sm:text-6xl">Change you can <em className="font-normal text-[#d70063]">count.</em></h2></div>
          <div className="mt-12 grid grid-cols-2">
            {[
              [`${impactValues[0].toLocaleString()}+`, 'Students empowered through debates'],
              [`${impactValues[1]}`, 'Schools reached'],
              [`${impactValues[2]}`, 'Scholarships disbursed'],
              [`${impactValues[3]}`, 'Competitions · international & local'],
            ].map(([figure, label]) => <article key={label} className="flex flex-col items-center px-4 py-8 text-center sm:px-8 sm:py-10"><p className="font-serif text-5xl tracking-[-0.06em] text-[#d70063] sm:text-7xl">{figure}</p><p className="mt-3 max-w-[190px] text-xs font-semibold uppercase leading-relaxed tracking-[0.12em] text-[#1a1917]/65">{label}</p></article>)}
          </div>
        </div>
      </section>

      <section id="our-work" className="border-y border-[#1a1917]/12 bg-[#e9e3d9] px-5 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-[1360px]">
          <div className="mx-auto max-w-3xl text-center"><p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#d70063]">What we do</p><h2 className="font-serif text-5xl leading-[.92] tracking-[-0.05em] sm:text-7xl">Small beginnings.<br /><em className="font-normal text-[#d70063]">Limitless potential.</em></h2><p className="mx-auto mt-7 max-w-xl text-lg leading-relaxed text-[#1a1917]/70 sm:text-xl">Our programs connect education, leadership and practical support to create opportunities for children and young people.</p></div>
          <div className="mt-14 grid gap-5 sm:grid-cols-2">
            {programs.map((program) => <article key={program.name} className="group overflow-hidden rounded-[70px_16px_16px_16px] bg-[#f8f5ef]"><div className="relative aspect-[4/3] overflow-hidden"><img src={program.image} alt={program.alt} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" /><div className="absolute inset-0 bg-gradient-to-t from-[#1a1917]/70 via-transparent to-transparent" /><span className="absolute left-6 top-6 text-xs font-semibold tracking-[0.18em] text-white">{program.number}</span></div><div className="p-6 sm:p-8"><h3 className="font-serif text-3xl">{program.name}</h3><p className="mt-3 max-w-md leading-relaxed text-[#1a1917]/65">{program.shortDescription}</p><Link href="/programs" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold hover:text-[#d70063]">Discover the program <ArrowUpRight size={17} /></Link></div></article>)}
          </div>
        </div>
      </section>

      <section id="our-partners" aria-labelledby="partners-heading" className="overflow-hidden bg-[#f8f5ef] py-14 sm:py-20">
        <div className="mx-auto max-w-[1360px] px-5 text-center sm:px-8">
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#d70063]">Together, we go further</p>
          <h2 id="partners-heading" className="font-serif text-4xl tracking-[-0.05em] sm:text-5xl">Our <em className="font-normal text-[#d70063]">partners.</em></h2>
        </div>
        <div className="partner-marquee mt-10 sm:mt-14" aria-label="DOE Foundation partners">
          <div className="partner-track">
            {[0, 1].map((copy) => <div key={copy} className="partner-group" aria-hidden={copy === 1 ? true : undefined}>
              <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1794360155530-removebg-preview-ZDwcV7T4fz0QTQhtqDVvLWJIIrQhXs.png" alt={copy === 0 ? 'AREAi — Aid for Rural Education Access Initiative' : ''} />
              <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1794360773045-removebg-preview-vMSipv1M4dQWxZmZkjSby6fFH8bIvc.png" alt={copy === 0 ? 'Oasis Haven' : ''} />
              <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot_20261111-015158_Instagram_2-removebg-preview-50Jv6c1WR5GYBsbx2zOsi4QD5gGEyD.png" alt={copy === 0 ? 'Debate Champs' : ''} />
              <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/tkethics-logo-oRhUIyU2YpEnIG4n3Q0HRdnsFisqFu.webp" alt={copy === 0 ? 'T K E Ethics' : ''} />
            </div>)}
          </div>
        </div>
      </section>

      <section id="get-involved" className="mx-auto flex max-w-[1360px] flex-col gap-8 px-5 py-20 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:py-28"><div><p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#d70063]">Join the movement</p><h2 className="max-w-2xl font-serif text-5xl leading-[.95] tracking-[-0.05em] sm:text-7xl">Small actions. <em className="font-normal">Big ripples.</em></h2></div><a href="mailto:hello@doefoundation.org" className="group inline-flex w-fit items-center gap-4 border-b border-[#1a1917] pb-3 text-sm font-semibold">Let&apos;s make a difference <ArrowUpRight size={18} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" /></a></section>
      <footer className="bg-[#1a1917] px-5 py-8 text-white sm:px-8"><div className="mx-auto flex max-w-[1360px] flex-col gap-6 sm:flex-row sm:items-center sm:justify-between"><p className="text-sm text-white/70">© 2025 DOE Foundation. Education for every future.</p><div className="flex gap-5 text-xs uppercase tracking-[0.14em] text-white/60"><a href="#our-work" className="hover:text-white">Our work</a><a href="mailto:hello@doefoundation.org" className="hover:text-white">Contact</a></div></div></footer>
    </main>
  )
}
