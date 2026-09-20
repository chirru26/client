'use client'

import { useEffect, useState, type MouseEvent } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Menu, Sun, Moon, FileText } from 'lucide-react'
import { portfolioApi } from '@/api'

const navLinks = [
  { label: 'About', href: '#about', route: '/about' },
  { label: 'Projects', href: '#projects', route: '/projects' },
  { label: 'Experience', href: '#experience', route: '/experience' },
  { label: 'Education', href: '#education', route: '/experience' },
  { label: 'Contact', href: '#contact', route: '/contact' },
]

interface NavbarProps { onMenu: () => void; theme: 'light' | 'dark'; onToggleTheme: () => void }

export default function Navbar({ onMenu, theme, onToggleTheme }: NavbarProps) {
  const [activeSection, setActiveSection] = useState('home')
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname() || '/'
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30)
      if (pathname === '/') {
        const scrollPos = window.scrollY + 200
        for (const section of ['home','about','projects','experience','education','contact']) {
          const el = document.getElementById(section)
          if (el && scrollPos >= el.offsetTop && scrollPos < el.offsetTop + el.offsetHeight) { setActiveSection(section); break }
        }
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [pathname])

  function handleNavLinkClick(e: MouseEvent<HTMLAnchorElement>, link: typeof navLinks[number]) {
    if (pathname === '/') {
      e.preventDefault(); document.querySelector(link.href)?.scrollIntoView({ behavior: 'smooth' })
    } else {
      e.preventDefault(); router.push(`/${link.href}`)
    }
  }

  return <header className={`navbar-wrapper ${scrolled ? 'scrolled' : ''}`}><nav className={`navbar ${scrolled ? 'scrolled' : ''}`} aria-label="Main Navigation">
    <a className="nav-brand" href="/" onClick={(e)=>{e.preventDefault();pathname==='/'?window.scrollTo({top:0,behavior:'smooth'}):router.push('/')}}>chirru<span className="nav-brand-dot" /></a>
    <ul className="nav-links">{navLinks.map((link)=>{const active=pathname==='/'?activeSection===link.href.slice(1):pathname.startsWith(link.route);return <li key={link.label}><a href={`/${link.href}`} className={`nav-link ${active?'active':''}`} onClick={(e)=>handleNavLinkClick(e,link)}>{link.label}</a></li>})}</ul>
    <div className="nav-actions"><button className="theme-toggle-btn" onClick={onToggleTheme} aria-label="Toggle dark/light theme">{theme==='light'?<Moon size={16}/>:<Sun size={16}/>}</button><a href={portfolioApi.resumeDownloadUrl} target="_blank" rel="noreferrer" className="btn btn-primary btn-sm" onClick={()=>void portfolioApi.trackEvent('resume_download',{source:'navbar_cta'})}><FileText size={14}/> Resume</a><button className="mobile-menu-btn" onClick={onMenu} aria-label="Open mobile menu"><Menu size={20}/></button></div>
  </nav></header>
}
