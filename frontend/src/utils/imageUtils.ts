const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.API_URL ||
  'https://api.chirru.in/api/v2'
).replace(/\/$/, '')

const API_ORIGIN = new URL(API_BASE_URL).origin
const MEDIA_PATH_PREFIX = new URL(API_BASE_URL + '/media/').pathname

/**
 * Resolves a backend-managed media URL for browser use.
 *
 * The API is responsible for mapping the media identifier to the underlying
 * storage asset. The frontend only accepts backend media paths and never
 * rewrites storage URLs into browser requests.
 */
export function getImageUrl(mediaUrl?: string | null): string | null {
  if (!mediaUrl || typeof mediaUrl !== 'string') return null

  const trimmed = mediaUrl.trim()
  if (!trimmed || trimmed.startsWith('data:') || trimmed.startsWith('blob:')) return null

  if (trimmed.startsWith('https://res.cloudinary.com/')) {
    return trimmed
  }

  try {
    const resolved = new URL(trimmed, API_BASE_URL + '/')

    if (resolved.origin !== API_ORIGIN || !resolved.pathname.startsWith(MEDIA_PATH_PREFIX)) {
      return null
    }

    return resolved.toString()
  } catch {
    return null
  }
}
