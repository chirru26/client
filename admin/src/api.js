const API_URL = (import.meta.env.VITE_API_URL)
const TOKEN_KEY = 'chirru_admin_access_token'

try { localStorage.removeItem(TOKEN_KEY) } catch { }

export const authStore = {
  get: () => {
    try {
      return sessionStorage.getItem(TOKEN_KEY)
    } catch {
      return null
    }
  },
  set: (token) => {
    try {
      sessionStorage.setItem(TOKEN_KEY, token)
    } catch { }
    window.dispatchEvent(new Event('auth-change'))
  },
  clear: () => {
    try {
      sessionStorage.removeItem(TOKEN_KEY)
    } catch { }
    window.dispatchEvent(new Event('auth-change'))
  },
}

async function request(path, options = {}, retry = true) {
  const token = authStore.get()
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  })
  if (response.status === 401 && retry && !path.startsWith('/auth/')) {
    try {
      const refreshed = await request('/auth/refresh', { method: 'POST' }, false)
      if (refreshed?.accessToken) {
        authStore.set(refreshed.accessToken)
        return request(path, options, false)
      }
    } catch {
      authStore.clear()
    }
  }
  if (!response.ok) {
    let message = `Request failed (${response.status})`
    try {
      const body = await response.json()
      message = body.message || message
    } catch { }
    throw new Error(message)
  }
  if (response.status === 204) return null
  return response.json()
}

export const auth = {
  login: (email, password) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }, false),
  refresh: () => request('/auth/refresh', { method: 'POST' }, false),
  logout: () => request('/auth/logout', { method: 'POST' }, false),
}

export const adminApi = {
  // Core Portfolio & CMS
  dashboard: () => request('/admin/dashboard'),
  profile: () => request('/admin/profile'),
  saveProfile: (body) => request('/admin/profile', { method: 'PUT', body: JSON.stringify(body) }),

  projects: () => request('/admin/projects'),
  createProject: (body) => request('/admin/projects', { method: 'POST', body: JSON.stringify(body) }),
  updateProject: (id, body) => request(`/admin/projects/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteProject: (id) => request(`/admin/projects/${id}`, { method: 'DELETE' }),

  skills: () => request('/admin/skills'),
  createSkill: (body) => request('/admin/skills', { method: 'POST', body: JSON.stringify(body) }),
  updateSkill: (id, body) => request(`/admin/skills/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteSkill: (id) => request(`/admin/skills/${id}`, { method: 'DELETE' }),

  experience: () => request('/admin/experience'),
  createExperience: (body) => request('/admin/experience', { method: 'POST', body: JSON.stringify(body) }),
  updateExperience: (id, body) => request(`/admin/experience/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteExperience: (id) => request(`/admin/experience/${id}`, { method: 'DELETE' }),

  education: () => request('/admin/education'),
  createEducation: (body) => request('/admin/education', { method: 'POST', body: JSON.stringify(body) }),
  updateEducation: (id, body) => request(`/admin/education/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteEducation: (id) => request(`/admin/education/${id}`, { method: 'DELETE' }),

  certifications: () => request('/admin/certifications'),
  createCertification: (body) => request('/admin/certifications', { method: 'POST', body: JSON.stringify(body) }),
  updateCertification: (id, body) => request(`/admin/certifications/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteCertification: (id) => request(`/admin/certifications/${id}`, { method: 'DELETE' }),

  messages: () => request('/admin/messages'),
  markMessage: (id, read) => request(`/admin/messages/${id}/read`, { method: 'PATCH', body: JSON.stringify({ read }) }),
  deleteMessage: (id) => request(`/admin/messages/${id}`, { method: 'DELETE' }),

  // Media Management
  mediaList: (folder) => request(`/admin/media${folder ? `?folder=${encodeURIComponent(folder)}` : ''}`),
  recordMedia: (body) => request('/admin/media/record', { method: 'POST', body: JSON.stringify(body) }),
  deleteMediaRecord: (publicId) => request(`/admin/media/record?publicId=${encodeURIComponent(publicId)}`, { method: 'DELETE' }),
  uploadMedia: async (folder, file) => {
    const formData = new FormData()
    formData.append('file', file)
    const token = authStore.get()
    const response = await fetch(`${API_URL}/admin/media/${folder}`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    })
    if (!response.ok) {
      let message = 'Upload failed'
      try {
        const body = await response.json()
        message = body.message || message
      } catch { }
      throw new Error(message)
    }
    return response.json()
  },
  deleteMedia: (publicId, resourceType = 'image') =>
    request(`/admin/media?publicId=${encodeURIComponent(publicId)}&resourceType=${encodeURIComponent(resourceType)}`, {
      method: 'DELETE',
    }),

  // Analytics Hub
  analyticsDashboard: () => request('/admin/analytics/dashboard'),
  analytics: (days = 30) => request(`/admin/analytics?days=${days}`),

  // Audit Logs Trail
  auditLogs: (page = 0, size = 20) => request(`/admin/audit-logs?page=${page}&size=${size}&sort=createdAt,desc`),

  // Social Links
  socialLinks: () => request('/admin/social-links'),
  createSocialLink: (body) => request('/admin/social-links', { method: 'POST', body: JSON.stringify(body) }),
  deleteSocialLink: (id) => request(`/admin/social-links/${id}`, { method: 'DELETE' }),

  // SEO & Metadata Management
  seo: (page) => request(`/admin/seo/${page}`),
  saveSeo: (page, body) => request(`/admin/seo/${page}`, { method: 'PUT', body: JSON.stringify(body) }),

  // Resumes Versioning
  resumes: () => request('/admin/resumes'),
  createResume: (body) => request('/admin/resumes', { method: 'POST', body: JSON.stringify(body) }),
  deleteResume: (id) => request(`/admin/resumes/${id}`, { method: 'DELETE' }),

  // Project Tags
  tags: () => request('/admin/tags'),
  createTag: (body) => request('/admin/tags', { method: 'POST', body: JSON.stringify(body) }),
  deleteTag: (id) => request(`/admin/tags/${id}`, { method: 'DELETE' }),
  projectTags: (projectId) => request(`/admin/projects/${projectId}/tags`),
  saveProjectTags: (projectId, tagIds) =>
    request(`/admin/projects/${projectId}/tags`, { method: 'PUT', body: JSON.stringify({ tagIds }) }),

  // Admin Notifications
  notifications: (unreadOnly = false) => request(`/admin/notifications?unreadOnly=${unreadOnly}`),
  createNotification: (body) => request('/admin/notifications', { method: 'POST', body: JSON.stringify(body) }),
  markNotificationRead: (id) => request(`/admin/notifications/${id}/read`, { method: 'PUT' }),

  // Global Search
  search: (q) => request(`/admin/search?q=${encodeURIComponent(q)}`),

  // Settings
  settings: () => request('/admin/settings'),
  saveSetting: (key, value) => request(`/admin/settings/${key}`, { method: 'PUT', body: JSON.stringify({ value }) }),
}
