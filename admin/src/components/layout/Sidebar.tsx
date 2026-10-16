'use client'

import { useQuery } from '@tanstack/react-query'
import { BadgeCheck, BarChart3, Bell, BriefcaseBusiness, CloudUpload, FileText, FolderKanban, GraduationCap, Hash, LayoutDashboard, LogOut, Mail, Settings, Share2, ShieldCheck, UserRound, Wrench, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { adminApi } from '@/lib/api'
import { getImageUrl } from '@/lib/utils/imageUtils'

const navSections = [
  {
    title: '1. CORE OPS',
    items: [
      { to: '/', label: 'Main Dashboard', icon: LayoutDashboard },
      { to: '/projects', label: 'Projects Hub', icon: FolderKanban },
      { to: '/messages', label: 'Inquiries Inbox', icon: Mail, isMessage: true },
      { to: '/profile', label: 'Profile & Bio', icon: UserRound },
    ],
  },
  {
    title: '2. CREDENTIALS',
    items: [
      { to: '/skills', label: 'Skills Matrix', icon: Wrench },
      { to: '/experience', label: 'Work Experience', icon: BriefcaseBusiness },
      { to: '/education', label: 'Academic Credentials', icon: GraduationCap },
      { to: '/certifications', label: 'Certifications', icon: BadgeCheck },
    ],
  },
  {
    title: '3. ASSETS & DOCS',
    items: [
      { to: '/media', label: 'Media Vault', icon: CloudUpload },
      { to: '/resumes', label: 'Resume Center', icon: FileText },
      { to: '/tags', label: 'Taxonomy Tags', icon: Hash },
      { to: '/social-links', label: 'Social Links', icon: Share2 },
    ],
  },
  {
    title: '4. SYSTEM INFRA',
    items: [
      { to: '/settings', label: 'Runtime Settings', icon: Settings },
      { to: '/audit-logs', label: 'Audit Logs Trail', icon: ShieldCheck },
      { to: '/notifications', label: 'Alerts & Notifs', icon: Bell, isNotification: true },
      { to: '/analytics', label: 'Analytics Hub', icon: BarChart3 },
    ],
  },
]

interface SidebarProps {
  isOpen: boolean
  onToggle: () => void
  onClose: () => void
  onLogout: () => void
}

export default function Sidebar({ isOpen, onToggle, onClose, onLogout }: SidebarProps) {
  const pathname = usePathname()
  const profileQuery = useQuery({ queryKey: ['profile'], queryFn: adminApi.profile })
  const dashQuery = useQuery({ queryKey: ['dashboard'], queryFn: adminApi.dashboard, staleTime: 30000 })
  const notifQuery = useQuery({ queryKey: ['notifications', true], queryFn: () => adminApi.notifications(true), staleTime: 30000 })
  const name = (profileQuery.data as any)?.name || 'Chiranjit Das'
  const avatarSrc = getImageUrl((profileQuery.data as any)?.imageUrl)
  const unreadMessages = (dashQuery.data as any)?.unreadMessages || 0
  const unreadNotifs = ((notifQuery.data as any[]) || []).length
  const handleClose = () => (onClose ? onClose() : onToggle?.())

  return (
    <>
      {isOpen && <button type="button" className="sidebar-backdrop" onClick={handleClose} aria-label="Close navigation menu" />}
      <aside id="admin-sidebar" className={`sidebar ${isOpen ? 'mobile-open' : ''}`} aria-label="Sidebar Navigation">
        <div className="sidebar-header">
          <div className="sidebar-user-block">
            <div className="sidebar-brand-avatar">
              {avatarSrc ? (
                <img
                  src={avatarSrc}
                  alt={name}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                    if (e.currentTarget.parentElement) {
                      e.currentTarget.parentElement.innerText = 'CD'
                    }
                  }}
                />
              ) : (
                'CD'
              )}
            </div>
            <div className="sidebar-user-meta">
              <div className="sidebar-user-header-row">
                <span className="sidebar-user-name">{name}</span>
                <span className="sidebar-version-badge">v2.4</span>
              </div>
              <span className="sidebar-user-role">Staff Distributed Architect</span>
            </div>
          </div>
          <button className="sidebar-close-btn" onClick={handleClose} aria-label="Close navigation menu">
            <X size={18} />
          </button>
        </div>

        <nav className="sidebar-nav custom-scrollbar">
          {navSections.map((sec) => (
            <div key={sec.title} className="sidebar-section">
              <div className="sidebar-section-title">{sec.title}</div>
              {sec.items.map(({ to, label, icon: Icon, isMessage, isNotification }: any) => {
                const isActive = pathname === to
                return (
                  <Link
                    key={to}
                    href={to}
                    className={`sidebar-item ${isActive ? 'active' : ''}`}
                    aria-current={isActive ? 'page' : undefined}
                    onClick={() => window.innerWidth <= 1024 && handleClose()}
                  >
                    <div className="sidebar-item-content">
                      <Icon size={16} />
                      <span>{label}</span>
                    </div>
                    {isMessage && unreadMessages > 0 && <span className="sidebar-badge">{unreadMessages}</span>}
                    {isNotification && unreadNotifs > 0 && (
                      <span className="sidebar-badge sidebar-badge-blue">{unreadNotifs}</span>
                    )}
                  </Link>
                )
              })}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-bottom-user-card">
            <div className="sidebar-bottom-user-left">
              <div className="sidebar-bottom-avatar">CD</div>
              <div className="sidebar-bottom-meta">
                <span className="sidebar-bottom-name">{name}</span>
                <span className="sidebar-bottom-role">Backend Admin</span>
              </div>
            </div>
            <button
              className="sidebar-bottom-logout-btn"
              onClick={onLogout}
              title="Sign Out"
              aria-label="Sign Out"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
