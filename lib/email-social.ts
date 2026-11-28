const FONT = 'Arial, Helvetica, sans-serif'

/** The DOE Foundation social links, the same ones as the website footer. */
export const SOCIAL_LINKS = [
  { name: 'WhatsApp', href: 'https://wa.link/sq0qzb', icon: 'whatsapp' },
  { name: 'Facebook', href: 'https://www.facebook.com/share/16YXz6DD8T5/', icon: 'facebook' },
  { name: 'Instagram', href: 'https://www.instagram.com/the_doe_foundation?obrf=MTQ3czczNmVtcGkyZA==', icon: 'instagram' },
  { name: 'LinkedIn', href: 'https://www.linkedin.com/company/thee-davida-omosomi-empowerment-foundation/', icon: 'linkedin' },
] as const

/**
 * Row of social icons for the base of an email.
 * Gmail and Outlook do not display SVG, so each icon is a small PNG made from the SVG files in /public/email-icons,
 * loaded from the live website (so the site must be deployed for them to show).
 */
export function socialIconsHtml(siteUrl: string) {
  const base = siteUrl.replace(/\/+$/, '')
  const cells = SOCIAL_LINKS.map(
    (s) =>
      `<td style="padding:0 10px 0 0;"><a href="${s.href}" target="_blank" style="text-decoration:none;"><img src="${base}/email-icons/${s.icon}.png" alt="${s.name}" title="${s.name}" width="32" height="32" style="display:block;width:32px;height:32px;border:0;border-radius:16px;"></a></td>`,
  ).join('')
  return `      <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:4px 0 14px 0;"><tr>${cells}</tr></table>`
}

/** Social icons, then the organisation name, with "Abuja, Nigeria" on its own line. */
export function orgFooterHtml(siteUrl: string) {
  const style = `margin:0;font-family:${FONT};font-size:12px;line-height:1.7;color:#999999;`
  return `${socialIconsHtml(siteUrl)}
      <p style="${style}">Davida Omosomi Empowerment Foundation</p>
      <p style="${style}">Abuja, Nigeria</p>`
}
