import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

const links = [
  { label: 'Programs', href: '/programs' },
  { label: 'Our Team', href: '/our-team' },
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Volunteer', href: 'mailto:hello@doefoundation.org?subject=Volunteering%20with%20DOE%20Foundation' },
  { label: 'Donate', href: 'mailto:hello@doefoundation.org?subject=Supporting%20DOE%20Foundation' },
  { label: 'Contact Us', href: 'mailto:hello@doefoundation.org' },
  { label: 'News Content', href: '/#testimonials' },
  { label: 'Cookie Policy', href: '/cookie-policy' },
]

export function SiteFooter() {
  return (
    <footer className="bg-[#1a1917] px-5 py-12 text-white sm:px-8 sm:py-16">
      <div className="mx-auto grid max-w-[1200px] gap-10 md:grid-cols-[1fr_1.4fr] md:items-start">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#f1a4c3]">Get in touch</p>
          <h2 className="mt-4 max-w-sm font-serif text-4xl leading-tight tracking-[-0.04em] sm:text-5xl">Let&apos;s open more doors.</h2>
          <a href="mailto:hello@doefoundation.org" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-white/80 transition-colors hover:text-white">hello@doefoundation.org <ArrowUpRight size={16} aria-hidden="true" /></a>
        </div>
        <nav aria-label="Get in touch">
          <ul className="grid grid-cols-2 gap-x-6 gap-y-1 sm:grid-cols-3">
            {links.map((link) => (
              <li key={link.label}>
                <Link href={link.href} className="flex min-h-12 items-center justify-between border-b border-white/10 py-3 text-sm text-white/75 transition-colors hover:text-[#f1a4c3] focus-visible:outline-2 focus-visible:outline-[#f1a4c3]">
                  {link.label}<ArrowUpRight size={14} aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="mx-auto mt-12 flex max-w-[1200px] flex-col gap-2 border-t border-white/10 pt-6 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
        <p>© 2026 The Davida Omosomi Empowerment Foundation</p>
        <p>Registered as an Incorporated Trustee in Nigeria</p>
      </div>
    </footer>
  )
}
