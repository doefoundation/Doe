import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { requireAdmin } from '@/lib/admin-auth'
import { createServiceClient } from '@/lib/supabase/admin'
import { PageHeading } from '@/components/admin/admin-shell'

const PAGE_SIZE = 25

const GREEN = 'bg-emerald-50 text-emerald-800'
const BLUE = 'bg-sky-50 text-sky-800'
const RED = 'bg-red-50 text-red-800'
const GREY = 'bg-[#1a1917]/5 text-[#1a1917]/70'

const ACTIONS: Record<string, { text: string; tone: string }> = {
  login: { text: 'Signed in', tone: GREY },
  'login.failed': { text: 'Failed sign-in', tone: RED },
  logout: { text: 'Signed out', tone: GREY },
  'news.create': { text: 'Created article', tone: GREEN },
  'news.update': { text: 'Edited article', tone: BLUE },
  'news.delete': { text: 'Deleted article', tone: RED },
  'announcement.create': { text: 'Created announcement', tone: GREEN },
  'announcement.update': { text: 'Edited announcement', tone: BLUE },
  'announcement.activate': { text: 'Turned announcement on', tone: BLUE },
  'announcement.deactivate': { text: 'Turned announcement off', tone: BLUE },
  'announcement.delete': { text: 'Deleted announcement', tone: RED },
  'stats.update': { text: 'Updated impact stats', tone: BLUE },
  'stats.add': { text: 'Added impact stat', tone: GREEN },
  'stats.delete': { text: 'Deleted impact stat', tone: RED },
  'admin.add': { text: 'Added admin', tone: GREEN },
  'admin.remove': { text: 'Removed admin', tone: RED },
  'volunteer.delete': { text: 'Deleted volunteer', tone: RED },
  'volunteer.message': { text: 'Messaged a volunteer', tone: BLUE },
  'volunteer.broadcast': { text: 'Emailed all volunteers', tone: BLUE },
  'partner.delete': { text: 'Deleted partner', tone: RED },
  'partner.message': { text: 'Messaged a partner', tone: BLUE },
  'partner.broadcast': { text: 'Emailed all partners', tone: BLUE },
  'news.emailed': { text: 'Emailed article to subscribers', tone: BLUE },
}

const formatter = new Intl.DateTimeFormat('en-GB', {
  dateStyle: 'medium',
  timeStyle: 'short',
  timeZone: 'Africa/Lagos',
})

export default async function ActivityLogPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  await requireAdmin()

  const { page: pageParam } = await searchParams
  const page = Math.max(1, Number.parseInt(pageParam ?? '1', 10) || 1)
  const from = (page - 1) * PAGE_SIZE

  const { data: rows, count, error } = await createServiceClient()
    .from('admin_activity_log')
    .select('id, created_at, actor_email, action, entity, label, ip', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, from + PAGE_SIZE - 1)

  const total = count ?? 0
  const lastPage = Math.max(1, Math.ceil(total / PAGE_SIZE))

  return (
    <>
      <PageHeading
        eyebrow="Security"
        title="Activity log"
        description="A record of who signed in and what they changed. Times are shown in Nigeria time (WAT)."
      />

      {error ? (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">
          The activity log could not be loaded. Check that the admin_activity_log table exists.
        </p>
      ) : !rows?.length ? (
        <p className="rounded-2xl border border-[#1a1917]/10 bg-white p-6 text-sm text-[#1a1917]/60">
          No activity recorded yet. Actions will appear here as admins use the dashboard.
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {rows.map((row) => {
            const meta = ACTIONS[row.action] ?? { text: row.action, tone: GREY }
            return (
              <li key={row.id} className="rounded-2xl border border-[#1a1917]/10 bg-white p-4 sm:p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${meta.tone}`}>{meta.text}</span>
                  <time dateTime={row.created_at} className="text-xs text-[#1a1917]/50">
                    {formatter.format(new Date(row.created_at))}
                  </time>
                </div>
                {row.label && <p className="mt-3 break-words text-sm font-medium">{row.label}</p>}
                <p className="mt-1 break-all text-xs text-[#1a1917]/55">
                  {row.actor_email ?? 'Unknown'}
                  {row.ip ? ` · ${row.ip}` : ''}
                </p>
              </li>
            )
          })}
        </ul>
      )}

      {total > PAGE_SIZE && (
        <nav aria-label="Activity log pages" className="mt-6 flex items-center justify-between text-sm">
          {page > 1 ? (
            <Link href={`/admin/activity?page=${page - 1}`} className="inline-flex min-h-11 items-center gap-1 rounded-full border border-[#1a1917]/15 px-4 font-semibold hover:border-[#d70063] hover:text-[#d70063]">
              <ChevronLeft size={16} aria-hidden="true" /> Newer
            </Link>
          ) : <span />}
          <span className="text-[#1a1917]/55">Page {page} of {lastPage}</span>
          {page < lastPage ? (
            <Link href={`/admin/activity?page=${page + 1}`} className="inline-flex min-h-11 items-center gap-1 rounded-full border border-[#1a1917]/15 px-4 font-semibold hover:border-[#d70063] hover:text-[#d70063]">
              Older <ChevronRight size={16} aria-hidden="true" />
            </Link>
          ) : <span />}
        </nav>
      )}
    </>
  )
}
