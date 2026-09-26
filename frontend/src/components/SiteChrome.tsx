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

import { useTheme } from '@/utils/themeStore'

export default function SiteChrome({children,profile,socialLinks}:SiteChromeProps){
  const [menuOpen,setMenuOpen]=useState(false)
  const [toasts,setToasts]=useState<ToastItem[]>([])
  const { theme, toggleTheme } = useTheme()

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
        onToggleTheme={toggleTheme}
      />

      {menuOpen && (
        <ResponsiveMenu
          open
          onClose={() => setMenuOpen(false)}
          theme={theme}
          onToggleTheme={toggleTheme}
          socialLinks={socialLinks}
        />
      )}

      <main>{children}</main>

      <Footer profile={profile} socialLinks={socialLinks} />

      {toasts.length > 0 && <Toast toasts={toasts} onDismiss={dismissToast} />}
    </div>
  )
}
