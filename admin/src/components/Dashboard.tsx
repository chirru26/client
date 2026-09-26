'use client'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { ArrowRight, BadgeCheck, BriefcaseBusiness, Clock, FileSpreadsheet, FolderKanban, GraduationCap, Mail, Plus, Radio, Settings, ShieldCheck, UserCheck, UserRound, Users, Wrench } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { adminApi } from '../api'
import { getImageUrl } from '../utils/imageUtils'

type RecordItem = Record<string, any>

export default function Dashboard() {
  const qc = useQueryClient()
  const dashQuery = useQuery({ queryKey: ['dashboard'], queryFn: adminApi.dashboard })
  const profileQuery = useQuery({ queryKey: ['profile'], queryFn: adminApi.profile })
  const projectsQuery = useQuery({ queryKey: ['projects'], queryFn: adminApi.projects })
  const messagesQuery = useQuery({ queryKey: ['messages'], queryFn: adminApi.messages })
  const skillsQuery = useQuery({ queryKey: ['skills'], queryFn: adminApi.skills })
  const experienceQuery = useQuery({ queryKey: ['experience'], queryFn: adminApi.experience })
  const educationQuery = useQuery({ queryKey: ['education'], queryFn: adminApi.education })
  const certsQuery = useQuery({ queryKey: ['certifications'], queryFn: adminApi.certifications })
  const [savingOpenToWork, setSavingOpenToWork] = useState(false)
  const [time, setTime] = useState(new Date())

  useEffect(() => { const timer = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(timer) }, [])

  const d = (dashQuery.data || {}) as RecordItem
  const profile = (profileQuery.data || {}) as RecordItem
  const projects = (Array.isArray(projectsQuery.data) ? projectsQuery.data : []) as RecordItem[]
  const messages = (Array.isArray(messagesQuery.data) ? messagesQuery.data : []) as RecordItem[]
  const skills = (Array.isArray(skillsQuery.data) ? skillsQuery.data : []) as RecordItem[]
  const experience = (Array.isArray(experienceQuery.data) ? experienceQuery.data : []) as RecordItem[]
  const education = (Array.isArray(educationQuery.data) ? educationQuery.data : []) as RecordItem[]
  const certs = (Array.isArray(certsQuery.data) ? certsQuery.data : []) as RecordItem[]
  const name = String(profile.name || 'Chiranjit Das')
  const unreadCount = Number(d.unreadMessages ?? messages.filter((m) => !m.read).length)
  const projectsCount = Number(d.projects ?? projects.length)
  const skillsCount = Number(d.skills ?? skills.length)
  const experienceCount = Number(d.experience ?? experience.length)
  const educationCount = Number(d.education ?? education.length)
  const certsCount = Number(d.certifications ?? certs.length)
  const featuredCount = projects.filter((p) => p.featured).length
  const greeting = time.getHours() < 12 ? 'Good Morning' : time.getHours() < 18 ? 'Good Afternoon' : 'Good Evening'
  const formattedDate = time.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
  const formattedTime = time.toLocaleTimeString('en-GB', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })
  const dateIsoFormatted = `${time.getFullYear()}-${String(time.getMonth() + 1).padStart(2, '0')}-${String(time.getDate()).padStart(2, '0')}`
  const hasRefId = messages.some((m) => m.id !== undefined && m.id !== null && m.id !== '')

  const toggleOpenToWork = async () => {
    if (profileQuery.isLoading) return
    setSavingOpenToWork(true)
    try { await adminApi.saveProfile({ ...profile, openToWork: !profile.openToWork }); await qc.invalidateQueries({ queryKey: ['profile'] }) }
    catch (err) { console.error('Failed to toggle openToWork:', err) }
    finally { setSavingOpenToWork(false) }
  }

  const statCards = [
    { title: 'TOTAL ACTIVE PROJECTS', value: projectsCount, sub: 'Featured & Public Showcases', tag: 'Showcase Works', href: '/projects', link: 'Directory →', icon: FolderKanban, tone: 'blue' },
    { title: 'TECHNICAL SKILLS & TOOLS', value: `${skillsCount} (Active)`, sub: 'Frontend, Backend & AI Tools', tag: 'Active Stack', href: '/skills', link: 'Tech Stack →', icon: Wrench, tone: 'green' },
    { title: 'UNREAD INQUIRIES', value: unreadCount, sub: 'Requires visitor followup', tag: unreadCount > 0 ? 'Pending' : 'All Clear', href: '/messages', link: 'Logs →', icon: Mail, tone: 'red' },
    { title: 'WORK EXPERIENCE', value: `${experienceCount} Roles`, sub: 'Professional career milestones', tag: 'Work History', href: '/experience', link: 'Details →', icon: BriefcaseBusiness, tone: 'emerald' },
    { title: 'CERTIFICATES & EDUCATION', value: certsCount + educationCount, sub: 'Verified badges & qualifications', tag: 'Accreditations', href: '/certifications', link: 'Audit Report →', icon: GraduationCap, tone: 'red' },
    { title: 'TOTAL VISITOR CONTACTS', value: messages.length, sub: 'Inquiries received to date', tag: 'Audience Network', href: '/messages', link: 'Messages List →', icon: Users, tone: 'green' },
  ]

  return <div className="dashboard-container">
    <div className="executive-hero">
      <div className="executive-hero-left"><div className="executive-hero-avatar">{profile.imageUrl ? <img src={getImageUrl(String(profile.imageUrl))} alt={name} /> : name.charAt(0).toUpperCase()}</div><div className="executive-hero-info"><span className="executive-hero-tag">PORTFOLIO ADMINISTRATOR</span><h1 className="executive-hero-title">{greeting}, {name}</h1><div className="executive-hero-subrow"><span>• Projects: {projectsCount}</span><span>• Skills: {skillsCount}</span><span>• Roles: {experienceCount}</span><span className="executive-hero-badge"><span className="hero-status-dot" />PORTFOLIO LIVE</span></div></div></div>
      <div className="executive-hero-right" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}><div className="executive-clock-card"><div className="executive-clock-date"><span>📅</span><span>{formattedDate}</span></div><div className="executive-clock-time"><Clock size={16} /><span>{formattedTime}</span></div></div><div className="executive-clock-card" style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', opacity: savingOpenToWork ? 0.6 : 1 }}><span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Available for Opportunities</span><button type="button" role="switch" aria-checked={!!profile.openToWork} onClick={toggleOpenToWork} disabled={savingOpenToWork} style={{ position: 'relative', width: 44, height: 24, borderRadius: 12, border: 'none', cursor: savingOpenToWork ? 'not-allowed' : 'pointer', background: profile.openToWork ? 'var(--accent-green, #22c55e)' : 'var(--bg-elevated, #374151)', padding: 0 }}><span style={{ position: 'absolute', top: 2, left: profile.openToWork ? 22 : 2, width: 20, height: 20, borderRadius: '50%', background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }} /></button></div></div>
    </div>

    <div className="stat-grid-6">{statCards.map(({ title, value, sub, tag, href, link, icon: Icon, tone }) => <div className="ref-stat-card" key={title}><div className="ref-stat-header"><span className="ref-stat-title">{title}</span><div className={`ref-stat-badge-icon ${tone}`}><Icon size={14} /></div></div><div className="ref-stat-main"><div className="ref-stat-val">{value}</div><span className="ref-stat-sub">{sub}</span></div><div className="ref-stat-footer"><span className="ref-stat-tag">{tag}</span><Link href={href} className={`ref-stat-link ${tone}`}>{link}</Link></div></div>)}</div>

    <div className="summary-strip"><div className="summary-strip-item"><span className="summary-strip-label">FEATURED WORKS</span><div className="summary-strip-val green">{featuredCount}</div></div><div className="summary-strip-item"><span className="summary-strip-label">PENDING INQUIRIES</span><div className="summary-strip-val red">{unreadCount}</div></div><div className="summary-strip-item"><span className="summary-strip-label">CAREER ROLES</span><div className="summary-strip-val blue">{experienceCount} Roles</div></div><div className="summary-strip-item"><span className="summary-strip-label">PORTFOLIO STATUS</span><div className="summary-strip-val">100% ONLINE</div></div></div>

    <div className="executive-split"><div className="executive-col">
      <div className="card-box"><div className="card-box-header"><div className="card-box-title"><Settings size={15} /><span>Administrative Command Dock</span></div></div><div className="command-dock-grid">{[["/projects", Plus, 'Add Project'], ['/profile', UserRound, 'Update Bio'], ['/skills', Wrench, 'Manage Skills'], ['/messages', Mail, 'Check Inbox'], ['/experience', BriefcaseBusiness, 'Add Experience'], ['/certifications', BadgeCheck, 'Add Certificate']].map(([href, Icon, label]) => <Link href={String(href)} className="command-dock-btn" key={String(href)}>{typeof Icon === 'function' && <Icon size={18} />}<span>{String(label)}</span></Link>)}</div></div>

      <div className="card-box"><div className="card-box-header"><div className="card-box-title"><FileSpreadsheet size={15} /><span>Recent Inquiries Ledger Activity</span></div><Link href="/messages" className="card-box-action"><span>VIEW ALL</span><ArrowRight size={13} /></Link></div><div className="table-responsive"><table className="ledger-table"><thead><tr>{hasRefId && <th>REFERENCE</th>}<th>PARTICULARS</th><th>CHANNEL</th><th>DATE</th><th style={{ textAlign: 'right' }}>STATUS</th></tr></thead><tbody>{messages.length === 0 ? <tr><td colSpan={hasRefId ? 5 : 4} style={{ textAlign: 'center', padding: 24, color: '#94a3b8' }}>No incoming inquiries yet.</td></tr> : messages.slice(0, 5).map((m, idx) => <tr key={String(m.id || idx)}>{hasRefId && <td>{m.id ? <span className="ref-code">{String(m.id)}</span> : <span style={{ color: '#94a3b8' }}>-</span>}</td>}<td><div className="particulars-title">{String(m.subject || 'Portfolio Inquiry')}</div><div className="particulars-sub">{String(m.name || 'Visitor')} · {String(m.email || '')}</div></td><td>Email</td><td>{m.createdAt ? new Date(m.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Recent'}</td><td style={{ textAlign: 'right' }}><span className="amount-pos" style={{ color: !m.read ? '#dc2626' : '#059669' }}>{!m.read ? 'UNREAD' : 'RESOLVED'}</span></td></tr>)}</tbody></table></div></div>

      <div className="card-box"><div className="card-box-header"><div className="card-box-title"><FolderKanban size={15} /><span>Featured Projects Showcase Hub</span></div><Link href="/projects" className="card-box-action"><span>MANAGE PROJECTS</span><ArrowRight size={13} /></Link></div><div className="exam-list">{projects.length === 0 ? <div style={{ padding: 12, textAlign: 'center', color: '#94a3b8', fontSize: '0.8rem' }}>No projects added yet.</div> : projects.slice(0, 3).map((project) => <div className="exam-row" key={String(project.id)}><div><div className="particulars-title">{String(project.title || 'Untitled Project')}</div><div className="particulars-sub"><code>/{String(project.slug || '')}</code> {project.featured && '• Featured'}</div></div><Link href="/projects" className="btn btn-secondary btn-sm"><span>✎ Edit</span></Link></div>)}</div></div>
    </div>

    <div className="executive-col"><div className="card-box"><div className="card-box-header"><div className="card-box-title"><UserCheck size={15} /><span>Portfolio Readiness Overview</span></div><span className="pill-badge blue">95% Overall</span></div><div className="progress-widget"><div className="progress-header"><span>PROFILE BIO & CREDENTIALS</span><span>95% Ready</span></div><div className="progress-track"><div className="progress-fill" style={{ width: '95%' }} /></div><div style={{ paddingTop: 8 }}><span className="summary-strip-label" style={{ display: 'block', marginBottom: 4 }}>STACK COMPLETION RATIO</span><div className="ratio-row"><span>Frontend & UI Showcase</span><span className="ratio-val">100% (Complete)</span></div><div className="ratio-row"><span>Backend API & Services</span><span className="ratio-val">90% (Synced)</span></div></div></div></div>

      <div className="card-box"><div className="card-box-header"><div className="card-box-title"><Radio size={15} /><span>Recent System Feeds</span></div><span className="pill-badge green">Live Sync</span></div><div className="notice-list"><div className="notice-item"><span className="notice-item-title">Portfolio v2.0 Live CMS Deployed</span><div className="notice-item-sub"><span>04 Sep 2026</span><span className="notice-badge">System</span></div></div><div className="notice-item"><span className="notice-item-title">Projects Showcase Synced</span><div className="notice-item-sub"><span>03 Sep 2026</span><span className="notice-badge">Projects</span></div></div><div className="notice-item"><span className="notice-item-title">Bio & Social Connections Online</span><div className="notice-item-sub"><span>02 Sep 2026</span><span className="notice-badge">Profile</span></div></div></div></div>

      <div className="card-box"><div className="card-box-header"><div className="card-box-title"><ShieldCheck size={15} /><span>System & Server Status</span></div><span className="pill-badge green">ONLINE</span></div><div className="system-status-box"><div>Software Engine: <strong>Chirru Portfolio CMS Enterprise</strong></div><div>Frontend: <strong>Next.js + TypeScript</strong></div><div>Database & REST: <strong>REST API v2 · Port 8080</strong></div><div>Server Clock: <strong>{dateIsoFormatted} {formattedTime}</strong></div></div></div>
    </div></div>
    <footer className="site-footer">© 2026 Copyright by Chirru Portfolio Admin</footer>
  </div>
}
