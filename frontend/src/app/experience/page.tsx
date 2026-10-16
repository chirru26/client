import type { Metadata } from 'next'
import ExperiencePage from '@/views/ExperiencePage'
import { serverApi } from '@/lib/serverApi'
import { createPageMetadata } from '@/utils/seoMetadata'

export const revalidate = 1800

export const metadata: Metadata = createPageMetadata({
    title: 'Experience',
    description: 'Explore the professional experience, developer internships, and educational background of Chiranjit Das.',
    path: '/experience',
})

export default async function Page() {
    const [experience, education] = await Promise.all([serverApi.experience(), serverApi.education()])
    return <ExperiencePage experience={experience} education={education} />
}
