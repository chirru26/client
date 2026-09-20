'use client'

import { ArrowUp, Github, Linkedin, Instagram, Mail } from 'lucide-react'
import type { Profile, SocialLink } from '@/types/portfolio'

interface FooterProps { profile?: Profile; socialLinks?: SocialLink[] }

export default function Footer({ profile = {}, socialLinks = [] }: FooterProps) {
  const github = socialLinks.find((s) => s.platform?.toLowerCase() === 'github')?.url || profile.githubUrl
  const linkedin = socialLinks.find((s) => s.platform?.toLowerCase() === 'linkedin')?.url || profile.linkedinUrl
  const instagram = socialLinks.find((s) => s.platform?.toLowerCase() === 'instagram')?.url || profile.instagramUrl
  const xLink = socialLinks.find((s) => { const p=s.platform?.toLowerCase(); const u=s.url?.toLowerCase() || ''; return p==='twitter'||p==='x'||u.includes('x.com')||u.includes('twitter.com') })?.url || profile.twitterUrl || profile.xUrl
  return <footer className="footer"><div className="container footer-inner"><div><div className="footer-brand">chirru<span>.</span></div><p className="footer-copy" style={{ marginTop: 4 }}>© {new Date().getFullYear()} {profile.name || 'Chirru'}. All rights reserved.</p></div><div className="footer-socials">
    {github && <a href={github} target="_blank" rel="noreferrer" className="social-icon-btn" aria-label="GitHub"><Github size={16} /></a>}
    {linkedin && <a href={linkedin} target="_blank" rel="noreferrer" className="social-icon-btn" aria-label="LinkedIn"><Linkedin size={16} /></a>}
    {xLink && <a href={xLink} target="_blank" rel="noreferrer" className="social-icon-btn" aria-label="X (Twitter)"><span aria-hidden="true">𝕏</span></a>}
    {instagram && <a href={instagram} target="_blank" rel="noreferrer" className="social-icon-btn" aria-label="Instagram"><Instagram size={16} /></a>}
    {profile.email && <a href={`mailto:${profile.email}`} className="social-icon-btn" aria-label="Email"><Mail size={16} /></a>}
    <button className="back-to-top-btn" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Scroll to top of page"><ArrowUp size={14} /> Back to top</button>
  </div></div></footer>
}
