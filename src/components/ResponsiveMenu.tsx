'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { usePathname, useRouter } from 'next/navigation'
import { X, Sun, Moon, FileText, ArrowRight, Github, Linkedin, Mail, Instagram, Globe } from 'lucide-react'
import { portfolioApi } from '@/api'
import type { SocialLink } from '@/types/portfolio'

const navLinks = [{label:'About',href:'#about'},{label:'Projects',href:'#projects'},{label:'Experience',href:'#experience'},{label:'Education',href:'#education'},{label:'Contact',href:'#contact'}]
interface Props { open:boolean; onClose:()=>void; theme:'light'|'dark'; onToggleTheme:()=>void; socialLinks?:SocialLink[] }

export default function ResponsiveMenu({open,onClose,theme,onToggleTheme,socialLinks=[]}:Props){
  const pathname=usePathname(); const router=useRouter()
  function handleNavClick(href:string){onClose(); if(pathname==='/') document.querySelector(href)?.scrollIntoView({behavior:'smooth'}); else router.push(`/${href}`)}
  return <AnimatePresence>{open&&<motion.div className="mobile-drawer-overlay" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={onClose}><motion.aside className="mobile-drawer" initial={{x:'100%'}} animate={{x:0}} exit={{x:'100%'}} transition={{duration:.28,ease:'easeOut'}} onClick={(e)=>e.stopPropagation()}>
    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}><button type="button" className="nav-brand" onClick={()=>{onClose();pathname==='/'?window.scrollTo({top:0,behavior:'smooth'}):router.push('/')}} style={{background:'none',border:'none',cursor:'pointer',padding:0}}>chirru<span className="nav-brand-dot"/></button><button className="modal-close-btn" onClick={onClose} aria-label="Close menu"><X size={18}/></button></div>
    <nav className="mobile-nav-links">{navLinks.map(link=><a key={link.href} href={link.href} className="mobile-nav-link" onClick={(e)=>{e.preventDefault();handleNavClick(link.href)}}><span>{link.label}</span><ArrowRight size={16} color="var(--text-muted)"/></a>)}</nav>
    {socialLinks.length>0&&<div style={{display:'flex',flexWrap:'wrap',gap:8,padding:'10px 0'}}>{socialLinks.map(s=>{const plat=s.platform?.toLowerCase()||'';const isX=plat==='twitter'||plat==='x'||s.url.toLowerCase().includes('x.com')||s.url.toLowerCase().includes('twitter.com');return <a key={s.id||s.url} href={s.url} target="_blank" rel="noreferrer" className="social-icon-btn" style={{width:36,height:36}} aria-label={s.label||s.platform||'Social link'}>{plat==='github'&&<Github size={16}/>} {plat==='linkedin'&&<Linkedin size={16}/>} {isX&&<span>𝕏</span>} {plat==='instagram'&&<Instagram size={16}/>} {plat==='email'&&<Mail size={16}/>} {!['github','linkedin','instagram','email'].includes(plat)&&!isX&&<Globe size={16}/>}</a>})}</div>}
    <div style={{marginTop:'auto',display:'flex',flexDirection:'column',gap:16}}><div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}><span style={{fontSize:'.88rem',color:'var(--text-muted)',fontWeight:600}}>Theme</span><button className="theme-toggle-btn" onClick={onToggleTheme} aria-label="Toggle theme">{theme==='light'?<Moon size={16}/>:<Sun size={16}/>}</button></div><a href={portfolioApi.resumeDownloadUrl} target="_blank" rel="noreferrer" className="btn btn-primary" style={{width:'100%'}} onClick={()=>{onClose();void portfolioApi.trackEvent('resume_download',{source:'mobile_drawer_cta'})}}><FileText size={16}/> Download Resume</a></div>
  </motion.aside></motion.div>}</AnimatePresence>
}
