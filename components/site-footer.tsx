import Link from 'next/link'
import { ArrowRight, Mail, MapPin, Phone } from 'lucide-react'
import { NewsletterSignup } from '@/components/newsletter-signup'

const logoUrl = 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/file_00000000ebbc8243b1a46e16cc7df432-Ey2WCQZAaBoXSQKqIEQgRVc2ePrSvh.png'

const quickLinks = [
  { label: 'Programs', href: '/programs' },
  { label: 'Our Team', href: '/our-team' },
  { label: 'Our Impact', href: '/#our-impact' },
  { label: 'Testimonials', href: '/#testimonials' },
  { label: 'Our Partners', href: '/#our-partners' },
  { label: 'Newsletters', href: '/#newsletter-heading' },
  { label: 'Volunteer', href: '/volunteer' },
  { label: 'Partner With Us', href: '/partner' },
  { label: 'Donate', href: '/donate' },
  { label: 'Contact Us', href: 'mailto:info@thedoefoundation.com' },
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Cookie Policy', href: '/cookie-policy' },
]

const socialLinks = [
  { name: 'Facebook', href: 'https://www.facebook.com/share/16YXz6DD8T5/', path: 'M13.5 21v-8h2.7l.4-3.1h-3.1V8c0-.9.3-1.5 1.6-1.5h1.7V3.7c-.3 0-1.4-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.1H7.3V13h2.8v8h3.4Z' },
  { name: 'LinkedIn', href: 'https://www.linkedin.com/company/thee-davida-omosomi-empowerment-foundation/', path: 'M5.2 8.3a1.8 1.8 0 1 0 0-3.6 1.8 1.8 0 0 0 0 3.6ZM3.7 9.7h3v10h-3zM9 9.7h2.9v1.4h.1a3.2 3.2 0 0 1 2.9-1.6c3.1 0 3.7 2 3.7 4.5v5.7h-3v-5.1c0-1.2 0-2.7-1.7-2.7s-2 1.3-2 2.6v5.2H9z' },
  { name: 'Instagram', href: 'https://www.instagram.com/the_doe_foundation?obrf=MTQ3czczNmVtcGkyZA==', path: 'M7.5 3h9A4.5 4.5 0 0 1 21 7.5v9a4.5 4.5 0 0 1-4.5 4.5h-9A4.5 4.5 0 0 1 3 16.5v-9A4.5 4.5 0 0 1 7.5 3Zm0 1.8a2.7 2.7 0 0 0-2.7 2.7v9a2.7 2.7 0 0 0 2.7 2.7h9a2.7 2.7 0 0 0 2.7-2.7v-9a2.7 2.7 0 0 0-2.7-2.7h-9Zm4.5 2.4a4.8 4.8 0 1 1 0 9.6 4.8 4.8 0 0 1 0-9.6Zm0 1.8a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm5.1-3a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4Z' },
  { name: 'WhatsApp', href: 'https://wa.link/sq0qzb', path: 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.472-.148-.67.15-.198.297-.768.967-.941 1.166-.173.198-.347.223-.644.074-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.058-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.297-.496.099-.198.05-.372-.025-.521-.074-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479s1.065 2.875 1.213 3.074c.149.198 2.095 3.2 5.077 4.487.71.306 1.264.489 1.695.626.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982 1-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.002-5.45 4.439-9.886 9.893-9.884 2.64.001 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.002 5.45-4.439 9.886-9.892 9.884m8.406-18.292A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.893c-.001 2.096.547 4.142 1.588 5.946L.057 24l6.304-1.654a11.88 11.88 0 0 0 5.684 1.447h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.486-8.407Z' },
]

export function SiteFooter() {
  return (
    <footer className="bg-[#f8f5ef] text-[#1a1917]">
      <div className="mx-auto max-w-[1200px] px-5 pb-10 pt-12 sm:px-8 sm:pb-14 sm:pt-16">
        <NewsletterSignup />
      </div>

      <div className="bg-[#f8f5ef] px-5 py-14 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-[1200px]">
          <div className="flex flex-col items-start gap-3 border-b border-[#1a1917]/12 pb-10 sm:flex-row sm:items-center sm:gap-8 sm:pb-12">
            <Link href="/" scroll aria-label="DOE Foundation home" className="inline-flex shrink-0">
              <img src={logoUrl} alt="DOE Foundation" className="h-[80px] w-auto object-contain mix-blend-multiply sm:h-[92px]" />
            </Link>
            <p className="w-full font-serif text-[15px] leading-relaxed text-[#1a1917]/75 sm:text-[16px]">The Davida Omosomi Empowerment Foundation is a child- and youth-focused nonprofit dedicated to raising purposeful leaders through advocacy, literacy, and community-centered initiatives.</p>
          </div>

          <div className="mt-10 grid gap-12 lg:grid-cols-[.85fr_1.15fr] lg:gap-16">
          <nav aria-label="Quick links">
            <h2 className="mb-5 text-[22px] font-semibold tracking-[-0.02em] text-[#1a243b] sm:text-2xl">Quick Links</h2>
            <ul className="grid gap-1">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} scroll className="group flex min-h-10 items-center gap-3 py-2 font-serif text-[15px] text-[#1a1917] transition-colors hover:text-[#137d48] focus-visible:outline-2 focus-visible:outline-[#137d48]">
                    <ArrowRight size={19} strokeWidth={1.8} aria-hidden="true" className="shrink-0 transition-transform group-hover:translate-x-0.5" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <section aria-labelledby="footer-contact-heading">
            <h2 id="footer-contact-heading" className="mb-5 text-[22px] font-semibold tracking-[-0.02em] text-[#1a243b] sm:text-2xl">Contact Us</h2>
            <div className="grid gap-4">
              <a href="tel:+2349066555162" className="flex items-center gap-4 font-serif text-[15px] leading-relaxed text-[#1a243b] transition-colors hover:text-[#137d48]">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-white shadow-sm"><Phone size={21} strokeWidth={1.8} aria-hidden="true" /></span>
                +234 906 655 5162
              </a>
                            <a href="mailto:info@thedoefoundation.com" className="flex items-center gap-4 break-all font-serif text-[15px] leading-relaxed text-[#1a243b] transition-colors hover:text-[#137d48]">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-white shadow-sm"><Mail size={21} strokeWidth={1.8} aria-hidden="true" /></span>
               info@thedoefoundation.com
              </a>
              <a href="https://maps.google.com/?q=Kuje%2C+Abuja" target="_blank" rel="noreferrer" className="flex items-start gap-4 font-serif text-[15px] leading-relaxed text-[#1a243b] transition-colors hover:text-[#137d48]">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-white shadow-sm"><MapPin size={21} strokeWidth={1.8} aria-hidden="true" /></span>
                Abuja, Nigeria
              </a>
            </div>
            <div className="mt-7 flex flex-wrap gap-3" aria-label="DOE Foundation social media">
              {socialLinks.map((social) => (
                <a key={social.name} href={social.href} target="_blank" rel="noreferrer" aria-label={`DOE Foundation on ${social.name}`} title={social.name} className="flex size-11 items-center justify-center rounded-full bg-white text-[#67707a] shadow-sm transition-colors hover:text-[#137d48] focus-visible:outline-2 focus-visible:outline-[#137d48]">
                  <svg viewBox="0 0 24 24" className="size-[19px]" fill="currentColor" aria-hidden="true"><path d={social.path} /></svg>
                </a>
              ))}
            </div>
          </section>
          </div>
        </div>
      </div>

      <div className="bg-[#f8f5ef] px-5 py-6 text-center text-[#1a243b] sm:px-8">
        <div className="mx-auto grid max-w-[1200px] gap-2 font-serif text-[13px] font-medium leading-relaxed sm:grid-cols-3 sm:items-center sm:text-[15px]">
          <p>© 2026 The Davida Omosomi Empowerment Foundation</p>
          <p>Registered as an Incorporated Trustee in Nigeria</p>
          <p>Made with ❤️ by CJ</p>
        </div>
      </div>
    </footer>
  )
}
