export type VolunteerInput = { fullName: string; email: string; phone: string; reason: string; otherInfo: string }

type RawVolunteer = { fullName: string; email: string; phone: string; reason: string; otherInfo: string; consent: boolean }
type Validation = { ok: true; value: VolunteerInput } | { ok: false; error: string }

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateVolunteer(raw: RawVolunteer): Validation {
  const fullName = raw.fullName.replace(/\s+/g, ' ').trim()
  if (fullName.length < 2 || fullName.length > 120 || !/\p{L}/u.test(fullName)) {
    return { ok: false, error: 'Please enter your full name.' }
  }

  const email = raw.email.trim().toLowerCase()
  if (!email || email.length > 254 || !EMAIL_PATTERN.test(email)) {
    return { ok: false, error: 'Please enter a valid email address.' }
  }

  const phone = raw.phone.trim().replace(/[\s().-]/g, '')
  if (!/^\+?\d{7,15}$/.test(phone)) {
    return { ok: false, error: 'Please enter a valid phone number, for example +2348012345678.' }
  }

  const reason = raw.reason.trim()
  if (reason.length < 10) return { ok: false, error: 'Please tell us a little more about why you want to volunteer.' }
  if (reason.length > 1000) return { ok: false, error: 'Please keep your reason to 1,000 characters or fewer.' }

  const otherInfo = raw.otherInfo.trim()
  if (otherInfo.length > 1000) return { ok: false, error: 'Please keep the other information to 1,000 characters or fewer.' }

  if (!raw.consent) return { ok: false, error: 'Please tick the box to confirm you agree to receive occasional updates.' }

  return { ok: true, value: { fullName, email, phone, reason, otherInfo } }
}

export function splitName(fullName: string) {
  const [firstName, ...rest] = fullName.trim().split(' ')
  return { firstName, lastName: rest.join(' ') }
 }
