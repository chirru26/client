import { useQuery } from '@tanstack/react-query'
import {
  Bell,
  ExternalLink,
  Menu,
  Search
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { adminApi } from '../api'

export default function TopHeader({ onToggleSidebar, onOpenSearch }) {
  const publicSiteUrl = import.meta.env.VITE_PUBLIC_SITE_URL || 'http://localhost:5174'

  const notifQuery = useQuery({
    queryKey: ['notifications', true],
    queryFn: () => adminApi.notifications(true),
    refetchInterval: 30000,
  })

  const unreadCount = (notifQuery.data || []).length

  return (
    <header className="admin-topheader">
      <div className="admin-topheader-left">
        <button
          type="button"
          className="btn btn-secondary btn-sm btn-icon mobile-menu-btn"
          onClick={onToggleSidebar}
          aria-label="Toggle navigation"
        >
          <Menu size={18} />
        </button>

        <button
          type="button"
          className="topheader-search-btn"
          onClick={onOpenSearch}
        >
          <Search size={15} />
          <span>Quick search CMS...</span>
          <kbd className="topheader-kbd">Ctrl+K</kbd>
        </button>
      </div>

      <div className="admin-topheader-right">
        <Link
          to="/notifications"
          className="btn btn-secondary btn-sm btn-icon"
          style={{ position: 'relative' }}
          title="Notifications Center"
        >
          <Bell size={16} />
          {unreadCount > 0 && (
            <span className="topheader-unread-badge">{unreadCount}</span>
          )}
        </Link>

        <a
          href={publicSiteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-secondary btn-sm"
          style={{ gap: 6, fontSize: '0.82rem' }}
        >
          <ExternalLink size={14} />
          <span className="hide-mobile">Public Site</span>
        </a>
      </div>
    </header>
  )
}
