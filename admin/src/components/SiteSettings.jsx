import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Check,
  Save,
  Settings,
  Sliders,
  Sparkles,
} from 'lucide-react'
import { useState } from 'react'
import { adminApi } from '../api'

export default function SiteSettings() {
  const qc = useQueryClient()
  const q = useQuery({
    queryKey: ['site-settings'],
    queryFn: adminApi.settings,
  })

  const [settingsState, setSettingsState] = useState({})
  const [busyKey, setBusyKey] = useState(null)
  const [successKey, setSuccessKey] = useState(null)

  const items = q.data || [
    { key: 'site_title', label: 'Website Brand Title', value: 'Chiranjit Das · Portfolio', description: 'Header and browser tab title.' },
    { key: 'hiring_status', label: 'Availability / Hiring Banner', value: 'Open for Opportunities', description: 'Status pill displayed in the hero section.' },
    { key: 'contact_forwarding_email', label: 'Forward Inquiries To', value: 'chiranjit809@gmail.com', description: 'Destination address for visitor contact submissions.' },
    { key: 'google_analytics_id', label: 'Google Analytics Tag ID', value: '', description: 'G-XXXXXXXXXX measurement tag.' },
  ]

  const handleChange = (key, val) => {
    setSettingsState((prev) => ({ ...prev, [key]: val }))
  }

  async function handleSaveKey(key) {
    const val = settingsState[key]
    setBusyKey(key)
    try {
      await adminApi.saveSetting(key, val)
      setSuccessKey(key)
      setTimeout(() => setSuccessKey(null), 2500)
      await qc.invalidateQueries({ queryKey: ['site-settings'] })
    } catch (err) {
      alert(err.message || 'Failed to update setting.')
    } finally {
      setBusyKey(null)
    }
  }

  return (
    <>
      <div className="page-header">
        <div className="page-header-text">
          <h1>
            <Settings size={26} color="var(--primary)" />
            <span>Site & CMS Settings</span>
          </h1>
          <p>
            Configure portfolio runtime flags, branding, contact routing, and analytics keys.
          </p>
        </div>
      </div>

      <div className="panel">
        <div className="panel-header">
          <h3 className="panel-title">
            <Sliders size={18} color="var(--primary)" />
            <span>Configuration Parameters</span>
          </h3>
        </div>

        <div style={{ padding: '12px 20px' }}>
          {items.map((item) => {
            const currentVal = settingsState[item.key] !== undefined ? settingsState[item.key] : item.value || ''
            return (
              <div
                key={item.key}
                style={{
                  padding: '16px 0',
                  borderBottom: '1px solid var(--border-light)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: 20,
                  flexWrap: 'wrap',
                }}
              >
                <div style={{ maxWidth: 360 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.92rem', color: 'var(--text-primary)' }}>
                    {item.label || item.key}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 2 }}>
                    {item.description || `Key: ${item.key}`}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 10, flex: 1, minWidth: 280, justifyContent: 'flex-end' }}>
                  <input
                    className="form-input"
                    value={currentVal}
                    onChange={(e) => handleChange(item.key, e.target.value)}
                    style={{ maxWidth: 360 }}
                  />
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    disabled={busyKey === item.key}
                    onClick={() => handleSaveKey(item.key)}
                  >
                    {busyKey === item.key ? (
                      <div className="spinner" style={{ width: 14, height: 14 }} />
                    ) : successKey === item.key ? (
                      <Check size={14} />
                    ) : (
                      <Save size={14} />
                    )}
                    <span>{successKey === item.key ? 'Saved' : 'Save'}</span>
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}
