'use client'

import { useActionState, useState } from 'react'
import { Megaphone } from 'lucide-react'
import { saveAnnouncement } from '@/app/admin/actions'
import { Field, FormMessage, SubmitButton, inputClass } from '@/components/admin/form-ui'
import type { Announcement } from '@/lib/cms-types'

export function AnnouncementForm({ announcement, onDone }: { announcement?: Announcement; onDone?: () => void }) {
  const [state, action] = useActionState(saveAnnouncement, null)
  const [message, setMessage] = useState(announcement?.message ?? '')
  const [linkLabel, setLinkLabel] = useState(announcement?.link_label ?? '')
  const prefix = announcement ? `edit-${announcement.id}` : 'new'

  return (
    <form action={action} className="flex flex-col gap-5">
      {announcement && <input type="hidden" name="id" value={announcement.id} />}

      <div aria-hidden="true" className="flex items-start gap-3 rounded-xl bg-[#d70063] px-4 py-3 text-sm text-white">
        <Megaphone size={16} className="mt-0.5 shrink-0" />
        <span><span className="font-medium">{message || 'Your announcement will appear here'}</span>{linkLabel && <span className="ml-2 font-semibold underline underline-offset-4">{linkLabel}</span>}</span>
      </div>

      <Field label="Message" htmlFor={`${prefix}-message`} hint={`${message.length}/280 characters`}>
        <textarea id={`${prefix}-message`} name="message" rows={2} required minLength={3} maxLength={280} value={message} onChange={(e) => setMessage(e.target.value)} className={inputClass} placeholder="Applications for the 2027 DOE Debate Championship are now open!" />
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Link text (optional)" htmlFor={`${prefix}-label`}>
          <input id={`${prefix}-label`} name="link_label" maxLength={40} value={linkLabel} onChange={(e) => setLinkLabel(e.target.value)} className={inputClass} placeholder="Apply now" />
        </Field>
        <Field label="Link URL (optional)" htmlFor={`${prefix}-url`} hint="e.g. /donate or https://…">
          <input id={`${prefix}-url`} name="link_url" defaultValue={announcement?.link_url ?? ''} className={inputClass} inputMode="url" />
        </Field>
      </div>
      <label className="flex cursor-pointer items-center gap-3 text-sm font-medium">
        <input type="checkbox" name="is_active" defaultChecked={announcement?.is_active ?? true} className="size-5 accent-[#d70063]" />
        Show on website now <span className="font-normal text-[#1a1917]/55">(replaces any live banner)</span>
      </label>
      <FormMessage state={state} />
      <div className="flex flex-wrap gap-3">
        <SubmitButton>{announcement ? 'Save changes' : 'Create announcement'}</SubmitButton>
        {onDone && (
          <button type="button" onClick={onDone} className="min-h-11 rounded-full border border-[#1a1917]/15 px-5 text-sm font-semibold hover:border-[#1a1917]/40">Cancel</button>
        )}
      </div>
    </form>
  )
}
