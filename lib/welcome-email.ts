import { LOGO_URL } from '@/lib/brand'
import { orgFooterHtml } from '@/lib/email-social'
import { escapeHtml } from '@/lib/volunteer-email'

const FONT = 'Arial, Helvetica, sans-serif'
const SERIF = "Georgia, 'Times New Roman', serif"

export type WelcomeArticle = { title: string; slug: string; category: string; cover_image_url: string | null }

/** The email a new newsletter subscriber receives straight after signing up. */
export function buildWelcomeEmail(input: { siteUrl: string; articles: WelcomeArticle[] }) {
  const e = escapeHtml
  const site = input.siteUrl
  const subject = 'Welcome to the DOE Foundation family'
  const preheader = 'Thank you for subscribing. Here is what to expect, and our latest stories.'

  const rows = input.articles
    .slice(0, 3)
    .map((article) => {
      const url = `${site}/news/${article.slug}`
      const cover = article.cover_image_url && /^https:\/\//i.test(article.cover_image_url) ? article.cover_image_url : null
      const thumb = cover
        ? `<td width="88" valign="top" style="width:88px;"><a href="${e(url)}" style="text-decoration:none;"><img src="${e(cover)}" alt="" width="88" height="88" style="display:block;width:88px;height:88px;border-radius:8px;object-fit:cover;border:0;"></a></td>`
        : ''
      return `        <tr><td style="padding:14px 0;border-bottom:1px solid #eeeae2;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
            ${thumb}
            <td valign="top" style="${cover ? 'padding-left:14px;' : ''}">
              <p style="margin:0;font-family:${FONT};font-size:12px;letter-spacing:1.2px;text-transform:uppercase;color:#d70063;font-weight:bold;">${e(article.category)}</p>
              <p style="margin:4px 0 0 0;font-family:${FONT};font-size:16px;line-height:1.4;font-weight:bold;"><a href="${e(url)}" style="color:#1a1917;text-decoration:none;">${e(article.title)}</a></p>
              <p style="margin:6px 0 0 0;font-family:${FONT};font-size:14px;"><a href="${e(url)}" style="color:#d70063;text-decoration:underline;">Read the story &rarr;</a></p>
            </td>
          </tr></table>
        </td></tr>`
    })
    .join('\n')

  const latest = rows
    ? `      <p style="margin:28px 0 0 0;font-family:${FONT};font-size:12px;letter-spacing:1.5px;text-transform:uppercase;color:#d70063;font-weight:bold;">Latest from us</p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
${rows}
      </table>`
    : ''

  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="x-apple-disable-message-reformatting">
<title>${e(subject)}</title>
</head>
<body style="margin:0;padding:0;background-color:#f8f5ef;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${e(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f8f5ef;">
<tr><td align="center" style="padding:24px 12px;">
  <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;background-color:#ffffff;border-radius:16px;overflow:hidden;">
    <tr><td style="height:5px;line-height:5px;font-size:0;background-color:#d70063;">&nbsp;</td></tr>
    <tr><td style="padding:18px 28px;border-bottom:1px solid #eeeae2;">
      <a href="${e(site)}" style="text-decoration:none;"><img src="${e(LOGO_URL)}" alt="DOE Foundation" height="52" style="display:block;height:52px;width:auto;border:0;"></a>
    </td></tr>
    <tr><td style="padding:28px 28px 32px 28px;">
      <h1 style="margin:0;font-family:${SERIF};font-size:30px;line-height:1.2;font-weight:normal;color:#1a1917;">Welcome to the DOE Foundation family</h1>
      <p style="margin:16px 0 0 0;font-family:${FONT};font-size:16px;line-height:1.65;color:#444444;">Thank you for subscribing to our newsletter. We are a child- and youth-focused nonprofit raising purposeful leaders through advocacy, literacy and debate, and we are glad you are following our journey.</p>
      <p style="margin:12px 0 0 0;font-family:${FONT};font-size:16px;line-height:1.65;color:#444444;">You will hear from us occasionally with news about our programmes, the young people we support, and ways to get involved. We will never spam your mailbox.</p>
${latest}
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-top:24px;"><tr>
        <td align="center" style="background-color:#d70063;border-radius:999px;">
          <a href="${e(site)}/news" style="display:inline-block;padding:14px 28px;font-family:${FONT};font-size:16px;font-weight:bold;color:#ffffff;text-decoration:none;">Read all our news</a>
        </td>
      </tr></table>
      <p style="margin:28px 0 0 0;font-family:${FONT};font-size:12px;letter-spacing:1.5px;text-transform:uppercase;color:#d70063;font-weight:bold;">Want to do more?</p>
      <p style="margin:8px 0 0 0;font-family:${FONT};font-size:15px;line-height:1.8;color:#444444;">
        <a href="${e(site)}/volunteer" style="color:#d70063;text-decoration:underline;">Volunteer with us</a><br>
        <a href="${e(site)}/donate" style="color:#d70063;text-decoration:underline;">Sponsor a debate club</a>
      </p>
      <p style="margin:24px 0 0 0;font-family:${FONT};font-size:16px;line-height:1.65;color:#444444;">Warm regards,<br>The DOE Foundation team</p>
    </td></tr>
    <tr><td style="padding:20px 28px;background-color:#faf8f4;border-top:1px solid #eeeae2;">
      <p style="margin:0 0 8px 0;font-family:${FONT};font-size:12px;line-height:1.7;color:#777777;">You are receiving this email because you subscribed to updates from the DOE Foundation at thedoefoundation.com. If this was not you, reply to this email and we will remove your address. You can stop our newsletters at any time with the unsubscribe link at the bottom of any newsletter.</p>
      <p style="margin:0 0 8px 0;font-family:${FONT};font-size:12px;line-height:1.7;color:#777777;"><a href="${e(site)}/privacy-policy" style="color:#777777;text-decoration:underline;">Privacy Policy</a></p>
      ${orgFooterHtml(site)}
    </td></tr>
  </table>
</td></tr>
</table>
</body>
</html>`

  return { subject, html }
}
