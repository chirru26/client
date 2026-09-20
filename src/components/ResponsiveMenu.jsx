import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, useLocation } from 'react-router-dom'
import { X, Sun, Moon, FileText, ArrowRight, Github, Linkedin, Mail, Instagram, Globe } from 'lucide-react'
import { portfolioApi } from '../api'

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Experience', href: '#experience' },
  { label: 'Education', href: '#education' },
  { label: 'Contact', href: '#contact' },
]

export default function ResponsiveMenu({ open, onClose, theme, onToggleTheme, socialLinks = [] }) {
  const navigate = useNavigate()
  const location = useLocation()

  function handleNavClick(href) {
    onClose()
    if (location.pathname === '/') {
      const el = document.querySelector(href)
      el?.scrollIntoView({ behavior: 'smooth' })
    } else {
      navigate(`/${href}`)
    }
  }

  function handleBrandClick() {
    onClose()
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      navigate('/')
    }
  }

  function handleResumeClick() {
    onClose()
    portfolioApi.trackEvent('resume_download', { source: 'mobile_drawer_cta' })
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
            className="mobile-drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <button
                type="button"
                className="nav-brand"
                onClick={handleBrandClick}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              >
                chirru<span className="nav-brand-dot" />
              </button>
              <button className="modal-close-btn" onClick={onClose} aria-label="Close menu">
                <X size={18} />
              </button>
            </div>

            {/* Navigation Links */}
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
                  <ArrowRight size={16} color="var(--text-muted)" />
                </a>
              ))}
            </nav>

            {/* Social Links inside drawer */}
            {socialLinks && socialLinks.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, padding: '10px 0' }}>
                {socialLinks.map((s) => {
                  const plat = s.platform?.toLowerCase()
                  const isX = plat === 'twitter' || plat === 'x' || s.url?.toLowerCase().includes('x.com') || s.url?.toLowerCase().includes('twitter.com')
                  return (
                    <a
                      key={s.id || s.url}
                      href={s.url}
                      target="_blank"
                      rel="noreferrer"
                      className="social-icon-btn"
                      style={{ width: 36, height: 36 }}
                      aria-label={s.label || s.platform}
                      title={s.label || s.platform}
                    >
                      {plat === 'github' && <Github size={16} />}
                      {plat === 'linkedin' && <Linkedin size={16} />}
                      {isX && (
                        <svg viewBox="0 0 24 24" width={14} height={14} fill="currentColor">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                      )}
                      {plat === 'instagram' && <Instagram size={16} />}
                      {plat === 'email' && <Mail size={16} />}
                      {!['github', 'linkedin', 'instagram', 'email'].includes(plat) && !isX && <Globe size={16} />}
                    </a>
                  )
                })}
              </div>
            )}

            {/* Bottom Actions */}
            <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)', fontWeight: 600 }}>Theme</span>
                <button className="theme-toggle-btn" onClick={onToggleTheme} aria-label="Toggle theme">
                  {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
                </button>
              </div>

              <a
                href={portfolioApi.resumeDownloadUrl}
                target="_blank"
                rel="noreferrer"
                className="btn btn-primary"
                style={{ width: '100%' }}
                onClick={handleResumeClick}
              >
                <FileText size={16} /> Download Resume
              </a>
            </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
