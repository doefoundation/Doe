import type { NewsPost } from '@/lib/cms-types'
import { ORG_NAME, SITE_DESCRIPTION, SITE_NAME, getSiteUrl, summarize } from '@/lib/site'

// The logo is served from this site's own public folder (public/icon.png), not an outside address.
function logoUrl() {
  return `${getSiteUrl()}/icon.png`
}

const SOCIAL_LINKS = [
  'https://www.facebook.com/share/16YXz6DD8T5/',
  'https://www.linkedin.com/company/thee-davida-omosomi-empowerment-foundation/',
  'https://www.instagram.com/the_doe_foundation/',
]

/** Describes the foundation to search engines. Shown on the homepage. */
export function organizationJsonLd() {
  const url = getSiteUrl()
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'NGO',
        '@id': `${url}/#organization`,
        name: ORG_NAME,
        alternateName: [SITE_NAME, 'DOE Foundation Nigeria'],
        url,
        logo: { '@type': 'ImageObject', url: logoUrl(), width: 424, height: 403 },
        image: `${url}/opengraph-image`,
        description: SITE_DESCRIPTION,
        foundingDate: '2025',
        email: 'info@thedoefoundation.com',
        telephone: '+2349066555162',
        areaServed: { '@type': 'Country', name: 'Nigeria' },
        knowsAbout: ['Debate education', 'Youth leadership', 'Literacy', 'Scholarships', 'Community outreach'],
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Kuje',
          addressRegion: 'Abuja (FCT)',
          addressCountry: 'NG',
        },
        contactPoint: [
          {
            '@type': 'ContactPoint',
            contactType: 'customer support',
            email: 'info@thedoefoundation.com',
            telephone: '+2349066555162',
            areaServed: 'NG',
            availableLanguage: ['English'],
          },
        ],
        sameAs: SOCIAL_LINKS,
      },
      {
        '@type': 'WebSite',
        '@id': `${url}/#website`,
        url,
        name: SITE_NAME,
        description: SITE_DESCRIPTION,
        inLanguage: 'en-NG',
        publisher: { '@id': `${url}/#organization` },
      },
    ],
  }
}

/** Breadcrumb trail (Home > News > Article). Search engines can show it under the page title. */
export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  const url = getSiteUrl()
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${url}${item.path === '/' ? '' : item.path}`,
    })),
  }
}

export function articleJsonLd(post: NewsPost) {
  const siteUrl = getSiteUrl()
  const url = `${siteUrl}/news/${post.slug}`
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
    inLanguage: 'en-NG',
    author: { '@type': 'Organization', name: ORG_NAME, url: siteUrl },
    publisher: {
      '@type': 'Organization',
      '@id': `${siteUrl}/#organization`,
      name: ORG_NAME,
      logo: { '@type': 'ImageObject', url: logoUrl() },
    },
  }
}
