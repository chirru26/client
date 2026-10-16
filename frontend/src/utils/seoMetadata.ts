import type { Metadata } from 'next'

const SITE_URL = 'https://chirru.in'
const SITE_NAME = 'Chiranjit Das Portfolio'
const SOCIAL_IMAGE = '/og-image.jpg'

interface PageMetadataInput {
  title: string
  description: string
  path: `/${string}`
}

export function createPageMetadata({ title, description, path }: PageMetadataInput): Metadata {
  const socialTitle = `${title} | Chiranjit Das`

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: 'website',
      url: `${SITE_URL}${path === '/' ? '' : path}`,
      siteName: SITE_NAME,
      title: socialTitle,
      description,
      images: [{ url: SOCIAL_IMAGE, width: 1200, height: 630, alt: 'Chiranjit Das portfolio' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: socialTitle,
      description,
      images: [SOCIAL_IMAGE],
    },
  }
}
