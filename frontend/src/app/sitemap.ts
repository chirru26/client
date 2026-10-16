import type { MetadataRoute } from 'next'
import { serverApi } from '@/lib/serverApi'
import { toProjectSlug } from '@/utils/slugUtils'

const SITE_URL = 'https://chirru.in'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await serverApi.projects()

  // Omit lastModified until the API provides reliable modification timestamps.
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/` },
    { url: `${SITE_URL}/about` },
    { url: `${SITE_URL}/projects` },
    { url: `${SITE_URL}/experience` },
    { url: `${SITE_URL}/contact` },
  ]

  const projectSlugs = [...new Set(projects.map((project) => toProjectSlug(project.title)).filter(Boolean))]
  const projectRoutes: MetadataRoute.Sitemap = projectSlugs.map((slug) => ({
    url: `${SITE_URL}/projects/${slug}`,
  }))

  return [...staticRoutes, ...projectRoutes]
}
