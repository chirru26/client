'use client'

import { useEffect, useState, type MouseEvent } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Menu, Sun, Moon, FileText } from 'lucide-react'
import { portfolioApi } from '@/api'
import { useIsMounted } from '@/utils/themeStore'

const navLinks = [
  { label: 'About', href: '#about', route: '/about' },
  { label: 'Projects', href: '#projects', route: '/projects' },
  { label: 'Experience', href: '#experience', route: '/experience' },
  { label: 'Education', href: '#education', route: '/experience' },
  { label: 'Contact', href: '#contact', route: '/contact' },
]

interface NavbarProps {
  onMenu: () => void
  theme: 'light' | 'dark'
  onToggleTheme: () => void
}

export default function Navbar({ onMenu, theme, onToggleTheme }: NavbarProps) {
  const [activeSection, setActiveSection] = useState('home')
  const [scrolled, setScrolled] = useState(false)
  const [visible, setVisible] = useState(true)
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('up')
  const mounted = useIsMounted()
  const pathname = usePathname() || '/'
  const router = useRouter()

  useEffect(() => {
    let lastScrollY = window.scrollY
    let ticking = false

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY
          const isScrolled = currentScrollY > 20
          setScrolled(isScrolled)

          const diff = currentScrollY - lastScrollY

          if (currentScrollY <= 20) {
            // At the top: always visible, resting state
            setVisible(true)
            setScrollDirection('up')
          } else if (diff > 8) {
            // Scrolling down: hide navbar
            setVisible(false)
            setScrollDirection('down')
          } else if (diff < -8) {
            // Scrolling up: reveal navbar with glass effect
            setVisible(true)
            setScrollDirection('up')
          }

          lastScrollY = currentScrollY > 0 ? currentScrollY : 0

          if (pathname === '/') {
            const scrollPos = currentScrollY + 200
            for (const section of ['home', 'about', 'projects', 'experience', 'education', 'contact']) {
              const el = document.getElementById(section)
              if (el && scrollPos >= el.offsetTop && scrollPos < el.offsetTop + el.offsetHeight) {
                setActiveSection(section)
                break
              }
            }
          }

          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [pathname])

  function handleNavLinkClick(e: MouseEvent<HTMLAnchorElement>, link: typeof navLinks[number]) {
    if (pathname === '/') {
      e.preventDefault()
      setVisible(true)
      setScrollDirection('up')
      document.querySelector(link.href)?.scrollIntoView({ behavior: 'smooth' })
    } else {
      e.preventDefault()
      router.push(`/${link.href}`)
    }
  }

  function handleBrandClick(e: MouseEvent<HTMLAnchorElement>) {
    e.preventDefault()
    setVisible(true)
    setScrollDirection('up')
    if (pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      router.push('/')
    }
  }

  const wrapperClasses = [
    'navbar-wrapper',
    scrolled ? 'scrolled' : '',
    visible ? 'nav-visible' : 'nav-hidden',
    scrolled && scrollDirection === 'up' ? 'scrolling-up' : '',
  ].filter(Boolean).join(' ')

  return (
    <header className={wrapperClasses}>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`} aria-label="Main Navigation">
        <a className="nav-brand" href="/" onClick={handleBrandClick}>
          chirru<span className="nav-brand-dot" />
        </a>

        <ul className="nav-links">
          {navLinks.map((link) => {
            const active =
              pathname === '/'
                ? activeSection === link.href.slice(1)
                : pathname.startsWith(link.route)

            return (
              <li key={link.label}>
                <a
                  href={`/${link.href}`}
                  className={`nav-link ${active ? 'active' : ''}`}
                  aria-current={active ? (pathname === '/' ? 'location' : 'page') : undefined}
                  onClick={(e) => handleNavLinkClick(e, link)}
                >
                  {link.label}
                </a>
              </li>
            )
          })}
        </ul>

        <div className="nav-actions">
          <button
            type="button"
            className="theme-toggle-btn"
            onClick={onToggleTheme}
            aria-label="Toggle dark/light theme"
          >
            {mounted && theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          <a
            href={portfolioApi.resumeDownloadUrl}
            target="_blank"
            rel="noreferrer"
            className="btn btn-primary btn-sm"
            onClick={() => void portfolioApi.trackEvent('resume_download', { source: 'navbar_cta' })}
          >
            <FileText size={14} /> Resume
          </a>

          <button
            type="button"
            className="mobile-menu-btn"
            onClick={onMenu}
            aria-label="Open mobile menu"
            aria-expanded={false}
            aria-controls="mobile-navigation"
          >
            <Menu size={20} />
          </button>
        </div>
      </nav>
    </header>
  )
}
