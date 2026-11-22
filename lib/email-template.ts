import { LOGO_URL } from '@/lib/brand'
import { summarize } from '@/lib/site'

export type EmailArticle = {
  title: string
  excerpt: string
  content: string
  category: string
  coverImageUrl: string | null
  publishedAt: string | null
  url: string
}

type Options = {
  siteUrl: string
  /** Trusted values only (never article text). Brevo fills in "{{ unsubscribe }}" and "{{ mirror }}" for every recipient. Use "#" for an on-screen preview. */
  unsubscribeUrl: string
  mirrorUrl: string
}

/** Escapes text for HTML, and stops Brevo's template language from reading "{{ ... }}" typed inside an article. */
function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/\{\{/g, '{&#8203;{')
}

function formatLongDate(iso: string | null) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Africa/Lagos' })
}

export function buildArticleEmail(article: EmailArticle, options: Options) {
  const subject = article.title.trim()
  const summary = (article.excerpt.trim() || summarize(article.content, 220)).trim()
  const previewText = summary.length > 140 ? `${summary.slice(0, 139).trimEnd()}…` : summary
  const date = formatLongDate(article.publishedAt)
  const label = [article.category, date].filter(Boolean).join(' · ')
  const cover = article.coverImageUrl && /^https:\/\//i.test(article.coverImageUrl) ? article.coverImageUrl : null

  const e = escapeHtml
  const font = "Arial, Helvetica, sans-serif"
  const serif = "Georgia, 'Times New Roman', serif"

  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="x-apple-disable-message-reformatting">
<title>${e(subject)}</title>
</head>
<body style="margin:0;padding:0;background-color:#f8f5ef;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${e(previewText)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f8f5ef;">
<tr><td align="center" style="padding:24px 12px;">
  <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;background-color:#ffffff;border-radius:16px;overflow:hidden;">
    <tr><td style="height:5px;line-height:5px;font-size:0;background-color:#d70063;">&nbsp;</td></tr>
    <tr><td style="padding:18px 28px;border-bottom:1px solid #eeeae2;">
      <a href="${e(options.siteUrl)}" style="text-decoration:none;"><img src="${e(LOGO_URL)}" alt="DOE Foundation" height="52" style="display:block;height:52px;width:auto;border:0;"></a>
    </td></tr>${
      cover
        ? `
    <tr><td><a href="${e(article.url)}" style="text-decoration:none;"><img src="${e(cover)}" alt="" width="600" style="display:block;width:100%;height:auto;border:0;"></a></td></tr>`
        : ''
    }
    <tr><td style="padding:28px 28px 8px 28px;">
      <p style="margin:0;font-family:${font};font-size:12px;letter-spacing:1.5px;text-transform:uppercase;color:#d70063;font-weight:bold;">${e(label)}</p>
      <h1 style="margin:10px 0 0 0;font-family:${serif};font-size:28px;line-height:1.2;font-weight:normal;color:#1a1917;">${e(subject)}</h1>
      <p style="margin:16px 0 0 0;font-family:${font};font-size:16px;line-height:1.6;color:#444444;">${e(summary)}</p>
    </td></tr>
    <tr><td style="padding:20px 28px 32px 28px;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
        <td align="center" style="background-color:#d70063;border-radius:999px;">
          <a href="${e(article.url)}" style="display:inline-block;padding:14px 28px;font-family:${font};font-size:16px;font-weight:bold;color:#ffffff;text-decoration:none;">Read the full story</a>
        </td>
      </tr></table>
    </td></tr>
    <tr><td style="padding:20px 28px;background-color:#faf8f4;border-top:1px solid #eeeae2;">
      <p style="margin:0;font-family:${font};font-size:12px;line-height:1.7;color:#777777;">You are receiving this email because you subscribed to updates from the DOE Foundation at thedoefoundation.com.</p>
      <p style="margin:8px 0 0 0;font-family:${font};font-size:12px;line-height:1.7;color:#777777;">
        <a href="${options.unsubscribeUrl}" style="color:#777777;text-decoration:underline;">Unsubscribe</a> &nbsp;·&nbsp;
        <a href="${e(options.siteUrl)}/privacy-policy" style="color:#777777;text-decoration:underline;">Privacy Policy</a> &nbsp;·&nbsp;
        <a href="${options.mirrorUrl}" style="color:#777777;text-decoration:underline;">View in browser</a>
      </p>
      <p style="margin:8px 0 0 0;font-family:${font};font-size:12px;line-height:1.7;color:#999999;">Davida Omosomi Empowerment Foundation · Abuja, Nigeria</p>
    </td></tr>
  </table>
</td></tr>
</table>
</body>
</html>`

  return { subject, previewText, html }
}

/** The values Brevo replaces with each recipient's own links when the email is sent. */
export const BREVO_UNSUBSCRIBE = '{{ unsubscribe }}'
export const BREVO_MIRROR = '{{ mirror }}'
