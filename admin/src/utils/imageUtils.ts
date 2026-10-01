/**
 * Resolve image URLs for the Next.js admin UI.
 */

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v2').replace(/\/$/, '')
const API_ORIGIN = API_BASE_URL.replace(/\/api\/v2\/?$/, '')

export function getImageUrl(value: unknown): string | null {
  if (!value || typeof value !== 'string') return null

  const trimmed = value.trim()
  if (!trimmed) return null

  // Direct data or blob URLs
  if (trimmed.startsWith('data:image/') || trimmed.startsWith('blob:')) {
    return trimmed
  }

  // Raw numeric media ID: "2"
  if (/^\d+$/.test(trimmed)) {
    return `${API_ORIGIN}/api/v2/media/${trimmed}`
  }

  // Current backend media proxy: /api/v2/media/{id}
  if (/^\/api\/v2\/media\/\d+$/.test(trimmed)) {
    return `${API_ORIGIN}${trimmed}`
  }

  // API-relative media proxy: /media/{id}
  if (/^\/media\/\d+$/.test(trimmed)) {
    return `${API_BASE_URL}${trimmed}`
  }

  // Fully-qualified current media proxy URL
  if (/\/api\/v2\/media\/\d+$/.test(trimmed)) {
    return trimmed
  }

  // Legacy rejected formats
  if (trimmed.includes('/api/v2/images') || trimmed.includes('/images?id=')) {
    return null
  }

  // Cloudinary URL fallback
  if (/^https?:\/\/res\.cloudinary\.com\//i.test(trimmed)) {
    return trimmed
  }

  // Local/public application assets
  if (trimmed.startsWith('/') && !trimmed.startsWith('//')) {
    return trimmed
  }

  // Any other valid absolute HTTPS/HTTP image URL
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed
  }

  return null
}
