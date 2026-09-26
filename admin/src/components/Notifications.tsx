import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Bell,
  Check,
  Clock,
  ExternalLink,
  Mail,
  Plus,
  Shield,
  Sparkles,
  Trash2,
} from 'lucide-react'
import { useState } from 'react'
import { adminApi } from '../api'

export default function Notifications() {
  const qc = useQueryClient()
  const [unreadOnly, setUnreadOnly] = useState(false)

  const q = useQuery({
    queryKey: ['notifications', unreadOnly],
    queryFn: () => adminApi.notifications(unreadOnly),
  })

  const [formData, setFormData] = useState({
    type: 'SYSTEM',
    title: '',
    body: '',
    link: '',
  })
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const items = q.data || []

  async function handleMarkRead(id) {
    try {
      await adminApi.markNotificationRead(id)
      await qc.invalidateQueries({ queryKey: ['notifications'] })
    } catch (err) {
      alert(err.message || 'Could not update notification.')
    }
  }

  async function handleCreate(e) {
    e.preventDefault()
    if (!formData.title || !formData.body) return
    setBusy(true)
    setError('')
    try {
      await adminApi.createNotification(formData)
      setFormData({ type: 'SYSTEM', title: '', body: '', link: '' })
      await qc.invalidateQueries({ queryKey: ['notifications'] })
    } catch (err) {
      setError(err.message || 'Failed to dispatch notification.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <div className="page-header">
        <div className="page-header-text">
          <h1>
            <Bell size={26} color="var(--primary)" />
            <span>Notifications Center</span>
          </h1>
          <p>
            Review system alerts, contact inquiries, and security events.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button
            type="button"
            className={`btn btn-sm ${!unreadOnly ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setUnreadOnly(false)}
          >
            All Alerts
          </button>
          <button
            type="button"
            className={`btn btn-sm ${unreadOnly ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setUnreadOnly(true)}
          >
            Unread Only
          </button>
        </div>
      </div>

      <div className="grid-split">
        {/* Post Notification */}
        <div className="panel">
          <div className="panel-header">
            <h3 className="panel-title">
              <Plus size={18} color="var(--primary)" />
              <span>Broadcast System Notification</span>
            </h3>
          </div>

          <form className="form" onSubmit={handleCreate}>
            {error && <div className="alert alert-error">{error}</div>}

            <div className="form-group">
              <label className="form-label">Alert Category</label>
              <select
                className="form-select"
                value={formData.type}
                onChange={(e) => setFormData((prev) => ({ ...prev, type: e.target.value }))}
              >
                <option value="SYSTEM">System Alert</option>
                <option value="SECURITY">Security Advisory</option>
                <option value="DEPLOYMENT">Deployment Update</option>
                <option value="MESSAGE">Contact Message</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Alert Headline *</label>
              <input
                className="form-input"
                placeholder="e.g. Portfolio v2 deployed to production"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Message Details *</label>
              <textarea
                className="form-textarea"
                rows={3}
                placeholder="Detailed notification body..."
                value={formData.body}
                onChange={(e) => setFormData((prev) => ({ ...prev, body: e.target.value }))}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Action Link (Optional)</label>
              <input
                className="form-input"
                placeholder="/projects or https://..."
                value={formData.link}
                onChange={(e) => setFormData((prev) => ({ ...prev, link: e.target.value }))}
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={busy}>
              {busy ? (
                <>
                  <div className="spinner" style={{ width: 16, height: 16 }} />
                  <span>Dispatching…</span>
                </>
              ) : (
                <>
                  <Plus size={16} />
                  <span>Send Notification</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Notifications List */}
        <div className="panel">
          <div className="panel-header">
            <h3 className="panel-title">
              <Sparkles size={18} color="var(--primary)" />
              <span>Inbox ({items.length})</span>
            </h3>
          </div>

          {q.isLoading ? (
            <div className="loading-state">
              <div className="spinner" />
              <span>Loading notifications…</span>
            </div>
          ) : items.length === 0 ? (
            <div className="empty-state">
              <Bell size={26} />
              <p>No notifications found in this view.</p>
            </div>
          ) : (
            <div className="data-list">
              {items.map((item) => (
                <div
                  className="data-row"
                  key={item.id}
                  style={{
                    alignItems: 'flex-start',
                    background: item.read ? 'transparent' : 'rgba(16, 185, 129, 0.04)',
                  }}
                >
                  <div
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 8,
                      background: item.type === 'SECURITY' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                      color: item.type === 'SECURITY' ? '#ef4444' : 'var(--primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: 2,
                    }}
                  >
                    {item.type === 'SECURITY' ? <Shield size={18} /> : <Bell size={18} />}
                  </div>

                  <div className="data-row-main">
                    <div className="data-row-title" style={{ gap: 8 }}>
                      <span style={{ fontWeight: item.read ? 500 : 700 }}>{item.title}</span>
                      <span className="badge badge-purple">{item.type || 'SYSTEM'}</span>
                      {!item.read && <span className="badge badge-emerald">New</span>}
                    </div>
                    <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginTop: 4 }}>
                      {item.body}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: 6 }}>
                      <Clock size={12} />
                      <span>{item.createdAt ? new Date(item.createdAt).toLocaleString() : 'Recent'}</span>
                    </div>
                  </div>

                  <div className="data-row-actions">
                    {!item.read && (
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleMarkRead(item.id)}
                        style={{ fontSize: '0.78rem' }}
                      >
                        <Check size={13} /> Mark Read
                      </button>
                    )}
                    {item.link && (
                      <a
                        href={item.link}
                        className="btn btn-secondary btn-sm btn-icon"
                        title="Open link"
                      >
                        <ExternalLink size={13} />
                      </a>
                    )}
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
