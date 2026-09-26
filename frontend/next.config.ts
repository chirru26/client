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

const PROD_MEDIA_HOST = {
  protocol: 'https' as const,
  hostname: 'api.chirru.in',
  pathname: '/api/v2/media/**',
}

const remotePatterns = [
  PROD_MEDIA_HOST,
  imagePatternFromApiUrl(process.env.NEXT_PUBLIC_API_URL),
  imagePatternFromApiUrl(process.env.API_URL),
].filter((pattern, index, all): pattern is NonNullable<typeof pattern> => {
  if (!pattern) return false

  return (
    all.findIndex(
      (other) => JSON.stringify(other) === JSON.stringify(pattern)
    ) === index
  )
})

const productionSecurityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "base-uri 'self'",
      "object-src 'none'",
      "frame-ancestors 'self'",
      "form-action 'self'",
      "script-src 'self' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",

      // Images are served through our backend media proxy.
      // Direct Cloudinary access is intentionally NOT allowed.
      "img-src 'self' data: blob: https://api.chirru.in",

      "font-src 'self' data:",
      "connect-src 'self' https://api.chirru.in",
      "media-src 'self' https://api.chirru.in",
      "worker-src 'self' blob:",
      "manifest-src 'self'",
      "upgrade-insecure-requests",
    ].join('; '),
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains',
  },
]

const baseSecurityHeaders = [
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), payment=()',
  },
]

const nextConfig: NextConfig = {
  reactStrictMode: true,

  poweredByHeader: false,

  allowedDevOrigins: ['172.23.0.1'],

  images: {
    dangerouslyAllowLocalIP: process.env.NODE_ENV !== 'production',
    remotePatterns,
  },

  async headers() {
    const headers =
      process.env.NODE_ENV === 'production'
        ? [...baseSecurityHeaders, ...productionSecurityHeaders]
        : baseSecurityHeaders

    return [
      {
        source: '/(.*)',
        headers,
      },
    ]
  },
}

export default nextConfig