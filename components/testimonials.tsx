'use client'

import { useEffect, useState } from 'react'
import { ArrowLeft, ArrowRight, Quote } from 'lucide-react'

const testimonials = [
  {
    name: 'Sylvia Adamu',
    role: 'Lawyer and Debate Coach Volunteer',
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Sylvia%20Adamu-53Wb7Zv3nH0WkD3QAbrufGMnMJ7JpD.jpg',
    imagePosition: 'center 34%',
    quote: 'Through the Davida Omosomi Empowerment Foundation, I have had the privilege of training over 200 students across 5 schools in advocacy and debating. I have watched students who were initially hesitant become more confident in expressing their ideas and defending their positions. This is more than debating—it is about raising young people who can think, speak, and advocate for themselves and others.',
  },
  {
    name: 'Okeoghene Umukoru',
    role: 'Teacher, JoachCare Academy',
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Okeoghene%20Umukoru-7DWPsOUD3mNGWm2K8q92Ze6Qne3GRp.png',
    imagePosition: 'center 34%',
    quote: 'This training has impacted our students in such a way that they feel empowered to believe in their voice. They will no longer be scared to share their opinions, regardless of whether they think they are right or wrong.',
  },
  {
    name: 'Adesanya Zara',
    role: 'Student and Program Beneficiary',
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Adesanya%20Zara-1ht1pTmGiKZ96WMHEChnmWmeRehJfU.png',
    imagePosition: 'center 18%',
    quote: 'My experience at the training has been great. Beyond learning concepts like utilitarianism, deontology, and philosophy, the training has helped me understand the meaning of words better, make the right decisions, and recognise what is right and wrong.',
  },
  {
    name: 'Shekinah Sanwoolu',
    role: 'Student and Program Beneficiary',
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Shekinah%20Sanwoolu-ScKcymY8521yYg5TOo08EXBkjswyBH.png',
    imagePosition: 'center 18%',
    quote: 'Since debate trainings at the DOE Academy started, I\'ve become a much more confident speaker who knows how to listen carefully and look at both sides of an argument before making a point. Being gifted a laptop will help me become a great researcher, and I hope to compete on the international stage someday.',
  },
  {
    name: 'Abraham Ogooluwa Ayomiposi',
    role: 'Student and Program Beneficiary',
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Abraham%20Ogooluwa%20Ayomiposi-wIlH1KmgBuLwz6W2HmErJZHgC2SvoM.png',
    imagePosition: 'center 18%',
    quote: 'Since the training started, I\'ve become more confident because I now find myself looking at situations from every angle instead of immediately forming an opinion. A good debater doesn\'t just speak well; they listen, understand the other person\'s argument, ask the right questions, and know how to respond. Receiving a laptop has also made research much easier, and I\'m hopeful that I will become an international debater one day.',
  },
  {
    name: 'Rhoda Adegoke',
    role: 'Student and Program Beneficiary',
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Rhoda%20Adegoke-Fhpak1c8PeYEJoSiLkQtnOWuHNCVvx.png',
    imagePosition: 'center 19%',
    quote: 'The training has improved my ability to make the right decisions and increased my confidence in myself. Being gifted a laptop makes me joyful because it helps me hone my debate skills and utilize the knowledge imparted in me—and I hope to see myself on the international stage one day.',
  },
  {
    name: 'Anjola Oladapo',
    role: 'Student and Program Beneficiary',
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Anjola%20Oladapo-V5ivPUcuiGFtuasjgbUv6fIkAIiPLv.png',
    imagePosition: 'center 18%',
    quote: 'One important thing I\'ve learned is that ethical theories are frameworks that help me understand whether something is right or wrong. Before, I always wanted things to move very quickly and didn\'t take the time to listen to other people\'s points. Now, I understand the importance of listening to others\' opinions and using facts and ethics. The gift of a laptop also gives me the chance to research topics I didn\'t understand before.',
  },
]

export function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const activeTestimonial = testimonials[activeIndex]

  useEffect(() => {
    if (isPaused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const interval = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % testimonials.length)
    }, 10000)

    return () => window.clearInterval(interval)
  }, [activeIndex, isPaused])

  const showPrevious = () => setActiveIndex((index) => (index - 1 + testimonials.length) % testimonials.length)
  const showNext = () => setActiveIndex((index) => (index + 1) % testimonials.length)

  return (
    <section id="testimonials" aria-labelledby="testimonials-heading" className="border-y border-[#1a1917]/10 bg-[#f8f5ef] px-5 py-16 sm:px-8 sm:py-24">
      <div className="mx-auto max-w-[1100px]">
        <div className="mb-10 text-center sm:mb-14">
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#d70063]">Words from our community</p>
          <h2 id="testimonials-heading" className="font-serif text-5xl tracking-[-0.05em] sm:text-6xl">Voices of <em className="font-normal text-[#d70063]">change.</em></h2>
        </div>

        <div
          role="region"
          aria-roledescription="carousel"
          aria-label="Testimonials"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onFocusCapture={() => setIsPaused(true)}
          onBlurCapture={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setIsPaused(false)
          }}
          className="rounded-[28px] border border-[#1a1917]/10 bg-white/75 p-6 shadow-[0_20px_60px_-45px_rgba(26,25,23,.35)] sm:p-10 lg:p-12"
        >
          <div key={activeTestimonial.name} aria-live={isPaused ? 'polite' : 'off'} className="testimonial-content grid gap-8 lg:grid-cols-[.72fr_1.28fr] lg:items-center lg:gap-12">
            <div className="flex items-center gap-5 lg:flex-col lg:items-start lg:gap-7">
              <img src={activeTestimonial.image} alt={activeTestimonial.name} style={{ objectPosition: activeTestimonial.imagePosition }} className="h-24 w-24 shrink-0 rounded-full border-4 border-white object-cover shadow-[0_0_0_2px_rgba(215,0,99,.22)] sm:h-32 sm:w-32" />
              <div><h3 className="font-serif text-2xl leading-tight sm:text-3xl">{activeTestimonial.name}</h3><p className="mt-2 max-w-[260px] text-sm font-medium leading-relaxed text-[#514b48] sm:text-base">{activeTestimonial.role}</p></div>
            </div>
            <blockquote className="relative border-t border-[#1a1917]/10 pt-7 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
              <Quote size={30} strokeWidth={1.5} aria-hidden="true" className="mb-4 text-[#d70063]/70" />
              <p className="font-serif text-lg leading-relaxed text-[#1a1917]/85 sm:text-xl lg:text-[1.4rem]">&ldquo;{activeTestimonial.quote}&rdquo;</p>
            </blockquote>
          </div>

          <div className="mt-8 flex items-center justify-between border-t border-[#1a1917]/10 pt-5">
            <p className="text-xs font-semibold tabular-nums tracking-[0.12em] text-[#1a1917]/50"><span className="text-[#d70063]">{String(activeIndex + 1).padStart(2, '0')}</span> / {String(testimonials.length).padStart(2, '0')}</p>
            <div className="flex items-center gap-2">
              <button type="button" onClick={showPrevious} aria-label="Previous testimonial" className="flex h-10 w-10 items-center justify-center rounded-full border border-[#1a1917]/15 transition-colors hover:border-[#d70063] hover:bg-[#f1c6d7]/35 focus-visible:outline-2 focus-visible:outline-[#d70063]"><ArrowLeft size={18} /></button>
              <button type="button" onClick={showNext} aria-label="Next testimonial" className="flex h-10 w-10 items-center justify-center rounded-full bg-[#d70063] text-white transition-colors hover:bg-[#b80054] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d70063]"><ArrowRight size={18} /></button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
