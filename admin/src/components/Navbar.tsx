'use client'

import { useQuery } from '@tanstack/react-query'
import { ExternalLink, LogOut, Menu, Moon, Search, Sparkles, Sun } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { adminApi } from '../api'

const navLinks = [
  { href: '/', label: 'Dashboard' },
  { href: '/projects', label: 'Projects' },
  { href: '/profile', label: 'Profile' },
  { href: '/skills', label: 'Skills' },
  { href: '/experience', label: 'Experience' },
  { href: '/education', label: 'Education' },
  { href: '/certifications', label: 'Certificates' },
  { href: '/messages', label: 'Messages', isMessage: true },
]

interface NavbarProps { onMenuToggle?: () => void; onLogout?: () => void }

export default function Navbar({ onMenuToggle, onLogout }: NavbarProps) {
  const pathname = usePathname()
  const [theme, setTheme] = useState(() => typeof window !== 'undefined' ? localStorage.getItem('chirru_admin_theme') || 'dark' : 'dark')
  const dashQuery = useQuery({ queryKey: ['dashboard'], queryFn: adminApi.dashboard, staleTime: 30000 })
  const unreadCount = dashQuery.data?.unreadMessages || 0

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('chirru_admin_theme', theme)
  }, [theme])

  return (
    <header className="navbar-container">
      <div className="navbar-inner">
        <div className="navbar-left">
          <button className="navbar-mobile-toggle" onClick={onMenuToggle} aria-label="Toggle navigation menu"><Menu size={20} /></button>
          <Link href="/" className="navbar-brand"><div className="navbar-brand-logo"><Sparkles size={18} /></div><div className="navbar-brand-text">chirru<span>.</span><span className="navbar-brand-tag">admin</span></div></Link>
        </div>
        <nav className="navbar-nav" aria-label="Main Navigation">
          {navLinks.map(({ href, label, isMessage }) => {
            const isActive = pathname === href
            return <Link key={href} href={href} className={`navbar-link ${isActive ? 'active' : ''}`}><span>{label}</span>{isMessage && unreadCount > 0 && <span className="navbar-badge">{unreadCount}</span>}</Link>
          })}
        </nav>
        <div className="navbar-right">
          <a href={process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:5174'} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm navbar-live-link" title="View Live Portfolio"><ExternalLink size={14} /><span>Live Site</span></a>
          <button className="btn btn-ghost btn-icon navbar-theme-btn" onClick={() => setTheme((prev) => prev === 'dark' ? 'light' : 'dark')} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>{theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}</button>
          <Link href="/profile" className="navbar-user-pill"><div className="navbar-avatar">C</div><span className="navbar-username">Chiranjit</span></Link>
          <button className="btn btn-danger btn-sm btn-icon" onClick={onLogout} title="Sign Out" aria-label="Sign Out"><LogOut size={15} /></button>
        </div>
      </div>
    </header>
  )
}
