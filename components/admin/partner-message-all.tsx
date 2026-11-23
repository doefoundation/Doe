'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { CheckCircle2, LoaderCircle, Mail, Send } from 'lucide-react'
import { sendPartnerCampaign, sendPartnerTest } from '@/app/admin/partner-actions'
import { buildPartnerMessageEmail } from '@/lib/partner-email'

type Props = { siteUrl: string; senderLabel: string; partnerCount: number | null; defaultEmail: string }

const inputClass = 'w-full rounded-xl border border-[#1a1917]/15 bg-white px-4 py-3 text-base outline-none focus-visible:border-[#d70063] focus-visible:ring-2 focus-visible:ring-[#d70063]/25 sm:text-sm'

export function PartnerMessageAll({ siteUrl, senderLabel, partnerCount, defaultEmail }: Props) {
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [testEmail, setTestEmail] = useState(defaultEmail)
  const [campaignId, setCampaignId] = useState<number | null>(null)
  const [testedKey, setTestedKey] = useState('')
  const [testMessage, setTestMessage] = useState('')
  const [checked, setChecked] = useState(false)
  const [busy, setBusy] = useState<'test' | 'send' | null>(null)
  const [error, setError] = useState('')
  const [sentMessage, setSentMessage] = useState('')

  const currentKey = JSON.stringify([subject.trim(), message.trim()])
  const testIsCurrent = campaignId !== null && testedKey === currentKey
  const countLabel = partnerCount === null ? 'all partners' : `${partnerCount} ${partnerCount === 1 ? 'partner' : 'partners'}`
  const canSend = testIsCurrent && checked && busy === null && partnerCount !== 0

  const previewHtml = useMemo(
    () => buildPartnerMessageEmail({ mode: 'campaign', subject: subject.trim() || 'Your subject appears here', message: message.trim() || 'Your message appears here.', siteUrl, unsubscribeUrl: '#', mirrorUrl: '#' }).html,
    [subject, message, siteUrl],
  )

  async function handleTest() {
    setError('')
    setBusy('test')
    const result = await sendPartnerTest(subject, message, testEmail, campaignId)
    setBusy(null)
    if (!result.ok) {
      setError(result.error)
      return
    }
    setCampaignId(result.campaignId ?? null)
    setTestedKey(currentKey)
    setTestMessage(result.message)
    setChecked(false)
  }

  async function handleSend() {
    if (campaignId === null) return
    setError('')
    setBusy('send')
    const result = await sendPartnerCampaign(campaignId, subject, message)
    setBusy(null)
    if (!result.ok) {
      setError(result.error)
      return
    }
    setSentMessage(result.message)
  }

  if (sentMessage) {
    return (
      <section className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-emerald-900 sm:p-8">
        <CheckCircle2 size={28} aria-hidden="true" />
        <h2 className="mt-3 font-serif text-3xl tracking-[-0.03em]">Message sent</h2>
        <p className="mt-2 text-sm leading-relaxed">{sentMessage} Opens, clicks and unsubscribes appear in the campaign report in Brevo.</p>
        <Link href="/admin/partners" className="mt-5 inline-flex min-h-11 items-center rounded-full bg-emerald-900 px-5 text-sm font-semibold text-white hover:bg-emerald-950">
          Back to partners
        </Link>
      </section>
    )
  }

  return (
    <div className="flex flex-col gap-5">
      <section className="rounded-2xl border border-[#1a1917]/10 bg-white p-5 sm:p-6">
        <h2 className="font-semibold">Write your message</h2>
        <p className="mt-1 text-sm text-[#1a1917]/60">From {senderLabel} to {countLabel}.</p>
        <div className="mt-4 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="partner-all-subject" className="text-sm font-semibold">Subject</label>
            <input id="partner-all-subject" value={subject} onChange={(event) => setSubject(event.target.value)} maxLength={150} className={inputClass} placeholder="For example: Partner update from the DOE Foundation" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="partner-all-message" className="text-sm font-semibold">Message</label>
            <textarea id="partner-all-message" value={message} onChange={(event) => setMessage(event.target.value)} rows={9} maxLength={5000} className={inputClass} placeholder={'Write your message here. It starts with "Dear partner," and ends with "Warm regards, The DOE Foundation team".'} />
            <p className="text-xs text-[#1a1917]/55">Leave a blank line between paragraphs. Web addresses become clickable links.</p>
          </div>
        </div>
      </section>

      <section aria-labelledby="partner-preview" className="rounded-2xl border border-[#1a1917]/10 bg-white p-5 sm:p-6">
        <h2 id="partner-preview" className="font-semibold">Preview</h2>
        <iframe title="Email preview" srcDoc={previewHtml} sandbox="" className="mt-3 h-[560px] w-full rounded-xl border border-[#1a1917]/10 bg-[#f8f5ef]" />
      </section>

      <section className="rounded-2xl border border-[#1a1917]/10 bg-white p-5 sm:p-6">
        <h2 className="flex items-center gap-2 font-semibold"><span className="flex size-6 items-center justify-center rounded-full bg-[#d70063] text-xs text-white">1</span> Send yourself a test</h2>
        <p className="mt-2 text-sm text-[#1a1917]/60">This saves the message as a draft in Brevo and sends one copy to the address below. Nobody else receives it. If you change the message later, send a new test.</p>
        <label htmlFor="partner-test-email" className="mt-4 block text-sm font-semibold">Test email address</label>
        <input id="partner-test-email" type="email" value={testEmail} onChange={(event) => setTestEmail(event.target.value)} autoComplete="email" className={`${inputClass} mt-1.5`} />
        <button type="button" onClick={handleTest} disabled={busy !== null} className="mt-4 inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#1a1917]/20 px-6 text-sm font-semibold hover:border-[#d70063] hover:text-[#d70063] disabled:cursor-wait disabled:opacity-60">
          {busy === 'test' ? <LoaderCircle size={16} className="animate-spin" aria-hidden="true" /> : <Mail size={16} aria-hidden="true" />}
          {busy === 'test' ? 'Sending test…' : testIsCurrent ? 'Send the test again' : 'Send test email'}
        </button>
        {testMessage && testIsCurrent && <p role="status" className="mt-3 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{testMessage}</p>}
        {campaignId !== null && !testIsCurrent && <p role="status" className="mt-3 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900">You changed the message after the last test. Send a new test before sending to partners.</p>}
      </section>

      <section className="rounded-2xl border border-[#1a1917]/10 bg-white p-5 sm:p-6">
        <h2 className="flex items-center gap-2 font-semibold"><span className="flex size-6 items-center justify-center rounded-full bg-[#d70063] text-xs text-white">2</span> Send to all partners</h2>
        <p className="mt-2 text-sm text-[#1a1917]/60">Once sent, an email cannot be recalled. Open your test email and check the text and links first.</p>
        <label className="mt-4 flex cursor-pointer items-start gap-3 text-sm">
          <input type="checkbox" checked={checked} onChange={(event) => setChecked(event.target.checked)} disabled={!testIsCurrent} className="mt-0.5 size-5 shrink-0 accent-[#d70063]" />
          <span className={testIsCurrent ? '' : 'text-[#1a1917]/45'}>I checked the test email and I want to send it to {countLabel}.</span>
        </label>
        {!testIsCurrent && <p className="mt-2 text-xs text-[#1a1917]/55">Send a test of this exact message to unlock this step.</p>}
        <button type="button" onClick={handleSend} disabled={!canSend} className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#d70063] px-6 text-sm font-semibold text-white hover:bg-[#b80055] disabled:cursor-not-allowed disabled:opacity-45 sm:w-auto">
          {busy === 'send' ? <LoaderCircle size={16} className="animate-spin" aria-hidden="true" /> : <Send size={16} aria-hidden="true" />}
          {busy === 'send' ? 'Sending…' : `Send to ${countLabel}`}
        </button>
      </section>

      {error && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>}
    </div>
  )
}
