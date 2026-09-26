/**
 * Resolve media URLs used by the admin UI.
 *
 * The browser must only receive application-owned media URLs such as
 * /api/v2/media/42. Storage-provider URLs are intentionally rejected here.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v2'

export function getImageUrl(value: unknown): string | null {
  if (typeof value !== 'string' || value.trim() === '') return null

  const trimmed = value.trim()

  // Backend media-proxy URL returned by the profile/media APIs.
  if (trimmed.startsWith('/api/v2/media/')) {
    return `${API_BASE_URL.replace(/\/api\/v2\/?$/, '')}${trimmed}`
  }

  if (trimmed.startsWith('/media/')) {
    return `${API_BASE_URL}${trimmed}`
  }

  // Already an application API URL.
  if (trimmed.startsWith(API_BASE_URL + '/media/')) {
    return trimmed
  }

  // Never turn a Cloudinary/storage URL into a browser-visible query parameter.
  // Legacy assets need to be migrated to media_assets and referenced by media ID.
  if (trimmed.includes('res.cloudinary.com/')) return null

  return trimmed
}
