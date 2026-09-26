import { useQuery } from '@tanstack/react-query'
import {
  Activity,
  BadgeCheck,
  BarChart3,
  Bell,
  BriefcaseBusiness,
  CloudUpload,
  ExternalLink,
  FileText,
  FolderKanban,
  GraduationCap,
  Hash,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  Search,
  Settings,
  Share2,
  ShieldCheck,
  UserRound,
  Wrench,
  X,
} from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { adminApi } from '../api'

const navSections = [
  {
    title: 'Overview',
    items: [
      { to: '/', label: 'Dashboard', icon: LayoutDashboard },
      { to: '/analytics', label: 'Analytics Hub', icon: BarChart3 },
      { to: '/notifications', label: 'Notifications', icon: Bell, isNotification: true },
    ],
  },
  {
    title: 'Portfolio Content',
    items: [
      { to: '/projects', label: 'Projects Showcase', icon: FolderKanban },
      { to: '/profile', label: 'Profile & Bio', icon: UserRound },
      { to: '/skills', label: 'Technical Skills', icon: Wrench },
      { to: '/experience', label: 'Experience', icon: BriefcaseBusiness },
      { to: '/education', label: 'Education', icon: GraduationCap },
      { to: '/certifications', label: 'Certifications', icon: BadgeCheck },
      { to: '/tags', label: 'Project Tags', icon: Hash },
    ],
  },
  {
    title: 'Growth & Assets',
    items: [
      { to: '/media', label: 'Media & Documents', icon: CloudUpload },
      { to: '/resumes', label: 'Resume Editions', icon: FileText },
      { to: '/social-links', label: 'Social Links', icon: Share2 },
      { to: '/seo', label: 'SEO & Metadata', icon: Search },
    ],
  },
  {
    title: 'System & Inquiries',
    items: [
      { to: '/messages', label: 'Inquiries & Messages', icon: Mail, isMessage: true },
      { to: '/audit-logs', label: 'Audit Logs Trail', icon: ShieldCheck },
      { to: '/settings', label: 'CMS Settings', icon: Settings },
    ],
  },
]

export default function Sidebar({ isOpen, onToggle, onClose, onLogout }) {
  const location = useLocation()
  const publicSiteUrl = import.meta.env.VITE_PUBLIC_SITE_URL || 'http://localhost:5174'

  const profileQuery = useQuery({
    queryKey: ['profile'],
    queryFn: adminApi.profile,
  })

  const dashQuery = useQuery({
    queryKey: ['dashboard'],
    queryFn: adminApi.dashboard,
    staleTime: 30000,
  })

  const notifQuery = useQuery({
    queryKey: ['notifications', true],
    queryFn: () => adminApi.notifications(true),
    staleTime: 30000,
  })

  const name = profileQuery.data?.name || 'Chiranjit Das'
  const unreadMessages = dashQuery.data?.unreadMessages || 0
  const unreadNotifs = (notifQuery.data || []).length

  const handleClose = () => {
    if (onClose) {
      onClose()
    } else if (onToggle) {
      onToggle()
    }
  }

  return (
    <>
      {isOpen && <div className="sidebar-backdrop" onClick={handleClose} />}
      <aside
        className={`sidebar ${isOpen ? 'mobile-open' : ''}`}
        aria-label="Sidebar Navigation"
      >
        {/* Header matching exact layout */}
        <div className="sidebar-header">
          <div className="sidebar-user-block">
            <div className="sidebar-brand-avatar">
              {profileQuery.data?.imageUrl ? (
                <img src={profileQuery.data.imageUrl} alt={name} />
              ) : (
                name.charAt(0).toUpperCase()
              )}
            </div>
            <div className="sidebar-user-meta">
              <span className="sidebar-user-name">{name}</span>
              <span className="sidebar-user-role">Portfolio Administrator</span>
            </div>
          </div>
          <button
            className="sidebar-toggle-btn"
            onClick={onToggle}
            aria-label="Toggle navigation menu"
          >
            <Menu size={18} />
          </button>
        </div>

        {/* Navigation Items with Forest Green Capsule Active State */}
        <nav className="sidebar-nav">
          {navSections.map((sec) => (
            <div key={sec.title} className="sidebar-section">
              <div className="sidebar-section-title">{sec.title}</div>
              {sec.items.map(({ to, label, icon: Icon, isMessage, isNotification }) => {
                const isActive = location.pathname === to
                return (
                  <Link
                    key={to}
                    to={to}
                    className={`sidebar-item ${isActive ? 'active' : ''}`}
                    onClick={() => {
                      if (window.innerWidth <= 1024) {
                        handleClose()
                      }
                    }}
                  >
                    <div className="sidebar-item-content">
                      <Icon size={16} />
                      <span>{label}</span>
                    </div>
                    {isMessage && unreadMessages > 0 && (
                      <span className="sidebar-badge">{unreadMessages}</span>
                    )}
                    {isNotification && unreadNotifs > 0 && (
                      <span className="sidebar-badge" style={{ background: '#3b82f6' }}>
                        {unreadNotifs}
                      </span>
                    )}
                  </Link>
                )
              })}
            </div>
          ))}
        </nav>

        {/* Footer Actions */}
        <div className="sidebar-footer">
          <a
            href={publicSiteUrl}
            target="_blank"
            rel="noreferrer"
            className="sidebar-btn-footer"
          >
            <ExternalLink size={15} />
            <span>Public Website</span>
          </a>

          <button
            className="sidebar-btn-footer sidebar-btn-logout"
            onClick={onLogout}
          >
            <LogOut size={15} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  )
}
