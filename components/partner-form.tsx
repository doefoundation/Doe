'use client'

import Link from 'next/link'
import { useActionState, useEffect, useState } from 'react'
import { useFormStatus } from 'react-dom'
import { CircleCheck, LoaderCircle } from 'lucide-react'
import { registerPartner } from '@/app/actions/partner'
import { partnerInterests } from '@/lib/partner'

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
      {pending ? 'Sending…' : 'Send my details'}
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

export function PartnerForm() {
  const [state, action] = useActionState(registerPartner, null)
  const [startedAt, setStartedAt] = useState('')
  const [partnerType, setPartnerType] = useState<'individual' | 'organisation'>('individual')
  const [fullName, setFullName] = useState('')
  const [organisation, setOrganisation] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [interest, setInterest] = useState('')
  const [message, setMessage] = useState('')
  const [heardFrom, setHeardFrom] = useState('')
  const [agreed, setAgreed] = useState(false)

  useEffect(() => {
    setStartedAt(String(Date.now()))
  }, [])

  if (state?.status === 'success') {
    return (
      <div role="status" className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6 text-emerald-900 sm:p-8">
        <CircleCheck size={32} aria-hidden="true" />
        <h2 className="mt-3 font-serif text-3xl tracking-[-0.03em]">Thank you</h2>
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
      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 text-sm font-semibold text-[#1a1917]">I am partnering as</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {(['individual', 'organisation'] as const).map((type) => (
            <label
              key={type}
              className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3.5 text-sm font-semibold transition-colors ${partnerType === type ? 'border-[#d70063] bg-[#f1c6d7]/30' : 'border-[#1a1917]/15 bg-white'}`}
            >
              <input type="radio" name="partner_type" value={type} checked={partnerType === type} onChange={() => setPartnerType(type)} className="size-5 accent-[#d70063]" />
              {type === 'individual' ? 'An individual' : 'An organisation'}
            </label>
          ))}
        </div>
      </fieldset>

      {partnerType === 'organisation' && (
        <div className="flex flex-col gap-2">
          <Label htmlFor="organisation_name">Organisation name</Label>
          <input id="organisation_name" name="organisation_name" type="text" required autoComplete="organization" maxLength={150} value={organisation} onChange={(event) => setOrganisation(event.target.value)} placeholder="Name of your organisation" className={fieldClass} />
        </div>
      )}

      <div className="flex flex-col gap-2">
        <Label htmlFor="full_name">{partnerType === 'organisation' ? 'Contact person’s full name' : 'Full name'}</Label>
        <input id="full_name" name="full_name" type="text" required autoComplete="name" maxLength={120} value={fullName} onChange={(event) => setFullName(event.target.value)} placeholder="First and last name" className={fieldClass} />
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
        <Label htmlFor="interest">How would you like to partner with us?</Label>
        <select id="interest" name="interest" required value={interest} onChange={(event) => setInterest(event.target.value)} className={fieldClass}>
          <option value="" disabled>Select an option</option>
          {partnerInterests.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="message">Tell us about your idea</Label>
        <textarea id="message" name="message" required rows={5} maxLength={1500} value={message} onChange={(event) => setMessage(event.target.value)} placeholder="What would you like to do together, and what would you like to achieve?" className={fieldClass} />
        <p className="text-xs text-[#1a1917]/50">{message.length}/1500</p>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="heard_from" optional>How did you hear about us?</Label>
        <input id="heard_from" name="heard_from" type="text" maxLength={150} value={heardFrom} onChange={(event) => setHeardFrom(event.target.value)} placeholder="Social media, a friend, an event…" className={fieldClass} />
      </div>

      {/* Hidden spam traps: real visitors never see or fill these in. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="partner-website">Leave this field empty</label>
        <input id="partner-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <input type="hidden" name="started_at" value={startedAt} />

      <label htmlFor="consent" className="flex cursor-pointer items-start gap-3 rounded-xl bg-[#f8f5ef] p-4 text-sm leading-relaxed text-[#1a1917]/80">
        <input id="consent" name="consent" type="checkbox" required checked={agreed} onChange={(event) => setAgreed(event.target.checked)} className="mt-0.5 size-5 shrink-0 cursor-pointer accent-[#d70063] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d70063]" />
        <span>
          I agree that the DOE Foundation may send me important information and contact me about partnership. I have read and agree to the{' '}
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
