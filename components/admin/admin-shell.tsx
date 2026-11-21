'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState, type ReactNode } from 'react'
import { ChartColumn, ExternalLink, LayoutDashboard, LogOut, Megaphone, Menu, Newspaper, Users, X } from 'lucide-react'
import { signOut } from '@/app/admin/actions'

const navItems = [
  { label: 'Overview', href: '/admin', icon: LayoutDashboard },
  { label: 'News', href: '/admin/news', icon: Newspaper },
  { label: 'Announcements', href: '/admin/announcements', icon: Megaphone },
  { label: 'Impact stats', href: '/admin/stats', icon: ChartColumn },
  { label: 'Admins', href: '/admin/admins', icon: Users },
]

function isActive(pathname: string, href: string) {
  return href === '/admin' ? pathname === '/admin' : pathname === href || pathname.startsWith(`${href}/`)
}

function SidebarContent({ email, pathname, onNavigate }: { email: string; pathname: string; onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col">
      <div className="px-6 pb-6 pt-7">
        <p className="font-serif text-2xl tracking-[-0.03em] text-white">DOE <em className="font-normal text-[#ff5fa8]">Admin</em></p>
        <p className="mt-1 text-xs text-white/50">Davida Omosomi Empowerment</p>
      </div>
      <nav aria-label="Admin navigation" className="flex-1 px-3">
        <ul className="flex flex-col gap-1">
          {navItems.map(({ label, href, icon: Icon }) => {
            const active = isActive(pathname, href)
            return (
              <li key={href}>
                <Link
                  href={href}
                  onClick={onNavigate}
                  aria-current={active ? 'page' : undefined}
                  className={`flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-[#ff5fa8] ${active ? 'bg-white text-[#1a1917]' : 'text-white/75 hover:bg-white/10 hover:text-white'}`}
                >
                  <Icon size={18} aria-hidden="true" className={active ? 'text-[#d70063]' : ''} />
                  {label}
                </Link>
              </li>
            )
          })}
          <li className="mt-2 border-t border-white/10 pt-2">
            <Link href="/" target="_blank" className="flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium text-white/75 transition-colors hover:bg-white/10 hover:text-white">
              <ExternalLink size={18} aria-hidden="true" /> View website
            </Link>
          </li>
        </ul>
      </nav>
      <div className="border-t border-white/10 p-4">
        <p className="truncate px-2 text-xs text-white/55" title={email}>{email}</p>
        <form action={signOut} className="mt-2">
          <button type="submit" className="flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-sm font-medium text-white/75 transition-colors hover:bg-white/10 hover:text-white">
            <LogOut size={18} aria-hidden="true" /> Sign out
          </button>
        </form>
      </div>
    </div>
  )
}

export function AdminShell({ email, children }: { email: string; children: ReactNode }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const current = navItems.find((item) => isActive(pathname, item.href))

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <div className="min-h-dvh lg:flex">
      <aside className="hidden w-64 shrink-0 bg-[#1a1917] lg:sticky lg:top-0 lg:block lg:h-dvh">
        <SidebarContent email={email} pathname={pathname} />
      </aside>

      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[#1a1917]/10 bg-[#f8f5ef]/95 px-4 backdrop-blur lg:hidden">
        <p className="font-serif text-xl tracking-[-0.03em]">DOE <em className="font-normal text-[#d70063]">Admin</em><span className="sr-only"> — {current?.label}</span></p>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open admin menu"
          aria-expanded={open}
          aria-controls="admin-mobile-nav"
          className="flex size-11 items-center justify-center rounded-full bg-[#f1c6d7]/50 focus-visible:outline-2 focus-visible:outline-[#d70063]"
        >
          <Menu size={22} aria-hidden="true" />
        </button>
      </header>

      {open && (
        <div className="fixed inset-0 z-40 lg:hidden" role="dialog" aria-modal="true" aria-label="Admin menu" id="admin-mobile-nav">
          <button type="button" aria-label="Close admin menu" className="absolute inset-0 bg-[#1a1917]/50" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-[min(18rem,85vw)] bg-[#1a1917] animate-in slide-in-from-left duration-200">
            <button type="button" onClick={() => setOpen(false)} aria-label="Close admin menu" className="absolute right-3 top-5 flex size-10 items-center justify-center rounded-full text-white/80 hover:bg-white/10">
              <X size={20} aria-hidden="true" />
            </button>
            <SidebarContent email={email} pathname={pathname} onNavigate={() => setOpen(false)} />
          </div>
        </div>
      )}

      <main className="min-w-0 flex-1 px-4 py-6 sm:px-8 sm:py-10">
        <div className="mx-auto max-w-[1100px]">{children}</div>
      </main>
    </div>
  )
}

export function PageHeading({ eyebrow, title, description, action }: { eyebrow?: string; title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow && <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#d70063]">{eyebrow}</p>}
        <h1 className="mt-1 font-serif text-4xl tracking-[-0.04em] sm:text-5xl">{title}</h1>
        {description && <p className="mt-2 max-w-xl text-sm leading-relaxed text-[#1a1917]/60">{description}</p>}
      </div>
      {action}
    </div>
  )
}
