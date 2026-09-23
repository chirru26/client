import type { NextConfig } from 'next'

function imagePatternFromApiUrl(raw?: string) {
  if (!raw?.trim()) return null
  try {
    const url = new URL(raw.includes('://') ? raw : 'https://' + raw)
    const apiPath = url.pathname.replace(/\/$/, '') || '/api/v2'
    return {
      protocol: url.protocol.replace(':', '') as 'http' | 'https',
      hostname: url.hostname,
      ...(url.port ? { port: url.port } : {}),
      pathname: apiPath + '/media/**',
    }
  } catch {
    return null
  }
}

const CLOUDINARY_HOST = { protocol: 'https' as const, hostname: 'res.cloudinary.com', pathname: '/**' }
const PROD_MEDIA_HOST = { protocol: 'https' as const, hostname: 'api.chirru.in', pathname: '/api/v2/media/**' }

const remotePatterns = [
  CLOUDINARY_HOST,
  PROD_MEDIA_HOST,
  imagePatternFromApiUrl(process.env.NEXT_PUBLIC_API_URL),
  imagePatternFromApiUrl(process.env.API_URL),
].filter((pattern, index, all): pattern is NonNullable<typeof pattern> => {
  if (!pattern) return false
  return all.findIndex((other) => JSON.stringify(other) === JSON.stringify(pattern)) === index
})

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Allow the local network IP to access HMR dev resources (cross-origin blocked by default in Next.js 16+)
  allowedDevOrigins: ['172.23.0.1'],
  images: {
    // Next.js 16 blocks optimizer fetches to private IPs (SSRF). Allow only in local dev.
    dangerouslyAllowLocalIP: process.env.NODE_ENV !== 'production',
    remotePatterns,
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), payment=()',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
        ],
      },
    ]
  },
}

export default nextConfig
