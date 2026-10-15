import type { Metadata } from 'next'
import Home from '@/views/Home'
import { getPortfolioData } from '@/lib/serverApi'
export const revalidate = 1800

export const metadata: Metadata = {
  title: 'Chiranjit Das | Java & Backend Developer',
  description:
    'Official portfolio of Chiranjit Das, Java & Backend Software Engineer specializing in Spring Boot, REST APIs, Microservices, and scalable web applications.',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: 'https://www.chirru.in/',
    siteName: 'Chiranjit Das Portfolio',
    title: 'Chiranjit Das | Java & Backend Developer',
    description:
      'Explore software architecture, featured projects, and backend engineering competencies by Chiranjit Das.',
    images: [
      {
        url: 'https://www.chirru.in/og-image.jpg',
        width: 1200,
        height: 630,
        type: 'image/jpeg',
        alt: 'Chiranjit Das | Java & Backend Developer',
      },
    ],
  },
}

export default async function Page() {
  return <Home {...(await getPortfolioData())} projectsLoading={false} />
}
