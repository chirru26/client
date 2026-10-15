export function getSafeExternalUrl(value?: string | null): string | null {
  if (!value || typeof value !== 'string') return null

  try {
    const url = new URL(value.trim())
    if (url.protocol !== 'https:' || url.username || url.password) return null
    return url.toString()
  } catch {
    return null
  }
}

export function getSafeMailto(value?: string | null): string | null {
  if (!value || typeof value !== 'string') return null

  const email = value.trim()
  if (!/^\S+@\S+\.\S+$/.test(email)) return null

  return `mailto:${email}`
}
