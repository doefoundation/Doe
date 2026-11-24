import type { Metadata } from 'next'
import { HeartHandshake, MailCheck, Users } from 'lucide-react'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { VolunteerForm } from '@/components/volunteer-form'

export const metadata: Metadata = {
  title: 'Volunteer | DOE Foundation',
  description: 'Register to volunteer with the DOE Foundation and help young people grow into confident thinkers and leaders.',
  alternates: { canonical: '/volunteer' },
}

const steps = [
  { icon: HeartHandshake, title: 'Tell us about you', text: 'Share your details and why you would like to help.' },
  { icon: MailCheck, title: 'Get a confirmation', text: 'We email you straight away to confirm we have your registration.' },
  { icon: Users, title: 'We stay in touch', text: 'Our team contacts you about opportunities and occasional important updates.' },
]

export default function VolunteerRoute() {
  return (
    <main className="min-h-screen bg-[#f8f5ef] text-[#1a1917]">
      <SiteHeader />
      <div className="mx-auto grid max-w-[1100px] gap-12 px-5 py-14 sm:px-8 sm:py-20 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#d70063]">Get involved</p>
          <h1 className="mt-4 font-serif text-5xl leading-[.95] tracking-[-0.05em] sm:text-7xl">
            Volunteer <em className="font-normal text-[#d70063]">with us.</em>
          </h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-[#1a1917]/70">
            Your time and skills help young people grow into confident thinkers, speakers and leaders. Tell us a little about yourself and we will be in touch.
          </p>
          <ol className="mt-10 flex flex-col gap-6">
            {steps.map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex gap-4">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#f1c6d7]/50 text-[#d70063]">
                  <Icon size={20} aria-hidden="true" />
                </span>
                <span>
                  <span className="block font-semibold">{title}</span>
                  <span className="mt-0.5 block text-[15px] leading-relaxed text-[#1a1917]/65">{text}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
        <VolunteerForm />
      </div>
      <SiteFooter />
    </main>
  )
 }
