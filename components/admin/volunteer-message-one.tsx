'use client'

import { useState } from 'react'
import { LoaderCircle, Send } from 'lucide-react'
import { sendVolunteerMessage } from '@/app/admin/volunteer-actions'

const inputClass = 'w-full rounded-xl border border-[#1a1917]/15 bg-white px-4 py-3 text-base outline-none focus-visible:border-[#d70063] focus-visible:ring-2 focus-visible:ring-[#d70063]/25 sm:text-sm'

export function VolunteerMessageOne({ volunteerId, firstName }: { volunteerId: string; firstName: string }) {
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState('')

  async function handleSend() {
    setError('')
    setDone('')
    setBusy(true)
    const result = await sendVolunteerMessage(volunteerId, subject, message)
    setBusy(false)
    if (!result.ok) {
      setError(result.error)
      return
    }
    setDone(result.message)
    setSubject('')
    setMessage('')
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="one-subject" className="text-sm font-semibold">Subject</label>
        <input id="one-subject" value={subject} onChange={(event) => setSubject(event.target.value)} maxLength={150} className={inputClass} placeholder="For example: Your volunteer orientation" />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="one-message" className="text-sm font-semibold">Message</label>
        <textarea id="one-message" value={message} onChange={(event) => setMessage(event.target.value)} rows={8} maxLength={5000} className={inputClass} placeholder={`Write your message here. It starts with "Dear ${firstName}," and ends with "Warm regards, The DOE Foundation team".`} />
        <p className="text-xs text-[#1a1917]/55">Leave a blank line between paragraphs. Web addresses become clickable links.</p>
      </div>
      <button
        type="button"
        onClick={handleSend}
        disabled={busy}
        className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#d70063] px-6 text-sm font-semibold text-white hover:bg-[#b80055] disabled:cursor-wait disabled:opacity-60 sm:w-auto"
      >
        {busy ? <LoaderCircle size={16} className="animate-spin" aria-hidden="true" /> : <Send size={16} aria-hidden="true" />}
        {busy ? 'Sending…' : `Send to ${firstName}`}
      </button>
      {done && <p role="status" className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{done}</p>}
      {error && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>}
    </div>
  )
}
