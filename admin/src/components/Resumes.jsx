import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Download, FileCheck, FileText, Plus, Star, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { adminApi } from '../api'
import { getImageUrl } from '../utils/imageUtils'
import CloudinaryUpload from './CloudinaryUpload'

export default function Resumes() {
  const qc = useQueryClient()
  const q = useQuery({
    queryKey: ['resumes'],
    queryFn: adminApi.resumes,
  })

  const [formData, setFormData] = useState({
    title: 'Chiranjit Das - Software Engineer Resume',
    versionLabel: 'v2026.1',
    url: '',
    publicId: '',
    active: true,
  })

  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const items = q.data || []

  async function handleAdd(e) {
    e.preventDefault()
    if (!formData.url) {
      setError('Please upload a PDF resume file.')
      return
    }
    setBusy(true)
    setError('')
    try {
      await adminApi.createResume(formData)
      setFormData({
        title: 'Chiranjit Das - Software Engineer Resume',
        versionLabel: `v${new Date().getFullYear()}.${items.length + 1}`,
        url: '',
        publicId: '',
        active: false,
      })
      await qc.invalidateQueries({ queryKey: ['resumes'] })
      await qc.invalidateQueries({ queryKey: ['profile'] })
    } catch (err) {
      setError(err.message || 'Failed to save resume version.')
    } finally {
      setBusy(false)
    }
  }

  async function handleSetActive(item) {
    try {
      await adminApi.createResume({
        ...item,
        active: true,
      })
      await qc.invalidateQueries({ queryKey: ['resumes'] })
      await qc.invalidateQueries({ queryKey: ['profile'] })
    } catch (err) {
      alert(err.message || 'Failed to activate resume.')
    }
  }

  async function handleDelete(id, label) {
    if (!window.confirm(`Delete resume version ${label || ''}?`)) return
    try {
      await adminApi.deleteResume(id)
      await qc.invalidateQueries({ queryKey: ['resumes'] })
    } catch (err) {
      alert(err.message || 'Could not delete resume.')
    }
  }

  return (
    <>
      <div className="page-header">
        <div className="page-header-text">
          <h1>
            <FileText size={26} color="var(--primary)" />
            <span>Resume Versions & Downloads</span>
          </h1>
          <p>
            Store multiple CV editions on Cloudinary and designate the active document for public download tracking.
          </p>
        </div>
      </div>

      <div className="grid-split">
        {/* Add Version Form */}
        <div className="panel">
          <div className="panel-header">
            <h3 className="panel-title">
              <Plus size={18} color="var(--primary)" />
              <span>Upload New CV Edition</span>
            </h3>
          </div>

          <form className="form" onSubmit={handleAdd}>
            {error && <div className="alert alert-error">{error}</div>}

            <div className="form-group">
              <label className="form-label">Resume Title *</label>
              <input
                className="form-input"
                placeholder=" "
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Version Tag / Edition *</label>
              <input
                className="form-input"
                placeholder="e.g. v2026.1 (Full Stack Focus)"
                value={formData.versionLabel}
                onChange={(e) => setFormData((prev) => ({ ...prev, versionLabel: e.target.value }))}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Upload PDF Document *</label>
              <CloudinaryUpload
                folder="resume"
                resourceType="raw"
                value={formData.url}
                onChange={(url, data) =>
                  setFormData((prev) => ({
                    ...prev,
                    url,
                    publicId: data?.publicId || prev.publicId,
                  }))
                }
                label="Drop PDF Resume or click to upload"
                helpText="PDF document up to 10MB"
              />
            </div>

            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '0.88rem' }}>
                <input
                  type="checkbox"
                  checked={formData.active}
                  onChange={(e) => setFormData((prev) => ({ ...prev, active: e.target.checked }))}
                />
                <span style={{ fontWeight: 600, color: 'var(--primary)' }}>
                  Set as Active Public Resume (Serves /api/v2/portfolio/resume)
                </span>
              </label>
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
                  <span>Save Resume Version</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Existing Versions List */}
        <div className="panel">
          <div className="panel-header">
            <h3 className="panel-title">
              <FileCheck size={18} color="var(--primary)" />
              <span>Available Versions ({items.length})</span>
            </h3>
          </div>

          {q.isLoading ? (
            <div className="loading-state">
              <div className="spinner" />
              <span>Loading resumes…</span>
            </div>
          ) : items.length === 0 ? (
            <div className="empty-state">
              <FileText size={26} />
              <p>No resume editions created yet.</p>
            </div>
          ) : (
            <div className="data-list">
              {items.map((item) => (
                <div className="data-row" key={item.id} style={{ alignItems: 'center' }}>
                  <div
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: 8,
                      background: item.active ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.1)',
                      border: `1px solid ${item.active ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.2)'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: item.active ? 'var(--primary)' : '#ef4444',
                      flexShrink: 0,
                    }}
                  >
                    <FileText size={20} />
                  </div>

                  <div className="data-row-main">
                    <div className="data-row-title" style={{ gap: 8, flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: 600 }}>{item.title}</span>
                      <span className="badge badge-purple">{item.versionLabel || 'Edition'}</span>
                      {item.active && (
                        <span className="badge badge-emerald">
                          <Star size={11} style={{ marginRight: 4 }} /> Active Public CV
                        </span>
                      )}
                    </div>
                    <div className="data-row-subtitle" style={{ fontSize: '0.76rem', color: 'var(--text-tertiary)' }}>
                      {item.createdAt ? `Uploaded on ${new Date(item.createdAt).toLocaleDateString()}` : 'Cloudinary Asset'}
                    </div>
                  </div>

                  <div className="data-row-actions">
                    {!item.active && (
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleSetActive(item)}
                        style={{ fontSize: '0.78rem' }}
                      >
                        Make Active
                      </button>
                    )}
                    <a
                      href={getImageUrl(item.url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-secondary btn-sm btn-icon"
                      title="Download PDF"
                    >
                      <Download size={14} />
                    </a>
                    <button
                      type="button"
                      className="btn btn-danger btn-sm btn-icon"
                      onClick={() => handleDelete(item.id, item.versionLabel)}
                      title="Delete resume"
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
