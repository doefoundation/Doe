'use server'

import { addContact, getBrevoConfig, sendTransactional } from '@/lib/brevo'
import { createServiceClient } from '@/lib/supabase/admin'
import { getSiteUrl } from '@/lib/site'
import { splitName, validateVolunteer } from '@/lib/volunteer'
import { buildVolunteerConfirmationEmail } from '@/lib/volunteer-email'

export type VolunteerState = { status: 'success' | 'error'; message: string } | null

const GENERIC_ERROR = 'Sorry, we could not complete your registration right now. Please try again shortly.'
const THANKS = 'Thank you for registering! Your details have been received.'
const THANKS_WITH_EMAIL = 'Thank you for registering! Your details have been received and a confirmation email is on its way to you.'

function field(formData: FormData, key: string) {
  return String(formData.get(key) ?? '')
}

export async function registerVolunteer(_prev: VolunteerState, formData: FormData): Promise<VolunteerState> {
  // Bot traps: a hidden field real people never fill in, and forms submitted impossibly fast.
  const startedAt = Number(field(formData, 'started_at') || 0)
  if (field(formData, 'website') || (startedAt && Date.now() - startedAt < 2500)) {
    return { status: 'success', message: THANKS }
  }

  const checked = validateVolunteer({
    fullName: field(formData, 'full_name'),
    email: field(formData, 'email'),
    phone: field(formData, 'phone'),
    reason: field(formData, 'reason'),
    otherInfo: field(formData, 'other_info'),
    consent: field(formData, 'consent') === 'on',
  })
  if (!checked.ok) return { status: 'error', message: checked.error }
  const volunteer = checked.value

  // Registrations are saved with the service key, so the table itself stays closed to the public.
  const service = createServiceClient()

  // A simple brake against floods of fake registrations.
  const since = new Date(Date.now() - 10 * 60 * 1000).toISOString()
  const { count } = await service.from('volunteers').select('id', { count: 'exact', head: true }).gte('created_at', since)
  if ((count ?? 0) >= 25) {
    return { status: 'error', message: 'We are receiving a lot of registrations right now. Please try again in a few minutes.' }
  }

  const { error } = await service.from('volunteers').insert({
    full_name: volunteer.fullName,
    email: volunteer.email,
    phone: volunteer.phone,
    reason: volunteer.reason,
    other_info: volunteer.otherInfo,
    consented_at: new Date().toISOString(),
  })

  if (error) {
    // Already registered with this email. Answer the same way, and do not send another email.
    if (error.code === '23505') return { status: 'success', message: THANKS }
    console.error('Volunteer: could not save the registration', error.code)
    return { status: 'error', message: GENERIC_ERROR }
  }

  // The registration is safe. The email steps below are best effort and never undo it.
  const config = getBrevoConfig()
  const { firstName, lastName } = splitName(volunteer.fullName)
  let confirmationSent = false

  if (config.apiKey) {
    if (Number.isInteger(config.volunteerListId)) {
      const added = await addContact({ email: volunteer.email, listId: config.volunteerListId, firstName, lastName })
      if (!added.ok) console.error('Volunteer: could not add the contact to Brevo', added.status)
    } else {
      console.error('Volunteer: BREVO_VOLUNTEER_LIST_ID is not set')
    }

    const email = buildVolunteerConfirmationEmail({ firstName, siteUrl: getSiteUrl() })
    const sent = await sendTransactional({ to: { email: volunteer.email, name: volunteer.fullName }, subject: email.subject, htmlContent: email.html })
    confirmationSent = sent.ok
    if (!sent.ok) console.error('Volunteer: could not send the confirmation email', sent.status)
  } else {
    console.error('Volunteer: BREVO_API_KEY is not set')
  }

  return { status: 'success', message: confirmationSent ? THANKS_WITH_EMAIL : THANKS }
  }
