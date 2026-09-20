import { Helmet } from 'react-helmet-async'

const SITE_ORIGIN = 'https://www.chirru.in'
const DEFAULT_TITLE = 'Chiranjit Das | Java & Backend Developer'
const DEFAULT_DESCRIPTION =
  'Portfolio of Chiranjit Das, Java & Backend Software Engineer specializing in Spring Boot, REST APIs, Microservices, and scalable web architectures.'
const DEFAULT_OG_IMAGE = `${SITE_ORIGIN}/og-image.jpg`
const TWITTER_HANDLE = '@chir_ru26'

/**
 * Normalizes a canonical path or full URL to ensure it starts with the production origin.
 * @param {string} [pathOrUrl]
 * @returns {string}
 */
export function buildCanonicalUrl(pathOrUrl = '/') {
  if (!pathOrUrl) return SITE_ORIGIN
  if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://')) {
    // If it's already a full URL, ensure domain consistency if it's on chirru.in
    return pathOrUrl.replace(/^https?:\/\/(www\.)?chirru\.in/, SITE_ORIGIN)
  }
  const cleanPath = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`
  return `${SITE_ORIGIN}${cleanPath === '/' ? '' : cleanPath}`
}

/**
 * Reusable SEO component for head tags and JSON-LD structured data.
 */
export default function SEO({
  title,
  description = DEFAULT_DESCRIPTION,
  canonical = '/',
  ogTitle,
  ogDescription,
  ogUrl,
  ogImage = DEFAULT_OG_IMAGE,
  ogType = 'website',
  twitterTitle,
  twitterDescription,
  twitterImage = DEFAULT_OG_IMAGE,
  robots = 'index, follow',
  schema,
}) {
  const pageTitle = title ? `${title}` : DEFAULT_TITLE
  const pageDesc = description || DEFAULT_DESCRIPTION
  const pageCanonical = buildCanonicalUrl(canonical)
  const pageOgTitle = ogTitle || pageTitle
  const pageOgDesc = ogDescription || pageDesc
  const pageOgUrl = ogUrl ? buildCanonicalUrl(ogUrl) : pageCanonical
  const pageOgImage = ogImage?.startsWith('http') ? ogImage : `${SITE_ORIGIN}${ogImage}`
  const pageTwTitle = twitterTitle || pageOgTitle
  const pageTwDesc = twitterDescription || pageOgDesc
  const pageTwImage = twitterImage?.startsWith('http') ? twitterImage : `${SITE_ORIGIN}${twitterImage}`

  return (
    <Helmet>
      {/* Standard Metadata */}
      <title>{pageTitle}</title>
      <meta name="description" content={pageDesc} />
      <meta name="robots" content={robots} />
      <link rel="canonical" href={pageCanonical} />

      {/* Open Graph */}
      <meta property="og:site_name" content="Chiranjit Das Portfolio" />
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={pageOgTitle} />
      <meta property="og:description" content={pageOgDesc} />
      <meta property="og:url" content={pageOgUrl} />
      <meta property="og:image" content={pageOgImage} />
      <meta property="og:image:alt" content={pageOgTitle} />
      <meta property="og:locale" content="en_US" />

      {/* Twitter / X */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={TWITTER_HANDLE} />
      <meta name="twitter:creator" content={TWITTER_HANDLE} />
      <meta name="twitter:title" content={pageTwTitle} />
      <meta name="twitter:description" content={pageTwDesc} />
      <meta name="twitter:image" content={pageTwImage} />

      {/* JSON-LD Structured Data */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  )
}
