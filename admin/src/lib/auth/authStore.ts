const TOKEN_KEY = 'chirru_admin_access_token'

function dispatchAuthEvent(eventName: 'auth-change' | 'auth-expired'): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(eventName))
  }
}

export const authStore = {
  get(): string | null {
    if (typeof window === 'undefined') return null
    try {
      return window.sessionStorage.getItem(TOKEN_KEY)
    } catch {
      return null
    }
  },

  set(token: string): void {
    if (typeof window !== 'undefined') {
      try {
        window.sessionStorage.setItem(TOKEN_KEY, token)
      } catch {
        // The in-memory auth-change event still allows the UI to update.
      }
    }
    dispatchAuthEvent('auth-change')
  },

  clear(): void {
    if (typeof window !== 'undefined') {
      try {
        window.sessionStorage.removeItem(TOKEN_KEY)
      } catch {
        // Continue clearing the in-memory UI state even if storage is unavailable.
      }
    }
    dispatchAuthEvent('auth-change')
  },
}
