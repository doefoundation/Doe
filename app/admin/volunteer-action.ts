'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/admin-auth'
import { createCampaign, getBrevoConfig, getCampaign, getSubscriberCount, removeContact, sendNow, sendTest, sendTransactional, updateCampaign } from '@/lib/brevo'
import { getSiteUrl } from '@/lib/site'
import { splitName } from '@/lib/volunteer'
import { buildMessageEmail } from '@/lib/volunteer-email'

export type VolunteerActionResult = { ok: true; message: string; campaignId?: number } | { ok: false; error: string }

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const NOT_SET_UP = 'Volunteer email is not set up yet. Check BREVO_API_KEY and BREVO_VOLUNTEER_LIST_ID in Vercel.'
const MARKER = '[volunteers]'

function checkMessage(subject: string, message: string) {
  if (subject.trim().length < 3 || subject.trim().length > 150) return 'The subject must be between 3 and 150 characters.'
  if (message.trim().length < 10) return 'Please write a longer message.'
  if (message.length > 5000) return 'Please keep the message under 5,000 characters.'
  return null
}

function campaignEmail(subject: string, message: string) {
  return buildMessageEmail({ mode: 'campaign', subject, message, siteUrl: getSiteUrl(), unsubscribeUrl: '{{ unsubscribe }}', mirrorUrl: '{{ mirror }}' })
}

/** Message to everyone, step 1: saves the message as a draft in Brevo and sends one test copy. */
export async function sendVolunteerTest(subject: string, message: string, testEmail: string, existingCampaignId: number | null): Promise<VolunteerActionResult> {
  await requireAdmin()
  const config = getBrevoConfig()
  if (!config.volunteersReady) return { ok: false, error: NOT_SET_UP }

  const problem = checkMessage(subject, message)
  if (problem) return { ok: false, error: problem }
  const email = testEmail.trim().toLowerCase()
  if (!EMAIL_PATTERN.test(email)) return { ok: false, error: 'Enter a valid email address for the test.' }

  const built = campaignEmail(subject.trim(), message)
  let campaignId = existingCampaignId

  if (campaignId) {
    const updated = await updateCampaign(campaignId, { subject: subject.trim(), previewText: built.previewText, htmlContent: built.html })
    if (!updated.ok) return { ok: false, error: `Brevo could not update the draft: ${updated.message}` }
  } else {
    const date = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Africa/Lagos' })
    const created = await createCampaign({
      name: `Volunteers: ${subject.trim().slice(0, 80)} (${date}) ${MARKER}`,
      subject: subject.trim(),
      previewText: built.previewText,
      htmlContent: built.html,
      listId: config.volunteerListId,
    })
    if (!created.ok) return { ok: false, error: `Brevo could not create the email: ${created.message}` }
    campaignId = created.data
  }

  const sent = await sendTest(campaignId, [email])
  if (!sent.ok) return { ok: false, error: `Brevo could not send the test: ${sent.message}` }
  return { ok: true, campaignId, message: `Test email sent to ${email}. Check your inbox (and the Promotions or Spam folder).` }
}

/** Message to everyone, step 2: sends the tested draft to the whole volunteer list. */
export async function sendVolunteerCampaign(campaignId: number, subject: string, message: string): Promise<VolunteerActionResult> {
  await requireAdmin()
  const config = getBrevoConfig()
  if (!config.volunteersReady) return { ok: false, error: NOT_SET_UP }
  if (!Number.isInteger(campaignId) || campaignId <= 0) return { ok: false, error: 'Send a test email first.' }

  const problem = checkMessage(subject, message)
  if (problem) return { ok: false, error: problem }

  const campaign = await getCampaign(campaignId)
  if (!campaign.ok) return { ok: false, error: `Brevo could not find the email: ${campaign.message}` }
  if (campaign.data.name && !campaign.data.name.includes(MARKER)) return { ok: false, error: 'That email is not a volunteer message. Reload the page and start again.' }
  if (campaign.data.status && campaign.data.status !== 'draft') return { ok: false, error: 'That email has already been sent or scheduled.' }

  const subscribers = await getSubscriberCount(config.volunteerListId)
  if (subscribers.ok && subscribers.data === 0) return { ok: false, error: 'There are no volunteers to send to yet.' }

  // Make sure exactly what is on screen is what gets sent.
  const built = campaignEmail(subject.trim(), message)
  const updated = await updateCampaign(campaignId, { subject: subject.trim(), previewText: built.previewText, htmlContent: built.html })
  if (!updated.ok) return { ok: false, error: `Brevo could not update the draft: ${updated.message}` }

  const sent = await sendNow(campaignId)
  if (!sent.ok) {
    const reason = sent.status === 402 ? 'Brevo reports there are not enough sending credits.' : sent.message
    return { ok: false, error: `Brevo could not send the email: ${reason}` }
  }
  return { ok: true, message: 'Sent! Brevo is delivering your message to the volunteers now.' }
}

/** Message to one volunteer: sent straight away. */
export async function sendVolunteerMessage(volunteerId: string, subject: string, message: string): Promise<VolunteerActionResult> {
  const { supabase } = await requireAdmin()
  const config = getBrevoConfig()
  if (!config.apiKey) return { ok: false, error: NOT_SET_UP }

  if (!/^[0-9a-f-]{36}$/i.test(volunteerId)) return { ok: false, error: 'Volunteer not found.' }
  const problem = checkMessage(subject, message)
  if (problem) return { ok: false, error: problem }

  const { data: volunteer } = await supabase.from('volunteers').select('full_name, email').eq('id', volunteerId).maybeSingle()
  if (!volunteer) return { ok: false, error: 'Volunteer not found.' }

  const built = buildMessageEmail({ mode: 'direct', subject: subject.trim(), message, siteUrl: getSiteUrl(), firstName: splitName(volunteer.full_name).firstName })
  const sent = await sendTransactional({ to: { email: volunteer.email, name: volunteer.full_name }, subject: subject.trim(), htmlContent: built.html })
  if (!sent.ok) return { ok: false, error: `Brevo could not send the message: ${sent.message}` }
  return { ok: true, message: `Message sent to ${volunteer.full_name}.` }
}

/** Removes a volunteer from the dashboard and from the Brevo list. */
export async function deleteVolunteer(formData: FormData) {
  const { supabase } = await requireAdmin()
  const id = String(formData.get('id') ?? '')
  if (!/^[0-9a-f-]{36}$/i.test(id)) return

  const { data: volunteer } = await supabase.from('volunteers').select('email').eq('id', id).maybeSingle()
  if (!volunteer) redirect('/admin/volunteers')

  const { error } = await supabase.from('volunteers').delete().eq('id', id)
  if (error) {
    console.error('Volunteer: could not delete', error.code)
    return
  }

  if (getBrevoConfig().apiKey) {
    const removed = await removeContact(volunteer.email)
    if (!removed.ok) console.error('Volunteer: could not remove the contact from Brevo', removed.status)
  }

  revalidatePath('/admin/volunteers')
  redirect('/admin/volunteers?deleted=1')
  }
