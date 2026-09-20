/**
 * Utility functions for slugifying project titles and matching them cleanly.
 */

/**
 * Generates a URL-friendly slug from a project or title.
 * @param {string|object} input
 * @returns {string}
 */
export function toProjectSlug(input) {
  if (!input) return ''
  const text = typeof input === 'object' ? input.title || String(input.id || '') : String(input)
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Finds a project in a list by slug or ID.
 * Matches:
 * 1. Exact slug match with `toProjectSlug(p.title)`
 * 2. Exact match with `p.id`
 * 3. Title or id match
 * @param {Array} projects
 * @param {string} slugOrId
 * @returns {object|null}
 */
export function findProjectBySlug(projects = [], slugOrId = '') {
  if (!slugOrId || !Array.isArray(projects)) return null
  const target = decodeURIComponent(slugOrId).toLowerCase().trim()

  return (
    projects.find((p) => {
      const slug = toProjectSlug(p.title)
      const idStr = String(p.id)
      return slug === target || idStr === target || `${slug}-${idStr}` === target
    }) || null
  )
}
