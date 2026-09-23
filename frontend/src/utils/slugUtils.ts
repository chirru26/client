import type { Project } from '@/types/portfolio'

export function toProjectSlug(input: string | number | Project | null | undefined): string {
  if (!input) return ''

  const text =
    typeof input === 'object'
      ? input.title || String(input.id || '')
      : String(input)

  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function findProjectBySlug(
  projects: Project[] = [],
  slugOrId = '',
): Project | null {
  if (!slugOrId || !Array.isArray(projects)) return null

  const target = decodeURIComponent(slugOrId).toLowerCase().trim()

  return (
    projects.find((project) => {
      const slug = toProjectSlug(project.title)
      const idStr = String(project.id ?? '')
      return slug === target || idStr === target || `${slug}-${idStr}` === target
    }) || null
  )
}
