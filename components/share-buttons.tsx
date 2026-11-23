'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Check, Link2, Share2 } from 'lucide-react'

type Props = { url: string; title: string; summary?: string }

const svgProps = { width: 18, height: 18, viewBox: '0 0 24 24', 'aria-hidden': true, focusable: false } as const

/* ---------- Brand SVG icons ---------- */

function WhatsAppIcon() {
  return (
    <svg {...svgProps} fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

function FacebookIcon() {
  return (
    <svg {...svgProps} fill="currentColor">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  )
}

function XIcon() {
  return (
    <svg {...svgProps} fill="currentColor">
      <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
    </svg>
  )
}

function LinkedInIcon() {
  return (
    <svg {...svgProps} fill="currentColor">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  )
}

function TelegramIcon() {
  return (
    <svg {...svgProps} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  )
}

function InstagramIcon() {
  return (
    <svg {...svgProps} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  )
}

/* ---------- Shared sharing logic ---------- */

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

function useShare({ url, title, summary }: Props) {
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
    { name: 'WhatsApp', color: '#25D366', href: `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`, icon: <WhatsAppIcon /> },
    { name: 'Facebook', color: '#1877F2', href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, icon: <FacebookIcon /> },
    { name: 'X', color: '#000000', href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodeURIComponent(title)}`, icon: <XIcon /> },
    { name: 'LinkedIn', color: '#0A66C2', href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`, icon: <LinkedInIcon /> },
    { name: 'Telegram', color: '#229ED9', href: `https://t.me/share/url?url=${encodedUrl}&text=${encodeURIComponent(title)}`, icon: <TelegramIcon /> },
  ]

  return { canNativeShare, notice, copied, nativeShare, copyLink, shareToInstagram, links }
}

const INSTAGRAM_GRADIENT = 'linear-gradient(135deg,#feda75,#fa7e1e 30%,#d62976 60%,#962fbf 85%,#4f5bd5)'

/* ---------- Compact icon row (top of the article) ---------- */

const roundButton =
  'flex size-11 shrink-0 items-center justify-center rounded-full text-white transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d70063]'

export function ShareIconBar({ url, title, summary }: Props) {
  const { canNativeShare, notice, copied, nativeShare, copyLink, shareToInstagram, links } = useShare({ url, title, summary })

  return (
    <div className="mt-8">
      <div className="flex flex-wrap items-center gap-2.5">
        <span className="mr-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#1a1917]/55">Share</span>
        {links.map((link) => (
          <a
            key={link.name}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Share on ${link.name} (opens in a new tab)`}
            title={link.name}
            className={roundButton}
            style={{ background: link.color }}
          >
            {link.icon}
          </a>
        ))}
        <button type="button" onClick={shareToInstagram} aria-label="Share on Instagram" title="Instagram" className={roundButton} style={{ background: INSTAGRAM_GRADIENT }}>
          <InstagramIcon />
        </button>
        {canNativeShare && (
          <button type="button" onClick={nativeShare} aria-label="More sharing options" title="More" className={roundButton} style={{ background: '#1a1917' }}>
            <Share2 size={18} aria-hidden="true" />
          </button>
        )}
        <button type="button" onClick={copyLink} aria-label="Copy link" title="Copy link" className={roundButton} style={{ background: '#6b6a66' }}>
          {copied ? <Check size={18} aria-hidden="true" /> : <Link2 size={18} aria-hidden="true" />}
        </button>
      </div>
      <p role="status" aria-live="polite" className="mt-2 min-h-5 text-sm text-[#1a1917]/65">{notice}</p>
    </div>
  )
}

/* ---------- Labelled buttons (bottom of the article) ---------- */

const pill =
  'inline-flex min-h-11 items-center gap-2.5 rounded-full border border-[#1a1917]/12 bg-white py-1.5 pl-1.5 pr-4 text-sm font-semibold text-[#1a1917] transition-colors hover:border-[#d70063] hover:text-[#d70063] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d70063]'

function Badge({ color, children }: { color: string; children: ReactNode }) {
  return (
    <span className="flex size-8 shrink-0 items-center justify-center rounded-full text-white" style={{ background: color }}>
      {children}
    </span>
  )
}

export function ShareButtons({ url, title, summary }: Props) {
  const { canNativeShare, notice, copied, nativeShare, copyLink, shareToInstagram, links } = useShare({ url, title, summary })

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
            <Badge color={INSTAGRAM_GRADIENT}><InstagramIcon /></Badge>
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
