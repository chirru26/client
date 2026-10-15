import type { Profile, SocialLink } from '@/types/portfolio'
import { getSafeExternalUrl } from './externalUrl'

export interface ResolvedSocialLink {
  id?: string | number
  platform: string
  label: string
  url: string
  display_order?: number | null
}

export function getOrderedSocialLinks(
  socialLinks: SocialLink[] = [],
  profile: Profile = {}
): ResolvedSocialLink[] {
  let list: ResolvedSocialLink[] = []

  if (socialLinks && socialLinks.length > 0) {
    list = socialLinks
      .filter((s) => s.visible !== false && Boolean(s.url))
      .map((s) => {
        const plat = (s.platform || s.icon || '').toLowerCase()
        return {
          id: s.id,
          platform: plat,
          label: s.label || s.platform || 'Social link',
          url: getSafeExternalUrl(s.url) || s.url,
          display_order: s.display_order ?? s.order ?? null,
        }
      })
      .filter((s) => Boolean(s.url))
  } else {
    const fallbacks: ResolvedSocialLink[] = []
    if (profile.githubUrl) {
      fallbacks.push({ platform: 'github', label: 'GitHub', url: profile.githubUrl, display_order: 1 })
    }
    if (profile.linkedinUrl) {
      fallbacks.push({ platform: 'linkedin', label: 'LinkedIn', url: profile.linkedinUrl, display_order: 2 })
    }
    if (profile.instagramUrl) {
      fallbacks.push({ platform: 'instagram', label: 'Instagram', url: profile.instagramUrl, display_order: 3 })
    }
    if (profile.twitterUrl || profile.xUrl) {
      fallbacks.push({ platform: 'x', label: 'X (Twitter)', url: (profile.twitterUrl || profile.xUrl)!, display_order: 4 })
    }
    list = fallbacks
  }

  return list.sort((a, b) => {
    const orderA = a.display_order ?? 999
    const orderB = b.display_order ?? 999
    return orderA - orderB
  })
}
