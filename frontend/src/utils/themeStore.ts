import { useSyncExternalStore } from 'react'

const THEME_KEY = 'chirru_theme'

export type Theme = 'light' | 'dark'
type Listener = () => void

const listeners = new Set<Listener>()

export function getTheme(): Theme {
  if (typeof window === 'undefined') return 'dark'
  try {
    const stored = localStorage.getItem(THEME_KEY)
    if (stored === 'light' || stored === 'dark') return stored
    const attr = document.documentElement.getAttribute('data-theme')
    if (attr === 'light' || attr === 'dark') return attr
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  } catch {
    return 'dark'
  }
}

export function setTheme(next: Theme): void {
  try {
    localStorage.setItem(THEME_KEY, next)
    document.documentElement.setAttribute('data-theme', next)
  } catch {}
  listeners.forEach((listener) => listener())
}

export function toggleTheme(): void {
  const current = getTheme()
  setTheme(current === 'dark' ? 'light' : 'dark')
}

export function subscribeTheme(listener: Listener): () => void {
  listeners.add(listener)
  const onStorage = (e: StorageEvent) => {
    if (e.key === THEME_KEY) {
      if (e.newValue === 'light' || e.newValue === 'dark') {
        document.documentElement.setAttribute('data-theme', e.newValue)
      }
      listener()
    }
  }
  if (typeof window !== 'undefined') {
    window.addEventListener('storage', onStorage)
  }
  return () => {
    listeners.delete(listener)
    if (typeof window !== 'undefined') {
      window.removeEventListener('storage', onStorage)
    }
  }
}

export function useTheme() {
  const theme = useSyncExternalStore(subscribeTheme, getTheme, () => 'dark' as Theme)
  return { theme, toggleTheme }
}

const emptySubscribe = () => () => {}
export function useIsMounted(): boolean {
  return useSyncExternalStore(emptySubscribe, () => true, () => false)
}
