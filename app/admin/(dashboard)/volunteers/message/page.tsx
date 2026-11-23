import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { requireAdmin } from '@/lib/admin-auth'
import { PageHeading } from '@/components/admin/admin-shell'
import { VolunteerMessageAll } from '@/components/admin/volunteer-message-all'
import { getBrevoConfig, getSubscriberCount } from '@/lib/brevo'
import { getSiteUrl } from '@/lib/site'

export const metadata = { title: 'Message volunteers | DOE Foundation Admin' }

export default async function MessageAllVolunteersPage() {
  const { user } = await requireAdmin()
  const config = getBrevoConfig()

  const back = (
    <Link href="/admin/volunteers" className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-[#1a1917]/60 hover:text-[#d70063]">
      <ArrowLeft size={16} aria-hidden="true" /> All volunteers
    </Link>
  )

  if (!config.volunteersReady) {
    return (
      <>
        {back}
        <PageHeading eyebrow="People" title="Message all volunteers" />
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">
          Volunteer email is not set up. Check that BREVO_API_KEY and BREVO_VOLUNTEER_LIST_ID are saved in Vercel, then redeploy.
        </p>
      </>
    )
  }

  const count = await getSubscriberCount(config.volunteerListId)

  return (
    <>
      {back}
      <PageHeading eyebrow="People" title="Message all volunteers" description="Write a message, send yourself a test, then send it to everyone on the volunteer list." />
      <VolunteerMessageAll
        siteUrl={getSiteUrl()}
        senderLabel={`${config.senderName} <${config.senderEmail}>`}
        volunteerCount={count.ok ? count.data : null}
        defaultEmail={user.email ?? ''}
      />
    </>
  )
}
