'use client'

import {
  AlertCircle,
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Terminal,
} from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { auth } from '@/lib/api'
import { authStore } from '@/lib/auth'

export default function Login() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setBusy(true)
    setError('')
    try {
      const data = await auth.login(email.trim(), password)
      if (data?.accessToken) {
        authStore.set(data.accessToken)
      }
      router.replace('/')
    } catch (e: any) {
      setError(e.message || 'Invalid email or password. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="login-page linen-pattern">
      <header className="login-topbar">
        <div className="login-topbar-brand">
          <div className="login-topbar-icon">
            <Terminal size={14} />
          </div>
          <span className="login-topbar-title">CHIRRU WORKBENCH</span>
          <span className="login-topbar-version">v2.4.0</span>
        </div>
      </header>

      <main className="login-main-container">
        <div className="login-card-container">
          <form className="login-card" onSubmit={handleSubmit}>
            <div className="login-card-accent-bar" />

            <div className="login-card-header">
              <div className="login-lock-badge">
                <Lock size={20} />
              </div>
              <h1 className="login-title">CHIRRU</h1>
              <p className="login-subtitle">
                Disciplined Portfolio Workbench & Engine
              </p>
            </div>

            {error && (
              <div className="login-alert-error">
                <AlertCircle size={16} className="login-alert-icon" />
                <span>{error}</span>
              </div>
            )}

            <div className="floating-field-group">
              <label className="floating-field-label" htmlFor="login-email">
                <Mail size={14} className="floating-field-icon" />
                <span>Email Address</span>
              </label>
              <input
                id="login-email"
                className="floating-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Enter Email"
                required
                autoComplete="email"
              />
            </div>

            <div className="floating-field-group">
              <label className="floating-field-label" htmlFor="login-password">
                <Lock size={14} className="floating-field-icon" />
                <span>Password</span>
              </label>
              <div className="floating-input-wrap">
                <input
                  id="login-password"
                  className="floating-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter Password"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="floating-eye-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" className="login-submit-btn" disabled={busy}>
              {busy ? (
                <>
                  <div className="spinner" />
                  <span>Signing In…</span>
                </>
              ) : (
                <>
                  <span>Sign In to Admin</span>
                  <ArrowRight size={16} className="login-submit-arrow" />
                </>
              )}
            </button>
          </form>
        </div>
      </main>

      <footer className="login-footer">
        © {new Date().getFullYear()} Chiranjit Das · All rights reserved.
      </footer>
    </div>
  )
}
