export const SITE_NAME = 'DOE Foundation'

/**
 * The public address of the website, used to build absolute links for social previews and sharing.
 * Set NEXT_PUBLIC_SITE_URL in Vercel (for example https://doefoundation.org) so previews always use your real domain.
 */
export function getSiteUrl() {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL
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
