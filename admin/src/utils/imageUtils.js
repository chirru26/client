/**
 * Centralized image URL utility for the Admin panel.
 *
 * During the Next.js migration this remains compatible with the existing
 * backend media-proxy contract. The Cloudinary-to-media-ID contract will be
 * migrated in the dedicated media phase.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v2'

export function getImageUrl(cloudinaryUrl) {
  if (!cloudinaryUrl || typeof cloudinaryUrl !== 'string' || cloudinaryUrl.trim() === '') {
    return null
  }
  return `${API_BASE_URL}/images?id=${encodeURIComponent(cloudinaryUrl.trim())}`
}
