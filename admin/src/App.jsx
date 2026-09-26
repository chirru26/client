import { useEffect, useState } from 'react'
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import { auth, authStore } from './api'
import Analytics from './components/Analytics'
import AuditLogs from './components/AuditLogs'
import Certifications from './components/Certifications'
import Dashboard from './components/Dashboard'
import Education from './components/Education'
import Experience from './components/Experience'
import GlobalSearchModal from './components/GlobalSearchModal'
import Login from './components/Login'
import MediaManager from './components/MediaManager'
import Messages from './components/Messages'
import Notifications from './components/Notifications'
import Profile from './components/Profile'
import Projects from './components/Projects'
import Resumes from './components/Resumes'
import SeoSettings from './components/SeoSettings'
import Sidebar from './components/Sidebar'
import SiteSettings from './components/SiteSettings'
import Skills from './components/Skills'
import SocialLinks from './components/SocialLinks'
import TagsManager from './components/TagsManager'
import TopHeader from './components/TopHeader'

function ProtectedLayout() {
  const navigate = useNavigate()
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024) {
        setIsMobileOpen(false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setIsSearchOpen((prev) => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  async function handleLogout() {
    try {
      await auth.logout()
    } catch {
      // ignore network errors during logout
    }
    authStore.clear()
    navigate('/login', { replace: true })
  }

  const handleToggle = () => {
    if (window.innerWidth <= 1024) {
      setIsMobileOpen((prev) => !prev)
    } else {
      setIsSidebarCollapsed((prev) => !prev)
    }
  }

  const handleCloseMobile = () => {
    setIsMobileOpen(false)
  }

  return (
    <div className={`admin-shell ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      <Sidebar
        isOpen={isMobileOpen}
        onToggle={handleToggle}
        onClose={handleCloseMobile}
        onLogout={handleLogout}
      />

      <div className="admin-main">
        <TopHeader
          onToggleSidebar={handleToggle}
          onOpenSearch={() => setIsSearchOpen(true)}
        />

        <main className="admin-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/skills" element={<Skills />} />
            <Route path="/experience" element={<Experience />} />
            <Route path="/education" element={<Education />} />
            <Route path="/certifications" element={<Certifications />} />
            <Route path="/tags" element={<TagsManager />} />
            <Route path="/media" element={<MediaManager />} />
            <Route path="/resumes" element={<Resumes />} />
            <Route path="/social-links" element={<SocialLinks />} />
            <Route path="/seo" element={<SeoSettings />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/audit-logs" element={<AuditLogs />} />
            <Route path="/settings" element={<SiteSettings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default function App() {
  const [token, setToken] = useState(() => authStore.get())

  useEffect(() => {
    const handleAuthChange = () => {
      setToken(authStore.get())
    }
    window.addEventListener('auth-change', handleAuthChange)
    window.addEventListener('storage', handleAuthChange)
    return () => {
      window.removeEventListener('auth-change', handleAuthChange)
      window.removeEventListener('storage', handleAuthChange)
    }
  }, [])

  return (
    <Routes>
      <Route
        path="/login"
        element={token ? <Navigate to="/" replace /> : <Login />}
      />
      <Route
        path="/*"
        element={token ? <ProtectedLayout /> : <Navigate to="/login" replace />}
      />
    </Routes>
  )
}
