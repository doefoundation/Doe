'use server'

export type NewsletterState = { status: 'success' | 'error'; message: string } | null

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const GENERIC_ERROR = 'Sorry, we could not subscribe you right now. Please try again shortly.'

/** Removes spaces, line breaks and wrapping quotes that sometimes get pasted into environment variables. */
function cleanEnv(value: string | undefined) {
  return (value ?? '').trim().replace(/^["']|["']$/g, '').trim()
}

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

  const apiKey = cleanEnv(process.env.BREVO_API_KEY)
  const listId = Number.parseInt(cleanEnv(process.env.BREVO_LIST_ID).replace(/^#/, ''), 10)
  if (!apiKey || !Number.isInteger(listId)) {
    console.error(
      'Newsletter: not configured.',
      `BREVO_API_KEY present: ${Boolean(apiKey)}.`,
      `BREVO_LIST_ID valid: ${Number.isInteger(listId)}.`,
    )
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

    // Brevo explains the problem in the response. Log it (never the key) so it can be fixed.
    const detail = (await response.json().catch(() => null)) as { code?: string; message?: string } | null
    console.error('Newsletter: Brevo refused the signup.', `status=${response.status}`, `code=${detail?.code ?? 'none'}`, `message=${detail?.message ?? 'none'}`)

    if (response.status === 400 && /email/i.test(detail?.message ?? '')) {
      return { status: 'error', message: 'Please check your email address and try again.' }
    }
    return { status: 'error', message: GENERIC_ERROR }
  } catch (error) {
    console.error('Newsletter: could not reach Brevo.', error instanceof Error ? error.message : 'unknown error')
    return { status: 'error', message: GENERIC_ERROR }
  }
}
