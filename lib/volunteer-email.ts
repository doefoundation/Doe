import { LOGO_URL } from '@/lib/brand'
import { orgFooterHtml } from '@/lib/email-social'

export const FONT = 'Arial, Helvetica, sans-serif'
export const SERIF = "Georgia, 'Times New Roman', serif"

/** Escapes text for HTML, and stops Brevo's template language from reading "{{ ... }}" typed by a person. */
export function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/\{\{/g, '{&#8203;{')
}

/** Turns plain text into paragraphs: blank lines start a new paragraph, single line breaks stay, web addresses become links. */
export function textToParagraphs(text: string) {
  return text
    .replace(/\r\n?/g, '\n')
    .trim()
    .split(/\n{2,}/)
    .map((paragraph) => {
      const html = escapeHtml(paragraph.trim())
        .replace(/(https?:\/\/[^\s<]*[^\s<.,;:!?)\]])/g, '<a href="$1" style="color:#d70063;text-decoration:underline;">$1</a>')
        .replace(/\n/g, '<br>')
      return `<p style="margin:16px 0 0 0;font-family:${FONT};font-size:16px;line-height:1.65;color:#444444;">${html}</p>`
    })
    .join('\n')
}

type Shell = { title: string; preheader: string; bodyHtml: string; footerHtml: string; siteUrl: string }

