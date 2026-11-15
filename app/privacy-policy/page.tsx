import type { Metadata } from 'next'
import { PolicyPage } from '@/components/policy-page'

export const metadata: Metadata = {
  title: 'Privacy Policy | DOE Foundation',
  description: 'Privacy information and contact details for the DOE Foundation website.',
}

export default function PrivacyPolicyRoute() {
  return <PolicyPage type="privacy" />
}
