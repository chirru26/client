/**
 * Resolve image URLs for the Next.js admin UI.
 *
 * The browser must only request application-owned media endpoints.
 * Storage-provider URLs (for example Cloudinary) and the legacy
 * /api/v2/images?id=... endpoint are intentionally rejected.
 */

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v2').replace(/\/$/, '')
const API_ORIGIN = API_BASE_URL.replace(/\/api\/v2\/?$/, '')

export function getImageUrl(value: unknown): string | null {
  if (typeof value !== 'string') return null

  const trimmed = value.trim()
  if (!trimmed) return null

  // Current backend media proxy: /api/v2/media/{id}
  if (/^\/api\/v2\/media\/\d+$/.test(trimmed)) {
    return `${API_ORIGIN}${trimmed}`
  }

  // API-relative media proxy: /media/{id}
  if (/^\/media\/\d+$/.test(trimmed)) {
    return `${API_BASE_URL}${trimmed}`
  }

  // Fully-qualified current media proxy URL.
  if (/\/api\/v2\/media\/\d+$/.test(trimmed)) {
    return trimmed
  }

  // Never allow the legacy Cloudinary URL proxy flow back into the app.
  if (trimmed.includes('/api/v2/images') || trimmed.includes('/images?id=')) {
    return null
  }

  // Never expose Cloudinary/storage-provider URLs in the browser.
  if (/^https?:\/\/res\.cloudinary\.com\//i.test(trimmed)) {
    return null
  }

  // Local/public application assets are safe.
  if (trimmed.startsWith('/') && !trimmed.startsWith('//')) {
    return trimmed
  }

  return null
}
