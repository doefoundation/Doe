export const SITE_NAME = 'DOE Foundation'
export const ORG_NAME = 'The Davida Omosomi Empowerment Foundation'
export const SITE_DESCRIPTION =
  'DOE Foundation opens doors to quality education, mentorship and opportunity for young people in Nigeria through debate education, literacy, leadership, community outreach and scholarships.'

/**
 * The public address of the website, used to build absolute links for social previews and sharing.
 * Set SITE_URL in Vercel (for example https://www.thedoefoundation.com) so previews always use your real domain.
 */
export function getSiteUrl() {
  const explicit = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL
  if (explicit) return explicit.replace(/\/+$/, '')
  const production = process.env.VERCEL_PROJECT_PRODUCTION_URL
  if (production) return `https://${production}`
  return 'http://localhost:3000'
}

/** Turns Markdown article text into a short plain-text description for link previews. */
export function summarize(source: string, max = 200) {
  const text = source
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/^\s{0,3}(#{1,6}|>|[-*+]|\d{1,3}[.)])\s+/gm, '')
    .replace(/[*_`]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
  return text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text
}
