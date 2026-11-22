import { HomePage } from '@/components/home-page'
import { JsonLd } from '@/components/json-ld'
import { getImpactStats, getPublishedNews } from '@/lib/cms'
import { organizationJsonLd } from '@/lib/json-ld'

export default async function Page() {
  const [impactStats, latestNews] = await Promise.all([getImpactStats(), getPublishedNews(1)])
  return (
    <>
      <JsonLd data={organizationJsonLd()} />
      <HomePage impactStats={impactStats} latestNews={latestNews} />
    </>
  )
}
