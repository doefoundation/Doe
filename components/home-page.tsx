'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, ChevronRight } from 'lucide-react'
import { programs } from '@/lib/programs'
import { TestimonialsSection } from '@/components/testimonials'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { LatestNews } from '@/components/latest-news'
import type { ImpactStat, NewsPost } from '@/lib/cms-types'

const heroImages = [
  { src: '20.jpeg', alt: 'DOE Foundation students and mentors celebrating together' },
  { src: '9.jpeg', alt: 'DOE Foundation team members gathered at an education event' },
  { src: '13.jpeg', alt: 'Students and educators gathered outside a school' },
  { src: '16.jpeg', alt: 'A student speaker presenting at a debate event' },
  { src: '15.jpeg', alt: 'Students participating in an educational debate event' },
]

export function HomePage({ impactStats, latestNews }: { impactStats: ImpactStat[]; latestNews: NewsPost[] }) {
  const impactTargets = impactStats.map((stat) => stat.value)
  const [heroImageIndex, setHeroImageIndex] = useState(0)
  const [impactValues, setImpactValues] = useState(impactTargets)
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
    const targets = impactTargets

    const animateCounters = () => {
      const startTime = performance.now()
      const duration = 7000
      const tick = (now: number) => {
        const progress = Math.min((now - startTime) / duration, 1)
        setImpactValues(targets.map((target) => Math.floor(target * progress)))
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
    // Animate once on mount with the server-provided targets.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <main className="min-h-screen overflow-hidden bg-[#f8f5ef] text-[#1a1917]">
      <SiteHeader />

      <section id="top" className="mx-auto max-w-[1360px] px-5 py-16 sm:px-8 lg:py-24">
        <div className="max-w-[680px]">
          <p className="mb-7 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#d70063]"><span className="h-px w-8 bg-[#d70063]" />Education changes everything</p>
          <h1 className="max-w-[680px] font-serif text-[clamp(3.8rem,8vw,7.5rem)] leading-[.98] tracking-[-0.075em]">Every child deserves a<br /><em className="mt-2 block font-normal text-[#d70063]">good Education.</em></h1>
          <p className="mt-9 max-w-[470px] text-lg leading-relaxed text-[#1a1917]/70 sm:text-xl">We open doors to quality education, mentorship, and opportunity for young people building a brighter future.</p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link href="/donate" className="inline-flex items-center gap-4 rounded-full bg-[#d70063] px-6 py-3.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d70063]">Support our work <ArrowUpRight size={18} /></Link>
            <a href="#our-work" className="group inline-flex items-center gap-2 px-2 py-3.5 text-sm font-semibold">Explore our work <ChevronRight size={17} className="transition-transform group-hover:translate-x-1" /></a>
          </div>
        </div>
 <div className="relative mt-14 -mx-5 w-[calc(100%+2.5rem)] sm:-mx-8 sm:w-[calc(100%+4rem)]">
          <div className="relative min-h-[260px] aspect-[4/3] overflow-hidden border border-[#1a1917]/15 bg-[#f8f5ef] sm:min-h-[520px] sm:aspect-[16/9]">
            <Image
  key={heroImages[heroImageIndex].src}
  src={heroImages[heroImageIndex].src}
  alt={heroImages[heroImageIndex].alt}
  fill
  priority={heroImageIndex === 0}
  sizes="100vw"
  quality={70}
  className="object-cover animate-in fade-in duration-700"
/>
            <div className="absolute inset-0 bg-gradient-to-t from-[#1a1917]/65 via-transparent to-transparent" />
            <div className="absolute bottom-8 left-6 right-6 text-white sm:bottom-12 sm:left-12 sm:right-12"><p className="font-serif text-3xl leading-tight sm:text-4xl">A better future starts with a chance.</p><p className="mt-4 text-xs uppercase tracking-[0.18em] text-white/80">DOE Foundation · Since 2025</p></div>
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
            {impactStats.map((stat, index) => <article key={stat.id} className="flex flex-col items-center px-4 py-8 text-center sm:px-8 sm:py-10"><p className="font-serif text-5xl tracking-[-0.06em] text-[#d70063] sm:text-7xl">{`${(impactValues[index] ?? stat.value).toLocaleString()}${stat.suffix}`}</p><p className="mt-3 max-w-[190px] text-xs font-semibold uppercase leading-relaxed tracking-[0.12em] text-[#1a1917]/65">{stat.label}</p></article>)}
          </div>
        </div>
      </section>

      <section id="our-work" className="border-y border-[#1a1917]/12 bg-[#e9e3d9] px-5 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-[1360px]">
          <div className="mx-auto max-w-3xl text-center"><p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#d70063]">What we do</p><h2 className="font-serif text-5xl leading-[.92] tracking-[-0.05em] sm:text-7xl">Small beginnings.<br /><em className="font-normal text-[#d70063]">Limitless potential.</em></h2><p className="mx-auto mt-7 max-w-xl text-lg leading-relaxed text-[#1a1917]/70 sm:text-xl">Our programs connect education, leadership and practical support to create opportunities for children and young people.</p></div>
          <div className="mt-14 grid gap-5 sm:grid-cols-2">
            {programs.map((program) => <article key={program.name} className="group overflow-hidden rounded-[70px_16px_16px_16px] bg-[#f8f5ef]"><div className="relative aspect-[4/3] overflow-hidden"><Image src={program.image} alt={program.alt} fill sizes="(max-width: 639px) calc(100vw - 2.5rem), 50vw" quality={75} loading="lazy" className="object-cover transition-transform duration-500 group-hover:scale-105" /><div className="absolute inset-0 bg-gradient-to-t from-[#1a1917]/70 via-transparent to-transparent" /><span className="absolute left-6 top-6 text-xs font-semibold tracking-[0.18em] text-white">{program.number}</span></div><div className="p-6 sm:p-8"><h3 className="font-serif text-3xl">{program.name}</h3><p className="mt-3 max-w-md leading-relaxed text-[#1a1917]/65">{program.shortDescription}</p><Link href="/programs" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold hover:text-[#d70063]">Discover the program <ArrowUpRight size={17} /></Link></div></article>)}
          </div>
        </div>
      </section>

      <LatestNews posts={latestNews} />

      <TestimonialsSection />

      <section id="our-partners" aria-labelledby="partners-heading" className="overflow-hidden bg-[#f8f5ef] py-14 sm:py-20">
        <div className="mx-auto max-w-[1360px] px-5 text-center sm:px-8">
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#d70063]">Together, we go further</p>
          <h2 id="partners-heading" className="font-serif text-4xl tracking-[-0.05em] sm:text-5xl">Our <em className="font-normal text-[#d70063]">partners.</em></h2>
        </div>
        <div className="partner-marquee mt-10 sm:mt-14" aria-label="DOE Foundation partners">
          <div className="partner-track">
            {[0, 1].map((copy) => <div key={copy} className="partner-group" aria-hidden={copy === 1 ? true : undefined}>
              <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1794360155530-removebg-preview-ZDwcV7T4fz0QTQhtqDVvLWJIIrQhXs.png" alt={copy === 0 ? 'AREAi — Aid for Rural Education Access Initiative' : ''} />
              <img src="/oasis.png" alt={copy === 0 ? 'Oasis Haven' : ''} />
              <img src="/debate.png" alt={copy === 0 ? 'Debate Champs' : ''} />
              <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/tkethics-logo-oRhUIyU2YpEnIG4n3Q0HRdnsFisqFu.webp" alt={copy === 0 ? 'T K E Ethics' : ''} />
            </div>)}
          </div>
        </div>
      </section>


      <SiteFooter />
    </main>
  )
}
