import type { Metadata } from 'next'
import { HeartHandshake, MailCheck, Users } from 'lucide-react'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { PartnerForm } from '@/components/partner-form'

export const metadata: Metadata = {
  title: 'Partner With Us | DOE Foundation',
  description: 'Individuals and organisations can partner with the DOE Foundation to support debate education, advocacy and opportunity for young people.',
  alternates: { canonical: '/partner' },
}

const steps = [
  { icon: HeartHandshake, title: 'Tell us your idea', text: 'Share your details and how you would like to work with us.' },
  { icon: MailCheck, title: 'Get a confirmation', text: 'We email you straight away to confirm we have received your details.' },
  { icon: Users, title: 'We talk it through', text: 'Our team contacts you to explore how we can achieve more together.' },
]

export default function PartnerRoute() {
  return (
    <main className="min-h-screen bg-[#f8f5ef] text-[#1a1917]">
      <SiteHeader />
      <div className="mx-auto grid max-w-[1100px] gap-12 px-5 py-14 sm:px-8 sm:py-20 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#d70063]">Work with us</p>
          <h1 className="mt-4 font-serif text-5xl leading-[.95] tracking-[-0.05em] sm:text-7xl">
            Partner <em className="font-normal text-[#d70063]">with us.</em>
          </h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-[#1a1917]/70">
            Whether you are an individual or an organisation, your support can help more young people become confident thinkers, speakers and leaders. Tell us how you would like to help.
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
        <PartnerForm />
      </div>
      <SiteFooter />
    </main>
  )
}
