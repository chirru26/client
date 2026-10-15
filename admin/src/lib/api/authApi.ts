import { request } from './client'
import type { AuthResponse } from '@/types'

export const auth = {
  login: (email: string, password: string) =>
    request<AuthResponse>('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }, false),
  refresh: () =>
    request<AuthResponse>('/auth/refresh', { method: 'POST' }, false),
  logout: () =>
    request<null>('/auth/logout', { method: 'POST' }, false),
}
