'use client'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { ArrowRight, BriefcaseBusiness, FileSpreadsheet, FolderKanban, Mail, Plus, Settings, UserRound, Wrench } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { adminApi } from '@/lib/api'
import { getImageUrl } from '@/lib/utils/imageUtils'
import QueryError from '@/components/ui/QueryError'

type RecordItem = Record<string, any>

function DashboardClock() {
  const [time, setTime] = useState(() => new Date())

  useEffect(() => {
    const timer = window.setInterval(() => setTime(new Date()), 1000)
    return () => window.clearInterval(timer)
  }, [])

  const formattedTime = time.toLocaleTimeString('en-GB', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })
  const dayDateFormatted = time.toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })
  const hourDeg = ((time.getHours() % 12) + time.getMinutes() / 60 + time.getSeconds() / 3600) * 30
  const minuteDeg = (time.getMinutes() + time.getSeconds() / 60) * 6
  const secondDeg = time.getSeconds() * 6

  return (
    <div className="executive-clock-station" aria-label={`Current time ${formattedTime}, ${dayDateFormatted}, India Standard Time`}>
      <div className="clock-station-dial">
        <svg viewBox="0 0 100 100" className="clock-dial-svg" aria-hidden="true">
          <circle cx="50" cy="50" r="47" className="dial-rim" />
          <circle cx="50" cy="50" r="43" className="dial-face" />
          {Array.from({ length: 12 }).map((_, i) => {
            const isMajor = i % 3 === 0
            const rad = ((i * 30) - 90) * (Math.PI / 180)
            const x1 = 50 + (isMajor ? 33 : 37) * Math.cos(rad)
            const y1 = 50 + (isMajor ? 33 : 37) * Math.sin(rad)
            const x2 = 50 + 42 * Math.cos(rad)
            const y2 = 50 + 42 * Math.sin(rad)
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} className={isMajor ? 'dial-tick-major' : 'dial-tick-minor'} />
          })}
          <line x1="50" y1="50" x2={50 + 22 * Math.sin((hourDeg * Math.PI) / 180)} y2={50 - 22 * Math.cos((hourDeg * Math.PI) / 180)} className="dial-hand-hour" />
          <line x1="50" y1="50" x2={50 + 31 * Math.sin((minuteDeg * Math.PI) / 180)} y2={50 - 31 * Math.cos((minuteDeg * Math.PI) / 180)} className="dial-hand-minute" />
          <line x1={50 - 7 * Math.sin((secondDeg * Math.PI) / 180)} y1={50 + 7 * Math.cos((secondDeg * Math.PI) / 180)} x2={50 + 36 * Math.sin((secondDeg * Math.PI) / 180)} y2={50 - 36 * Math.cos((secondDeg * Math.PI) / 180)} className="dial-hand-second" />
          <circle cx="50" cy="50" r="3" className="dial-center-cap" />
          <circle cx="50" cy="1.2" r="1.2" className="dial-center-dot" />
        </svg>
      </div>
      <div className="clock-station-data">
        <div className="clock-station-badge"><span className="clock-station-pulse" /></div>
        <div className="clock-station-time">{formattedTime}</div>
        <div className="clock-station-date">{dayDateFormatted}</div>
        <div className="clock-station-tz">IST · UTC+05:30</div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const qc = useQueryClient()
  const dashQuery = useQuery({ queryKey: ['dashboard'], queryFn: adminApi.dashboard })
  const profileQuery = useQuery({ queryKey: ['profile'], queryFn: adminApi.profile })
  const projectsQuery = useQuery({ queryKey: ['projects'], queryFn: adminApi.projects })
  const messagesQuery = useQuery({ queryKey: ['messages'], queryFn: adminApi.messages })
  const skillsQuery = useQuery({ queryKey: ['skills'], queryFn: adminApi.skills })
  const experienceQuery = useQuery({ queryKey: ['experience'], queryFn: adminApi.experience })
  const [savingOpenToWork, setSavingOpenToWork] = useState(false)
  const [openToWorkError, setOpenToWorkError] = useState('')

  const d = (dashQuery.data || {}) as RecordItem
  const profile = (profileQuery.data || {}) as RecordItem
  const projects = (Array.isArray(projectsQuery.data) ? projectsQuery.data : []) as RecordItem[]
  const messages = (Array.isArray(messagesQuery.data) ? messagesQuery.data : []) as RecordItem[]
  const skills = (Array.isArray(skillsQuery.data) ? skillsQuery.data : []) as RecordItem[]
  const experience = (Array.isArray(experienceQuery.data) ? experienceQuery.data : []) as RecordItem[]
  const name = String(profile.name || 'Chiranjit Das')
  const avatarSrc = getImageUrl(profile.imageUrl)
  const unreadCount = Number(d.unreadMessages ?? messages.filter((m) => !m.read).length)
  const projectsCount = Number(d.projects ?? projects.length)
  const skillsCount = Number(d.skills ?? skills.length)
  const experienceCount = Number(d.experience ?? experience.length)
  const unreadCountDisplay = d.unreadMessages == null && messagesQuery.isPending ? '…' : unreadCount
  const projectsCountDisplay = d.projects == null && projectsQuery.isPending ? '…' : projectsCount
  const skillsCountDisplay = d.skills == null && skillsQuery.isPending ? '…' : skillsCount
  const experienceCountDisplay = d.experience == null && experienceQuery.isPending ? '…' : experienceCount
  const greetingHour = new Date().getHours()
  const greeting = greetingHour < 12 ? 'Good Morning' : greetingHour < 18 ? 'Good Afternoon' : 'Good Evening'

  const toggleOpenToWork = async () => {
    if (profileQuery.isLoading) return
    setSavingOpenToWork(true)
    setOpenToWorkError('')
    try {
      await adminApi.saveProfile({ ...profile, openToWork: !profile.openToWork })
      await qc.invalidateQueries({ queryKey: ['profile'] })
    } catch (err) {
      setOpenToWorkError(err instanceof Error ? err.message : 'Could not update availability. Please try again.')
    } finally {
      setSavingOpenToWork(false)
    }
  }

  const statCards = [
    { title: 'TOTAL ACTIVE PROJECTS', value: projectsCountDisplay, sub: 'Featured & Public', desc: 'Java, Spring Boot, Microservices', tag: 'Showcase Works', href: '/projects', link: 'Directory →', icon: FolderKanban, tone: 'blue' },
    { title: 'TECHNICAL SKILLS & TOOLS', value: skillsCountDisplay, sub: 'Active', desc: 'Backend, Cloud, DevOps Stack', tag: 'Active Stack', href: '/skills', link: 'Tech Stack →', icon: Wrench, tone: 'green' },
    { title: 'UNREAD INQUIRIES', value: unreadCountDisplay, sub: unreadCount > 0 ? 'Urgent review' : 'All Clear', desc: 'Recruiter & Client messages', tag: unreadCount > 0 ? 'Pending' : 'Resolved', href: '/messages', link: 'Logs →', icon: Mail, tone: 'red' },
    { title: 'RESUME & CAREER', value: experienceCountDisplay === '…' ? '…' : `${experienceCount} Roles`, sub: 'Milestones', desc: 'Senior Backend Developer History', tag: 'Audience Network', href: '/experience', link: 'Details →', icon: BriefcaseBusiness, tone: 'emerald' },
  ]

  const failedQueries = [dashQuery, profileQuery, projectsQuery, messagesQuery, skillsQuery, experienceQuery].filter((query) => query.isError)

  return <div className="dashboard-container">
    {failedQueries.length > 0 && <QueryError message="Some dashboard data could not be loaded." onRetry={() => { for (const query of failedQueries) void query.refetch() }} /> }
    <div className="executive-hero">
      <div className="executive-hero-content">
        <div className="executive-hero-left">
          <div className="executive-hero-avatar" style={{ width: 56, height: 56, minWidth: 56, maxHeight: 56, borderRadius: 12, overflow: 'hidden', flexShrink: 0, position: 'relative' }}>
            {avatarSrc ? <img src={avatarSrc} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} onError={(e) => { e.currentTarget.style.display = 'none'; if (e.currentTarget.parentElement) { e.currentTarget.parentElement.innerText = name.charAt(0).toUpperCase() } }} /> : name.charAt(0).toUpperCase()}
          </div>
          <div className="executive-hero-info">
            <div className="executive-hero-badge-row">
              <span className="executive-hero-tag">STAFF DISTRIBUTED ARCHITECT</span>
              <span className="executive-hero-badge"><span className="hero-status-dot" />PORTFOLIO LIVE · EDGE SYNCED</span>
            </div>
            <h1 className="executive-hero-title">{greeting}, {name}</h1>
            <div className="executive-hero-subrow">
              <span>· Projects: {projectsCount}</span>
              <span>· Skills: {skillsCount}</span>
            </div>
          </div>
        </div>

        <div className="executive-hero-actions">
          <div className="executive-opportunity-card">
            <div className="executive-opportunity-text">
              <span className="opportunity-title">Available for Opportunities</span>
              <span className="opportunity-sub">Remote (Global) &amp; Advisory</span>
            </div>
            <button type="button" role="switch" aria-label="Availability for opportunities" aria-checked={!!profile.openToWork} onClick={toggleOpenToWork} disabled={savingOpenToWork} className={`opportunity-switch ${profile.openToWork ? 'active' : ''}`}>
              <span className="opportunity-switch-thumb" />
            </button>
          </div>
          {openToWorkError && <p className="alert alert-error" role="alert">{openToWorkError}</p>}
          <Link href="/projects" className="hero-new-project-btn">
            <Plus size={18} />
            <span>New Project</span>
          </Link>
        </div>
      </div>

      <DashboardClock />
    </div>

    <div className="stat-grid-4">
      {statCards.map(({ title, value, sub, desc, tag, href, link, icon: Icon, tone }) => (
        <div className="ref-stat-card" key={title}>
          <div className="ref-stat-header">
            <span className="ref-stat-title">{title}</span>
            <div className={`ref-stat-badge-icon ${tone}`}><Icon size={16} /></div>
          </div>
          <div className="ref-stat-main">
            <div className="ref-stat-val-row">
              <span className="ref-stat-val">{value}</span>
              <span className={`ref-stat-sub-badge ${tone}`}>{sub}</span>
            </div>
            <p className="ref-stat-desc">{desc}</p>
          </div>
          <div className="ref-stat-footer">
            <span className="ref-stat-tag">{tag}</span>
            <Link href={href} className={`ref-stat-link ${tone}`}>{link}</Link>
          </div>
        </div>
      ))}
    </div>

    <div className="card-box command-dock-box">
      <div className="card-box-header">
        <div className="card-box-title">
          <Settings size={16} />
          <span>Administrative Command Dock</span>
        </div>
        <span className="card-box-hint">Quick Dispatch Actions</span>
      </div>
      <div className="command-dock-grid">
        {[
          { href: '/projects', icon: Plus, label: 'Add Project' },
          { href: '/profile', icon: UserRound, label: 'Update Bio' },
          { href: '/skills', icon: Wrench, label: 'Manage Skills' },
          { href: '/messages', icon: Mail, label: 'Check Inbox' },
          { href: '/experience', icon: BriefcaseBusiness, label: 'Add Experience' },
          { href: '/resumes', icon: FileSpreadsheet, label: 'Upload Resume' },
        ].map(({ href, icon: Icon, label }) => (
          <Link href={href} className="command-dock-btn" key={href}>
            <Icon size={18} />
            <span>{label}</span>
          </Link>
        ))}
      </div>
    </div>

    <div className="card-box showcase-box">
      <div className="card-box-header">
        <div className="card-box-title">
          <FolderKanban size={16} />
          <span>Featured Projects Showcase Hub</span>
        </div>
        <Link href="/projects" className="card-box-action">
          <span>MANAGE ALL ({projects.length})</span>
          <ArrowRight size={13} />
        </Link>
      </div>
      <div className="featured-showcase-list">
        {projectsQuery.isPending ? (
          <div style={{ padding: 16, textAlign: 'center', color: '#94a3b8', fontSize: '0.85rem' }} role="status">Loading projects…</div>
        ) : projects.length === 0 ? (
          <div style={{ padding: 16, textAlign: 'center', color: '#94a3b8', fontSize: '0.85rem' }}>No projects added yet.</div>
        ) : (
          projects.slice(0, 3).map((project) => {
            const cleanDesc = String(project.shortDescription || project.description || 'High-performance engineering project.')
              .replace(/\?{2,}/g, ' · ')
              .trim()
            const projectImg = getImageUrl(project.imageUrl)
            return (
              <div className="showcase-item" key={String(project.id)}>
                {projectImg && (
                  <div className="showcase-thumb">
                    <img src={projectImg} alt={String(project.title || 'Project')} onError={(e) => { e.currentTarget.parentElement!.style.display = 'none' }} />
                  </div>
                )}
                <div className="showcase-item-content">
                  <div className="showcase-item-header">
                    <h4 className="showcase-item-title">{String(project.title || 'Untitled Project')}</h4>
                    {project.featured && <span className="showcase-featured-chip">Featured</span>}
                  </div>
                  <p className="showcase-item-desc">{cleanDesc}</p>
                </div>
                <div className="showcase-item-actions">
                  <Link href="/projects" className="btn btn-secondary btn-sm">Edit</Link>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
    <footer className="site-footer">© 2026 Copyright by Chirru Portfolio Admin</footer>
  </div>
}
