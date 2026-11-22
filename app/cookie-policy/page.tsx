import type { Metadata } from 'next'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'

export const metadata: Metadata = {
  title: 'Cookie Policy | DOE Foundation',
  description: 'The few cookies and similar technologies used on the DOE Foundation website, why we use them, and how you can control them.',
}

const UPDATED = '22 November 2026'
const EMAIL = 'info@thedoefoundation.com'
const PHONE_DISPLAY = '+234 906 655 5162'
const PHONE_LINK = '+2349066555162'

const contents = [
  { id: 'what-are-cookies', title: 'What cookies are' },
  { id: 'what-we-use', title: 'What we use' },
  { id: 'what-we-dont-use', title: 'What we do not use' },
  { id: 'third-parties', title: 'Third-party links and share buttons' },
  { id: 'your-choices', title: 'Your choices' },
  { id: 'changes', title: 'Changes to this policy' },
  { id: 'contact', title: 'Contact us' },
]

const linkClass = 'font-semibold text-[#d70063] underline decoration-[#d70063]/40 underline-offset-4 hover:decoration-[#d70063]'

function Section({ id, number, title, children }: { id: string; number: number; title: string; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="scroll-mt-8 border-t border-[#1a1917]/12 pt-10">
      <h2 id={`${id}-heading`} className="font-serif text-3xl leading-tight tracking-[-0.03em] sm:text-4xl">
        <span className="mr-3 text-[#d70063]">{number}.</span>
        {title}
      </h2>
      <div className="mt-5 flex flex-col gap-4 text-base leading-relaxed text-[#1a1917]/75 sm:text-[17px]">{children}</div>
    </section>
  )
}

function Bullets({ children }: { children: ReactNode }) {
  return <ul className="flex list-disc flex-col gap-2.5 pl-6 marker:text-[#d70063]">{children}</ul>
}

function Strong({ children }: { children: ReactNode }) {
  return <strong className="font-semibold text-[#1a1917]">{children}</strong>
}

function Card({ title, who, purpose, duration }: { title: string; who: string; purpose: string; duration: string }) {
  return (
    <div className="rounded-xl border border-[#1a1917]/10 bg-white p-4">
      <p className="font-semibold text-[#1a1917]">{title}</p>
      <dl className="mt-2 grid gap-x-4 gap-y-1 text-[15px] sm:grid-cols-[7rem_1fr]">
        <dt className="text-[#1a1917]/55">Used by</dt>
        <dd>{who}</dd>
        <dt className="text-[#1a1917]/55">Purpose</dt>
        <dd>{purpose}</dd>
        <dt className="text-[#1a1917]/55">How long</dt>
        <dd>{duration}</dd>
      </dl>
    </div>
  )
}

