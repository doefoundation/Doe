'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/admin-auth'
import { logActivity } from '@/lib/activity-log'
import { createCampaign, getBrevoConfig, getCampaign, getSubscriberCount, removeFromList, sendNow, sendTest, sendTransactional, updateCampaign } from '@/lib/brevo'
import { getSiteUrl } from '@/lib/site'
import { buildPartnerMessageEmail } from '@/lib/partner-email'
import { splitName } from '@/lib/volunteer'

export type PartnerActionResult = { ok: true; message: string; campaignId?: number } | { ok: false; error: string }

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const NOT_SET_UP = 'Partner email is not set up yet. Check BREVO_API_KEY and BREVO_PARTNER_LIST_ID in Vercel.'
const MARKER = '[partners]'

function checkMessage(subject: string, message: string) {
  if (subject.trim().length < 3 || subject.trim().length > 150) return 'The subject must be between 3 and 150 characters.'
  if (message.trim().length < 10) return 'Please write a longer message.'
  if (message.length > 5000) return 'Please keep the message under 5,000 characters.'
  return null
}

function campaignEmail(subject: string, message: string) {
  return buildPartnerMessageEmail({ mode: 'campaign', subject, message, siteUrl: getSiteUrl(), unsubscribeUrl: '{{ unsubscribe }}', mirrorUrl: '{{ mirror }}' })
}

/** Message to everyone, step 1: saves the message as a draft in Brevo and sends one test copy. */
export async function sendPartnerTest(subject: string, message: string, testEmail: string, existingCampaignId: number | null): Promise<PartnerActionResult> {
  await requireAdmin()
  const config = getBrevoConfig()
  if (!config.partnersReady) return { ok: false, error: NOT_SET_UP }

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
      name: `Partners: ${subject.trim().slice(0, 80)} (${date}) ${MARKER}`,
      subject: subject.trim(),
      previewText: built.previewText,
      htmlContent: built.html,
      listId: config.partnerListId,
    })
    if (!created.ok) return { ok: false, error: `Brevo could not create the email: ${created.message}` }
    campaignId = created.data
  }

  const sent = await sendTest(campaignId, [email])
  if (!sent.ok) return { ok: false, error: `Brevo could not send the test: ${sent.message}` }
  return { ok: true, campaignId, message: `Test email sent to ${email}. Check your inbox (and the Promotions or Spam folder).` }
}

/** Message to everyone, step 2: sends the tested draft to the whole partner list. */
export async function sendPartnerCampaign(campaignId: number, subject: string, message: string): Promise<PartnerActionResult> {
  const { user } = await requireAdmin()
  const config = getBrevoConfig()
  if (!config.partnersReady) return { ok: false, error: NOT_SET_UP }
  if (!Number.isInteger(campaignId) || campaignId <= 0) return { ok: false, error: 'Send a test email first.' }

  const problem = checkMessage(subject, message)
  if (problem) return { ok: false, error: problem }

  const campaign = await getCampaign(campaignId)
  if (!campaign.ok) return { ok: false, error: `Brevo could not find the email: ${campaign.message}` }
  if (campaign.data.name && !campaign.data.name.includes(MARKER)) return { ok: false, error: 'That email is not a partner message. Reload the page and start again.' }
  if (campaign.data.status && campaign.data.status !== 'draft') return { ok: false, error: 'That email has already been sent or scheduled.' }

  const subscribers = await getSubscriberCount(config.partnerListId)
  if (subscribers.ok && subscribers.data === 0) return { ok: false, error: 'There are no partners to send to yet.' }

  // Make sure exactly what is on screen is what gets sent.
  const built = campaignEmail(subject.trim(), message)
  const updated = await updateCampaign(campaignId, { subject: subject.trim(), previewText: built.previewText, htmlContent: built.html })
  if (!updated.ok) return { ok: false, error: `Brevo could not update the draft: ${updated.message}` }

  const sent = await sendNow(campaignId)
  if (!sent.ok) {
    const reason = sent.status === 402 ? 'Brevo reports there are not enough sending credits.' : sent.message
    return { ok: false, error: `Brevo could not send the email: ${reason}` }
  }

  await logActivity(user, 'partner.broadcast', 'Partner email to everyone', subject.trim())
  return { ok: true, message: 'Sent! Brevo is delivering your message to the partners now.' }
}

/** Message to one partner: sent straight away. */
export async function sendPartnerMessage(partnerId: string, subject: string, message: string): Promise<PartnerActionResult> {
  const { supabase, user } = await requireAdmin()
  const config = getBrevoConfig()
  if (!config.apiKey) return { ok: false, error: NOT_SET_UP }

  if (!/^[0-9a-f-]{36}$/i.test(partnerId)) return { ok: false, error: 'Partner not found.' }
  const problem = checkMessage(subject, message)
  if (problem) return { ok: false, error: problem }

  const { data: partner } = await supabase.from('partners').select('full_name, email').eq('id', partnerId).maybeSingle()
  if (!partner) return { ok: false, error: 'Partner not found.' }

  const built = buildPartnerMessageEmail({ mode: 'direct', subject: subject.trim(), message, siteUrl: getSiteUrl(), firstName: splitName(partner.full_name).firstName })
  const sent = await sendTransactional({ to: { email: partner.email, name: partner.full_name }, subject: subject.trim(), htmlContent: built.html })
  if (!sent.ok) return { ok: false, error: `Brevo could not send the message: ${sent.message}` }

  await logActivity(user, 'partner.message', 'Partner message', `${partner.full_name}: ${subject.trim()}`)
  return { ok: true, message: `Message sent to ${partner.full_name}.` }
}

/** Removes a partner from the dashboard and from the Brevo partner list only. */
export async function deletePartner(formData: FormData) {
  const { supabase, user } = await requireAdmin()
  const id = String(formData.get('id') ?? '')
  if (!/^[0-9a-f-]{36}$/i.test(id)) return

  const { data: partner } = await supabase.from('partners').select('full_name, email').eq('id', id).maybeSingle()
  if (!partner) redirect('/admin/partners')

  const { error } = await supabase.from('partners').delete().eq('id', id)
  if (error) {
    console.error('Partner: could not delete', error.code)
    return
  }

  await logActivity(user, 'partner.delete', 'Partner', partner.full_name)

  const config = getBrevoConfig()
  if (config.apiKey && Number.isInteger(config.partnerListId)) {
    const removed = await removeFromList(partner.email, config.partnerListId)
    if (!removed.ok) console.error('Partner: could not remove the contact from the Brevo list', removed.status)
  }

  revalidatePath('/admin/partners')
  redirect('/admin/partners?deleted=1')
 }