export function shell({ title, preheader, bodyHtml, footerHtml, siteUrl }: Shell) {
  const e = escapeHtml
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="x-apple-disable-message-reformatting">
<title>${e(title)}</title>
</head>
<body style="margin:0;padding:0;background-color:#f8f5ef;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${e(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f8f5ef;">
<tr><td align="center" style="padding:24px 12px;">
  <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;background-color:#ffffff;border-radius:16px;overflow:hidden;">
    <tr><td style="height:5px;line-height:5px;font-size:0;background-color:#d70063;">&nbsp;</td></tr>
    <tr><td style="padding:18px 28px;border-bottom:1px solid #eeeae2;">
      <a href="${e(siteUrl)}" style="text-decoration:none;"><img src="${e(LOGO_URL)}" alt="DOE Foundation" height="52" style="display:block;height:52px;width:auto;border:0;"></a>
    </td></tr>
    <tr><td style="padding:28px 28px 32px 28px;">
${bodyHtml}
    </td></tr>
    <tr><td style="padding:20px 28px;background-color:#faf8f4;border-top:1px solid #eeeae2;">
${footerHtml}
    </td></tr>
  </table>
</td></tr>
</table>
</body>
</html>`
}

export const footerLine = (text: string) => `      <p style="margin:0 0 8px 0;font-family:${FONT};font-size:12px;line-height:1.7;color:#777777;">${text}</p>`
export const org = (siteUrl: string) => orgFooterHtml(siteUrl)
export const link = (href: string, label: string) => `<a href="${href}" style="color:#777777;text-decoration:underline;">${label}</a>`

/** The email a volunteer receives straight after registering. */
export function buildVolunteerConfirmationEmail(input: { firstName: string; siteUrl: string }) {
  const e = escapeHtml
  const subject = 'Thank you for registering to volunteer with DOE Foundation'
  const preheader = 'We have received your registration and will be in touch.'
  const steps = ['Our team reviews your registration.', 'We contact you by email or phone about volunteering opportunities that suit you.', 'You will occasionally receive important updates from us.']
  const stepsHtml = steps
    .map((step, index) => `<tr><td valign="top" style="padding:6px 12px 6px 0;font-family:${FONT};font-size:15px;font-weight:bold;color:#d70063;">${index + 1}.</td><td style="padding:6px 0;font-family:${FONT};font-size:15px;line-height:1.6;color:#444444;">${e(step)}</td></tr>`)
    .join('\n')

  const bodyHtml = `      <h1 style="margin:0;font-family:${SERIF};font-size:28px;line-height:1.2;font-weight:normal;color:#1a1917;">Thank you for volunteering</h1>
      <p style="margin:16px 0 0 0;font-family:${FONT};font-size:16px;line-height:1.65;color:#444444;">Dear ${e(input.firstName)},</p>
      <p style="margin:12px 0 0 0;font-family:${FONT};font-size:16px;line-height:1.65;color:#444444;">Thank you for registering to volunteer with the DOE Foundation. We have received your details, and we are grateful for your willingness to support young people.</p>
      <p style="margin:20px 0 4px 0;font-family:${FONT};font-size:12px;letter-spacing:1.5px;text-transform:uppercase;color:#d70063;font-weight:bold;">What happens next</p>
      <table role="presentation" cellpadding="0" cellspacing="0" border="0">
${stepsHtml}
      </table>
      <p style="margin:20px 0 0 0;font-family:${FONT};font-size:16px;line-height:1.65;color:#444444;">If you have a question, simply reply to this email.</p>
      <p style="margin:20px 0 0 0;font-family:${FONT};font-size:16px;line-height:1.65;color:#444444;">Warm regards,<br>The DOE Foundation team</p>
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-top:24px;"><tr>
        <td align="center" style="background-color:#d70063;border-radius:999px;">
          <a href="${e(input.siteUrl)}/news" style="display:inline-block;padding:14px 28px;font-family:${FONT};font-size:16px;font-weight:bold;color:#ffffff;text-decoration:none;">Read our latest news</a>
        </td>
      </tr></table>`

  const footerHtml = [
    footerLine('You are receiving this email because you registered to volunteer at thedoefoundation.com. If this was not you, please reply to this email and we will remove your details.'),
    footerLine(link(`${e(input.siteUrl)}/privacy-policy`, 'Privacy Policy')),
    org(input.siteUrl),,
  ].join('\n')

  return { subject, html: shell({ title: subject, preheader, bodyHtml, footerHtml, siteUrl: input.siteUrl }) }
}

type MessageInput = {
  subject: string
  message: string
  siteUrl: string
} & (
  | { mode: 'direct'; firstName: string }
  | { mode: 'campaign'; unsubscribeUrl: string; mirrorUrl: string }
)

/** A message from the DOE Foundation team to one volunteer ("direct") or to the whole volunteer list ("campaign"). */
export function buildMessageEmail(input: MessageInput) {
  const e = escapeHtml
  const greeting = input.mode === 'direct' ? `Dear ${e(input.firstName)},` : 'Dear volunteer,'
  const plain = input.message.replace(/\s+/g, ' ').trim()
  const previewText = plain.length > 140 ? `${plain.slice(0, 139).trimEnd()}…` : plain

  const bodyHtml = `      <h1 style="margin:0;font-family:${SERIF};font-size:28px;line-height:1.2;font-weight:normal;color:#1a1917;">${e(input.subject.trim())}</h1>
      <p style="margin:20px 0 0 0;font-family:${FONT};font-size:16px;line-height:1.65;color:#444444;">${greeting}</p>
${textToParagraphs(input.message)}
      <p style="margin:24px 0 0 0;font-family:${FONT};font-size:16px;line-height:1.65;color:#444444;">Warm regards,<br>The DOE Foundation team</p>`

  const lines = [footerLine('You are receiving this message because you registered as a volunteer with the DOE Foundation at thedoefoundation.com.')]
  if (input.mode === 'campaign') {
    // Trusted values only. Brevo fills in "{{ unsubscribe }}" and "{{ mirror }}" for every recipient.
    lines.push(footerLine(`${link(input.unsubscribeUrl, 'Unsubscribe')} &nbsp;·&nbsp; ${link(`${e(input.siteUrl)}/privacy-policy`, 'Privacy Policy')} &nbsp;·&nbsp; ${link(input.mirrorUrl, 'View in browser')}`))
  } else {
    lines.push(footerLine(`Questions? Just reply to this email. &nbsp;·&nbsp; ${link(`${e(input.siteUrl)}/privacy-policy`, 'Privacy Policy')}`))
  }
    lines.push(org(input.siteUrl))

  return {
    previewText,
    html: shell({ title: input.subject, preheader: previewText, bodyHtml, footerHtml: lines.join('\n'), siteUrl: input.siteUrl }),
  }
}
