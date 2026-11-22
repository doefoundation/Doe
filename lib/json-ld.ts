import type { NewsPost } from '@/lib/cms-types'
import { SITE_NAME, getSiteUrl, summarize } from '@/lib/site'

const ORG_NAME = 'The Davida Omosomi Empowerment Foundation'
const LOGO_URL =
  'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/file_00000000ebbc8243b1a46e16cc7df432-Ey2WCQZAaBoXSQKqIEQgRVc2ePrSvh.png'

export function organizationJsonLd() {
  const url = getSiteUrl()
  return {
    '@context': 'https://schema.org',
    '@type': 'NGO',
    '@id': `${url}/#organization`,
    name: ORG_NAME,
    alternateName: SITE_NAME,
    url,
    logo: LOGO_URL,
    description:
      'A child- and youth-focused nonprofit raising purposeful leaders through debate education, advocacy, literacy development and community-centered initiatives.',
    foundingDate: '2025',
    email: 'info@thedoefoundation.com',
    telephone: '+2349066555162',
    areaServed: 'Nigeria',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Abuja',
      addressCountry: 'NG',
    },
    // Add your social profiles here, e.g. ['https://www.instagram.com/...', 'https://x.com/...']
    // sameAs: [],
  }
}

export function articleJsonLd(post: NewsPost) {
  const siteUrl = getSiteUrl()
  const url = `${siteUrl}/news/${post.slug}`
  const publisher = {
    '@type': 'Organization',
    name: ORG_NAME,
    logo: { '@type': 'ImageObject', url: LOGO_URL },
  }
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    headline: post.title.slice(0, 110),
    description: post.excerpt || summarize(post.content, 200),
    image: [post.cover_image_url || `${siteUrl}/opengraph-image`],
    datePublished: post.published_at ?? post.created_at,
    dateModified: post.updated_at,
    articleSection: post.category,
    author: { '@type': 'Organization', name: ORG_NAME, url: siteUrl },
    publisher,
  }
      }
