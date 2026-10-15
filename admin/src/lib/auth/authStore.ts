const TOKEN_KEY = 'chirru_admin_access_token'

export const authStore = {
  get(): string | null {
    try {
      return sessionStorage.getItem(TOKEN_KEY)
    } catch {
      return null
    }
  },
  set(token: string): void {
    try {
      sessionStorage.setItem(TOKEN_KEY, token)
    } catch {}
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('auth-change'))
    }
  },
  clear(): void {
    try {
      sessionStorage.removeItem(TOKEN_KEY)
    } catch {}
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('auth-change'))
    }
  },
}
