import type { MetadataRoute } from 'next'
import { SITE_DESCRIPTION } from '@/lib/site'

// Lets phones show the right name, colour and icon if someone adds the site to their home screen.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'The Davida Omosomi Empowerment Foundation',
    short_name: 'DOE Foundation',
    description: SITE_DESCRIPTION,
    start_url: '/',
    display: 'standalone',
    background_color: '#f8f5ef',
    theme_color: '#d70063',
    lang: 'en-NG',
    icons: [
      { src: '/icon.png', sizes: '424x403', type: 'image/png' },
      { src: '/apple-icon.png', sizes: '424x403', type: 'image/png', purpose: 'any' },
    ],
  }
}
