/**
 * Small helper for talking to the Brevo API from the server.
 * The API key never reaches the browser, and it is never written to the logs.
 */

const API = 'https://api.brevo.com/v3'

function clean(value: string | undefined) {
  return (value ?? '').trim().replace(/^["']|["']$/g, '').trim()
}

export function getBrevoConfig() {
  const apiKey = clean(process.env.BREVO_API_KEY)
  const listId = Number.parseInt(clean(process.env.BREVO_LIST_ID).replace(/^#/, ''), 10)
  const senderEmail = clean(process.env.BREVO_SENDER_EMAIL) || 'info@thedoefoundation.com'
  const senderName = clean(process.env.BREVO_SENDER_NAME) || 'The DOE Foundation'
  const volunteerListId = Number.parseInt(clean(process.env.BREVO_VOLUNTEER_LIST_ID).replace(/^#/, ''), 10)
  return {
    apiKey,
    listId,
    volunteerListId,
    senderEmail,
    senderName,
    ready: Boolean(apiKey) && Number.isInteger(listId),
    volunteersReady: Boolean(apiKey) && Number.isInteger(volunteerListId),
  }
}

export type BrevoResult<T> = { ok: true; data: T } | { ok: false; status: number; message: string }

async function call<T>(path: string, init: { method?: string; body?: unknown } = {}): Promise<BrevoResult<T>> {
  const { apiKey } = getBrevoConfig()
  try {
    const response = await fetch(`${API}${path}`, {
      method: init.method ?? 'GET',
      headers: {
        'api-key': apiKey,
        accept: 'application/json',
        ...(init.body !== undefined ? { 'content-type': 'application/json' } : {}),
      },
      body: init.body !== undefined ? JSON.stringify(init.body) : undefined,
      cache: 'no-store',
    })

    if (response.ok) {
      const text = await response.text()
      return { ok: true, data: (text ? JSON.parse(text) : {}) as T }
    }

    const detail = (await response.json().catch(() => null)) as { code?: string; message?: string } | null
    console.error('Brevo request failed.', `path=${path}`, `status=${response.status}`, `code=${detail?.code ?? 'none'}`, `message=${detail?.message ?? 'none'}`)
    return { ok: false, status: response.status, message: detail?.message ?? 'Brevo could not complete the request.' }
  } catch (error) {
    console.error('Could not reach Brevo.', `path=${path}`, error instanceof Error ? error.message : 'unknown error')
    return { ok: false, status: 0, message: 'Could not reach Brevo. Please try again.' }
  }
}

/** How many contacts are on the subscriber list. */
export async function getSubscriberCount(listId: number): Promise<BrevoResult<number>> {
  const result = await call<{ totalSubscribers?: number; uniqueSubscribers?: number }>(`/contacts/lists/${listId}`)
  if (!result.ok) return result
  return { ok: true, data: result.data.uniqueSubscribers ?? result.data.totalSubscribers ?? 0 }
}

export async function createCampaign(input: { name: string; subject: string; previewText: string; htmlContent: string; listId?: number }): Promise<BrevoResult<number>> {
  const config = getBrevoConfig()
  const { senderEmail, senderName } = config
  const listId = input.listId ?? config.listId
  const base = {
    name: input.name,
    subject: input.subject,
    htmlContent: input.htmlContent,
    sender: { name: senderName, email: senderEmail },
    replyTo: senderEmail,
    recipients: { listIds: [listId] },
  }

  let result = await call<{ id: number }>('/emailCampaigns', { method: 'POST', body: { ...base, previewText: input.previewText, mirrorActive: true } })

  // Some Brevo plans do not allow optional extras. Try again with only the essentials
  // (the preview text is also built into the email itself, so nothing important is lost).
  if (!result.ok && result.status === 400 && /not allowed|not available|upgrade|plan/i.test(result.message)) {
    result = await call<{ id: number }>('/emailCampaigns', { method: 'POST', body: base })
  }

  if (!result.ok) return result
  return { ok: true, data: result.data.id }
}

export async function getCampaign(id: number): Promise<BrevoResult<{ status?: string; name?: string }>> {
  return call<{ status?: string; name?: string }>(`/emailCampaigns/${id}`)
}

export async function sendTest(id: number, emails: string[]): Promise<BrevoResult<Record<string, never>>> {
  return call<Record<string, never>>(`/emailCampaigns/${id}/sendTest`, { method: 'POST', body: { emailTo: emails } })
}

export async function sendNow(id: number): Promise<BrevoResult<Record<string, never>>> {
  return call<Record<string, never>>(`/emailCampaigns/${id}/sendNow`, { method: 'POST' })
}

/** Changes the subject and content of a draft campaign. */
export async function updateCampaign(id: number, input: { subject: string; previewText: string; htmlContent: string }): Promise<BrevoResult<Record<string, never>>> {
  const base = { subject: input.subject, htmlContent: input.htmlContent }
  let result = await call<Record<string, never>>(`/emailCampaigns/${id}`, { method: 'PUT', body: { ...base, previewText: input.previewText } })
  if (!result.ok && result.status === 400 && /not allowed|not available|upgrade|plan/i.test(result.message)) {
    result = await call<Record<string, never>>(`/emailCampaigns/${id}`, { method: 'PUT', body: base })
  }
  return result
}

/** Adds (or updates) a contact on a list. */
export async function addContact(input: { email: string; listId: number; firstName: string; lastName: string }): Promise<BrevoResult<Record<string, never>>> {
  const base = { email: input.email, listIds: [input.listId], updateEnabled: true }
  const attributes = { FIRSTNAME: input.firstName, ...(input.lastName ? { LASTNAME: input.lastName } : {}) }
  let result = await call<Record<string, never>>('/contacts', { method: 'POST', body: { ...base, attributes } })
  // If the account does not have these name fields, add the contact without them.
  if (!result.ok && result.status === 400 && /attribute/i.test(result.message)) {
    result = await call<Record<string, never>>('/contacts', { method: 'POST', body: base })
  }
  return result
}

/** Removes a contact from Brevo completely. A missing contact counts as success. */
export async function removeContact(email: string): Promise<BrevoResult<Record<string, never>>> {
  const result = await call<Record<string, never>>(`/contacts/${encodeURIComponent(email)}`, { method: 'DELETE' })
  if (!result.ok && result.status === 404) return { ok: true, data: {} }
  return result
}

/** Sends one email to one person right away (confirmations and direct messages). */
export async function sendTransactional(input: { to: { email: string; name: string }; subject: string; htmlContent: string }): Promise<BrevoResult<Record<string, never>>> {
  const { senderEmail, senderName } = getBrevoConfig()
  return call<Record<string, never>>('/smtp/email', {
    method: 'POST',
    body: {
      sender: { name: senderName, email: senderEmail },
      to: [{ email: input.to.email, name: input.to.name }],
      replyTo: { email: senderEmail, name: senderName },
      subject: input.subject,
      htmlContent: input.htmlContent,
    },
  })
 }
