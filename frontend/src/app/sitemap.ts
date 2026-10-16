import type { MetadataRoute } from 'next'
import { serverApi } from '@/lib/serverApi'
import { toProjectSlug } from '@/utils/slugUtils'

const SITE_URL = 'https://chirru.in'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await serverApi.projects()

  // Do not invent lastModified dates: the API currently does not expose a
  // reliable modification timestamp for every public page or project.
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL },
    { url: `${SITE_URL}/about` },
    { url: `${SITE_URL}/projects` },
    { url: `${SITE_URL}/experience` },
    { url: `${SITE_URL}/contact` },
  ]

  const projectRoutes: MetadataRoute.Sitemap = projects
    .map((project) => toProjectSlug(project.title))
    .filter(Boolean)
    .filter((slug, index, slugs) => slugs.indexOf(slug) === index)
    .map((slug) => ({ url: `${SITE_URL}/projects/${slug}` }))

  return [...staticRoutes, ...projectRoutes]
}
