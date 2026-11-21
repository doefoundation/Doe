import { HomePage } from '@/components/home-page'
import { getImpactStats, getPublishedNews } from '@/lib/cms'

export default async function Page() {
  const [impactStats, latestNews] = await Promise.all([getImpactStats(), getPublishedNews(3)])
  return <HomePage impactStats={impactStats} latestNews={latestNews} />
}
