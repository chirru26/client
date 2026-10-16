import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ProjectDetailsPage from '@/views/ProjectDetailsPage'
import { serverApi } from '@/lib/serverApi'
import { findProjectBySlug, toProjectSlug } from '@/utils/slugUtils'
import { getSafeExternalUrl } from '@/utils/externalUrl'

export const revalidate = 1800

const SITE_URL = 'https://chirru.in'
const SITE_NAME = 'Chiranjit Das Portfolio'

interface PageProps {
    params: Promise<{ slug: string }>
}

function projectDescription(project: { description?: string | null; shortDescription?: string | null; summary?: string | null; title: string }): string {
    const candidate = [project.shortDescription, project.summary, project.description]
        .find((value) => typeof value === 'string' && value.trim().length > 20 && value.trim().toLowerCase() !== 'dfsb')
    const normalized = candidate?.trim().replace(/\s+/g, ' ')
    return (normalized || `${project.title} is a software project by Chiranjit Das. Explore its purpose, implementation, and technologies.`).slice(0, 160)
}

function safeJsonLd(value: unknown): string {
    return JSON.stringify(value).replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026')
}

export async function generateStaticParams() {
    const projects = await serverApi.projects()
    return [...new Set(projects.map((project) => toProjectSlug(project.title)).filter(Boolean))]
        .map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params
    const projects = await serverApi.projects()
    const project = findProjectBySlug(projects, slug)

    if (!project) {
        return {
            title: { absolute: 'Project Not Found | Chiranjit Das' },
            robots: { index: false, follow: true },
        }
    }

    const description = projectDescription(project)
    const canonical = `/projects/${toProjectSlug(project.title)}`
    const title = `${project.title} | Chiranjit Das`

    return {
        title: project.title,
        description,
        alternates: { canonical },
        openGraph: {
            type: 'article',
            url: `${SITE_URL}${canonical}`,
            siteName: SITE_NAME,
            title,
            description,
            images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: `${project.title} project preview` }],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: ['/og-image.jpg'],
        },
    }
}

export default async function Page({ params }: PageProps) {
    const { slug } = await params
    const projects = await serverApi.projects()
    const project = findProjectBySlug(projects, slug)

    if (!project) notFound()

    const canonical = `${SITE_URL}/projects/${toProjectSlug(project.title)}`
    const githubUrl = getSafeExternalUrl(project.githubUrl)
    const schema = [
        {
            '@context': 'https://schema.org',
            '@type': 'SoftwareSourceCode',
            name: project.title,
            description: projectDescription(project),
            url: canonical,
            author: { '@type': 'Person', name: 'Chiranjit Das', url: SITE_URL },
            ...(githubUrl ? { codeRepository: githubUrl } : {}),
        },
        {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
                { '@type': 'ListItem', position: 2, name: 'Projects', item: `${SITE_URL}/projects` },
                { '@type': 'ListItem', position: 3, name: project.title, item: canonical },
            ],
        },
    ]

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(schema) }} />
            <ProjectDetailsPage projects={projects} slug={slug} />
        </>
    )
}
