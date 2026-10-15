'use client'

import { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname, useRouter } from 'next/navigation'
import { X, FileText, ArrowRight } from 'lucide-react'
import { portfolioApi } from '@/api'
import { getOrderedSocialLinks } from '@/utils/socialUtils'
import { SocialIcon } from '@/components/SocialIcon'
import type { SocialLink } from '@/types/portfolio'

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Experience', href: '#experience' },
  { label: 'Education', href: '#education' },
  { label: 'Contact', href: '#contact' },
]

interface Props {
  open: boolean
  onClose: () => void
  theme?: 'light' | 'dark'
  onToggleTheme?: () => void
  socialLinks?: SocialLink[]
}

export default function ResponsiveMenu({
  open,
  onClose,
  socialLinks = [],
}: Props) {
  const pathname = usePathname() || '/'
  const router = useRouter()
  const orderedSocials = useMemo(() => getOrderedSocialLinks(socialLinks), [socialLinks])

  function handleNavClick(href: string) {
    onClose()
    if (pathname === '/') {
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
    } else {
      router.push(`/${href}`)
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="mobile-drawer-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.aside
            id="mobile-navigation"
            className="mobile-drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <button
                type="button"
                className="nav-brand"
                onClick={() => {
                  onClose()
                  void (pathname === '/'
                    ? window.scrollTo({ top: 0, behavior: 'smooth' })
                    : router.push('/'))
                }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              >
                chirru<span className="nav-brand-dot" />
              </button>
              <button className="modal-close-btn" onClick={onClose} aria-label="Close menu">
                <X size={16} />
              </button>
            </div>

            <nav className="mobile-nav-links">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="mobile-nav-link"
                  onClick={(e) => {
                    e.preventDefault()
                    handleNavClick(link.href)
                  }}
                >
                  <span>{link.label}</span>
                  <ArrowRight size={14} color="var(--text-muted)" />
                </a>
              ))}
            </nav>

            {orderedSocials.length > 0 && (
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 8,
                  padding: '4px 0',
                  justifyContent: 'flex-end',
                }}
              >
                {orderedSocials.map((s) => (
                  <a
                    key={s.id || s.url}
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                    className="social-icon-btn"
                    style={{ width: 34, height: 34 }}
                    aria-label={s.label}
                    title={s.label}
                  >
                    <SocialIcon link={s} size={15} />
                  </a>
                ))}
              </div>
            )}

            <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
              <a
                href={portfolioApi.resumeDownloadUrl}
                target="_blank"
                rel="noreferrer"
                className="btn btn-primary mobile-resume-btn"
                onClick={() => {
                  onClose()
                  void portfolioApi.trackEvent('resume_download', { source: 'mobile_drawer_cta' })
                }}
              >
                <FileText size={14} /> Download Resume
              </a>
            </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

