import { authStore } from '../auth/authStore'
import type { RequestOptions, AuthResponse } from '@/types'

const configuredApiUrl = process.env.NEXT_PUBLIC_API_URL?.trim()
export const API_URL = (configuredApiUrl || 'http://localhost:8080/api/v2').replace(/\/$/, '')

let refreshPromise: Promise<string | null> | null = null

function isAuthEndpoint(path: string): boolean {
  return path.startsWith('/auth/')
}

function notifySessionExpired(): void {
  authStore.clear()
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('auth-expired'))
  }
}

async function refreshAccessToken(): Promise<string | null> {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      try {
        const response = await fetch(`${API_URL}/auth/refresh`, {
          method: 'POST',
          credentials: 'include',
          headers: { Accept: 'application/json' },
        })

        if (!response.ok) return null

        const data = (await response.json()) as AuthResponse
        if (!data?.accessToken) return null

        authStore.set(data.accessToken)
        return data.accessToken
      } catch {
        return null
      } finally {
        refreshPromise = null
      }
    })()
  }

  return refreshPromise
}

async function readErrorMessage(response: Response): Promise<string> {
  let message = `Request failed (${response.status})`
  try {
    const body = (await response.json()) as { message?: string; error?: string }
    message = body.message || body.error || message
  } catch {
    // Some responses (for example 502 from a proxy) do not contain JSON.
  }
  return message
}

export async function request<T = unknown>(
  path: string,
  options: RequestOptions = {},
  retry = true,
): Promise<T> {
  const send = (token: string | null) => {
    const headers = new Headers(options.headers)
    if (options.body && !(options.body instanceof FormData) && !headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json')
    }
    headers.set('Accept', 'application/json')
    if (token) headers.set('Authorization', `Bearer ${token}`)
    else headers.delete('Authorization')

    return fetch(`${API_URL}${path}`, {
      ...options,
      credentials: 'include',
      headers,
    })
  }

  let response = await send(authStore.get())

  // A 403 means the server understood the request but denied permission.
  // Refreshing on 403 can hide authorization errors and cause needless retries.
  if (response.status === 401 && retry && !isAuthEndpoint(path)) {
    const refreshedToken = await refreshAccessToken()
    if (refreshedToken) {
      response = await send(refreshedToken)
    } else {
      notifySessionExpired()
    }
  }

  if (response.status === 401 && !isAuthEndpoint(path)) {
    notifySessionExpired()
  }

  if (!response.ok) {
    throw new Error(await readErrorMessage(response))
  }

  if (response.status === 204) return null as T
  if (response.status === 205) return null as T

  const contentType = response.headers.get('content-type') || ''
  if (!contentType.includes('application/json')) return null as T
  return (await response.json()) as T
}
