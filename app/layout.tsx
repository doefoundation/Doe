import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { SITE_NAME, getSiteUrl } from '@/lib/site'
import './globals.css'

export const metadata: Metadata = {
  // Lets relative links (like preview images) become full web addresses.
  metadataBase: new URL(getSiteUrl()),
  title: 'DOE Foundation | Education for every future',
  description: 'DOE Foundation opens doors to quality education, mentorship, and opportunity for young people.',
  generator: 'v0.app',
  // Defaults shared by every page. Pages without their own title/description fall back to the ones above.
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    locale: 'en_NG',
  },
  twitter: {
    card: 'summary_large_image',
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
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
    <html lang="en">
      <body className="antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
