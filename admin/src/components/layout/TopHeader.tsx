'use client'

import { adminApi } from '@/lib/api'
import { getImageUrl } from '@/lib/utils/imageUtils'
import { useQuery } from '@tanstack/react-query'
import { Bell, ExternalLink, Menu, Search } from 'lucide-react'
import Link from 'next/link'

interface TopHeaderProps {
  onToggleSidebar: () => void
  onOpenSearch: () => void
}

export default function TopHeader({ onToggleSidebar, onOpenSearch }: TopHeaderProps) {
  const publicSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const notifQuery = useQuery({ queryKey: ['notifications', true], queryFn: () => adminApi.notifications(true), refetchInterval: 30000 })
  const profileQuery = useQuery({ queryKey: ['profile'], queryFn: adminApi.profile })
  const unreadCount = ((notifQuery.data as any[]) || []).length
  const name = (profileQuery.data as any)?.name || 'Chiranjit Das'
  const avatarSrc = getImageUrl((profileQuery.data as any)?.imageUrl)

  return (
    <header className="admin-topheader">
      <div className="admin-topheader-left">
        <button
          type="button"
          className="btn btn-secondary btn-sm btn-icon topheader-toggle-btn"
          onClick={onToggleSidebar}
          aria-label="Toggle navigation"
          aria-controls="admin-sidebar"
          title="Toggle Sidebar"
        >
          <Menu size={18} />
        </button>
        <span className="topheader-brand-title">CMS Workbench</span>
        <div className="topheader-edge-pill" title="Cloudflare Workers Stockholm Edge Node">
          <span className="edge-pulse-dot" />
          <span>ARN-01 · 14ms</span>
        </div>
        <button type="button" className="topheader-search-btn" onClick={onOpenSearch}>
          <Search size={15} />
          <span className="topheader-search-label">Quick search CMS resources, tags, inquiries...</span>
          <kbd className="topheader-kbd">Ctrl+K</kbd>
        </button>
      </div>

      <div className="admin-topheader-right">
        <button
          type="button"
          className="btn btn-secondary btn-sm btn-icon topheader-search-mobile-btn"
          onClick={onOpenSearch}
          aria-label="Search"
          title="Search CMS"
        >
          <Search size={16} />
        </button>
        <Link
          href="/notifications"
          className="btn btn-secondary btn-sm btn-icon topheader-notif-btn"
          title="Notifications Center"
        >
          <Bell size={16} />
          {unreadCount > 0 && <span className="topheader-unread-badge">{unreadCount}</span>}
        </Link>
        <div className="topheader-divider" />
        <a
          href={publicSiteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-secondary btn-sm topheader-public-btn"
          title="Public Site"
        >
          <span className="topheader-public-label">Public Site</span>
          <ExternalLink size={14} />
        </a>
        <div className="topheader-avatar">
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
      </div>
    </header>
  )
}
