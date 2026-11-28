import type { MetadataRoute } from 'next'
import { getPublishedNews } from '@/lib/cms'
import { getSiteUrl } from '@/lib/site'

// Search engines mostly ignore "priority" and "changeFrequency", so the important signal here is lastModified.
// We only set lastModified where we genuinely know it (the news), rather than claiming every page changed today.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl()
  const posts = await getPublishedNews()

  const latestUpdate = posts.length
    ? new Date(Math.max(...posts.map((p) => new Date(p.updated_at).getTime())))
    : undefined

  const pages: MetadataRoute.Sitemap = [
    { url: siteUrl, lastModified: latestUpdate, changeFrequency: 'weekly', priority: 1 },
    { url: `${siteUrl}/programs`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${siteUrl}/donate`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${siteUrl}/partner`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${siteUrl}/volunteer`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${siteUrl}/news`, lastModified: latestUpdate, changeFrequency: 'daily', priority: 0.8 },
    { url: `${siteUrl}/our-team`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${siteUrl}/privacy-policy`, changeFrequency: 'weekly', priority: 0.2 },
    { url: `${siteUrl}/cookie-policy`, changeFrequency: 'weekly', priority: 0.2 },
  ]

  const articles: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${siteUrl}/news/${post.slug}`,
    lastModified: new Date(post.updated_at),
    changeFrequency: 'monthly',
    priority: 0.7,
    // Helps the cover photo appear in Google Images.
    ...(post.cover_image_url ? { images: [post.cover_image_url] } : {}),
  }))

  return [...pages, ...articles]
}
