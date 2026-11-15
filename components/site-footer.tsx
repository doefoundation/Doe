import Link from 'next/link'
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
    <footer className="bg-[#eee3da] px-5 py-10 text-[#1a1917] sm:px-8 sm:py-14">
      <div className="mx-auto grid max-w-[1200px] gap-10 rounded-[2rem] bg-[#f8f5ef] p-6 shadow-[0_24px_70px_-44px_rgba(26,25,23,.45)] sm:p-10 md:grid-cols-[1fr_1.4fr] md:items-start">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#b00050]">Get in touch</p>
          <h2 className="mt-4 max-w-sm font-serif text-4xl leading-tight tracking-[-0.04em] sm:text-5xl">Let&apos;s open more doors.</h2>
          <a href="mailto:hello@doefoundation.org" className="mt-6 inline-flex min-h-12 items-center rounded-full bg-[#d70063] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#b80054] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d70063]">hello@doefoundation.org</a>
        </div>
        <nav aria-label="Get in touch">
          <ul className="grid grid-cols-2 gap-x-6 gap-y-1 sm:grid-cols-3">
            {links.map((link) => (
              <li key={link.label}>
                <Link href={link.href} scroll className="flex min-h-12 items-center border-b border-[#1a1917]/12 py-3 text-sm font-medium text-[#1a1917]/85 transition-colors hover:text-[#b00050] focus-visible:outline-2 focus-visible:outline-[#d70063]">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="mx-auto mt-8 flex max-w-[1200px] flex-col gap-2 border-t border-[#1a1917]/10 pt-6 text-xs text-[#1a1917]/65 sm:mt-10 sm:flex-row sm:items-center sm:justify-between">
        <p>© 2026 The Davida Omosomi Empowerment Foundation</p>
        <p>Registered as an Incorporated Trustee in Nigeria</p>
      </div>
    </footer>
  )
}
