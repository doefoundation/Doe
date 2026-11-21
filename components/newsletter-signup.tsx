'use client'

import Link from 'next/link'
import { useActionState, useEffect, useState } from 'react'
import { useFormStatus } from 'react-dom'
import { subscribeToNewsletter } from '@/app/actions/newsletter'

function SubscribeButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex min-h-14 items-center justify-center rounded-xl bg-[#a4004a] px-7 py-4 text-base font-semibold text-white transition-colors hover:bg-[#87003d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-wait disabled:opacity-70"
    >
      {pending ? 'Subscribing…' : 'Subscribe now'}
    </button>
  )
}

export function NewsletterSignup() {
  const [state, action] = useActionState(subscribeToNewsletter, null)
  const [startedAt, setStartedAt] = useState('')
  const [email, setEmail] = useState('')
  const [agreed, setAgreed] = useState(false)

  useEffect(() => {
    setStartedAt(String(Date.now()))
  }, [])

  // Clear the form after a successful signup; keep what was typed if something went wrong.
  useEffect(() => {
    if (state?.status === 'success') {
      setEmail('')
      setAgreed(false)
    }
  }, [state])

  return (
    <section aria-labelledby="newsletter-heading" className="relative isolate overflow-hidden rounded-[28px] border border-white/20 bg-[#d70063] px-5 py-10 text-center text-white shadow-[0_24px_70px_-36px_rgba(215,0,99,.38)] sm:rounded-[32px] sm:px-10 sm:py-14">
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-28 -left-12 -z-10 size-80 rounded-full border border-white/[0.12]" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-20 left-10 -z-10 size-64 rounded-full border border-white/[0.05]" />
      <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-white/90 sm:text-sm">Get latest updates</p>
      <h2 id="newsletter-heading" className="mt-4 font-sans text-[24px] font-bold tracking-[-0.03em] sm:text-3xl">Sign up for our newsletter</h2>
      <p className="mt-4 text-[15px] text-white/90 sm:text-base">We won&apos;t spam your mailbox.</p>

      <form action={action} className="mx-auto mt-6 max-w-[640px] sm:mt-7">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:rounded-2xl sm:bg-white sm:p-2">
          <label htmlFor="newsletter-email" className="sr-only">Email address</label>
          <input
            id="newsletter-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            maxLength={254}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Enter your email address"
            className="min-w-0 flex-1 rounded-xl border border-[#1a1917]/10 bg-white px-5 py-4 text-[16px] text-[#1a1917] outline-none placeholder:text-[#1a1917]/50 focus-visible:ring-2 focus-visible:ring-[#d70063] sm:border-0 sm:bg-transparent"
          />
          <SubscribeButton />
        </div>

        <label htmlFor="newsletter-consent" className="mt-4 flex cursor-pointer items-start justify-center gap-3 text-left text-[13px] leading-relaxed text-white/95 sm:text-sm">
          <input
            id="newsletter-consent"
            name="consent"
            type="checkbox"
            required
            checked={agreed}
            onChange={(event) => setAgreed(event.target.checked)}
            className="mt-0.5 size-5 shrink-0 cursor-pointer accent-[#a4004a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          />
          <span>
            I have read and agree to the{' '}
            <Link href="/privacy-policy" target="_blank" rel="noopener" className="font-semibold underline underline-offset-4 hover:no-underline">
              Privacy Policy
            </Link>
            , and I agree to receive occasional updates from DOE Foundation. I can unsubscribe at any time.
          </span>
        </label>

        {/* Hidden spam traps: real visitors never see or fill these in. */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
          <label htmlFor="newsletter-website">Leave this field empty</label>
          <input id="newsletter-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
        </div>
        <input type="hidden" name="started_at" value={startedAt} />
      </form>

      {state && (
        <p role={state.status === 'error' ? 'alert' : 'status'} className="mt-4 text-[15px] font-semibold text-white">
          {state.message}
        </p>
      )}
    </section>
  )
}
