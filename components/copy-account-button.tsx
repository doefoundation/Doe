'use client'

import { useState } from 'react'
import { Check, Copy } from 'lucide-react'

const accountNumber = '1029860127'

export function CopyAccountButton() {
  const [copied, setCopied] = useState(false)

  async function copyAccountNumber() {
    try {
      await navigator.clipboard.writeText(accountNumber)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      setCopied(false)
    }
  }

  return (
    <button type="button" onClick={copyAccountNumber} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
      {copied ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
      {copied ? 'Copied' : 'Copy account'}
    </button>
  )
}
