import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Mail, Phone, Trash2 } from 'lucide-react'
import { requireAdmin } from '@/lib/admin-auth'
import { PageHeading } from '@/components/admin/admin-shell'
import { ConfirmSubmit } from '@/components/admin/form-ui'
import { VolunteerMessageOne } from '@/components/admin/volunteer-message-one'
import { deleteVolunteer } from '@/app/admin/volunteer-actions'
import { formatDate } from '@/lib/cms-types'
import { splitName } from '@/lib/volunteer'

export const metadata = { title: 'Volunteer | DOE Foundation Admin' }

export default async function VolunteerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound()

  const { supabase } = await requireAdmin()
  const { data: volunteer } = await supabase
    .from('volunteers')
    .select('id, full_name, email, phone, reason, other_info, consented_at, created_at')
    .eq('id', id)
    .maybeSingle()
  if (!volunteer) notFound()

  const { firstName } = splitName(volunteer.full_name)

  return (
    <>
      <Link href="/admin/volunteers" className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-[#1a1917]/60 hover:text-[#d70063]">
        <ArrowLeft size={16} aria-hidden="true" /> All volunteers
      </Link>
      <PageHeading eyebrow="Volunteer" title={volunteer.full_name} description={`Registered ${formatDate(volunteer.created_at)}`} />

      <div className="grid gap-5 lg:grid-cols-[1fr_1.2fr]">
        <section className="flex flex-col gap-5 rounded-2xl border border-[#1a1917]/10 bg-white p-5 sm:p-6">
          <h2 className="font-semibold">Details</h2>
          <dl className="flex flex-col gap-4 text-sm">
            <div>
              <dt className="text-[#1a1917]/55">Email</dt>
              <dd className="mt-1 flex items-center gap-2 break-all font-medium"><Mail size={14} aria-hidden="true" className="shrink-0" /><a href={`mailto:${volunteer.email}`} className="hover:text-[#d70063]">{volunteer.email}</a></dd>
            </div>
            <div>
              <dt className="text-[#1a1917]/55">Phone</dt>
              <dd className="mt-1 flex items-center gap-2 font-medium"><Phone size={14} aria-hidden="true" className="shrink-0" /><a href={`tel:${volunteer.phone}`} className="hover:text-[#d70063]">{volunteer.phone}</a></dd>
            </div>
            <div>
              <dt className="text-[#1a1917]/55">Why they want to volunteer</dt>
              <dd className="mt-1 whitespace-pre-line leading-relaxed">{volunteer.reason}</dd>
            </div>
            <div>
              <dt className="text-[#1a1917]/55">Other information</dt>
              <dd className="mt-1 whitespace-pre-line leading-relaxed">{volunteer.other_info || '—'}</dd>
            </div>
            <div>
              <dt className="text-[#1a1917]/55">Agreed to receive updates</dt>
              <dd className="mt-1 font-medium">{formatDate(volunteer.consented_at)}</dd>
            </div>
          </dl>

          <form action={deleteVolunteer} className="mt-2 border-t border-[#1a1917]/10 pt-5">
            <input type="hidden" name="id" value={volunteer.id} />
            <ConfirmSubmit
              message={`Delete ${volunteer.full_name}? Their details are removed from the dashboard and from the Brevo volunteer list. This cannot be undone.`}
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-red-200 px-5 text-sm font-semibold text-red-700 hover:bg-red-50"
            >
              <Trash2 size={16} aria-hidden="true" /> Delete volunteer
            </ConfirmSubmit>
            <p className="mt-2 text-xs text-[#1a1917]/50">Use this when someone asks you to remove their information.</p>
          </form>
        </section>

        <section className="rounded-2xl border border-[#1a1917]/10 bg-white p-5 sm:p-6">
          <h2 className="font-semibold">Send a message to {firstName}</h2>
          <p className="mb-4 mt-1 text-sm text-[#1a1917]/60">Only {firstName} receives it. Replies come to your info@ inbox.</p>
          <VolunteerMessageOne volunteerId={volunteer.id} firstName={firstName} />
        </section>
      </div>
    </>
  )
}
