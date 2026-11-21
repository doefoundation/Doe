import { requireAdmin } from '@/lib/admin-auth'
import { PageHeading } from '@/components/admin/admin-shell'
import { AnnouncementForm } from '@/components/admin/announcement-form'
import { AnnouncementItem } from '@/components/admin/announcement-item'
import type { Announcement } from '@/lib/cms-types'

export default async function AdminAnnouncementsPage({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  const { supabase } = await requireAdmin()
  const params = await searchParams
  const { data } = await supabase
    .from('announcements')
    .select('id, message, link_label, link_url, is_active, created_at, updated_at')
    .order('is_active', { ascending: false })
    .order('updated_at', { ascending: false })
  const announcements = (data ?? []) as Announcement[]

  return (
    <>
      <PageHeading eyebrow="Website" title="Announcements" description="A banner shown right below the website header. Only one announcement can be live at a time." />

      {params.saved && <p role="status" className="mb-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">Announcement saved.</p>}

      <div className="grid gap-6 lg:grid-cols-5">
        <section aria-labelledby="new-announcement" className="rounded-2xl border border-[#1a1917]/10 bg-white p-5 sm:p-6 lg:col-span-2 lg:self-start">
          <h2 id="new-announcement" className="mb-5 font-semibold">New announcement</h2>
          <AnnouncementForm />
        </section>

        <section aria-labelledby="all-announcements" className="lg:col-span-3">
          <h2 id="all-announcements" className="mb-3 font-semibold">All announcements</h2>
          {announcements.length ? (
            <ul className="flex flex-col gap-3">
              {announcements.map((announcement) => <AnnouncementItem key={`${announcement.id}-${announcement.updated_at}`} announcement={announcement} />)}
            </ul>
          ) : (
            <p className="rounded-2xl border border-dashed border-[#1a1917]/20 bg-white px-6 py-12 text-center text-sm text-[#1a1917]/60">No announcements yet.</p>
          )}
        </section>
      </div>
    </>
  )
}
