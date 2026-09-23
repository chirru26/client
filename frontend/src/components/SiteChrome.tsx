'use client'

import { useEffect, useState, type ReactNode } from 'react'
import dynamic from 'next/dynamic'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const ResponsiveMenu = dynamic(() => import('@/components/ResponsiveMenu'))
const Toast = dynamic(() => import('@/components/Toast'))
import { portfolioApi } from '@/api'
import type { Profile, SocialLink, ToastItem } from '@/types/portfolio'

interface SiteChromeProps { children: ReactNode; profile: Profile; socialLinks: SocialLink[] }

const THEME_KEY='chirru_theme'

export default function SiteChrome({children,profile,socialLinks}:SiteChromeProps){
  const [menuOpen,setMenuOpen]=useState(false)
  const [toasts,setToasts]=useState<ToastItem[]>([])
  const [theme,setTheme]=useState<'light'|'dark'>('light') // SSR-safe; corrected in effect below

  useEffect(()=>{
    /* oxlint-disable react/set-state-in-effect -- reading browser localStorage post-hydration is the correct SSR pattern */
    const stored=localStorage.getItem(THEME_KEY)
    if(stored==='light'||stored==='dark') setTheme(stored)
    else if(window.matchMedia('(prefers-color-scheme: dark)').matches) setTheme('dark')
    /* oxlint-enable react/set-state-in-effect */
  },[])
  useEffect(()=>{
    document.documentElement.setAttribute('data-theme',theme)
    localStorage.setItem(THEME_KEY,theme)
  },[theme])
  useEffect(()=>{const handler=(e:KeyboardEvent)=>{if(e.key==='Escape')setMenuOpen(false)};window.addEventListener('keydown',handler);return()=>window.removeEventListener('keydown',handler)},[])

  function dismissToast(id:string){setToasts(prev=>prev.filter(t=>t.id!==id))}
  useEffect(()=>{void portfolioApi.trackEvent('page_view',{path:window.location.pathname})},[])
  useEffect(()=>{document.body.style.overflow=menuOpen?'hidden':'';return()=>{document.body.style.overflow=''}},[menuOpen])
  return (
    <div className="portfolio-app">
      <div className="ambient-background">
        <div className="ambient-glow-1" />
        <div className="ambient-glow-2" />
        <div className="ambient-glow-3" />
        <div className="ambient-grid" />
      </div>

      <Navbar
        onMenu={() => setMenuOpen(true)}
        theme={theme}
        onToggleTheme={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
      />

      {menuOpen && (
        <ResponsiveMenu
          open
          onClose={() => setMenuOpen(false)}
          theme={theme}
          onToggleTheme={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
          socialLinks={socialLinks}
        />
      )}

      <main>{children}</main>

      <Footer profile={profile} socialLinks={socialLinks} />

      {toasts.length > 0 && <Toast toasts={toasts} onDismiss={dismissToast} />}
    </div>
  )
}
