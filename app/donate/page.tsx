import type { Metadata } from 'next'
import { DonatePage } from '@/components/donate-page'

export const metadata: Metadata = {
  title: 'Sponsor a Debate Club | DOE Foundation',
  description: 'Sponsor a student or a school debate club and help raise a generation of confident thinkers and communicators.',
}

export default function DonateRoute() {
  return <DonatePage />
}
