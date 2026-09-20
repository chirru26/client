const API_URL = (import.meta.env.VITE_API_URL)

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(options.headers || {}),
    },
  })

  if (!response.ok) {
    let message = `Request failed (${response.status})`
    try {
      const body = await response.json()
      message = body.message || message
    } catch {
      // Keep the default status message when the response is not JSON.
    }
    throw new Error(message)
  }

  if (response.status === 204) return null
  return response.json()
}

// Generate or retrieve persistent visitor hash for anonymous analytics
function getVisitorHash() {
  let hash = localStorage.getItem('chirru_visitor_id')
  if (!hash) {
    hash = 'v_' + Math.random().toString(36).substring(2, 11) + Date.now().toString(36)
    localStorage.setItem('chirru_visitor_id', hash)
  }
  return hash
}

// Detect basic device type
function getDeviceType() {
  const width = window.innerWidth
  if (width < 768) return 'mobile'
  if (width < 1024) return 'tablet'
  return 'desktop'
}

export const portfolioApi = {
  // Public core profile & sections
  profile: () => request('/portfolio/profile'),
  projects: () => request('/portfolio/projects'),
  featuredProjects: () => request('/portfolio/projects?featured=true'),
  project: (slug) => request(`/portfolio/projects/${encodeURIComponent(slug)}`),
  skills: (category) => request(`/portfolio/skills${category ? `?category=${encodeURIComponent(category)}` : ''}`),
  experience: () => request('/portfolio/experience'),
  education: () => request('/portfolio/education'),
  certifications: () => request('/portfolio/certifications'),
  contact: (body) => request('/portfolio/contact', { method: 'POST', body: JSON.stringify(body) }),

  // Enhanced feature endpoints
  socialLinks: () => request('/portfolio/social-links'),
  seo: (page = 'home') => request(`/portfolio/seo?page=${encodeURIComponent(page)}`),
  projectTags: (projectId) => request(`/portfolio/project/${projectId}/tags`),
  search: (q) => request(`/portfolio/search?q=${encodeURIComponent(q)}`),

  // Resume URL (redirects to active Cloudinary file)
  resumeDownloadUrl: `${API_URL}/portfolio/resume`,

  // Telemetry & Analytics event recording
  trackEvent: async (eventType, extra = {}) => {
    try {
      await fetch(`${API_URL}/portfolio/analytics/event`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType,
          path: extra.path || window.location.pathname,
          projectId: extra.projectId || null,
          referrer: document.referrer || null,
          device: getDeviceType(),
          visitorHash: getVisitorHash(),
          ...extra,
        }),
      })
    } catch {
      // Analytics failures are non-critical and should not disrupt user experience
    }
  },
}
