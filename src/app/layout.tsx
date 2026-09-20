import type { Metadata, Viewport } from 'next'
import '@/app/globals.css'
import SiteChrome from '@/components/SiteChrome'
import { serverApi } from '@/lib/serverApi'

export const metadata: Metadata = {
  metadataBase: new URL('https://www.chirru.in'),
  title: { default: 'Chiranjit Das | Java & Backend Developer', template: '%s | Chiranjit Das' },
  description: 'Official portfolio of Chiranjit Das, Java & Backend Software Engineer specializing in Spring Boot, REST APIs, Microservices, and scalable web applications.',
  alternates: { canonical: 'https://www.chirru.in/' },
  openGraph: { type: 'website', url: 'https://www.chirru.in/', siteName: 'Chiranjit Das Portfolio', title: 'Chiranjit Das | Java & Backend Developer', description: 'Official portfolio and software engineering projects of Chiranjit Das.', images: ['/og-image.jpg'] },
  twitter: { card: 'summary_large_image', title: 'Chiranjit Das | Java & Backend Developer', description: 'Official portfolio and software engineering projects of Chiranjit Das.', images: ['/og-image.jpg'] },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = { width: 'device-width', initialScale: 1 }

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const [profile, socialLinks] = await Promise.all([serverApi.profile(), serverApi.socialLinks()])
  return <html lang="en"><body><SiteChrome profile={profile} socialLinks={socialLinks}>{children}</SiteChrome></body></html>
}
