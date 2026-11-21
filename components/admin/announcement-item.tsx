'use client'

import { useState } from 'react'
import { Eye, EyeOff, Pencil, Trash2 } from 'lucide-react'
import { deleteAnnouncement, toggleAnnouncement } from '@/app/admin/actions'
import { AnnouncementForm } from '@/components/admin/announcement-form'
import { ConfirmSubmit, SubmitButton } from '@/components/admin/form-ui'
import { formatDate, type Announcement } from '@/lib/cms-types'

export function AnnouncementItem({ announcement }: { announcement: Announcement }) {
  const [editing, setEditing] = useState(false)

  if (editing) {
    return (
      <li className="rounded-2xl border border-[#d70063]/30 bg-white p-5">
        <AnnouncementForm announcement={announcement} onDone={() => setEditing(false)} />
      </li>
    )
  }

  return (
    <li className="flex flex-col gap-4 rounded-2xl border border-[#1a1917]/10 bg-white p-4 sm:flex-row sm:items-center sm:p-5">
      <div className="min-w-0 flex-1">
        <span className={`inline-block rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] ${announcement.is_active ? 'bg-emerald-50 text-emerald-800' : 'bg-[#1a1917]/5 text-[#1a1917]/60'}`}>
          {announcement.is_active ? 'Live on website' : 'Hidden'}
        </span>
        <p className="mt-2 text-sm leading-relaxed">{announcement.message}</p>
        <p className="mt-1 text-xs text-[#1a1917]/50">
          {announcement.link_url && <>Links to {announcement.link_url} · </>}Updated {formatDate(announcement.updated_at)}
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <form action={toggleAnnouncement}>
          <input type="hidden" name="id" value={announcement.id} />
          <input type="hidden" name="activate" value={String(!announcement.is_active)} />
          <SubmitButton pendingLabel="…" className={announcement.is_active ? '!bg-white !text-[#1a1917] border border-[#1a1917]/15 hover:!border-[#1a1917]/40' : ''}>
            {announcement.is_active ? <><EyeOff size={16} aria-hidden="true" /> Hide</> : <><Eye size={16} aria-hidden="true" /> Show</>}
          </SubmitButton>
        </form>
        <button type="button" onClick={() => setEditing(true)} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[#1a1917]/15 px-4 text-sm font-semibold hover:border-[#d70063] hover:text-[#d70063]">
          <Pencil size={16} aria-hidden="true" /> Edit
        </button>
        <form action={deleteAnnouncement}>
          <input type="hidden" name="id" value={announcement.id} />
          <ConfirmSubmit
            message="Delete this announcement?"
            ariaLabel="Delete announcement"
            className="flex size-11 items-center justify-center rounded-full border border-[#1a1917]/15 text-red-700 hover:border-red-300 hover:bg-red-50"
          >
            <Trash2 size={16} aria-hidden="true" />
          </ConfirmSubmit>
        </form>
      </div>
    </li>
  )
}
