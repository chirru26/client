import { Github, Linkedin, Instagram, Mail, Globe } from 'lucide-react'
import type { ResolvedSocialLink } from '@/utils/socialUtils'

interface SocialIconProps {
  link: ResolvedSocialLink
  size?: number
}

export function SocialIcon({ link, size = 18 }: SocialIconProps) {
  const plat = link.platform.toLowerCase()
  const url = link.url.toLowerCase()
  const isX = plat === 'twitter' || plat === 'x' || url.includes('x.com') || url.includes('twitter.com')

  if (plat === 'github' || url.includes('github.com')) {
    return <Github size={size} />
  }
  if (plat === 'linkedin' || url.includes('linkedin.com')) {
    return <Linkedin size={size} />
  }
  if (plat === 'instagram' || url.includes('instagram.com')) {
    return <Instagram size={size} />
  }
  if (isX) {
    return (
      <svg viewBox="0 0 24 24" width={Math.max(12, size - 2)} height={Math.max(12, size - 2)} fill="currentColor" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    )
  }
  if (plat === 'email' || url.startsWith('mailto:')) {
    return <Mail size={size} />
  }
  return <Globe size={size} />
}
