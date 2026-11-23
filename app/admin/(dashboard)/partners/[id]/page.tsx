import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Mail, Phone, Trash2 } from 'lucide-react'
import { requireAdmin } from '@/lib/admin-auth'
import { PageHeading } from '@/components/admin/admin-shell'
import { ConfirmSubmit } from '@/components/admin/form-ui'
import { PartnerMessageOne } from '@/components/admin/partner-message-one'
import { deletePartner } from '@/app/admin/partner-actions'
import { formatDate } from '@/lib/cms-types'
import { splitName } from '@/lib/volunteer'

export const metadata = { title: 'Partner | DOE Foundation Admin' }

export default async function PartnerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound()

  const { supabase } = await requireAdmin()
  const { data: partner } = await supabase
    .from('partners')
    .select('id, partner_type, full_name, organisation_name, email, phone, interest, message, heard_from, consented_at, created_at')
    .eq('id', id)
    .maybeSingle()
  if (!partner) notFound()

  const { firstName } = splitName(partner.full_name)
  const title = partner.organisation_name || partner.full_name

  return (
    <>
      <Link href="/admin/partners" className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-[#1a1917]/60 hover:text-[#d70063]">
        <ArrowLeft size={16} aria-hidden="true" /> All partners
      </Link>
      <PageHeading eyebrow={partner.partner_type === 'organisation' ? 'Organisation' : 'Individual'} title={title} description={`Received ${formatDate(partner.created_at)}`} />

      <div className="grid gap-5 lg:grid-cols-[1fr_1.2fr]">
        <section className="flex flex-col gap-5 rounded-2xl border border-[#1a1917]/10 bg-white p-5 sm:p-6">
          <h2 className="font-semibold">Details</h2>
          <dl className="flex flex-col gap-4 text-sm">
            <div>
              <dt className="text-[#1a1917]/55">Contact person</dt>
              <dd className="mt-1 font-medium">{partner.full_name}</dd>
            </div>
            {partner.organisation_name && (
              <div>
                <dt className="text-[#1a1917]/55">Organisation</dt>
                <dd className="mt-1 font-medium">{partner.organisation_name}</dd>
              </div>
            )}
            <div>
              <dt className="text-[#1a1917]/55">Email</dt>
              <dd className="mt-1 flex items-center gap-2 break-all font-medium"><Mail size={14} aria-hidden="true" className="shrink-0" /><a href={`mailto:${partner.email}`} className="hover:text-[#d70063]">{partner.email}</a></dd>
            </div>
            <div>
              <dt className="text-[#1a1917]/55">Phone</dt>
              <dd className="mt-1 flex items-center gap-2 font-medium"><Phone size={14} aria-hidden="true" className="shrink-0" /><a href={`tel:${partner.phone}`} className="hover:text-[#d70063]">{partner.phone}</a></dd>
            </div>
            <div>
              <dt className="text-[#1a1917]/55">Would like to partner through</dt>
              <dd className="mt-1 font-medium">{partner.interest}</dd>
            </div>
            <div>
              <dt className="text-[#1a1917]/55">Their idea</dt>
              <dd className="mt-1 whitespace-pre-line leading-relaxed">{partner.message}</dd>
            </div>
            <div>
              <dt className="text-[#1a1917]/55">How they heard about us</dt>
              <dd className="mt-1 font-medium">{partner.heard_from || '—'}</dd>
            </div>
            <div>
              <dt className="text-[#1a1917]/55">Agreed to receive information and be contacted</dt>
              <dd className="mt-1 font-medium">{formatDate(partner.consented_at)}</dd>
            </div>
          </dl>

          <form action={deletePartner} className="mt-2 border-t border-[#1a1917]/10 pt-5">
            <input type="hidden" name="id" value={partner.id} />
            <ConfirmSubmit
              message={`Delete ${title}? Their details are removed from the dashboard and from the Brevo partner list. This cannot be undone.`}
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-red-200 px-5 text-sm font-semibold text-red-700 hover:bg-red-50"
            >
              <Trash2 size={16} aria-hidden="true" /> Delete partner
            </ConfirmSubmit>
            <p className="mt-2 text-xs text-[#1a1917]/50">Use this when someone asks you to remove their information.</p>
          </form>
        </section>

        <section className="rounded-2xl border border-[#1a1917]/10 bg-white p-5 sm:p-6">
          <h2 className="font-semibold">Send a message to {firstName}</h2>
          <p className="mb-4 mt-1 text-sm text-[#1a1917]/60">Only {firstName} receives it. Replies come to your info@ inbox.</p>
          <PartnerMessageOne partnerId={partner.id} firstName={firstName} />
        </section>
      </div>
    </>
  )
}
