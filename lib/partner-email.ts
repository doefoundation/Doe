import { FONT, SERIF, escapeHtml, footerLine, link, org, shell, textToParagraphs } from '@/lib/volunteer-email'
import type { PartnerInput } from '@/lib/partner'

/** The email a partner receives straight after sending their details. */
export function buildPartnerConfirmationEmail(input: { firstName: string; siteUrl: string }) {
  const e = escapeHtml
  const subject = 'Thank you for your interest in partnering with DOE Foundation'
  const preheader = 'We have received your details and will be in touch.'
  const steps = [
    'Our team reviews your enquiry.',
    'We contact you by email or phone to talk about how we can work together.',
    'You will occasionally receive important information from us.',
  ]
  const stepsHtml = steps
    .map((step, index) => `<tr><td valign="top" style="padding:6px 12px 6px 0;font-family:${FONT};font-size:15px;font-weight:bold;color:#d70063;">${index + 1}.</td><td style="padding:6px 0;font-family:${FONT};font-size:15px;line-height:1.6;color:#444444;">${e(step)}</td></tr>`)
    .join('\n')

  const bodyHtml = `      <h1 style="margin:0;font-family:${SERIF};font-size:28px;line-height:1.2;font-weight:normal;color:#1a1917;">Thank you for reaching out</h1>
      <p style="margin:16px 0 0 0;font-family:${FONT};font-size:16px;line-height:1.65;color:#444444;">Dear ${e(input.firstName)},</p>
      <p style="margin:12px 0 0 0;font-family:${FONT};font-size:16px;line-height:1.65;color:#444444;">Thank you for your interest in partnering with the DOE Foundation. We have received your details, and we are grateful for your willingness to support young people.</p>
      <p style="margin:20px 0 4px 0;font-family:${FONT};font-size:12px;letter-spacing:1.5px;text-transform:uppercase;color:#d70063;font-weight:bold;">What happens next</p>
      <table role="presentation" cellpadding="0" cellspacing="0" border="0">
${stepsHtml}
      </table>
      <p style="margin:20px 0 0 0;font-family:${FONT};font-size:16px;line-height:1.65;color:#444444;">If you have a question, simply reply to this email.</p>
      <p style="margin:20px 0 0 0;font-family:${FONT};font-size:16px;line-height:1.65;color:#444444;">Warm regards,<br>The DOE Foundation team</p>
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-top:24px;"><tr>
        <td align="center" style="background-color:#d70063;border-radius:999px;">
          <a href="${e(input.siteUrl)}/programs" style="display:inline-block;padding:14px 28px;font-family:${FONT};font-size:16px;font-weight:bold;color:#ffffff;text-decoration:none;">Explore our programs</a>
        </td>
      </tr></table>`

  const footerHtml = [
    footerLine('You are receiving this email because you asked about partnering with the DOE Foundation at thedoefoundation.com. If this was not you, please reply to this email and we will remove your details.'),
    footerLine(link(`${e(input.siteUrl)}/privacy-policy`, 'Privacy Policy')),
    org(input.siteUrl),
  ].join('\n')

  return { subject, html: shell({ title: subject, preheader, bodyHtml, footerHtml, siteUrl: input.siteUrl }) }
}

/** The alert the DOE team receives when someone submits the form. */
export function buildPartnerNotificationEmail(input: { siteUrl: string; id: string; partner: PartnerInput }) {
  const e = escapeHtml
  const { partner } = input
  const who = partner.organisationName ? `${partner.fullName} (${partner.organisationName})` : partner.fullName
  const subject = `New partnership enquiry: ${who}`.slice(0, 150)

  const row = (label: string, value: string) =>
    `<tr><td valign="top" style="padding:8px 14px 8px 0;font-family:${FONT};font-size:13px;color:#777777;white-space:nowrap;">${e(label)}</td><td style="padding:8px 0;font-family:${FONT};font-size:15px;line-height:1.55;color:#1a1917;">${e(value || '—').replace(/\n/g, '<br>')}</td></tr>`

  const rows = [
    row('Type', partner.partnerType === 'organisation' ? 'Organisation' : 'Individual'),
    row('Name', partner.fullName),
    row('Organisation', partner.organisationName),
    row('Email', partner.email),
    row('Phone', partner.phone),
    row('Interested in', partner.interest),
    row('Message', partner.message),
    row('Heard about us', partner.heardFrom),
  ].join('\n')

  const bodyHtml = `      <h1 style="margin:0;font-family:${SERIF};font-size:26px;line-height:1.2;font-weight:normal;color:#1a1917;">New partnership enquiry</h1>
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-top:16px;width:100%;">
${rows}
      </table>
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-top:20px;"><tr>
        <td align="center" style="background-color:#d70063;border-radius:999px;">
          <a href="${e(input.siteUrl)}/admin/partners/${e(input.id)}" style="display:inline-block;padding:14px 28px;font-family:${FONT};font-size:16px;font-weight:bold;color:#ffffff;text-decoration:none;">Open in the dashboard</a>
        </td>
      </tr></table>`

  const footerHtml = [footerLine('Automatic notification from the Partner with us form.'), org(input.siteUrl)].join('\n')
  return { subject, html: shell({ title: subject, preheader: `${who} would like to partner with us.`, bodyHtml, footerHtml, siteUrl: input.siteUrl }) }
}

type MessageInput = {
  subject: string
  message: string
  siteUrl: string
} & (
  | { mode: 'direct'; firstName: string }
  | { mode: 'campaign'; unsubscribeUrl: string; mirrorUrl: string }
)

/** A message from the DOE Foundation team to one partner ("direct") or to the whole partner list ("campaign"). */
export function buildPartnerMessageEmail(input: MessageInput) {
  const e = escapeHtml
  const greeting = input.mode === 'direct' ? `Dear ${e(input.firstName)},` : 'Dear partner,'
  const plain = input.message.replace(/\s+/g, ' ').trim()
  const previewText = plain.length > 140 ? `${plain.slice(0, 139).trimEnd()}…` : plain

  const bodyHtml = `      <h1 style="margin:0;font-family:${SERIF};font-size:28px;line-height:1.2;font-weight:normal;color:#1a1917;">${e(input.subject.trim())}</h1>
      <p style="margin:20px 0 0 0;font-family:${FONT};font-size:16px;line-height:1.65;color:#444444;">${greeting}</p>
${textToParagraphs(input.message)}
      <p style="margin:24px 0 0 0;font-family:${FONT};font-size:16px;line-height:1.65;color:#444444;">Warm regards,<br>The DOE Foundation team</p>`

  const lines = [footerLine('You are receiving this message because you asked about partnering with the DOE Foundation at thedoefoundation.com.')]
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
