'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Check, Link2, MessageCircle, Send, Share2 } from 'lucide-react'

type Props = { url: string; title: string; summary?: string }

const iconProps = { width: 18, height: 18, viewBox: '0 0 24 24', 'aria-hidden': true } as const

function FacebookIcon() {
  return (
    <svg {...iconProps} fill="currentColor">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  )
}

function LinkedInIcon() {
  return (
    <svg {...iconProps} fill="currentColor">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  )
}

function InstagramIcon() {
  return (
    <svg {...iconProps} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  )
}

const pill =
  'inline-flex min-h-11 items-center gap-2.5 rounded-full border border-[#1a1917]/12 bg-white py-1.5 pl-1.5 pr-4 text-sm font-semibold text-[#1a1917] transition-colors hover:border-[#d70063] hover:text-[#d70063] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d70063]'

function Badge({ color, children }: { color: string; children: ReactNode }) {
  return (
    <span className="flex size-8 shrink-0 items-center justify-center rounded-full text-white" style={{ background: color }}>
      {children}
    </span>
  )
}

async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    try {
      const field = document.createElement('textarea')
      field.value = text
      field.setAttribute('readonly', '')
      field.style.position = 'fixed'
      field.style.opacity = '0'
      document.body.appendChild(field)
      field.select()
      const copied = document.execCommand('copy')
      document.body.removeChild(field)
      return copied
    } catch {
      return false
    }
  }
}

export function ShareButtons({ url, title, summary }: Props) {
  const [canNativeShare, setCanNativeShare] = useState(false)
  const [notice, setNotice] = useState('')
  const [copied, setCopied] = useState(false)
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => {
    setCanNativeShare(typeof navigator !== 'undefined' && typeof navigator.share === 'function')
    return () => window.clearTimeout(timer.current)
  }, [])

  function announce(message: string) {
    setNotice(message)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => {
      setNotice('')
      setCopied(false)
    }, 4500)
  }

  async function nativeShare() {
    try {
      await navigator.share({ title, text: summary || title, url })
    } catch {
      /* the person closed the share sheet */
    }
  }

  async function copyLink() {
    const ok = await copyToClipboard(url)
    setCopied(ok)
    announce(ok ? 'Link copied.' : 'Could not copy the link. Please copy it from the address bar.')
  }

  async function shareToInstagram() {
    // Instagram has no web share link. On phones the share sheet lists Instagram; elsewhere we copy the link.
    if (canNativeShare) {
      await nativeShare()
      return
    }
    const ok = await copyToClipboard(url)
    announce(ok ? 'Link copied. Open Instagram and paste it into your story, post or bio.' : 'Could not copy the link. Please copy it from the address bar.')
  }

  const encodedUrl = encodeURIComponent(url)
  const links = [
    { name: 'WhatsApp', color: '#25D366', href: `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`, icon: <MessageCircle size={18} aria-hidden="true" /> },
    { name: 'Facebook', color: '#1877F2', href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, icon: <FacebookIcon /> },
    { name: 'LinkedIn', color: '#0A66C2', href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`, icon: <LinkedInIcon /> },
    { name: 'Telegram', color: '#229ED9', href: `https://t.me/share/url?url=${encodedUrl}&text=${encodeURIComponent(title)}`, icon: <Send size={17} aria-hidden="true" /> },
  ]

  return (
    <section aria-labelledby="share-heading" className="mt-14 border-t border-[#1a1917]/12 pt-8">
      <h2 id="share-heading" className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#d70063]">Share this story</h2>
      <ul className="mt-4 flex flex-wrap gap-2.5">
        {canNativeShare && (
          <li>
            <button type="button" onClick={nativeShare} className={pill}>
              <Badge color="#1a1917"><Share2 size={16} aria-hidden="true" /></Badge>
              Share…
            </button>
          </li>
        )}
        {links.map((link) => (
          <li key={link.name}>
            <a href={link.href} target="_blank" rel="noopener noreferrer" aria-label={`Share on ${link.name} (opens in a new tab)`} className={pill}>
              <Badge color={link.color}>{link.icon}</Badge>
              {link.name}
            </a>
          </li>
        ))}
        <li>
          <button type="button" onClick={shareToInstagram} className={pill}>
            <Badge color="linear-gradient(135deg,#feda75,#fa7e1e 30%,#d62976 60%,#962fbf 85%,#4f5bd5)"><InstagramIcon /></Badge>
            Instagram
          </button>
        </li>
        <li>
          <button type="button" onClick={copyLink} className={pill}>
            <Badge color="#6b6a66">{copied ? <Check size={16} aria-hidden="true" /> : <Link2 size={16} aria-hidden="true" />}</Badge>
            {copied ? 'Copied' : 'Copy link'}
          </button>
        </li>
      </ul>
      <p role="status" aria-live="polite" className="mt-3 min-h-5 text-sm text-[#1a1917]/65">{notice}</p>
    </section>
  )
 }
