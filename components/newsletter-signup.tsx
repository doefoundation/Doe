'use client'

import { useState, type FormEvent } from 'react'

export function NewsletterSignup() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const subject = encodeURIComponent('Newsletter subscription')
    const body = encodeURIComponent(`Please subscribe ${email} to the DOE Foundation newsletter.`)
    window.location.href = `mailto:thee.doe.foundation@gmail.com?subject=${subject}&body=${body}`
    setMessage('Your email app will open with a subscription request addressed to our team.')
  }

  return (
    <section aria-labelledby="newsletter-heading" className="relative isolate overflow-hidden rounded-[28px] border border-[#d70063]/10 bg-[#f5eaef] px-5 py-10 text-center text-[#1a1917] shadow-[0_24px_70px_-44px_rgba(26,25,23,.32)] sm:rounded-[32px] sm:px-10 sm:py-14">
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-28 -left-12 -z-10 size-80 rounded-full border border-[#d70063]/[0.08]" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-20 left-10 -z-10 size-64 rounded-full border border-white/[0.05]" />
      <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-[#a4004a] sm:text-sm">Get latest updates</p>
      <h2 id="newsletter-heading" className="mt-4 font-sans text-[24px] font-bold tracking-[-0.03em] sm:text-3xl">Sign up for our newsletter</h2>
      <p className="mt-4 text-[15px] text-[#1a1917]/70 sm:text-base">We won&apos;t spam your mailbox.</p>
      <form className="mx-auto mt-6 flex max-w-[640px] flex-col gap-3 sm:mt-7 sm:flex-row sm:items-center sm:rounded-2xl sm:bg-white sm:p-2" onSubmit={handleSubmit}>
        <label htmlFor="newsletter-email" className="sr-only">Email address</label>
        <input id="newsletter-email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Enter your email address" className="min-w-0 flex-1 rounded-xl border border-[#1a1917]/10 bg-white px-5 py-4 text-[16px] text-[#1a1917] outline-none placeholder:text-[#1a1917]/50 focus-visible:ring-2 focus-visible:ring-[#d70063] sm:border-0 sm:bg-transparent" />
        <button type="submit" className="inline-flex min-h-14 items-center justify-center rounded-xl bg-[#b00050] px-7 py-4 text-base font-semibold text-white transition-colors hover:bg-[#900044] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b00050]">Subscribe now</button>
      </form>
      <p className="mx-auto mt-4 max-w-xl text-[13px] leading-relaxed text-[#1a1917]/70 sm:text-sm">Submitting opens an email to our team to request your subscription.</p>
      {message && <p role="status" className="mt-3 text-[15px] font-semibold text-[#1a1917]">{message}</p>}
    </section>
  )
}
