const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL ||
  'https://api.chirru.in/api/v2'
).replace(/\/$/, '')

export function getImageUrl(cloudinaryUrl?: string | null): string | null {
  if (!cloudinaryUrl || typeof cloudinaryUrl !== 'string' || cloudinaryUrl.trim() === '') {
    return null
  }

  return `${API_BASE_URL}/images?id=${encodeURIComponent(cloudinaryUrl.trim())}`
}
