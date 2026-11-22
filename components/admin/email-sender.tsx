'use client'

import Link from 'next/link'
import { useState } from 'react'
import { CheckCircle2, LoaderCircle, Mail, Send, TriangleAlert } from 'lucide-react'
import { sendArticleTest, sendArticleToSubscribers } from '@/app/admin/email-actions'

type Props = {
  articleId: string
  subject: string
  previewText: string
  previewHtml: string
  senderLabel: string
  subscriberCount: number | null
  subscriberError: string | null
  defaultEmail: string
  emailedLabel: string | null
}

const inputClass = 'min-h-12 w-full rounded-xl border border-[#1a1917]/15 bg-white px-4 text-base outline-none focus-visible:border-[#d70063] focus-visible:ring-2 focus-visible:ring-[#d70063]/25 sm:text-sm'

export function EmailSender({ articleId, subject, previewText, previewHtml, senderLabel, subscriberCount, subscriberError, defaultEmail, emailedLabel }: Props) {
  const [testEmail, setTestEmail] = useState(defaultEmail)
  const [campaignId, setCampaignId] = useState<number | null>(null)
  const [testMessage, setTestMessage] = useState('')
  const [checked, setChecked] = useState(false)
  const [sendAgain, setSendAgain] = useState(false)
  const [busy, setBusy] = useState<'test' | 'send' | null>(null)
  const [error, setError] = useState('')
  const [sentMessage, setSentMessage] = useState('')

  const testSent = campaignId !== null && testMessage !== ''
  const needsRepeatConfirm = emailedLabel !== null
  const countLabel = subscriberCount === null ? 'all subscribers' : `${subscriberCount} ${subscriberCount === 1 ? 'subscriber' : 'subscribers'}`
  const canSend = testSent && checked && (!needsRepeatConfirm || sendAgain) && busy === null && subscriberCount !== 0

  async function handleTest() {
    setError('')
    setBusy('test')
    const result = await sendArticleTest(articleId, testEmail, campaignId)
    setBusy(null)
    if (!result.ok) {
      setError(result.error)
      return
    }
    setCampaignId(result.campaignId)
    setTestMessage(result.message)
  }

  async function handleSend() {
    if (campaignId === null) return
    setError('')
    setBusy('send')
    const result = await sendArticleToSubscribers(articleId, campaignId, sendAgain)
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
        <h2 className="mt-3 font-serif text-3xl tracking-[-0.03em]">Email sent</h2>
        <p className="mt-2 text-sm leading-relaxed">{sentMessage} Opens, clicks and unsubscribes appear in the campaign report in Brevo.</p>
        <Link href="/admin/news" className="mt-5 inline-flex min-h-11 items-center rounded-full bg-emerald-900 px-5 text-sm font-semibold text-white hover:bg-emerald-950">
          Back to articles
        </Link>
      </section>
    )
  }

  return (
    <div className="flex flex-col gap-5">
      <section className="rounded-2xl border border-[#1a1917]/10 bg-white p-5 sm:p-6">
        <h2 className="font-semibold">What will be sent</h2>
        <dl className="mt-3 grid gap-3 text-sm sm:grid-cols-[8rem_1fr]">
          <dt className="text-[#1a1917]/55">Subject</dt>
          <dd className="font-medium">{subject}</dd>
          <dt className="text-[#1a1917]/55">Preview text</dt>
          <dd>{previewText || '—'}</dd>
          <dt className="text-[#1a1917]/55">From</dt>
          <dd>{senderLabel}</dd>
          <dt className="text-[#1a1917]/55">To</dt>
          <dd>{subscriberError ? 'Website Subscribers list' : `Website Subscribers list · ${countLabel}`}</dd>
        </dl>
        {subscriberError && <p className="mt-3 text-xs text-amber-800">Could not read the subscriber count ({subscriberError}). You can still send.</p>}
      </section>

      <section aria-labelledby="preview-heading" className="rounded-2xl border border-[#1a1917]/10 bg-white p-5 sm:p-6">
        <h2 id="preview-heading" className="font-semibold">Preview</h2>
        <iframe title="Email preview" srcDoc={previewHtml} sandbox="" className="mt-3 h-[640px] w-full rounded-xl border border-[#1a1917]/10 bg-[#f8f5ef]" />
      </section>

      <section className="rounded-2xl border border-[#1a1917]/10 bg-white p-5 sm:p-6">
        <h2 className="flex items-center gap-2 font-semibold"><span className="flex size-6 items-center justify-center rounded-full bg-[#d70063] text-xs text-white">1</span> Send yourself a test</h2>
        <p className="mt-2 text-sm text-[#1a1917]/60">This creates the email in Brevo as a draft and sends one copy to the address below. Nobody else receives it.</p>
        <label htmlFor="test-email" className="mt-4 block text-sm font-semibold">Test email address</label>
        <input id="test-email" type="email" value={testEmail} onChange={(event) => setTestEmail(event.target.value)} autoComplete="email" className={`${inputClass} mt-1.5`} />
        <button
          type="button"
          onClick={handleTest}
          disabled={busy !== null}
          className="mt-4 inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#1a1917]/20 px-6 text-sm font-semibold hover:border-[#d70063] hover:text-[#d70063] disabled:cursor-wait disabled:opacity-60"
        >
          {busy === 'test' ? <LoaderCircle size={16} className="animate-spin" aria-hidden="true" /> : <Mail size={16} aria-hidden="true" />}
          {busy === 'test' ? 'Sending test…' : testSent ? 'Send the test again' : 'Send test email'}
        </button>
        {testMessage && <p role="status" className="mt-3 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{testMessage}</p>}
      </section>

      <section className="rounded-2xl border border-[#1a1917]/10 bg-white p-5 sm:p-6">
        <h2 className="flex items-center gap-2 font-semibold"><span className="flex size-6 items-center justify-center rounded-full bg-[#d70063] text-xs text-white">2</span> Send to your subscribers</h2>
        <p className="mt-2 text-sm text-[#1a1917]/60">Once sent, an email cannot be recalled. Open your test email and check the text, image and links first.</p>

        {needsRepeatConfirm && (
          <div role="alert" className="mt-4 flex gap-3 rounded-xl bg-amber-50 p-4 text-sm text-amber-900">
            <TriangleAlert size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
            <div>
              <p className="font-semibold">This article was already emailed on {emailedLabel}.</p>
              <label className="mt-2 flex cursor-pointer items-start gap-3">
                <input type="checkbox" checked={sendAgain} onChange={(event) => setSendAgain(event.target.checked)} className="mt-0.5 size-5 shrink-0 accent-[#d70063]" />
                <span>I understand that everyone will receive it a second time.</span>
              </label>
            </div>
          </div>
        )}

        <label className="mt-4 flex cursor-pointer items-start gap-3 text-sm">
          <input type="checkbox" checked={checked} onChange={(event) => setChecked(event.target.checked)} disabled={!testSent} className="mt-0.5 size-5 shrink-0 accent-[#d70063]" />
          <span className={testSent ? '' : 'text-[#1a1917]/45'}>I checked the test email and I want to send it to {countLabel}.</span>
        </label>
        {!testSent && <p className="mt-2 text-xs text-[#1a1917]/55">Send the test first to unlock this step.</p>}

        <button
          type="button"
          onClick={handleSend}
          disabled={!canSend}
          className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#d70063] px-6 text-sm font-semibold text-white hover:bg-[#b80055] disabled:cursor-not-allowed disabled:opacity-45 sm:w-auto"
        >
          {busy === 'send' ? <LoaderCircle size={16} className="animate-spin" aria-hidden="true" /> : <Send size={16} aria-hidden="true" />}
          {busy === 'send' ? 'Sending…' : `Send to ${countLabel}`}
        </button>
      </section>

      {error && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>}
    </div>
  )
}
