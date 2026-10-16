import type { Metadata } from 'next'
import AboutPage from '@/views/AboutPage'
import { serverApi } from '@/lib/serverApi'
import { createPageMetadata } from '@/utils/seoMetadata'

export const revalidate = 1800

export const metadata: Metadata = createPageMetadata({
    title: 'About',
    description: 'Learn about Chiranjit Das, a Java and backend developer focused on Spring Boot, REST APIs, clean code, and scalable systems.',
    path: '/about',
})

export default async function Page() {
    const [profile, skills] = await Promise.all([serverApi.profile(), serverApi.skills()])
    return <AboutPage profile={profile} skills={skills} />
}
