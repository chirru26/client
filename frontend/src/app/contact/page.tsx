import type { Metadata } from 'next'
import ContactPage from '@/views/ContactPage'
import { serverApi } from '@/lib/serverApi'
import { createPageMetadata } from '@/utils/seoMetadata'

export const revalidate = 1800

export const metadata: Metadata = createPageMetadata({
    title: 'Contact',
    description: 'Contact Chiranjit Das about software engineering opportunities, Java and Spring Boot projects, or technical inquiries.',
    path: '/contact',
})

export default async function Page() {
    const [profile, socialLinks] = await Promise.all([serverApi.profile(), serverApi.socialLinks()])
    return <ContactPage profile={profile} socialLinks={socialLinks} />
}
