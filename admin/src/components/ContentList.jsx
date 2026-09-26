import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Plus, Search, Trash2 } from 'lucide-react'
import { useState } from 'react'
import CloudinaryUpload from './CloudinaryUpload'

export default function ContentList({
  title,
  subtitle = 'Manage your portfolio items',
  icon: Icon,
  queryKey,
  queryFn,
  createFn,
  deleteFn,
  formFields = [],
  displayPrimary = (item) => item.name || item.title || item.position || '',
  displaySecondary = (item) => item.category || item.company || item.institution || item.issuer || '',
  displayExtra = (item) => item.year || item.period || item.date || item.description || '',
}) {
  const qc = useQueryClient()
  const q = useQuery({ queryKey: [queryKey], queryFn })

  const [formData, setFormData] = useState({})
  const [search, setSearch] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  if (q.isLoading) {
    return (
      <div className="loading-state">
        <div className="spinner" />
        <span>Loading {title.toLowerCase()}…</span>
      </div>
    )
  }

  const items = q.data || []

  const handleFieldChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  async function handleAdd(e) {
    e.preventDefault()
    if (!createFn) return
    setBusy(true)
    setError('')

    try {
      await createFn(formData)
      setFormData({})
      await qc.invalidateQueries({ queryKey: [queryKey] })
      await qc.invalidateQueries({ queryKey: ['dashboard'] })
    } catch (err) {
      setError(err.message || `Failed to create item.`)
    } finally {
      setBusy(false)
    }
  }

  async function handleDelete(id, name) {
    if (!deleteFn) return
    if (!window.confirm(`Delete ${name ? `"${name}"` : 'this item'}?`)) return
    try {
      await deleteFn(id)
      await qc.invalidateQueries({ queryKey: [queryKey] })
      await qc.invalidateQueries({ queryKey: ['dashboard'] })
    } catch (err) {
      alert(err.message || 'Could not delete item.')
    }
  }

  const filteredItems = items.filter((item) => {
    const text = JSON.stringify(item).toLowerCase()
    return text.includes(search.toLowerCase())
  })

  return (
    <>
      <div className="page-header">
        <div className="page-header-text">
          <h1>
            {Icon && <Icon size={26} color="var(--primary)" />}
            <span>{title}</span>
          </h1>
          <p>{subtitle}</p>
        </div>
      </div>

      <div className={createFn ? 'grid-split' : ''}>
        {createFn && formFields.length > 0 && (
          <div className="panel">
            <div className="panel-header">
              <h3 className="panel-title">
                <Plus size={18} color="var(--primary)" />
                <span>Add {title.replace(/s$/, '')}</span>
              </h3>
            </div>

            <form className="form" onSubmit={handleAdd}>
              {error && <div className="alert alert-error">{error}</div>}

              {formFields.map((field) => (
                <div className="form-group" key={field.name}>
                  {field.type !== 'checkbox' && (
                    <label className="form-label">
                      {field.label} {field.required ? '*' : ''}
                    </label>
                  )}
                  {field.type === 'image-upload' ? (
                    <CloudinaryUpload
                      label={field.uploadLabel || 'Upload Image'}
                      folder={field.folder || 'documents'}
                      resourceType="image"
                      value={formData[field.name] || ''}
                      onChange={(url) => handleFieldChange(field.name, url)}
                      helpText={field.helpText || 'JPEG, PNG, WebP up to 5MB'}
                    />
                  ) : field.type === 'doc-upload' ? (
                    <CloudinaryUpload
                      label={field.uploadLabel || 'Upload Document'}
                      folder={field.folder || 'documents'}
                      resourceType="raw"
                      value={formData[field.name] || ''}
                      onChange={(url) => handleFieldChange(field.name, url)}
                      helpText={field.helpText || 'PDF document up to 10MB'}
                    />
                  ) : field.type === 'textarea' ? (
                    <textarea
                      className="form-textarea"
                      placeholder={field.placeholder || ' '}
                      value={formData[field.name] || ''}
                      onChange={(e) =>
                        handleFieldChange(field.name, e.target.value)
                      }
                      required={field.required}
                      rows={field.rows || 3}
                    />
                  ) : field.type === 'select' ? (
                    <select
                      className="form-select"
                      value={formData[field.name] || ''}
                      onChange={(e) =>
                        handleFieldChange(field.name, e.target.value)
                      }
                      required={field.required}
                    >
                      <option value="">Select option...</option>
                      {field.options?.map((opt) => (
                        <option key={opt.value || opt} value={opt.value || opt}>
                          {opt.label || opt}
                        </option>
                      ))}
                    </select>
                  ) : field.type === 'checkbox' ? (
                    <label className="form-checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={!!formData[field.name]}
                        onChange={(e) =>
                          handleFieldChange(field.name, e.target.checked)
                        }
                      />
                      <span>{field.label}</span>
                    </label>
                  ) : (
                    <input
                      className="form-input"
                      type={field.type || 'text'}
                      placeholder={field.placeholder || ' '}
                      value={formData[field.name] || ''}
                      onChange={(e) =>
                        handleFieldChange(field.name, e.target.value)
                      }
                      required={field.required}
                    />
                  )}
                </div>
              ))}

              <button type="submit" className="btn btn-primary" disabled={busy}>
                {busy ? (
                  <>
                    <div className="spinner" style={{ width: 16, height: 16 }} />
                    <span>Saving…</span>
                  </>
                ) : (
                  <>
                    <Plus size={16} />
                    <span>Save {title.replace(/s$/, '')}</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        <div className="panel">
          <div className="panel-header">
            <h3 className="panel-title">
              <span>
                All {title} ({filteredItems.length})
              </span>
            </h3>
          </div>

          <div className="toolbar" style={{ marginBottom: '16px' }}>
            <div className="search-box" style={{ maxWidth: '100%' }}>
              <Search size={16} />
              <input
                className="form-input"
                placeholder={`Search ${title.toLowerCase()}...`}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {filteredItems.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">
                {Icon ? <Icon size={24} /> : null}
              </div>
              <p>No {title.toLowerCase()} recorded yet.</p>
            </div>
          ) : (
            <div className="data-list">
              {filteredItems.map((item) => {
                const primary = displayPrimary(item)
                const secondary = displaySecondary(item)
                const extra = displayExtra(item)

                return (
                  <div className="data-row" key={item.id}>
                    <div className="data-row-main">
                      <div className="data-row-title">
                        <span>{primary}</span>
                        {secondary && (
                          <span className="badge badge-purple">{secondary}</span>
                        )}
                      </div>
                      {extra && (
                        <div className="data-row-subtitle">
                          <span>{extra}</span>
                        </div>
                      )}
                    </div>

                    {deleteFn && (
                      <div className="data-row-actions">
                        <button
                          className="btn btn-danger btn-sm btn-icon"
                          onClick={() => handleDelete(item.id, primary)}
                          title="Delete item"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
