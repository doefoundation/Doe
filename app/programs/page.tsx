import type { Metadata } from 'next'
import { ProgramsPage } from '@/components/programs-page'

export const metadata: Metadata = {
  title: 'Our Programs | DOE Foundation',
  description: 'Explore DOE Foundation programs in leadership, debate and literacy, community outreach, and scholarships.',
}

export default function ProgramsRoute() {
  return <ProgramsPage />
}
