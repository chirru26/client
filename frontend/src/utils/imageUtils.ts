const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.API_URL ||
  'https://api.chirru.in/api/v2'
).replace(/\/$/, '')

const API_ORIGIN = new URL(API_BASE_URL).origin
const MEDIA_PATH_PREFIX = new URL(API_BASE_URL + '/media/').pathname

const CLOUDINARY_PREFIX = 'https://res.cloudinary.com/'

/**
 * Resolves backend-managed media URLs or trusted Cloudinary asset URLs.
 */
export function getImageUrl(mediaUrl?: string | null): string | null {
  if (!mediaUrl || typeof mediaUrl !== 'string') return null

  const trimmed = mediaUrl.trim()
  if (!trimmed || trimmed.startsWith('data:') || trimmed.startsWith('blob:')) return null

  // Allow direct trusted Cloudinary asset URLs
  if (trimmed.startsWith(CLOUDINARY_PREFIX)) {
    try {
      const url = new URL(trimmed)
      if (url.origin === 'https://res.cloudinary.com' && !url.username && !url.password) {
        return url.toString()
      }
    } catch {
      return null
    }
  }

  // Allow plain numeric media IDs like "2"
  if (/^\d+$/.test(trimmed)) {
    return `${API_ORIGIN}${MEDIA_PATH_PREFIX}${trimmed}`
  }

  try {
    const resolved = new URL(trimmed, API_BASE_URL + '/')

    if (
      resolved.origin === API_ORIGIN &&
      resolved.pathname.startsWith(MEDIA_PATH_PREFIX) &&
      /^\d+$/.test(resolved.pathname.slice(MEDIA_PATH_PREFIX.length)) &&
      !resolved.username &&
      !resolved.password &&
      !resolved.search &&
      !resolved.hash
    ) {
      return resolved.toString()
    }

    return null
  } catch {
    return null
  }
}
