import Link from 'next/link'
import { Mail, Phone, Search, Send } from 'lucide-react'
import { requireAdmin } from '@/lib/admin-auth'
import { PageHeading } from '@/components/admin/admin-shell'
import { formatDate } from '@/lib/cms-types'

export const metadata = { title: 'Volunteers | DOE Foundation Admin' }

type Props = { searchParams: Promise<{ q?: string; deleted?: string }> }

export default async function AdminVolunteersPage({ searchParams }: Props) {
  const { supabase } = await requireAdmin()
  const params = await searchParams
  // Remove characters that have a special meaning in the search filter.
  const q = (params.q ?? '').replace(/[,()%*\\]/g, ' ').trim().slice(0, 60)

  let query = supabase.from('volunteers').select('id, full_name, email, phone, created_at').order('created_at', { ascending: false }).limit(300)
  if (q) query = query.or(`full_name.ilike.%${q}%,email.ilike.%${q}%`)
  const { data: volunteers, error } = await query

  return (
    <>
      <PageHeading
        eyebrow="People"
        title="Volunteers"
        description="People who registered to volunteer. Open a volunteer to read their details or send them a message."
        action={
          <Link href="/admin/volunteers/message" className="inline-flex min-h-11 w-fit items-center gap-2 rounded-full bg-[#d70063] px-5 text-sm font-semibold text-white hover:bg-[#b80055]">
            <Send size={16} aria-hidden="true" /> Message all volunteers
          </Link>
        }
      />

      {params.deleted && <p role="status" className="mb-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">Volunteer deleted.</p>}
      {error && <p role="alert" className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">Could not load volunteers. Check that the volunteers table has been created in Supabase.</p>}

      <form method="get" role="search" className="mb-5 flex gap-2">
        <label htmlFor="volunteer-search" className="sr-only">Search volunteers</label>
        <div className="relative flex-1">
          <Search size={16} aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#1a1917]/45" />
          <input id="volunteer-search" name="q" defaultValue={q} placeholder="Search by name or email" className="min-h-12 w-full rounded-xl border border-[#1a1917]/15 bg-white pl-10 pr-4 text-base outline-none focus-visible:border-[#d70063] focus-visible:ring-2 focus-visible:ring-[#d70063]/25 sm:text-sm" />
        </div>
        <button type="submit" className="min-h-12 rounded-full border border-[#1a1917]/20 px-5 text-sm font-semibold hover:border-[#d70063] hover:text-[#d70063]">Search</button>
      </form>

      <p className="mb-3 text-sm text-[#1a1917]/55">{volunteers?.length ?? 0} {(volunteers?.length ?? 0) === 1 ? 'volunteer' : 'volunteers'}{q ? ` matching “${q}”` : ''}</p>

      {volunteers?.length ? (
        <ul className="flex flex-col gap-3">
          {volunteers.map((volunteer) => (
            <li key={volunteer.id} className="rounded-2xl border border-[#1a1917]/10 bg-white p-4 sm:p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <Link href={`/admin/volunteers/${volunteer.id}`} className="block font-serif text-xl leading-snug tracking-[-0.02em] hover:text-[#d70063]">{volunteer.full_name}</Link>
                  <p className="mt-1 flex items-center gap-2 break-all text-sm text-[#1a1917]/65"><Mail size={14} aria-hidden="true" className="shrink-0" />{volunteer.email}</p>
                  <p className="mt-1 flex items-center gap-2 text-sm text-[#1a1917]/65"><Phone size={14} aria-hidden="true" className="shrink-0" />{volunteer.phone}</p>
                  <p className="mt-2 text-xs text-[#1a1917]/50">Registered {formatDate(volunteer.created_at)}</p>
                </div>
                <Link href={`/admin/volunteers/${volunteer.id}`} className="inline-flex min-h-11 w-fit items-center gap-2 rounded-full border border-[#1a1917]/15 px-5 text-sm font-semibold hover:border-[#d70063] hover:text-[#d70063]">
                  View and message
                </Link>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        !error && (
          <div className="rounded-2xl border border-dashed border-[#1a1917]/20 bg-white px-6 py-16 text-center">
            <p className="font-serif text-2xl">{q ? 'No volunteers match your search' : 'No volunteers yet'}</p>
            <p className="mt-2 text-sm text-[#1a1917]/60">{q ? 'Try a different name or email.' : 'Registrations from the Volunteer page appear here.'}</p>
          </div>
        )
      )}
    </>
  )
}
