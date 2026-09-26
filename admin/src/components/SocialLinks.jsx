import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  ExternalLink,
  Eye,
  EyeOff,
  Globe,
  Plus,
  Share2,
  Trash2,
} from 'lucide-react'
import { useState } from 'react'
import { adminApi } from '../api'

const PLATFORM_PRESETS = [
  { platform: 'github', label: 'GitHub', placeholder: 'https://github.com/heychirru', icon: 'github' },
  { platform: 'linkedin', label: 'LinkedIn', placeholder: 'https://linkedin.com/in/chiranjit-das', icon: 'linkedin' },
  { platform: 'twitter', label: 'Twitter / X', placeholder: 'https://x.com/heychirru', icon: 'twitter' },
  { platform: 'leetcode', label: 'LeetCode', placeholder: 'https://leetcode.com/u/heychirru', icon: 'code' },
  { platform: 'youtube', label: 'YouTube', placeholder: 'https://youtube.com/@heychirru', icon: 'youtube' },
  { platform: 'instagram', label: 'Instagram', placeholder: 'https://instagram.com/heychirru', icon: 'instagram' },
  { platform: 'email', label: 'Direct Email', placeholder: 'mailto:chiranjit809@gmail.com', icon: 'mail' },
  { platform: 'custom', label: 'Custom Link', placeholder: 'https://...', icon: 'globe' },
]

export default function SocialLinks() {
  const qc = useQueryClient()
  const q = useQuery({
    queryKey: ['social-links'],
    queryFn: adminApi.socialLinks,
  })

  const [formData, setFormData] = useState({
    platform: 'github',
    label: 'GitHub',
    url: '',
    icon: 'github',
    displayOrder: 0,
    visible: true,
  })
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const items = q.data || []

  const handlePlatformSelect = (pKey) => {
    const preset = PLATFORM_PRESETS.find((p) => p.platform === pKey)
    if (preset) {
      setFormData((prev) => ({
        ...prev,
        platform: preset.platform,
        label: preset.label,
        icon: preset.icon,
      }))
    }
  }

  async function handleAdd(e) {
    e.preventDefault()
    if (!formData.url) return
    setBusy(true)
    setError('')
    try {
      await adminApi.createSocialLink(formData)
      setFormData({
        platform: 'github',
        label: 'GitHub',
        url: '',
        icon: 'github',
        displayOrder: items.length + 1,
        visible: true,
      })
      await qc.invalidateQueries({ queryKey: ['social-links'] })
    } catch (err) {
      setError(err.message || 'Failed to save social link.')
    } finally {
      setBusy(false)
    }
  }

  async function handleDelete(id, label) {
    if (!window.confirm(`Remove ${label || 'this social link'}?`)) return
    try {
      await adminApi.deleteSocialLink(id)
      await qc.invalidateQueries({ queryKey: ['social-links'] })
    } catch (err) {
      alert(err.message || 'Could not delete link.')
    }
  }

  return (
    <>
      <div className="page-header">
        <div className="page-header-text">
          <h1>
            <Share2 size={26} color="var(--primary)" />
            <span>Social Links & Connect</span>
          </h1>
          <p>
            Dynamically configure public contact and social profile links across the portfolio.
          </p>
        </div>
      </div>

      <div className="grid-split">
        {/* Form Panel */}
        <div className="panel">
          <div className="panel-header">
            <h3 className="panel-title">
              <Plus size={18} color="var(--primary)" />
              <span>Add Social Link</span>
            </h3>
          </div>

          <form className="form" onSubmit={handleAdd}>
            {error && <div className="alert alert-error">{error}</div>}

            <div className="form-group">
              <label className="form-label">Select Platform</label>
              <select
                className="form-select"
                value={formData.platform}
                onChange={(e) => handlePlatformSelect(e.target.value)}
              >
                {PLATFORM_PRESETS.map((p) => (
                  <option key={p.platform} value={p.platform}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Display Label *</label>
              <input
                className="form-input"
                placeholder=" "
                value={formData.label}
                onChange={(e) => setFormData((prev) => ({ ...prev, label: e.target.value }))}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Destination URL *</label>
              <input
                className="form-input"
                type="url"
                placeholder={
                  PLATFORM_PRESETS.find((p) => p.platform === formData.platform)?.placeholder ||
                  'https://...'
                }
                value={formData.url}
                onChange={(e) => setFormData((prev) => ({ ...prev, url: e.target.value }))}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group">
                <label className="form-label">Display Order</label>
                <input
                  className="form-input"
                  type="number"
                  placeholder=" "
                  value={formData.displayOrder}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, displayOrder: parseInt(e.target.value) || 0 }))
                  }
                />
              </div>

              <div className="form-group">
                <label className="form-label">Public Visibility</label>
                <div style={{ display: 'flex', alignItems: 'center', height: '42px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '0.88rem', fontWeight: 500 }}>
                    <input
                      type="checkbox"
                      checked={formData.visible}
                      onChange={(e) => setFormData((prev) => ({ ...prev, visible: e.target.checked }))}
                    />
                    <span>Visible on Website</span>
                  </label>
                </div>
              </div>
            </div>

            <button type="submit" className="btn btn-primary" disabled={busy}>
              {busy ? (
                <>
                  <div className="spinner" style={{ width: 16, height: 16 }} />
                  <span>Saving…</span>
                </>
              ) : (
                <>
                  <Plus size={16} />
                  <span>Save Social Link</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Existing Links List */}
        <div className="panel">
          <div className="panel-header">
            <h3 className="panel-title">
              <Globe size={18} color="var(--primary)" />
              <span>Active Social Profiles ({items.length})</span>
            </h3>
          </div>

          {q.isLoading ? (
            <div className="loading-state">
              <div className="spinner" />
              <span>Loading links…</span>
            </div>
          ) : items.length === 0 ? (
            <div className="empty-state">
              <Share2 size={26} />
              <p>No social links created yet.</p>
            </div>
          ) : (
            <div className="data-list">
              {items.map((link) => (
                <div className="data-row" key={link.id} style={{ alignItems: 'center' }}>
                  <div className="data-row-main">
                    <div className="data-row-title" style={{ gap: 8 }}>
                      <span>{link.label || link.platform}</span>
                      <span className="badge badge-purple" style={{ textTransform: 'capitalize' }}>
                        {link.platform}
                      </span>
                      {link.visible ? (
                        <span className="badge badge-emerald">
                          <Eye size={11} style={{ marginRight: 4 }} /> Visible
                        </span>
                      ) : (
                        <span className="badge badge-slate">
                          <EyeOff size={11} style={{ marginRight: 4 }} /> Hidden
                        </span>
                      )}
                    </div>
                    <div className="data-row-subtitle" style={{ color: 'var(--text-tertiary)', fontSize: '0.78rem' }}>
                      {link.url}
                    </div>
                  </div>

                  <div className="data-row-actions">
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-secondary btn-sm btn-icon"
                      title="Test URL"
                    >
                      <ExternalLink size={14} />
                    </a>
                    <button
                      type="button"
                      className="btn btn-danger btn-sm btn-icon"
                      onClick={() => handleDelete(link.id, link.label)}
                      title="Remove link"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
