import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Hash,
  Plus,
  Tag,
  Trash2,
} from 'lucide-react'
import { useState } from 'react'
import { adminApi } from '../api'

export default function TagsManager() {
  const qc = useQueryClient()
  const q = useQuery({
    queryKey: ['tags'],
    queryFn: adminApi.tags,
  })

  const [formData, setFormData] = useState({ name: '', slug: '' })
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const items = q.data || []

  const handleNameChange = (val) => {
    const slug = val
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
    setFormData({ name: val, slug })
  }

  async function handleAdd(e) {
    e.preventDefault()
    if (!formData.name) return
    setBusy(true)
    setError('')
    try {
      await adminApi.createTag(formData)
      setFormData({ name: '', slug: '' })
      await qc.invalidateQueries({ queryKey: ['tags'] })
    } catch (err) {
      setError(err.message || 'Failed to create tag.')
    } finally {
      setBusy(false)
    }
  }

  async function handleDelete(id, name) {
    if (!window.confirm(`Delete tag "${name}"?`)) return
    try {
      await adminApi.deleteTag(id)
      await qc.invalidateQueries({ queryKey: ['tags'] })
    } catch (err) {
      alert(err.message || 'Could not delete tag.')
    }
  }

  return (
    <>
      <div className="page-header">
        <div className="page-header-text">
          <h1>
            <Tag size={26} color="var(--primary)" />
            <span>Project Tags & Categories</span>
          </h1>
          <p>
            Create standardized technology and architectural tags to assign across portfolio projects.
          </p>
        </div>
      </div>

      <div className="grid-split">
        {/* Create Tag Form */}
        <div className="panel">
          <div className="panel-header">
            <h3 className="panel-title">
              <Plus size={18} color="var(--primary)" />
              <span>Add Reusable Tag</span>
            </h3>
          </div>

          <form className="form" onSubmit={handleAdd}>
            {error && <div className="alert alert-error">{error}</div>}

            <div className="form-group">
              <label className="form-label">Tag Name *</label>
              <input
                className="form-input"
                placeholder="e.g. Spring Boot, PostgreSQL, Docker, Microservices"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Tag URL Slug *</label>
              <input
                className="form-input"
                placeholder="spring-boot"
                value={formData.slug}
                onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                required
              />
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
                  <span>Create Tag</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Existing Tags Cloud */}
        <div className="panel">
          <div className="panel-header">
            <h3 className="panel-title">
              <Hash size={18} color="var(--primary)" />
              <span>Available Tags ({items.length})</span>
            </h3>
          </div>

          {q.isLoading ? (
            <div className="loading-state">
              <div className="spinner" />
              <span>Loading tags…</span>
            </div>
          ) : items.length === 0 ? (
            <div className="empty-state">
              <Tag size={26} />
              <p>No project tags registered yet.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, padding: 12 }}>
              {items.map((tag) => (
                <div
                  key={tag.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '6px 12px',
                    borderRadius: 20,
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-light)',
                    fontSize: '0.86rem',
                    fontWeight: 500,
                  }}
                >
                  <Hash size={13} color="var(--primary)" />
                  <span>{tag.name}</span>
                  <button
                    type="button"
                    onClick={() => handleDelete(tag.id, tag.name)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-tertiary)',
                      cursor: 'pointer',
                      padding: 0,
                      display: 'flex',
                      alignItems: 'center',
                    }}
                    title="Delete tag"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
