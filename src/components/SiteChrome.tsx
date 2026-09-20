'use client'

import { useEffect, useState, type ReactNode } from 'react'
import Navbar from '@/components/Navbar'
import ResponsiveMenu from '@/components/ResponsiveMenu'
import Footer from '@/components/Footer'
import Toast from '@/components/Toast'
import { portfolioApi } from '@/api'
import type { Profile, SocialLink, ToastItem, ToastType } from '@/types/portfolio'

interface SiteChromeProps { children: ReactNode; profile: Profile; socialLinks: SocialLink[] }

const THEME_KEY='chirru_theme'

export default function SiteChrome({children,profile,socialLinks}:SiteChromeProps){
  const [menuOpen,setMenuOpen]=useState(false)
  const [toasts,setToasts]=useState<ToastItem[]>([])
  const [theme,setTheme]=useState<'light'|'dark'>('light')
  const [themeReady,setThemeReady]=useState(false)

  useEffect(()=>{
    const stored=localStorage.getItem(THEME_KEY)
    if(stored==='light'||stored==='dark') setTheme(stored)
    else if(window.matchMedia('(prefers-color-scheme: dark)').matches) setTheme('dark')
    setThemeReady(true)
  },[])
  useEffect(()=>{
    if(!themeReady) return
    document.documentElement.setAttribute('data-theme',theme)
    localStorage.setItem(THEME_KEY,theme)
  },[theme,themeReady])
  useEffect(()=>{const handler=(e:KeyboardEvent)=>{if(e.key==='Escape')setMenuOpen(false)};window.addEventListener('keydown',handler);return()=>window.removeEventListener('keydown',handler)},[])
  function showToast(message:string,type:ToastType='info'){const id=Date.now().toString(36)+Math.random().toString(36).slice(2,6);setToasts(prev=>[...prev,{id,message,type}]);window.setTimeout(()=>setToasts(prev=>prev.filter(t=>t.id!==id)),4000)}
  function dismissToast(id:string){setToasts(prev=>prev.filter(t=>t.id!==id))}
  useEffect(()=>{void portfolioApi.trackEvent('page_view',{path:window.location.pathname})},[])
  return <div className="portfolio-app"><div className="ambient-background"><div className="ambient-glow-1"/><div className="ambient-glow-2"/><div className="ambient-glow-3"/><div className="ambient-grid"/></div><Navbar onMenu={()=>setMenuOpen(true)} theme={theme} onToggleTheme={()=>setTheme(t=>t==='dark'?'light':'dark')}/><ResponsiveMenu open={menuOpen} onClose={()=>setMenuOpen(false)} theme={theme} onToggleTheme={()=>setTheme(t=>t==='dark'?'light':'dark')} socialLinks={socialLinks}/>{children}<Footer profile={profile} socialLinks={socialLinks}/><Toast toasts={toasts} onDismiss={dismissToast}/></div>
}
