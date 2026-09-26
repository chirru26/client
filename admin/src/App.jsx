'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { auth, authStore } from './api'
import GlobalSearchModal from './components/GlobalSearchModal'
import Sidebar from './components/Sidebar'
import TopHeader from './components/TopHeader'

export default function App({ children }) {
  const pathname = usePathname()
  const router = useRouter()
  const [token, setToken] = useState(() => authStore.get())
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  useEffect(() => {
    const handleAuthChange = () => setToken(authStore.get())
    window.addEventListener('auth-change', handleAuthChange)
    return () => window.removeEventListener('auth-change', handleAuthChange)
  }, [])

  useEffect(() => {
    if (pathname === '/login') return
    if (!token) router.replace('/login')
  }, [pathname, token, router])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024) setIsMobileOpen(false)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setIsSearchOpen((prev) => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  if (pathname === '/login') return children
  if (!token) return null

  async function handleLogout() {
    try {
      await auth.logout()
    } catch {
      // Ignore network errors during logout.
    }
    authStore.clear()
    router.replace('/login')
  }

  const handleToggle = () => {
    if (window.innerWidth <= 1024) setIsMobileOpen((prev) => !prev)
    else setIsSidebarCollapsed((prev) => !prev)
  }

  return (
    <div className={`admin-shell ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <GlobalSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
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
