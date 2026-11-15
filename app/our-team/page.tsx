import type { Metadata } from 'next'
import { TeamPage } from '@/components/team-page'

export const metadata: Metadata = {
  title: 'Our Team | DOE Foundation',
  description: 'Meet the leaders and dedicated professionals behind the Davida Omosomi Empowerment Foundation.',
}

export default function OurTeamRoute() {
  return <TeamPage />
}
