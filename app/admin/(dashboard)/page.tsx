import Link from 'next/link'
import { ArrowUpRight, FilePen, Megaphone, Newspaper, Plus, Users } from 'lucide-react'
import { requireAdmin } from '@/lib/admin-auth'
import { PageHeading } from '@/components/admin/admin-shell'
import { formatDate } from '@/lib/cms-types'
import { StatusBadge } from '@/components/admin/status-badge'

export default async function AdminOverviewPage() {
  const { supabase } = await requireAdmin()

  const [published, drafts, announcements, admins, recent, liveAnnouncement, stats] = await Promise.all([
    supabase.from('news_posts').select('id', { count: 'exact', head: true }).eq('status', 'published'),
    supabase.from('news_posts').select('id', { count: 'exact', head: true }).eq('status', 'draft'),
    supabase.from('announcements').select('id', { count: 'exact', head: true }),
    supabase.from('admin_users').select('user_id', { count: 'exact', head: true }),
    supabase.from('news_posts').select('id, title, status, updated_at').order('updated_at', { ascending: false }).limit(5),
    supabase.from('announcements').select('id, message').eq('is_active', true).maybeSingle(),
    supabase.from('impact_stats').select('id, label, value, suffix').order('sort_order'),
  ])

  const cards = [
    { label: 'Published articles', value: published.count ?? 0, icon: Newspaper, href: '/admin/news' },
    { label: 'Drafts', value: drafts.count ?? 0, icon: FilePen, href: '/admin/news' },
    { label: 'Announcements', value: announcements.count ?? 0, icon: Megaphone, href: '/admin/announcements' },
    { label: 'Admins', value: admins.count ?? 0, icon: Users, href: '/admin/admins' },
  ]

  return (
    <>
      <PageHeading
        eyebrow="Dashboard"
        title="Overview"
        description="A snapshot of your website content."
        action={
          <Link href="/admin/news/new" className="inline-flex min-h-11 w-fit items-center gap-2 rounded-full bg-[#d70063] px-5 text-sm font-semibold text-white hover:bg-[#b80055]">
            <Plus size={16} aria-hidden="true" /> New article
          </Link>
        }
      />

      <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {cards.map(({ label, value, icon: Icon, href }) => (
          <li key={label}>
            <Link href={href} className="flex h-full flex-col rounded-2xl border border-[#1a1917]/10 bg-white p-4 transition-colors hover:border-[#d70063]/40 sm:p-5">
              <span className="flex size-10 items-center justify-center rounded-full bg-[#f1c6d7]/45 text-[#d70063]"><Icon size={18} aria-hidden="true" /></span>
              <span className="mt-4 font-serif text-4xl tracking-[-0.04em]">{value}</span>
              <span className="mt-1 text-xs font-semibold uppercase tracking-[0.1em] text-[#1a1917]/55">{label}</span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-6 grid gap-4 lg:grid-cols-5">
        <section aria-labelledby="recent-heading" className="rounded-2xl border border-[#1a1917]/10 bg-white p-5 lg:col-span-3">
          <div className="flex items-center justify-between">
            <h2 id="recent-heading" className="font-semibold">Recent articles</h2>
            <Link href="/admin/news" className="text-sm font-semibold text-[#d70063] hover:underline">View all</Link>
          </div>
          {recent.data?.length ? (
            <ul className="mt-4 divide-y divide-[#1a1917]/8">
              {recent.data.map((post) => (
                <li key={post.id}>
                  <Link href={`/admin/news/${post.id}`} className="flex items-center justify-between gap-4 py-3 hover:text-[#d70063]">
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium">{post.title}</span>
                      <span className="text-xs text-[#1a1917]/50">Updated {formatDate(post.updated_at)}</span>
                    </span>
                    <StatusBadge status={post.status} />
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-[#1a1917]/55">No articles yet. Write your first story to show it on the website.</p>
          )}
        </section>

        <div className="flex flex-col gap-4 lg:col-span-2">
          <section aria-labelledby="live-banner-heading" className="rounded-2xl border border-[#1a1917]/10 bg-white p-5">
            <h2 id="live-banner-heading" className="font-semibold">Live announcement</h2>
            {liveAnnouncement.data ? (
              <p className="mt-3 rounded-xl bg-[#d70063] px-4 py-3 text-sm text-white">{liveAnnouncement.data.message}</p>
            ) : (
              <p className="mt-3 text-sm text-[#1a1917]/55">No banner is showing on the website.</p>
            )}
            <Link href="/admin/announcements" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#d70063] hover:underline">
              Manage <ArrowUpRight size={14} aria-hidden="true" />
            </Link>
          </section>

          <section aria-labelledby="impact-heading" className="rounded-2xl border border-[#1a1917]/10 bg-white p-5">
            <h2 id="impact-heading" className="font-semibold">Homepage impact stats</h2>
            <dl className="mt-3 grid grid-cols-2 gap-3">
              {stats.data?.map((stat) => (
                <div key={stat.id} className="rounded-xl bg-[#f8f5ef] p-3">
                  <dt className="line-clamp-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#1a1917]/55">{stat.label}</dt>
                  <dd className="mt-1 font-serif text-2xl text-[#d70063]">{stat.value.toLocaleString()}{stat.suffix}</dd>
                </div>
              ))}
            </dl>
            <Link href="/admin/stats" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#d70063] hover:underline">
              Edit stats <ArrowUpRight size={14} aria-hidden="true" />
            </Link>
          </section>
        </div>
      </div>
    </>
  )
}
