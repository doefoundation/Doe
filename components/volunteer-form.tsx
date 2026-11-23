'use client'

import Link from 'next/link'
import { useActionState, useEffect, useState } from 'react'
import { useFormStatus } from 'react-dom'
import { CircleCheck, LoaderCircle } from 'lucide-react'
import { registerVolunteer } from '@/app/actions/volunteer'

const fieldClass =
  'w-full rounded-xl border border-[#1a1917]/15 bg-white px-4 py-3.5 text-base text-[#1a1917] outline-none transition-colors placeholder:text-[#1a1917]/40 focus-visible:border-[#d70063] focus-visible:ring-2 focus-visible:ring-[#d70063]/25'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-xl bg-[#d70063] px-7 py-4 text-base font-semibold text-white transition-colors hover:bg-[#b80055] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d70063] disabled:cursor-wait disabled:opacity-70"
    >
      {pending && <LoaderCircle size={18} className="animate-spin" aria-hidden="true" />}
      {pending ? 'Submitting…' : 'Register as a volunteer'}
    </button>
  )
}

function Label({ htmlFor, children, optional }: { htmlFor: string; children: string; optional?: boolean }) {
  return (
    <label htmlFor={htmlFor} className="text-sm font-semibold text-[#1a1917]">
      {children} {optional && <span className="font-normal text-[#1a1917]/50">(optional)</span>}
    </label>
  )
}

export function VolunteerForm() {
  const [state, action] = useActionState(registerVolunteer, null)
  const [startedAt, setStartedAt] = useState('')
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [reason, setReason] = useState('')
  const [otherInfo, setOtherInfo] = useState('')
  const [agreed, setAgreed] = useState(false)

  useEffect(() => {
    setStartedAt(String(Date.now()))
  }, [])

  if (state?.status === 'success') {
    return (
      <div role="status" className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6 text-emerald-900 sm:p-8">
        <CircleCheck size={32} aria-hidden="true" />
        <h2 className="mt-3 font-serif text-3xl tracking-[-0.03em]">You are registered</h2>
        <p className="mt-3 text-[15px] leading-relaxed">{state.message}</p>
        <p className="mt-3 text-[15px] leading-relaxed">If you do not see the email, please check your spam or promotions folder.</p>
        <Link href="/" className="mt-6 inline-flex min-h-12 items-center rounded-full bg-emerald-900 px-6 text-sm font-semibold text-white hover:bg-emerald-950">
          Back to the homepage
        </Link>
      </div>
    )
  }

  return (
    <form action={action} className="flex flex-col gap-5 rounded-3xl border border-[#1a1917]/10 bg-white p-5 shadow-[0_24px_70px_-44px_rgba(26,25,23,.35)] sm:p-8">
      <div className="flex flex-col gap-2">
        <Label htmlFor="full_name">Full name</Label>
        <input id="full_name" name="full_name" type="text" required autoComplete="name" maxLength={120} value={fullName} onChange={(event) => setFullName(event.target.value)} placeholder="Your first and last name" className={fieldClass} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="phone">Phone number</Label>
          <input id="phone" name="phone" type="tel" inputMode="tel" required autoComplete="tel" maxLength={25} value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="+234 801 234 5678" className={fieldClass} />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Email address</Label>
          <input id="email" name="email" type="email" required autoComplete="email" maxLength={254} value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" className={fieldClass} />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="reason">Why do you want to volunteer?</Label>
        <textarea id="reason" name="reason" required rows={5} maxLength={1000} value={reason} onChange={(event) => setReason(event.target.value)} placeholder="Tell us what motivates you and how you would like to help." className={fieldClass} />
        <p className="text-xs text-[#1a1917]/50">{reason.length}/1000</p>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="other_info" optional>Other information</Label>
        <textarea id="other_info" name="other_info" rows={4} maxLength={1000} value={otherInfo} onChange={(event) => setOtherInfo(event.target.value)} placeholder="Skills, experience, availability, or anything else you would like us to know." className={fieldClass} />
      </div>

      {/* Hidden spam traps: real visitors never see or fill these in. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="volunteer-website">Leave this field empty</label>
        <input id="volunteer-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <input type="hidden" name="started_at" value={startedAt} />

      <label htmlFor="consent" className="flex cursor-pointer items-start gap-3 rounded-xl bg-[#f8f5ef] p-4 text-sm leading-relaxed text-[#1a1917]/80">
        <input id="consent" name="consent" type="checkbox" required checked={agreed} onChange={(event) => setAgreed(event.target.checked)} className="mt-0.5 size-5 shrink-0 cursor-pointer accent-[#d70063] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d70063]" />
        <span>
          I understand that important updates will be sent to me occasionally. I have read and agree to the{' '}
          <Link href="/privacy-policy" target="_blank" rel="noopener" className="font-semibold text-[#d70063] underline underline-offset-4 hover:no-underline">
            Privacy Policy
          </Link>
          .
        </span>
      </label>

      {state?.status === 'error' && (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
          {state.message}
        </p>
      )}

      <SubmitButton />
    </form>
  )
}
