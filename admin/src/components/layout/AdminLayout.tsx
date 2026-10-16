'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { auth } from '@/lib/api'
import { authStore } from '@/lib/auth'
import GlobalSearchModal from './GlobalSearchModal'
import Sidebar from './Sidebar'
import TopHeader from './TopHeader'

interface AdminLayoutProps {
  children?: ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [token, setToken] = useState<string | null>(null)
  const [authReady, setAuthReady] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  useEffect(() => {
    const syncToken = () => setToken(authStore.get())
    syncToken()
    // Auth state must be read after hydration because sessionStorage is browser-only.
    // oxlint-disable-next-line react/set-state-in-effect
    setAuthReady(true)

    const handleSessionExpired = () => {
      setToken(null)
      if (window.location.pathname !== '/login') router.replace('/login')
    }

    window.addEventListener('auth-change', syncToken)
    window.addEventListener('auth-expired', handleSessionExpired)
    return () => {
      window.removeEventListener('auth-change', syncToken)
      window.removeEventListener('auth-expired', handleSessionExpired)
    }
  }, [router])

  useEffect(() => {
    if (!authReady || pathname === '/login') return
    if (!token) router.replace('/login')
  }, [authReady, pathname, token, router])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024) setIsMobileOpen(false)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (!isMobileOpen || window.innerWidth > 1024) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [isMobileOpen])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setIsSearchOpen((previous) => !previous)
      }
      if (event.key === 'Escape') {
        setIsSearchOpen(false)
        setIsMobileOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  if (pathname === '/login') return children
  if (!authReady) {
    return (
      <div className="admin-auth-loading" role="status" aria-live="polite">
        <span className="admin-auth-loading-spinner" aria-hidden="true" />
        <span>Restoring your admin session…</span>
      </div>
    )
  }
  if (!token) return null

  async function handleLogout() {
    try {
      await auth.logout()
    } catch {
      // Clear the local session even when the API is unreachable.
    } finally {
      authStore.clear()
      router.replace('/login')
    }
  }

  const handleToggle = () => {
    if (window.innerWidth <= 1024) setIsMobileOpen((previous) => !previous)
    else setIsSidebarCollapsed((previous) => !previous)
  }

  return (
    <div className={`admin-shell ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <GlobalSearchModal key={isSearchOpen ? 'open' : 'closed'} isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <Sidebar
        isOpen={isMobileOpen}
        onToggle={handleToggle}
        onClose={() => setIsMobileOpen(false)}
        onLogout={handleLogout}
      />
      <div className="admin-main">
        <TopHeader onToggleSidebar={handleToggle} onOpenSearch={() => setIsSearchOpen(true)} />
        <main className="admin-content">{children}</main>
      </div>
    </div>
  )
}