export default function CookiePolicyRoute() {
  return (
    <main className="min-h-screen bg-[#f8f5ef] text-[#1a1917]">
      <SiteHeader />
      <article className="mx-auto max-w-[820px] px-5 py-16 sm:px-8 sm:py-24">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#d70063]">DOE Foundation</p>
        <h1 className="mt-4 font-serif text-6xl leading-[.92] tracking-[-0.06em] sm:text-8xl">Cookie Policy</h1>
        <p className="mt-6 text-sm text-[#1a1917]/55">Last updated: {UPDATED}</p>
        <p className="mt-6 text-lg leading-relaxed text-[#1a1917]/75">
          The short version: visitors to our public website are not tracked with cookies. We only use a small amount of browser storage so that our own team can sign in and manage the website. This page explains the details.
        </p>

        <nav aria-label="Contents" className="mt-10 rounded-2xl border border-[#1a1917]/10 bg-white p-5 sm:p-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#1a1917]/55">Contents</p>
          <ol className="mt-3 grid gap-x-8 gap-y-1.5 text-[15px] sm:grid-cols-2">
            {contents.map((item, index) => (
              <li key={item.id}>
                <a href={`#${item.id}`} className="text-[#1a1917]/80 hover:text-[#d70063]">
                  <span className="mr-2 text-[#d70063]">{index + 1}.</span>
                  {item.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="mt-12 flex flex-col gap-12">
          <Section id="what-are-cookies" number={1} title="What cookies are">
            <p>
              Cookies are small text files that a website saves in your browser. Websites use them to remember things, such as that you are signed in. Similar technologies, such as your browser&apos;s local storage, do much the same job. In this policy, &ldquo;cookies&rdquo; covers both.
            </p>
            <p>
              This policy is part of our <Link href="/privacy-policy" className={linkClass}>Privacy Policy</Link>, which explains how we handle personal information more generally.
            </p>
          </Section>

          <Section id="what-we-use" number={2} title="What we use">
            <p>Everything below is essential to how the website works for our team. None of it is used for advertising or to follow visitors around the internet.</p>
            <div className="flex flex-col gap-4">
              <Card
                title="Sign-in session cookies"
                who="Our team members only"
                purpose="Keep a team member signed in to the admin area, and protect it from unauthorised access. They are created only after someone signs in, never for ordinary visitors."
                duration="Until you sign out or the session expires."
              />
              <Card
                title="Saved drafts in local storage"
                who="Our team members only"
                purpose="While writing a news article, the editor keeps a backup copy of the unsaved text in the browser so that work is not lost if the page closes by accident. It stays on that device and is not sent to us."
                duration="Until the article is saved or the backup is discarded."
              />
            </div>
            <p>
              <Strong>Visit statistics.</Strong> To understand how many people visit and which pages they read, we use Vercel Web Analytics. It counts visits without using cookies and is designed not to identify you or follow you across other websites. You can read more about what it records in our <Link href="/privacy-policy#information-we-collect" className={linkClass}>Privacy Policy</Link>.
            </p>
          </Section>

          <Section id="what-we-dont-use" number={3} title="What we do not use">
            <Bullets>
              <li>No advertising cookies.</li>
              <li>No social media tracking pixels or behavioural profiling.</li>
              <li>No cookies that build a profile of you from the pages you read.</li>
            </Bullets>
            <p>Because we use no optional cookies on the public website, there is no cookie banner and nothing for visitors to switch on or off.</p>
          </Section>

          <Section id="third-parties" number={4} title="Third-party links and share buttons">
            <p>
              Our news articles include buttons to share a story on Facebook, Instagram, WhatsApp, LinkedIn and Telegram, and our pages link to other websites. These do nothing until you click them. When you do, you leave our website, and that service&apos;s own cookie and privacy policies apply, including any cookies it sets on its own site.
            </p>
            <p>
              Emails we send through our email provider, Brevo, may record whether an email was opened or a link was clicked, so that we can see which news is useful. You can stop receiving these emails at any time with the unsubscribe link at the bottom of each one.
            </p>
          </Section>

          <Section id="your-choices" number={5} title="Your choices">
            <p>
              You can control or delete cookies and site data in your browser settings, usually under Privacy or Site settings. Blocking the sign-in cookies would only stop team members from signing in to the admin area. It does not affect reading the website.
            </p>
            <p>
              To remove the saved-draft backup from a device, clear the website&apos;s data in your browser, or discard the backup when the editor offers it.
            </p>
          </Section>

          <Section id="changes" number={6} title="Changes to this policy">
            <p>
              If we ever add cookies that are not essential, such as advertising or detailed tracking, we will update this page first and ask for your consent where the law requires it. The date at the top shows when this page was last changed.
            </p>
          </Section>

          <Section id="contact" number={7} title="Contact us">
            <p>Questions about cookies or this policy? Get in touch:</p>
            <ul className="flex flex-col gap-2">
              <li>Email: <a href={`mailto:${EMAIL}`} className={linkClass}>{EMAIL}</a></li>
              <li>Phone: <a href={`tel:${PHONE_LINK}`} className={linkClass}>{PHONE_DISPLAY}</a></li>
              <li>Location: Abuja, Nigeria</li>
            </ul>
          </Section>
        </div>
      </article>
      <SiteFooter />
    </main>
  )
 }
