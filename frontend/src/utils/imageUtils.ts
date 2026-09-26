const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.API_URL ||
  'http://localhost:8080/api/v2'
).replace(/\/$/, '')

const API_ORIGIN = new URL(API_BASE_URL).origin
const MEDIA_PATH_PREFIX = new URL(`${API_BASE_URL}/media/`).pathname

/**
 * Converts a backend media reference into a browser-safe URL.
 *
 * Supported:
 *   "42"
 *   "/api/v2/media/42"
 *   "https://api.chirru.in/api/v2/media/42"
 *
 * Direct Cloudinary URLs are intentionally rejected.
 */
export function getImageUrl(mediaUrl?: string | null): string | null {
  if (!mediaUrl || typeof mediaUrl !== 'string') {
    return null
  }

  const trimmed = mediaUrl.trim()

  if (
    !trimmed ||
    trimmed.startsWith('data:') ||
    trimmed.startsWith('blob:')
  ) {
    return null
  }

  // Backend media ID: "42"
  if (/^\d+$/.test(trimmed)) {
    return `${API_ORIGIN}${MEDIA_PATH_PREFIX}${trimmed}`
  }

  try {
    const resolved = new URL(trimmed, `${API_BASE_URL}/`)

    // Only allow our own backend media endpoint.
    if (
      resolved.origin === API_ORIGIN &&
      resolved.pathname.startsWith(MEDIA_PATH_PREFIX) &&
      /^\d+$/.test(
        resolved.pathname.slice(MEDIA_PATH_PREFIX.length)
      ) &&
      !resolved.username &&
      !resolved.password &&
      !resolved.search &&
      !resolved.hash
    ) {
      return resolved.toString()
    }

    // Reject everything else, including Cloudinary.
    return null
  } catch {
    return null
  }
}