import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { SITE_DESCRIPTION, SITE_NAME, getSiteUrl } from '@/lib/site'
import './globals.css'

export const metadata: Metadata = {
  // Lets relative links (like preview images) become full web addresses.
  metadataBase: new URL(getSiteUrl()),
  title: 'DOE Foundation | Education for every future',
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    'DOE Foundation',
    'Davida Omosomi Empowerment Foundation',
    'debate education Nigeria',
    'NGO Abuja',
    'youth leadership Nigeria',
    'scholarships Nigeria',
    'child literacy',
  ],
  // Every page can be reached at one preferred address; pages set their own more specific one.
  alternates: { canonical: '/' },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
  },
  // Paste the code Google Search Console gives you into GOOGLE_SITE_VERIFICATION in Vercel (optional).
  verification: process.env.GOOGLE_SITE_VERIFICATION ? { google: process.env.GOOGLE_SITE_VERIFICATION } : undefined,
  // Defaults shared by every page. Pages without their own title/description fall back to the ones above.
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    locale: 'en_NG',
    title: 'DOE Foundation | Education for every future',
    description: SITE_DESCRIPTION,
    url: '/',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DOE Foundation | Education for every future',
    description: SITE_DESCRIPTION,
  },
  formatDetection: { telephone: false },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en-NG">
      <body className="antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
