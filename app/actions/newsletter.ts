'use server'

export type NewsletterState = { status: 'success' | 'error'; message: string } | null

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const GENERIC_ERROR = 'Sorry, we could not subscribe you right now. Please try again shortly.'

export async function subscribeToNewsletter(_prev: NewsletterState, formData: FormData): Promise<NewsletterState> {
  // Bot traps: a hidden field real people never fill in, and forms submitted impossibly fast.
  const trap = String(formData.get('website') ?? '')
  const startedAt = Number(formData.get('started_at') ?? 0)
  if (trap || (startedAt && Date.now() - startedAt < 1500)) {
    return { status: 'success', message: 'Thank you for subscribing!' }
  }

  const email = String(formData.get('email') ?? '').trim().toLowerCase()
  if (!email || email.length > 254 || !EMAIL_PATTERN.test(email)) {
    return { status: 'error', message: 'Please enter a valid email address.' }
  }

  // Consent must be given explicitly. This is checked here as well as in the browser.
  if (formData.get('consent') !== 'on') {
    return { status: 'error', message: 'Please tick the box to accept the Privacy Policy.' }
  }

  const apiKey = process.env.BREVO_API_KEY
  const listId = Number.parseInt(process.env.BREVO_LIST_ID ?? '', 10)
  if (!apiKey || !Number.isInteger(listId)) {
    console.error('Newsletter signup is not configured: set BREVO_API_KEY and BREVO_LIST_ID')
    return { status: 'error', message: GENERIC_ERROR }
  }

  try {
    const response = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: { 'api-key': apiKey, 'content-type': 'application/json', accept: 'application/json' },
      body: JSON.stringify({ email, listIds: [listId], updateEnabled: true }),
      cache: 'no-store',
    })

    // 201 = new contact, 204 = existing contact updated. Both mean they are on the list.
    if (response.status === 201 || response.status === 204) {
      return { status: 'success', message: 'Thank you for subscribing! We will keep you updated.' }
    }
    if (response.status === 400) {
      return { status: 'error', message: 'Please check your email address and try again.' }
    }
    console.error('Brevo rejected the signup with status', response.status)
    return { status: 'error', message: GENERIC_ERROR }
  } catch {
    console.error('Could not reach Brevo')
    return { status: 'error', message: GENERIC_ERROR }
  }
}
