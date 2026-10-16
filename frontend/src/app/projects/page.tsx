import type { Metadata } from 'next'
import ProjectsPage from '@/views/ProjectsPage'
import { serverApi } from '@/lib/serverApi'
import { createPageMetadata } from '@/utils/seoMetadata'

export const revalidate = 1800

export const metadata: Metadata = createPageMetadata({
    title: 'Projects',
    description: 'Explore software engineering projects, backend architectures, and full-stack applications built by Chiranjit Das.',
    path: '/projects',
})

export default async function Page() {
    return <ProjectsPage projects={await serverApi.projects()} />
}
