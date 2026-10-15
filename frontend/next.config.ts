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
  hostname: 'app.chirru.in',
  pathname: '/api/v2/media/**',
}

const PROD_DOCS_MEDIA_HOST = {
  protocol: 'https' as const,
  hostname: 'docs.chirru.in',
  pathname: '/api/v2/media/**',
}

const remotePatterns = [
  PROD_MEDIA_HOST,
  PROD_DOCS_MEDIA_HOST,
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

      "img-src 'self' data: blob: https://app.chirru.in https://docs.chirru.in",

      "font-src 'self' data:",
      "connect-src 'self' https://app.chirru.in https://docs.chirru.in",
      "media-src 'self' https://app.chirru.in https://docs.chirru.in",
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

  env: {
    NEXT_PUBLIC_DOCS_API_URL:
      process.env.NEXT_PUBLIC_DOCS_API_URL ||
      process.env.DOCS_API_URL ||
      'https://docs.chirru.in/api/v2',
  },

  images: {
    unoptimized: true,
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
