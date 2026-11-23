export const partnerInterests = [
  'Funding or sponsorship',
  'Skills or pro bono support',
  'In-kind support (materials, equipment, venues)',
  'Access to schools or communities',
  'Media or advocacy',
  'Programme collaboration',
  'Something else',
] as const

export type PartnerType = 'individual' | 'organisation'

export type PartnerInput = {
  partnerType: PartnerType
  fullName: string
  organisationName: string
  email: string
  phone: string
  interest: string
  message: string
  heardFrom: string
}

type RawPartner = {
  partnerType: string
  fullName: string
  organisationName: string
  email: string
  phone: string
  interest: string
  message: string
  heardFrom: string
  consent: boolean
}

type Validation = { ok: true; value: PartnerInput } | { ok: false; error: string }

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validatePartner(raw: RawPartner): Validation {
  if (raw.partnerType !== 'individual' && raw.partnerType !== 'organisation') {
    return { ok: false, error: 'Please choose whether you are an individual or an organisation.' }
  }
  const partnerType: PartnerType = raw.partnerType === 'organisation' ? 'organisation' : 'individual'

  const fullName = raw.fullName.replace(/\s+/g, ' ').trim()
  if (fullName.length < 2 || fullName.length > 120 || !/\p{L}/u.test(fullName)) {
    return { ok: false, error: 'Please enter your full name.' }
  }

  let organisationName = ''
  if (partnerType === 'organisation') {
    organisationName = raw.organisationName.replace(/\s+/g, ' ').trim()
    if (organisationName.length < 2 || organisationName.length > 150) {
      return { ok: false, error: 'Please enter your organisation’s name.' }
    }
  }

  const email = raw.email.trim().toLowerCase()
  if (!email || email.length > 254 || !EMAIL_PATTERN.test(email)) {
    return { ok: false, error: 'Please enter a valid email address.' }
  }

  const phone = raw.phone.trim().replace(/[\s().-]/g, '')
  if (!/^\+?\d{7,15}$/.test(phone)) {
    return { ok: false, error: 'Please enter a valid phone number, for example +2348012345678.' }
  }

  if (!(partnerInterests as readonly string[]).includes(raw.interest)) {
    return { ok: false, error: 'Please choose how you would like to partner with us.' }
  }

  const message = raw.message.trim()
  if (message.length < 10) return { ok: false, error: 'Please tell us a little more about how you would like to work with us.' }
  if (message.length > 1500) return { ok: false, error: 'Please keep your message to 1,500 characters or fewer.' }

  const heardFrom = raw.heardFrom.trim()
  if (heardFrom.length > 150) return { ok: false, error: 'Please keep “How did you hear about us?” to 150 characters or fewer.' }

  if (!raw.consent) {
    return { ok: false, error: 'Please tick the box to confirm you agree to receive important information and to be contacted.' }
  }

  return { ok: true, value: { partnerType, fullName, organisationName, email, phone, interest: raw.interest, message, heardFrom } }
  }
