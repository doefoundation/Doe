'use server'

import { addContact, getBrevoConfig, sendTransactional } from '@/lib/brevo'
import { createServiceClient } from '@/lib/supabase/admin'
import { getSiteUrl } from '@/lib/site'
import { validatePartner } from '@/lib/partner'
import { buildPartnerConfirmationEmail, buildPartnerNotificationEmail } from '@/lib/partner-email'
import { splitName } from '@/lib/volunteer'

export type PartnerState = { status: 'success' | 'error'; message: string } | null

const GENERIC_ERROR = 'Sorry, we could not send your details right now. Please try again shortly.'
const THANKS = 'Thank you for your interest in partnering with us! Your details have been received.'
const THANKS_WITH_EMAIL = 'Thank you for your interest in partnering with us! Your details have been received and a confirmation email is on its way to you.'

function field(formData: FormData, key: string) {
  return String(formData.get(key) ?? '')
}

export async function registerPartner(_prev: PartnerState, formData: FormData): Promise<PartnerState> {
  // Bot traps: a hidden field real people never fill in, and forms submitted impossibly fast.
  const startedAt = Number(field(formData, 'started_at') || 0)
  if (field(formData, 'website') || (startedAt && Date.now() - startedAt < 2500)) {
    return { status: 'success', message: THANKS }
  }

  const checked = validatePartner({
    partnerType: field(formData, 'partner_type'),
    fullName: field(formData, 'full_name'),
    organisationName: field(formData, 'organisation_name'),
    email: field(formData, 'email'),
    phone: field(formData, 'phone'),
    interest: field(formData, 'interest'),
    message: field(formData, 'message'),
    heardFrom: field(formData, 'heard_from'),
    consent: field(formData, 'consent') === 'on',
  })
  if (!checked.ok) return { status: 'error', message: checked.error }
  const partner = checked.value

  // Saved with the service key, so the table itself stays closed to the public.
  const service = createServiceClient()

  // A simple brake against floods of fake enquiries.
  const since = new Date(Date.now() - 10 * 60 * 1000).toISOString()
  const { count } = await service.from('partners').select('id', { count: 'exact', head: true }).gte('created_at', since)
  if ((count ?? 0) >= 25) {
    return { status: 'error', message: 'We are receiving a lot of enquiries right now. Please try again in a few minutes.' }
  }

  const { data: saved, error } = await service
    .from('partners')
    .insert({
      partner_type: partner.partnerType,
      full_name: partner.fullName,
      organisation_name: partner.organisationName,
      email: partner.email,
      phone: partner.phone,
      interest: partner.interest,
      message: partner.message,
      heard_from: partner.heardFrom,
      consented_at: new Date().toISOString(),
    })
    .select('id')
    .single()

  if (error || !saved) {
    // Already submitted with this email. Answer the same way, and do not send another email.
    if (error?.code === '23505') return { status: 'success', message: THANKS }
    console.error('Partner: could not save the enquiry', error?.code)
    return { status: 'error', message: GENERIC_ERROR }
  }

  // The enquiry is safe. The email steps below are best effort and never undo it.
  const config = getBrevoConfig()
  const siteUrl = getSiteUrl()
  const { firstName, lastName } = splitName(partner.fullName)
  let confirmationSent = false

  if (config.apiKey) {
    if (Number.isInteger(config.partnerListId)) {
      const added = await addContact({ email: partner.email, listId: config.partnerListId, firstName, lastName })
      if (!added.ok) console.error('Partner: could not add the contact to Brevo', added.status)
    } else {
      console.error('Partner: BREVO_PARTNER_LIST_ID is not set')
    }

    const confirmation = buildPartnerConfirmationEmail({ firstName, siteUrl })
    const sent = await sendTransactional({ to: { email: partner.email, name: partner.fullName }, subject: confirmation.subject, htmlContent: confirmation.html })
    confirmationSent = sent.ok
    if (!sent.ok) console.error('Partner: could not send the confirmation email', sent.status)

    // Tell the DOE team a new enquiry has arrived (remove these four lines if you do not want the alert).
    const alert = buildPartnerNotificationEmail({ siteUrl, id: saved.id, partner })
    const notified = await sendTransactional({ to: { email: config.senderEmail, name: config.senderName }, subject: alert.subject, htmlContent: alert.html })
    if (!notified.ok) console.error('Partner: could not send the team alert', notified.status)
  } else {
    console.error('Partner: BREVO_API_KEY is not set')
  }

  return { status: 'success', message: confirmationSent ? THANKS_WITH_EMAIL : THANKS }
  }
