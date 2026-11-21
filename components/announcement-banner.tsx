'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import useSWR from 'swr'
import { ArrowUpRight, Megaphone, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { Announcement } from '@/lib/cms-types'

async function fetchLiveAnnouncement() {
  const supabase = createClient()
  const { data } = await supabase
    .from('announcements')
    .select('id, message, link_label, link_url, is_active, created_at, updated_at')
    .eq('is_active', true)
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle()
  return (data as Announcement | null) ?? null
}

export function AnnouncementBanner() {
  const { data: announcement } = useSWR('live-announcement', fetchLiveAnnouncement, { revalidateOnFocus: false })
  const [dismissedKey, setDismissedKey] = useState<string | null>(null)
  const announcementKey = announcement ? `${announcement.id}:${announcement.updated_at}` : null

  useEffect(() => {
    setDismissedKey(window.sessionStorage.getItem('doe-announcement-dismissed'))
  }, [])

  if (!announcement || !announcementKey || dismissedKey === announcementKey) return null

  function dismiss() {
    if (!announcementKey) return
    window.sessionStorage.setItem('doe-announcement-dismissed', announcementKey)
    setDismissedKey(announcementKey)
  }

  const isExternal = announcement.link_url?.startsWith('http')

  return (
    <aside aria-label="Announcement" className="relative z-30 bg-[#d70063] px-5 text-white sm:px-8">
      <div className="mx-auto flex max-w-[1360px] items-center gap-3 py-3">
        <Megaphone size={18} aria-hidden="true" className="shrink-0" />
        <div className="announcement-marquee min-w-0 flex-1 overflow-hidden">
          <p className="announcement-track text-sm leading-relaxed whitespace-nowrap">
            <span className="font-medium">{announcement.message}</span>
            {announcement.link_url && (
              <Link
                href={announcement.link_url}
                {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="ml-2 inline-flex items-center gap-1 font-semibold underline underline-offset-4 hover:no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                {announcement.link_label || 'Learn more'}
                <ArrowUpRight size={14} aria-hidden="true" />
              </Link>
            )}
          </p>
        </div>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss announcement"
          className="flex size-8 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-white"
        >
          <X size={16} aria-hidden="true" />
        </button>
      </div>
    </aside>
  )
}
