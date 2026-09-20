import { useState, useEffect, lazy, Suspense } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { portfolioApi } from './api'
import Navbar from './components/Navbar'
import ResponsiveMenu from './components/ResponsiveMenu'
import Footer from './components/Footer'
import Toast from './components/Toast'

// Code-split pages for optimized bundle size and fast LCP
const Home = lazy(() => import('./pages/Home'))
const AboutPage = lazy(() => import('./pages/AboutPage'))
const ProjectsPage = lazy(() => import('./pages/ProjectsPage'))
const ProjectDetailsPage = lazy(() => import('./pages/ProjectDetailsPage'))
const ExperiencePage = lazy(() => import('./pages/ExperiencePage'))
const ContactPage = lazy(() => import('./pages/ContactPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [toasts, setToasts] = useState([])
  const location = useLocation()

  // Theme state: default light with persistence
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('chirru_theme') || 'light'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('chirru_theme', theme)
  }, [theme])

  function toggleTheme() {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  // Toast notification manager
  function showToast(message, type = 'info') {
    const id = Date.now().toString(36) + Math.random().toString(36).substring(2, 6)
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 4000)
  }

  function dismissToast(id) {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  // Escape key listener for closing drawers
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        setMenuOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Public portfolio queries
  const profileQuery = useQuery({ queryKey: ['profile'], queryFn: portfolioApi.profile })
  const projectsQuery = useQuery({ queryKey: ['projects'], queryFn: portfolioApi.projects })
  const skillsQuery = useQuery({ queryKey: ['skills'], queryFn: portfolioApi.skills })
  const experienceQuery = useQuery({ queryKey: ['experience'], queryFn: portfolioApi.experience })
  const educationQuery = useQuery({ queryKey: ['education'], queryFn: portfolioApi.education })
  const socialLinksQuery = useQuery({ queryKey: ['socialLinks'], queryFn: portfolioApi.socialLinks })

  // Track page view telemetry & scroll management on route changes
  useEffect(() => {
    portfolioApi.trackEvent('page_view', { path: location.pathname })

    // If no hash in URL, scroll to top on navigation
    if (!location.hash) {
      window.scrollTo(0, 0)
    }
  }, [location.pathname, location.hash])

  const profile = profileQuery.data || {}
  const projects = projectsQuery.data || []
  const skills = skillsQuery.data || []
  const experience = experienceQuery.data || []
  const education = educationQuery.data || []
  const socialLinks = socialLinksQuery.data || []

  return (
    <div className="portfolio-app">
      {/* Background Ambience Elements */}
      <div className="ambient-background">
        <div className="ambient-glow-1" />
        <div className="ambient-glow-2" />
        <div className="ambient-glow-3" />
        <div className="ambient-grid" />
      </div>

      {/* Navigation */}
      <Navbar
        onMenu={() => setMenuOpen(true)}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      <ResponsiveMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        theme={theme}
        onToggleTheme={toggleTheme}
        socialLinks={socialLinks}
      />

      {/* Main Routed Content */}
      <Suspense
        fallback={
          <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
            Loading...
          </div>
        }
      >
        <Routes>
          <Route
            path="/"
            element={
              <Home
                profile={profile}
                projects={projects}
                skills={skills}
                experience={experience}
                education={education}
                socialLinks={socialLinks}
                projectsLoading={projectsQuery.isLoading}
                onShowToast={showToast}
              />
            }
          />
          <Route
            path="/about"
            element={<AboutPage profile={profile} skills={skills} />}
          />
          <Route
            path="/projects"
            element={<ProjectsPage projects={projects} loading={projectsQuery.isLoading} />}
          />
          <Route
            path="/projects/:slug"
            element={<ProjectDetailsPage projects={projects} loading={projectsQuery.isLoading} />}
          />
          <Route
            path="/experience"
            element={<ExperiencePage experience={experience} education={education} />}
          />
          <Route
            path="/contact"
            element={<ContactPage profile={profile} socialLinks={socialLinks} onShowToast={showToast} />}
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>

      {/* Footer */}
      <Footer profile={profile} socialLinks={socialLinks} />

      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  )
}

