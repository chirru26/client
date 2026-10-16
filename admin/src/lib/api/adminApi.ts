import { request } from './client'
import type { JsonObject } from '@/types'

export const adminApi = {
  dashboard: () => request('/admin/dashboard'),
  profile: () => request<JsonObject>('/admin/profile'),
  saveProfile: (body: JsonObject) => request('/admin/profile', { method: 'PUT', body: JSON.stringify(body) }),

  projects: () => request('/admin/projects'),
  createProject: (body: JsonObject) => request('/admin/projects', { method: 'POST', body: JSON.stringify(body) }),
  updateProject: (id: string | number, body: JsonObject) => request(`/admin/projects/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteProject: (id: string | number) => request<null>(`/admin/projects/${id}`, { method: 'DELETE' }),

  skills: () => request('/admin/skills'),
  createSkill: (body: JsonObject) => request('/admin/skills', { method: 'POST', body: JSON.stringify(body) }),
  updateSkill: (id: string | number, body: JsonObject) => request(`/admin/skills/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteSkill: (id: string | number) => request<null>(`/admin/skills/${id}`, { method: 'DELETE' }),

  experience: () => request('/admin/experience'),
  createExperience: (body: JsonObject) => request('/admin/experience', { method: 'POST', body: JSON.stringify(body) }),
  updateExperience: (id: string | number, body: JsonObject) => request(`/admin/experience/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteExperience: (id: string | number) => request<null>(`/admin/experience/${id}`, { method: 'DELETE' }),

  education: () => request('/admin/education'),
  createEducation: (body: JsonObject) => request('/admin/education', { method: 'POST', body: JSON.stringify(body) }),
  updateEducation: (id: string | number, body: JsonObject) => request(`/admin/education/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteEducation: (id: string | number) => request<null>(`/admin/education/${id}`, { method: 'DELETE' }),

  certifications: () => request('/admin/certifications'),
  createCertification: (body: JsonObject) => request('/admin/certifications', { method: 'POST', body: JSON.stringify(body) }),
  updateCertification: (id: string | number, body: JsonObject) => request(`/admin/certifications/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteCertification: (id: string | number) => request<null>(`/admin/certifications/${id}`, { method: 'DELETE' }),

  messages: () => request('/admin/messages'),
  markMessage: (id: string | number, read: boolean) => request(`/admin/messages/${id}/read`, { method: 'PATCH', body: JSON.stringify({ read }) }),
  deleteMessage: (id: string | number) => request<null>(`/admin/messages/${id}`, { method: 'DELETE' }),

  mediaList: (folder?: string) => request(`/admin/media${folder ? `?folder=${encodeURIComponent(folder)}` : ''}`),
  recordMedia: (body: JsonObject) => request('/admin/media/record', { method: 'POST', body: JSON.stringify(body) }),
  deleteMediaRecord: (publicId: string) => request<null>(`/admin/media/record?publicId=${encodeURIComponent(publicId)}`, { method: 'DELETE' }),
  uploadMedia: (folder: string, file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    return request(`/admin/media/${encodeURIComponent(folder)}`, {
      method: 'POST',
      body: formData,
    })
  },
  deleteMedia: (publicId: string, resourceType = 'image') => request<null>(`/admin/media?publicId=${encodeURIComponent(publicId)}&resourceType=${encodeURIComponent(resourceType)}`, { method: 'DELETE' }),

  analyticsDashboard: () => request('/admin/analytics/dashboard'),
  analytics: (days = 30) => request(`/admin/analytics?days=${days}`),
  auditLogs: (page = 0, size = 20) => request(`/admin/audit-logs?page=${page}&size=${size}&sort=createdAt,desc`),

  socialLinks: () => request('/admin/social-links'),
  createSocialLink: (body: JsonObject) => request('/admin/social-links', { method: 'POST', body: JSON.stringify(body) }),
  deleteSocialLink: (id: string | number) => request<null>(`/admin/social-links/${id}`, { method: 'DELETE' }),

  resumes: () => request('/admin/resumes'),
  createResume: (body: JsonObject) => request('/admin/resumes', { method: 'POST', body: JSON.stringify(body) }),
  deleteResume: (id: string | number) => request<null>(`/admin/resumes/${id}`, { method: 'DELETE' }),

  tags: () => request('/admin/tags'),
  createTag: (body: JsonObject) => request('/admin/tags', { method: 'POST', body: JSON.stringify(body) }),
  deleteTag: (id: string | number) => request<null>(`/admin/tags/${id}`, { method: 'DELETE' }),
  projectTags: (projectId: string | number) => request(`/admin/projects/${projectId}/tags`),
  saveProjectTags: (projectId: string | number, tagIds: Array<string | number>) => request(`/admin/projects/${projectId}/tags`, { method: 'PUT', body: JSON.stringify({ tagIds }) }),

  notifications: (unreadOnly = false) => request(`/admin/notifications?unreadOnly=${unreadOnly}`),
  createNotification: (body: JsonObject) => request('/admin/notifications', { method: 'POST', body: JSON.stringify(body) }),
  markNotificationRead: (id: string | number) => request(`/admin/notifications/${id}/read`, { method: 'PUT' }),

  search: (q: string) => request(`/admin/search?q=${encodeURIComponent(q)}`),
  settings: () => request('/admin/settings'),
  saveSetting: (key: string, value: unknown) => request(`/admin/settings/${key}`, { method: 'PUT', body: JSON.stringify({ value }) }),
}
