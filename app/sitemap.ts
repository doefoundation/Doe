import type { MetadataRoute } from 'next'
import { getPublishedNews } from '@/lib/cms'
import { getSiteUrl } from '@/lib/site'

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
    { url: `${siteUrl}/our-team`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${siteUrl}/news`, lastModified: latestUpdate, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${siteUrl}/privacy-policy`, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${siteUrl}/cookie-policy`, changeFrequency: 'yearly', priority: 0.2 },
  ]

  const articles: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${siteUrl}/news/${post.slug}`,
    lastModified: new Date(post.updated_at),
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  return [...pages, ...articles]
}
