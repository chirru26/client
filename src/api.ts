import type { ContactFormData, ContactResponse } from '@/types/api'

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL ||
  'https://api.chirru.in/api/v2'
).replace(/\/$/, '')

interface RequestOptions extends RequestInit {
  body?: BodyInit | null
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
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
      const body = (await response.json()) as { message?: string }
      message = body.message || message
    } catch {
      // Keep the default status message.
    }
    throw new Error(message)
  }

  if (response.status === 204) return null as T
  return (await response.json()) as T
}

function getVisitorHash(): string {
  let hash = localStorage.getItem('chirru_visitor_id')
  if (!hash) {
    hash = `v_${Math.random().toString(36).substring(2, 11)}${Date.now().toString(36)}`
    localStorage.setItem('chirru_visitor_id', hash)
  }
  return hash
}

function getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
  const width = window.innerWidth
  if (width < 768) return 'mobile'
  if (width < 1024) return 'tablet'
  return 'desktop'
}

export interface AnalyticsEvent {
  eventType: string
  path?: string
  projectId?: string | number | null
  referrer?: string | null
  device?: string
  visitorHash?: string
  source?: string
  [key: string]: unknown
}

export const portfolioApi = {
  profile: () => request('/portfolio/profile'),
  projects: () => request('/portfolio/projects'),
  featuredProjects: () => request('/portfolio/projects?featured=true'),
  project: (slug: string) => request(`/portfolio/projects/${encodeURIComponent(slug)}`),
  skills: (category?: string) =>
    request(`/portfolio/skills${category ? `?category=${encodeURIComponent(category)}` : ''}`),
  experience: () => request('/portfolio/experience'),
  education: () => request('/portfolio/education'),
  certifications: () => request('/portfolio/certifications'),
  contact: (body: ContactFormData) =>
    request<ContactResponse>('/portfolio/contact', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  socialLinks: () => request('/portfolio/social-links'),
  seo: (page = 'home') =>
    request(`/portfolio/seo?page=${encodeURIComponent(page)}`),
  projectTags: (projectId: string | number) =>
    request(`/portfolio/project/${encodeURIComponent(String(projectId))}/tags`),
  search: (q: string) =>
    request(`/portfolio/search?q=${encodeURIComponent(q)}`),
  resumeDownloadUrl: `${API_URL}/portfolio/resume`,
  trackEvent: async (eventType: string, extra: Omit<AnalyticsEvent, 'eventType'> = {}) => {
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
      // Analytics is non-critical.
    }
  },
}
