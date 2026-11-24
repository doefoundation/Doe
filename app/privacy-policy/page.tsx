import type { Metadata } from 'next'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'

export const metadata: Metadata = {
  title: 'Privacy Policy | DOE Foundation',
  description: 'How the DOE Foundation collects, uses and protects personal information on this website, and the choices you have.',
}

const UPDATED = '24 November 2026'
const EMAIL = 'info@thedoefoundation.com'
const PHONE_DISPLAY = '+234 906 655 5162'
const PHONE_LINK = '+2349066555162'

const contents = [
  { id: 'who-we-are', title: 'Who we are' },
  { id: 'information-we-collect', title: 'Information we collect' },
  { id: 'how-we-use-it', title: 'How and why we use it' },
  { id: 'who-we-share-with', title: 'Who we share it with' },
  { id: 'international-transfers', title: 'Transfers outside Nigeria' },
  { id: 'how-long-we-keep-it', title: 'How long we keep it' },
  { id: 'your-rights', title: 'Your rights and choices' },
  { id: 'cookies-and-links', title: 'Cookies and third-party links' },
  { id: 'children', title: 'Children' },
  { id: 'security', title: 'Keeping information safe' },
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

function SubHeading({ children }: { children: ReactNode }) {
  return <h3 className="mt-2 text-sm font-semibold uppercase tracking-[0.14em] text-[#d70063]">{children}</h3>
}

export default function PrivacyPolicyRoute() {
  return (
    <main className="min-h-screen bg-[#f8f5ef] text-[#1a1917]">
      <SiteHeader />
      <article className="mx-auto max-w-[820px] px-5 py-16 sm:px-8 sm:py-24">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#d70063]">DOE Foundation</p>
        <h1 className="mt-4 font-serif text-6xl leading-[.92] tracking-[-0.06em] sm:text-8xl">Privacy Policy</h1>
        <p className="mt-6 text-sm text-[#1a1917]/55">Last updated: {UPDATED}</p>
        <p className="mt-6 text-lg leading-relaxed text-[#1a1917]/75">
          We respect your privacy. This policy explains, in plain language, what personal information the Davida Omosomi Empowerment Foundation collects through this website, why we collect it, who helps us handle it, and the choices you have.
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
          <Section id="who-we-are" number={1} title="Who we are">
            <p>
              The Davida Omosomi Empowerment Foundation (&ldquo;DOE Foundation&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;) is a child- and youth-focused nonprofit based in Abuja, Nigeria. We are responsible for the personal information described in this policy, and we handle it in line with the Nigeria Data Protection Act 2023 (NDPA).
            </p>
            <p>
              You can reach us at <a href={`mailto:${EMAIL}`} className={linkClass}>{EMAIL}</a> or on <a href={`tel:${PHONE_LINK}`} className={linkClass}>{PHONE_DISPLAY}</a>.
            </p>
          </Section>

          <Section id="information-we-collect" number={2} title="Information we collect">
            <SubHeading>Information you give us</SubHeading>
            <Bullets>
              <li><Strong>Newsletter sign-up.</Strong> Your email address and a record that you agreed to receive our updates. When you open our emails or click links in them, our email provider records this so that we can see which news is useful.</li>
              <li><Strong>Volunteer registration.</Strong> Your name, phone number, email address, your reason for volunteering, any other information you choose to share with us, and a record of the date you agreed to receive updates.</li>
              <li><Strong>Messages and enquiries.</Strong> If you email or call us about volunteering, partnerships or anything else, we receive your contact details and whatever you choose to tell us.</li>
              <li><Strong>Partnership enquiries.</Strong> Your name, organisation (if any), phone number, email address, how you would like to partner with us, your message, how you heard about us (if you tell us), and a record of the date you agreed to be contacted.</li>
              <li><Strong>Confirmation emails.</Strong> When you register to volunteer or send a partnership enquiry, we email you straight away to confirm that we received your details.</li>
              <li><Strong>Donations and sponsorship.</Strong> Donations are made by bank transfer, outside this website, and we do not collect payment card details here. Your bank shares your name, the amount and your payment reference with us so that we can record and acknowledge your gift.</li>
            </Bullets>
            <SubHeading>Information collected automatically</SubHeading>
            <Bullets>
              <li><Strong>Visit statistics.</Strong> We use Vercel Web Analytics to count visits. It records things like the pages viewed, the website you came from, your country, and your device type and browser. It is designed to measure overall traffic without identifying individuals or following you across other websites.</li>
              <li><Strong>Spam protection.</Strong> Our forms use hidden fields and timing checks, and limit how many submissions can be made in a short time, to block automated spam. These checks do not use cookies and do not identify you.</li>
              <li><Strong>Security and technical logs.</Strong> Our hosting provider keeps short-term technical records, such as your IP address and the pages requested, to keep the website secure and to fix problems.</li>
            </Bullets>
            <SubHeading>Our team</SubHeading>
            <p>Team members who help run the website sign in with an email address and password. We store these account details so that they can access the admin area.</p>
          </Section>

          <Section id="how-we-use-it" number={3} title="How and why we use it">
            <p>We only use personal information for the reasons below, and each reason rests on a lawful basis under the NDPA.</p>
            <dl className="flex flex-col gap-4">
              {[
                ['Sending our newsletter and updates', 'Your consent. You can withdraw it at any time.'],
                ['Managing volunteers and sending them important updates', 'Your consent. You can withdraw it at any time.'],
                ['Managing partnership enquiries and sending partners important updates', 'Your consent. You can withdraw it at any time.'],
                ['Replying to enquiries and confirming volunteer and partnership submissions', 'Our legitimate interest in responding to you, and taking steps you ask us to take.'],
                ['Recording and acknowledging donations', 'Our legal obligations and legitimate interest in keeping accurate financial records.'],
                ['Understanding how the website is used so we can improve it', 'Our legitimate interest in running an effective website.'],
                ['Keeping the website secure and preventing spam or abuse', 'Our legitimate interest in protecting the website and the people who use it.'],
                ['Managing team access to the admin area', 'Our legitimate interest in running the website securely.'],
              ].map(([purpose, basis]) => (
                <div key={purpose} className="rounded-xl border border-[#1a1917]/10 bg-white p-4">
                  <dt className="font-semibold text-[#1a1917]">{purpose}</dt>
                  <dd className="mt-1 text-[15px]"><span className="text-[#1a1917]/55">Lawful basis: </span>{basis}</dd>
                </div>
              ))}
            </dl>
            <p>We do not sell or rent your personal information, and we do not use it to build advertising profiles.</p>
          </Section>

          <Section id="who-we-share-with" number={4} title="Who we share it with">
            <p>We share information only with the service providers who help us run the website and our communications, and only for those purposes:</p>
            <Bullets>
              <li><Strong>Brevo</Strong> &mdash; sends our newsletters and our emails to volunteers and partners, and holds the subscriber, volunteer and partner lists.</li>
              <li><Strong>Vercel</Strong> &mdash; hosts the website and provides visit statistics.</li>
              <li><Strong>Supabase</Strong> &mdash; stores our news articles, announcements, volunteer registrations and partnership enquiries, and handles team sign-in. It does not hold the newsletter subscriber list.</li>
              <li><Strong>ImprovMX and Google (Gmail)</Strong> &mdash; forward emails sent to our info@ address to our team inbox, which is hosted by Google.</li>
              <li><Strong>Banks</Strong> &mdash; process donations made by bank transfer.</li>
            </Bullets>
            <p>We may also disclose information when the law requires it, for example to a court, regulator or law enforcement agency.</p>
          </Section>

          <Section id="international-transfers" number={5} title="Transfers outside Nigeria">
            <p>
              Some of our service providers process information on servers outside Nigeria, including in Europe and the United States. We choose providers that apply recognised security standards and contractual protections, and we take steps to make sure your information stays protected in line with the NDPA.
            </p>
          </Section>

          <Section id="how-long-we-keep-it" number={6} title="How long we keep it">
            <p>We keep personal information only for as long as we need it for the purposes above.</p>
            <Bullets>
              <li><Strong>Newsletter email address:</Strong> until you unsubscribe or ask us to delete it. We may keep a minimal record that you opted out so that we do not email you again.</li>
              <li><Strong>Enquiries:</Strong> for as long as needed to deal with your message and any follow-up.</li>
              <li><Strong>Donation records:</Strong> for as long as financial and legal record-keeping rules require.</li>
              <li><Strong>Visit statistics:</Strong> in summary form, for a limited period set by our analytics provider.</li>
              <li><Strong>Volunteer registrations:</Strong> until you ask us to delete them or you stop volunteering with us.</li>
              <li><Strong>Partnership enquiries:</Strong> until you ask us to delete them or our partnership discussions end.</li>
              <li><Strong>Team accounts:</Strong> until a person&apos;s access is removed.</li>
            </Bullets>
          </Section>

          <Section id="your-rights" number={7} title="Your rights and choices">
            <p>Under the NDPA you have the right to:</p>
            <Bullets>
              <li>ask whether we hold information about you, and get a copy of it;</li>
              <li>ask us to correct information that is wrong or incomplete;</li>
              <li>ask us to delete your information, or to restrict how we use it;</li>
              <li>object to us using your information based on our legitimate interests;</li>
              <li>withdraw your consent at any time, without affecting what we did before you withdrew it;</li>
              <li>ask for your information in a portable format, where this applies.</li>
            </Bullets>
            <p>
              <Strong>To unsubscribe from the newsletter, or from volunteer or partner updates,</Strong> use the &ldquo;unsubscribe&rdquo; link at the bottom of any email we send, or write to us at <a href={`mailto:${EMAIL}`} className={linkClass}>{EMAIL}</a>.
            </p>
            <p>
              To have your volunteer or partnership details deleted, or to use any other right, email us at the same address. We may need to confirm who you are first, and we will respond as quickly as we can and within the time the law requires.
            </p>
            <p>
              If you are unhappy with how we have handled your information, you also have the right to complain to the{' '}
              <a href="https://ndpc.gov.ng" target="_blank" rel="noopener noreferrer" className={linkClass}>Nigeria Data Protection Commission</a>.
            </p>
          </Section>

          <Section id="cookies-and-links" number={8} title="Cookies and third-party links">
            <p>
              The public pages of this website do not use advertising or tracking cookies, and we do not set cookies on your device when you browse them. You can read more in our <Link href="/cookie-policy" className={linkClass}>Cookie Policy</Link>.
            </p>
            <p>
              Our pages contain links and share buttons for services such as Facebook, Instagram, WhatsApp, LinkedIn and Telegram. These do nothing until you click them. Once you do, you leave our website and that service&apos;s own privacy policy applies, including any cookies it sets.
            </p>
          </Section>

          <Section id="children" number={9} title="Children">
            <p>
              Although our work supports children and young people, this website, our newsletter and our volunteer and partnership forms are meant for adults. We do not knowingly collect personal information about children under 18 through the website.
            </p>
            <p>
              If you believe a child has subscribed to our newsletter, registered or sent us their information, please contact us at <a href={`mailto:${EMAIL}`} className={linkClass}>{EMAIL}</a> and we will delete it promptly.
            </p>
          </Section>

          <Section id="security" number={10} title="Keeping information safe">
            <p>
              We use reasonable technical and organisational measures to protect personal information, including encrypted connections (HTTPS), restricting access to the information you send us to authorised team members, and trusted service providers. No online service is completely risk-free, but we take your privacy seriously and act quickly if something goes wrong.
            </p>
          </Section>

          <Section id="changes" number={11} title="Changes to this policy">
            <p>
              We may update this policy from time to time, for example when we add a new service. The date at the top of this page shows when it was last changed. If we make important changes, we will make them clear on the website.
            </p>
          </Section>

          <Section id="contact" number={12} title="Contact us">
            <p>Questions about this policy or about your information? Get in touch:</p>
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
