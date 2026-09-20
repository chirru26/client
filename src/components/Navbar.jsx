import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, Sun, Moon, FileText } from 'lucide-react'
import { portfolioApi } from '../api'

const navLinks = [
  { label: 'About', href: '#about', route: '/about' },
  { label: 'Projects', href: '#projects', route: '/projects' },
  { label: 'Experience', href: '#experience', route: '/experience' },
  { label: 'Education', href: '#education', route: '/experience' },
  { label: 'Contact', href: '#contact', route: '/contact' },
]

export default function Navbar({ onMenu, theme, onToggleTheme }) {
  const [activeSection, setActiveSection] = useState('home')
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 30)

      if (location.pathname === '/') {
        const sections = ['home', 'about', 'projects', 'experience', 'education', 'contact']
        const scrollPos = window.scrollY + 200

        for (const section of sections) {
          const el = document.getElementById(section)
          if (el) {
            const top = el.offsetTop
            const height = el.offsetHeight
            if (scrollPos >= top && scrollPos < top + height) {
              setActiveSection(section)
              break
            }
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [location.pathname])

  function handleResumeClick() {
    portfolioApi.trackEvent('resume_download', {
      source: 'navbar_cta',
    })
  }

  function handleBrandClick(e) {
    e.preventDefault()
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      navigate('/')
    }
  }

  function handleNavLinkClick(e, link) {
    if (location.pathname === '/') {
      e.preventDefault()
      const el = document.querySelector(link.href)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
      }
    } else {
      // Navigate to homepage section
      e.preventDefault()
      navigate(`/${link.href}`)
    }
  }

  return (
    <header className={`navbar-wrapper ${scrolled ? 'scrolled' : ''}`}>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`} aria-label="Main Navigation">
        {/* Brand */}
        <a className="nav-brand" href="/" onClick={handleBrandClick}>
          chirru<span className="nav-brand-dot" />
        </a>

        {/* Desktop Links */}
        <ul className="nav-links">
          {navLinks.map((link) => {
            const isSectionActive =
              location.pathname === '/'
                ? activeSection === link.href.slice(1)
                : location.pathname.startsWith(link.route)

            return (
              <li key={link.label}>
                <a
                  href={`/${link.href}`}
                  className={`nav-link ${isSectionActive ? 'active' : ''}`}
                  onClick={(e) => handleNavLinkClick(e, link)}
                >
                  {link.label}
                </a>
              </li>
            )
          })}
        </ul>

        {/* Actions (Theme, Resume, Mobile Menu) */}
        <div className="nav-actions">
          {/* Theme Toggle */}
          <button className="theme-toggle-btn" onClick={onToggleTheme} aria-label="Toggle dark/light theme">
            {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
          </button>

          {/* Resume CTA */}
          <a
            href={portfolioApi.resumeDownloadUrl}
            target="_blank"
            rel="noreferrer"
            className="btn btn-primary btn-sm"
            onClick={handleResumeClick}
          >
            <FileText size={14} /> Resume
          </a>

          {/* Mobile Menu Button */}
          <button className="mobile-menu-btn" onClick={onMenu} aria-label="Open mobile menu">
            <Menu size={20} />
          </button>
        </div>
      </nav>
    </header>
  )
}
