import type { Metadata } from 'next'
import { PolicyPage } from '@/components/policy-page'

export const metadata: Metadata = {
  title: 'Cookie Policy | DOE Foundation',
  description: 'Cookie information and contact details for the DOE Foundation website.',
}

export default function CookiePolicyRoute() {
  return <PolicyPage type="cookies" />
}
