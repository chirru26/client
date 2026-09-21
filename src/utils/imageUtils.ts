const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.API_URL ||
  'https://api.chirru.in/api/v2'
).replace(/\/$/, '')

export function getImageUrl(cloudinaryUrl?: string | null): string | null {
  if (!cloudinaryUrl || typeof cloudinaryUrl !== 'string') {
    return null
  }

  const trimmed = cloudinaryUrl.trim()
  if (!trimmed) return null

  // If already a data URI, local blob, or root-relative path
  if (trimmed.startsWith('data:') || trimmed.startsWith('blob:') || trimmed.startsWith('/')) {
    return trimmed
  }

  return `${API_BASE_URL}/images?id=${encodeURIComponent(trimmed)}`
}

