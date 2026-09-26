import { useQuery } from '@tanstack/react-query'
import {
  BadgeCheck,
  BriefcaseBusiness,
  ExternalLink,
  FolderKanban,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  Moon,
  Search,
  Sparkles,
  Sun,
  UserRound,
  Wrench,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { adminApi } from '../api'

const navLinks = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/projects', label: 'Projects', icon: FolderKanban },
  { to: '/profile', label: 'Profile', icon: UserRound },
  { to: '/skills', label: 'Skills', icon: Wrench },
  { to: '/experience', label: 'Experience', icon: BriefcaseBusiness },
  { to: '/education', label: 'Education', icon: GraduationCap },
  { to: '/certifications', label: 'Certificates', icon: BadgeCheck },
  { to: '/messages', label: 'Messages', icon: Mail, isMessage: true },
]

export default function Navbar({ onMenuToggle, onLogout }) {
  const location = useLocation()
  const [theme, setTheme] = useState(() => localStorage.getItem('chirru_admin_theme') || 'dark')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('chirru_admin_theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  const dashQuery = useQuery({
    queryKey: ['dashboard'],
    queryFn: adminApi.dashboard,
    staleTime: 30000,
  })

  const unreadCount = dashQuery.data?.unreadMessages || 0

  return (
    <header className="navbar-container">
      <div className="navbar-inner">
        {/* Left: Brand & Mobile Toggle */}
        <div className="navbar-left">
          <button
            className="navbar-mobile-toggle"
            onClick={onMenuToggle}
            aria-label="Toggle navigation menu"
          >
            <Menu size={20} />
          </button>

          <Link to="/" className="navbar-brand">
            <div className="navbar-brand-logo">
              <Sparkles size={18} />
            </div>
            <div className="navbar-brand-text">
              chirru<span>.</span>
              <span className="navbar-brand-tag">admin</span>
            </div>
          </Link>
        </div>

        {/* Center: Desktop Navigation Pills */}
        <nav className="navbar-nav" aria-label="Main Navigation">
          {navLinks.map(({ to, label, icon: Icon, isMessage }) => {
            const isActive = location.pathname === to
            return (
              <Link
                key={to}
                to={to}
                className={`navbar-link ${isActive ? 'active' : ''}`}
              >
                <Icon size={15} />
                <span>{label}</span>
                {isMessage && unreadCount > 0 && (
                  <span className="navbar-badge">{unreadCount}</span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Right: Actions, Theme, Live Link & Profile */}
        <div className="navbar-right">
          <a
            href="http://localhost:5173"
            target="_blank"
            rel="noreferrer"
            className="btn btn-secondary btn-sm navbar-live-link"
            title="View Live Portfolio"
          >
            <ExternalLink size={14} />
            <span>Live Site</span>
          </a>

          <button
            className="btn btn-ghost btn-icon navbar-theme-btn"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
          </button>

          <div className="navbar-user-pill">
            <div className="navbar-avatar">C</div>
            <span className="navbar-username">Chirag</span>
          </div>

          <button
            className="btn btn-danger btn-sm btn-icon"
            onClick={onLogout}
            title="Sign Out"
            aria-label="Sign Out"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </header>
  )
}
