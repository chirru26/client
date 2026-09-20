/**
 * Centralized image URL utility for the Frontend.
 *
 * All images and files are served through the backend API instead of
 * exposing Cloudinary URLs directly to the browser.
 *
 * Usage:
 *   import { getImageUrl } from '../utils/imageUtils'
 *   <img src={getImageUrl(profile.imageUrl)} alt={profile.name} />
 */

const API_BASE_URL = import.meta.env.VITE_API_URL
//  Dev:  http://localhost:8080/api/v2
//  Prod: https://api.chirru.in/api/v2

/**
 * Converts a Cloudinary URL (from API response) into a proxied backend URL.
 *
 * @param {string|null|undefined} cloudinaryUrl - The raw Cloudinary URL stored in the DB.
 * @returns {string|null} - The proxied URL via the backend, or null if no URL provided.
 *
 * The browser will request:
 *   GET https://api.chirru.in/api/v2/images?id=<encoded-url>   (production)
 *   GET http://localhost:8080/api/v2/images?id=<encoded-url>   (development)
 *
 * Using a query param (?id=) instead of a path variable to avoid Tomcat's
 * default rejection of encoded slashes (%2F) in URL path segments.
 */
export function getImageUrl(cloudinaryUrl) {
  if (!cloudinaryUrl || typeof cloudinaryUrl !== 'string' || cloudinaryUrl.trim() === '') {
    return null
  }
  return `${API_BASE_URL}/images?id=${encodeURIComponent(cloudinaryUrl.trim())}`
}
