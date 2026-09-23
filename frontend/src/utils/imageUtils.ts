const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.API_URL ||
  'https://api.chirru.in/api/v2'
).replace(/\/$/, '')

const API_ORIGIN = new URL(API_BASE_URL).origin
const MEDIA_PATH_PREFIX = new URL(API_BASE_URL + '/media/').pathname

/**
 * Resolves only backend-managed media URLs.
 * Storage providers such as Cloudinary are intentionally never accepted here.
 */
export function getImageUrl(mediaUrl?: string | null): string | null {
  if (!mediaUrl || typeof mediaUrl !== 'string') return null

  const trimmed = mediaUrl.trim()
  if (!trimmed || trimmed.startsWith('data:') || trimmed.startsWith('blob:')) return null

  try {
    const resolved = new URL(trimmed, API_BASE_URL + '/')

    if (
      resolved.origin !== API_ORIGIN ||
      !resolved.pathname.startsWith(MEDIA_PATH_PREFIX) ||
      !/^\d+$/.test(resolved.pathname.slice(MEDIA_PATH_PREFIX.length)) ||
      resolved.username ||
      resolved.password ||
      resolved.search ||
      resolved.hash
    ) {
      return null
    }

    return resolved.toString()
  } catch {
    return null
  }
}
