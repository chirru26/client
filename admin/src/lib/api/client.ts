import { authStore } from '../auth/authStore'
import type { RequestOptions, AuthResponse } from '@/types'

export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v2'

export async function request<T = any>(path: string, options: RequestOptions = {}, retry = true): Promise<T> {
  const token = authStore.get()
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      ...(options.body && !(options.body instanceof FormData) ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  })
  if ((response.status === 401 || response.status === 403) && retry && !path.startsWith('/auth/')) {
    try {
      const refreshed = await request<AuthResponse>('/auth/refresh', { method: 'POST' }, false)
      if (refreshed?.accessToken) {
        authStore.set(refreshed.accessToken)
        return request<T>(path, options, false)
      }
    } catch {
      authStore.clear()
    }
  }
  if (!response.ok) {
    let message = `Request failed (${response.status})`
    try {
      const body = (await response.json()) as { message?: string }
      message = body.message || message
    } catch {}
    throw new Error(message)
  }
  if (response.status === 204) return null as T
  return (await response.json()) as T
}
