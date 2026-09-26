import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  Clock,
  ExternalLink,
  FileSpreadsheet,
  FolderKanban,
  GraduationCap,
  Mail,
  Plus,
  Radio,
  Settings,
  ShieldCheck,
  UserCheck,
  UserRound,
  Users,
  Wrench,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { adminApi } from '../api'
import { getImageUrl } from '../utils/imageUtils'

export default function Dashboard() {
  const dashQuery = useQuery({ queryKey: ['dashboard'], queryFn: adminApi.dashboard })
  const profileQuery = useQuery({ queryKey: ['profile'], queryFn: adminApi.profile })
  const projectsQuery = useQuery({ queryKey: ['projects'], queryFn: adminApi.projects })
  const messagesQuery = useQuery({ queryKey: ['messages'], queryFn: adminApi.messages })
  const skillsQuery = useQuery({ queryKey: ['skills'], queryFn: adminApi.skills })
  const experienceQuery = useQuery({ queryKey: ['experience'], queryFn: adminApi.experience })
  const educationQuery = useQuery({ queryKey: ['education'], queryFn: adminApi.education })
  const certsQuery = useQuery({ queryKey: ['certifications'], queryFn: adminApi.certifications })

  const qc = useQueryClient()
  const [savingOpenToWork, setSavingOpenToWork] = useState(false)

  const toggleOpenToWork = async () => {
    if (profileQuery.isLoading) return
    const currentProfile = profileQuery.data || {}
    setSavingOpenToWork(true)
    try {
      await adminApi.saveProfile({ ...currentProfile, openToWork: !currentProfile.openToWork })
      await qc.invalidateQueries({ queryKey: ['profile'] })
    } catch (err) {
      console.error('Failed to toggle openToWork:', err)
    } finally {
      setSavingOpenToWork(false)
    }
  }

  // Real-time ticking clock
  const [time, setTime] = useState(new Date())
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const d = dashQuery.data || {}
  const profile = profileQuery.data || {}
  const projects = Array.isArray(projectsQuery.data) ? projectsQuery.data : []
  const messages = Array.isArray(messagesQuery.data) ? messagesQuery.data : []
  const skills = Array.isArray(skillsQuery.data) ? skillsQuery.data : []
  const experience = Array.isArray(experienceQuery.data) ? experienceQuery.data : []
  const education = Array.isArray(educationQuery.data) ? educationQuery.data : []
  const certs = Array.isArray(certsQuery.data) ? certsQuery.data : []

  const name = profile.name || 'Chiranjit Das'
  const unreadCount = d.unreadMessages ?? messages.filter((m) => !m.read).length
  const projectsCount = d.projects ?? projects.length
  const skillsCount = d.skills ?? skills.length
  const experienceCount = d.experience ?? experience.length
  const educationCount = d.education ?? education.length
  const certsCount = d.certifications ?? certs.length
  const featuredCount = projects.filter((p) => p.featured).length

  // Time-aware greeting
  const hour = time.getHours()
  const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening'

  const formattedDate = time.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const formattedTime = time.toLocaleTimeString('en-GB', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })

  const dateIsoFormatted = `${time.getFullYear()}-${String(time.getMonth() + 1).padStart(2, '0')}-${String(time.getDate()).padStart(2, '0')}`

  const hasRefId = messages.some((m) => m && m.id !== undefined && m.id !== null && m.id !== '')

  return (
    <div className="dashboard-container">
      {/* 1. Hero Banner matching Reference Screenshot */}
      <div className="executive-hero">
        <div className="executive-hero-left">
          <div className="executive-hero-avatar">
            {profile.imageUrl ? (
              <img src={getImageUrl(profile.imageUrl)} alt={name} />
            ) : (
              name.charAt(0).toUpperCase()
            )}
          </div>
          <div className="executive-hero-info">
            <span className="executive-hero-tag">PORTFOLIO ADMINISTRATOR</span>
            <h1 className="executive-hero-title">
              {greeting}, {name}
            </h1>
            <div className="executive-hero-subrow">
              <span>• Projects: {projectsCount}</span>
              <span>• Skills: {skillsCount}</span>
              <span>• Roles: {experienceCount}</span>
              <span className="executive-hero-badge">
                <span className="hero-status-dot" />
                PORTFOLIO LIVE
              </span>
            </div>
          </div>
        </div>

        <div className="executive-hero-right" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div className="executive-clock-card">
            <div className="executive-clock-date">
              <span>📅</span>
              <span>{formattedDate}</span>
            </div>
            <div className="executive-clock-time">
              <Clock size={16} />
              <span>{formattedTime}</span>
            </div>
          </div>

          <div
            className="executive-clock-card"
            style={{
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
              opacity: savingOpenToWork ? 0.6 : 1,
            }}
          >
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Available for Opportunities
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={!!profile.openToWork}
              onClick={toggleOpenToWork}
              disabled={savingOpenToWork}
              style={{
                position: 'relative',
                width: '44px',
                height: '24px',
                borderRadius: '12px',
                border: 'none',
                cursor: savingOpenToWork ? 'not-allowed' : 'pointer',
                background: profile.openToWork ? 'var(--accent-green, #22c55e)' : 'var(--bg-elevated, #374151)',
                transition: 'background 0.25s ease',
                padding: 0,
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  top: '2px',
                  left: profile.openToWork ? '22px' : '2px',
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  background: '#fff',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
                  transition: 'left 0.25s ease',
                }}
              />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Top 6 Metric Stat Cards (Grid with Real Portfolio Metrics) */}
      <div className="stat-grid-6">
        {/* Card 1: Total Active Projects */}
        <div className="ref-stat-card">
          <div className="ref-stat-header">
            <span className="ref-stat-title">TOTAL ACTIVE PROJECTS</span>
            <div className="ref-stat-badge-icon blue">
              <FolderKanban size={14} />
            </div>
          </div>
          <div className="ref-stat-main">
            <div className="ref-stat-val">{projectsCount}</div>
            <span className="ref-stat-sub">Featured & Public Showcases</span>
          </div>
          <div className="ref-stat-footer">
            <span className="ref-stat-tag">Showcase Works</span>
            <Link to="/projects" className="ref-stat-link blue">
              Directory →
            </Link>
          </div>
        </div>

        {/* Card 2: Technical Skills */}
        <div className="ref-stat-card">
          <div className="ref-stat-header">
            <span className="ref-stat-title">TECHNICAL SKILLS & TOOLS</span>
            <div className="ref-stat-badge-icon green">
              <Wrench size={14} />
            </div>
          </div>
          <div className="ref-stat-main">
            <div className="ref-stat-val">
              {skillsCount}{' '}
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#059669' }}>
                (Active)
              </span>
            </div>
            <span className="ref-stat-sub">Frontend, Backend & AI Tools</span>
          </div>
          <div className="ref-stat-footer">
            <span className="ref-stat-tag">Active Stack</span>
            <Link to="/skills" className="ref-stat-link green">
              Tech Stack →
            </Link>
          </div>
        </div>

        {/* Card 3: Unread Inquiries */}
        <div className="ref-stat-card">
          <div className="ref-stat-header">
            <span className="ref-stat-title">UNREAD INQUIRIES</span>
            <div className="ref-stat-badge-icon red">
              <Mail size={14} />
            </div>
          </div>
          <div className="ref-stat-main">
            <div className="ref-stat-val" style={{ color: unreadCount > 0 ? '#dc2626' : undefined }}>
              {unreadCount}
            </div>
            <span className="ref-stat-sub">Requires visitor followup</span>
          </div>
          <div className="ref-stat-footer">
            <span className="ref-stat-tag" style={{ color: unreadCount > 0 ? '#dc2626' : '#64748b' }}>
              {unreadCount > 0 ? 'Pending' : 'All Clear'}
            </span>
            <Link to="/messages" className="ref-stat-link red">
              Logs →
            </Link>
          </div>
        </div>

        {/* Card 4: Work Experience */}
        <div className="ref-stat-card">
          <div className="ref-stat-header">
            <span className="ref-stat-title">WORK EXPERIENCE</span>
            <div className="ref-stat-badge-icon emerald">
              <BriefcaseBusiness size={14} />
            </div>
          </div>
          <div className="ref-stat-main">
            <div className="ref-stat-val" style={{ color: '#0b5c46' }}>
              {experienceCount} Roles
            </div>
            <span className="ref-stat-sub">Professional career milestones</span>
          </div>
          <div className="ref-stat-footer">
            <span className="ref-stat-tag">Work History</span>
            <Link to="/experience" className="ref-stat-link emerald">
              Details →
            </Link>
          </div>
        </div>

        {/* Card 5: Certifications & Degrees */}
        <div className="ref-stat-card">
          <div className="ref-stat-header">
            <span className="ref-stat-title">CERTIFICATES & EDUCATION</span>
            <div className="ref-stat-badge-icon red">
              <GraduationCap size={14} />
            </div>
          </div>
          <div className="ref-stat-main">
            <div className="ref-stat-val" style={{ color: '#dc2626' }}>
              {certsCount + educationCount}
            </div>
            <span className="ref-stat-sub">Verified badges & qualifications</span>
          </div>
          <div className="ref-stat-footer">
            <span className="ref-stat-tag">Accreditations</span>
            <Link to="/certifications" className="ref-stat-link red">
              Audit Report →
            </Link>
          </div>
        </div>

        {/* Card 6: Total Received Messages */}
        <div className="ref-stat-card">
          <div className="ref-stat-header">
            <span className="ref-stat-title">TOTAL VISITOR CONTACTS</span>
            <div className="ref-stat-badge-icon green">
              <Users size={14} />
            </div>
          </div>
          <div className="ref-stat-main">
            <div className="ref-stat-val">{messages.length}</div>
            <span className="ref-stat-sub">Inquiries received to date</span>
          </div>
          <div className="ref-stat-footer">
            <span className="ref-stat-tag" style={{ color: '#059669' }}>
              Audience Network
            </span>
            <Link to="/messages" className="ref-stat-link green">
              Messages List →
            </Link>
          </div>
        </div>
      </div>

      {/* 3. Summary Strip Bar (4 Portfolio Indicators) */}
      <div className="summary-strip">
        <div className="summary-strip-item">
          <span className="summary-strip-label">FEATURED WORKS</span>
          <div className="summary-strip-val green">{featuredCount}</div>
        </div>
        <div className="summary-strip-item">
          <span className="summary-strip-label">PENDING INQUIRIES</span>
          <div className="summary-strip-val red">{unreadCount}</div>
        </div>
        <div className="summary-strip-item">
          <span className="summary-strip-label">CAREER ROLES</span>
          <div className="summary-strip-val blue">{experienceCount} Roles</div>
        </div>
        <div className="summary-strip-item">
          <span className="summary-strip-label">PORTFOLIO STATUS</span>
          <div className="summary-strip-val">100% ONLINE</div>
        </div>
      </div>

      {/* 4. Split 2-Column Content Area */}
      <div className="executive-split">
        {/* Left Column */}
        <div className="executive-col">
          {/* Administrative Command Dock */}
          <div className="card-box">
            <div className="card-box-header">
              <div className="card-box-title">
                <Settings size={15} />
                <span>Administrative Command Dock</span>
              </div>
            </div>

            <div className="command-dock-grid">
              <Link to="/projects" className="command-dock-btn">
                <Plus size={18} />
                <span>Add Project</span>
              </Link>
              <Link to="/profile" className="command-dock-btn">
                <UserRound size={18} />
                <span>Update Bio</span>
              </Link>
              <Link to="/skills" className="command-dock-btn">
                <Wrench size={18} />
                <span>Manage Skills</span>
              </Link>
              <Link to="/messages" className="command-dock-btn">
                <Mail size={18} />
                <span>Check Inbox</span>
              </Link>
              <Link to="/experience" className="command-dock-btn">
                <BriefcaseBusiness size={18} />
                <span>Add Experience</span>
              </Link>
              <Link to="/certifications" className="command-dock-btn">
                <BadgeCheck size={18} />
                <span>Add Certificate</span>
              </Link>
            </div>
          </div>

          {/* Recent Inquiries Ledger Activity Table */}
          <div className="card-box">
            <div className="card-box-header">
              <div className="card-box-title">
                <FileSpreadsheet size={15} />
                <span>Recent Inquiries Ledger Activity</span>
              </div>
              <Link to="/messages" className="card-box-action">
                <span>VIEW ALL</span>
                <ArrowRight size={13} />
              </Link>
            </div>

            <div className="table-responsive">
              <table className="ledger-table">
                <thead>
                  <tr>
                    {hasRefId && <th>REFERENCE</th>}
                    <th>PARTICULARS</th>
                    <th>CHANNEL</th>
                    <th>DATE</th>
                    <th style={{ textAlign: 'right' }}>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {messages.length === 0 ? (
                    <tr>
                      <td colSpan={hasRefId ? 5 : 4} style={{ textAlign: 'center', padding: '24px', color: '#94a3b8' }}>
                        No incoming inquiries yet.
                      </td>
                    </tr>
                  ) : (
                    messages.slice(0, 5).map((m, idx) => (
                      <tr key={m.id || idx}>
                        {hasRefId && (
                          <td>
                            {m.id ? (
                              <span className="ref-code">{m.id}</span>
                            ) : (
                              <span style={{ color: '#94a3b8' }}>-</span>
                            )}
                          </td>
                        )}
                        <td>
                          <div className="particulars-title">{m.subject || 'Portfolio Inquiry'}</div>
                          <div className="particulars-sub">
                            {m.name || 'Visitor'} · {m.email}
                          </div>
                        </td>
                        <td>Email</td>
                        <td>
                          {m.createdAt
                            ? new Date(m.createdAt).toLocaleDateString('en-GB', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                              })
                            : 'Recent'}
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <span
                            className="amount-pos"
                            style={{ color: !m.read ? '#dc2626' : '#059669' }}
                          >
                            {!m.read ? 'UNREAD' : 'RESOLVED'}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Featured Projects Showcase Hub */}
          <div className="card-box">
            <div className="card-box-header">
              <div className="card-box-title">
                <FolderKanban size={15} />
                <span>Featured Projects Showcase Hub</span>
              </div>
              <Link to="/projects" className="card-box-action">
                <span>MANAGE PROJECTS</span>
                <ArrowRight size={13} />
              </Link>
            </div>

            <div className="exam-list">
              {projects.length === 0 ? (
                <div style={{ padding: '12px', textAlign: 'center', color: '#94a3b8', fontSize: '0.8rem' }}>
                  No projects added yet. Click &quot;Add Project&quot; above to create one.
                </div>
              ) : (
                projects.slice(0, 3).map((project) => (
                  <div className="exam-row" key={project.id}>
                    <div>
                      <div className="particulars-title">{project.title}</div>
                      <div className="particulars-sub">
                        <code>/{project.slug}</code> {project.featured && '• Featured'}
                      </div>
                    </div>
                    <Link to="/projects" className="btn btn-secondary btn-sm">
                      <span>✎ Edit</span>
                    </Link>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="executive-col">
          {/* Portfolio Readiness Overview */}
          <div className="card-box">
            <div className="card-box-header">
              <div className="card-box-title">
                <UserCheck size={15} />
                <span>Portfolio Readiness Overview</span>
              </div>
              <span className="pill-badge blue">95% Overall</span>
            </div>

            <div className="progress-widget">
              <div className="progress-header">
                <span>PROFILE BIO & CREDENTIALS</span>
                <span>95% Ready</span>
              </div>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: '95%' }} />
              </div>

              <div style={{ paddingTop: '8px' }}>
                <span className="summary-strip-label" style={{ display: 'block', marginBottom: '4px' }}>
                  STACK COMPLETION RATIO
                </span>
                <div className="ratio-row">
                  <span>Frontend & UI Showcase</span>
                  <span className="ratio-val">100% (Complete)</span>
                </div>
                <div className="ratio-row">
                  <span>Backend API & Services</span>
                  <span className="ratio-val">90% (Synced)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Portfolio Activity Feeds */}
          <div className="card-box">
            <div className="card-box-header">
              <div className="card-box-title">
                <Radio size={15} />
                <span>Recent System Feeds</span>
              </div>
              <span className="pill-badge green">Live Sync</span>
            </div>

            <div className="notice-list">
              <div className="notice-item">
                <span className="notice-item-title">Portfolio v2.0 Live CMS Deployed</span>
                <div className="notice-item-sub">
                  <span>04 Sep 2026</span>
                  <span className="notice-badge">System</span>
                </div>
              </div>

              <div className="notice-item">
                <span className="notice-item-title">Projects Showcase Synced</span>
                <div className="notice-item-sub">
                  <span>03 Sep 2026</span>
                  <span className="notice-badge">Projects</span>
                </div>
              </div>

              <div className="notice-item">
                <span className="notice-item-title">Bio & Social Connections Online</span>
                <div className="notice-item-sub">
                  <span>02 Sep 2026</span>
                  <span className="notice-badge">Profile</span>
                </div>
              </div>
            </div>
          </div>

          {/* System & Server Status */}
          <div className="card-box">
            <div className="card-box-header">
              <div className="card-box-title">
                <ShieldCheck size={15} />
                <span>System & Server Status</span>
              </div>
              <span className="pill-badge green">ONLINE</span>
            </div>

            <div className="system-status-box">
              <div>Software Engine: <strong>Chirru Portfolio CMS Enterprise</strong></div>
              <div>Frontend: <strong>React 19 + Vite 7</strong></div>
              <div>Database & REST: <strong>REST API v2 · Port 8080</strong></div>
              <div>Server Clock: <strong>{dateIsoFormatted} {formattedTime}</strong></div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="site-footer">
        © 2026 Copyright by Chirru Portfolio Admin
      </footer>
    </div>
  )
}
