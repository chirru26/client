import type { Metadata } from 'next'
import ProjectDetailsPage from '@/pages/ProjectDetailsPage'
import { serverApi } from '@/lib/serverApi'
import { findProjectBySlug, toProjectSlug } from '@/utils/slugUtils'

interface PageProps {
    params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
    try {
        const projects = await serverApi.projects()
        return projects.map((project) => ({
            slug: toProjectSlug(project.title),
        }))
    } catch {
        return []
    }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params
    const project = findProjectBySlug(await serverApi.projects(), slug)
    if (!project) return { title: 'Project Not Found | Chiranjit Das', robots: { index: false, follow: true } }
    const description = project.description && project.description.length > 6 && project.description !== 'dfsb'
        ? project.description
        : 'A modern full-stack application developed with Java, Spring Boot, and reactive architecture.'
    const canonical = `/projects/${toProjectSlug(project.title)}`
    return {
        title: project.title,
        description,
        alternates: { canonical },
        openGraph: { title: project.title, description, type: 'article', images: ['/og-image.jpg'] }
    }
}

export default async function Page({ params }: PageProps) {
    const { slug } = await params
    return <ProjectDetailsPage projects={await serverApi.projects()} slug={slug} />
}

